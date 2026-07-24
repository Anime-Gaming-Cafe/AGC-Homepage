import "server-only";
import {
  Client,
  GatewayIntentBits,
  GuildScheduledEventStatus,
  Options,
  type Guild,
  type GuildMember,
  type PartialGuildMember,
} from "discord.js";
import { getAgcGlobal, getGuild } from "@/lib/discord/client";
import {
  formatBerlin,
  type EventView,
  type GuildView,
  type SiteCache,
  type TeamMemberView,
} from "@/lib/discord/views";
import {
  getPageDescription,
  getPageInformation,
  getPartners,
  getTeamProfiles,
  getTodayJoins,
  getTodayMessages,
  getTotalMessages,
} from "@/lib/db";
import { resolvePartnerLogos } from "@/lib/discord/partners";
import { getEnv, validateConfig } from "@/lib/config";
import { FALLBACK_BANNER_URL, STAFF_ROLE_ID } from "@/lib/constants";

const REFRESH_INTERVAL_MS = 7 * 60_000;

function cdnExtension(hash: string | null | undefined): "png" | "gif" {
  return hash?.startsWith("a_") ? "gif" : "png";
}

function createEmptyCache(): SiteCache {
  return {
    ready: false,
    lastRefresh: 0,
    db: {
      pageDescription: "Loading... please reload",
      pageInformation: "Loading... please reload",
      totalMessages: "0",
      todayMessages: "0",
      todayJoins: "0",
    },
    events: [],
    hasUpcomingEvent: false,
    team: [],
    botCount: 0,
    profiles: new Map(),
    partners: [],
  };
}

export async function startDiscord(): Promise<void> {
  const g = getAgcGlobal();
  if (g.client || g.starting) return;
  g.starting = true;
  validateConfig();
  g.cache = g.cache ?? createEmptyCache();

  const client = new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMembers,
      GatewayIntentBits.GuildVoiceStates,
      GatewayIntentBits.GuildScheduledEvents,
    ],
    makeCache: Options.cacheWithLimits({
      ...Options.DefaultMakeCacheSettings,
      GuildMemberManager: {
        maxSize: 0,
        keepOverLimit: (member) => member.roles.cache.has(STAFF_ROLE_ID),
      },
    }),
  });
  g.client = client;

  client.once("clientReady", async () => {
    console.log(`[discord] Logged in as ${client.user?.tag}`);
    await refresh({ fullTeamSync: true });
    if (!g.interval) {
      g.interval = setInterval(() => void refresh(), REFRESH_INTERVAL_MS);
    }
  });

  client.on("shardReady", () => {
    if (!g.cache?.ready) return;
    void refreshTeam({ fullSync: true })
      .then(() => refreshTeamProfiles())
      .catch((error) =>
        console.error("[discord] Staff resync after reconnect failed:", error)
      );
  });

  client.on("guildMemberUpdate", (oldMember, newMember) => {
    const hadRole = oldMember.roles.cache.has(STAFF_ROLE_ID);
    const hasRole = newMember.roles.cache.has(STAFF_ROLE_ID);
    if (hadRole !== hasRole) {
      void refreshTeam()
        .then(() => refreshTeamProfiles())
        .catch((error) =>
          console.error("[discord] Team refresh failed:", error)
        );
    }
  });

  client.on(
    "guildMemberRemove",
    (member: GuildMember | PartialGuildMember) => {
      const cache = g.cache;
      if (!cache) return;
      cache.team = cache.team.filter((m) => m.id !== member.id);
    }
  );

  client.on("error", (error) => console.error("[discord] Client error:", error));

  try {
    await client.login(getEnv("DISCORD_TOKEN"));
  } catch (error) {
    console.error("[discord] Login failed:", error);
    g.client = undefined;
    g.starting = false;
    throw error;
  }
  g.starting = false;
}

function convertEventStatus(
  status: GuildScheduledEventStatus | null
): EventView["status"] {
  switch (status) {
    case GuildScheduledEventStatus.Scheduled:
      return "Geplant";
    case GuildScheduledEventStatus.Active:
      return "Gestartet";
    default:
      return "Unbekannt";
  }
}

function buildTopRoleName(member: GuildMember): string {
  const roles = member.roles.cache.filter((role) => role.id !== member.guild.id);
  const top = roles.sort((a, b) => b.position - a.position).first();
  return (top?.name ?? "No Role").replaceAll("๑", "");
}

function buildTeamList(guild: Guild): GuildMember[] {
  const role = guild.roles.cache.get(STAFF_ROLE_ID);
  if (!role) return [];
  return [...guild.members.cache.values()]
    .filter((member) => member.roles.cache.has(STAFF_ROLE_ID))
    .sort((a, b) => {
      const posA = Math.max(...a.roles.cache.map((r) => r.position));
      const posB = Math.max(...b.roles.cache.map((r) => r.position));
      if (posA !== posB) return posB - posA;
      return a.user.username.localeCompare(b.user.username);
    });
}

async function buildTeamMemberView(
  member: GuildMember,
): Promise<TeamMemberView> {
  let bannerUrl: string | null = null;
  try {
    const user = await member.client.users.fetch(member.id, {
      force: true,
    });
    bannerUrl =
      user.bannerURL({
        size: 4096,
        extension: cdnExtension(user.banner),
      }) ?? null;
  } catch (error) {
    console.error(`[discord] Banner fetch failed for ${member.id}:`, error);
  }
  return {
    id: member.id,
    username: member.user.username,
    nickname: member.nickname ?? member.displayName ?? member.user.username,
    topRole: buildTopRoleName(member),
    avatarUrl: member.displayAvatarURL({
      size: 1024,
      extension: cdnExtension(member.avatar ?? member.user.avatar),
    }),
    bannerUrl: bannerUrl ?? FALLBACK_BANNER_URL,
  };
}

async function refreshTeam(options: { fullSync?: boolean } = {}): Promise<void> {
  const g = getAgcGlobal();
  const guild = getGuild();
  const cache = g.cache;
  if (!guild || !cache || g.refreshInFlight) return;
  g.refreshInFlight = true;
  try {
    if (options.fullSync) {
      const allMembers = await guild.members.fetch();
      cache.botCount = allMembers.filter((member) => member.user.bot).size;
    }
    const members = buildTeamList(guild);
    const team: TeamMemberView[] = [];
    for (const member of members) {
      team.push(await buildTeamMemberView(member));
    }
    cache.team = team;
  } finally {
    g.refreshInFlight = false;
  }
}

export async function refreshTeamProfiles(): Promise<void> {
  const cache = getAgcGlobal().cache;
  if (!cache) return;
  cache.profiles = await getTeamProfiles(cache.team.map((member) => member.id));
}

export async function refreshPartners(): Promise<void> {
  const cache = getAgcGlobal().cache;
  if (!cache) return;
  cache.partners = await resolvePartnerLogos(await getPartners());
}

export async function getTeamMemberView(
  discordId: string,
): Promise<TeamMemberView | null> {
  const cached = getAgcGlobal().cache?.team.find((m) => m.id === discordId);
  if (cached) return cached;

  const guild = getGuild();
  if (!guild) return null;
  try {
    const member =
      guild.members.cache.get(discordId) ??
      (await guild.members.fetch(discordId));
    return await buildTeamMemberView(member);
  } catch (error) {
    console.error(`[discord] Member lookup failed for ${discordId}:`, error);
    return null;
  }
}

async function refreshEvents(): Promise<void> {
  const guild = getGuild();
  const cache = getAgcGlobal().cache;
  if (!guild || !cache) return;
  const events = await guild.scheduledEvents.fetch();
  const sorted = [...events.values()].sort(
    (a, b) => (a.scheduledStartTimestamp ?? 0) - (b.scheduledStartTimestamp ?? 0)
  );
  cache.events = sorted.map((event) => ({
    name: event.name,
    coverUrl: event.coverImageURL({ size: 1024, extension: "png" }),
    status: convertEventStatus(event.status),
    startBerlin: event.scheduledStartAt
      ? formatBerlin(event.scheduledStartAt)
      : null,
    endBerlin: event.scheduledEndAt ? formatBerlin(event.scheduledEndAt) : null,
  }));
  cache.hasUpcomingEvent = sorted.some(
    (event) => (event.scheduledStartTimestamp ?? 0) > Date.now()
  );
}

export async function refreshDbTexts(): Promise<void> {
  const cache = getAgcGlobal().cache;
  if (!cache) return;
  cache.db.pageDescription =
    (await getPageDescription()) ?? cache.db.pageDescription;
  cache.db.pageInformation =
    (await getPageInformation()) ?? cache.db.pageInformation;
  cache.db.totalMessages = (await getTotalMessages()) ?? "0";
  cache.db.todayMessages = (await getTodayMessages()) ?? "0";
  cache.db.todayJoins = (await getTodayJoins()) ?? "0";
}

async function refresh(options: { fullTeamSync?: boolean } = {}): Promise<void> {
  const g = getAgcGlobal();
  const cache = g.cache;
  if (!cache) return;

  try {
    await refreshDbTexts();
  } catch (error) {
    console.error("[refresh] DB texts failed:", error);
  }
  try {
    await refreshTeam({ fullSync: options.fullTeamSync });
    await refreshTeamProfiles();
  } catch (error) {
    console.error("[refresh] Team failed:", error);
  }
  try {
    await refreshEvents();
  } catch (error) {
    console.error("[refresh] Events failed:", error);
  }
  try {
    await refreshPartners();
  } catch (error) {
    console.error("[refresh] Partners failed:", error);
  }

  cache.ready = true;
  cache.lastRefresh = Date.now();
}

export interface Snapshot {
  guild: GuildView | null;
  cache: SiteCache;
}

export function getSnapshot(): Snapshot {
  const g = getAgcGlobal();
  const cache = g.cache ?? createEmptyCache();
  const guild = getGuild();
  if (!guild) return { guild: null, cache };

  const ageDays = Math.floor(
    (Date.now() - guild.createdTimestamp) / 86_400_000
  );

  return {
    guild: {
      iconUrl:
        guild.iconURL({ size: 1024, extension: cdnExtension(guild.icon) }) ??
        "",
      bannerUrl:
        guild.bannerURL({
          size: 2048,
          extension: cdnExtension(guild.banner),
        }) ?? "",
      vanityCode: guild.vanityURLCode ?? "",
      memberCount: guild.memberCount,
      botCount: cache.botCount,
      boostCount: guild.premiumSubscriptionCount ?? 0,
      serverAge: `${ageDays} Tage`,
      voiceUsers: guild.voiceStates.cache.filter((vs) => vs.channelId !== null)
        .size,
    },
    cache,
  };
}

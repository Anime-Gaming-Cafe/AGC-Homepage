import "server-only";
import {
  Client,
  GatewayIntentBits,
  GuildScheduledEventStatus,
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
  getTodayJoins,
  getTodayMessages,
  getTotalMessages,
} from "@/lib/db";
import { getEnv, validateConfig } from "@/lib/config";
import { FALLBACK_BANNER_URL, STAFF_ROLE_ID } from "@/lib/constants";

const REFRESH_INTERVAL_MS = 30 * 60_000;

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
  });
  g.client = client;

  client.once("clientReady", async () => {
    console.log(`[discord] Logged in as ${client.user?.tag}`);
    try {
      const guild = getGuild();
      if (guild) await guild.members.fetch();
    } catch (error) {
      console.error("[discord] Initial member fetch failed:", error);
    }
    await refresh();
    if (!g.interval) {
      g.interval = setInterval(() => void refresh(), REFRESH_INTERVAL_MS);
    }
  });

  client.on("guildMemberUpdate", (oldMember, newMember) => {
    const hadRole = oldMember.roles.cache.has(STAFF_ROLE_ID);
    const hasRole = newMember.roles.cache.has(STAFF_ROLE_ID);
    if (hadRole !== hasRole) void refreshTeam();
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

async function refreshTeam(): Promise<void> {
  const g = getAgcGlobal();
  const guild = getGuild();
  const cache = g.cache;
  if (!guild || !cache || g.refreshInFlight) return;
  g.refreshInFlight = true;
  try {
    const members = buildTeamList(guild);
    const team: TeamMemberView[] = [];
    for (const member of members) {
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
      team.push({
        id: member.id,
        username: member.user.username,
        nickname: member.nickname ?? member.displayName ?? member.user.username,
        topRole: buildTopRoleName(member),
        avatarUrl: member.displayAvatarURL({
          size: 1024,
          extension: cdnExtension(member.avatar ?? member.user.avatar),
        }),
        bannerUrl: bannerUrl ?? FALLBACK_BANNER_URL,
      });
    }
    cache.team = team;
  } finally {
    g.refreshInFlight = false;
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

async function refreshDbTexts(): Promise<void> {
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

async function refresh(): Promise<void> {
  const g = getAgcGlobal();
  const cache = g.cache;
  if (!cache) return;

  try {
    await refreshDbTexts();
  } catch (error) {
    console.error("[refresh] DB texts failed:", error);
  }
  try {
    await refreshTeam();
  } catch (error) {
    console.error("[refresh] Team failed:", error);
  }
  try {
    await refreshEvents();
  } catch (error) {
    console.error("[refresh] Events failed:", error);
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
      botCount: guild.members.cache.filter((m) => m.user.bot).size,
      boostCount: guild.premiumSubscriptionCount ?? 0,
      serverAge: `${ageDays} Tage`,
      voiceUsers: guild.voiceStates.cache.filter((vs) => vs.channelId !== null)
        .size,
    },
    cache,
  };
}

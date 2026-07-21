import "server-only";
import type { TeamProfile } from "@/lib/db";

export interface GuildView {
  iconUrl: string;
  bannerUrl: string;
  vanityCode: string;
  memberCount: number;
  botCount: number;
  boostCount: number;
  serverAge: string;
  voiceUsers: number;
}

export interface EventView {
  name: string;
  coverUrl: string | null;
  status: "Geplant" | "Gestartet" | "Unbekannt";
  startBerlin: string | null;
  endBerlin: string | null;
}

export interface TeamMemberView {
  id: string;
  username: string;
  nickname: string;
  topRole: string;
  avatarUrl: string;
  bannerUrl: string;
}

export interface PartnerView {
  name: string;
  url: string;
  logoUrl: string;
  tagline: string;
  description: string;
  discordInviteCode: string | null;
}

export interface SiteCache {
  ready: boolean;
  lastRefresh: number;
  db: {
    pageDescription: string;
    pageInformation: string;
    totalMessages: string;
    todayMessages: string;
    todayJoins: string;
  };
  events: EventView[];
  hasUpcomingEvent: boolean;
  team: TeamMemberView[];
  profiles: Map<string, TeamProfile>;
  partners: PartnerView[];
}

const berlinFormat = new Intl.DateTimeFormat("de-DE", {
  timeZone: "Europe/Berlin",
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
});

export function formatBerlin(date: Date): string {
  const parts: Record<string, string> = {};
  for (const part of berlinFormat.formatToParts(date)) {
    parts[part.type] = part.value;
  }
  return `${parts.day}.${parts.month}.${parts.year} ${parts.hour}:${parts.minute}`;
}

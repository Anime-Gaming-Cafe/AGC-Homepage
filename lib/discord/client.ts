import "server-only";
import type { Client, Guild } from "discord.js";
import type { SiteCache } from "@/lib/discord/views";
import { GUILD_ID } from "@/lib/constants";

export interface AgcGlobal {
  client?: Client;
  cache?: SiteCache;
  interval?: NodeJS.Timeout;
  starting?: boolean;
  refreshInFlight?: boolean;
}

export function getAgcGlobal(): AgcGlobal {
  const g = globalThis as unknown as { __agc?: AgcGlobal };
  if (!g.__agc) g.__agc = {};
  return g.__agc;
}

export function getGuild(): Guild | null {
  const client = getAgcGlobal().client;
  if (!client || !client.isReady()) return null;
  return client.guilds.cache.get(GUILD_ID) ?? null;
}

import "server-only";
import { PermissionFlagsBits } from "discord.js";
import { getGuild } from "@/lib/discord/client";
import { STAFF_ROLE_ID } from "@/lib/constants";

async function fetchMember(discordId: string) {
  const guild = getGuild();
  if (!guild) return null;
  const cached = guild.members.cache.get(discordId);
  if (cached) return cached;
  try {
    return await guild.members.fetch(discordId);
  } catch {
    return null;
  }
}

export async function isStaff(discordId: string): Promise<boolean> {
  const member = await fetchMember(discordId);
  return member?.roles.cache.has(STAFF_ROLE_ID) ?? false;
}

export async function isGuildAdmin(discordId: string): Promise<boolean> {
  const guild = getGuild();
  if (!guild) return false;
  if (guild.ownerId === discordId) return true;
  const member = await fetchMember(discordId);
  return member?.permissions.has(PermissionFlagsBits.Administrator) ?? false;
}

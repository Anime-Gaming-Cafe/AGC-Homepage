import "server-only";
import { getGuild } from "@/lib/discord/client";
import { STAFF_ROLE_ID } from "@/lib/constants";

export async function isStaff(discordId: string): Promise<boolean> {
  const guild = getGuild();
  if (!guild) return false;
  let member = guild.members.cache.get(discordId) ?? null;
  if (!member) {
    try {
      member = await guild.members.fetch(discordId);
    } catch {
      return false;
    }
  }
  return member.roles.cache.has(STAFF_ROLE_ID);
}

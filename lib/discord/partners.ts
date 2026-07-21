import "server-only";
import type { PartnerRecord } from "@/lib/db";
import type { PartnerView } from "@/lib/discord/views";

interface CachedLogo {
  url: string;
  fetchedAt: number;
}

const LOGO_TTL_MS = 30 * 60_000;
const logoCache = new Map<string, CachedLogo>();

async function resolveInviteLogo(inviteCode: string): Promise<string | null> {
  const cached = logoCache.get(inviteCode);
  if (cached && Date.now() - cached.fetchedAt < LOGO_TTL_MS) {
    return cached.url;
  }

  try {
    const response = await fetch(
      `https://discord.com/api/v9/invites/${inviteCode}`,
      { headers: { "User-Agent": "AGC-Homepage/1.0" } }
    );
    if (!response.ok) return cached?.url ?? null;

    const data = (await response.json()) as {
      guild?: { id?: string; icon?: string | null };
    };
    const guildId = data.guild?.id;
    const iconHash = data.guild?.icon;
    if (!guildId || !iconHash) return cached?.url ?? null;

    const ext = iconHash.startsWith("a_") ? "gif" : "png";
    const url = `https://cdn.discordapp.com/icons/${guildId}/${iconHash}.${ext}`;
    logoCache.set(inviteCode, { url, fetchedAt: Date.now() });
    return url;
  } catch (error) {
    console.error(`[partners] Invite logo fetch failed for ${inviteCode}:`, error);
    return cached?.url ?? null;
  }
}

export async function resolvePartnerLogos(
  partners: PartnerRecord[]
): Promise<PartnerView[]> {
  return Promise.all(
    partners.map(async (partner) => {
      if (partner.discordInviteCode) {
        const resolved = await resolveInviteLogo(partner.discordInviteCode);
        if (resolved) return { ...partner, logoUrl: resolved };
      }
      return partner;
    })
  );
}

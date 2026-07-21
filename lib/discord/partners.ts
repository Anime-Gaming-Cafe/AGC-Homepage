import "server-only";
import type { PartnerView } from "@/lib/discord/views";

export function getDefaultPartners(): PartnerView[] {
  return [
    {
      name: "Horizon Bot",
      url: "https://horizon-bot.me",
      logoUrl: "https://horizon-bot.me/logo.png",
      tagline: "Temporäre Voice-Kanäle für Discord.",
      description:
        "Gib deinen Nutzern volle Kontrolle. Stell dir einen Sprachkanal vor, der nur existiert, wenn ihn jemand wirklich braucht.",
    },
    {
      name: "ALG Discord",
      url: "https://alg-discord.de/",
      logoUrl: "https://alg-discord.de/static/media/logo.png",
      tagline: "Die größte deutschsprachige Apex Legends Community.",
      description:
        "Trete der größten deutschsprachigen Apex Legends Community bei und bleib immer up-to-date!",
    },
    {
      name: "VALORANT DE",
      url: "https://discord.com/invite/valode",
      logoUrl: "",
      tagline: "PROJECT V - Die deutsche VALORANT Community.",
      description: "Der Treffpunkt für alle deutschen VALORANT-Spieler.",
      discordInviteCode: "valode",
    },
  ];
}

export async function resolvePartnerLogos(
  partners: PartnerView[]
): Promise<void> {
  for (const partner of partners) {
    if (!partner.discordInviteCode) continue;
    const response = await fetch(
      `https://discord.com/api/v9/invites/${partner.discordInviteCode}`,
      { headers: { "User-Agent": "AGC-Homepage/1.0" } }
    );
    if (!response.ok) continue;
    const data = (await response.json()) as {
      guild?: { id?: string; icon?: string | null };
    };
    const guildId = data.guild?.id;
    const iconHash = data.guild?.icon;
    if (guildId && iconHash) {
      const ext = iconHash.startsWith("a_") ? "gif" : "png";
      partner.logoUrl = `https://cdn.discordapp.com/icons/${guildId}/${iconHash}.${ext}`;
    }
  }
}

import { SectionHeading } from "@/components/sections/SectionHeading";
import { StatTile } from "@/components/sections/StatTile";
import type { GuildView } from "@/lib/discord/views";

interface StatsSectionProps {
  guild: GuildView;
  totalMessages: string;
  todayMessages: string;
  todayJoins: string;
}

export function StatsSection({
  guild,
  totalMessages,
  todayMessages,
  todayJoins,
}: StatsSectionProps) {
  return (
    <section id="stats" style={{ paddingTop: "100px", paddingBottom: "100px" }}>
      <div className="container py-5">
        <SectionHeading title="Statistiken" />
        <div className="row py-5 p-lg-5">
          <StatTile
            icon="fas fa-users"
            value={String(guild.memberCount)}
            label="Mitglieder"
          />
          <StatTile
            icon="fas fa-robot"
            value={String(guild.botCount)}
            label="Bots"
          />
          <StatTile
            icon="fas fa-coffee"
            value={String(guild.boostCount)}
            label="Server Boosts"
          />
          <StatTile
            icon="far fa-clock"
            value={guild.serverAge}
            label="Server Alter"
          />
          <StatTile
            icon="fas fa-envelope-open"
            value={totalMessages}
            label="Gesamte Nachrichten"
          />
          <StatTile
            icon="fas fa-volume-up"
            value={String(guild.voiceUsers)}
            label="Aktuelle Voice Nutzer"
          />
          <StatTile
            icon="fas fa-volume-down"
            value={todayMessages}
            label="Heutige Nachrichten"
          />
          <StatTile
            icon="fas fa-user-plus"
            value={todayJoins}
            label="Heutiger Zuwachs"
            extraColClass="col-lg-3 "
          />
        </div>
      </div>
    </section>
  );
}

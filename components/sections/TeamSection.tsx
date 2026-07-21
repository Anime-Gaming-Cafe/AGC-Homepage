import { SectionHeading } from "@/components/sections/SectionHeading";
import { TeamFlipCard } from "@/components/sections/TeamFlipCard";
import type { TeamMemberView } from "@/lib/discord/views";
import type { TeamProfile } from "@/lib/db";

interface TeamSectionProps {
  team: TeamMemberView[];
  profiles: Map<string, TeamProfile>;
}

export function TeamSection({ team, profiles }: TeamSectionProps) {
  return (
    <section id="team" style={{ paddingTop: "100px", paddingBottom: "100px" }}>
      <div
        className="container"
        style={{ paddingBottom: "100px", paddingTop: "100px" }}
      >
        <SectionHeading title="Das Team" />
        <div className="row py-5 p-lg-5">
          <div className="col-lg-12">
            <div className="row">
              {team.map((member) => (
                <TeamFlipCard
                  key={member.id}
                  member={member}
                  frontDesc={profiles.get(member.id)?.frontDesc ?? null}
                  backDesc={profiles.get(member.id)?.backDesc ?? null}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

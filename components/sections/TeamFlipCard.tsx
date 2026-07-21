import Image from "next/image";
import { ProfileLinkIcon } from "@/components/sections/ProfileLinkIcon";
import type { TeamMemberView } from "@/lib/discord/views";

interface TeamFlipCardProps {
  member: TeamMemberView;
  frontDesc: string | null;
  backDesc: string | null;
  className?: string;
}

export function TeamFlipCard({
  member,
  frontDesc,
  backDesc,
  className = "col-sm-6 col-md-4",
}: TeamFlipCardProps) {
  const profileUrl = `https://discord.com/users/${member.id}`;
  const subtitleStyle = {
    fontFamily: "'Whitney Book Italic'",
    fontSize: "18px",
  } as const;

  return (
    <div className={className}>
      <div className="card-container-imagia">
        <div className="card-imagia">
          <div className="front-imagia front-imagia1">
            <div className="cover-imagia">
              <Image
                alt=""
                src={member.bannerUrl}
                width={1000}
                height={400}
                sizes="(max-width: 768px) 100vw, 400px"
                loading="lazy"
              />
            </div>
            <div className="user-imagia">
              <Image
                className="rounded-circle img-circle"
                alt={`Avatar von ${member.nickname}`}
                src={member.avatarUrl}
                width={128}
                height={128}
                loading="lazy"
              />
            </div>
            <div className="content-imagia">
              <h3 className="name-imagia">{member.nickname}</h3>
              <p className="subtitle-imagia text-muted" style={subtitleStyle}>
                {member.topRole}
              </p>
              <p className="text-break text-center">{frontDesc}</p>
            </div>
            <div className="footer-imagia">
              <a
                href={profileUrl}
                target="_blank"
                rel="noopener"
                aria-label={`Discord Profil von ${member.nickname}`}
              >
                <span>
                  <ProfileLinkIcon />
                  &nbsp;Profil Link
                </span>
              </a>
            </div>
          </div>
          <div className="back-imagia front-imagia">
            <div className="content-imagia" style={{ height: "100%" }}>
              <h3 className="name-imagia" style={{ marginTop: "10px" }}>
                @{member.username}
              </h3>
              <p className="subtitle-imagia text-muted" style={subtitleStyle}>
                {member.topRole}
              </p>
              <div style={{ display: "table", width: "100%", height: "85%" }}>
                <p
                  className="text-break text-center"
                  style={{ display: "table-cell", verticalAlign: "middle" }}
                >
                  {backDesc}
                </p>
              </div>
            </div>
            <div className="footer-imagia">
              <a
                href={profileUrl}
                target="_blank"
                rel="noopener"
                aria-label={`Discord Profil von ${member.nickname}`}
              >
                <span>
                  <ProfileLinkIcon />
                  &nbsp;Profil Link
                </span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

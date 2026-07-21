import type { Metadata } from "next";
import type { CSSProperties, ReactNode } from "react";
import { auth, signIn, signOut } from "@/auth";
import { isStaff } from "@/lib/auth-helpers";
import { getTeamProfile } from "@/lib/db";
import { ProfileForm } from "@/app/team/edit/ProfileForm";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Anime & Gaming Café - Teamprofil",
  robots: { index: false, follow: false },
};

const cardStyle: CSSProperties = {
  maxWidth: "600px",
  margin: "15vh auto 0",
  padding: "40px",
  borderRadius: "16px",
};

const buttonStyle: CSSProperties = {
  lineHeight: "24px",
  fontSize: "18px",
  borderRadius: "16px",
};

function Card({ children }: { children: ReactNode }) {
  return (
    <div className="container">
      <div className="glas text-center text-white" style={cardStyle}>
        <h1 style={{ fontFamily: "Wandertucker", fontSize: "48px" }}>
          Teamprofil
        </h1>
        <hr />
        {children}
      </div>
    </div>
  );
}

export default async function TeamEditPage() {
  const session = await auth();
  const discordId = session?.user?.discordId;

  if (!discordId) {
    return (
      <Card>
        <p className="text-muted">
          Melde dich mit deinem Discord-Account an, um dein Teamprofil zu
          bearbeiten.
        </p>
        <form
          action={async () => {
            "use server";
            await signIn("discord", { redirectTo: "/team/edit" });
          }}
        >
          <button
            className="btn btn-primary shadow button-animation glas"
            type="submit"
            style={buttonStyle}
          >
            Mit Discord anmelden
          </button>
        </form>
      </Card>
    );
  }

  if (!(await isStaff(discordId))) {
    return (
      <Card>
        <p className="text-muted">
          Kein Zugriff. Diese Seite ist nur für Teammitglieder.
        </p>
        <form
          action={async () => {
            "use server";
            await signOut({ redirectTo: "/" });
          }}
        >
          <button
            className="btn btn-primary shadow button-animation glas"
            type="submit"
            style={buttonStyle}
          >
            Abmelden
          </button>
        </form>
      </Card>
    );
  }

  let frontDesc = "";
  let backDesc = "";
  try {
    const profile = await getTeamProfile(discordId);
    frontDesc = profile?.frontDesc ?? "";
    backDesc = profile?.backDesc ?? "";
  } catch (error) {
    console.error("[team/edit] Profile query failed:", error);
  }

  return (
    <Card>
      <p className="text-muted">
        Diese Texte erscheinen auf deiner Teamkarte auf der Startseite
        (Vorderseite und Rückseite der Karte).
      </p>
      <ProfileForm initialFrontDesc={frontDesc} initialBackDesc={backDesc} />
      <form
        action={async () => {
          "use server";
          await signOut({ redirectTo: "/" });
        }}
      >
        <button
          className="btn btn-link text-muted"
          type="submit"
          style={{ marginTop: "20px" }}
        >
          Abmelden
        </button>
      </form>
    </Card>
  );
}

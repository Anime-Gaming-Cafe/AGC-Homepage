import type { Metadata } from "next";
import type { CSSProperties, ReactNode } from "react";
import Link from "next/link";
import { auth, signIn, signOut } from "@/auth";
import { isGuildAdmin } from "@/lib/auth-helpers";
import { getPageDescription, getPageInformation, getPartners } from "@/lib/db";
import type { PartnerRecord } from "@/lib/db";
import { SiteTextsForm } from "@/app/admin/SiteTextsForm";
import { PartnersAdmin } from "@/app/admin/PartnersAdmin";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Anime & Gaming Café - Admin",
  robots: { index: false, follow: false },
};

const cardStyle: CSSProperties = {
  maxWidth: "800px",
  margin: "10vh auto 5vh",
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
      <div className="glas text-white" style={cardStyle}>
        <h1
          className="text-center"
          style={{ fontFamily: "Wandertucker", fontSize: "48px" }}
        >
          Admin
        </h1>
        <hr />
        {children}
      </div>
    </div>
  );
}

export default async function AdminPage() {
  const session = await auth();
  const discordId = session?.user?.discordId;

  if (!discordId) {
    return (
      <Card>
        <p className="text-muted text-center">
          Melde dich mit deinem Discord-Account an.
        </p>
        <form
          action={async () => {
            "use server";
            await signIn("discord", { redirectTo: "/admin" });
          }}
          className="text-center"
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

  if (!(await isGuildAdmin(discordId))) {
    return (
      <Card>
        <p className="text-muted text-center">
          Kein Zugriff. Diese Seite ist nur für den Server-Owner und
          Administratoren.
        </p>
        <form
          action={async () => {
            "use server";
            await signOut({ redirectTo: "/" });
          }}
          className="text-center"
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

  let description = "";
  let information = "";
  let partners: PartnerRecord[] = [];
  try {
    description = (await getPageDescription()) ?? "";
    information = (await getPageInformation()) ?? "";
    partners = await getPartners();
  } catch (error) {
    console.error("[admin] Load failed:", error);
  }

  return (
    <Card>
      <h2 style={{ fontFamily: "Wandertucker", fontSize: "32px" }}>
        Seiteninhalte
      </h2>
      <SiteTextsForm
        initialDescription={description}
        initialInformation={information}
      />
      <hr style={{ margin: "40px 0" }} />
      <h2 style={{ fontFamily: "Wandertucker", fontSize: "32px" }}>Partner</h2>
      <PartnersAdmin partners={partners} />
      <hr style={{ margin: "40px 0" }} />
      <div className="text-center">
        <Link
          className="btn btn-primary shadow button-animation glas"
          href="/admin/profile-log"
          style={buttonStyle}
        >
          Profil-Log ansehen
        </Link>
      </div>
      <form
        action={async () => {
          "use server";
          await signOut({ redirectTo: "/" });
        }}
        className="text-center"
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

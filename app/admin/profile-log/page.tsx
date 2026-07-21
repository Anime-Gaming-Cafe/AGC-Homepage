import type { Metadata } from "next";
import type { CSSProperties, ReactNode } from "react";
import Link from "next/link";
import { auth, signIn } from "@/auth";
import { isGuildAdmin } from "@/lib/auth-helpers";
import { getProfileEdits, type ProfileEditRecord } from "@/lib/db";
import { getGuild } from "@/lib/discord/client";
import { formatBerlin } from "@/lib/discord/views";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Anime & Gaming Café - Profil-Log",
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

const entryStyle: CSSProperties = {
  padding: "18px 0",
  borderTop: "1px solid rgba(255,255,255,0.12)",
};

const valueStyle: CSSProperties = {
  fontSize: "14px",
  lineHeight: 1.6,
  wordBreak: "break-word",
};

function Card({ children }: { children: ReactNode }) {
  return (
    <div className="container">
      <div className="glas text-white" style={cardStyle}>
        <h1
          className="text-center"
          style={{ fontFamily: "Wandertucker", fontSize: "48px" }}
        >
          Profil-Log
        </h1>
        <hr />
        {children}
      </div>
    </div>
  );
}

function resolveName(userId: string): string {
  const guild = getGuild();
  const member = guild?.members.cache.get(userId);
  return member?.nickname ?? member?.user.username ?? userId;
}

function FieldChange({
  label,
  before,
  after,
}: {
  label: string;
  before: string | null;
  after: string | null;
}) {
  if ((before ?? "") === (after ?? "")) return null;

  return (
    <div style={{ marginTop: "10px" }}>
      <div
        className="text-muted"
        style={{ fontSize: "12px", textTransform: "uppercase" }}
      >
        {label}
      </div>
      <div className="text-muted" style={valueStyle}>
        <s>{before?.trim() ? before : "(leer)"}</s>
      </div>
      <div style={valueStyle}>{after?.trim() ? after : "(leer)"}</div>
    </div>
  );
}

function Entry({ edit }: { edit: ProfileEditRecord }) {
  return (
    <div style={entryStyle}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: "12px",
          flexWrap: "wrap",
        }}
      >
        <strong style={{ fontSize: "16px" }}>{resolveName(edit.userId)}</strong>
        <span className="text-muted" style={{ fontSize: "13px" }}>
          {formatBerlin(edit.editedAt)}
        </span>
      </div>
      <div className="text-muted" style={{ fontSize: "12px" }}>
        {edit.userId}
      </div>
      <FieldChange
        label="Vorderseite"
        before={edit.frontBefore}
        after={edit.frontAfter}
      />
      <FieldChange
        label="Rückseite"
        before={edit.backBefore}
        after={edit.backAfter}
      />
    </div>
  );
}

export default async function ProfileLogPage() {
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
            await signIn("discord", { redirectTo: "/admin/profile-log" });
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
      </Card>
    );
  }

  let edits: ProfileEditRecord[] = [];
  let failed = false;
  try {
    edits = await getProfileEdits();
  } catch (error) {
    console.error("[profile-log] Load failed:", error);
    failed = true;
  }

  return (
    <Card>
      {failed ? (
        <p className="text-muted text-center">
          Der Log konnte nicht geladen werden.
        </p>
      ) : edits.length === 0 ? (
        <p className="text-muted text-center">
          Noch keine Profil-Änderungen aufgezeichnet.
        </p>
      ) : (
        edits.map((edit) => <Entry key={edit.id} edit={edit} />)
      )}
      <div className="text-center" style={{ marginTop: "30px" }}>
        <Link className="btn btn-link text-muted" href="/admin">
          Zurück zum Admin
        </Link>
      </div>
    </Card>
  );
}

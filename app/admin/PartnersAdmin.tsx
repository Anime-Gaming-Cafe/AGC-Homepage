"use client";

import { useActionState, useState } from "react";
import {
  deletePartnerAction,
  movePartnerAction,
  savePartner,
  type ActionState,
} from "@/app/admin/actions";
import {
  PARTNER_DESCRIPTION_MAX,
  PARTNER_NAME_MAX,
  PARTNER_TAGLINE_MAX,
  PARTNER_URL_MAX,
} from "@/lib/constants";
import type { PartnerRecord } from "@/lib/db";

const initialState: ActionState = { ok: false, message: "" };

function PartnerForm({ partner }: { partner?: PartnerRecord }) {
  const [state, formAction, pending] = useActionState(
    savePartner,
    initialState
  );
  const [name, setName] = useState(partner?.name ?? "");
  const [url, setUrl] = useState(partner?.url ?? "");
  const [logoUrl, setLogoUrl] = useState(partner?.logoUrl ?? "");
  const [tagline, setTagline] = useState(partner?.tagline ?? "");
  const [description, setDescription] = useState(partner?.description ?? "");
  const [discordInviteCode, setDiscordInviteCode] = useState(
    partner?.discordInviteCode ?? ""
  );

  return (
    <form action={formAction}>
      {partner && <input type="hidden" name="id" value={partner.id} />}
      <div className="row g-2">
        <div className="col-md-6">
          <input
            className="form-control"
            name="name"
            placeholder="Name"
            maxLength={PARTNER_NAME_MAX}
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
        </div>
        <div className="col-md-6">
          <input
            className="form-control"
            name="url"
            placeholder="URL"
            maxLength={PARTNER_URL_MAX}
            value={url}
            onChange={(event) => setUrl(event.target.value)}
          />
        </div>
        <div className="col-md-6">
          <input
            className="form-control"
            name="logoUrl"
            placeholder="Logo-URL (leer lassen bei Discord-Invite-Autofetch)"
            maxLength={PARTNER_URL_MAX}
            value={logoUrl}
            onChange={(event) => setLogoUrl(event.target.value)}
          />
        </div>
        <div className="col-md-6">
          <input
            className="form-control"
            name="discordInviteCode"
            placeholder="Discord-Invite-Code (optional)"
            value={discordInviteCode}
            onChange={(event) => setDiscordInviteCode(event.target.value)}
          />
        </div>
        <div className="col-12">
          <input
            className="form-control"
            name="tagline"
            placeholder="Tagline"
            maxLength={PARTNER_TAGLINE_MAX}
            value={tagline}
            onChange={(event) => setTagline(event.target.value)}
          />
        </div>
        <div className="col-12">
          <textarea
            className="form-control"
            name="description"
            placeholder="Beschreibung"
            rows={2}
            maxLength={PARTNER_DESCRIPTION_MAX}
            value={description}
            onChange={(event) => setDescription(event.target.value)}
          />
        </div>
      </div>
      {state.message && (
        <p
          className={state.ok ? "text-success" : "text-danger"}
          style={{ marginTop: "8px" }}
        >
          {state.message}
        </p>
      )}
      <button
        className="btn btn-primary shadow button-animation glas"
        type="submit"
        disabled={pending}
        style={{ marginTop: "8px", fontSize: "14px", borderRadius: "12px" }}
      >
        {pending ? "Speichern..." : partner ? "Speichern" : "Hinzufügen"}
      </button>
    </form>
  );
}

export function PartnersAdmin({ partners }: { partners: PartnerRecord[] }) {
  return (
    <div>
      {partners.map((partner, index) => (
        <div
          key={partner.id}
          className="glas"
          style={{ padding: "16px", borderRadius: "12px", marginBottom: "16px" }}
        >
          <PartnerForm partner={partner} />
          <div style={{ display: "flex", gap: "8px", marginTop: "8px" }}>
            <form action={movePartnerAction.bind(null, partner.id, "up")}>
              <button
                className="btn btn-link text-muted"
                type="submit"
                disabled={index === 0}
              >
                ↑ Hoch
              </button>
            </form>
            <form action={movePartnerAction.bind(null, partner.id, "down")}>
              <button
                className="btn btn-link text-muted"
                type="submit"
                disabled={index === partners.length - 1}
              >
                ↓ Runter
              </button>
            </form>
            <form action={deletePartnerAction.bind(null, partner.id)}>
              <button className="btn btn-link text-danger" type="submit">
                Löschen
              </button>
            </form>
          </div>
        </div>
      ))}
      <h3
        className="text-white"
        style={{ fontFamily: "Wandertucker", fontSize: "24px" }}
      >
        Neuer Partner
      </h3>
      <PartnerForm />
    </div>
  );
}

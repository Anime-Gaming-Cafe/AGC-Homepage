"use client";

import { useActionState, useState } from "react";
import { saveProfile, type SaveProfileState } from "@/app/team/edit/actions";
import { CardPreview } from "@/app/team/edit/CardPreview";
import { BACK_DESC_MAX, FRONT_DESC_MAX } from "@/lib/constants";
import type { TeamMemberView } from "@/lib/discord/views";

interface ProfileFormProps {
  initialFrontDesc: string;
  initialBackDesc: string;
  member: TeamMemberView | null;
}

const initialState: SaveProfileState = { ok: false, message: "" };

export function ProfileForm({
  initialFrontDesc,
  initialBackDesc,
  member,
}: ProfileFormProps) {
  const [state, formAction, pending] = useActionState(saveProfile, initialState);
  const [frontDesc, setFrontDesc] = useState(initialFrontDesc);
  const [backDesc, setBackDesc] = useState(initialBackDesc);

  return (
    <div className="row">
      <div className="col-lg-7">
        <form action={formAction}>
          <div className="mb-4 text-start">
            <label className="form-label text-white" htmlFor="frontdesc">
              Vorderseite
            </label>
            <input
              className="form-control"
              id="frontdesc"
              name="frontdesc"
              maxLength={FRONT_DESC_MAX}
              value={frontDesc}
              onChange={(event) => setFrontDesc(event.target.value)}
            />
            <small className="text-muted">
              {frontDesc.length}/{FRONT_DESC_MAX} Zeichen
            </small>
          </div>
          <div className="mb-4 text-start">
            <label className="form-label text-white" htmlFor="backdesc">
              Rückseite
            </label>
            <textarea
              className="form-control"
              id="backdesc"
              name="backdesc"
              rows={6}
              maxLength={BACK_DESC_MAX}
              value={backDesc}
              onChange={(event) => setBackDesc(event.target.value)}
            />
            <small className="text-muted">
              {backDesc.length}/{BACK_DESC_MAX} Zeichen
            </small>
          </div>
          {state.message && (
            <p className={state.ok ? "text-success" : "text-danger"}>
              {state.message}
            </p>
          )}
          <button
            className="btn btn-primary shadow button-animation glas"
            type="submit"
            disabled={pending}
            style={{
              lineHeight: "24px",
              fontSize: "18px",
              borderRadius: "16px",
            }}
          >
            {pending ? "Speichern..." : "Speichern"}
          </button>
        </form>
      </div>
      <div className="col-lg-5 mt-4 mt-lg-0">
        <CardPreview
          member={member}
          frontDesc={frontDesc}
          backDesc={backDesc}
        />
      </div>
    </div>
  );
}

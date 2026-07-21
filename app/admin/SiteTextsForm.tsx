"use client";

import { useActionState, useState } from "react";
import { saveSiteTexts, type ActionState } from "@/app/admin/actions";
import { PAGE_DESCRIPTION_MAX, PAGE_INFORMATION_MAX } from "@/lib/constants";

interface SiteTextsFormProps {
  initialDescription: string;
  initialInformation: string;
}

const initialState: ActionState = { ok: false, message: "" };

export function SiteTextsForm({
  initialDescription,
  initialInformation,
}: SiteTextsFormProps) {
  const [state, formAction, pending] = useActionState(
    saveSiteTexts,
    initialState
  );
  const [description, setDescription] = useState(initialDescription);
  const [information, setInformation] = useState(initialInformation);

  return (
    <form action={formAction}>
      <div className="mb-4 text-start">
        <label className="form-label text-white" htmlFor="description">
          Beschreibung (Hero-Untertitel)
        </label>
        <textarea
          className="form-control"
          id="description"
          name="description"
          rows={2}
          maxLength={PAGE_DESCRIPTION_MAX}
          value={description}
          onChange={(event) => setDescription(event.target.value)}
        />
        <small className="text-muted">
          {description.length}/{PAGE_DESCRIPTION_MAX} Zeichen
        </small>
      </div>
      <div className="mb-4 text-start">
        <label className="form-label text-white" htmlFor="information">
          Informationen
        </label>
        <textarea
          className="form-control"
          id="information"
          name="information"
          rows={8}
          maxLength={PAGE_INFORMATION_MAX}
          value={information}
          onChange={(event) => setInformation(event.target.value)}
        />
        <small className="text-muted">
          {information.length}/{PAGE_INFORMATION_MAX} Zeichen
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
        style={{ lineHeight: "24px", fontSize: "18px", borderRadius: "16px" }}
      >
        {pending ? "Speichern..." : "Speichern"}
      </button>
    </form>
  );
}

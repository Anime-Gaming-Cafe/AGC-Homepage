"use client";

import { useState } from "react";
import { TeamFlipCard } from "@/components/sections/TeamFlipCard";
import type { TeamMemberView } from "@/lib/discord/views";

interface CardPreviewProps {
  member: TeamMemberView | null;
  frontDesc: string;
  backDesc: string;
}

export function CardPreview({ member, frontDesc, backDesc }: CardPreviewProps) {
  const [side, setSide] = useState<"front" | "back">("front");

  if (!member) {
    return (
      <div className="text-center">
        <label className="form-label text-white">Vorschau</label>
        <p className="text-muted">
          Deine Discord-Daten werden noch geladen. Lade die Seite in ein paar
          Sekunden neu, dann siehst du hier deine Karte. Speichern funktioniert
          trotzdem.
        </p>
      </div>
    );
  }

  return (
    <div className="text-center">
      <label className="form-label text-white">Vorschau</label>
      <div className="btn-group d-flex mb-3" role="group">
        <button
          className={`btn btn-sm ${side === "front" ? "btn-primary" : "btn-outline-secondary"}`}
          type="button"
          onClick={() => setSide("front")}
        >
          Vorderseite
        </button>
        <button
          className={`btn btn-sm ${side === "back" ? "btn-primary" : "btn-outline-secondary"}`}
          type="button"
          onClick={() => setSide("back")}
        >
          Rückseite
        </button>
      </div>
      <div
        className={
          side === "back" ? "card-preview card-preview-back" : "card-preview"
        }
      >
        <div className="row">
          <TeamFlipCard
            className="col-12"
            member={member}
            frontDesc={frontDesc}
            backDesc={backDesc}
          />
        </div>
      </div>
      <small className="text-muted">
        So sieht deine Karte auf der Startseite aus.
      </small>
    </div>
  );
}

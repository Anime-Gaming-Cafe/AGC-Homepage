import Image from "next/image";
import type { EventView } from "@/lib/discord/views";

export function EventCard({ event }: { event: EventView }) {
  return (
    <div className="row" style={{ paddingBottom: "25px" }}>
      <div className="col">
        {event.coverUrl && (
          <Image
            alt={`Titelbild zum Event ${event.name}`}
            src={event.coverUrl}
            width={1024}
            height={576}
            sizes="(max-width: 992px) 50vw, 450px"
            style={{ borderRadius: "14px", width: "100%", height: "auto" }}
          />
        )}
      </div>
      <div className="col">
        <h3>{event.name}</h3>
        {event.startBerlin && (
          <p className="text-muted">
            Status: {event.status}
            <br />
            <br />
            Start: <strong>{event.startBerlin}</strong> - Ende:{" "}
            <strong>{event.endBerlin ?? "Open End"}</strong>
          </p>
        )}
      </div>
    </div>
  );
}

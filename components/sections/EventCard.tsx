import type { EventView } from "@/lib/discord/views";

export function EventCard({ event }: { event: EventView }) {
  return (
    <div className="row" style={{ paddingBottom: "25px" }}>
      <div className="col">
        <img
          alt=""
          style={{ borderRadius: "14px", width: "100%" }}
          src={event.coverUrl ?? ""}
        />
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

import { SectionHeading } from "@/components/sections/SectionHeading";
import { EventCard } from "@/components/sections/EventCard";
import type { EventView } from "@/lib/discord/views";

interface EventsSectionProps {
  events: EventView[];
  hasUpcomingEvent: boolean;
}

export function EventsSection({ events, hasUpcomingEvent }: EventsSectionProps) {
  return (
    <section id="events" style={{ paddingBottom: "100px", paddingTop: "100px" }}>
      <div className="container py-5">
        <SectionHeading title="Events" />
        <div className="py-5 p-lg-5">
          {!hasUpcomingEvent ? (
            <div className="row" style={{ paddingBottom: "25px" }}>
              <div className="col" style={{ textAlign: "center" }}>
                <h3>Aktuell sind keine Events geplant</h3>
                <p className="text-muted">Stay tuned</p>
              </div>
            </div>
          ) : (
            events.map((event, index) => <EventCard key={index} event={event} />)
          )}
        </div>
      </div>
    </section>
  );
}

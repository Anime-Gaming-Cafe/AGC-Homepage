import { SectionHeading } from "@/components/sections/SectionHeading";
import { PartnerCard } from "@/components/sections/PartnerCard";
import type { PartnerView } from "@/lib/discord/views";

export function PartnersSection({ partners }: { partners: PartnerView[] }) {
  return (
    <section id="partners" style={{ paddingTop: "100px", paddingBottom: "100px" }}>
      <div
        className="container"
        style={{ paddingBottom: "100px", paddingTop: "100px" }}
      >
        <SectionHeading title="Partner" />
        <div className="row justify-content-center py-5 p-lg-5">
          {partners.map((partner) => (
            <PartnerCard key={partner.name} partner={partner} />
          ))}
        </div>
      </div>
    </section>
  );
}

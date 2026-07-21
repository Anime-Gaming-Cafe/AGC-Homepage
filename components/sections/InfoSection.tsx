import { SectionHeading } from "@/components/sections/SectionHeading";

export function InfoSection({ information }: { information: string }) {
  return (
    <section id="info" style={{ paddingBottom: "100px", paddingTop: "100px" }}>
      <div className="container py-5">
        <SectionHeading title="Informationen" />
        <div className="py-5 p-lg-5">
          <div className="col-md-10 col-lg-10 col-xl-10 col-xxl-10 offset-xl-1">
            <p className="text-center text-muted">{information}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

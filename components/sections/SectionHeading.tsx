export function SectionHeading({ title }: { title: string }) {
  return (
    <div className="row">
      <div className="col-md-8 col-xl-6 text-center mx-auto">
        <h1 style={{ fontFamily: "Wandertucker", fontSize: "60px" }}>
          <span style={{ fontWeight: "normal" }}>{title}</span>
        </h1>
        <hr />
      </div>
    </div>
  );
}

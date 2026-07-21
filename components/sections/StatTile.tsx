interface StatTileProps {
  icon: string;
  value: string;
  label: string;
  extraColClass?: string;
}

export function StatTile({ icon, value, label, extraColClass }: StatTileProps) {
  return (
    <div
      className={`col-sm-6 col-md-3 ${extraColClass ?? ""}col-xl-3 text-center`}
      style={{ minWidth: "100px" }}
    >
      <span
        className="fa-stack fa-4x stats"
        aria-hidden="true"
        style={{ marginTop: "10px" }}
      >
        <i className={`${icon} fa-stack-1x fa-inverse stats`}></i>
      </span>
      <h4
        className="text-break text-white section-heading"
        style={{
          fontFamily: "'Whitney Book Regular'",
          fontSize: "25px",
          marginTop: "8px",
        }}
      >
        {value}
      </h4>
      <p
        className="text-break text-muted"
        style={{
          paddingRight: "10px",
          paddingLeft: "10px",
          fontFamily: "'Whitney Book Regular'",
          fontSize: "18px",
          lineHeight: "30px",
        }}
      >
        {label}
      </p>
    </div>
  );
}

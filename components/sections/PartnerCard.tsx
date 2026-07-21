"use client";

import Image from "next/image";
import type { PartnerView } from "@/lib/discord/views";

function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

export function PartnerCard({ partner }: { partner: PartnerView }) {
  const scale = (element: HTMLElement, value: string) => {
    if (prefersReducedMotion()) return;
    element.style.transform = value;
  };

  return (
    <div className="col-sm-6 col-md-4 col-lg-3 mb-4 d-flex justify-content-center">
      <a
        href={partner.url}
        target="_blank"
        rel="noopener"
        referrerPolicy="no-referrer-when-downgrade"
        className="text-decoration-none text-white text-center d-flex flex-column align-items-center glas p-4 rounded"
        style={{
          width: "100%",
          borderRadius: "16px",
          transition: "transform 0.2s",
        }}
        onMouseOver={(event) => scale(event.currentTarget, "scale(1.05)")}
        onMouseOut={(event) => scale(event.currentTarget, "scale(1)")}
        onFocus={(event) => scale(event.currentTarget, "scale(1.05)")}
        onBlur={(event) => scale(event.currentTarget, "scale(1)")}
      >
        <Image
          src={partner.logoUrl}
          alt=""
          width={80}
          height={80}
          unoptimized
          loading="lazy"
          referrerPolicy="no-referrer"
          style={{
            width: "80px",
            height: "80px",
            objectFit: "contain",
            borderRadius: "12px",
            marginBottom: "16px",
          }}
        />
        <h4 style={{ fontFamily: "'Whitney Book Regular'", marginBottom: "4px" }}>
          {partner.name}
        </h4>
        <p
          style={{
            fontFamily: "'Whitney Book Italic'",
            fontSize: "15px",
            marginBottom: "10px",
            color: "rgba(255,255,255,0.75)",
          }}
        >
          {partner.tagline}
        </p>
        <p
          className="text-muted"
          style={{
            fontFamily: "'Whitney Book Regular'",
            fontSize: "14px",
            marginBottom: 0,
          }}
        >
          {partner.description}
        </p>
      </a>
    </div>
  );
}

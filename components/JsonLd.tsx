import { CANONICAL_URL, FALLBACK_INVITE_URL } from "@/lib/constants";

interface JsonLdProps {
  iconUrl: string;
  description: string;
}

const ORGANIZATION_ID = `${CANONICAL_URL}/#organization`;
const WEBSITE_ID = `${CANONICAL_URL}/#website`;

export function JsonLd({ iconUrl, description }: JsonLdProps) {
  const data = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": ORGANIZATION_ID,
        name: "Anime & Gaming Café",
        alternateName: "AGC",
        url: CANONICAL_URL,
        logo: iconUrl,
        image: iconUrl,
        description,
        email: "info@animegamingcafe.de",
        sameAs: [
          FALLBACK_INVITE_URL,
          "https://www.instagram.com/animegamingcafe/",
        ],
      },
      {
        "@type": "WebSite",
        "@id": WEBSITE_ID,
        url: CANONICAL_URL,
        name: "Anime & Gaming Café",
        description,
        inLanguage: "de-DE",
        publisher: { "@id": ORGANIZATION_ID },
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

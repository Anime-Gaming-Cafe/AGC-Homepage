import { CANONICAL_URL } from "@/lib/constants";

interface JsonLdProps {
  iconUrl: string;
  description: string;
}

export function JsonLd({ iconUrl, description }: JsonLdProps) {
  const data = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Anime & Gaming Café",
    url: CANONICAL_URL,
    logo: iconUrl,
    description,
    sameAs: ["https://discord.gg/animegamingcafe"],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

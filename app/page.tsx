import type { Metadata, Viewport } from "next";
import { getSnapshot } from "@/lib/discord/cache";
import { getTeamProfiles, type TeamProfile } from "@/lib/db";
import { CANONICAL_URL } from "@/lib/constants";
import { DrawerProvider } from "@/components/layout/DrawerProvider";
import { OffCanvasNav } from "@/components/layout/OffCanvasNav";
import { Navbar } from "@/components/layout/Navbar";
import { Preloader } from "@/components/layout/Preloader";
import { HeroBackground } from "@/components/layout/HeroBackground";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/sections/Hero";
import { InfoSection } from "@/components/sections/InfoSection";
import { EventsSection } from "@/components/sections/EventsSection";
import { StatsSection } from "@/components/sections/StatsSection";
import { PartnersSection } from "@/components/sections/PartnersSection";
import { TeamSection } from "@/components/sections/TeamSection";
import { JsonLd } from "@/components/JsonLd";

export const dynamic = "force-dynamic";

const PAGE_TITLE = "Anime & Gaming Café - Deine deutschsprachige Community";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#2596be",
};

export async function generateMetadata(): Promise<Metadata> {
  const { guild, cache } = getSnapshot();
  const description = cache.db.pageDescription;
  const iconUrl = guild?.iconUrl;

  return {
    title: PAGE_TITLE,
    description,
    keywords:
      "Anime, Gaming, Discord, Community, Café, Deutschland, Server, Voice, Kanäle",
    robots: { index: true, follow: true },
    alternates: { canonical: CANONICAL_URL },
    openGraph: {
      type: "website",
      siteName: "Anime & Gaming Café",
      title: PAGE_TITLE,
      description,
      url: CANONICAL_URL,
      locale: "de_DE",
      ...(iconUrl ? { images: [{ url: iconUrl, type: "image/png" }] } : {}),
    },
    twitter: {
      card: "summary",
      title: PAGE_TITLE,
      description,
      ...(iconUrl ? { images: [iconUrl] } : {}),
    },
    ...(iconUrl ? { icons: { icon: iconUrl, apple: iconUrl } } : {}),
    other: { "apple-mobile-web-app-status-bar-style": "css-color" },
  };
}

export default async function HomePage() {
  const { guild, cache } = getSnapshot();

  if (!guild) {
    return (
      <div
        style={{
          color: "white",
          textAlign: "center",
          marginTop: "40vh",
          fontSize: "24px",
        }}
      >
        Bot verbindet sich... bitte in ein paar Sekunden neu laden.
      </div>
    );
  }

  let profiles: Map<string, TeamProfile>;
  try {
    profiles = await getTeamProfiles(cache.team.map((member) => member.id));
  } catch (error) {
    console.error("[page] Team profiles query failed:", error);
    profiles = new Map();
  }

  return (
    <DrawerProvider>
      <JsonLd iconUrl={guild.iconUrl} description={cache.db.pageDescription} />
      <OffCanvasNav vanityCode={guild.vanityCode} variant="home" />
      <Navbar
        iconUrl={guild.iconUrl}
        vanityCode={guild.vanityCode}
        variant="home"
      />
      <Preloader />
      <HeroBackground bannerUrl={guild.bannerUrl} opacity={0.5} />
      <Hero
        description={cache.db.pageDescription}
        vanityCode={guild.vanityCode}
      />
      <InfoSection information={cache.db.pageInformation} />
      <EventsSection
        events={cache.events}
        hasUpcomingEvent={cache.hasUpcomingEvent}
      />
      <StatsSection
        guild={guild}
        totalMessages={cache.db.totalMessages}
        todayMessages={cache.db.todayMessages}
        todayJoins={cache.db.todayJoins}
      />
      <PartnersSection partners={cache.partners} />
      <TeamSection team={cache.team} profiles={profiles} />
      <Footer vanityCode={guild.vanityCode} />
    </DrawerProvider>
  );
}

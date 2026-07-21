import { NextResponse, type NextRequest } from "next/server";
import { GUILD_ID } from "@/lib/constants";
import { unavailableResponse } from "@/lib/unavailable-page";

interface ReadinessProbe {
  client?: {
    isReady?: () => boolean;
    guilds?: { cache?: { has?: (id: string) => boolean } };
  };
}

function shouldServeUnavailable(): boolean {
  const probe = (globalThis as { __agc?: ReadinessProbe }).__agc;
  if (!probe) return false;

  const client = probe.client;
  if (!client?.isReady?.()) return true;
  return !(client.guilds?.cache?.has?.(GUILD_ID) ?? false);
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname !== "/impressum" && pathname.toLowerCase() === "/impressum") {
    return NextResponse.redirect(new URL("/impressum", request.url), 308);
  }

  if (pathname === "/" && shouldServeUnavailable()) {
    return unavailableResponse({
      headline: "Die Seite verbindet sich gerade mit unserem Discord.",
      detail:
        "Das dauert normalerweise nur ein paar Sekunden. Diese Seite lädt sich automatisch neu.",
      retryAfterSeconds: 5,
    });
  }
}

export const config = {
  matcher: ["/", "/:path"],
};

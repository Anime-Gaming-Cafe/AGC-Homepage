import { NextResponse, type NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (pathname !== "/impressum" && pathname.toLowerCase() === "/impressum") {
    return NextResponse.redirect(new URL("/impressum", request.url), 308);
  }
}

export const config = {
  matcher: "/:path",
};

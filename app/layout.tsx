import type { CSSProperties, ReactNode } from "react";
import type { Metadata } from "next";
import Script from "next/script";
import { CANONICAL_URL } from "@/lib/constants";

export const metadata: Metadata = {
  metadataBase: new URL(CANONICAL_URL),
};

const htmlStyle = {
  "--bs-dark": "#090B19",
  "--bs-dark-rgb": "54,57,63",
  "--bs-primary": "rgb(153,128,250)",
  "--bs-primary-rgb": "212,39,91",
  "--bs-secondary": "#ffffff",
  "--bs-highlight-bg": "rgba(153,128,250,0.2)",
  "--bs-secondary-rgb": "122,197,242",
  "--bs-body-bg": "#202225",
  fontFamily: "'Whitney Medium'",
  "--bs-font-sans-serif":
    '"Whitney Book", "Inter", "Helvetica Neue", Helvetica, Arial, sans-serif',
} as CSSProperties;

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html data-bs-theme="light" lang="de" style={htmlStyle}>
      <body id="page-top">
        <link
          rel="stylesheet"
          href="/assets/bootstrap/css/bootstrap.min.css"
          precedence="default"
        />
        <link
          rel="stylesheet"
          href="/assets/fonts/fontawesome-all.min.css"
          precedence="default"
        />
        <link
          rel="stylesheet"
          href="/assets/css/styles.min.css"
          precedence="default"
        />
        <link
          rel="stylesheet"
          href="/assets/css/custom.css"
          precedence="default"
        />
        <link
          rel="stylesheet"
          href="/assets/css/port-fixes.css"
          precedence="default"
        />
        {children}
        <Script
          src="https://analytics.diamondforge.me/script.js"
          data-website-id="a6b1654e-1b8e-461f-862d-8d853285e726"
          strategy="afterInteractive"
        />
        <Script
          src="https://analytics.diamondforge.me/recorder.js"
          data-website-id="a6b1654e-1b8e-461f-862d-8d853285e726"
          data-sample-rate="0.7"
          data-mask-level="moderate"
          data-max-duration="300000"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}

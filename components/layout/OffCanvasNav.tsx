"use client";

import type { CSSProperties } from "react";
import { useDrawer } from "@/components/layout/DrawerProvider";

const navStyle: CSSProperties = {
  zIndex: 800,
  background: "none",
  backdropFilter: "blur(100px)",
  WebkitBackdropFilter: "blur(10px)",
  display: "block",
  paddingTop: "100px",
  paddingLeft: "10px",
};

const linkStyle: CSSProperties = { color: "rgb(255,255,255)" };

interface OffCanvasNavProps {
  vanityCode: string;
  variant: "home" | "impressum";
}

export function OffCanvasNav({ vanityCode, variant }: OffCanvasNavProps) {
  const { open, closeDrawer } = useDrawer();

  const item = (content: React.ReactNode) => (
    <li className="nav-item" data-dismiss="drawer" onClick={closeDrawer}>
      {content}
    </li>
  );

  return (
    <nav
      className={`navbar fixed-top off-canvas navbar-dark${open ? " open" : ""}`}
      data-right-drawer="0"
      data-open-drawer={open ? "1" : "0"}
      style={navStyle}
    >
      <div className="container flex-column">
        <ul className="navbar-nav me-auto" style={{ fontSize: "25px" }}>
          {item(
            <a className="nav-link" href="https://animegamingcafe.de/" style={linkStyle}>
              Home
            </a>
          )}
          {variant === "home" && (
            <>
              {item(
                <a className="nav-link" href="#info" style={linkStyle}>
                  Informationen
                </a>
              )}
              {item(
                <a className="nav-link" href="#events" style={linkStyle}>
                  Events
                </a>
              )}
              {item(
                <a className="nav-link" href="#stats" style={linkStyle}>
                  Statistiken
                </a>
              )}
              {item(
                <a className="nav-link" href="#partners" style={linkStyle}>
                  Partner
                </a>
              )}
              {item(
                <a className="nav-link" href="#team" style={linkStyle}>
                  Team
                </a>
              )}
              {item(
                <a
                  className="nav-link"
                  href="https://unban.animegamingcafe.de/"
                  style={linkStyle}
                >
                  Entbannung
                </a>
              )}
              {item(
                <a
                  className="nav-link"
                  href="https://dashboard.animegamingcafe.de/"
                  style={linkStyle}
                >
                  Dashboard
                </a>
              )}
            </>
          )}
          {item(
            <a
              className="nav-link"
              href={`http://discord.gg/${vanityCode}`}
              style={linkStyle}
              target="_blank"
            >
              Join uns!
            </a>
          )}
        </ul>
      </div>
    </nav>
  );
}

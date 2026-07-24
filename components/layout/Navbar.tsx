"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { NavTogglerButtons } from "@/components/layout/NavTogglerButtons";

interface NavbarProps {
  iconUrl: string;
  vanityCode: string;
  variant: "home" | "impressum";
}

const DETACH_OFFSET = 8;

export function Navbar({ iconUrl, vanityCode, variant }: NavbarProps) {
  const [detached, setDetached] = useState(false);

  useEffect(() => {
    const onScroll = () => setDetached(window.scrollY > DETACH_OFFSET);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      aria-label="Hauptnavigation"
      className={`navbar navbar-expand-lg fixed-top navigation-clean navbar-light${
        detached ? " detached" : ""
      }`}
    >
      <div className={`container${detached ? " glas" : ""}`}>
        <a
          className="navbar-brand d-flex justify-content-center align-items-center"
          href="https://animegamingcafe.de/"
        >
          <div className="sidebar-brand-icon">
            {iconUrl && (
              <Image
                className="rounded-circle"
                src={iconUrl}
                alt=""
                width={50}
                height={50}
                unoptimized
              />
            )}
          </div>
          <div className="sidebar-brand-text mx-3" style={{ fontSize: "32px" }}>
            <span
              className="text-white"
              style={{
                fontFamily: "'Wandertucker', 'Segoesc'",
                fontSize: "38px",
                lineHeight: "20px",
              }}
            >
              AGC Discord
            </span>
          </div>
        </a>
        <NavTogglerButtons />
        <div
          className="collapse navbar-collapse"
          id="navcol-2"
          style={{ fontSize: "16px" }}
        >
          <ul className="navbar-nav mx-auto">
            {variant === "home" ? (
              <>
                <li className="nav-item" style={{ margin: "0px 12px" }}>
                  <a
                    className="nav-link"
                    href="#info"
                    style={{ paddingBottom: "8px" }}
                  >
                    Informationen
                  </a>
                </li>
                <li className="nav-item" style={{ margin: "0px 12px" }}>
                  <a
                    className="nav-link"
                    href="#events"
                    style={{ paddingBottom: "8px" }}
                  >
                    Events
                  </a>
                </li>
                <li className="nav-item" style={{ margin: "0px 12px" }}>
                  <a
                    className="nav-link"
                    href="#stats"
                    style={{ paddingBottom: "8px" }}
                  >
                    Statistiken
                  </a>
                </li>
                <li className="nav-item" style={{ margin: "0px 12px" }}>
                  <a
                    className="nav-link"
                    href="#partners"
                    style={{ paddingBottom: "8px" }}
                  >
                    Partner
                  </a>
                </li>
                <li className="nav-item" style={{ margin: "0px 12px" }}>
                  <a
                    className="nav-link"
                    href="#team"
                    style={{ paddingBottom: "8px" }}
                  >
                    Team
                  </a>
                </li>
                <li className="nav-item" style={{ margin: "0px 12px" }}>
                  <a
                    className="nav-link"
                    href="https://unban.animegamingcafe.de/"
                    style={{ paddingBottom: "8px" }}
                  >
                    Entbannung
                  </a>
                </li>
                <li className="nav-item" style={{ margin: "0px 12px" }}>
                  <a
                    className="nav-link"
                    href="https://dashboard.animegamingcafe.de/"
                    style={{ paddingBottom: "8px" }}
                  >
                    Dashboard
                  </a>
                </li>
              </>
            ) : (
              <li className="nav-item" style={{ margin: "0px 12px" }}>
                <a
                  className="nav-link"
                  href="https://animegamingcafe.de"
                  style={{ paddingBottom: "8px" }}
                >
                  Home
                </a>
              </li>
            )}
          </ul>
          <a
            className="btn btn-primary shadow button-animation glas"
            role="button"
            href={`https://discord.gg/${vanityCode}`}
            style={{
              lineHeight: "24px",
              fontSize: "18px",
              borderRadius: "16px",
            }}
            target="_blank"
          >
            Join uns!
          </a>
        </div>
      </div>
    </nav>
  );
}

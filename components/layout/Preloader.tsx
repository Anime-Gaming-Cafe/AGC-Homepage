"use client";

import { useEffect, useState } from "react";

export function Preloader() {
  const [fading, setFading] = useState(false);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    let fadeTimer: ReturnType<typeof setTimeout>;
    let removeTimer: ReturnType<typeof setTimeout>;

    const start = () => {
      fadeTimer = setTimeout(() => setFading(true), 200);
      removeTimer = setTimeout(() => setGone(true), 500);
    };

    if (document.readyState === "complete") {
      start();
    } else {
      window.addEventListener("load", start);
    }
    return () => {
      window.removeEventListener("load", start);
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
    };
  }, []);

  if (gone) return null;

  return (
    <div
      className="preloader"
      style={
        fading ? { opacity: 0, transition: "opacity 300ms" } : undefined
      }
    >
      <span className="loading-bar"></span>
    </div>
  );
}

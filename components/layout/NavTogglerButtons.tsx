"use client";

import type { CSSProperties } from "react";
import { useDrawer } from "@/components/layout/DrawerProvider";

const buttonStyle: CSSProperties = {
  fontSize: "25px",
  color: "rgba(255,255,255,0.8)",
};

export function NavTogglerButtons() {
  const { open, openDrawer, closeDrawer } = useDrawer();

  return (
    <>
      <button
        className="btn navbar-toggler"
        id="open-nav-button"
        type="button"
        data-open="drawer"
        onClick={openDrawer}
        style={{ ...buttonStyle, display: open ? "none" : undefined }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="1em"
          height="1em"
          fill="currentColor"
          viewBox="0 0 16 16"
          className="bi bi-list-task"
          style={{ fontSize: "30px" }}
        >
          <path
            fillRule="evenodd"
            d="M2 2.5a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5V3a.5.5 0 0 0-.5-.5H2zM3 3H2v1h1V3z"
          ></path>
          <path d="M5 3.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zM5.5 7a.5.5 0 0 0 0 1h9a.5.5 0 0 0 0-1h-9zm0 4a.5.5 0 0 0 0 1h9a.5.5 0 0 0 0-1h-9z"></path>
          <path
            fillRule="evenodd"
            d="M1.5 7a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5H2a.5.5 0 0 1-.5-.5V7zM2 7h1v1H2V7zm0 3.5a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5H2zm1 .5H2v1h1v-1z"
          ></path>
        </svg>
      </button>
      <button
        className="btn navbar-toggler"
        id="close-nav-button"
        type="button"
        data-dismiss="drawer"
        onClick={closeDrawer}
        style={{ ...buttonStyle, display: open ? "block" : "none" }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="1em"
          height="1em"
          fill="currentColor"
          viewBox="0 0 16 16"
          className="bi bi-x-lg"
          style={{ fontSize: "30px" }}
        >
          <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z"></path>
        </svg>
      </button>
    </>
  );
}

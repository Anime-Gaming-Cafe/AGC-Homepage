"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

interface DrawerContextValue {
  open: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
}

const DrawerContext = createContext<DrawerContextValue>({
  open: false,
  openDrawer: () => {},
  closeDrawer: () => {},
});

export function useDrawer(): DrawerContextValue {
  return useContext(DrawerContext);
}

export function DrawerProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);

  const openDrawer = useCallback(() => setOpen(true), []);
  const closeDrawer = useCallback(() => setOpen(false), []);

  useEffect(() => {
    const body = document.body;
    if (open) {
      body.classList.add("drawer-open");
      body.style.overflow = "hidden";
    } else {
      body.classList.remove("drawer-open");
      body.style.overflow = "initial";
    }
  }, [open]);

  useEffect(() => {
    let startX = 0;
    let startY = 0;
    let startTime = 0;

    const onTouchStart = (event: TouchEvent) => {
      const touch = event.changedTouches[0];
      startX = touch.pageX;
      startY = touch.pageY;
      startTime = Date.now();
    };

    const onTouchEnd = (event: TouchEvent) => {
      const touch = event.changedTouches[0];
      const dx = touch.pageX - startX;
      const dy = touch.pageY - startY;
      const elapsed = Date.now() - startTime;
      if (elapsed > 300) return;
      if (Math.abs(dx) < 150 || Math.abs(dy) > 100) return;
      setOpen(dx > 0);
    };

    document.addEventListener("touchstart", onTouchStart, false);
    document.addEventListener("touchend", onTouchEnd, false);
    return () => {
      document.removeEventListener("touchstart", onTouchStart, false);
      document.removeEventListener("touchend", onTouchEnd, false);
    };
  }, []);

  return (
    <DrawerContext.Provider value={{ open, openDrawer, closeDrawer }}>
      {children}
    </DrawerContext.Provider>
  );
}

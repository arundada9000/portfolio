"use client";

import { useEffect } from "react";

/** Registers the offline PWA service worker and handles automatic updates. */
export function ServiceWorker() {
  useEffect(() => {
    if (typeof window === "undefined" || !("serviceWorker" in navigator)) return;

    const registerSW = async () => {
      try {
        const reg = await navigator.serviceWorker.register("/sw.js", { scope: "/" });
        
        // Auto update check
        reg.addEventListener("updatefound", () => {
          const newWorker = reg.installing;
          if (newWorker) {
            newWorker.addEventListener("statechange", () => {
              if (newWorker.state === "installed" && navigator.serviceWorker.controller) {
                console.log("[PWA] New version available. Refreshing on next visit.");
              }
            });
          }
        });
      } catch (err) {
        console.warn("[PWA] ServiceWorker registration skipped:", err);
      }
    };

    if (document.readyState === "complete") {
      registerSW();
    } else {
      window.addEventListener("load", registerSW, { once: true });
      return () => window.removeEventListener("load", registerSW);
    }
  }, []);

  return null;
}

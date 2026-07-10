"use client";

import { useEffect, useState } from "react";

/**
 * The signature element: a vim-style statusline fixed to the bottom of the
 * viewport. Shows editor mode (INSERT while typing in the contact form),
 * the current section as an open buffer, scroll progress, and live Nepal time.
 */
export function StatusLine() {
  const [mode, setMode] = useState<"NORMAL" | "INSERT">("NORMAL");
  const [buffer, setBuffer] = useState("hero");
  const [scroll, setScroll] = useState(0);
  const [time, setTime] = useState("--:--:--");

  // scroll progress
  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setScroll(max > 0 ? Math.round((window.scrollY / max) * 100) : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // active section = open buffer
  useEffect(() => {
    const sections = document.querySelectorAll<HTMLElement>("[data-section]");
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && entry.target instanceof HTMLElement) {
            setBuffer(entry.target.dataset.section ?? "hero");
          }
        }
      },
      { rootMargin: "-45% 0px -45% 0px" }
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  // INSERT mode while a form field has focus
  useEffect(() => {
    const isField = (el: EventTarget | null) =>
      el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement;
    const onFocusIn = (e: FocusEvent) => isField(e.target) && setMode("INSERT");
    const onFocusOut = () => setMode("NORMAL");
    document.addEventListener("focusin", onFocusIn);
    document.addEventListener("focusout", onFocusOut);
    return () => {
      document.removeEventListener("focusin", onFocusIn);
      document.removeEventListener("focusout", onFocusOut);
    };
  }, []);

  // live clock in Nepal time (UTC+5:45)
  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("en-GB", {
      timeZone: "Asia/Kathmandu",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
    const update = () => setTime(fmt.format(new Date()));
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);

  const position = scroll === 0 ? "Top" : scroll >= 100 ? "Bot" : `${scroll}%`;

  return (
    <div
      aria-hidden="true"
      className="fixed inset-x-0 bottom-0 z-50 flex h-9 select-none items-stretch overflow-hidden border-t border-line bg-panel font-mono text-[11px] leading-9 sm:text-xs"
    >
      <span
        className={`px-3 font-bold tracking-widest ${
          mode === "INSERT" ? "bg-ember text-night" : "bg-amber text-night"
        }`}
      >
        -- {mode} --
      </span>
      <span className="truncate px-3 text-dust">
        ~/arun-neupane/<span className="text-fog">{buffer}</span>.tsx
      </span>
      <span className="ml-auto hidden px-3 text-dust sm:block">butwal, nepal</span>
      <span className="border-l border-line px-3 text-dust">
        {time} <span className="text-amber">NPT</span>
      </span>
      <span className="w-14 border-l border-line bg-line/40 px-3 text-right text-fog">
        {position}
      </span>
    </div>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Amber dot + trailing ring. The dot tracks the pointer 1:1; the ring lerps
 * behind it and swells over interactive targets. Desktop pointers only -
 * touch and reduced-motion users keep the native cursor.
 */
export function CustomCursor() {
  const [enabled, setEnabled] = useState(false);
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduced) return;
    setEnabled(true);
    document.documentElement.classList.add("cursor-none");

    let mx = window.innerWidth / 2;
    let my = window.innerHeight / 2;
    let rx = mx;
    let ry = my;
    let raf = 0;

    // handlers only record coords; all style writes happen in the rAF loop
    const onMove = (e: PointerEvent) => {
      mx = e.clientX;
      my = e.clientY;
    };

    const isInteractive = (t: EventTarget | null) =>
      t instanceof Element && !!t.closest("a, button, input, textarea, [data-cursor], [role='button']");

    const onOver = (e: PointerEvent) => {
      ring.current?.classList.toggle("cursor-ring--active", isInteractive(e.target));
    };
    const onDown = () => ring.current?.classList.add("cursor-ring--down");
    const onUp = () => ring.current?.classList.remove("cursor-ring--down");
    const onLeave = () => {
      if (dot.current) dot.current.style.opacity = "0";
      if (ring.current) ring.current.style.opacity = "0";
    };
    const onEnter = () => {
      if (dot.current) dot.current.style.opacity = "1";
      if (ring.current) ring.current.style.opacity = "1";
    };

    // one rAF loop writes both transforms: the dot pins to the latest coords,
    // the ring trails with a frame-rate-independent lerp (same feel at any Hz)
    let lastT = performance.now();
    const loop = (now: number) => {
      const dt = Math.min((now - lastT) / 1000, 0.05);
      lastT = now;
      const k = 1 - Math.exp(-16 * dt);
      rx += (mx - rx) * k;
      ry += (my - ry) * k;
      if (dot.current) dot.current.style.transform = `translate3d(${mx}px, ${my}px, 0)`;
      if (ring.current) ring.current.style.transform = `translate3d(${rx}px, ${ry}px, 0)`;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerover", onOver, { passive: true });
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    document.addEventListener("pointerleave", onLeave);
    document.addEventListener("pointerenter", onEnter);

    return () => {
      cancelAnimationFrame(raf);
      document.documentElement.classList.remove("cursor-none");
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerover", onOver);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      document.removeEventListener("pointerleave", onLeave);
      document.removeEventListener("pointerenter", onEnter);
    };
  }, []);

  if (!enabled) return null;

  return (
    <>
      <div ref={ring} className="cursor-ring">
        <span className="cursor-ring-inner" />
      </div>
      <div ref={dot} className="cursor-dot" />
    </>
  );
}

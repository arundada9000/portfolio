"use client";

import { useEffect, useState } from "react";

/** Types each phrase, holds, deletes, moves to the next. Respects reduced motion. */
export function Typing({ phrases, className }: { phrases: readonly string[]; className?: string }) {
  const [text, setText] = useState(phrases[0]);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (reduced) return;
    let phrase = 0;
    let char = phrases[0].length;
    let deleting = false;
    let timer: ReturnType<typeof setTimeout>;

    const tick = () => {
      const current = phrases[phrase];
      char += deleting ? -1 : 1;
      setText(current.slice(0, char));

      let delay = deleting ? 35 : 65;
      if (!deleting && char === current.length) {
        delay = 2200;
        deleting = true;
      } else if (deleting && char === 0) {
        deleting = false;
        phrase = (phrase + 1) % phrases.length;
        delay = 350;
      }
      timer = setTimeout(tick, delay);
    };
    timer = setTimeout(tick, 2200);
    return () => clearTimeout(timer);
  }, [phrases, reduced]);

  return (
    <span className={className} aria-label={phrases.join(", ")}>
      <span aria-hidden="true">
        {text}
        <span className="animate-blink text-amber">▍</span>
      </span>
    </span>
  );
}

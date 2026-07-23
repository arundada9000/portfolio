"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Fetch-command loader. Each visit picks a random language and "fetches"
 * Arun: the command types itself, the host resolves under a spinner, then
 * the response lands line by line before the page wipes in. The overlay is
 * server-rendered so it covers the page from the very first paint - no
 * flash of content before it. ~2.5s of theater; reduced motion skips it.
 */

const FETCHES = [
  { lang: "bash", prompt: "$", cmd: "curl -s arun.dev/me" },
  { lang: "javascript", prompt: ">", cmd: 'await fetch("/arun")' },
  { lang: "python", prompt: ">>>", cmd: 'requests.get("arun://np")' },
  { lang: "go", prompt: "go>", cmd: 'http.Get("arun.dev/me")' },
  { lang: "rust", prompt: "rs>", cmd: 'reqwest::get("arun.dev").await?' },
  { lang: "ruby", prompt: "irb>", cmd: 'Net::HTTP.get("arun.dev", "/me")' },
  { lang: "sql", prompt: "sql>", cmd: "SELECT * FROM devs WHERE id = 'arun';" },
  { lang: "haskell", prompt: "λ>", cmd: 'httpGet "arun.dev/me"' },
];

const RESPONSE = [
  "200 OK · 68ms · content-type: developer/frontend",
  '{ name: "Arun Neupane", base: "Butwal, NP", status: "shipping" }',
  "render(arun) ✓",
];

const SPIN = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"];

const START_MS = 200; // beat before typing begins
const TYPE_MS = 30; // per character
const RESOLVE_MS = 520; // spinner time - the fake network wait
const LINE_MS = 170; // per response line
const HOLD_MS = 420; // beat on the finished response
const EXIT_MS = 600;

export function Preloader() {
  // starts as "boot" so the overlay is in the server HTML from first paint
  const [phase, setPhase] = useState<"boot" | "leaving" | "done">("boot");
  const [typed, setTyped] = useState(0);
  const [resolving, setResolving] = useState(false);
  const [shown, setShown] = useState(0);
  const [spin, setSpin] = useState(0);
  const pick = useRef<(typeof FETCHES)[number] | null>(null);

  useEffect(() => {
    // full drama on the first view of a session; instant on repeat views
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || sessionStorage.getItem("fetched")) {
      setPhase("done");
      return;
    }
    sessionStorage.setItem("fetched", "1");
    pick.current = FETCHES[Math.floor(Math.random() * FETCHES.length)];
    document.body.style.overflow = "hidden";

    const timers: ReturnType<typeof setTimeout>[] = [];
    const cmd = pick.current.cmd;

    // type the command…
    for (let i = 1; i <= cmd.length; i++) {
      timers.push(setTimeout(() => setTyped(i), START_MS + i * TYPE_MS));
    }
    const typedDone = START_MS + cmd.length * TYPE_MS + 140;

    // …resolve the host under a spinner…
    timers.push(setTimeout(() => setResolving(true), typedDone));
    const spinner = setInterval(() => setSpin((s) => s + 1), 80);
    const respStart = typedDone + RESOLVE_MS;
    timers.push(setTimeout(() => setResolving(false), respStart));

    // …land the response line by line…
    for (let i = 1; i <= RESPONSE.length; i++) {
      timers.push(setTimeout(() => setShown(i), respStart + i * LINE_MS));
    }

    // …hold the moment, then get out of the way
    const total = respStart + RESPONSE.length * LINE_MS + HOLD_MS;
    timers.push(setTimeout(() => setPhase("leaving"), total));
    timers.push(
      setTimeout(() => {
        setPhase("done");
        document.body.style.overflow = "";
      }, total + EXIT_MS)
    );

    return () => {
      timers.forEach(clearTimeout);
      clearInterval(spinner);
    };
  }, []);

  if (phase === "done") return null;

  // pre-hydration: no language picked yet - show only the waking cursor
  const { lang, prompt, cmd } = pick.current ?? { lang: "", prompt: "", cmd: "" };

  return (
    <div
      aria-hidden="true"
      suppressHydrationWarning
      className={`fixed inset-0 z-[100] flex flex-col justify-between overflow-hidden bg-night p-6 transition-transform duration-[600ms] ease-[cubic-bezier(0.76,0,0.24,1)] sm:p-10 ${
        phase === "leaving" ? "-translate-y-full" : ""
      }`}
    >
      {/* repeat views: hide the SSR overlay during HTML parse, before hydration */}
      <script
        dangerouslySetInnerHTML={{
          __html: `try{if(sessionStorage.getItem("fetched"))document.currentScript.parentElement.style.display="none"}catch(e){}`,
        }}
      />
      {/* top row - identity */}
      <div className="flex items-center justify-between font-mono text-xs uppercase tracking-widest text-dust sm:text-sm">
        <span>
          <span className="text-amber">◆</span> Arun Neupane
        </span>
        {lang && <span className="text-dust/70">// fetching via {lang}</span>}
      </div>

      {/* center - the fetch happening */}
      <div className="flex flex-1 flex-col justify-center font-mono text-sm sm:text-base">
        <p className="text-fog">
          {prompt && <span className="text-amber">{prompt} </span>}
          {cmd.slice(0, typed)}
          {typed < cmd.length && <span className="ml-0.5 inline-block h-4 w-2 translate-y-0.5 animate-blink bg-amber align-middle" />}
        </p>
        <div className="mt-3 space-y-1.5 text-xs sm:text-sm">
          {resolving && (
            <p className="text-dust">
              <span className="text-amber">{SPIN[spin % SPIN.length]}</span> resolving arun.dev · establishing handshake…
            </p>
          )}
          {RESPONSE.slice(0, shown).map((line, i) => (
            <p key={i} className={i === 0 ? "text-dust" : i === RESPONSE.length - 1 ? "text-amber" : "text-fog/80"}>
              {line}
            </p>
          ))}
        </div>
      </div>

      {/* bottom - location stamp */}
      <div className="font-mono text-xs uppercase tracking-widest text-dust">butwal · nepal</div>
    </div>
  );
}

/* ── previous loader (retired, kept on purpose) ──────────────────
   The count-up percentage loader this site shipped with first: a giant
   00→100 counter with a filling rule and status words. Not imported
   anywhere right now - to bring it back, export it as `Preloader` and
   retire the fetch loader above the same way. */

const words = ["booting", "loading assets", "mounting ui", "almost there", "ready"];

export function CountUpPreloader() {
  const [phase, setPhase] = useState<"boot" | "leaving" | "done">("done");
  const [pct, setPct] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setPhase("boot");
    document.body.style.overflow = "hidden";

    const start = performance.now();
    const DURATION = 1500;
    let raf = 0;
    const tick = (now: number) => {
      // easeOutCubic so it decelerates toward 100 - feels intentional
      const t = Math.min((now - start) / DURATION, 1);
      setPct(Math.round((1 - Math.pow(1 - t, 3)) * 100));
      if (t < 1) raf = requestAnimationFrame(tick);
      else setTimeout(() => setPhase("leaving"), 220);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  useEffect(() => {
    if (phase !== "leaving") return;
    const t = setTimeout(() => {
      setPhase("done");
      document.body.style.overflow = "";
    }, 700);
    return () => clearTimeout(t);
  }, [phase]);

  if (phase === "done") return null;

  const word = words[Math.min(words.length - 1, Math.floor((pct / 100) * words.length))];

  return (
    <div
      aria-hidden="true"
      className={`fixed inset-0 z-[100] flex flex-col justify-between overflow-hidden bg-night p-6 transition-transform duration-700 ease-[cubic-bezier(0.76,0,0.24,1)] sm:p-10 ${
        phase === "leaving" ? "-translate-y-full" : ""
      }`}
    >
      {/* top row - identity */}
      <div className="flex items-center justify-between font-mono text-xs uppercase tracking-widest text-dust sm:text-sm">
        <span>
          <span className="text-amber">◆</span> Arun Neupane
        </span>
        <span className="hidden sm:inline">Frontend Developer</span>
      </div>

      {/* center - status word cycling */}
      <div className="flex flex-1 items-center">
        <p className="font-mono text-sm text-dust sm:text-base">
          <span className="text-amber">$</span> {word}
          <span className="ml-0.5 inline-block h-4 w-2 translate-y-0.5 animate-blink bg-amber align-middle" />
        </p>
      </div>

      {/* bottom - giant counter + filling rule */}
      <div>
        <div className="mb-4 h-px w-full overflow-hidden bg-line">
          <div className="h-full bg-gradient-to-r from-amber to-ember" style={{ width: `${pct}%` }} />
        </div>
        <div className="flex items-end justify-between">
          <span className="font-mono text-xs uppercase tracking-widest text-dust">butwal · nepal</span>
          <span className="text-display text-[22vw] leading-[0.8] text-fog sm:text-[16vw]">
            {String(pct).padStart(2, "0")}
            <span className="text-amber">%</span>
          </span>
        </div>
      </div>
    </div>
  );
}

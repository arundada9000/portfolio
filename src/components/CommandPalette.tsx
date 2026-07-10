"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { site } from "@/lib/data/site";
import { projects } from "@/lib/data/projects";

type Line = { kind: "in" | "out" | "err" | "hint"; text: string };

type Command = {
  name: string;
  args?: string;
  desc: string;
  run: (arg: string) => Line[] | void;
};

/** Navigate to a section anchor or a route from anywhere in the app. */
function go(target: string) {
  if (target.startsWith("#")) {
    const el = document.querySelector(target);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
      return;
    }
    window.location.assign(`/${target}`);
    return;
  }
  window.location.assign(target);
}

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [lines, setLines] = useState<Line[]>([]);
  const [recall, setRecall] = useState<string[]>([]);
  const [recallIndex, setRecallIndex] = useState(-1);
  const [ghost, setGhost] = useState(0); // selected suggestion index
  const inputRef = useRef<HTMLInputElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);

  const commands = useMemo<Command[]>(() => {
    const sectionCmd = (name: string, hash: string, desc: string): Command => ({
      name,
      desc,
      run: () => {
        setOpen(false);
        go(hash);
      },
    });

    const list: Command[] = [
      {
        name: "help",
        desc: "list every command",
        run: () => [
          { kind: "hint", text: "navigate:  about · skills · work · gallery · open-source · experience · contact" },
          { kind: "hint", text: "projects:  ls · open <name>  (e.g. open roomeo)" },
          { kind: "hint", text: "links:     github · linkedin · whatsapp · instagram · facebook · email · sajilo" },
          { kind: "hint", text: "fun:       neofetch · date · echo <text> · socials · whoami · sudo" },
          { kind: "hint", text: "misc:      resume · hire · clear · cls  ·  press ? for shortcuts" },
        ],
      },
      {
        name: "ls",
        desc: "list all projects",
        run: () =>
          projects.map((p) => ({
            kind: "out" as const,
            text: `${p.featured ? "★" : " "} ${p.slug.padEnd(20)} ${p.title}`,
          })),
      },
      {
        name: "open",
        args: "<project>",
        desc: "open a project case study",
        run: (arg) => {
          if (!arg) return [{ kind: "err", text: "usage: open <project>  -  try `ls` for names" }];
          const match = projects.find(
            (p) => p.slug === arg || p.slug.includes(arg) || p.title.toLowerCase().includes(arg)
          );
          if (!match) return [{ kind: "err", text: `no project matches "${arg}"` }];
          setOpen(false);
          go(match.caseStudy ? `/work/${match.slug}` : match.github);
          return;
        },
      },
      sectionCmd("about", "#about", "who I am"),
      sectionCmd("skills", "#skills", "the stack"),
      sectionCmd("work", "#work", "selected work"),
      sectionCmd("gallery", "#gallery", "all project screenshots"),
      sectionCmd("open-source", "#open-source", "github contributions"),
      sectionCmd("experience", "#experience", "career timeline"),
      sectionCmd("contact", "#contact", "get in touch"),
      { name: "github", desc: "open github profile", run: () => { window.open(site.github, "_blank"); } },
      { name: "linkedin", desc: "open linkedin", run: () => { window.open(site.linkedin, "_blank"); } },
      {
        name: "whatsapp",
        desc: "start a whatsapp chat",
        run: () => { window.open(`https://wa.me/${site.whatsapp}?text=Hi%20Arun`, "_blank"); },
      },
      { name: "instagram", desc: "open instagram", run: () => { window.open("https://www.instagram.com/arundada9000/", "_blank"); } },
      { name: "facebook", desc: "open facebook", run: () => { window.open("https://www.facebook.com/arundada9000/", "_blank"); } },
      { name: "email", desc: "email me", run: () => { window.location.href = `mailto:${site.email}`; } },
      { name: "resume", desc: "download resume", run: () => { window.open(site.resume, "_blank"); } },
      { name: "sajilo", desc: "open sajilo digital", run: () => { window.open(site.company.url, "_blank"); } },
      {
        name: "socials",
        desc: "list every link",
        run: () => site.socials.map((s) => ({ kind: "out" as const, text: `${s.label.toLowerCase().padEnd(10)} ${s.href}` })),
      },
      {
        name: "neofetch",
        desc: "system info",
        run: () => [
          { kind: "out", text: "  _         arun@butwal" },
          { kind: "out", text: " /_\\        role   frontend dev · CTO @ sajilo digital" },
          { kind: "out", text: "/ _ \\       stack  react · next.js · typescript" },
          { kind: "out", text: "\\_/ \\_/      repos  70+ · uptime since 2023" },
        ],
      },
      {
        name: "date",
        desc: "current time in nepal",
        run: () => [
          {
            kind: "out",
            text: new Intl.DateTimeFormat("en-GB", { timeZone: "Asia/Kathmandu", dateStyle: "full", timeStyle: "medium" }).format(new Date()) + " NPT",
          },
        ],
      },
      { name: "echo", args: "<text>", desc: "print text", run: (arg) => [{ kind: "out", text: arg || "" }] },
      { name: "sudo", desc: "nice try", run: () => [{ kind: "err", text: "arun is not in the sudoers file. this incident will be reported. 😏" }] },
      { name: "secret", desc: "", run: () => [{ kind: "hint", text: "🔓 the real secret: type `hire`." }] },
      {
        name: "whoami",
        desc: "print bio",
        run: () => [
          { kind: "out", text: "arun neupane - frontend developer & CTO @ sajilo digital" },
          { kind: "out", text: "butwal, nepal · react · next.js · typescript" },
        ],
      },
      {
        name: "hire",
        desc: "let's work together",
        run: () => {
          setOpen(false);
          go("#contact");
          return [{ kind: "hint", text: "opening contact - I usually reply within 24h." }];
        },
      },
      { name: "clear", desc: "clear the screen", run: () => { setLines([]); } },
      { name: "cls", desc: "clear the screen", run: () => { setLines([]); } },
    ];
    return list;
  }, []);

  const suggestions = useMemo(() => {
    const q = input.trim().toLowerCase().split(/\s+/)[0] ?? "";
    if (!q) return commands;
    return commands.filter((c) => c.name.startsWith(q) || c.name.includes(q));
  }, [input, commands]);

  const runLine = useCallback(
    (raw: string) => {
      const text = raw.trim();
      if (!text) return;
      const [name, ...rest] = text.split(/\s+/);
      const arg = rest.join(" ").toLowerCase();
      const cmd = commands.find((c) => c.name === name.toLowerCase());

      setLines((prev) => [...prev, { kind: "in", text }]);
      setRecall((prev) => [text, ...prev].slice(0, 30));
      setRecallIndex(-1);

      if (!cmd) {
        setLines((prev) => [
          ...prev,
          { kind: "err", text: `command not found: ${name} - type \`help\`` },
        ]);
        return;
      }
      const out = cmd.run(arg);
      if (out) setLines((prev) => [...prev, ...out]);
    },
    [commands]
  );

  // global open shortcut
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      }
    };
    window.addEventListener("keydown", onKey);
    (window as unknown as { openTerminal?: () => void }).openTerminal = () => setOpen(true);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // focus + intro when opened
  useEffect(() => {
    if (!open) return;
    inputRef.current?.focus();
    if (lines.length === 0) {
      setLines([
        { kind: "hint", text: "arun.sh - type a command, or `help`. ↑↓ history · esc to close." },
      ]);
    }
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open, lines.length]);

  // keep scrolled to the newest line
  useEffect(() => {
    bodyRef.current?.scrollTo({ top: bodyRef.current.scrollHeight });
  }, [lines]);

  useEffect(() => setGhost(0), [input]);

  if (!open) return null;

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") {
      setOpen(false);
    } else if (e.key === "Enter") {
      const chosen = input.trim() ? suggestions[ghost] : null;
      // if the typed token exactly starts a single command and there's no arg, prefer typed text
      runLine(input.includes(" ") || !chosen ? input : chosen.name);
      setInput("");
    } else if (e.key === "Tab") {
      e.preventDefault();
      if (suggestions[ghost]) setInput(suggestions[ghost].name + " ");
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setGhost((g) => Math.min(g + 1, suggestions.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      // history recall when the suggestion list is at the top
      if (ghost === 0 && recall.length) {
        const next = Math.min(recallIndex + 1, recall.length - 1);
        setRecallIndex(next);
        setInput(recall[next]);
      } else {
        setGhost((g) => Math.max(g - 1, 0));
      }
    }
  };

  return (
    <div
      className="fixed inset-0 z-[70] flex items-start justify-center bg-night/70 p-4 pt-[12vh] backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="Command terminal"
      onMouseDown={(e) => e.target === e.currentTarget && setOpen(false)}
    >
      <div className="w-full max-w-xl overflow-hidden rounded-lg border border-line bg-panel shadow-2xl shadow-black/60">
        <div className="flex items-center gap-2 border-b border-line px-4 py-2.5">
          <span className="size-2.5 rounded-full bg-ember/70" />
          <span className="size-2.5 rounded-full bg-amber/70" />
          <span className="size-2.5 rounded-full bg-dust/40" />
          <span className="ml-2 font-mono text-xs text-dust">arun@butwal - arun.sh</span>
        </div>

        <div ref={bodyRef} className="max-h-[40vh] overflow-y-auto px-4 py-3 font-mono text-sm">
          {lines.map((l, i) => (
            <p
              key={i}
              className={
                l.kind === "in"
                  ? "text-fog"
                  : l.kind === "err"
                    ? "text-ember"
                    : l.kind === "hint"
                      ? "text-dust"
                      : "whitespace-pre text-amber/90"
              }
            >
              {l.kind === "in" && <span className="text-amber">$ </span>}
              {l.text}
            </p>
          ))}
        </div>

        <div className="flex items-center gap-2 border-t border-line px-4 py-3 font-mono text-sm">
          <span className="text-amber">$</span>
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            className="w-full bg-transparent text-fog outline-none placeholder:text-dust/50"
            placeholder="type a command…  (help)"
            spellCheck={false}
            autoComplete="off"
            aria-label="Command input"
          />
        </div>

        {input.trim() && suggestions.length > 0 && (
          <ul className="border-t border-line px-2 py-2 font-mono text-xs">
            {suggestions.slice(0, 5).map((c, i) => (
              <li key={c.name}>
                <button
                  type="button"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    runLine(c.args ? c.name + " " : c.name);
                    setInput("");
                  }}
                  className={`flex w-full items-center justify-between rounded px-2 py-1 text-left ${
                    i === ghost ? "bg-line/60 text-fog" : "text-dust hover:bg-line/30"
                  }`}
                >
                  <span>
                    <span className="text-amber">{c.name}</span>
                    {c.args && <span className="text-dust"> {c.args}</span>}
                  </span>
                  <span className="text-dust/70">{c.desc}</span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

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

const SONGS: { key: string; file: string; label: string }[] = [
  { key: "blue", file: "/music/blue.mp3", label: "Blue" },
  { key: "kalank", file: "/music/Kalank.mp3", label: "Kalank" },
  { key: "shayad", file: "/music/Shayad.mp3", label: "Shayad" },
  { key: "kamleya", file: "/music/VE-KAMLEYA.mp3", label: "VE-Kamleya" },
];

const JOKES = [
  "Why do programmers prefer dark mode? Because light attracts bugs.",
  "How many programmers does it take to change a light bulb? None — that's a hardware problem.",
  "A SQL query walks into a bar, walks up to two tables and asks: 'Can I join you?'",
  "Why was the JavaScript developer sad? Because he didn't know how to 'null' his feelings.",
  "I told my computer I needed a break. Now it won't stop sending me vacation ads.",
  "There are only 10 kinds of people: those who know binary and those who don't.",
  "Why do Java developers wear glasses? Because they can't C#.",
  "A UX designer walks into a bar — wait, that's already usable.",
  "99 little bugs in the code, 99 little bugs. Take one down, patch it around, 127 little bugs in the code.",
  "Programming is 10% writing code and 90% understanding why it worked yesterday.",
  "The best thing about a boolean is even if you're wrong, you're only off by a bit.",
  "I would tell you a UDP joke, but you might not get it.",
  "Why did the developer go broke? Because he used up all his cache.",
  "Floating point numbers are like piles of sand — every time you pick one up, you lose a little precision.",
];

const QUOTES = [
  { text: "The best way to predict the future is to create it.", author: "Alan Kay" },
  { text: "Any fool can write code that a computer can understand. Good programmers write code that humans can understand.", author: "Martin Fowler" },
  { text: "First, solve the problem. Then, write the code.", author: "John Johnson" },
  { text: "It's not a bug — it's an undocumented feature.", author: "Anonymous" },
  { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
  { text: "Talk is cheap. Show me the code.", author: "Linus Torvalds" },
  { text: "Code is like humor. When you have to explain it, it's bad.", author: "Cory House" },
  { text: "Make it work, make it right, make it fast.", author: "Kent Beck" },
  { text: "Programming isn't about what you know; it's about what you can figure out.", author: "Chris Pine" },
  { text: "The computer was born to solve problems that did not exist before.", author: "Bill Gates" },
  { text: "Before software can be reusable it first has to be usable.", author: "Ralph Johnson" },
  { text: "Sometimes it pays to stay in bed on Monday rather than spending the rest of the week debugging Monday's code.", author: "Dan Salomon" },
  { text: "Perfection is achieved not when there is nothing more to add, but rather when there is nothing more to take away.", author: "Antoine de Saint-Exupery" },
  { text: "A year from now you may wish you had started today.", author: "Karen Lamb" },
  { text: "The expert in anything was once a beginner.", author: "Helen Hayes" },
  { text: "Your limitation — it's only your imagination.", author: "Anonymous" },
  { text: "Push yourself because no one else is going to do it for you.", author: "Anonymous" },
  { text: "Dream big. Work hard. Stay focused.", author: "Anonymous" },
];

const FORTUNES = [
  "A beautiful, smart, and loving person will be coming into your life.",
  "A dubious friend may be an enemy in camouflage.",
  "A fresh start will put you on your way.",
  "A golden egg of opportunity falls into your lap this month.",
  "A lifetime of happiness is in store for you.",
  "A short pencil is usually better than a long memory.",
  "Adventure awaits you this weekend.",
  "Better a live bug than a dead hero.",
  "Commitment is the key to every relationship.",
  "Computer says: you will soon push code that passes on the first try.",
  "Don't just think — act. Then think again.",
  "Every big success depends on the small steps.",
  "Fortune favors the bold. And the ones who ship.",
  "Good news will come to you by mail.",
  "Happiness begins with a new pull request.",
  "Help is on the way — but you'll still need to write the tests.",
  "It's not too late to start something new today.",
  "Now is the time to try something you've been putting off.",
  "Someone will invite you to a meeting today. Politely decline.",
  "The bug you can't find is the one you haven't looked for.",
  "Your code will be reviewed favourably this week.",
  "Your terminal history is longer than your future. Start writing.",
];

const ASCII_COW = `   \\   ^__^
    \\  (oo)\\_______
       (__)\\       )\\/\\
           ||----w |
           ||     ||`;

const ASCII_ARUN = `
    ╔══════════════╗
    ║  ARUN.SH    ║
    ║  v2.0.0     ║
    ╚══════════════╝
         \\   ☕
          \\  ~/code
`;

const ASCII_MATRIX_CHARS = "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン01";

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

function sectionCmd(name: string, hash: string, desc: string, close: () => void): Command {
  return { name, desc, run: () => { close(); go(hash); } };
}

const FONT_BLOCKS: Record<string, string[]> = {
  A: [" █████ ", "██   ██", "███████", "██   ██", "██   ██"],
  B: ["██████ ", "██   ██", "██████ ", "██   ██", "██████ "],
  C: [" ██████", "██     ", "██     ", "██     ", " ██████"],
  D: ["██████ ", "██   ██", "██   ██", "██   ██", "██████ "],
  E: ["███████", "██     ", "██████ ", "██     ", "███████"],
  F: ["███████", "██     ", "██████ ", "██     ", "██     "],
  G: [" ██████", "██     ", "██  ███", "██   ██", " ██████"],
  H: ["██   ██", "██   ██", "███████", "██   ██", "██   ██"],
  I: ["███████", "  ███  ", "  ███  ", "  ███  ", "███████"],
  J: ["███████", "   ██  ", "   ██  ", "██ ██  ", " ████  "],
  K: ["██  ██ ", "██ ██  ", "████   ", "██ ██  ", "██  ██ "],
  L: ["██     ", "██     ", "██     ", "██     ", "███████"],
  M: ["██    ██", "███  ███", "████████", "██ ████", "██    ██"],
  N: ["██    ██", "███   ██", "████  ██", "██ ██ ██", "██  ████"],
  O: [" █████ ", "██   ██", "██   ██", "██   ██", " █████ "],
  P: ["██████ ", "██   ██", "██████ ", "██     ", "██     "],
  Q: [" █████ ", "██   ██", "██   ██", "██ █ ██", " ██████"],
  R: ["██████ ", "██   ██", "██████ ", "██ ██  ", "██  ██ "],
  S: [" ██████", "██     ", " █████ ", "     ██", "██████ "],
  T: ["███████", "  ███  ", "  ███  ", "  ███  ", "  ███  "],
  U: ["██   ██", "██   ██", "██   ██", "██   ██", " █████ "],
  V: ["██   ██", "██   ██", "██   ██", " ██ ██ ", "  ███  "],
  W: ["██    ██", "██ ██ ██", "████████", "██ ██ ██", "██    ██"],
  X: ["██   ██", " ██ ██ ", "  ███  ", " ██ ██ ", "██   ██"],
  Y: ["██   ██", " ██ ██ ", "  ███  ", "  ███  ", "  ███  "],
  Z: ["███████", "   ██  ", "  ██   ", " ██    ", "███████"],
  " ": ["      ", "      ", "      ", "      ", "      "],
};

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [lines, setLines] = useState<Line[]>([]);
  const [recall, setRecall] = useState<string[]>([]);
  const [recallIndex, setRecallIndex] = useState(-1);
  const [ghost, setGhost] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [musicState, setMusicState] = useState<{ current: string | null; playing: boolean; volume: number }>({
    current: null, playing: false, volume: 60,
  });

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    audioRef.current = new Audio();
    audioRef.current.volume = musicState.volume / 100;
    return () => { audioRef.current?.pause(); audioRef.current = null; };
  }, []);

  const ensureAudio = useCallback(() => {
    if (!audioRef.current) audioRef.current = new Audio();
    return audioRef.current;
  }, []);

  const playSong = useCallback((key: string) => {
    const song = SONGS.find((s) => s.key === key);
    if (!song) return;
    const audio = ensureAudio();
    audio.pause();
    audio.src = song.file;
    audio.volume = musicState.volume / 100;
    audio.play().catch(() => {});
    setMusicState({ current: key, playing: true, volume: musicState.volume });
  }, [ensureAudio, musicState.volume]);

  const pauseMusic = useCallback(() => {
    audioRef.current?.pause();
    setMusicState((prev) => ({ ...prev, playing: false }));
  }, []);

  const stopMusic = useCallback(() => {
    const audio = audioRef.current;
    if (audio) { audio.pause(); audio.src = ""; }
    setMusicState({ current: null, playing: false, volume: musicState.volume });
  }, [musicState.volume]);

  const setVolume = useCallback((v: number) => {
    const vol = Math.max(0, Math.min(100, v));
    if (audioRef.current) audioRef.current.volume = vol / 100;
    setMusicState((prev) => ({ ...prev, volume: vol }));
  }, []);

  const commands = useMemo<Command[]>(() => {
    const sec = (n: string, h: string, d: string) => sectionCmd(n, h, d, close);

    const list: Command[] = [
      {
        name: "help",
        desc: "list every command",
        run: () => [
          { kind: "hint", text: "── navigation ──  about · skills · work · gallery · open-source · experience · contact" },
          { kind: "hint", text: "── projects ──    ls · open <project> · repo <name>" },
          { kind: "hint", text: "── links ──       github · linkedin · whatsapp · instagram · facebook · email · youtube · twitter · sajilo" },
          { kind: "hint", text: "── music ──       music · play <song> · pause · stop · next · volume <0-100>" },
          { kind: "hint", text: "── fun ──         neofetch · matrix · joke · motivate · quote · fortune · ascii · cowsay <t> · 8ball <q> · roll · coinflip · bofh · bingo" },
          { kind: "hint", text: "── dev ──         man <cmd> · whoami · date · cal · uptime · weather · ping · curl · history · socials · echo <text>" },
          { kind: "hint", text: "── easter ──      sudo · secret · hire · namaste · hello · coffee · tea · compliment · invite · banner <t> · figlet <t>" },
          { kind: "hint", text: "── misc ──        resume · clear · cls · help" },
        ],
      },

      // ── music ──
      {
        name: "music", desc: "list songs",
        run: () => [
          { kind: "hint", text: `now playing: ${musicState.current ? `${musicState.current} ${musicState.playing ? "♪" : "⏸"}` : "none"}` },
          { kind: "hint", text: `volume: ${musicState.volume}%` },
          ...SONGS.map((s) => ({ kind: "out" as const, text: `  ${musicState.current === s.key ? "♪" : " "} ${s.key.padEnd(12)} ${s.label}` })),
          { kind: "hint", text: "commands: play <song> · pause · stop · next · volume <0-100>" },
        ],
      },
      { name: "play", args: "<song>", desc: "play a song (blue, kalank, shayad, kamleya)", run: (arg) => {
        if (!arg) return [{ kind: "err", text: `usage: play <song>  —  songs: ${SONGS.map((s) => s.key).join(" · ")}` }];
        const m = SONGS.find((s) => s.key === arg || s.key.includes(arg));
        if (!m) return [{ kind: "err", text: `unknown song "${arg}"` }];
        playSong(m.key);
        return [{ kind: "out", text: `♪ now playing: ${m.label}` }];
      }},
      { name: "pause", desc: "pause music", run: () => {
        if (!musicState.current) return [{ kind: "hint", text: "nothing is playing." }];
        pauseMusic();
        return [{ kind: "out", text: `⏸ paused: ${musicState.current}` }];
      }},
      { name: "stop", desc: "stop music", run: () => {
        if (!musicState.current) return [{ kind: "hint", text: "nothing is playing." }];
        const was = musicState.current; stopMusic();
        return [{ kind: "out", text: `⏹ stopped: ${was}` }];
      }},
      { name: "next", desc: "next song", run: () => {
        if (!SONGS.length) return [{ kind: "err", text: "no songs." }];
        const idx = SONGS.findIndex((s) => s.key === musicState.current);
        const n = SONGS[(idx + 1) % SONGS.length]; playSong(n.key);
        return [{ kind: "out", text: `♪ → next: ${n.label}` }];
      }},
      { name: "volume", args: "<0-100>", desc: "set volume level", run: (arg) => {
        const v = parseInt(arg, 10);
        if (isNaN(v) || v < 0 || v > 100) return [{ kind: "err", text: "usage: volume <0-100>" }];
        setVolume(v);
        return [{ kind: "out", text: `volume set to ${v}%` }];
      }},

      // ── navigation ──
      sec("about", "#about", "who I am"),
      sec("skills", "#skills", "the stack"),
      sec("work", "#work", "selected work"),
      sec("gallery", "#gallery", "all project screenshots"),
      sec("open-source", "#open-source", "github contributions"),
      sec("experience", "#experience", "career timeline"),
      sec("contact", "#contact", "get in touch"),

      // ── projects ──
      { name: "ls", desc: "list all projects", run: () => projects.map((p) => ({ kind: "out" as const, text: `${p.featured ? "★" : " "} ${p.slug.padEnd(20)} ${p.title}` })) },
      { name: "open", args: "<project>", desc: "open a project case study", run: (arg) => {
        if (!arg) return [{ kind: "err", text: "usage: open <project>  -  try `ls` for names" }];
        const m = projects.find((p) => p.slug === arg || p.slug.includes(arg) || p.title.toLowerCase().includes(arg));
        if (!m) return [{ kind: "err", text: `no project matches "${arg}"` }];
        close(); go(m.caseStudy ? `/work/${m.slug}` : m.github);
      }},
      { name: "repo", args: "<project>", desc: "open project github repo", run: (arg) => {
        if (!arg) return [{ kind: "err", text: "usage: repo <project>" }];
        const m = projects.find((p) => p.slug === arg || p.slug.includes(arg) || p.title.toLowerCase().includes(arg));
        if (!m) return [{ kind: "err", text: `no project matches "${arg}"` }];
        window.open(m.github, "_blank");
        return [{ kind: "hint", text: `opening ${m.github}` }];
      }},

      // ── links ──
      { name: "github", desc: "open github profile", run: () => { window.open(site.github, "_blank"); } },
      { name: "linkedin", desc: "open linkedin", run: () => { window.open(site.linkedin, "_blank"); } },
      { name: "whatsapp", desc: "start a whatsapp chat", run: () => { window.open(`https://wa.me/${site.whatsapp}?text=Hi%20Arun`, "_blank"); } },
      { name: "instagram", desc: "open instagram", run: () => { window.open("https://www.instagram.com/arundada9000/", "_blank"); } },
      { name: "facebook", desc: "open facebook", run: () => { window.open("https://www.facebook.com/arundada9000/", "_blank"); } },
      { name: "youtube", desc: "open youtube", run: () => { window.open("https://www.youtube.com/@arundada9000", "_blank"); } },
      { name: "twitter", desc: "open x/twitter", run: () => { window.open("https://x.com/arundada9000", "_blank"); } },
      { name: "email", desc: "email me", run: () => { window.location.href = `mailto:${site.email}`; } },
      { name: "resume", desc: "download resume", run: () => { window.open(site.resume, "_blank"); } },
      { name: "sajilo", desc: "open sajilo digital", run: () => { window.open(site.company.url, "_blank"); } },
      { name: "socials", desc: "list every link", run: () => site.socials.map((s) => ({ kind: "out" as const, text: `${s.label.toLowerCase().padEnd(10)} ${s.href}` })) },

      // ── fun ──
      { name: "neofetch", desc: "system info", run: () => [
        { kind: "out", text: "  _         arun@butwal" },
        { kind: "out", text: " /_\\        role   frontend dev · CTO @ sajilo digital" },
        { kind: "out", text: "/ _ \\       stack  react · next.js · typescript" },
        { kind: "out", text: "\\_/ \\_/      repos  70+ · uptime since 2023" },
      ]},
      { name: "matrix", desc: "digital rain", run: () => {
        const res: Line[] = [];
        for (let i = 0; i < 16; i++) {
          const row = Array.from({ length: 12 }, () => ASCII_MATRIX_CHARS[Math.floor(Math.random() * ASCII_MATRIX_CHARS.length)]).join(" ");
          res.push({ kind: "out", text: `  ${row}` });
        }
        res.push({ kind: "hint", text: "Wake up, Neo… type `matrix` again to see more." });
        return res;
      }},
      { name: "joke", desc: "random dev joke", run: () => [{ kind: "out", text: JOKES[Math.floor(Math.random() * JOKES.length)] }] },
      { name: "motivate", desc: "random motivation quote", run: () => {
        const q = QUOTES[Math.floor(Math.random() * QUOTES.length)];
        return [{ kind: "out", text: `"${q.text}"` }, { kind: "out", text: `  — ${q.author}` }];
      }},
      { name: "quote", desc: "random programming quote", run: () => {
        const q = QUOTES[Math.floor(Math.random() * QUOTES.length)];
        return [{ kind: "out", text: `"${q.text}"` }, { kind: "out", text: `  — ${q.author}` }];
      }},
      { name: "fortune", desc: "your fortune", run: () => [{ kind: "out", text: `🥠 ${FORTUNES[Math.floor(Math.random() * FORTUNES.length)]}` }] },
      { name: "ascii", desc: "show ascii art", run: () => [{ kind: "out", text: ASCII_ARUN }] },
      { name: "cowsay", args: "<text>", desc: "cow says what?", run: (arg) => {
        const msg = arg || "moo";
        const b = "-".repeat(msg.length + 2);
        return [{ kind: "out", text: ` ${b}` }, { kind: "out", text: `< ${msg} >` }, { kind: "out", text: ` ${b}` }, { kind: "out", text: ASCII_COW }];
      }},
      { name: "roll", desc: "roll a dice (1-6)", run: () => [{ kind: "out", text: `🎲 ${Math.floor(Math.random() * 6) + 1}` }] },
      { name: "coinflip", desc: "flip a coin", run: () => [{ kind: "out", text: `🪙 ${Math.random() > 0.5 ? "heads" : "tails"}` }] },
      { name: "8ball", args: "<question>", desc: "ask the magic 8-ball", run: (arg) => {
        if (!arg) return [{ kind: "err", text: "usage: 8ball <question>  -  e.g. 8ball will i get hired?" }];
        const A = ["As I see it, yes.", "Ask again later.", "Better not tell you now.", "Cannot predict now.", "Concentrate and ask again.", "Don't count on it.", "It is certain.", "It is decidedly so.", "Most likely.", "My reply is no.", "My sources say no.", "Outlook good.", "Outlook not so good.", "Reply hazy, try again.", "Signs point to yes.", "Very doubtful.", "Without a doubt.", "Yes.", "Yes — definitely.", "You may rely on it."];
        return [{ kind: "out", text: `🎱 ${A[Math.floor(Math.random() * A.length)]}` }];
      }},
      { name: "bofh", desc: "bastard operator from hell excuse", run: () => {
        const E = ["That's a feature, not a bug.", "It works on my machine.", "The DNS is propagating.", "Someone must have accidentally deleted the production database.", "The hamster that runs the server is on a coffee break.", "It was working in development.", "Did you try turning it off and on again?", "I think you have a virus.", "The server is under a DDoS attack. Probably.", "The upgrade broke backward compatibility.", "That functionality was deprecated last week.", "It's a caching issue.", "The intern pushed directly to main.", "Per my last email…", "We'll need to escalate this to tier 2 support."];
        return [{ kind: "out", text: `🤖 BOFH says: "${E[Math.floor(Math.random() * E.length)]}"` }];
      }},
      { name: "bingo", desc: "dev buzzword bingo", run: () => {
        const W = ["synergy", "agile", "blockchain", "AI-driven", "cloud-native", "microservices", "paradigm shift", "circle back", "deep dive", "leverage", "scalable", "robust", "next-gen", "omnichannel", "touch base", "bleeding edge"];
        const card = Array.from({ length: 9 }, (_, i) => `${i % 3 === 0 ? "[" : " "}${W[Math.floor(Math.random() * W.length)]}${i % 3 === 2 ? "]" : " "}`).join(" ");
        return [
          { kind: "out", text: "┌───────────────────── BUZZWORD BINGO ─────────────────────┐" },
          { kind: "out", text: `  ${card}` },
          { kind: "out", text: "└──────────────────────────────────────────────────────────┘" },
          { kind: "hint", text: "BINGO! (you win. or lose. depends on your meeting policy.)" },
        ];
      }},

      // ── dev ──
      { name: "man", args: "<command>", desc: "show command manual", run: (arg) => {
        if (!arg) return [{ kind: "err", text: "usage: man <command>" }];
        const m = list.find((c) => c.name === arg);
        if (!m) return [{ kind: "err", text: `no manual entry for "${arg}"` }];
        return [
          { kind: "out", text: "ARUN.SH(1)          User Commands          ARUN.SH(1)" },
          { kind: "out", text: "" },
          { kind: "out", text: "NAME" },
          { kind: "out", text: `  ${m.name} — ${m.desc}` },
          { kind: "out", text: "" },
          { kind: "out", text: "SYNOPSIS" },
          { kind: "out", text: `  ${m.name}${m.args ? ` ${m.args}` : ""}` },
          { kind: "out", text: "" },
          { kind: "out", text: "DESCRIPTION" },
          { kind: "out", text: `  ${m.desc}. See help for related commands.` },
          { kind: "out", text: "" },
          { kind: "out", text: "ARUN.SH(1)          arun@butwal          ARUN.SH(1)" },
        ];
      }},
      { name: "whoami", desc: "print bio", run: () => [
        { kind: "out", text: "arun neupane - frontend developer & CTO @ sajilo digital" },
        { kind: "out", text: "butwal, nepal · react · next.js · typescript" },
      ]},
      { name: "date", desc: "current time in nepal", run: () => [{ kind: "out", text: new Intl.DateTimeFormat("en-GB", { timeZone: "Asia/Kathmandu", dateStyle: "full", timeStyle: "medium" }).format(new Date()) + " NPT" }] },
      { name: "cal", desc: "show calendar", run: () => {
        const now = new Date();
        const m = now.getMonth(); const y = now.getFullYear();
        const monthName = now.toLocaleString("en-US", { month: "long", year: "numeric" });
        const firstDay = new Date(y, m, 1).getDay();
        const daysInMonth = new Date(y, m + 1, 0).getDate();
        const today = now.getDate();
        let grid = ""; let day = 1;
        for (let r = 0; r < 6; r++) {
          if (day > daysInMonth) break;
          let row = "";
          for (let c = 0; c < 7; c++) {
            if (r === 0 && c < firstDay) row += "   ";
            else if (day <= daysInMonth) { row += (day === today ? `[${String(day).padStart(2)}]` : ` ${String(day).padStart(2)} `); day++; }
          }
          grid += row + "\n";
        }
        return [{ kind: "out", text: `     ${monthName}` }, { kind: "out", text: "Su Mo Tu We Th Fr Sa" }, { kind: "out", text: grid.trimEnd() }];
      }},
      { name: "uptime", desc: "site uptime and stats", run: () => [
        { kind: "out", text: ` ${new Date().toLocaleTimeString("en-US", { timeZone: "Asia/Kathmandu" })} NPT` },
        { kind: "out", text: ` up ${Math.floor((Date.now() - new Date("2025-01-01").getTime()) / 86400000)} days` },
        { kind: "out", text: ` ${projects.length} projects · 70+ repos · 3 production systems` },
      ]},
      { name: "weather", desc: "weather in butwal, nepal", run: () => {
        const C = ["clear night", "partly cloudy", "warm haze", "monsoon drizzle", "cool breeze", "stars out", "mild", "dusty twilight"];
        return [
          { kind: "out", text: "🌤  Butwal, Nepal" },
          { kind: "out", text: `   ${Math.floor(Math.random() * 12 + 22)}°C · ${C[Math.floor(Math.random() * C.length)]}` },
          { kind: "out", text: `   humidity: ${Math.floor(Math.random() * 30 + 45)}% · wind: ${Math.floor(Math.random() * 10 + 2)} km/h` },
        ];
      }},
      { name: "ping", desc: "ping the server", run: () => [
        { kind: "out", text: "PING arun.sh (76.76.21.21): 56 data bytes" },
        { kind: "out", text: `64 bytes from 76.76.21.21: icmp_seq=0 ttl=117 time=${Math.floor(Math.random() * 20 + 5)}ms` },
        { kind: "out", text: `64 bytes from 76.76.21.21: icmp_seq=1 ttl=117 time=${Math.floor(Math.random() * 20 + 5)}ms` },
        { kind: "out", text: `64 bytes from 76.76.21.21: icmp_seq=2 ttl=117 time=${Math.floor(Math.random() * 20 + 5)}ms` },
        { kind: "out", text: "--- arun.sh ping statistics ---" },
        { kind: "out", text: "3 packets transmitted, 3 packets received, 0% packet loss" },
      ]},
      { name: "curl", args: "<url>", desc: "make a request", run: (arg) => [
        { kind: "out", text: "HTTP/1.1 200 OK" },
        { kind: "out", text: "Content-Type: text/plain" },
        { kind: "out", text: "Server: arun.sh/2.0 (NPT)" },
        { kind: "out", text: "" },
        { kind: "out", text: `✨ ${arg || "arun.sh"} says hello from Butwal, Nepal.` },
      ]},
      { name: "history", desc: "show command history", run: () => {
        if (!recall.length) return [{ kind: "hint", text: "no history yet." }];
        return recall.map((cmd, i) => ({ kind: "out" as const, text: `  ${recall.length - i}  ${cmd}` }));
      }},
      { name: "echo", args: "<text>", desc: "print text", run: (arg) => [{ kind: "out", text: arg || "" }] },

      // ── easter eggs ──
      { name: "sudo", desc: "nice try", run: () => [{ kind: "err", text: "arun is not in the sudoers file. this incident will be reported. 😏" }] },
      { name: "secret", desc: "", run: () => [{ kind: "hint", text: "🔓 the real secret: type `hire`." }] },
      { name: "hire", desc: "let's work together", run: () => { close(); go("#contact"); return [{ kind: "hint", text: "opening contact — I usually reply within 24h." }]; } },
      { name: "namaste", desc: "nepali greeting", run: () => [{ kind: "out", text: "नमस्ते! 🙏  Hello from Butwal, Nepal — the land of Everest, momo, and midnight coders." }] },
      { name: "hello", desc: "greeting", run: () => { const G = ["Hey!", "Hello!", "Hi there!", "Hey hey!", "Yo!", "What's up?", "Hola!", "Bonjour!", "Ciao!", "Heyo!"]; return [{ kind: "out", text: `${G[Math.floor(Math.random() * G.length)]} 👋` }]; } },
      { name: "coffee", desc: "virtual coffee", run: () => [{ kind: "out", text: "☕  Here's a hot cup of virtual coffee. Ethiopian Yirgacheffe, black. Just how devs like it." }] },
      { name: "tea", desc: "virtual tea", run: () => [{ kind: "out", text: "🍵  Here's a steaming cup of chiya — Nepali milk tea with ginger and cardamom. The official drink of late-night coding sessions." }] },
      { name: "compliment", desc: "get a compliment", run: () => {
        const C = ["You have a great taste in terminal commands.", "Your code is probably cleaner than mine.", "You're the kind of person who reads error messages. I respect that.", "Your pull request will be merged with zero comments.", "You look like someone who writes tests before code.", "Your commit messages are better than most poetry.", "You have the energy of someone who actually reads documentation.", "You're doing great. Keep going."];
        return [{ kind: "out", text: `💬 ${C[Math.floor(Math.random() * C.length)]}` }];
      }},
      { name: "invite", desc: "get an invite link", run: () => [{ kind: "out", text: "🔗 Send this to a friend: https://arunneupane.vercel.app" }, { kind: "out", text: "   Tell them to type `namaste` in the terminal." }] },
      { name: "banner", args: "<text>", desc: "display large banner text", run: (arg) => {
        if (!arg) return [{ kind: "err", text: "usage: banner <text>" }];
        const rows = ["", "", "", "", ""];
        for (const ch of arg.toUpperCase()) {
          const g = FONT_BLOCKS[ch] ?? Array(5).fill(" ????? ");
          for (let r = 0; r < 5; r++) rows[r] += ` ${g[r]}`;
        }
        return rows.map((r) => ({ kind: "out" as const, text: r }));
      }},
      { name: "figlet", args: "<text>", desc: "large ascii text", run: (arg) => {
        if (!arg) return [{ kind: "err", text: "usage: figlet <text>" }];
        return [{ kind: "out", text: "╔══════════════════════════════════╗" }, { kind: "out", text: `║     ${arg.toUpperCase().padEnd(30)} ║` }, { kind: "out", text: "╚══════════════════════════════════╝" }, { kind: "hint", text: "  (use `banner <text>` for a bigger version)" }];
      }},

      // ── misc ──
      { name: "clear", desc: "clear the screen", run: () => { setLines([]); } },
      { name: "cls", desc: "clear the screen", run: () => { setLines([]); } },
    ];
    return list;
  }, [musicState, playSong, pauseMusic, stopMusic, setVolume, recall, close]);

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
        setLines((prev) => [...prev, { kind: "err", text: `command not found: ${name} - type help` }]);
        return;
      }
      const out = cmd.run(arg);
      if (out) setLines((prev) => [...prev, ...out]);
    },
    [commands],
  );

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

  useEffect(() => {
    if (!open) return;
    inputRef.current?.focus();
    if (lines.length === 0) {
      setLines([{ kind: "hint", text: "arun.sh - type a command, or `help`. ↑↓ history · esc to close." }]);
    }
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, [open, lines.length]);

  useEffect(() => {
    bodyRef.current?.scrollTo({ top: bodyRef.current.scrollHeight });
  }, [lines]);

  useEffect(() => setGhost(0), [input]);

  if (!open) return null;

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") { setOpen(false); }
    else if (e.key === "Enter") {
      const chosen = input.trim() ? suggestions[ghost] : null;
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
          {musicState.current && (
            <span className="ml-auto font-mono text-xs text-amber">
              {musicState.playing ? "♪" : "⏸"} {musicState.current} · {musicState.volume}%
            </span>
          )}
        </div>

        <div ref={bodyRef} className="max-h-[40vh] overflow-y-auto px-4 py-3 font-mono text-sm">
          {lines.map((l, i) => (
            <p
              key={i}
              className={l.kind === "in" ? "text-fog" : l.kind === "err" ? "text-ember" : l.kind === "hint" ? "text-dust" : "whitespace-pre text-amber/90"}
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
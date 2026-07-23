"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { featuredProjects } from "@/lib/data/projects";

/**
 * The hero's right-side toy box: one terminal window, four interactive
 * "channels" - particle portrait, snake, project radar, living pixels.
 * Desktop-only (mounted behind lg:). Each toy runs its own canvas loop and
 * pauses when the tab is hidden or the hero is scrolled away.
 */

type Toy = "particles" | "snake" | "radar" | "life";

const TOYS: { id: Toy; label: string; hint: string }[] = [
  { id: "particles", label: "me", hint: "move your cursor through it" },
  { id: "snake", label: "snake", hint: "click to start · arrows or WASD" },
  { id: "radar", label: "radar", hint: "hover the blips · click to open" },
  { id: "life", label: "life", hint: "drag to paint new life" },
];

const AMBER = "255,180,84";
const EMBER = "255,122,47";

/* ── shared canvas plumbing ─────────────────────────────────── */

function useCanvas(draw: (ctx: CanvasRenderingContext2D, w: number, h: number) => (() => void) | void, running: boolean) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas || !running) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.scale(dpr, dpr);
    const cleanup = draw(ctx, rect.width, rect.height);
    return () => cleanup?.();
  }, [draw, running]);
  return ref;
}

/* ── 1. particle portrait ───────────────────────────────────── */

function Particles({ running }: { running: boolean }) {
  const draw = useCallback((ctx: CanvasRenderingContext2D, W: number, H: number) => {
    let raf = 0;
    let alive = true;
    const mouse = { x: -9999, y: -9999 };
    type P = { x: number; y: number; vx: number; vy: number; hx: number; hy: number; bucket: number };
    const buckets: P[][] = [[], [], [], [], []];

    const img = new Image();
    img.src = "/images/arun.png";
    img.onload = () => {
      if (!alive) return;
      const SW = 100;
      const SH = Math.round((img.height / img.width) * SW);
      const off = document.createElement("canvas");
      off.width = SW;
      off.height = SH;
      const octx = off.getContext("2d");
      if (!octx) return;
      octx.drawImage(img, 0, 0, SW, SH);
      const data = octx.getImageData(0, 0, SW, SH).data;

      // fit the sampled grid into the canvas, centered, with margin
      const scale = Math.min((W * 0.86) / SW, (H * 0.92) / SH);
      const ox = (W - SW * scale) / 2;
      const oy = (H - SH * scale) / 2;

      // prefer alpha cutout; fall back to luminance if the png is opaque
      let transparent = 0;
      for (let i = 3; i < data.length; i += 4) if (data[i] < 120) transparent++;
      const useAlpha = transparent / (SW * SH) > 0.05;

      for (let y = 0; y < SH; y += 2) {
        for (let x = 0; x < SW; x += 2) {
          const i = (y * SW + x) * 4;
          const a = data[i + 3];
          const lum = 0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2];
          const keep = useAlpha ? a > 120 : lum > 36;
          if (!keep) continue;
          const hx = ox + x * scale;
          const hy = oy + y * scale;
          const bucket = Math.min(4, Math.floor((lum / 255) * 5));
          buckets[bucket].push({ x: hx + (Math.random() - 0.5) * W, y: hy + (Math.random() - 0.5) * H, vx: 0, vy: 0, hx, hy, bucket });
        }
      }
      loop();
    };

    const styles = [0.22, 0.38, 0.55, 0.75, 0.95].map((a) => `rgba(${AMBER},${a})`);
    const R = 68;

    const loop = () => {
      if (!alive) return;
      ctx.clearRect(0, 0, W, H);
      for (let b = 0; b < 5; b++) {
        ctx.fillStyle = styles[b];
        const list = buckets[b];
        for (let i = 0; i < list.length; i++) {
          const p = list[i];
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < R * R) {
            const d = Math.sqrt(d2) || 1;
            const f = ((R - d) / R) * 3.2;
            p.vx += (dx / d) * f;
            p.vy += (dy / d) * f;
          }
          p.vx += (p.hx - p.x) * 0.03;
          p.vy += (p.hy - p.y) * 0.03;
          p.vx *= 0.86;
          p.vy *= 0.86;
          p.x += p.vx;
          p.y += p.vy;
          ctx.fillRect(p.x, p.y, 2.1, 2.1);
        }
      }
      raf = requestAnimationFrame(loop);
    };

    const canvas = ctx.canvas;
    // cache the rect: reading it per pointermove forces layout every event
    let crect: DOMRect | null = null;
    const invalidate = () => (crect = null);
    const onMove = (e: PointerEvent) => {
      crect ??= canvas.getBoundingClientRect();
      mouse.x = e.clientX - crect.left;
      mouse.y = e.clientY - crect.top;
    };
    const onLeave = () => {
      mouse.x = -9999;
      mouse.y = -9999;
    };
    canvas.addEventListener("pointermove", onMove);
    canvas.addEventListener("pointerleave", onLeave);
    window.addEventListener("scroll", invalidate, { passive: true });
    window.addEventListener("resize", invalidate);

    return () => {
      alive = false;
      cancelAnimationFrame(raf);
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("scroll", invalidate);
      window.removeEventListener("resize", invalidate);
    };
  }, []);

  const ref = useCanvas(draw, running);
  return <canvas ref={ref} className="h-full w-full" aria-label="Interactive particle portrait of Arun - move your cursor to scatter it" />;
}

/* ── 2. snake ───────────────────────────────────────────────── */

function Snake({ running }: { running: boolean }) {
  const draw = useCallback((ctx: CanvasRenderingContext2D, W: number, H: number) => {
    const COLS = 24;
    const CELL = Math.floor(W / COLS);
    const ROWS = Math.floor(H / CELL);
    const px = (W - COLS * CELL) / 2;
    const py = (H - ROWS * CELL) / 2;

    let snake = [{ x: 8, y: Math.floor(ROWS / 2) }];
    let dir = { x: 1, y: 0 };
    let queued = dir;
    let food = { x: 16, y: Math.floor(ROWS / 2) };
    let state: "idle" | "playing" | "dead" = "idle";
    let score = 0;
    let high = parseInt(localStorage.getItem("snake-high") || "0", 10);
    let raf = 0;
    let last = 0;
    let alive = true;

    const placeFood = () => {
      do {
        food = { x: Math.floor(Math.random() * COLS), y: Math.floor(Math.random() * ROWS) };
      } while (snake.some((s) => s.x === food.x && s.y === food.y));
    };

    const reset = () => {
      snake = [{ x: 8, y: Math.floor(ROWS / 2) }];
      dir = { x: 1, y: 0 };
      queued = dir;
      score = 0;
      placeFood();
    };

    const step = () => {
      dir = queued;
      const head = { x: snake[0].x + dir.x, y: snake[0].y + dir.y };
      if (head.x < 0 || head.y < 0 || head.x >= COLS || head.y >= ROWS || snake.some((s) => s.x === head.x && s.y === head.y)) {
        state = "dead";
        if (score > high) {
          high = score;
          localStorage.setItem("snake-high", String(high));
        }
        return;
      }
      snake.unshift(head);
      if (head.x === food.x && head.y === food.y) {
        score += 10;
        placeFood();
      } else {
        snake.pop();
      }
    };

    const render = () => {
      ctx.clearRect(0, 0, W, H);
      // board frame
      ctx.strokeStyle = `rgba(${AMBER},0.15)`;
      ctx.strokeRect(px + 0.5, py + 0.5, COLS * CELL - 1, ROWS * CELL - 1);
      // food
      ctx.fillStyle = `rgba(${EMBER},0.95)`;
      ctx.fillRect(px + food.x * CELL + 2, py + food.y * CELL + 2, CELL - 4, CELL - 4);
      // snake
      snake.forEach((s, i) => {
        ctx.fillStyle = i === 0 ? `rgba(${AMBER},1)` : `rgba(${AMBER},${Math.max(0.35, 1 - i * 0.06)})`;
        ctx.fillRect(px + s.x * CELL + 1, py + s.y * CELL + 1, CELL - 2, CELL - 2);
      });
      // hud
      ctx.fillStyle = `rgba(${AMBER},0.9)`;
      ctx.font = "12px monospace";
      ctx.textAlign = "left";
      ctx.fillText(`score ${score}`, px + 4, py - 6 < 10 ? 12 : py - 6);
      ctx.textAlign = "right";
      ctx.fillText(`best ${high}`, px + COLS * CELL - 4, py - 6 < 10 ? 12 : py - 6);
      // overlays
      if (state !== "playing") {
        ctx.fillStyle = "rgba(10,14,21,0.72)";
        ctx.fillRect(px, py, COLS * CELL, ROWS * CELL);
        ctx.fillStyle = `rgba(${AMBER},1)`;
        ctx.textAlign = "center";
        ctx.font = "bold 16px monospace";
        ctx.fillText(state === "idle" ? "▶ click to play" : `game over · ${score}`, W / 2, H / 2 - 6);
        ctx.font = "11px monospace";
        ctx.fillStyle = `rgba(${AMBER},0.7)`;
        ctx.fillText(state === "idle" ? "arrows or WASD" : "click to try again", W / 2, H / 2 + 14);
      }
    };

    const loop = (now: number) => {
      if (!alive) return;
      if (state === "playing" && now - last > 110) {
        last = now;
        step();
      }
      render();
      raf = requestAnimationFrame(loop);
    };

    const canvas = ctx.canvas;
    const onClick = () => {
      if (state !== "playing") {
        reset();
        state = "playing";
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (state !== "playing") return;
      const k = e.key.toLowerCase();
      const map: Record<string, { x: number; y: number }> = {
        arrowup: { x: 0, y: -1 }, w: { x: 0, y: -1 },
        arrowdown: { x: 0, y: 1 }, s: { x: 0, y: 1 },
        arrowleft: { x: -1, y: 0 }, a: { x: -1, y: 0 },
        arrowright: { x: 1, y: 0 }, d: { x: 1, y: 0 },
      };
      const next = map[k];
      if (!next) return;
      e.preventDefault();
      // no instant 180° turns
      if (next.x !== -dir.x || next.y !== -dir.y) queued = next;
    };

    canvas.addEventListener("click", onClick);
    window.addEventListener("keydown", onKey);
    raf = requestAnimationFrame(loop);

    return () => {
      alive = false;
      cancelAnimationFrame(raf);
      canvas.removeEventListener("click", onClick);
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  const ref = useCanvas(draw, running);
  return <canvas ref={ref} className="h-full w-full cursor-pointer" aria-label="Playable snake game - click to start, steer with arrow keys" />;
}

/* ── 3. project radar ───────────────────────────────────────── */

function Radar({ running }: { running: boolean }) {
  const draw = useCallback((ctx: CanvasRenderingContext2D, W: number, H: number) => {
    const cx = W / 2;
    const cy = H / 2;
    const R = Math.min(W, H) / 2 - 18;
    let sweep = 0;
    let raf = 0;
    let alive = true;
    let hovered = -1;

    const blips = featuredProjects.map((p, i) => {
      const angle = (i / featuredProjects.length) * Math.PI * 2 + 0.7;
      const radius = 0.42 + (i % 3) * 0.2;
      return { title: p.title, slug: p.slug, x: cx + Math.cos(angle) * R * radius, y: cy + Math.sin(angle) * R * radius, angle };
    });

    const loop = () => {
      if (!alive) return;
      ctx.clearRect(0, 0, W, H);

      // rings + crosshairs
      ctx.strokeStyle = `rgba(${AMBER},0.16)`;
      for (const f of [0.33, 0.66, 1]) {
        ctx.beginPath();
        ctx.arc(cx, cy, R * f, 0, Math.PI * 2);
        ctx.stroke();
      }
      ctx.beginPath();
      ctx.moveTo(cx - R, cy);
      ctx.lineTo(cx + R, cy);
      ctx.moveTo(cx, cy - R);
      ctx.lineTo(cx, cy + R);
      ctx.stroke();

      // sweep wedge
      const grad = ctx.createConicGradient ? ctx.createConicGradient(sweep, cx, cy) : null;
      if (grad) {
        grad.addColorStop(0, `rgba(${AMBER},0.28)`);
        grad.addColorStop(0.12, "rgba(255,180,84,0)");
        grad.addColorStop(1, "rgba(255,180,84,0)");
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.arc(cx, cy, R, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.strokeStyle = `rgba(${AMBER},0.85)`;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + Math.cos(sweep) * R, cy + Math.sin(sweep) * R);
      ctx.stroke();

      // blips: glow right after the sweep passes them
      blips.forEach((b, i) => {
        const diff = (sweep - b.angle + Math.PI * 4) % (Math.PI * 2);
        const heat = Math.max(0, 1 - diff / 1.6);
        const active = i === hovered;
        ctx.fillStyle = active ? `rgba(${EMBER},1)` : `rgba(${AMBER},${0.25 + heat * 0.75})`;
        ctx.beginPath();
        ctx.arc(b.x, b.y, active ? 6 : 3.5 + heat * 2, 0, Math.PI * 2);
        ctx.fill();
        if (active || heat > 0.55) {
          ctx.fillStyle = active ? `rgba(${EMBER},1)` : `rgba(${AMBER},${heat})`;
          ctx.font = "11px monospace";
          ctx.textAlign = b.x > cx ? "right" : "left";
          ctx.fillText(b.title.toLowerCase(), b.x + (b.x > cx ? -10 : 10), b.y - 8);
        }
      });

      sweep += 0.017;
      raf = requestAnimationFrame(loop);
    };

    const canvas = ctx.canvas;
    let crect: DOMRect | null = null;
    const invalidate = () => (crect = null);
    const hit = (e: PointerEvent) => {
      crect ??= canvas.getBoundingClientRect();
      const mx = e.clientX - crect.left;
      const my = e.clientY - crect.top;
      hovered = blips.findIndex((b) => (b.x - mx) ** 2 + (b.y - my) ** 2 < 16 ** 2);
      canvas.style.cursor = hovered >= 0 ? "pointer" : "default";
    };
    const onClick = () => {
      if (hovered >= 0) window.location.assign(`/work/${blips[hovered].slug}`);
    };
    canvas.addEventListener("pointermove", hit);
    canvas.addEventListener("click", onClick);
    window.addEventListener("scroll", invalidate, { passive: true });
    window.addEventListener("resize", invalidate);
    raf = requestAnimationFrame(loop);

    return () => {
      alive = false;
      cancelAnimationFrame(raf);
      canvas.removeEventListener("pointermove", hit);
      canvas.removeEventListener("click", onClick);
      window.removeEventListener("scroll", invalidate);
      window.removeEventListener("resize", invalidate);
    };
  }, []);

  const ref = useCanvas(draw, running);
  return <canvas ref={ref} className="h-full w-full" aria-label="Project radar - featured projects appear as blips, click one to open its case study" />;
}

/* ── 4. game of life ────────────────────────────────────────── */

function Life({ running }: { running: boolean }) {
  const draw = useCallback((ctx: CanvasRenderingContext2D, W: number, H: number) => {
    const CELL = 7;
    const COLS = Math.floor(W / CELL);
    const ROWS = Math.floor(H / CELL);
    let grid = new Uint8Array(COLS * ROWS);
    let next = new Uint8Array(COLS * ROWS);
    let raf = 0;
    let last = 0;
    let alive = true;
    let painting = false;

    const seed = () => {
      for (let i = 0; i < grid.length; i++) grid[i] = Math.random() < 0.14 ? 1 : 0;
    };
    seed();

    const stepLife = () => {
      let population = 0;
      for (let y = 0; y < ROWS; y++) {
        for (let x = 0; x < COLS; x++) {
          let n = 0;
          for (let dy = -1; dy <= 1; dy++) {
            for (let dx = -1; dx <= 1; dx++) {
              if (!dx && !dy) continue;
              n += grid[((y + dy + ROWS) % ROWS) * COLS + ((x + dx + COLS) % COLS)];
            }
          }
          const i = y * COLS + x;
          next[i] = grid[i] ? (n === 2 || n === 3 ? 1 : 0) : n === 3 ? 1 : 0;
          population += next[i];
        }
      }
      [grid, next] = [next, grid];
      if (population < COLS * ROWS * 0.015) seed(); // never let it die out
    };

    const render = () => {
      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = `rgba(${AMBER},0.85)`;
      for (let y = 0; y < ROWS; y++) {
        for (let x = 0; x < COLS; x++) {
          if (grid[y * COLS + x]) ctx.fillRect(x * CELL + 1, y * CELL + 1, CELL - 2, CELL - 2);
        }
      }
    };

    const loop = (now: number) => {
      if (!alive) return;
      if (now - last > 130) {
        last = now;
        stepLife();
      }
      render();
      raf = requestAnimationFrame(loop);
    };

    const canvas = ctx.canvas;
    let crect: DOMRect | null = null;
    const invalidate = () => (crect = null);
    const paint = (e: PointerEvent) => {
      crect ??= canvas.getBoundingClientRect();
      const gx = Math.floor((e.clientX - crect.left) / CELL);
      const gy = Math.floor((e.clientY - crect.top) / CELL);
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          const x = gx + dx;
          const y = gy + dy;
          if (x >= 0 && y >= 0 && x < COLS && y < ROWS && Math.random() > 0.3) grid[y * COLS + x] = 1;
        }
      }
    };
    const down = (e: PointerEvent) => {
      painting = true;
      paint(e);
    };
    const move = (e: PointerEvent) => painting && paint(e);
    const up = () => (painting = false);
    canvas.addEventListener("pointerdown", down);
    canvas.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    window.addEventListener("scroll", invalidate, { passive: true });
    window.addEventListener("resize", invalidate);
    raf = requestAnimationFrame(loop);

    return () => {
      alive = false;
      cancelAnimationFrame(raf);
      canvas.removeEventListener("pointerdown", down);
      canvas.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      window.removeEventListener("scroll", invalidate);
      window.removeEventListener("resize", invalidate);
    };
  }, []);

  const ref = useCanvas(draw, running);
  return <canvas ref={ref} className="h-full w-full cursor-crosshair" aria-label="Living pixel canvas - drag your cursor to paint new cells" />;
}

/* ── the window + channel switcher ──────────────────────────── */

export function HeroPlayground() {
  const [toy, setToy] = useState<Toy>("particles");
  const [running, setRunning] = useState(true);
  const [reduced, setReduced] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  // restore last channel
  useEffect(() => {
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    const saved = localStorage.getItem("hero-toy") as Toy | null;
    if (saved && TOYS.some((t) => t.id === saved)) setToy(saved);
  }, []);

  // pause when off-screen or tab hidden
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    let inView = true;
    const io = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      setRunning(inView && !document.hidden);
    });
    io.observe(el);
    const onVis = () => setRunning(inView && !document.hidden);
    document.addEventListener("visibilitychange", onVis);
    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  const pick = (id: Toy) => {
    setToy(id);
    localStorage.setItem("hero-toy", id);
  };

  const current = TOYS.find((t) => t.id === toy)!;

  return (
    <div ref={wrapRef} className="overflow-hidden rounded-lg border border-line bg-panel/80 shadow-2xl shadow-black/40 backdrop-blur-sm">
      {/* title bar with channel tabs */}
      <div className="flex items-center gap-2 border-b border-line px-4 py-2.5">
        <span className="size-2.5 rounded-full bg-ember/70" />
        <span className="size-2.5 rounded-full bg-amber/70" />
        <span className="size-2.5 rounded-full bg-dust/40" />
        <div className="ml-auto flex gap-1" role="tablist" aria-label="Playground channels">
          {TOYS.map((t) => (
            <button
              key={t.id}
              type="button"
              role="tab"
              aria-selected={toy === t.id}
              onClick={() => pick(t.id)}
              className={`rounded px-2 py-0.5 font-mono text-[11px] transition-colors ${
                toy === t.id ? "bg-amber/15 text-amber" : "text-dust hover:text-fog"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* stage */}
      <div className="relative aspect-[4/4.4] bg-night/70">
        {reduced ? (
          /* reduced motion: a calm still portrait instead of animation */
          /* eslint-disable-next-line @next/next/no-img-element */
          <img src="/images/arun.png" alt="Portrait of Arun Neupane" className="h-full w-full object-contain p-6 opacity-90" />
        ) : (
          <>
            {toy === "particles" && <Particles running={running} />}
            {toy === "snake" && <Snake running={running} />}
            {toy === "radar" && <Radar running={running} />}
            {toy === "life" && <Life running={running} />}
          </>
        )}
      </div>

      {/* hint line */}
      <p className="border-t border-line px-4 py-2 font-mono text-[11px] text-dust">
        <span className="text-amber">$</span> {reduced ? "animations off - honoring your motion settings" : current.hint}
      </p>
    </div>
  );
}

"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { soundTap, soundSuccess } from "@/lib/sounds";
import { hapticTap } from "@/lib/haptics";

type Frame = { arr: number[]; active: number[]; sorted: boolean };

type Algo = "bubble" | "selection" | "insertion" | "quick" | "merge";

const ALGOS: { id: Algo; label: string }[] = [
  { id: "bubble", label: "bubble" },
  { id: "selection", label: "selection" },
  { id: "insertion", label: "insertion" },
  { id: "quick", label: "quick" },
  { id: "merge", label: "merge" },
];

const COMPLEXITY: Record<Algo, string> = {
  bubble: "O(n²) · stable · the one everyone learns first",
  selection: "O(n²) · in-place · fewest swaps",
  insertion: "O(n²) · fast on nearly-sorted data",
  quick: "O(n log n) avg · divide & conquer, in-place",
  merge: "O(n log n) · stable · divide & conquer",
};

function randomArray(n: number): number[] {
  return Array.from({ length: n }, () => 8 + Math.floor(Math.random() * 92));
}

function seedArray(n: number): number[] {
  return Array.from({ length: n }, (_, i) => 12 + ((i * 37 + 17) % 88));
}

function buildFrames(input: number[], algo: Algo): Frame[] {
  const arr = [...input];
  const frames: Frame[] = [];
  const snap = (active: number[]) => frames.push({ arr: [...arr], active, sorted: false });

  if (algo === "bubble") {
    for (let i = 0; i < arr.length - 1; i++) {
      for (let j = 0; j < arr.length - i - 1; j++) {
        snap([j, j + 1]);
        if (arr[j] > arr[j + 1]) {
          [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
          snap([j, j + 1]);
        }
      }
    }
  } else if (algo === "selection") {
    for (let i = 0; i < arr.length; i++) {
      let min = i;
      for (let j = i + 1; j < arr.length; j++) {
        snap([min, j]);
        if (arr[j] < arr[min]) min = j;
      }
      if (min !== i) {
        [arr[i], arr[min]] = [arr[min], arr[i]];
        snap([i, min]);
      }
    }
  } else if (algo === "insertion") {
    for (let i = 1; i < arr.length; i++) {
      const key = arr[i];
      let j = i - 1;
      while (j >= 0 && arr[j] > key) {
        snap([j, j + 1]);
        arr[j + 1] = arr[j];
        j--;
      }
      arr[j + 1] = key;
      snap([j + 1, i]);
    }
  } else if (algo === "quick") {
    const qs = (lo: number, hi: number) => {
      if (lo >= hi) return;
      const pivot = arr[hi];
      let i = lo;
      for (let j = lo; j < hi; j++) {
        snap([j, hi]);
        if (arr[j] < pivot) {
          [arr[i], arr[j]] = [arr[j], arr[i]];
          snap([i, j]);
          i++;
        }
      }
      [arr[i], arr[hi]] = [arr[hi], arr[i]];
      snap([i, hi]);
      qs(lo, i - 1);
      qs(i + 1, hi);
    };
    qs(0, arr.length - 1);
  } else {
    const merge = (lo: number, mid: number, hi: number) => {
      const left = arr.slice(lo, mid + 1);
      const right = arr.slice(mid + 1, hi + 1);
      let i = 0,
        j = 0,
        k = lo;
      while (i < left.length && j < right.length) {
        snap([k]);
        if (left[i] <= right[j]) arr[k++] = left[i++];
        else arr[k++] = right[j++];
      }
      while (i < left.length) {
        arr[k++] = left[i++];
        snap([k - 1]);
      }
      while (j < right.length) {
        arr[k++] = right[j++];
        snap([k - 1]);
      }
    };
    const ms = (lo: number, hi: number) => {
      if (lo >= hi) return;
      const mid = (lo + hi) >> 1;
      ms(lo, mid);
      ms(mid + 1, hi);
      merge(lo, mid, hi);
    };
    ms(0, arr.length - 1);
  }

  frames.push({ arr: [...arr], active: [], sorted: true });
  return frames;
}

export function SortingVisualizer() {
  const [size, setSize] = useState(28);
  const [speed, setSpeed] = useState(45);
  const [algo, setAlgo] = useState<Algo>("bubble");
  const [base, setBase] = useState<number[]>(() => seedArray(28));
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);

  const frames = useMemo(() => buildFrames(base, algo), [base, algo]);
  const frame = frames[Math.min(step, frames.length - 1)];
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const shuffle = useCallback(
    (n = size) => {
      setPlaying(false);
      setStep(0);
      setBase(randomArray(n));
    },
    [size]
  );

  useEffect(() => {
    setBase(randomArray(28));
  }, []);

  useEffect(() => {
    if (!playing) return;
    if (step >= frames.length - 1) {
      setPlaying(false);
      return;
    }
    timer.current = setTimeout(() => setStep((s) => s + 1), speed);
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [playing, step, frames.length, speed]);

  const maxVal = 100;
  const done = frame.sorted;

  return (
    <div className="ios-glass-card rounded-[20px] p-4 sm:p-6" data-cursor>
      <div className="flex h-56 items-end gap-[2px] rounded-[12px] bg-surface-bg/60 p-3 sm:h-72">
        {frame.arr.map((v, i) => {
          const hot = frame.active.includes(i);
          return (
            <div
              key={i}
              className="flex-1 rounded-t-[2px] transition-[height] duration-75"
              style={{
                height: `${(v / maxVal) * 100}%`,
                background: done
                  ? "var(--color-accent)"
                  : hot
                    ? "var(--color-accent-hover)"
                    : "color-mix(in srgb, var(--color-accent) 45%, var(--color-surface-border))",
                boxShadow: hot ? `0 0 12px color-mix(in srgb, var(--color-accent) 60%, transparent)` : "none",
              }}
            />
          );
        })}
      </div>

      <p className="mt-3 font-mono text-xs text-dust" role="status" aria-live="polite">
        <span className="text-amber">{algo}Sort()</span> · {COMPLEXITY[algo]} ·{" "}
        <span className="text-fog">
          {done ? "sorted ✓" : `step ${step}/${frames.length - 1}`}
        </span>
      </p>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <div className="flex flex-wrap gap-1.5">
          {ALGOS.map((a) => (
            <button
              key={a.id}
              type="button"
              onClick={() => {
                soundTap();
                hapticTap();
                setAlgo(a.id);
                setStep(0);
                setPlaying(false);
              }}
              className={`ios-touch rounded-[10px] border px-2.5 py-1.5 font-mono text-xs transition-all duration-150 active:scale-[0.97] ${
                algo === a.id ? "border-amber bg-amber/10 text-amber" : "border-line/50 text-dust hover:border-amber/50 hover:text-fog"
              }`}
            >
              {a.label}
            </button>
          ))}
        </div>

        <div className="ml-auto flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              soundTap();
              hapticTap();
              if (done) {
                setStep(0);
                setPlaying(true);
              } else {
                setPlaying((p) => !p);
              }
            }}
            className="ios-touch rounded-[12px] bg-amber px-4 py-2 font-mono text-xs font-bold text-night transition-all duration-150 hover:bg-ember active:scale-[0.97]"
          >
            {done ? "↻ replay" : playing ? "❚❚ pause" : "▶ play"}
          </button>
          <button
            type="button"
            onClick={() => { soundTap(); hapticTap(); shuffle(); }}
            className="ios-touch rounded-[12px] border border-line/50 px-3 py-2 font-mono text-xs text-dust transition-all duration-150 hover:border-amber hover:text-amber active:scale-[0.97]"
          >
            shuffle
          </button>
        </div>
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <label className="flex items-center gap-3 font-mono text-xs text-dust">
          size
          <input
            type="range"
            min={8}
            max={60}
            value={size}
            onChange={(e) => {
              const n = Number(e.target.value);
              setSize(n);
              shuffle(n);
            }}
            className="flex-1 accent-amber"
          />
          <span className="w-6 text-right text-fog">{size}</span>
        </label>
        <label className="flex items-center gap-3 font-mono text-xs text-dust">
          speed
          <input
            type="range"
            min={5}
            max={120}
            value={125 - speed}
            onChange={(e) => setSpeed(125 - Number(e.target.value))}
            className="flex-1 accent-amber"
          />
          <span className="w-10 text-right text-fog">{speed}ms</span>
        </label>
      </div>
    </div>
  );
}

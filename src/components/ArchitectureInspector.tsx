"use client";

import { useState } from "react";
import { soundTap, soundPop } from "@/lib/sounds";
import { hapticTap } from "@/lib/haptics";
import { ArrowRight, Sparkles } from "./Icon";

type Step = {
  label: string;
  sub: string;
  badge: string;
  details: string;
  tech: string;
};

const BLUEPRINTS: Record<string, { title: string; steps: Step[] }> = {
  "sajilo-sahayata": {
    title: "Offline-First Sync & Conflict Resolution Pipeline",
    steps: [
      {
        label: "1. Incident Ingestion",
        sub: "Client-side report capture",
        badge: "0ms latency",
        details: "Citizen logs disaster location + photo. Works even with zero cellular signal in rural Nepal.",
        tech: "IndexedDB + ServiceWorker",
      },
      {
        label: "2. Queue & Serialization",
        sub: "Background sync queue",
        badge: "Local buffer",
        details: "Report payloads are hashed, timestamped with monotonic clocks, and persisted to persistent cache.",
        tech: "Workbox BackgroundSync",
      },
      {
        label: "3. Cellular Handshake",
        sub: "Network reconnect detector",
        badge: "Auto retry",
        details: "As soon as network connectivity is detected, queued batches replay sequentially over HTTPS with exponential backoff.",
        tech: "Navigator.onLine + Edge Sync",
      },
      {
        label: "4. Cloud Realtime Ingestion",
        sub: "Supabase & Police broadcast",
        badge: "Realtime",
        details: "Disaster coordinates update live on the Nepal Police & Red Cross command map via WebSockets.",
        tech: "Supabase Realtime + PostGIS",
      },
    ],
  },
  "roomeo": {
    title: "Map-First Geospatial Search Pipeline",
    steps: [
      {
        label: "1. Viewport Bounding Box",
        sub: "Leaflet view listener",
        badge: "Debounced 150ms",
        details: "Tracks user's map panning and bounds `[sw_lat, sw_lng, ne_lat, ne_lng]` with zero UI stutter.",
        tech: "Leaflet.js + Canvas Layers",
      },
      {
        label: "2. Spatial Radius Indexing",
        sub: "PostgreSQL query filter",
        badge: "Index Scan",
        details: "Executes `ST_MakeEnvelope` spatial queries filtering available rooms, budget, and amenities within viewport.",
        tech: "PostGIS Spatial Index",
      },
      {
        label: "3. Client Cluster & Cache",
        sub: "Supercluster aggregation",
        badge: "60 FPS",
        details: "1,000+ rental listings dynamically cluster into grouped hotspots with instant hover previews.",
        tech: "Supercluster.js WebWorker",
      },
      {
        label: "4. Instant Room Sheet",
        sub: "Zero-layout-shift card",
        badge: "< 50ms",
        details: "Clicking any pin reveals verified landlord contacts, photo carousel, and GPS directions.",
        tech: "Framer Motion + Dialog",
      },
    ],
  },
  "sajilo-digital": {
    title: "Edge SSR & Terminal Canvas Pipeline",
    steps: [
      {
        label: "1. Edge SSR & Hydration",
        sub: "Next.js App Router",
        badge: "Edge Cached",
        details: "Pages render at Kathmandu and Singapore edge nodes with 99+ Lighthouse performance.",
        tech: "Vercel Edge Network",
      },
      {
        label: "2. Vector Matrix Shader",
        sub: "Hardware-accelerated canvas",
        badge: "WebGL 2",
        details: "Terminal animations, radar sweeps, and particle grids run on a throttled requestAnimationFrame loop.",
        tech: "HTML5 Canvas API",
      },
      {
        label: "3. Sound FX Synthesizer",
        sub: "Synthesized audio feedback",
        badge: "Zero KB assets",
        details: "Oscillators generate realtime sine and square waves without loading heavy external sound files.",
        tech: "Web Audio API",
      },
    ],
  },
};

export function ArchitectureInspector({ slug }: { slug: string }) {
  const [activeStep, setActiveStep] = useState(0);
  const blueprint = BLUEPRINTS[slug];
  if (!blueprint) return null;

  const current = blueprint.steps[activeStep] ?? blueprint.steps[0];

  return (
    <div className="ios-glass-card rounded-[20px] border border-line/60 bg-panel/80 p-5 shadow-lg">
      <div className="flex items-center justify-between border-b border-line/40 pb-3">
        <div className="flex items-center gap-2">
          <Sparkles size={16} className="text-amber" />
          <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-fog">
            Interactive Architecture Blueprint
          </h3>
        </div>
        <span className="rounded-[8px] bg-line/40 px-2 py-0.5 font-mono text-[10px] text-amber">
          Step {activeStep + 1} of {blueprint.steps.length}
        </span>
      </div>

      <p className="mt-3 font-mono text-xs text-dust">{blueprint.title}</p>

      {/* Step Pills */}
      <div className="mt-4 flex flex-wrap gap-2">
        {blueprint.steps.map((s, i) => (
          <button
            key={s.label}
            type="button"
            onClick={() => {
              soundPop();
              hapticTap();
              setActiveStep(i);
            }}
            className={`ios-touch flex items-center gap-1.5 rounded-[12px] border px-3 py-2 text-xs font-mono transition-all duration-150 active:scale-95 ${
              i === activeStep
                ? "border-amber bg-amber/15 text-amber font-bold shadow-[0_0_10px_rgba(255,180,84,0.2)]"
                : "border-line/60 bg-line/20 text-dust hover:border-line hover:text-fog"
            }`}
          >
            <span>{s.label.split(". ")[0]}</span>
            <span className="hidden sm:inline">{s.label.split(". ")[1]}</span>
          </button>
        ))}
      </div>

      {/* Active Step Details */}
      <div className="mt-4 rounded-[14px] border border-line/50 bg-night/80 p-4 font-mono text-xs">
        <div className="flex items-center justify-between">
          <span className="text-sm font-bold text-fog">{current.label}</span>
          <span className="rounded-[6px] border border-amber/50 px-2 py-0.5 text-[10px] text-amber">
            {current.badge}
          </span>
        </div>
        <p className="mt-2 text-dust leading-relaxed">{current.details}</p>
        <div className="mt-3 flex items-center justify-between border-t border-line/30 pt-2 text-[11px] text-dust">
          <span>Technology: <span className="text-fog">{current.tech}</span></span>
          {activeStep < blueprint.steps.length - 1 && (
            <button
              type="button"
              onClick={() => {
                soundTap();
                hapticTap();
                setActiveStep((p) => p + 1);
              }}
              className="text-amber hover:underline inline-flex items-center gap-1"
            >
              next step <ArrowRight size={12} className="inline" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
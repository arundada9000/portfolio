"use client";

import { useState } from "react";
import Link from "next/link";
import { galleries } from "@/lib/data/gallery";
import { Section } from "./Section";
import { Lightbox } from "./Lightbox";

export function Gallery() {
  // which project's lightbox is open, and at which image
  const [active, setActive] = useState<{ key: string; index: number } | null>(null);
  const current = active ? galleries.find((g) => g.key === active.key) : undefined;

  return (
    <Section id="gallery" command="open ~/screenshots/*" title="Gallery">
      <p className="mb-10 max-w-2xl text-lg text-dust">
        {galleries.length} projects, {galleries.reduce((n, g) => n + g.images.length, 0)} screens.
        Click any project to flip through its shots.
      </p>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {galleries.map((g) => (
          <div
            key={g.key}
            className="group relative aspect-[4/3] overflow-hidden rounded-lg border border-line bg-night"
          >
            <button
              type="button"
              onClick={() => setActive({ key: g.key, index: 0 })}
              className="absolute inset-0"
              aria-label={`View ${g.title} screenshots`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={g.cover}
                alt={`${g.title} cover`}
                loading="lazy"
                className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
              />
              <span className="absolute inset-0 bg-gradient-to-t from-night via-night/30 to-transparent opacity-80 transition-opacity group-hover:opacity-95" />
            </button>

            {/* caption */}
            <div className="pointer-events-none absolute inset-x-0 bottom-0 p-3">
              <p className="text-display text-sm text-fog">{g.title}</p>
              <p className="font-mono text-[10px] text-dust">
                {g.tag} · {g.images.length} shots
              </p>
            </div>

            {/* case-study link if one exists */}
            {g.slug && (
              <Link
                href={`/work/${g.slug}`}
                className="absolute right-2 top-2 rounded border border-amber/50 bg-panel/80 px-2 py-0.5 font-mono text-[10px] text-amber opacity-0 backdrop-blur transition-opacity hover:bg-amber hover:text-night group-hover:opacity-100"
              >
                case study →
              </Link>
            )}
          </div>
        ))}
      </div>

      {current && active && (
        <Lightbox
          images={current.images}
          index={active.index}
          title={current.title}
          onClose={() => setActive(null)}
          onNavigate={(i) => setActive({ key: active.key, index: i })}
        />
      )}
    </Section>
  );
}

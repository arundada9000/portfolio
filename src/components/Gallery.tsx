"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { galleries } from "@/lib/data/gallery";
import { Section } from "./Section";
import { Lightbox } from "./Lightbox";
import { soundPop } from "@/lib/sounds";
import { hapticTap } from "@/lib/haptics";

export function Gallery() {
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
            className="group relative aspect-[4/3] overflow-hidden rounded-[16px] border border-line/50 bg-night"
          >
            <button
              type="button"
              onClick={() => { soundPop(); hapticTap(); setActive({ key: g.key, index: 0 }); }}
              className="absolute inset-0"
              aria-label={`View ${g.title} screenshots`}
            >
              <Image
                src={g.cover}
                alt={`${g.title} cover`}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
              />
              <span className="absolute inset-0 bg-gradient-to-t from-night via-night/30 to-transparent opacity-80 transition-opacity group-hover:opacity-95" />
            </button>

            <div className="pointer-events-none absolute inset-x-0 bottom-0 p-3">
              <p className="text-display text-sm text-fog">{g.title}</p>
              <p className="font-mono text-[10px] text-dust">
                {g.tag} · {g.images.length} shots
              </p>
            </div>

            {g.slug && (
              <Link
                href={`/work/${g.slug}`}
                className="absolute right-2 top-2 rounded-[8px] border border-amber/50 bg-panel/80 px-2 py-1 font-mono text-[10px] text-amber opacity-0 backdrop-blur-sm transition-all duration-200 hover:bg-amber hover:text-night group-hover:opacity-100 active:scale-95"
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

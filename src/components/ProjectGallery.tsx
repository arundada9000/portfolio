"use client";

import { useState } from "react";
import { Lightbox } from "./Lightbox";

/** Case-study screenshot strip. Renders the project's real screenshots and
 *  opens a lightbox on click. Hidden entirely when there are no images. */
export function ProjectGallery({ images, title }: { images: string[]; title: string }) {
  const [open, setOpen] = useState<number | null>(null);
  if (!images.length) return null;

  return (
    <section>
      <h2 className="text-eyebrow mb-4">## screens</h2>
      <div className="grid gap-3 sm:grid-cols-2">
        {images.map((src, i) => (
          <button
            key={src}
            type="button"
            onClick={() => setOpen(i)}
            className={`group relative overflow-hidden rounded-lg border border-line bg-night ${
              i === 0 ? "sm:col-span-2" : ""
            }`}
            aria-label={`View screenshot ${i + 1} of ${title}`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={src}
              alt={`${title} screenshot ${i + 1}`}
              loading="lazy"
              className="w-full transition-transform duration-500 group-hover:scale-[1.03]"
            />
            <span className="pointer-events-none absolute inset-0 bg-night/0 transition-colors group-hover:bg-night/20" />
            <span className="pointer-events-none absolute bottom-2 right-2 rounded border border-line bg-panel/80 px-2 py-0.5 font-mono text-[10px] text-dust opacity-0 backdrop-blur transition-opacity group-hover:opacity-100">
              expand ⤢
            </span>
          </button>
        ))}
      </div>

      {open !== null && (
        <Lightbox images={images} index={open} title={title} onClose={() => setOpen(null)} onNavigate={setOpen} />
      )}
    </section>
  );
}

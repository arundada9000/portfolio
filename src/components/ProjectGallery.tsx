"use client";

import { useState } from "react";
import Image from "next/image";
import { Lightbox } from "./Lightbox";
import { soundPop } from "@/lib/sounds";
import { hapticTap } from "@/lib/haptics";

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
            onClick={() => { soundPop(); hapticTap(); setOpen(i); }}
            className={`group relative overflow-hidden rounded-[16px] border border-line/50 bg-surface-bg ${
              i === 0 ? "sm:col-span-2" : ""
            }`}
            aria-label={`View screenshot ${i + 1} of ${title}`}
          >
            <Image
              src={src}
              alt={`${title} screenshot ${i + 1}`}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 50vw"
              className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            />
            <span className="pointer-events-none absolute inset-0 bg-surface-bg/0 transition-colors group-hover:bg-surface-bg/20" />
            <span className="pointer-events-none absolute bottom-2 right-2 rounded-[8px] border border-line/50 bg-panel/80 px-2 py-0.5 font-mono text-[10px] text-dust opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100">
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

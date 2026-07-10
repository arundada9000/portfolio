"use client";

import { useEffect } from "react";

/** Full-screen image viewer with keyboard + click navigation. */
export function Lightbox({
  images,
  index,
  title,
  onClose,
  onNavigate,
}: {
  images: string[];
  index: number;
  title: string;
  onClose: () => void;
  onNavigate: (i: number) => void;
}) {
  const prev = () => onNavigate((index - 1 + images.length) % images.length);
  const next = () => onNavigate((index + 1) % images.length);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowLeft") prev();
      else if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, images.length]);

  return (
    <div
      className="fixed inset-0 z-[95] flex flex-col items-center justify-center bg-night/95 p-4 backdrop-blur-sm sm:p-8"
      role="dialog"
      aria-modal="true"
      aria-label={`${title} screenshots`}
      onClick={onClose}
    >
      {/* top bar */}
      <div className="mb-4 flex w-full max-w-5xl items-center justify-between font-mono text-xs text-dust" onClick={(e) => e.stopPropagation()}>
        <span>
          <span className="text-amber">{title}</span> · {index + 1}/{images.length}
        </span>
        <button type="button" onClick={onClose} className="border border-line px-3 py-1 transition-colors hover:border-amber hover:text-amber">
          esc ✕
        </button>
      </div>

      {/* image */}
      <div className="relative flex max-h-[78vh] w-full max-w-5xl items-center justify-center" onClick={(e) => e.stopPropagation()}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={images[index]}
          alt={`${title} screenshot ${index + 1}`}
          className="max-h-[78vh] w-auto max-w-full rounded-lg border border-line object-contain"
        />
        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={prev}
              aria-label="Previous"
              className="absolute left-2 flex size-10 items-center justify-center rounded-full border border-line bg-panel/80 font-mono text-fog backdrop-blur transition-colors hover:border-amber hover:text-amber"
            >
              ‹
            </button>
            <button
              type="button"
              onClick={next}
              aria-label="Next"
              className="absolute right-2 flex size-10 items-center justify-center rounded-full border border-line bg-panel/80 font-mono text-fog backdrop-blur transition-colors hover:border-amber hover:text-amber"
            >
              ›
            </button>
          </>
        )}
      </div>

      {/* thumbnails */}
      {images.length > 1 && (
        <div className="mt-4 flex max-w-5xl gap-2 overflow-x-auto" onClick={(e) => e.stopPropagation()}>
          {images.map((src, i) => (
            <button
              key={src}
              type="button"
              onClick={() => onNavigate(i)}
              className={`h-14 w-20 shrink-0 overflow-hidden rounded border transition-opacity ${
                i === index ? "border-amber opacity-100" : "border-line opacity-50 hover:opacity-80"
              }`}
              aria-label={`Go to screenshot ${i + 1}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt="" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";

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
  const dialogRef = useRef<HTMLDivElement>(null);
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
  }, [index, images.length, onClose, prev, next]);

  // focus trap
  useEffect(() => {
    const el = dialogRef.current;
    if (!el) return;
    const focusable = el.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    const prevFocus = document.activeElement as HTMLElement | null;

    first?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last?.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first?.focus();
      }
    };

    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      prevFocus?.focus();
    };
  }, []);

  return (
    <div
      ref={dialogRef}
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
        <Image
          src={images[index]}
          alt={`${title} screenshot ${index + 1}`}
          fill
          sizes="(max-width: 1280px) 100vw, 1024px"
          className="max-h-[78vh] w-auto !max-w-full rounded-lg border border-line object-contain"
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
              className={`relative h-14 w-20 shrink-0 overflow-hidden rounded border transition-opacity ${
                i === index ? "border-amber opacity-100" : "border-line opacity-50 hover:opacity-80"
              }`}
              aria-label={`Go to screenshot ${i + 1}`}
            >
              <Image src={src} alt="" fill className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

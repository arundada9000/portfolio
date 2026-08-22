"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { soundTap } from "@/lib/sounds";
import { hapticTap } from "@/lib/haptics";
import { XMark, ArrowLeft, ArrowRight } from "./Icon";

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
  const prev = () => { soundTap(); hapticTap(); onNavigate((index - 1 + images.length) % images.length); };
  const next = () => { soundTap(); hapticTap(); onNavigate((index + 1) % images.length); };

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
        <button
          type="button"
          onClick={() => { soundTap(); onClose(); }}
          className="ios-touch inline-flex items-center gap-1.5 rounded-[10px] border border-line/60 px-3 py-2 transition-colors hover:border-amber hover:text-amber active:scale-[0.95]"
        >
          <span>esc</span>
          <XMark size={14} />
        </button>
      </div>

      {/* image */}
      <div
        className="relative flex h-[60vh] sm:h-[74vh] w-full max-w-5xl items-center justify-center overflow-hidden rounded-[16px] border border-line/60 bg-night/90 p-2 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <Image
          src={images[index]}
          alt={`${title} screenshot ${index + 1}`}
          fill
          priority
          sizes="(max-width: 1280px) 100vw, 1200px"
          className="object-contain p-2"
        />
        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={prev}
              aria-label="Previous"
              className="ios-touch absolute left-2 flex size-11 items-center justify-center rounded-full border border-line/60 bg-panel/80 font-mono text-fog backdrop-blur-sm transition-all duration-150 hover:border-amber hover:text-amber active:scale-90"
            >
              <ArrowLeft size={18} />
            </button>
            <button
              type="button"
              onClick={next}
              aria-label="Next"
              className="ios-touch absolute right-2 flex size-11 items-center justify-center rounded-full border border-line/60 bg-panel/80 font-mono text-fog backdrop-blur-sm transition-all duration-150 hover:border-amber hover:text-amber active:scale-90"
            >
              <ArrowRight size={18} />
            </button>
          </>
        )}
      </div>

      {/* thumbnails */}
      {images.length > 1 && (
        <div className="mt-4 flex max-w-5xl gap-2 overflow-x-auto scroll-momentum" onClick={(e) => e.stopPropagation()}>
          {images.map((src, i) => (
            <button
              key={src}
              type="button"
              onClick={() => { soundTap(); onNavigate(i); }}
              className={`ios-touch relative h-14 w-20 shrink-0 overflow-hidden rounded-[10px] border transition-all duration-150 active:scale-95 ${
                i === index ? "border-amber opacity-100" : "border-line/50 opacity-50 hover:opacity-80"
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

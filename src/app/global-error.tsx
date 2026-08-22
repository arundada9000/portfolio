"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global Error Caught:", error);
  }, [error]);

  return (
    <html lang="en" className="h-full bg-[#0a0e15] text-[#e9e4d8]">
      <body className="flex min-h-full items-center justify-center p-6 font-mono">
        <div className="w-full max-w-lg rounded-[20px] border border-[#1e2839] bg-[#0f1520] p-6 shadow-2xl space-y-4">
          <div className="flex items-center gap-2 border-b border-[#1e2839] pb-3">
            <span className="size-3 rounded-full bg-[#ff7a2f]" />
            <span className="size-3 rounded-full bg-[#ffb454]" />
            <span className="size-3 rounded-full bg-[#1e2839]" />
            <span className="ml-2 text-xs text-[#8d97a9]">Fatal Root Panic</span>
          </div>
          <h1 className="text-xl font-bold text-[#ffb454]">Root Layout Malfunction</h1>
          <p className="text-xs text-[#8d97a9] leading-relaxed">
            The root layout failed to initialize. Even the preloader could not save this session.
          </p>
          <div className="rounded-[10px] bg-[#0a0e15] p-3 text-[11px] text-[#f87171] break-words">
            {error.message || "Unknown root layout exception"}
          </div>
          <div className="pt-2">
            <button
              type="button"
              onClick={() => reset()}
              className="w-full rounded-[12px] bg-[#ffb454] py-3 text-xs font-bold text-[#0a0e15] transition-opacity hover:opacity-90 active:scale-[0.98]"
            >
              Reboot App
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
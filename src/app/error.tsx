"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { soundError, soundTap, soundSuccess } from "@/lib/sounds";
import { hapticError, hapticTap, hapticSuccess } from "@/lib/haptics";
import { RotateCcw, ArrowLeft, Copy, Check } from "@/components/Icon";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const [showStack, setShowStack] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    soundError();
    hapticError();
    console.error("Caught in ErrorPage boundary:", error);
  }, [error]);

  const handleReset = () => {
    soundTap();
    hapticTap();
    reset();
  };

  const handleCopy = () => {
    const text = `Error: ${error.message}\nDigest: ${error.digest ?? "none"}\nStack:\n${error.stack ?? "no stack"}`;
    navigator.clipboard?.writeText(text);
    setCopied(true);
    soundSuccess();
    hapticSuccess();
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <main
      data-section="error"
      className="relative mx-auto flex min-h-[85vh] max-w-3xl flex-col justify-center px-4 pt-28 pb-20 sm:px-6"
    >
      {/* Red/Ember atmospheric glow */}
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 size-96 rounded-full bg-ember/10 blur-3xl"
        aria-hidden="true"
      />

      <div className="relative z-10 space-y-6">
        {/* Eyebrow */}
        <div className="flex items-center gap-2 font-mono text-xs text-dust">
          <span className="text-ember">⚡</span>
          <span>RUNTIME_EXCEPTION · SEGFAULT</span>
          <span className="ml-auto inline-flex items-center gap-1.5 rounded-full border border-ember/40 bg-ember/10 px-2.5 py-0.5 text-[10px] text-ember">
            <span className="size-1.5 rounded-full bg-ember animate-ping" />
            crash caught
          </span>
        </div>

        {/* Big Header */}
        <div className="space-y-2">
          <h1 className="text-display text-5xl uppercase tracking-tight text-fog sm:text-7xl">
            Kernel <span className="text-ember">Panic</span>
          </h1>
          <p className="text-lg text-dust">
            Something in the React tree hit an unhandled exception. Don&apos;t worry, no servers were harmed.
          </p>
        </div>

        {/* iOS Frosted Glass Crash Report Card */}
        <div className="ios-glass-card overflow-hidden rounded-[20px] border border-line/60 shadow-2xl">
          {/* Window Header */}
          <div className="flex items-center justify-between border-b border-line/40 bg-panel/80 px-4 py-3">
            <div className="flex items-center gap-2">
              <span className="size-3 rounded-full bg-ember" />
              <span className="size-3 rounded-full bg-amber/80" />
              <span className="size-3 rounded-full bg-line" />
              <span className="ml-2 font-mono text-xs text-fog font-medium">
                CrashReport.app — Exception Dialog
              </span>
            </div>
            {error.digest && (
              <span className="font-mono text-[10px] text-dust bg-line/40 px-2 py-0.5 rounded">
                digest: {error.digest.slice(0, 8)}
              </span>
            )}
          </div>

          {/* Terminal Crash Content */}
          <div className="p-5 font-mono text-sm space-y-4">
            <div className="rounded-[12px] border border-ember/30 bg-ember/5 p-4 text-xs space-y-2">
              <div className="flex items-center gap-2 text-ember font-bold">
                <span>[FATAL_EXCEPTION]</span>
                <span className="truncate">{error.name || "Error"}</span>
              </div>
              <p className="text-fog leading-relaxed break-words font-mono">
                {error.message || "An unexpected error occurred during rendering."}
              </p>
            </div>

            {/* Funny developer commentary */}
            <div className="text-xs text-dust/80 space-y-1">
              <p className="text-amber">// What probably happened:</p>
              <p className="flex items-center gap-2">
                <span>▸</span> A cosmic ray flipped a bit in the server memory.
              </p>
              <p className="flex items-center gap-2">
                <span>▸</span> TypeScript guaranteed this was impossible, but JavaScript disagreed.
              </p>
              <p className="flex items-center gap-2">
                <span>▸</span> The component drank too much chiya and needed a reboot.
              </p>
            </div>

            {/* Stack trace toggle */}
            <div>
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setShowStack((v) => !v)}
                  className="ios-touch text-xs text-dust hover:text-fog underline underline-offset-4 transition-colors"
                >
                  {showStack ? "Hide crash dump ▲" : "View crash stack trace ▼"}
                </button>

                {showStack && (
                  <button
                    type="button"
                    onClick={handleCopy}
                    className="ios-touch inline-flex items-center gap-1 text-xs text-amber hover:text-amber/80 transition-colors"
                  >
                    {copied ? <Check size={12} className="text-amber" /> : <Copy size={12} />}
                    <span>{copied ? "Copied" : "Copy dump"}</span>
                  </button>
                )}
              </div>

              {showStack && (
                <pre className="mt-2 max-h-48 overflow-auto rounded-[12px] border border-line/50 bg-night/80 p-3 text-[11px] leading-relaxed text-dust font-mono">
                  {error.stack || "No stack trace available."}
                </pre>
              )}
            </div>
          </div>

          {/* Action Footer */}
          <div className="flex flex-wrap items-center gap-3 border-t border-line/40 bg-panel/50 p-4">
            <button
              type="button"
              onClick={handleReset}
              className="ios-touch inline-flex items-center gap-2 rounded-[12px] bg-amber px-5 py-2.5 font-mono text-xs font-bold text-night transition-all duration-150 hover:bg-ember active:scale-[0.97]"
            >
              <RotateCcw size={14} />
              <span>Retry / Hot Reload</span>
            </button>

            <Link
              href="/"
              className="ios-touch inline-flex items-center gap-2 rounded-[12px] border border-line/60 bg-panel/80 px-4 py-2.5 font-mono text-xs text-fog transition-all duration-150 hover:border-amber hover:text-amber active:scale-[0.97]"
            >
              <ArrowLeft size={14} />
              <span>Escape to Home</span>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const CommandPalette = dynamic(() => import("./CommandPalette").then((m) => m.CommandPalette), { ssr: false });

/**
 * Defers the command palette chunk (terminal, music player, games, ascii
 * fonts - one of the heaviest bundles) until the browser is idle, so it
 * stays off the critical hydration path. ⌘K before it loads still works:
 * we catch the shortcut, load the chunk, and open once it mounts.
 */
export function LazyPalette() {
  const [load, setLoad] = useState(false);
  const [pendingOpen, setPendingOpen] = useState(false);

  useEffect(() => {
    if (load) return;
    const hasIdle = typeof window.requestIdleCallback === "function";
    const idle = hasIdle
      ? window.requestIdleCallback(() => setLoad(true), { timeout: 4000 })
      : (setTimeout(() => setLoad(true), 2500) as unknown as number);

    // early ⌘K / terminal-button click: load now, open on mount
    const wantOpen = () => {
      setPendingOpen(true);
      setLoad(true);
    };
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        wantOpen();
      }
    };
    const w = window as unknown as { openTerminal?: (() => void) & { __lazyShim?: boolean } };
    if (!w.openTerminal) {
      const shim: (() => void) & { __lazyShim?: boolean } = () => wantOpen();
      shim.__lazyShim = true;
      w.openTerminal = shim; // palette replaces this shim on mount
    }
    window.addEventListener("keydown", onKey);
    return () => {
      if (hasIdle) window.cancelIdleCallback(idle);
      else clearTimeout(idle);
      window.removeEventListener("keydown", onKey);
    };
  }, [load]);

  // once the real palette has mounted (it overwrites window.openTerminal),
  // honor a pending early open
  useEffect(() => {
    if (!load || !pendingOpen) return;
    const iv = setInterval(() => {
      const w = window as unknown as { openTerminal?: (() => void) & { __lazyShim?: boolean } };
      if (w.openTerminal && !w.openTerminal.__lazyShim) {
        // real handler registered by the palette effect
        w.openTerminal();
        setPendingOpen(false);
        clearInterval(iv);
      }
    }, 120);
    const stop = setTimeout(() => clearInterval(iv), 5000);
    return () => {
      clearInterval(iv);
      clearTimeout(stop);
    };
  }, [load, pendingOpen]);

  return load ? <CommandPalette /> : null;
}

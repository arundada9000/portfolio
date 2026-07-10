"use client";

import { useState } from "react";
import { TerminalWindow } from "./TerminalWindow";

/**
 * Card visual: shows the real screenshot `image` when it loads, otherwise falls
 * back to the terminal transcript. Pass a path from the gallery data.
 */
export function ProjectVisual({
  slug,
  title,
  terminal,
  image,
}: {
  slug: string;
  title: string;
  terminal: string[];
  image?: string;
}) {
  const [failed, setFailed] = useState(false);

  if (image && !failed) {
    return (
      <div className="relative aspect-[16/10] overflow-hidden border-b border-line bg-night">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={image}
          alt={`${title} - screenshot`}
          loading="lazy"
          onError={() => setFailed(true)}
          className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.04]"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-night/50 to-transparent" />
      </div>
    );
  }

  return (
    <div className="border-b border-line bg-night/60 p-4">
      <TerminalWindow title={`${slug} - demo`} className="border-line/60 shadow-none">
        <ol className="min-h-[6.5rem] text-[13px]">
          {terminal.map((line, i) => (
            <li
              key={i}
              className={
                line.startsWith("$") || line.startsWith(">")
                  ? "text-fog"
                  : line.startsWith("✓")
                    ? "text-amber"
                    : "text-dust"
              }
            >
              {line}
            </li>
          ))}
        </ol>
      </TerminalWindow>
    </div>
  );
}

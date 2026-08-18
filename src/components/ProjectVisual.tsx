"use client";

import { useState } from "react";
import Image from "next/image";
import { TerminalWindow } from "./TerminalWindow";

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
      <div className="relative aspect-[16/10] overflow-hidden border-b border-line/40 bg-surface-bg">
        <Image
          src={image}
          alt={`${title} - screenshot`}
          fill
          sizes="(max-width: 1024px) 100vw, 50vw"
          onError={() => setFailed(true)}
          className="object-cover object-top transition-transform duration-500 group-hover:scale-[1.04]"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-surface-bg/50 to-transparent" />
      </div>
    );
  }

  return (
    <div className="border-b border-line/40 bg-surface-bg/60 p-4">
      <TerminalWindow title={`${slug} - demo`} className="border-line/40 shadow-none">
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

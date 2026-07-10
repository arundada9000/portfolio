import type { ReactNode } from "react";

/** Terminal chrome shared by the hero, project cards, and case-study diagrams. */
export function TerminalWindow({
  title,
  children,
  className = "",
}: {
  title: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`overflow-hidden rounded-lg border border-line bg-panel ${className}`}>
      <div className="flex items-center gap-2 border-b border-line px-4 py-2.5">
        <span className="size-2.5 rounded-full bg-ember/70" aria-hidden="true" />
        <span className="size-2.5 rounded-full bg-amber/70" aria-hidden="true" />
        <span className="size-2.5 rounded-full bg-dust/40" aria-hidden="true" />
        <span className="ml-2 truncate font-mono text-xs text-dust">{title}</span>
      </div>
      <div className="p-4 font-mono text-sm leading-relaxed sm:p-5">{children}</div>
    </div>
  );
}

import type { ReactNode } from "react";
import { SectionHeading } from "./SectionHeading";

/** Shared section shell: anchor, animated heading, content. */
export function Section({
  id,
  command,
  title,
  children,
}: {
  id: string;
  command: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section id={id} data-section={id} className="mx-auto max-w-6xl scroll-mt-16 px-4 py-2 sm:px-6 sm:py-3">
      <SectionHeading command={command} title={title} />
      {children}
    </section>
  );
}

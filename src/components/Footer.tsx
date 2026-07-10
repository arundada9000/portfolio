import { site } from "@/lib/data/site";

export function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-8 font-mono text-xs text-dust sm:px-6">
        <p>
          © {new Date().getFullYear()} {site.name} · built with Next.js, caffeine, and NPT midnight oil
        </p>
        <ul className="flex gap-4">
          {site.socials.map((s) => (
            <li key={s.label}>
              <a href={s.href} target="_blank" rel="noreferrer" className="transition-colors hover:text-amber">
                {s.label.toLowerCase()}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
}

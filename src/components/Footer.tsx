import Link from "next/link";
import { site } from "@/lib/data/site";
import { featuredProjects } from "@/lib/data/projects";
import { ArrowUpRight } from "./Icon";

export function Footer() {
  const caseStudies = featuredProjects.filter((p) => p.caseStudy);

  return (
    <footer className="border-t border-line/60 bg-panel/40 backdrop-blur-md pt-12 pb-24 sm:pb-16 font-mono text-xs">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* Top Status & Quick Action Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-line/40 pb-8 text-dust">
          <div className="flex items-center gap-3">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
            </span>
            <span className="text-fog">
              Available for select projects <span className="text-dust">· Butwal, Nepal (UTC+5:45)</span>
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="rounded-[8px] border border-line/50 bg-line/20 px-2.5 py-1 text-[11px] text-amber">
              ⌘K for terminal · ? for shortcuts
            </span>
            <a
              href="#hero"
              className="ios-touch inline-flex items-center gap-1 rounded-[8px] px-2 py-1 text-dust transition-colors hover:text-amber"
            >
              ↑ top
            </a>
          </div>
        </div>

        {/* 4-Column Grid */}
        <div className="grid grid-cols-1 gap-10 py-12 sm:grid-cols-2 md:grid-cols-4">
          {/* Col 1: Bio & Alias */}
          <div className="space-y-3">
            <div className="text-sm font-bold text-fog">
              <span className="text-amber">{site.name}</span>
              <span className="ml-1.5 text-dust text-xs font-normal">(@{site.alias})</span>
            </div>
            <p className="text-dust leading-relaxed text-[11px]">
              Self-taught frontend developer & CTO at Sajilo Digital. Building resilient web systems, disaster platforms, and map-first apps from Nepal.
            </p>
            <div className="pt-2 text-dust text-[11px]">
              <span className="text-amber">70+</span> public repos · <span className="text-amber">3</span> production systems
            </div>
          </div>

          {/* Col 2: Navigation */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-fog">// navigation</h4>
            <ul className="space-y-2 text-dust">
              <li>
                <Link href="/#about" className="ios-touch inline-block transition-colors hover:text-amber">
                  ./about
                </Link>
              </li>
              <li>
                <Link href="/#skills" className="ios-touch inline-block transition-colors hover:text-amber">
                  ./skills
                </Link>
              </li>
              <li>
                <Link href="/#work" className="ios-touch inline-block transition-colors hover:text-amber">
                  ./work
                </Link>
              </li>
              <li>
                <Link href="/#gallery" className="ios-touch inline-block transition-colors hover:text-amber">
                  ./gallery
                </Link>
              </li>
              <li>
                <Link href="/#open-source" className="ios-touch inline-block transition-colors hover:text-amber">
                  ./open-source
                </Link>
              </li>
              <li>
                <Link href="/#experience" className="ios-touch inline-block transition-colors hover:text-amber">
                  ./experience
                </Link>
              </li>
              <li>
                <Link href="/#contact" className="ios-touch inline-block transition-colors hover:text-amber">
                  ./contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Case Studies */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-fog">// case studies</h4>
            <ul className="space-y-2 text-dust">
              {caseStudies.map((cs) => (
                <li key={cs.slug}>
                  <Link
                    href={`/work/${cs.slug}`}
                    className="ios-touch inline-flex items-center gap-1 transition-colors hover:text-amber"
                  >
                    <span>{cs.title}</span>
                    <ArrowUpRight size={10} className="inline opacity-60" />
                  </Link>
                </li>
              ))}
              <li>
                <a
                  href={site.company.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ios-touch inline-flex items-center gap-1 transition-colors hover:text-amber"
                >
                  <span>Sajilo Digital Pvt. Ltd.</span>
                  <ArrowUpRight size={10} className="inline opacity-60" />
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: Connect */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-fog">// connect</h4>
            <ul className="space-y-2 text-dust">
              {site.socials.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ios-touch inline-flex items-center gap-1.5 transition-colors hover:text-amber"
                  >
                    <span>{s.label.toLowerCase()}</span>
                    <span className="text-[10px] text-dust/60">({s.handle})</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Attribution */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-line/40 pt-8 text-[11px] text-dust">
          <p>
            © {new Date().getFullYear()} {site.name}. All rights reserved.
          </p>
          <p className="text-right text-dust/80">
            Next.js 16 · React 19 · TypeScript · Tailwind v4 · Framer Motion
          </p>
        </div>
      </div>
    </footer>
  );
}

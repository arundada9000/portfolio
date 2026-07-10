import { site } from "@/lib/data/site";
import { Section } from "./Section";
import { Reveal } from "./Reveal";

const contributions = [
  {
    name: "reactjs-training",
    detail: "6-day core React curriculum written and taught for Code for Change Rupandehi.",
    href: "https://github.com/arundada9000/reactjs-training",
  },
  {
    name: "git-and-github-workshop",
    detail: "Workshop materials that took a room of beginners from `git init` to their first PR.",
    href: "https://github.com/arundada9000/git-and-github-workshop",
  },
  {
    name: "js-to-react",
    detail: "A structured JavaScript curriculum that bridges vanilla JS into React thinking.",
    href: "https://github.com/arundada9000/js-to-react",
  },
  {
    name: "Code-for-Change",
    detail: "The organization's official website — built by members, for members.",
    href: "https://github.com/arundada9000/Code-for-Change",
  },
];

export function OpenSource() {
  return (
    <Section id="open-source" command="git shortlog --all" title="Open Source">
      <Reveal>
        <p className="mb-8 max-w-2xl text-lg text-dust">
          Everything I learn ships as a public repo — 70+ and counting, plus GitHub&apos;s{" "}
          <span className="text-fog">Pull Shark</span> badge for merged pull requests. Most of
          my open-source energy goes into teaching materials for developers in Nepal.
        </p>

        {/* contribution graph — inverted so the service's light empty cells read
            as dark on-theme, with hue-rotate bringing the fill back to amber */}
        <div className="overflow-x-auto rounded-lg border border-line bg-panel p-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`https://ghchart.rshah.org/ffb454/${site.alias}`}
            alt={`GitHub contribution graph for ${site.alias}`}
            className="min-w-[640px] w-full [filter:invert(1)_hue-rotate(180deg)_saturate(1.3)]"
            loading="lazy"
          />
        </div>
      </Reveal>

      <div className="mt-8 grid gap-px overflow-hidden rounded-lg border border-line bg-line sm:grid-cols-2">
        {contributions.map((c, i) => (
          <Reveal key={c.name} delay={i * 0.06}>
            <a href={c.href} target="_blank" rel="noreferrer" className="group block h-full bg-panel p-6 transition-colors hover:bg-night">
              <h3 className="font-mono text-sm font-bold text-fog group-hover:text-amber">
                {site.alias}/{c.name} ↗
              </h3>
              <p className="mt-2 text-sm text-dust">{c.detail}</p>
            </a>
          </Reveal>
        ))}
      </div>

      <Reveal className="mt-8">
        <a
          href={`https://github.com/${site.alias}`}
          target="_blank"
          rel="noreferrer"
          className="inline-block border border-amber/60 px-6 py-3 font-mono text-sm text-amber transition-colors hover:bg-amber hover:text-night"
        >
          view github profile ↗
        </a>
      </Reveal>
    </Section>
  );
}

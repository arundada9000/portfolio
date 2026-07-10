import Image from "next/image";
import { site } from "@/lib/data/site";
import { Section } from "./Section";
import { Reveal } from "./Reveal";
import { CountUp } from "./CountUp";

export function About() {
  return (
    <Section id="about" command="cat about.md" title="About">
      <div className="grid gap-12 md:grid-cols-[1fr_320px]">
        <Reveal>
          <div className="space-y-5 text-lg leading-relaxed text-dust">
            <p>
              I&apos;m a self-taught developer from {site.location}. In 2023 I opened my first
              HTML course; by 2025 I was architecting systems used by Nepal Police and a
              national NGO. Nobody handed me that path - I built it commit by commit,
              usually well past midnight.
            </p>
            <p>
              Today I&apos;m <span className="text-fog">{site.company.role}</span> at{" "}
              <a href={site.company.url} target="_blank" rel="noreferrer" className="link-underline text-fog">
                {site.company.name}
              </a>
              , where I lead frontend architecture across client production systems, and Vice
              Secretary at Code for Change Rupandehi, where I teach React and Git to the next
              batch of developers coming up the same road.
            </p>
            <p>
              My home turf is <span className="text-fog">React, Next.js, and TypeScript</span> -
              but the projects I&apos;m proudest of solve local problems: disaster reporting
              that works offline, room hunting with real maps, algorithm visualizers my
              classmates study with.
            </p>
            <p className="border-l-2 border-amber pl-4 font-mono text-base text-fog">
              Fun fact: the clock in the statusline below is live Nepal time (UTC+5:45 -
              yes, the :45 is real). If it reads past midnight, I&apos;m probably still pushing commits.
            </p>
          </div>

          <dl className="mt-10 grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-line bg-line sm:grid-cols-4">
            {site.stats.map((stat) => (
              <div key={stat.label} className="bg-panel p-5">
                <dt className="order-2 mt-1 block font-mono text-xs text-dust">{stat.label}</dt>
                <dd className="text-display text-3xl text-amber">
                  <CountUp value={stat.value} />
                </dd>
              </div>
            ))}
          </dl>
        </Reveal>

        <Reveal delay={0.15}>
          <figure className="relative">
            <div className="absolute -inset-2 rounded-lg border border-amber/30" aria-hidden="true" />
            <Image
              src="/images/arun.png"
              alt="Portrait of Arun Neupane"
              width={640}
              height={800}
              className="relative w-full rounded-lg border border-line bg-panel object-cover grayscale transition-all duration-500 hover:grayscale-0"
              priority={false}
            />
            <figcaption className="mt-3 font-mono text-xs text-dust">
              // {site.name.toLowerCase()}.png - {site.location.toLowerCase()}
            </figcaption>
          </figure>
        </Reveal>
      </div>
    </Section>
  );
}

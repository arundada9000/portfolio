import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { featuredProjects, getProject } from "@/lib/data/projects";
import { getGallery } from "@/lib/data/gallery";
import { site } from "@/lib/data/site";
import { TerminalWindow } from "@/components/TerminalWindow";
import { Reveal } from "@/components/Reveal";
import { ProjectGallery } from "@/components/ProjectGallery";
import { SortingVisualizer } from "@/components/SortingVisualizer";

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return featuredProjects.filter((p) => p.caseStudy).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};
  return {
    title: `${project.title} — Case Study`,
    description: project.summary,
    alternates: { canonical: `/work/${project.slug}` },
    openGraph: {
      title: `${project.title} — Case Study by ${site.name}`,
      description: project.summary,
      url: `${site.url}/work/${project.slug}`,
      type: "article",
    },
  };
}

export default async function CaseStudyPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project?.caseStudy) notFound();
  const cs = project.caseStudy;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareSourceCode",
    name: project.title,
    description: project.summary,
    codeRepository: project.github,
    programmingLanguage: project.tech,
    author: { "@type": "Person", name: site.name, url: site.url },
    ...(project.live ? { url: project.live } : {}),
  };

  return (
    <main data-section={project.slug} className="mx-auto max-w-4xl px-4 pt-28 pb-24 sm:px-6">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <nav aria-label="Breadcrumb" className="mb-10 font-mono text-sm">
        <Link href="/#work" className="text-dust transition-colors hover:text-amber">
          ← cd ~/work
        </Link>
      </nav>

      <p className="text-eyebrow">
        <span aria-hidden="true">$ </span>cat case-studies/{project.slug}.md
      </p>
      <h1 className="text-display mt-3 text-5xl uppercase sm:text-7xl">{project.title}</h1>

      <div className="mt-6 flex flex-wrap items-center gap-4 font-mono text-sm">
        <span className="text-dust">{project.year}</span>
        <a href={project.github} target="_blank" rel="noreferrer" className="border border-line px-4 py-2 text-fog transition-colors hover:border-amber hover:text-amber">
          github ↗
        </a>
        {project.live && (
          <a href={project.live} target="_blank" rel="noreferrer" className="bg-amber px-4 py-2 font-bold text-night transition-colors hover:bg-ember">
            live demo ↗
          </a>
        )}
      </div>

      <ul className="mt-6 flex flex-wrap gap-1.5">
        {project.tech.map((tech) => (
          <li key={tech} className="rounded-sm bg-line/50 px-2 py-0.5 font-mono text-[11px] text-dust">
            {tech}
          </li>
        ))}
      </ul>

      <div className="mt-14 space-y-14">
        <Reveal>
          <section>
            <h2 className="text-eyebrow mb-4">## the problem</h2>
            <p className="text-lg leading-relaxed text-fog">{cs.problem}</p>
            <p className="mt-4 leading-relaxed text-dust">{cs.context}</p>
          </section>
        </Reveal>

        {/* live, playable demo — Easy Sorting only */}
        {project.slug === "easy-sorting" && (
          <Reveal>
            <section>
              <h2 className="text-eyebrow mb-4">## try it — live sorting playground</h2>
              <p className="mb-5 leading-relaxed text-dust">
                Rebuilt natively for this page. Pick an algorithm, drag the sliders, and watch every
                comparison and swap — the same idea behind the original project, running right here.
              </p>
              <SortingVisualizer />
            </section>
          </Reveal>
        )}

        {/* real screenshots with lightbox */}
        <ProjectGallery images={getGallery(project.galleryKey)?.images ?? []} title={project.title} />

        <Reveal>
          <section>
            <h2 className="text-eyebrow mb-4">## constraints &amp; tradeoffs</h2>
            <ul className="space-y-3">
              {cs.constraints.map((c) => (
                <li key={c} className="flex gap-3 leading-relaxed text-dust">
                  <span className="text-amber" aria-hidden="true">▸</span>
                  {c}
                </li>
              ))}
            </ul>
          </section>
        </Reveal>

        <Reveal>
          <section>
            <h2 className="text-eyebrow mb-4">## architecture</h2>
            <TerminalWindow title={`${project.slug} — data flow`}>
              <pre className="overflow-x-auto text-[13px] leading-relaxed text-fog">
                {cs.architecture.join("\n")}
              </pre>
            </TerminalWindow>
          </section>
        </Reveal>

        <Reveal>
          <section>
            <h2 className="text-eyebrow mb-4">## key decisions</h2>
            <div className="grid gap-px overflow-hidden rounded-lg border border-line bg-line">
              {cs.decisions.map((d) => (
                <div key={d.title} className="bg-panel p-6">
                  <h3 className="text-display text-xl text-fog">{d.title}</h3>
                  <p className="mt-2 leading-relaxed text-dust">{d.body}</p>
                </div>
              ))}
            </div>
          </section>
        </Reveal>

        <Reveal>
          <section>
            <h2 className="text-eyebrow mb-4">## results &amp; lessons</h2>
            <ul className="space-y-3">
              {cs.results.map((r) => (
                <li key={r} className="flex gap-3 leading-relaxed text-dust">
                  <span className="text-amber" aria-hidden="true">✓</span>
                  {r}
                </li>
              ))}
            </ul>
          </section>
        </Reveal>
      </div>

      {/* next case study */}
      <NextCaseStudy currentSlug={project.slug} />
    </main>
  );
}

function NextCaseStudy({ currentSlug }: { currentSlug: string }) {
  const withStudies = featuredProjects.filter((p) => p.caseStudy);
  const index = withStudies.findIndex((p) => p.slug === currentSlug);
  const next = withStudies[(index + 1) % withStudies.length];
  return (
    <div className="mt-20 border-t border-line pt-10">
      <p className="text-eyebrow mb-3">
        <span aria-hidden="true">$ </span>next
      </p>
      <Link href={`/work/${next.slug}`} className="text-display text-3xl text-fog transition-colors hover:text-amber sm:text-5xl">
        {next.title} →
      </Link>
    </div>
  );
}

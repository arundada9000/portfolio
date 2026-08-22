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
import { ArchitectureInspector } from "@/components/ArchitectureInspector";
import { ArrowUpRight, ArrowRight, Check, Bullet } from "@/components/Icon";

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return featuredProjects.filter((p) => p.caseStudy).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};
  return {
    title: `${project.title} - Case Study by ${site.name}`,
    description: project.summary,
    alternates: { canonical: `/work/${project.slug}` },
    openGraph: {
      title: `${project.title} - Case Study by ${site.name}`,
      description: project.summary,
      url: `${site.url}/work/${project.slug}`,
      type: "article",
      publishedTime: `${project.year}-01-01T00:00:00Z`,
      modifiedTime: "2026-07-10T13:49:00+05:45",
      tags: project.tech,
      images: [{ url: `${site.url}/opengraph-image`, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${project.title} - ${site.name}`,
      description: project.summary,
    },
    keywords: [...project.tech, project.title, site.name, "case study", "portfolio", "frontend project"],
  };
}

export default async function CaseStudyPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project?.caseStudy) notFound();
  const cs = project.caseStudy;

  const softwareJsonLd = {
    "@type": "SoftwareSourceCode",
    name: project.title,
    description: project.summary,
    codeRepository: project.github,
    programmingLanguage: project.tech,
    author: { "@type": "Person", name: site.name, url: site.url },
    ...(project.live ? { url: project.live } : {}),
  };

  const breadcrumbJsonLd = {
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: site.url },
      { "@type": "ListItem", position: 2, name: "Work", item: `${site.url}/#work` },
      { "@type": "ListItem", position: 3, name: project.title, item: `${site.url}/work/${project.slug}` },
    ],
  };

  const jsonLd = { "@context": "https://schema.org", "@graph": [softwareJsonLd, breadcrumbJsonLd] };

  return (
    <main data-section={project.slug} className="mx-auto max-w-4xl px-4 pt-28 pb-24 sm:px-6">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <nav aria-label="Breadcrumb" className="mb-10 font-mono text-sm">
        <ol className="flex items-center gap-2 text-dust">
          <li><Link href="/" className="ios-touch inline-block rounded-[8px] px-1 py-0.5 transition-colors hover:text-amber">~/home</Link></li>
          <li aria-hidden="true">/</li>
          <li><Link href="/#work" className="ios-touch inline-block rounded-[8px] px-1 py-0.5 transition-colors hover:text-amber">work</Link></li>
          <li aria-hidden="true">/</li>
          <li className="text-amber" aria-current="page">{project.slug}</li>
        </ol>
      </nav>

      <p className="text-eyebrow">
        <span aria-hidden="true">$ </span>cat case-studies/{project.slug}.md
      </p>
      <h1 className="text-display mt-3 text-5xl uppercase sm:text-7xl">{project.title}</h1>

      <div className="mt-6 flex flex-wrap items-center gap-4 font-mono text-sm">
        <span className="text-dust">{project.year}</span>
        <a href={project.github} target="_blank" rel="noopener noreferrer" className="ios-touch rounded-[12px] border border-line/60 px-4 py-2 text-fog transition-all duration-150 hover:border-amber hover:text-amber active:scale-[0.97]">
          github <ArrowUpRight size={12} className="inline" />
        </a>
        {project.live && (
          <a href={project.live} target="_blank" rel="noopener noreferrer" className="ios-touch rounded-[12px] bg-amber px-4 py-2 font-bold text-night transition-all duration-150 hover:bg-ember active:scale-[0.97]">
            live demo <ArrowUpRight size={12} className="inline" />
          </a>
        )}
      </div>

      <ul className="mt-6 flex flex-wrap gap-1.5">
        {project.tech.map((tech) => (
            <li key={tech} className="rounded-[8px] bg-line/40 px-2.5 py-1 font-mono text-[11px] text-dust">
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

        {/* live, playable demo - Easy Sorting only */}
        {project.slug === "easy-sorting" && (
          <Reveal>
            <section>
              <h2 className="text-eyebrow mb-4">## try it - live sorting playground</h2>
              <p className="mb-5 leading-relaxed text-dust">
                Rebuilt natively for this page. Pick an algorithm, drag the sliders, and watch every
                comparison and swap - the same idea behind the original project, running right here.
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
                <li key={c} className="flex gap-3 leading-relaxed text-dust items-start">
                  <Bullet size={12} className="text-amber mt-1 shrink-0" />
                  <span>{c}</span>
                </li>
              ))}
            </ul>
          </section>
        </Reveal>

        <Reveal>
          <section className="space-y-4">
            <h2 className="text-eyebrow mb-4">## architecture</h2>
            <TerminalWindow title={`${project.slug} - data flow`}>
              <pre className="overflow-x-auto text-[13px] leading-relaxed text-fog">
                {cs.architecture.join("\n")}
              </pre>
            </TerminalWindow>
            <ArchitectureInspector slug={project.slug} />
          </section>
        </Reveal>

        <Reveal>
          <section>
            <h2 className="text-eyebrow mb-4">## key decisions</h2>
            <div className="grid gap-px overflow-hidden rounded-[20px] border border-line/50 bg-line/50">
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
                <li key={r} className="flex gap-3 leading-relaxed text-dust items-start">
                  <Check size={14} className="text-amber mt-1 shrink-0" />
                  <span>{r}</span>
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
    <div className="mt-20 border-t border-line/40 pt-10">
      <p className="text-eyebrow mb-3">
        <span aria-hidden="true">$ </span>next
      </p>
      <Link href={`/work/${next.slug}`} className="ios-touch inline-flex items-center gap-3 text-display text-3xl text-fog transition-all duration-150 hover:text-amber active:scale-[0.98] sm:text-5xl">
        <span>{next.title}</span>
        <ArrowRight size={28} className="inline" />
      </Link>
    </div>
  );
}

import Link from "next/link";
import type { Project } from "@/lib/data/projects";
import { getGallery } from "@/lib/data/gallery";
import { ProjectVisual } from "./ProjectVisual";

/** Featured project card: real screenshot (or terminal fallback), content, clear case-study CTA. */
export function ProjectCard({ project }: { project: Project }) {
  const cover = getGallery(project.galleryKey)?.cover;
  const hasCase = !!project.caseStudy;

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-lg border border-line bg-panel transition-all duration-300 hover:-translate-y-1.5 hover:border-amber/50 hover:shadow-[0_4px_16px_-6px_rgba(255,180,84,0.25)]">
      {hasCase ? (
        <Link href={`/work/${project.slug}`} aria-label={`Read the ${project.title} case study`} className="block">
          <ProjectVisual slug={project.slug} title={project.title} terminal={project.terminal} image={cover} />
        </Link>
      ) : (
        <ProjectVisual slug={project.slug} title={project.title} terminal={project.terminal} image={cover} />
      )}

      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-baseline justify-between gap-3">
          <h3 className="text-display text-2xl text-fog">
            {hasCase ? (
              <Link href={`/work/${project.slug}`} className="transition-colors group-hover:text-amber">
                {project.title}
              </Link>
            ) : (
              project.title
            )}
          </h3>
          <span className="font-mono text-xs text-dust">
            {project.year}
            {project.stars ? ` · ★ ${project.stars}` : ""}
          </span>
        </div>

        <p className="mt-3 text-dust">{project.summary}</p>
        <p className="mt-3 border-l-2 border-amber/60 pl-3 text-sm text-fog">{project.outcome}</p>

        <ul className="mt-4 flex flex-wrap gap-1.5">
          {project.tech.slice(0, 6).map((tech) => (
            <li key={tech} className="rounded-sm bg-line/50 px-2 py-0.5 font-mono text-[11px] text-dust">
              {tech}
            </li>
          ))}
          {project.tech.length > 6 && (
            <li className="px-1 py-0.5 font-mono text-[11px] text-dust">+{project.tech.length - 6}</li>
          )}
        </ul>

        <div className="mt-auto flex items-center gap-4 pt-6 font-mono text-sm">
          {hasCase && (
            <Link
              href={`/work/${project.slug}`}
              className="inline-flex items-center gap-1.5 border border-amber/50 px-3 py-1.5 text-amber transition-colors hover:bg-amber hover:text-night"
            >
              read case study →
            </Link>
          )}
          <a href={project.github} target="_blank" rel="noopener noreferrer" className="link-underline ml-auto text-dust">
            github
          </a>
          {project.live && (
            <a href={project.live} target="_blank" rel="noopener noreferrer" className="link-underline text-dust">
              live ↗
            </a>
          )}
        </div>
      </div>
    </article>
  );
}

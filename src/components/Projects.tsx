import { featuredProjects, moreProjects } from "@/lib/data/projects";
import { Section } from "./Section";
import { ProjectCard } from "./ProjectCard";
import { Reveal } from "./Reveal";

export function Projects() {
  return (
    <Section id="work" command="git log --featured" title="Selected Work">
      <div className="grid gap-6 md:grid-cols-2">
        {featuredProjects.map((project, i) => (
          <Reveal key={project.slug} delay={(i % 2) * 0.1}>
            <ProjectCard project={project} />
          </Reveal>
        ))}
      </div>

      <Reveal className="mt-16">
        <p className="text-eyebrow mb-6">
          <span aria-hidden="true">$ </span>ls ~/projects/more
        </p>
        <ul className="grid gap-px overflow-hidden rounded-lg border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
          {moreProjects.map((project) => (
            <li key={project.slug} className="group bg-panel p-5 transition-colors hover:bg-night">
              <div className="flex items-baseline justify-between">
                <h3 className="font-mono text-sm font-bold text-fog group-hover:text-amber">
                  {project.title}
                </h3>
                <span className="font-mono text-[11px] text-dust">
                  {project.stars ? `★ ${project.stars}` : project.year}
                </span>
              </div>
              <p className="mt-2 text-sm text-dust">{project.summary}</p>
              <div className="mt-4 flex gap-3 font-mono text-xs">
                <a href={project.github} target="_blank" rel="noopener noreferrer" className="link-underline text-dust">
                  github
                </a>
                {project.live && (
                  <a href={project.live} target="_blank" rel="noopener noreferrer" className="link-underline text-dust">
                    live
                  </a>
                )}
              </div>
            </li>
          ))}
        </ul>
      </Reveal>
    </Section>
  );
}

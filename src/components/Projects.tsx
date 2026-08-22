"use client";

import { useState, useMemo } from "react";
import { featuredProjects, moreProjects } from "@/lib/data/projects";
import { Section } from "./Section";
import { ProjectCard } from "./ProjectCard";
import { Reveal } from "./Reveal";
import { Star } from "./Icon";
import { soundPop } from "@/lib/sounds";
import { hapticTap } from "@/lib/haptics";

const FILTER_TAGS = ["all", "React", "Next.js", "TypeScript", "Tailwind CSS", "Leaflet", "PWA"];

export function Projects() {
  const [selectedTag, setSelectedTag] = useState("all");

  const filteredFeatured = useMemo(() => {
    if (selectedTag === "all") return featuredProjects;
    return featuredProjects.filter((p) =>
      p.tech.some((t) => t.toLowerCase() === selectedTag.toLowerCase())
    );
  }, [selectedTag]);

  const filteredMore = useMemo(() => {
    if (selectedTag === "all") return moreProjects;
    return moreProjects.filter((p) =>
      p.tech.some((t) => t.toLowerCase() === selectedTag.toLowerCase())
    );
  }, [selectedTag]);

  return (
    <Section id="work" command="git log --featured" title="Selected Work">
      {/* Filter Chips */}
      <div className="mb-6 flex flex-wrap items-center gap-2">
        <span className="font-mono text-xs text-dust mr-1">// filter:</span>
        {FILTER_TAGS.map((tag) => {
          const isSelected = selectedTag.toLowerCase() === tag.toLowerCase();
          return (
            <button
              key={tag}
              type="button"
              onClick={() => {
                soundPop();
                hapticTap();
                setSelectedTag(tag);
              }}
              className={`ios-touch rounded-[10px] border px-3 py-1 font-mono text-xs transition-all duration-150 active:scale-95 ${
                isSelected
                  ? "border-amber bg-amber/15 text-amber font-bold shadow-[0_0_8px_rgba(255,180,84,0.15)]"
                  : "border-line/60 bg-line/20 text-dust hover:border-amber/50 hover:text-fog"
              }`}
            >
              {tag}
            </button>
          );
        })}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {filteredFeatured.map((project, i) => (
          <Reveal key={project.slug} delay={(i % 2) * 0.1}>
            <ProjectCard project={project} />
          </Reveal>
        ))}
      </div>

      {filteredMore.length > 0 && (
        <Reveal className="mt-10">
          <p className="text-eyebrow mb-4">
            <span aria-hidden="true">$ </span>ls ~/projects/more
          </p>
          <ul className="grid gap-px overflow-hidden rounded-[20px] border border-line/50 bg-line/50 sm:grid-cols-2 lg:grid-cols-4">
            {filteredMore.map((project) => (
              <li key={project.slug} className="ios-touch group bg-panel p-5 transition-colors hover:bg-night active:scale-[0.98]">
                <div className="flex items-baseline justify-between">
                  <h3 className="font-mono text-sm font-bold text-fog group-hover:text-amber">
                    {project.title}
                  </h3>
                  <span className="font-mono text-[11px] text-dust">
                    {project.stars ? <span className="inline-flex items-center gap-1"><Star size={12} className="text-amber" /> {project.stars}</span> : project.year}
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
      )}
    </Section>
  );
}

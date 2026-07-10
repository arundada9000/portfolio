import { skillCategories, marqueeSkills } from "@/lib/data/skills";
import { Section } from "./Section";
import { Reveal } from "./Reveal";

export function Skills() {
  return (
    <Section id="skills" command="ls -R ~/skills" title="Skills">
      <div className="grid gap-px overflow-hidden rounded-lg border border-line bg-line sm:grid-cols-2">
        {skillCategories.map((category, i) => (
          <Reveal key={category.id} delay={i * 0.08}>
            <div className="h-full bg-panel p-6 sm:p-8">
              <p className="font-mono text-xs text-dust">{category.path}</p>
              <h3 className="text-display mt-2 text-2xl text-fog">{category.label}</h3>
              <ul className="mt-5 flex flex-wrap gap-2">
                {category.skills.map((skill) => (
                  <li
                    key={skill}
                    className="border border-line px-3 py-1.5 font-mono text-sm text-dust transition-colors hover:border-amber/60 hover:text-amber"
                  >
                    {skill}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        ))}
      </div>

      {/* marquee strip */}
      <div
        className="mt-10 overflow-hidden border-y border-line py-3 [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]"
        aria-hidden="true"
      >
        <div className="animate-marquee flex w-max gap-8 font-mono text-sm text-dust motion-reduce:animate-none">
          {[...marqueeSkills, ...marqueeSkills].map((skill, i) => (
            <span key={i} className="whitespace-nowrap">
              <span className="text-amber">::</span> {skill}
            </span>
          ))}
        </div>
      </div>
    </Section>
  );
}

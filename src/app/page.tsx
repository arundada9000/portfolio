import { Hero } from "@/components/Hero";
import { About } from "@/components/About";
import { Skills } from "@/components/Skills";
import { Projects } from "@/components/Projects";
import { Gallery } from "@/components/Gallery";
import { OpenSource } from "@/components/OpenSource";
import { GitHubActivity } from "@/components/GitHubActivity";
import { ExperienceTimeline } from "@/components/ExperienceTimeline";
import { Contact } from "@/components/Contact";

export default function Home() {
  return (
    <main>
      <Hero />
      <About />
      <Skills />
      <Projects />
      <Gallery />
      <OpenSource />
      <GitHubActivity />
      <ExperienceTimeline />
      <Contact />
    </main>
  );
}

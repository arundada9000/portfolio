import Link from "next/link";
import { TerminalWindow } from "@/components/TerminalWindow";

export default function NotFound() {
  return (
    <main data-section="404" className="mx-auto flex min-h-[70vh] max-w-2xl flex-col justify-center px-4 pt-28 pb-20 sm:px-6">
      <TerminalWindow title="arun@butwal — zsh">
        <p className="text-fog">
          <span className="text-amber">$ </span>open {`{requested_page}`}
        </p>
        <p className="mt-1 text-ember">zsh: no such file or directory (404)</p>
        <p className="mt-4 text-dust"># the page you&apos;re looking for was never committed.</p>
        <p className="mt-4 text-fog">
          <span className="text-amber">$ </span>
          <Link href="/" className="link-underline">
            cd ~ && go home
          </Link>
        </p>
      </TerminalWindow>
    </main>
  );
}

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "offline - arun.sh",
  robots: { index: false },
};

/** Served by the service worker when the network is gone. */
export default function Offline() {
  return (
    <main className="flex min-h-[70vh] items-center px-4 sm:px-6">
      <div className="mx-auto w-full max-w-2xl font-mono">
        <p className="text-eyebrow mb-6">// connection lost</p>
        <div className="overflow-hidden rounded-lg border border-line bg-panel/80">
          <div className="flex items-center gap-2 border-b border-line px-4 py-2.5">
            <span className="size-2.5 rounded-full bg-ember/70" />
            <span className="size-2.5 rounded-full bg-amber/70" />
            <span className="size-2.5 rounded-full bg-dust/40" />
            <span className="ml-2 text-xs text-dust">arun@butwal - offline</span>
          </div>
          <div className="space-y-2 px-4 py-5 text-sm">
            <p className="text-fog">
              <span className="text-amber">$</span> curl -s arun.dev/me
            </p>
            <p className="text-ember">curl: (6) could not resolve host - are you offline?</p>
            <p className="text-dust">don&apos;t worry, this happens in the hills of Nepal too.</p>
            <p className="text-dust">
              reconnect and{" "}
              <a href="/" className="link-underline text-amber">
                try again
              </a>
              {" "}- arun.sh will be right here.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}

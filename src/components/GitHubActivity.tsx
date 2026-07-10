"use client";

import { useEffect, useState } from "react";
import { site } from "@/lib/data/site";
import { CountUp } from "./CountUp";

type Repo = {
  id: number;
  name: string;
  html_url: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  fork: boolean;
  updated_at: string;
  homepage: string | null;
};

type State =
  | { status: "loading" }
  | { status: "error" }
  | { status: "ready"; repos: Repo[]; totalStars: number; totalRepos: number; languages: [string, number][] };

const CACHE_KEY = "gh-repos-v1";
const CACHE_TTL = 30 * 60 * 1000; // 30 min - respects GitHub's 60 req/hr anon limit

// warm terminal palette for the language bar; deterministic per language
const LANG_COLORS = ["#ffb454", "#ff7a2f", "#8d97a9", "#e9e4d8", "#c98a3a", "#5a6b85"];

function summarize(repos: Repo[]): Extract<State, { status: "ready" }> {
  const owned = repos.filter((r) => !r.fork);
  const totalStars = owned.reduce((sum, r) => sum + r.stargazers_count, 0);
  const langCount = new Map<string, number>();
  for (const r of owned) if (r.language) langCount.set(r.language, (langCount.get(r.language) ?? 0) + 1);
  const languages = [...langCount.entries()].sort((a, b) => b[1] - a[1]).slice(0, 6);
  const top = [...owned].sort((a, b) => b.stargazers_count - a.stargazers_count).slice(0, 6);
  return { status: "ready", repos: top, totalStars, totalRepos: owned.length, languages };
}

export function GitHubActivity() {
  const [state, setState] = useState<State>({ status: "loading" });

  useEffect(() => {
    let alive = true;
    const apply = (s: State) => alive && setState(s);

    const cached = (() => {
      try {
        const raw = sessionStorage.getItem(CACHE_KEY);
        if (!raw) return null;
        const { t, data } = JSON.parse(raw) as { t: number; data: Repo[] };
        return Date.now() - t < CACHE_TTL ? data : null;
      } catch {
        return null;
      }
    })();

    if (cached) {
      apply(summarize(cached));
      return () => {
        alive = false;
      };
    }

    fetch(`https://api.github.com/users/${site.alias}/repos?per_page=100&sort=updated`)
      .then((r) => {
        if (!r.ok) throw new Error(String(r.status));
        return r.json();
      })
      .then((data: Repo[]) => {
        try {
          sessionStorage.setItem(CACHE_KEY, JSON.stringify({ t: Date.now(), data }));
        } catch {
          /* storage full / private mode - non-fatal */
        }
        apply(summarize(data));
      })
      .catch(() => apply({ status: "error" }));

    return () => {
      alive = false;
    };
  }, []);

  // If the API is unavailable/rate-limited, hide the section entirely
  // rather than showing an error - the OpenSource section already covers GitHub.
  if (state.status === "error") return null;

  return (
    <section id="github" data-section="github" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-20 sm:px-6 sm:py-28">
      <p className="text-eyebrow">
        <span aria-hidden="true">$ </span>gh repo list {site.alias} --live
      </p>
      <div className="mt-3 mb-12 flex flex-wrap items-end justify-between gap-4">
        <h2 className="text-display text-4xl uppercase sm:text-6xl">Live from GitHub</h2>
        <span className="font-mono text-xs text-dust">
          {state.status === "loading" && "fetching…"}
          {state.status === "ready" && "fetched at runtime · cached 30m"}
        </span>
      </div>

      {state.status === "loading" && <Skeleton />}

      {state.status === "ready" && (
        <>
          {/* live stat row */}
          <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-line bg-line sm:grid-cols-3">
            <Stat value={`${state.totalRepos}`} label="public repos (non-fork)" />
            <Stat value={`★ ${state.totalStars}`} label="total stars earned" />
            <Stat value={state.languages[0]?.[0] ?? "-"} label="most-used language" />
          </dl>

          {/* language distribution bar */}
          {state.languages.length > 0 && (
            <div className="mt-6">
              <div className="flex h-3 overflow-hidden rounded-full border border-line">
                {state.languages.map(([lang, count], i) => (
                  <span
                    key={lang}
                    title={`${lang} · ${count} repos`}
                    style={{
                      width: `${(count / state.languages.reduce((s, [, c]) => s + c, 0)) * 100}%`,
                      background: LANG_COLORS[i % LANG_COLORS.length],
                    }}
                  />
                ))}
              </div>
              <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-1 font-mono text-xs text-dust">
                {state.languages.map(([lang], i) => (
                  <li key={lang} className="flex items-center gap-1.5">
                    <span className="size-2 rounded-full" style={{ background: LANG_COLORS[i % LANG_COLORS.length] }} />
                    {lang}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* top repos - sibling stagger, not a section fade */}
          <ul className="mt-8 grid gap-px overflow-hidden rounded-lg border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
            {state.repos.map((repo, i) => (
              <li
                key={repo.id}
                className="animate-[rise_0.5s_both] bg-panel"
                style={{ animationDelay: `${Math.min(i, 6) * 55}ms` }}
              >
                <a
                  href={repo.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex h-full flex-col p-5 transition-colors hover:bg-night"
                >
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-mono text-sm font-bold text-fog group-hover:text-amber">{repo.name}</h3>
                    <span className="shrink-0 font-mono text-xs text-amber">★ {repo.stargazers_count}</span>
                  </div>
                  <p className="mt-2 line-clamp-2 flex-1 text-sm text-dust">
                    {repo.description ?? "No description."}
                  </p>
                  {repo.language && (
                    <span className="mt-4 font-mono text-[11px] text-dust">{repo.language}</span>
                  )}
                </a>
              </li>
            ))}
          </ul>

          <a
            href={site.github}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-block border border-line px-6 py-3 font-mono text-sm text-fog transition-colors hover:border-amber hover:text-amber"
          >
            see all {state.totalRepos} repos ↗
          </a>
        </>
      )}
    </section>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="bg-panel p-5">
      <dd className="text-display text-3xl text-amber">
        <CountUp value={value} />
      </dd>
      <dt className="mt-1 font-mono text-xs text-dust">{label}</dt>
    </div>
  );
}

function Skeleton() {
  return (
    <div className="grid gap-px overflow-hidden rounded-lg border border-line bg-line sm:grid-cols-3" aria-hidden="true">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="bg-panel p-5">
          <div className="h-8 w-24 animate-pulse rounded bg-line" />
          <div className="mt-3 h-3 w-32 animate-pulse rounded bg-line" />
        </div>
      ))}
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { site } from "@/lib/data/site";
import { featuredProjects } from "@/lib/data/projects";
import { ArrowUpRight, Download, Check, XMark } from "./Icon";
import { soundPop, soundSuccess, soundTap } from "@/lib/sounds";
import { hapticTap, hapticSuccess } from "@/lib/haptics";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
}

function getPlatformInstallInstructions() {
  if (typeof window === "undefined") return { title: "Install Web App", steps: [] };
  const ua = navigator.userAgent;
  const isEdge = /Edg\//i.test(ua);
  const isChrome = /Chrome\//i.test(ua) && !isEdge;
  const isSafari = /Safari\//i.test(ua) && !/Chrome\//i.test(ua);
  const isMac = /Macintosh|Mac OS X/i.test(ua);
  const isWindows = /Windows/i.test(ua);
  const isIOS = /iPhone|iPad|iPod/i.test(ua);
  const isAndroid = /Android/i.test(ua);

  if (isWindows && isEdge) {
    return {
      title: "Install on Microsoft Edge (Windows)",
      steps: [
        "Look at the right side of the address bar at the top.",
        "Click the 'App available. Install Arun Neupane' icon (⊞+ or ⤓).",
        "Or click the '...' Menu → 'Apps' → 'Install this site as an app'.",
      ],
    };
  }

  if (isWindows && isChrome) {
    return {
      title: "Install on Google Chrome (Windows)",
      steps: [
        "Look at the right side of the address bar at the top.",
        "Click the 'Install Arun Neupane' icon (⤓).",
        "Or click the '⋮' Menu → 'Save and share' → 'Install Arun Neupane'.",
      ],
    };
  }

  if (isMac && isSafari) {
    return {
      title: "Install on Safari (macOS)",
      steps: [
        "In the top Apple menu bar, click 'File'.",
        "Select 'Add to Dock...'",
        "Click 'Add' to run as a native desktop app.",
      ],
    };
  }

  if (isIOS) {
    return {
      title: "Install on iPhone / iPad (Safari)",
      steps: [
        "Tap the Share button (⎋) at the bottom toolbar.",
        "Scroll down and tap 'Add to Home Screen' (➕).",
        "Tap 'Add' in the top right corner.",
      ],
    };
  }

  if (isAndroid) {
    return {
      title: "Install on Android",
      steps: [
        "Tap the '⋮' menu in the top right corner of Chrome.",
        "Tap 'Install app' or 'Add to Home screen'.",
        "Follow the prompt to add to your home screen.",
      ],
    };
  }

  return {
    title: "Install Progressive Web App",
    steps: [
      "Click the Install button in your browser's address bar (⤓ or ⊞+).",
      "Or open your browser's menu and select 'Install app' or 'Add to Home screen'.",
    ],
  };
}

export function Footer() {
  const caseStudies = featuredProjects.filter((p) => p.caseStudy);
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (window.matchMedia("(display-mode: standalone)").matches) {
        setIsInstalled(true);
      }
    }

    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e as BeforeInstallPromptEvent);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setInstallPrompt(null);
      setShowModal(false);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstall);
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!installPrompt) {
      soundTap();
      hapticTap();
      setShowModal(true);
      return;
    }

    soundPop();
    hapticTap();
    await installPrompt.prompt();
    const { outcome } = await installPrompt.userChoice;
    if (outcome === "accepted") {
      soundSuccess();
      hapticSuccess();
      setIsInstalled(true);
      setInstallPrompt(null);
    }
  };

  const instructions = getPlatformInstallInstructions();

  return (
    <footer className="border-t border-line/60 bg-panel/40 backdrop-blur-md pt-12 pb-24 sm:pb-16 font-mono text-xs">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* Top Status & Quick Action Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-line/40 pb-8 text-dust">
          <div className="flex items-center gap-3">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
            </span>
            <span className="text-fog">
              Available for select projects <span className="text-dust">· Butwal, Nepal (UTC+5:45)</span>
            </span>
          </div>
          <div className="flex items-center gap-3">
            {/* Install PWA Button */}
            {isInstalled ? (
              <span className="inline-flex items-center gap-1.5 rounded-[8px] border border-emerald-500/40 bg-emerald-500/10 px-2.5 py-1 text-[11px] text-emerald-400 font-bold">
                <Check size={12} /> app installed
              </span>
            ) : (
              <button
                type="button"
                onClick={handleInstallClick}
                className="ios-touch inline-flex items-center gap-1.5 rounded-[8px] border border-amber/60 bg-amber/10 px-2.5 py-1 text-[11px] text-amber font-medium transition-all hover:bg-amber hover:text-night active:scale-95 shadow-[0_0_8px_rgba(255,180,84,0.15)]"
                title="Install standalone app"
              >
                <Download size={13} className="text-amber" />
                <span>install app</span>
              </button>
            )}

            <span className="hidden sm:inline-block rounded-[8px] border border-line/50 bg-line/20 px-2.5 py-1 text-[11px] text-amber">
              ⌘K for terminal · ? for shortcuts
            </span>
            <a
              href="#hero"
              className="ios-touch inline-flex items-center gap-1 rounded-[8px] px-2 py-1 text-dust transition-colors hover:text-amber"
            >
              ↑ top
            </a>
          </div>
        </div>

        {/* Custom Install Modal */}
        {showModal && (
          <div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-night/80 p-4 backdrop-blur-sm animate-[fade-in_0.15s_ease_both]"
            role="dialog"
            aria-modal="true"
            onClick={() => setShowModal(false)}
          >
            <div
              className="ios-glass-card w-full max-w-md overflow-hidden rounded-[20px] border border-line/60 bg-panel p-6 shadow-2xl shadow-black/80"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b border-line/40 pb-3">
                <div className="flex items-center gap-2">
                  <Download size={16} className="text-amber" />
                  <h3 className="font-mono text-sm font-bold text-fog">{instructions.title}</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="ios-touch rounded-[8px] p-1 text-dust hover:text-amber"
                >
                  <XMark size={16} />
                </button>
              </div>

              <div className="mt-4 space-y-3 font-mono text-xs text-dust">
                <p className="text-fog">To install this portfolio as a standalone offline application:</p>
                <ol className="list-decimal space-y-2 pl-4 leading-relaxed">
                  {instructions.steps.map((step, i) => (
                    <li key={i}>{step}</li>
                  ))}
                </ol>
              </div>

              <div className="mt-6 flex justify-end border-t border-line/40 pt-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="ios-touch rounded-[10px] bg-amber px-4 py-2 font-mono text-xs font-bold text-night hover:bg-ember active:scale-95"
                >
                  Got it
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 4-Column Grid */}
        <div className="grid grid-cols-1 gap-10 py-12 sm:grid-cols-2 md:grid-cols-4">
          {/* Col 1: Bio & Alias */}
          <div className="space-y-3">
            <div className="text-sm font-bold text-fog">
              <span className="text-amber">{site.name}</span>
              <span className="ml-1.5 text-dust text-xs font-normal">(@{site.alias})</span>
            </div>
            <p className="text-dust leading-relaxed text-[11px]">
              Self-taught frontend developer & CTO at Sajilo Digital. Building resilient web systems, disaster platforms, and map-first apps from Nepal.
            </p>
            <div className="pt-2 text-dust text-[11px]">
              <span className="text-amber">70+</span> public repos · <span className="text-amber">3</span> production systems
            </div>
          </div>

          {/* Col 2: Navigation */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-fog">// navigation</h4>
            <ul className="space-y-2 text-dust">
              <li>
                <Link href="/#about" className="ios-touch inline-block transition-colors hover:text-amber">
                  ./about
                </Link>
              </li>
              <li>
                <Link href="/#skills" className="ios-touch inline-block transition-colors hover:text-amber">
                  ./skills
                </Link>
              </li>
              <li>
                <Link href="/#work" className="ios-touch inline-block transition-colors hover:text-amber">
                  ./work
                </Link>
              </li>
              <li>
                <Link href="/#gallery" className="ios-touch inline-block transition-colors hover:text-amber">
                  ./gallery
                </Link>
              </li>
              <li>
                <Link href="/#open-source" className="ios-touch inline-block transition-colors hover:text-amber">
                  ./open-source
                </Link>
              </li>
              <li>
                <Link href="/#experience" className="ios-touch inline-block transition-colors hover:text-amber">
                  ./experience
                </Link>
              </li>
              <li>
                <Link href="/#contact" className="ios-touch inline-block transition-colors hover:text-amber">
                  ./contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Case Studies */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-fog">// case studies</h4>
            <ul className="space-y-2 text-dust">
              {caseStudies.map((cs) => (
                <li key={cs.slug}>
                  <Link
                    href={`/work/${cs.slug}`}
                    className="ios-touch inline-flex items-center gap-1 transition-colors hover:text-amber"
                  >
                    <span>{cs.title}</span>
                    <ArrowUpRight size={10} className="inline opacity-60" />
                  </Link>
                </li>
              ))}
              <li>
                <a
                  href={site.company.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ios-touch inline-flex items-center gap-1 transition-colors hover:text-amber"
                >
                  <span>Sajilo Digital Pvt. Ltd.</span>
                  <ArrowUpRight size={10} className="inline opacity-60" />
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: Connect */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-fog">// connect</h4>
            <ul className="space-y-2 text-dust">
              {site.socials.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ios-touch inline-flex items-center gap-1.5 transition-colors hover:text-amber"
                  >
                    <span>{s.label.toLowerCase()}</span>
                    <span className="text-[10px] text-dust/60">({s.handle})</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Attribution */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-line/40 pt-8 text-[11px] text-dust">
          <p>
            © {new Date().getFullYear()} {site.name}. All rights reserved.
          </p>
          <p className="text-right text-dust/80">
            Next.js 16 · React 19 · TypeScript · Tailwind v4 · Framer Motion
          </p>
        </div>
      </div>
    </footer>
  );
}

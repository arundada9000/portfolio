/**
 * Web Audio API sound effects — no audio files needed.
 * Generates tiny UI sounds programmatically.
 */

let ctx: AudioContext | null = null;

function getCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    try {
      ctx = new AudioContext();
    } catch {
      return null;
    }
  }
  // Resume if suspended (browser autoplay policy)
  if (ctx.state === "suspended") ctx.resume();
  return ctx;
}

function play(
  freq: number,
  duration: number,
  type: OscillatorType = "sine",
  volume = 0.06,
): void {
  if (!soundsEnabled) return;
  const c = getCtx();
  if (!c) return;
  const osc = c.createOscillator();
  const gain = c.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  gain.gain.setValueAtTime(volume, c.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + duration);
  osc.connect(gain).connect(c.destination);
  osc.start();
  osc.stop(c.currentTime + duration);
}

export type AudioProfile = "apple" | "thock" | "retro";

let soundsEnabled = true;
let currentProfile: AudioProfile = "apple";

export function setSoundProfile(profile: AudioProfile): void {
  currentProfile = profile;
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem("portfolio-sound-profile", profile);
    } catch {}
  }
}

export function getSoundProfile(): AudioProfile {
  return currentProfile;
}

/** Soft click — button tap, selection */
export function soundTap(): void {
  if (currentProfile === "thock") {
    play(350, 0.04, "triangle", 0.08);
  } else if (currentProfile === "retro") {
    play(900, 0.04, "square", 0.04);
  } else {
    play(1200, 0.06, "sine", 0.04);
  }
}

/** Success chime — E5 to G#5 major third */
export function soundSuccess(): void {
  if (currentProfile === "retro") {
    play(523, 0.08, "square", 0.05);
    setTimeout(() => play(659, 0.08, "square", 0.05), 60);
    setTimeout(() => play(783, 0.12, "square", 0.05), 120);
  } else {
    play(659, 0.12, "sine", 0.05);
    setTimeout(() => play(830, 0.15, "sine", 0.04), 80);
  }
}

/** Low error buzz */
export function soundError(): void {
  if (currentProfile === "retro") {
    play(150, 0.1, "sawtooth", 0.07);
    setTimeout(() => play(100, 0.15, "sawtooth", 0.07), 80);
  } else {
    play(130, 0.18, "triangle", 0.06);
  }
}

/** Tiny tick — toggle, switch */
export function soundSwitch(): void {
  if (currentProfile === "thock") {
    play(280, 0.03, "triangle", 0.07);
  } else if (currentProfile === "retro") {
    play(1200, 0.02, "square", 0.03);
  } else {
    play(800, 0.04, "sine", 0.03);
  }
}

/** Barely-there shimmer — hover (desktop) */
export function soundHover(): void {
  if (currentProfile === "retro") {
    play(1800, 0.02, "square", 0.01);
  } else {
    play(2400, 0.03, "sine", 0.012);
  }
}

/** Two-note pop — notification, reveal */
export function soundPop(): void {
  if (currentProfile === "thock") {
    play(420, 0.04, "triangle", 0.06);
    setTimeout(() => play(300, 0.04, "triangle", 0.05), 30);
  } else if (currentProfile === "retro") {
    play(750, 0.03, "square", 0.04);
    setTimeout(() => play(1200, 0.05, "square", 0.03), 30);
  } else {
    play(600, 0.05, "sine", 0.04);
    setTimeout(() => play(900, 0.06, "sine", 0.03), 30);
  }
}

/** Keyboard typing click */
export function soundKeypress(): void {
  if (currentProfile === "thock") {
    play(220 + Math.random() * 80, 0.03, "triangle", 0.06);
  } else if (currentProfile === "retro") {
    play(1400 + Math.random() * 300, 0.02, "square", 0.02);
  } else {
    play(1600 + Math.random() * 400, 0.02, "square", 0.015);
  }
}

/** Theme switch whoosh */
export function soundThemeSwitch(): void {
  play(400, 0.12, "sine", 0.03);
  setTimeout(() => play(600, 0.08, "sine", 0.02), 60);
}

export function setSoundsEnabled(v: boolean): void {
  soundsEnabled = v;
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem("portfolio-sound", v ? "true" : "false");
    } catch {}
  }
}

export function areSoundsEnabled(): boolean {
  return soundsEnabled;
}

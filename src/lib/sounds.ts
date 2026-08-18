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

/** Soft click — button tap, selection */
export function soundTap(): void {
  play(1200, 0.06, "sine", 0.04);
}

/** Success chime — E5 to G#5 major third */
export function soundSuccess(): void {
  play(659, 0.12, "sine", 0.05);
  setTimeout(() => play(830, 0.15, "sine", 0.04), 80);
}

/** Low error buzz */
export function soundError(): void {
  play(130, 0.18, "triangle", 0.06);
}

/** Tiny tick — toggle, switch */
export function soundSwitch(): void {
  play(800, 0.04, "sine", 0.03);
}

/** Barely-there shimmer — hover (desktop) */
export function soundHover(): void {
  play(2400, 0.03, "sine", 0.012);
}

/** Two-note pop — notification, reveal */
export function soundPop(): void {
  play(600, 0.05, "sine", 0.04);
  setTimeout(() => play(900, 0.06, "sine", 0.03), 30);
}

/** Keyboard typing click */
export function soundKeypress(): void {
  play(1600 + Math.random() * 400, 0.02, "square", 0.015);
}

/** Theme switch whoosh */
export function soundThemeSwitch(): void {
  play(400, 0.12, "sine", 0.03);
  setTimeout(() => play(600, 0.08, "sine", 0.02), 60);
}

let soundsEnabled = true;

export function setSoundsEnabled(v: boolean): void {
  soundsEnabled = v;
}

export function areSoundsEnabled(): boolean {
  return soundsEnabled;
}

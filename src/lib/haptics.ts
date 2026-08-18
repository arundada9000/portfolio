/** Haptic feedback via navigator.vibrate() — no-op on desktop */
export function hapticTap(): void {
  navigator.vibrate?.(8);
}

export function hapticSuccess(): void {
  navigator.vibrate?.([10, 30, 15]);
}

export function hapticError(): void {
  navigator.vibrate?.(40);
}

export function hapticWarning(): void {
  navigator.vibrate?.([15, 20, 15]);
}

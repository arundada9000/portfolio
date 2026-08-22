/**
 * Shared microinteraction helpers for iOS HIG motion feel.
 * Includes magnetic hover, 3D card tilt, staggered entrances, and smooth tickers.
 */

/**
 * Magnetic hover effect: subtly pulls the element towards the cursor.
 * Returns a cleanup function.
 */
export function magneticHover(el: HTMLElement, strength = 0.25): () => void {
  if (typeof window === "undefined" || !el) return () => {};
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return () => {};
  if (window.matchMedia("(hover: none)").matches) return () => {};

  let raf = 0;

  const onMouseMove = (e: MouseEvent) => {
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) * strength;
    const dy = (e.clientY - cy) * strength;

    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(() => {
      el.style.transform = `translate3d(${dx}px, ${dy}px, 0)`;
      el.style.transition = "transform 0.15s cubic-bezier(0.22, 1, 0.36, 1)";
    });
  };

  const onMouseLeave = () => {
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(() => {
      el.style.transform = "translate3d(0, 0, 0)";
      el.style.transition = "transform 0.35s cubic-bezier(0.32, 0.72, 0, 1)";
    });
  };

  el.addEventListener("mousemove", onMouseMove);
  el.addEventListener("mouseleave", onMouseLeave);

  return () => {
    cancelAnimationFrame(raf);
    el.removeEventListener("mousemove", onMouseMove);
    el.removeEventListener("mouseleave", onMouseLeave);
    el.style.transform = "";
    el.style.transition = "";
  };
}

/**
 * 3D perspective tilt effect on hover for cards.
 * Returns a cleanup function.
 */
export function tiltEffect(el: HTMLElement, maxTilt = 4): () => void {
  if (typeof window === "undefined" || !el) return () => {};
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return () => {};
  if (window.matchMedia("(hover: none)").matches) return () => {};

  let raf = 0;

  const onMouseMove = (e: MouseEvent) => {
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const tiltX = ((y - cy) / cy) * -maxTilt;
    const tiltY = ((x - cx) / cx) * maxTilt;

    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(() => {
      el.style.transform = `perspective(1000px) rotateX(${tiltX.toFixed(2)}deg) rotateY(${tiltY.toFixed(2)}deg) scale3d(1.01, 1.01, 1.01)`;
      el.style.transition = "transform 0.1s ease-out";
    });
  };

  const onMouseLeave = () => {
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(() => {
      el.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)";
      el.style.transition = "transform 0.4s cubic-bezier(0.32, 0.72, 0, 1)";
    });
  };

  el.addEventListener("mousemove", onMouseMove);
  el.addEventListener("mouseleave", onMouseLeave);

  return () => {
    cancelAnimationFrame(raf);
    el.removeEventListener("mousemove", onMouseMove);
    el.removeEventListener("mouseleave", onMouseLeave);
    el.style.transform = "";
    el.style.transition = "";
  };
}

/**
 * Stagger entrance animation for a list of child elements.
 */
export function staggerIn(children: HTMLElement[], baseDelay = 40): void {
  if (typeof window === "undefined") return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  children.forEach((child, i) => {
    child.style.opacity = "0";
    child.style.transform = "translateY(12px)";
    setTimeout(() => {
      child.style.transition = "opacity 0.4s cubic-bezier(0.32, 0.72, 0, 1), transform 0.4s cubic-bezier(0.32, 0.72, 0, 1)";
      child.style.opacity = "1";
      child.style.transform = "translateY(0)";
    }, i * baseDelay);
  });
}
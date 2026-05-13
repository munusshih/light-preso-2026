const P5_SRC = "https://cdn.jsdelivr.net/npm/p5@1.11.0/lib/p5.min.js";

export function loadP5(): Promise<void> {
  if ((window as any).p5) return Promise.resolve();
  return new Promise((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(
      `script[src="${P5_SRC}"]`
    );
    if (existing) {
      existing.addEventListener("load", () => resolve());
      existing.addEventListener("error", () => reject());
      return;
    }
    const s = document.createElement("script");
    s.src = P5_SRC;
    s.onload = () => resolve();
    s.onerror = () => reject();
    document.head.appendChild(s);
  });
}

export const FONT_STACK =
  '"Source Serif 4", "Times New Roman", Times, Georgia, serif';

export const INK = "rgb(0, 0, 0)";
export const PAPER = "rgb(251, 250, 245)";
export const INK_RGB: [number, number, number] = [0, 0, 0];
export const PAPER_RGB: [number, number, number] = [251, 250, 245];

/**
 * Read theme-driven colors from a container's computed CSS variables.
 * Returned CSS color strings work with both p5.fill()/stroke() and
 * ctx.fillStyle. Falls back to light-mode defaults.
 */
export function readThemeColors(el: HTMLElement): { paper: string; ink: string } {
  const cs = getComputedStyle(el);
  const paper = cs.getPropertyValue("--paper").trim() || "#fbfaf5";
  const ink = cs.getPropertyValue("--ink").trim() || "#000000";
  return { paper, ink };
}

/**
 * Resolve the computed pixel size of `--fs-body` for this container by
 * probing a hidden span. Use to align canvas text with body text exactly.
 */
export function readBodyFontPx(el: HTMLElement): number {
  const probe = document.createElement("span");
  probe.style.cssText =
    "position:absolute;visibility:hidden;pointer-events:none;font-size:var(--fs-body);";
  el.appendChild(probe);
  const px = parseFloat(getComputedStyle(probe).fontSize) || 16;
  probe.remove();
  return px;
}

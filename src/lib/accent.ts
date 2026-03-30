/**
 * Resolved rgba from `--accent` for GSAP and other JS that cannot use CSS vars directly.
 */
export function accentRgba(alpha: number): string {
  if (typeof document === "undefined") return `rgba(0, 136, 204, ${alpha})`;
  const hex = getComputedStyle(document.documentElement).getPropertyValue("--accent").trim();
  const n = parseInt(hex.replace("#", ""), 16);
  if (Number.isNaN(n)) return `rgba(0, 136, 204, ${alpha})`;
  const r = (n >> 16) & 255;
  const g = (n >> 8) & 255;
  const b = n & 255;
  return `rgba(${r},${g},${b},${alpha})`;
}

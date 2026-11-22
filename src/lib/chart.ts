// Small helpers shared by the build-time SVG charts. No chart library: the
// charts are plain SVG written by the .astro components.

/** '2023-03-15' → 2023.2 */
export function yearOf(iso: string): number {
  const [y, m, d] = iso.split('-').map(Number);
  return y + ((m - 1) * 30.44 + (d - 1)) / 365.25;
}

/** '2023-03-15' → '15. 3. 2023' */
export function skDate(iso: string): string {
  const [y, m, d] = iso.split('-').map(Number);
  return `${d}. ${m}. ${y}`;
}

/** 1.57 → '1,6' */
export function skDecimal(n: number, digits = 1): string {
  return n.toFixed(digits).replace('.', ',');
}

const SUPERSCRIPT = '⁰¹²³⁴⁵⁶⁷⁸⁹';

/** 9.4e26 → '9,4 × 10²⁶' */
export function flopText(flop: number): string {
  const exp = Math.floor(Math.log10(flop));
  const mantissa = flop / 10 ** exp;
  const power = String(exp).replace(/\d/g, (digit) => SUPERSCRIPT[Number(digit)]);
  return `${skDecimal(mantissa)} × 10${power}`;
}

/** 1.57e9 → '1,6 mld.', 3.2e6 → '3,2 mil.' */
export function skBig(n: number): string {
  if (n >= 1e9) return `${skDecimal(n / 1e9)} mld.`;
  if (n >= 1e6) return `${skDecimal(n / 1e6)} mil.`;
  return Math.round(n).toLocaleString('sk-SK');
}

/** A linear map from a data range onto a pixel range. */
export function scale(d0: number, d1: number, p0: number, p1: number) {
  return (value: number) => p0 + ((value - d0) / (d1 - d0)) * (p1 - p0);
}

/** A column segment with only its top corners rounded. */
export function roundedTop(x: number, y: number, w: number, h: number, r: number): string {
  const rr = Math.min(r, h, w / 2);
  return `M${x},${y + h}V${y + rr}Q${x},${y} ${x + rr},${y}H${x + w - rr}Q${x + w},${y} ${x + w},${y + rr}V${y + h}Z`;
}

/** What the hover tooltip shows for one mark; serialised into data-tip. */
export interface Tip {
  title: string;
  rows: [label: string, value: string][];
}

/** For values in date order: true where a value beats everything before it. */
export function records(values: number[]): boolean[] {
  let best = -Infinity;
  return values.map((value) => (value > best ? ((best = value), true) : false));
}

/** Minutes → '3 s', '5 min', '17 h'. */
export function skDuration(minutes: number): string {
  if (minutes < 1) return `${Math.round(minutes * 60)} s`;
  if (minutes < 90) return `${Math.round(minutes)} min`;
  return `${Math.round(minutes / 60)} h`;
}

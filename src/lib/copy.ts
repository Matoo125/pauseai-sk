// The site's text lives in src/copy/sk.yaml. This loads it and turns the two
// bits of markup the file allows — {placeholders} and [links](url) — into output.

import { parse } from 'yaml';
import raw from '../copy/sk.yaml?raw';

type Vars = Record<string, string | number>;

interface TitledText {
  title: string;
  text: string;
}

/** The text of one chart; which keys it has depends on the chart (see sk.yaml). */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ChartText = Record<string, any>;

export interface Copy {
  site: { name: string; title: string; description: string; email: string; skip: string; logo_label: string };
  nav: Record<'label' | 'evidence' | 'questions' | 'about' | 'join', string>;
  hero: { title: string[]; lead: string; cta: string; cta_data: string; note: string; photo_alt: string };
  home_evidence: {
    heading: string;
    intro: string;
    more: string;
    public: { heading: string; figures: { figure: string; text: string }[]; source: string };
    quote: string;
    quote_source: string;
  };
  evidence_page: {
    heading: string;
    lead: string;
    description: string;
    contents: string;
    sources: string;
    video_play: string;
    video_note: string;
    tabs_label: string;
    reading: {
      heading: string;
      intro: string;
      kinds: Record<'report' | 'argument' | 'book', string>;
      open: string;
      disagree: string;
    };
  };
  charts: {
    source_line: string;
    table_summary: string;
    model: string;
    org: string;
    date: string;
    year: string;
    total: string;
    score: string;
    legend_record: string;
    legend_other: string;
    horizon: ChartText;
    compute: ChartText;
    cybench: ChartText;
    sectors: ChartText;
    investment: ChartText;
    frontiermath: ChartText;
    gpqa: ChartText;
    hle: ChartText;
  };
  demands: { heading: string; intro: string; more: string; items: (TitledText & { basis?: string })[] };
  join: {
    heading: string;
    text: string;
    contact: string;
    statement: { heading: string; text: string; button: string; url: string; also: string };
    form: Record<string, string>;
  };
  questions: { heading: string; lead: string; description: string; missing: string };
  footer: { about: string; pages: string; movement: string; contact: string; place: string; legal: string };
}

export const copy = parse(raw) as Copy;

const escapeHtml = (text: string) =>
  text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/** Slovak typography the editor shouldn't have to type: no line break inside 10 %, 2 778, 17 h or 290 mld. */
const tidy = (text: string) => text.replace(/(\d) (%|\d{3}\b|(?:s|min|h)\b|mld\.|mil\.)/g, '$1\u00a0$2');

function fillIn(text: string, vars: Vars): string {
  return text.replace(/\{(\w+)\}/g, (whole, key) => {
    if (!(key in vars)) throw new Error(`sk.yaml uses {${key}}, which this text has no value for`);
    return String(vars[key]);
  });
}

/** Plain text: placeholders filled, links reduced to their words. For attributes and titles. */
export function plain(text: string, vars: Vars = {}): string {
  return tidy(fillIn(text, vars).replace(/\[([^\]]+)\]\([^)]+\)/g, '$1'));
}

/** HTML for set:html: everything escaped, then [text](url) turned into links. */
export function rich(text: string, vars: Vars = {}): string {
  return escapeHtml(tidy(fillIn(text, vars))).replace(
    /\[([^\]]+)\]\(([^)\s]+)\)/g,
    (_, label, href) => `<a href="${href}">${label}</a>`,
  );
}

/** The "Zdroj: …" line under a chart, from a data file's `source` block. */
export function sourceLine(source: { name: string; url: string; licence: string; retrieved: string }): string {
  const [y, m, d] = source.retrieved.split('-').map(Number);
  return rich(copy.charts.source_line, { name: source.name, url: source.url, licence: source.licence, date: `${d}. ${m}. ${y}` });
}

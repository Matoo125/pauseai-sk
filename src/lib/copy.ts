// The site's text lives in src/copy/sk.yaml; the English landing page /en/ has src/copy/en.yaml.
// This loads them and turns the two bits of markup the files allow — {placeholders} and [links](url) — into output.

import { parse } from 'yaml';
import raw from '../copy/sk.yaml?raw';
import rawEn from '../copy/en.yaml?raw';

export type Lang = 'sk' | 'en';

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
  nav: Record<'label' | 'evidence' | 'articles' | 'questions' | 'about' | 'join' | 'switch', string>;
  hero: { title: string[]; lead: string; cta: string; cta_about: string; note: string; movement: string; cta_join: string; photo_alt: string };
  events: { heading: string; intro: string; photos: Record<'room' | 'horizon' | 'democracy', string>; caption: string };
  home_info: Record<'heading' | 'intro' | 'claims_heading' | 'claims_button' | 'articles_heading' | 'articles_button', string>;
  articles: Record<'heading' | 'lead' | 'description' | 'read' | 'all' | 'published' | 'feedback', string>;
  evidence_page: {
    heading: string;
    lead: string;
    description: string;
    contents: string;
    sources: string;
    video_play: string;
    video_note: string;
    tabs_label: string;
    feedback: string;
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
  join: {
    heading: string;
    text: string;
    contact: string;
    whatsapp: Record<'heading' | 'text' | 'button', string>;
    statement: { heading: string; text: string; button: string; url: string; also: string };
    form: Record<string, string>;
  };
  feedback: Record<string, string>;
  questions: { heading: string; lead: string; description: string; missing: string };
  footer: {
    about: string; partner: string; pages: string; movement: string; contact: string; place: string; legal: string;
    whatsapp: string; feedback_heading: string; feedback: string; feedback_link: string;
  };
}

export const copy = parse(raw) as Copy;

/** The English landing page's own section, in place of the Slovak claims and articles. */
export interface AboutText {
  heading: string;
  intro: string;
  ask_heading: string;
  ask: string[];
  read_heading: string;
  links: { title: string; text: string; url: string }[];
  slovak: string;
}

/** en.yaml has only what the landing page shows, so don't read other sections from it. */
export const copyEn = parse(rawEn) as Copy & { about: AboutText };

/** The landing page's components take a `lang` and get their text here. */
export const copyFor = (lang: Lang = 'sk'): Copy => (lang === 'en' ? copyEn : copy);

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

// The site's text lives in src/copy/sk.yaml. This loads it and turns the two
// bits of markup the file allows — {placeholders} and [links](url) — into output.

import { parse } from 'yaml';
import raw from '../copy/sk.yaml?raw';

type Vars = Record<string, string | number>;

interface TitledText {
  title: string;
  text: string;
}

export interface Copy {
  site: { name: string; title: string; description: string; email: string; skip: string; logo_label: string };
  nav: Record<
    'label' | 'data' | 'mission' | 'demands' | 'risks' | 'security' | 'questions' | 'sources' | 'about' | 'join',
    string
  >;
  hero: { title: string[]; lead: string; cta: string; cta_data: string; note: string; photo_alt: string };
  evidence: {
    heading: string;
    intro: string;
    more: string;
    source_line: string;
    compute: {
      title: string;
      subtitle: string;
      legend_record: string;
      legend_other: string;
      note: string;
      aria: string;
      table_summary: string;
      table_all: string;
      columns: Record<'model' | 'org' | 'date' | 'flop' | 'confidence', string>;
      tip_flop: string;
      confidence: Record<string, string>;
    };
    sectors: {
      title: string;
      subtitle: string;
      note: string;
      aria: string;
      table_summary: string;
      year: string;
      total: string;
      series: Record<'industry' | 'mixed' | 'academia' | 'other', string>;
    };
    survey: { heading: string; items: { figure: string; text: string }[]; source: string };
  };
  mission: { heading: string; paragraphs: string[]; quote: string; quote_source: string };
  demands: { heading: string; intro: string; more: string; items: (TitledText & { basis?: string })[] };
  risks: { heading: string; intro: string; read_more: string; items: (TitledText & { source?: string })[] };
  join: {
    heading: string;
    text: string;
    contact: string;
    statement: { heading: string; text: string; button: string; url: string; also: string };
    form: Record<
      | 'heading' | 'intro' | 'name' | 'name_placeholder' | 'email' | 'email_placeholder' | 'role'
      | 'role_placeholder' | 'volunteer' | 'button' | 'sending' | 'done' | 'success'
      | 'success_volunteer' | 'error' | 'privacy' | 'mail_subject',
      string
    >;
  };
  sources: {
    title: string;
    description: string;
    heading: string;
    intro: string;
    kinds: Record<'report' | 'argument' | 'book', string>;
    claim_label: string;
    open: string;
    data_note: string;
    disagree: { heading: string; paragraphs: string[] };
  };
  security: {
    chart: {
      title: string;
      subtitle: string;
      legend_record: string;
      legend_other: string;
      note: string;
      aria: string;
      table_summary: string;
      columns: Record<'model' | 'org' | 'date' | 'solved' | 'reported', string>;
    };
  };
  questions: { heading: string; lead: string; description: string; missing: string };
  footer: { about: string; pages: string; movement: string; contact: string; place: string; legal: string };
}

export const copy = parse(raw) as Copy;

const escapeHtml = (text: string) =>
  text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/** Slovak typography the editor shouldn't have to type: no line break before % or inside 2 778. */
const tidy = (text: string) => text.replace(/(\d) (%|\d{3}\b)/g, '$1 $2');

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

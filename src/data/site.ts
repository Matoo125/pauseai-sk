// Settings that aren't prose. The words are in src/copy/sk.yaml.
import { copy } from '../lib/copy';

/** Formspree form that receives the sign-ups. */
export const formEndpoint = 'https://formspree.io/f/xppagjeo';

/** The top menu. Absolute paths, so the same menu works on every page. */
export const nav = [
  { href: '/informacie/', label: copy.nav.evidence },
  { href: '/otazky/', label: copy.nav.questions },
  { href: '/kto-sme/', label: copy.nav.about },
];

export const footerNav = nav;

export const joinHref = '/#pridaj-sa';

export const movement = [
  { href: 'https://pauseai.info', label: 'PauseAI Global' },
  { href: 'https://pauseai-us.org', label: 'PauseAI USA' },
  { href: 'https://pauseai.uk', label: 'PauseAI UK' },
  { href: 'https://pauseai.cz', label: 'PauseAI Česko' },
];

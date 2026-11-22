// Settings that aren't prose. The words are in src/copy/sk.yaml.
import { copy } from '../lib/copy';

/** Formspree form that receives the sign-ups. */
export const formEndpoint = 'https://formspree.io/f/xppagjeo';

/** The top menu. Absolute paths, so the same menu works on every page. */
export const nav = [
  { href: '/#data', label: copy.nav.data },
  { href: '/#poziadavky', label: copy.nav.demands },
  { href: '/bezpecnost/', label: copy.nav.security },
  { href: '/otazky/', label: copy.nav.questions },
  { href: '/zdroje/', label: copy.nav.sources },
  { href: '/kto-sme/', label: copy.nav.about },
];

/** The footer lists everything, including the landing page's other sections. */
export const footerNav = [
  { href: '/#data', label: copy.nav.data },
  { href: '/#poslanie', label: copy.nav.mission },
  { href: '/#poziadavky', label: copy.nav.demands },
  { href: '/#rizika', label: copy.nav.risks },
  { href: '/bezpecnost/', label: copy.nav.security },
  { href: '/otazky/', label: copy.nav.questions },
  { href: '/zdroje/', label: copy.nav.sources },
  { href: '/kto-sme/', label: copy.nav.about },
];

export const joinHref = '/#pridaj-sa';

export const movement = [
  { href: 'https://pauseai.info', label: 'PauseAI Global' },
  { href: 'https://pauseai-us.org', label: 'PauseAI USA' },
  { href: 'https://pauseai.uk', label: 'PauseAI UK' },
  { href: 'https://pauseai.cz', label: 'PauseAI Česko' },
];

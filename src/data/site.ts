// Settings that aren't prose. The words are in src/copy/sk.yaml.
import { copy } from '../lib/copy';

/** Formspree form that receives the sign-ups. */
export const formEndpoint = 'https://formspree.io/f/xppagjeo';

/** Absolute paths, so the same menu works on every page. */
export const nav = [
  { href: '/#data', label: copy.nav.data },
  { href: '/#poslanie', label: copy.nav.mission },
  { href: '/#poziadavky', label: copy.nav.demands },
  { href: '/#rizika', label: copy.nav.risks },
  { href: '/zdroje/', label: copy.nav.sources },
];

export const joinHref = '/#pridaj-sa';

export const movement = [
  { href: 'https://pauseai.info', label: 'PauseAI Global' },
  { href: 'https://pauseai-us.org', label: 'PauseAI USA' },
  { href: 'https://pauseai.uk', label: 'PauseAI UK' },
  { href: 'https://pauseai.cz', label: 'PauseAI Česko' },
];

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

/** The site's public repository: feedback goes to its issues. */
export const repoUrl = 'https://github.com/Matoo125/pauseai-sk';
export const feedbackHref = `${repoUrl}/issues/new/choose`;

export const movement = [
  { href: 'https://pauseai.info', label: 'PauseAI Global' },
  { href: 'https://pause-ai.de', label: 'PauseAI Nemecko' },
  { href: 'https://pauseai.uk', label: 'PauseAI UK' },
  { href: 'https://pauseai.cz', label: 'PauseAI Česko' },
];

// Settings that aren't prose. The words are in src/copy/sk.yaml.
import { copy, type Lang } from '../lib/copy';

/** Formspree form that receives the sign-ups. */
export const formEndpoint = 'https://formspree.io/f/xppagjeo';

/** The top menu. Absolute paths, so the same menu works on every page. */
export const nav = [
  { href: '/informacie/', label: copy.nav.evidence },
  { href: '/clanky/', label: copy.nav.articles },
  { href: '/otazky/', label: copy.nav.questions },
  { href: '/kto-sme/', label: copy.nav.about },
];

export const footerNav = nav;

export const joinHref = '/#pridaj-sa';

/** Only the landing page exists in English, at /en/. */
export const homeHrefFor = (lang: Lang = 'sk') => (lang === 'en' ? '/en/' : '/');
export const joinHrefFor = (lang: Lang = 'sk') => `${homeHrefFor(lang)}#pridaj-sa`;

/** Invite link of the WhatsApp group (https://chat.whatsapp.com/…). Leave it empty to hide the WhatsApp links. */
export const whatsappHref = 'https://chat.whatsapp.com/IWelMw0y2880Y1I7fc6Mnt';

/** Bianka Madarászová's bachelor's thesis; the file is in public/praca/. */
export const thesisHref = '/praca/madaraszova-2026-ai-kognitivne-schopnosti.pdf';

/** The site's public repository. Feedback goes through the form on /spatna-vazba/; issues are the public alternative. */
export const repoUrl = 'https://github.com/Matoo125/pauseai-sk';
export const issuesHref = `${repoUrl}/issues/new/choose`;
export const feedbackHref = '/spatna-vazba/';

export const movement = [
  { href: 'https://pauseai.info', label: 'PauseAI Global', en: 'PauseAI Global' },
  { href: 'https://pause-ai.de', label: 'PauseAI Nemecko', en: 'PauseAI Germany' },
  { href: 'https://pauseai.uk', label: 'PauseAI UK', en: 'PauseAI UK' },
  { href: 'https://pauseai.cz', label: 'PauseAI Česko', en: 'PauseAI Czechia' },
];

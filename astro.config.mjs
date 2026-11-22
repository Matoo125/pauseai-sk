import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://pauseai.sk',
  // The evidence page was briefly at /dokazy/; keep old links working.
  redirects: {
    '/dokazy': '/informacie/',
  },
});

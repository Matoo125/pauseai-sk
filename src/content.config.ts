import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// The reading list on /zdroje/: one Markdown file per source. The file name is
// the entry's id, used in links (/zdroje/#id) and by `source:` in sk.yaml.
const zdroje = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/zdroje' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      authors: z.string(),
      year: z.number(),
      // What kind of text it is; decides which group it is listed under.
      kind: z.enum(['report', 'argument', 'book']),
      // The source's central claim in a sentence or two.
      claim: z.string(),
      url: z.string().url(),
      // Free text: language, translations, length.
      format: z.string(),
      // Position within its group, lowest first.
      order: z.number().default(0),
      // Optional cover, as a path relative to the entry (./covers/name.jpg), and who owns it.
      cover: image().optional(),
      cover_credit: z.string().optional(),
    }),
});

// Questions and objections on /otazky/: the question in the front matter, the answer as the body.
const otazky = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/otazky' }),
  schema: z.object({
    question: z.string(),
    order: z.number(),
  }),
});

// Long-form pages written as Markdown: /bezpecnost/ and /kto-sme/.
const stranky = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/stranky' }),
  schema: z.object({
    title: z.string(),
    lead: z.string(),
    description: z.string().optional(),
  }),
});

export const collections = { zdroje, otazky, stranky };

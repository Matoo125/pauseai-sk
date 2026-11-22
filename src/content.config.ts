import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// The reading list on /zdroje/: one Markdown file per source. The file name is
// the entry's id, used in links (/zdroje/#id) and by `source:` in sk.yaml.
const zdroje = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/zdroje' }),
  schema: z.object({
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
  }),
});

export const collections = { zdroje };

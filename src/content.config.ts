import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// The reading list at the end of /informacie/: one Markdown file per book or report.
// The body is not shown; the list uses the front matter only.
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

// The claims on /informacie/: the claim as the title, its charts and figures in the
// front matter, and the context (including what the data doesn't show) as the body.
const tvrdenia = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/tvrdenia' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      order: z.number(),
      // Charts to show, by name; see src/components/charts/.
      charts: z.array(z.enum(['horizon', 'compute', 'frontiermath', 'gpqa', 'hle', 'cybench', 'sectors', 'investment'])).default([]),
      // Headline numbers shown in place of (or beside) a chart.
      figures: z.array(z.object({ figure: z.string(), text: z.string() })).default([]),
      // A YouTube video, shown as a still image until the visitor presses play.
      video: z
        .object({
          youtube: z.string(),
          // Where to start, in seconds.
          start: z.number().default(0),
          // Still image, as a path relative to the claim (./media/name.jpg).
          poster: image(),
          caption: z.string(),
          credit: z.string(),
          credit_url: z.string().url(),
        })
        .optional(),
      sources: z.array(z.object({ label: z.string(), url: z.string().url() })),
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

// Long-form pages written as Markdown: /kto-sme/.
const stranky = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/stranky' }),
  schema: z.object({
    title: z.string(),
    lead: z.string(),
    description: z.string().optional(),
  }),
});

export const collections = { tvrdenia, zdroje, otazky, stranky };

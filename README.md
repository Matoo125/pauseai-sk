# PauseAI Slovensko — pauseai.sk

Astro site: a campaign landing page with an evidence section drawn from public data.

```sh
bun install
bun run dev      # http://localhost:4321 (or `bun run dev pauseai` from the repo root, port 8083)
bun run build    # → dist/
bun run data     # refresh the chart data from Epoch AI
```

## Where things are

| To change… | Edit |
|---|---|
| Any Slovak text on the site | `src/copy/sk.yaml` (one file, in page order) |
| The reading list on `/zdroje/` | one Markdown file per source in `src/content/zdroje/` |
| Menu links, form endpoint, sister sites | `src/data/site.ts` |
| Colours, type, layout | `src/styles/global.css` |
| Chart data | don't edit `src/data/epoch.json` by hand — run `bun run data` |

In `sk.yaml`, `{name}` is a value the build fills in and `[text](url)` is a link. A typo in a
placeholder or in a risk's `source:` stops the build with a message naming it.

To add a source, copy a file in `src/content/zdroje/`; the fields are described in
`src/content.config.ts`. Restart `bun run dev` after adding the first file of a new kind.

## Sign-ups

The form posts name, e-mail and an optional note to Formspree, which mails them to the coordinators.
It is a contact list, not a petition: the page sends people to pauseai.info to sign the movement's
statement.

## Charts

`scripts/update-data.ts` downloads Epoch AI's "Notable AI models" CSV and reduces it to
`src/data/epoch.json`, which is committed. The charts are plain SVG written at build time by
`ComputeChart.astro` and `SectorChart.astro`; their headline numbers are computed from that file, so
they change when the data does. After `bun run data`, read the diff and the page before committing.

The data is CC BY 4.0: keep the source line under each chart.

## Deploy

`deploy pauseai` on the server (see `server-config/deploy/apps.yaml`): installs, builds, publishes `dist/`.

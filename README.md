# PauseAI Slovensko — pauseai.sk

Astro site: a campaign landing page with an evidence section drawn from public data.

```sh
bun install
bun run dev      # http://localhost:4321 (or `bun run dev pauseai` from the repo root, port 8083)
bun run build    # → dist/
bun run data     # refresh the chart data from Epoch AI
```

## How the site is organised

Three pages and one building block:

- **/** — the pitch in one scroll: hero, evidence in brief, the three demands, sign-up.
- **/informacie/** — the evidence, as a list of *claims*. A claim is one sentence we assert, the chart
  or figure behind it, a few lines of context including what the data doesn't show, and its
  sources. The reading list closes the page.
- **/otazky/** — objections and answers.
- **/kto-sme/** — who is behind the site; linked from the footer only.

## Where things are

| To change… | Edit |
|---|---|
| Short text anywhere: headings, buttons, chart titles, the demands | `src/copy/sk.yaml` |
| A claim on `/informacie/` | its Markdown file in `src/content/tvrdenia/` |
| A question on `/otazky/` | its Markdown file in `src/content/otazky/` |
| The reading list | one Markdown file per book or report in `src/content/zdroje/` (covers in `covers/`) |
| The about page | `src/content/stranky/kto-sme.md` |
| Menu links, form endpoint, sister sites | `src/data/site.ts` |
| Colours, type, layout | `src/styles/global.css` |
| Chart data | don't edit `src/data/*.json` by hand — run `bun run data` |

In `sk.yaml`, `{name}` is a value the build fills in and `[text](url)` is a link. A typo in a
placeholder stops the build with a message naming it.

To add a claim, copy a file in `src/content/tvrdenia/`: `charts:` lists which charts it shows
(the names are in `src/content.config.ts`), `figures:` are headline numbers, `video:` is a YouTube
video shown as a still until someone presses play, and `sources:` are its links.
Restart `bun run dev` after adding a new folder of content.

## Sign-ups

The form posts name, e-mail and an optional note to Formspree, which mails them to the coordinators.
It is a contact list, not a petition: the page sends people to pauseai.info to sign the movement's
statement.

## Charts

`scripts/update-data.ts` downloads the data and reduces it to small committed files in `src/data/`:

| File | From | Chart |
|---|---|---|
| `epoch.json` | Epoch AI, notable AI models | training compute; who publishes models |
| `horizon.json` | METR time horizons, via Epoch AI's benchmark archive | task length |
| `cybench.json` | Cybench, via the same archive | hacking tasks solved |
| `investment.json` | Our World in Data (AI Index) | private investment |

The script needs `unzip`. The charts are plain SVG written at build time. There are two chart
components, `ScatterChart.astro` and `ColumnChart.astro` in `src/components/charts/`; the files
beside them only prepare one dataset each. Headline numbers are computed from the data, so they
change when it does: after `bun run data`, read the diff and the page before committing.

All of the data is CC BY 4.0: keep the source line under each chart.

## Deploy

`deploy pauseai` on the server (see `server-config/deploy/apps.yaml`): installs, builds, publishes `dist/`.

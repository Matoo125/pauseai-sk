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
| Demands, risks, nav, contact e-mail, form endpoint | `src/data/site.ts` |
| Hero, mission, petition copy | the matching file in `src/components/` |
| Evidence text and the survey figures | `src/components/Evidence.astro` |
| Colours, type, layout | `src/styles/global.css` |
| Chart data | don't edit `src/data/epoch.json` by hand — run `bun run data` |

## Charts

`scripts/update-data.ts` downloads Epoch AI's "Notable AI models" CSV and reduces it to
`src/data/epoch.json`, which is committed. The charts are plain SVG written at build time by
`ComputeChart.astro` and `SectorChart.astro`; their headline numbers are computed from that file, so
they change when the data does. After `bun run data`, read the diff and the page before committing.

The data is CC BY 4.0: keep the source line under each chart.

## Deploy

`deploy pauseai` on the server (see `server-config/deploy/apps.yaml`): installs, builds, publishes `dist/`.

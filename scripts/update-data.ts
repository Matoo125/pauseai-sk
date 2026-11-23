#!/usr/bin/env bun
// Refresh the chart data from Epoch AI's public datasets:
//   src/data/epoch.json    "Notable AI models" (training compute, who publishes)
//   src/data/cybench.json  Cybench results from the benchmarking hub
//   src/data/horizon.json  METR task time horizons, from the same hub
//   src/data/benchmarks.json  FrontierMath, GPQA Diamond and Humanity's Last Exam, same hub
// and from Our World in Data:
//   src/data/investment.json  private investment in AI companies per year
//
//   bun run data
//
// The JSON is committed, so a build never needs the network and the page
// always says which day its numbers are from. Run this when you want fresher
// charts, look at the diff, commit.
//
// Data: Epoch AI, https://epoch.ai/data/ai-models and https://epoch.ai/benchmarks (CC BY 4.0);
// Our World in Data, https://ourworldindata.org/grapher/private-investment-in-artificial-intelligence.

import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';

const SOURCE_CSV = 'https://epoch.ai/data/notable_ai_models.csv';
const SOURCE_PAGE = 'https://epoch.ai/data/ai-models';
const FROM_YEAR = 2010;
const OUT = path.join(import.meta.dir, '../src/data/epoch.json');

/** RFC 4180: quoted fields may hold commas, quotes ("") and newlines. */
function parseCsv(text: string): Record<string, string>[] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = '';
  let quoted = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (quoted) {
      if (ch === '"' && text[i + 1] === '"') { field += '"'; i++; }
      else if (ch === '"') quoted = false;
      else field += ch;
    } else if (ch === '"') quoted = true;
    else if (ch === ',') { row.push(field); field = ''; }
    else if (ch === '\n') { row.push(field); rows.push(row); row = []; field = ''; }
    else if (ch !== '\r') field += ch;
  }
  if (field !== '' || row.length) { row.push(field); rows.push(row); }
  const [header, ...body] = rows;
  return body
    .filter((r) => r.length === header.length)
    .map((r) => Object.fromEntries(header.map((name, i) => [name, r[i].trim()])));
}

const need = (row: Record<string, string>, column: string): string => {
  if (!(column in row)) throw new Error(`Epoch changed its CSV: no "${column}" column`);
  return row[column];
};

type Sector = 'industry' | 'academia' | 'mixed' | 'other';

function sectorOf(categorization: string): Sector {
  const parts = categorization.split(',').map((p) => p.trim()).filter(Boolean);
  if (parts.length === 0) return 'other';
  const industry = parts.some((p) => p === 'Industry');
  const academia = parts.some((p) => p === 'Academia');
  if (industry && academia) return 'mixed';
  if (industry && parts.every((p) => p === 'Industry')) return 'industry';
  if (academia && parts.every((p) => p === 'Academia')) return 'academia';
  return industry || academia ? 'mixed' : 'other';
}

const response = await fetch(SOURCE_CSV, { headers: { 'User-Agent': 'pauseai-sk-site-build' } });
if (!response.ok) throw new Error(`${SOURCE_CSV} answered ${response.status}`);
const rows = parseCsv(await response.text());
if (rows.length < 500) throw new Error(`Only ${rows.length} rows parsed — refusing to overwrite the data`);

const dated = rows.filter((r) => /^\d{4}-\d{2}-\d{2}$/.test(need(r, 'Publication date')));
const latest = dated.map((r) => r['Publication date']).sort().at(-1)!;

// ── Training compute of each notable model ───────────────────────────────────
const points = dated
  .map((r) => ({
    name: need(r, 'Model'),
    org: need(r, 'Organization'),
    date: r['Publication date'],
    flop: Number(need(r, 'Training compute (FLOP)')),
    // Epoch's own label for how sure the estimate is: Confident / Likely / Speculative
    confidence: need(r, 'Confidence'),
  }))
  .filter((p) => Number.isFinite(p.flop) && p.flop > 0 && p.date >= `${FROM_YEAR}-01-01`)
  .map((p) => ({ ...p, flop: Number(p.flop.toPrecision(3)) }))
  .sort((a, b) => a.date.localeCompare(b.date));

// A model is a "record" if nothing published before it used more compute.
let max = 0;
const records = points.filter((p) => (p.flop > max ? ((max = p.flop), true) : false)).map((p) => p.name);

// ── Who publishes notable models, per full calendar year ─────────────────────
const lastFullYear = Number(latest.slice(0, 4)) - 1;
const sectors = [];
for (let year = FROM_YEAR; year <= lastFullYear; year++) {
  const tally: Record<Sector, number> = { industry: 0, academia: 0, mixed: 0, other: 0 };
  for (const r of dated) {
    if (r['Publication date'].startsWith(String(year))) tally[sectorOf(need(r, 'Organization categorization'))]++;
  }
  sectors.push({ year, ...tally });
}

const data = {
  source: {
    name: 'Epoch AI, Data on AI models',
    url: SOURCE_PAGE,
    csv: SOURCE_CSV,
    licence: 'CC BY 4.0',
    retrieved: new Date().toISOString().slice(0, 10),
    latestModel: latest,
  },
  compute: { fromYear: FROM_YEAR, records, points },
  sectors,
};

writeFileSync(OUT, JSON.stringify(data, null, 1) + '\n');
console.log(`${points.length} models with a compute estimate, ${records.length} records, sectors ${FROM_YEAR}–${lastFullYear}`);
console.log(`→ ${path.relative(process.cwd(), OUT)}`);

// ── Cybench: share of professional CTF tasks each model solved unaided ───────
// Epoch publishes its benchmark hub only as one zip, so this needs `unzip`.
const BENCH_ZIP = 'https://epoch.ai/data/benchmark_data.zip';
const BENCH_PAGE = 'https://epoch.ai/benchmarks';
const CYBENCH_OUT = path.join(import.meta.dir, '../src/data/cybench.json');

const zip = await fetch(BENCH_ZIP, { headers: { 'User-Agent': 'pauseai-sk-site-build' } });
if (!zip.ok) throw new Error(`${BENCH_ZIP} answered ${zip.status}`);
const scratch = mkdtempSync(path.join(tmpdir(), 'epoch-bench-'));
const zipPath = path.join(scratch, 'benchmark_data.zip');
writeFileSync(zipPath, Buffer.from(await zip.arrayBuffer()));
const fromZip = (file: string): string => {
  const unzip = Bun.spawnSync(['unzip', '-p', zipPath, file]);
  if (unzip.exitCode !== 0) throw new Error(`unzip ${file} failed: ${unzip.stderr.toString() || 'is unzip installed?'}`);
  return unzip.stdout.toString();
};
const cybenchCsv = fromZip('cybench_external.csv');
const horizonCsv = fromZip('metr_time_horizons_external.csv');
const modelMetaCsv = fromZip('model_metadata.csv');
const benchCsvs = {
  frontiermath: fromZip('frontiermath_tiers_1_3_v2.csv'),
  gpqa: fromZip('gpqa_diamond.csv'),
  hle: fromZip('hle_external.csv'),
};
rmSync(scratch, { recursive: true });

const benchSource = {
  name: 'Epoch AI, Capabilities & benchmarking',
  url: BENCH_PAGE,
  licence: 'CC BY 4.0',
  retrieved: new Date().toISOString().slice(0, 10),
};

const results = parseCsv(cybenchCsv)
  .map((r) => ({
    name: need(r, 'Model version').replace(/_unknown$/, ''),
    org: need(r, 'Organization'),
    date: need(r, 'Release date'),
    solved: Number(need(r, 'Unguided % Solved')),
    // Where the number comes from: the public leaderboard, or the developer's own model card.
    reportedBy: need(r, 'Source'),
  }))
  .filter((r) => /^\d{4}-\d{2}-\d{2}$/.test(r.date) && Number.isFinite(r.solved) && r.solved > 0)
  .sort((a, b) => a.date.localeCompare(b.date));
if (results.length < 10) throw new Error(`Only ${results.length} Cybench results parsed — refusing to overwrite the data`);

writeFileSync(
  CYBENCH_OUT,
  JSON.stringify(
    {
      source: benchSource,
      results,
    },
    null,
    1,
  ) + '\n',
);
console.log(`${results.length} Cybench results → ${path.relative(process.cwd(), CYBENCH_OUT)}`);

// ── METR time horizons: how long a task (in human-expert minutes) a model finishes half the time ──
const HORIZON_OUT = path.join(import.meta.dir, '../src/data/horizon.json');
const measured = parseCsv(horizonCsv)
  .map((r) => ({
    name: need(r, 'Model version').replace(/_unknown$/, ''),
    org: need(r, 'Organization'),
    date: need(r, 'Release date'),
    minutes: Number(Number(need(r, 'Time horizon')).toPrecision(3)),
    current: need(r, 'METR version') === 'METR-Horizon-v1.1',
  }))
  .filter((r) => /^\d{4}-\d{2}-\d{2}$/.test(r.date) && Number.isFinite(r.minutes) && r.minutes > 0);
// A model measured under two versions of METR's method is kept once, under the newer one.
const byName = new Map<string, (typeof measured)[number]>();
for (const r of measured) {
  const seen = byName.get(r.name);
  if (!seen || (r.current && !seen.current)) byName.set(r.name, r);
}
const horizons = [...byName.values()]
  .map(({ current, ...r }) => r)
  .sort((a, b) => a.date.localeCompare(b.date));
if (horizons.length < 20) throw new Error(`Only ${horizons.length} time horizons parsed — refusing to overwrite the data`);
writeFileSync(
  HORIZON_OUT,
  JSON.stringify(
    { source: benchSource, measuredBy: { name: 'METR', url: 'https://metr.org/time-horizons/' }, results: horizons },
    null,
    1,
  ) + '\n',
);
console.log(`${horizons.length} time horizons → ${path.relative(process.cwd(), HORIZON_OUT)}`);

// ── Private investment in AI companies, world total per year ─────────────────
const OWID_CHART = 'https://ourworldindata.org/grapher/private-investment-in-artificial-intelligence';
const INVESTMENT_OUT = path.join(import.meta.dir, '../src/data/investment.json');
const owid = await fetch(`${OWID_CHART}.csv?v=1&csvType=full&useColumnShortNames=true`, {
  headers: { 'User-Agent': 'pauseai-sk-site-build' },
});
if (!owid.ok) throw new Error(`${OWID_CHART}.csv answered ${owid.status}`);
const investment = parseCsv(await owid.text())
  .filter((r) => need(r, 'entity') === 'World')
  .map((r) => ({ year: Number(need(r, 'year')), usd: Math.round(Number(need(r, 'private_investment'))) }))
  .filter((r) => Number.isFinite(r.usd))
  .sort((a, b) => a.year - b.year);
if (investment.length < 5) throw new Error(`Only ${investment.length} investment years parsed — refusing to overwrite the data`);
writeFileSync(
  INVESTMENT_OUT,
  JSON.stringify(
    {
      source: {
        name: 'Quid cez AI Index Report, spracovanie Our World in Data',
        url: OWID_CHART,
        licence: 'CC BY 4.0',
        retrieved: new Date().toISOString().slice(0, 10),
      },
      // Constant 2021 US dollars. Privately held AI companies raising over $1.5 million; excludes
      // listed companies and firms' own spending on research and data centres.
      years: investment,
    },
    null,
    1,
  ) + '\n',
);
console.log(`${investment.length} years of investment → ${path.relative(process.cwd(), INVESTMENT_OUT)}`);

// ── Benchmarks scored as a share of questions: one point per model ──────────
// Epoch lists each model once per reasoning setting (gpt-5_high, gpt-5_low, …);
// the chart keeps the best setting of each model, under the model's own name.
const BENCH_OUT = path.join(import.meta.dir, '../src/data/benchmarks.json');
const groupOf = new Map(
  parseCsv(modelMetaCsv)
    .filter((r) => need(r, 'model_version') && need(r, 'model_group'))
    .map((r) => [r.model_version, r.model_group]),
);
const BENCHMARKS = {
  frontiermath: { column: 'Best score (across scorers)', url: 'https://epoch.ai/frontiermath' },
  gpqa: { column: 'Best score (across scorers)', url: 'https://epoch.ai/benchmarks/gpqa-diamond' },
  hle: { column: 'Accuracy', url: 'https://lastexam.ai/' },
} as const;
const benchmarks: Record<string, unknown> = {};
for (const [key, { column, url }] of Object.entries(BENCHMARKS)) {
  const best = new Map<string, { name: string; org: string; date: string; score: number }>();
  for (const r of parseCsv(benchCsvs[key as keyof typeof benchCsvs])) {
    const version = need(r, 'Model version');
    const score = Number(need(r, column));
    const date = need(r, 'Release date');
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !Number.isFinite(score) || need(r, column) === '') continue;
    const name = groupOf.get(version) ?? r['Name'] ?? version.replace(/_[a-z]+$/, '');
    const seen = best.get(name);
    if (!seen || score > seen.score) best.set(name, { name, org: need(r, 'Organization'), date, score: Number(score.toFixed(3)) });
  }
  const results = [...best.values()].sort((a, b) => a.date.localeCompare(b.date) || a.score - b.score);
  if (results.length < 20) throw new Error(`Only ${results.length} ${key} results parsed — refusing to overwrite the data`);
  benchmarks[key] = { url, results };
}
writeFileSync(BENCH_OUT, JSON.stringify({ source: benchSource, ...benchmarks }, null, 1) + '\n');
console.log(`FrontierMath, GPQA Diamond, HLE → ${path.relative(process.cwd(), BENCH_OUT)}`);

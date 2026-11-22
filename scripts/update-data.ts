#!/usr/bin/env bun
// Refresh src/data/epoch.json from Epoch AI's public "Notable AI models" dataset.
//
//   bun run data
//
// The JSON is committed, so a build never needs the network and the page
// always says which day its numbers are from. Run this when you want fresher
// charts, look at the diff, commit.
//
// Data: Epoch AI, "Data on AI models", https://epoch.ai/data/ai-models (CC BY 4.0).

import { writeFileSync } from 'node:fs';
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

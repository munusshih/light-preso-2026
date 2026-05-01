#!/usr/bin/env node
// Extracts all external links from src/pages/*.mdx and writes a Chicago-style
// bibliography to src/pages/bibliography.mdx.
// Usage: npm run bibliography

import { readFile, writeFile, readdir } from 'fs/promises';
import { join, resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dir   = dirname(fileURLToPath(import.meta.url));
const ROOT    = resolve(__dir, '..');
const PAGES   = join(ROOT, 'src', 'pages');
const OUT     = join(PAGES, 'bibliography.mdx');

// ── Fetch og:title, og:site_name, <title> from a URL ─────────────────────────
async function fetchMeta(url) {
  try {
    const res = await fetch(url, {
      signal: AbortSignal.timeout(8000),
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36',
        'Accept': 'text/html',
      },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const html = await res.text();

    const get = (pattern) => html.match(pattern)?.[1]?.trim() ?? '';

    const ogTitle   = get(/<meta[^>]+property=["']og:title["'][^>]+content=["']([^"']+)["']/i)
                   || get(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:title["']/i);
    const ogSite    = get(/<meta[^>]+property=["']og:site_name["'][^>]+content=["']([^"']+)["']/i)
                   || get(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:site_name["']/i);
    const htmlTitle = get(/<title[^>]*>([^<]+)<\/title>/i);

    const domain = new URL(url).hostname.replace(/^www\./, '');

    return {
      title: ogTitle || htmlTitle || domain,
      site:  ogSite  || domain,
    };
  } catch {
    const domain = new URL(url).hostname.replace(/^www\./, '');
    return { title: domain, site: domain };
  }
}

// ── Chicago-style web citation ────────────────────────────────────────────────
function chicagoCite({ title, site, url }) {
  const accessed = new Date().toLocaleDateString('en-US', {
    month: 'long', day: 'numeric', year: 'numeric',
  });
  // Clean up title — unescape HTML entities
  const clean = (s) => s
    .replace(/&amp;/g, '&').replace(/&#38;/g, '&')
    .replace(/&quot;/g, '"').replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<').replace(/&gt;/g, '>');

  return `"${clean(title)}." *${clean(site)}*. Accessed ${accessed}. <${url}>.`;
}

// ── Extract external URLs from MDX source ────────────────────────────────────
function extractUrls(src) {
  const urls = new Set();
  // Markdown [text](url)
  for (const [, u] of src.matchAll(/\[(?:[^\]]*)\]\((https?:\/\/[^)\s]+)\)/g)) urls.add(u);
  // JSX/HTML src="..." href="..."
  for (const [, u] of src.matchAll(/(?:src|href)=["'](https?:\/\/[^"'\s]+)["']/g)) urls.add(u);
  return [...urls];
}

// ── Main ──────────────────────────────────────────────────────────────────────
async function main() {
  const files = (await readdir(PAGES))
    .filter(f => f.endsWith('.mdx') && f !== 'bibliography.mdx');

  const allUrls = new Set();
  for (const f of files) {
    const src = await readFile(join(PAGES, f), 'utf8');
    for (const u of extractUrls(src)) allUrls.add(u);
  }

  console.log(`\nFound ${allUrls.size} unique URL(s). Fetching metadata...\n`);

  const entries = [];
  for (const url of allUrls) {
    process.stdout.write(`  → ${url}\n     `);
    const meta = await fetchMeta(url);
    entries.push({ ...meta, url });
    console.log(`"${meta.title}" / ${meta.site}`);
  }

  // Sort alphabetically by title
  entries.sort((a, b) => a.title.localeCompare(b.title));

  const items = entries
    .map((e, i) => `${String(i + 1).padStart(2, '0')}. ${chicagoCite(e)}`)
    .join('\n');

  const output = `---
layout: ../layouts/Layout.astro
title: Bibliography
---

import Section from "../components/Section.astro";

<Section eyebrow="references" color="black">
  # Bibliography
</Section>

${items}

<Section eyebrow="generated">
  # Auto-generated
</Section>

Run \`npm run bibliography\` to refresh.
`;

  await writeFile(OUT, output, 'utf8');
  console.log(`\n✓ Wrote ${entries.length} citation(s) → ${OUT.replace(ROOT, '.')}\n`);
}

main().catch((err) => { console.error(err); process.exit(1); });

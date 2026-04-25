# Preso

A lightweight, no-build presentation site powered by markdown files.

Each file in `content/` is a page.

- `content/index.md` -> `#index`
- `content/meet-your-thesis-advisor-may-1.md` -> `#meet-your-thesis-advisor-may-1`

## Why this repo

- Fast to edit
- No bundler or framework
- Works great for simple presentations and talks
- Deployable on GitHub Pages

## Project structure

- `index.html`: shell page
- `scripts/main.js`: hash routing + markdown rendering
- `styles/main.css`: base styles
- `content/*.md`: your pages
- `assets/`: images, PDFs, media

## Create a new presentation page

1. Duplicate `content/template.md`
2. Rename it, for example: `content/my-talk.md`
3. Add front matter and markdown sections
4. Open it in browser with `#my-talk`

## Front matter

Use this at the top of each markdown file:

```md
---
title: Page Title
date: YYYY-MM-DD
author: Your Name
css: styles/optional-page.css
js: scripts/optional-page.js
---
```

Only `title`, `date`, and `author` are commonly needed. `css` and `js` are optional.

## Local usage

Open `index.html` in a browser or run a tiny static server.

Example (Python):

```bash
python3 -m http.server 8000
```

Then open:

- `http://localhost:8000/#index`
- `http://localhost:8000/#meet-your-thesis-advisor-may-1`

## Deployment

This repo is set up for GitHub Pages-style static hosting.

- Keep `.nojekyll`
- Keep `CNAME` if you use a custom domain

## Current deck

- Meet Your Thesis Advisor (May 1, 2026): `#meet-your-thesis-advisor-may-1`

# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

GitHub Pages website for the **swim-developer** open source initiative — reference components for SWIM (System Wide Information Management) in aviation. Deployed automatically to https://swim-developer.github.io on push to `main`.

## Local Development

```bash
python -m http.server 8000
# or
npx serve .
```

No build step, no bundler, no package manager. Pure static HTML/CSS/JS.

## Architecture

### Shared Resources

All pages share a single `styles.css` (2800+ lines) and `script.js`. There is no CSS preprocessor or JS bundler. External dependencies are loaded from CDNs:
- **Red Hat Display / Text / Mono** fonts (Google Fonts)
- **Font Awesome 6.5** icons

### Page Structure

- **Top-level pages** (`index.html`, `framework.html`, `projects.html`, `architecture.html`, `documentation.html`, `tutorials.html`) — standalone pages with shared navbar
- **Tutorial pages** (`tutorials/*.html`) — standalone tutorial landing pages
- **Wiki-style tutorials** (`tutorials/create-consumer/`, `tutorials/create-provider/`) — multi-page guides using the `wiki-layout` pattern (sidebar nav + content area)

Every HTML page duplicates the full `<nav>` and `<head>` block — there is no templating system. Changes to the navbar must be applied to all 37 HTML files.

### Design System

CSS custom properties defined in `:root` of `styles.css`:
- Color palette: dark theme with `--color-primary: #ee0000` (Red Hat red) accent
- Typography: `--font-display`, `--font-text`, `--font-mono`
- Shadows, radii, transitions all via variables

### JavaScript

`script.js` handles: navbar scroll effect, mobile menu toggle, smooth scroll anchors, Intersection Observer scroll animations, video carousel with YouTube modal, and wiki sidebar toggle. All pages include it, but features activate only when their DOM elements exist.

### Assets

`assets/images/` — SVG and PNG architectural diagrams used across pages. SVGs are the source of truth; PNGs are exported variants (black background, highlights, etc.).

## Key Rules

- **Naming must be unambiguous** — qualify names to differentiate from siblings

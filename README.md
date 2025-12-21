# swim-developer.github.io

Official website for the SWIM Developer open source initiative.

## Overview

This repository hosts the GitHub Pages website for the swim-developer organization, showcasing our mission to democratize aviation technology through open source components for SWIM (System Wide Information Management).

## Structure

```
swim-developer.github.io/
├── index.html      # Main landing page
├── styles.css      # Styling (Red Hat design system inspired)
├── script.js       # Interactive features
└── README.md       # This file
```

## Local Development

Simply open `index.html` in your browser, or use a local server:

```bash
# Python 3
python -m http.server 8000

# Node.js (with npx)
npx serve .
```

Then visit `http://localhost:8000`

## Design

The website uses:
- **Red Hat Display** / **Red Hat Text** fonts
- Dark theme with red accent colors
- Mobile-responsive design
- Intersection Observer for scroll animations

## Deployment

This site is automatically deployed via GitHub Pages when changes are pushed to the main branch.

**Live URL**: https://swim-developer.github.io

## License

BSD 3-Clause License

# My Personal Project Website

Welcome to my personal project website! A single, always-dark page: my hand drawn
signature animates into the centre of the screen over a rotating ASCII donut,
rendered in JavaScript and faded back so it sits quietly in the background.

View the website: www.AndrewGeorgiou.co.uk

## About the Project

This website is purely for fun and personal enjoyment. It uses:

- **HTML**: for the basic structure of the webpage.
- **CSS**: for the dark theme and the signature reveal animation.
- **JavaScript**: for the ASCII donut renderer.
- **Hosting**: GitHub Pages, deployed from `main` by GitHub Actions.

## Features

- **SVG Animation**: This website uses only animated SVG's, the stylised handwriting was done by myself on my iPad Pro using Procreate which I then vectorised and created a mask to follow the filled SVG.
- **ASCII Donut Background**: A rotating torus rendered as text, ported from my
  [donut.py](https://github.com/A-Georgiou/donut.py) project. All frame-independent
  trigonometry is precomputed and every frame reuses the same typed arrays, so the
  animation allocates nothing while running (~0.2 ms per frame at 240x80). It pauses
  when the tab is hidden and holds a single still frame when the visitor prefers
  reduced motion.

## Getting Started

To view or edit the project locally:

1. **Clone the repository**:
   ```bash
   git clone https://github.com/A-Georgiou/Personal_Webpage
   ```

2. **Serve it locally**:
   ```bash
   ./scripts/serve.sh        # http://localhost:8000
   ```

## Experimenting with New Designs

`main` is deployed straight to andrewgeorgiou.co.uk, so redesigns are done on
branches and previewed in a separate sandbox site that has no connection to the
live domain.

```bash
git switch -c design/my-idea       # branch off main; pushes here never deploy
./scripts/serve.sh                 # iterate locally
./scripts/publish-preview.sh       # publish a shareable preview
```

The preview is published to the
[personal-webpage-preview](https://github.com/A-Georgiou/personal-webpage-preview)
repository and served at
<https://a-georgiou.github.io/personal-webpage-preview/>. It carries a
`robots.txt` that blocks indexing so it never competes with the live site.
Because the sandbox is served from a project subpath, the publish script also
rewrites root-absolute references (`href="/css/..."`) to relative ones in the
published copy — the source markup is never modified.

Publishing requires the sandbox remote (one-time setup):

```bash
git remote add preview https://github.com/A-Georgiou/personal-webpage-preview.git
```

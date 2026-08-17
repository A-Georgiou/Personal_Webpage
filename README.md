# My Personal Project Website

Welcome to my personal project website! This is a fun, facetious project where I've created a simple webpage styled to look like a doodled notepad. The idea was to create something whimsical and enjoyable.

View the website: www.AndrewGeorgiou.co.uk

## About the Project

This website is purely for fun and personal enjoyment. It uses:

- **HTML**: for the basic structure of the webpage.
- **CSS**: to create the doodled notepad look and feel.
- **JavaScript**: for any interactive elements.
- **Hosting**: The site is hosted on my personal VPS.

## Features

- **SVG Animation**: This website uses only animated SVG's, the stylised handwriting was done by myself on my iPad Pro using Procreate which I then vectorised and created a mask to follow the filled SVG.
- **LocalStorage Dark-Mode**: Retains preferred mode (dark-mode / light-mode) using local storage.

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

Publishing requires the sandbox remote (one-time setup):

```bash
git remote add preview https://github.com/A-Georgiou/personal-webpage-preview.git
```

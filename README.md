# Rıza Erdi Karakuş — Portfolio

Static site (GitHub Pages). Dark theme, interactive app shelf, separate Privacy Policy & Terms for every app.

## Structure

```
index.html                 Homepage
assets/css/site.css        Homepage styles
assets/js/site.js          Homepage interactions (hero rotator, tilt cards, filters, modal, legal search)
assets/js/projects.js      GENERATED from projects.json
assets/css/legal.css       Legal page styles
assets/js/legal.js         Legal page TOC + progress bar
projects.json              App list (title, accent color, emoji, category, filters, App Store id…)
legal/apps.mjs             Legal content per app (data collected, permissions, third parties, disclaimers…)
legal/fragments/           Hand-written legal docs (Newborn AI, website terms)
legal/build.mjs            Builds all legal pages + projects.js + sitemap.xml
<app>/privacy.html         GENERATED — one folder per app
<app>/terms.html           GENERATED
app-privacy.html / app-terms.html   Old shared URLs, kept so existing App Store links still work
```

## Adding or editing an app

1. Add/edit the app in `projects.json` (set `legal.privacyUrl` / `legal.termsUrl` to `<slug>/privacy.html` / `<slug>/terms.html`).
2. Add its legal data in `legal/apps.mjs` under the same `id` (or point `fragments` to hand-written HTML in `legal/fragments/`).
3. Run:

```bash
node legal/build.mjs
```

## Preview locally

```bash
python3 -m http.server 5173
```

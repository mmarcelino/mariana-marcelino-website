# mariana-marcelino.com

Personal website of Mariana Marcelino — web strategy for growing businesses.

A single, long scrolling page built with plain HTML, CSS and JavaScript (no build step).

## Run locally

```bash
npm run dev
```

Then open http://localhost:3000 (uses Python's built-in web server).

## Files

- `index.html` — the whole page
- `styles.css` — design (Mono Space–inspired system, Instrument Sans)
- `main.js` — hero animation, image fades, forms
- `assets/` — images and icons

## To do before going live

- Set `FORM_ENDPOINT` in `main.js` (e.g. a Formspree URL) so the free-redesign form sends submissions; until then it opens the visitor's email app.

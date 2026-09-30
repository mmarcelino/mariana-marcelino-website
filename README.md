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

## Hosting (Vercel)

The site is deployed on Vercel. Headers (security, Content-Security-Policy and
browser caching) live in `vercel.json`; files that shouldn't be published
(build scripts, drafts) are listed in `.vercelignore`.

The CSP allows the two small inline scripts in every page's `<head>` by their
sha256 hash. If either script changes, recompute its hash and update
`vercel.json`, otherwise that script is blocked (the page still works, just
without the entrance animations / page-transition fade).

## Forms and emails

`api/contact.js` is a Vercel function that receives the three forms
(contact, free redesign, guide). It emails the enquiry to
info@mariana-marcelino.com and sends the visitor a branded confirmation in
the language of the page (PT or EN), through Resend.

Set in Vercel → Settings → Environment Variables:
- `RESEND_API_KEY` (required)
- `MAIL_FROM` (optional, default `Mariana Marcelino <info@mariana-marcelino.com>`)
- `MAIL_TO` (optional, default `info@mariana-marcelino.com`)

While `RESEND_API_KEY` isn't set, the function answers 503 and the site
sends the forms through Web3Forms instead (no confirmation email).

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

## Chat assistant

`api/chat.js` answers the website's chat (button in the bottom-right corner)
with Claude, using only what the site says: `api/knowledge.js`, generated from
the live pages by `blog/_knowledge.py` every time `python3 blog/_build.py` runs.

Set in Vercel → Settings → Environment Variables:
- `ANTHROPIC_API_KEY` (required, from console.anthropic.com)
- `CHAT_MODEL` (optional, default `claude-haiku-4-5-20251001`)

Limits: 20 messages per visitor per hour, last 16 messages sent, 800
characters per message, short replies. "Email this conversation" goes through
`api/contact.js` (type `chat`), arriving as "Chat: novo contacto".
Without the key the chat shows a polite fallback (book a call / email).

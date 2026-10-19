# Teyo website — teyo.surf

Static site for Teyo: handmade pumpfoil boards from the Baltic coast, Gdańsk.
Plain HTML + CSS, no framework, no build step. Hosted on GitHub Pages.

## Working rules (from the owner)

- **Every commit and every push needs the owner's explicit OK in chat.** Before asking, list the changed files and the commit message.
- **Show changes before committing.** Locally: serve with `python3 -m http.server 8123 --bind 127.0.0.1` and show http://127.0.0.1:8123/. In a cloud session: push to the `preview` branch (after OK) and give the link https://teyo.surf/preview/.
- Work on the `preview` branch. Merge `preview` into `main` (= production) only when the owner says so.
- The owner writes in Polish; reply in Polish. Site copy is in English.

## Deploy

- `.github/workflows/pages.yml` publishes `main` to https://teyo.surf/ and `preview` to https://teyo.surf/preview/ (noindex). A push to either branch rebuilds both. Takes about a minute.
- Pages source is set to **GitHub Actions**. The custom domain teyo.surf is set in repo Settings → Pages; DNS is at GoDaddy (A records to GitHub, `www` CNAME to lratajczyk.github.io). Do not touch MX/TXT/DKIM records: email (iCloud) and Kit depend on them.
- Use relative links (`./`, `styles.css`, `images/…`), never root-absolute `/…`, so pages also work under `/preview/`.
- `styles.css` and `main.js` are linked with a version (`?v=11`) on all four pages. **Bump the number on every change to either file**, otherwise browsers keep the old copy for a while.

## Brand

- Calm, short sentences. No exclamation marks, no hype.
- Palette: white background, graphite/black type, light greys. No bright colors.
- System font stack, light weights for headings, small uppercase letter-spaced labels.

## Languages

- English is the default: `index.html`, `privacy.html`. Polish: `pl/index.html`, `pl/privacy.html` (same markup, paths prefixed with `../`).
- **Every content or markup change must be made in both languages.** The owner writes Polish copy; English copy is a translation of it (or the reverse).
- EN pages redirect first-time visitors whose browser language is Polish to `pl/` (inline script in `<head>`). The EN / PL switch stores the choice in localStorage (`teyo-lang`), and a stored choice always wins.
- Pages link each other with `hreflang` alternates; keep them in sync when adding pages.

## Structure

- `index.html` — top bar (EN / PL switch), headline, intro, photo grid, about the workshop, feature carousel, waitlist (Kit form), footer.
- `main.js` — shared scripts: carousel, photo lightbox, language switch. UI strings follow `<html lang>`.
- `privacy.html` — GDPR policy for the waitlist. Controller: AHOLA Łukasz Ratajczyk, NIP 5832995668. Processor: Kit. Data: email, first name, country. Update it if data collection or tools change.
- `styles.css` — all styles. The Kit form overrides at the bottom use `!important` on purpose (Kit injects its own styles).
- Kit form: JavaScript embed `data-uid="64d6f48a3a"`. Button text and placeholders are set in Kit, not here.
- Photos: `images/photo-1..5.jpg` (grid), `images/feature-1..7.jpg` (carousel; renders from `../renders/` plus one artwork photo). A grey placeholder shows if a file is missing.
- `images/og.jpg` (1200×630) is the link preview image.

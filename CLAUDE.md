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

## Brand

- Calm, short sentences. No exclamation marks, no hype.
- Palette: white background, graphite/black type, light greys. No bright colors.
- System font stack, light weights for headings, small uppercase letter-spaced labels.

## Structure

- `index.html` — top bar, headline, intro, photo placeholders, feature carousel, waitlist (Kit form), footer.
- `privacy.html` — GDPR policy for the waitlist. Controller: AHOLA Łukasz Ratajczyk, NIP 5832995668. Processor: Kit. Data: email, first name, country. Update it if data collection or tools change.
- `styles.css` — all styles. The Kit form overrides at the bottom use `!important` on purpose (Kit injects its own styles).
- Kit form: JavaScript embed `data-uid="64d6f48a3a"`. Button text and placeholders are set in Kit, not here.
- Photos: `images/photo-1..3.jpg`, `images/feature-1..5.jpg`. A grey placeholder shows until the file exists.
- `images/og.jpg` (1200×630) is the link preview image.

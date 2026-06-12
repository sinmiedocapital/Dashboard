# Sin Miedo Capital — Marketing Website

A premium, dark, multi-page static website for Sin Miedo Capital LLC (SMC).
Built with plain HTML, CSS, and vanilla JavaScript — no frameworks, no build step.

## Pages
- `index.html` — Home (hero, problem, SMC difference, social proof, 1-on-1 callout, waitlist)
- `about.html` — About (Eli's story, mission, core values)
- `system.html` — The System (SMC Venice, NY Engine, why it works, indicator pricing)
- `work.html` — Work With Me (group coaching, 1-on-1 strategy session, who it's for)
- `community.html` — Community (Discord, founding tier, social proof)

## Shared files
- `styles.css` — all styling and the design tokens (brand colors, type scale)
- `script.js` — mobile nav, waitlist form success state, scroll reveal animations
- `candles.svg` — candlestick texture used in hero backgrounds

## Run it
It's static — just open `index.html` in a browser, or serve the folder:

```bash
cd website
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Placeholders to replace before launch
- **Calendly link:** `https://calendly.com/sinmiedocapital/strategy-session`
- **Discord invite:** `https://discord.gg/sinmiedocapital`
- **Waitlist form:** wired to [Formspree](https://formspree.io). Open
  `script.js`, find `WAITLIST_ENDPOINT` near the top, and paste your form
  URL (looks like `https://formspree.io/f/abcwxyz`). Until you do, the form
  works as a live demo — it shows the success message but stores nothing.
- **Testimonials:** placeholder copy and initials — swap for real quotes.

## Brand
| Token | Value |
| --- | --- |
| Navy base | `#0A0F1E` |
| Charcoal | `#141A2E` |
| Gold accent | `#C9A84C` |
| Off-white text | `#F5F4F0` |
| Muted gray | `#8892A4` |
| Font | Inter (Google Fonts) |

# Top Dog Grooming & Pet Care Services — website

Single-page site in plain HTML, Tailwind CSS v3 (compiled) and a small vanilla-JS file. No frameworks, no runtime CDNs, all paths relative.

```
index.html              the whole site, sections separated by comment banners
thanks.html             shown after the enquiry form is sent
404.html                page-not-found, same design
assets/css/styles.css   compiled Tailwind (committed; rebuild with npm run build)
assets/js/main.js       menu, header + scroll sun, the "day" services explorer, photo line-up + lightbox, form
assets/fonts/           self-hosted woff2 files + OFL licences
images/brand/           logo.svg, mark.svg, mark-light.svg (heart-and-paw mark redrawn as SVG)
images/work/            photos, each as name.webp (large) + name-sm.webp (~800px)
images/                 favicons, og-image.jpg (share card), site.webmanifest
src/input.css           Tailwind source: @font-face, components, keyframes
tailwind.config.js      brand colours (named by role, with where each came from) + fonts
sitemap.xml, robots.txt
_fb-pack/               the Facebook research pack (not published: underscore folder)
_shots/                 screenshots for the team (not published)
```

## Brand

| Name | Hex | Used for |
|---|---|---|
| action | `#2B7A2A` | Call / Enquire buttons, links, focus rings (logo green taken to a 700 shade) |
| highlight | `#43A637` | horizon line, paw ticks, drawn lines ("DOG" and the heart in the logo) |
| accent | `#F5A559` | the sun, step 4, one review card (orange of the dogs in the profile picture) |
| ink | `#18211B` | text, outlines (logo black, tinted green) |
| surface | `#F4F6F0` / `#FBFCF9` / `#E7EEE2` | grounds (green-tinted off-whites) |
| night | `#102018` | night sky in the services explorer and the footer |

Fonts: **Gabarito** (display, heavy geometric caps like the logo's TOP DOG), **Golos Text** (body), **Shantell Sans** (hand-written times of day and captions, after the logo's "Happy Dogs, Care Always" script). The logo was only available inside a flyer, so the heart-and-paw mark was redrawn as SVG; the wordmark is set in Gabarito.

## The idea

The page reads as one day at Top Dog: morning drop-off in the hero (the sun rising on the seam of the split), "Fresh off the table" late morning, the services explorer where you drag the sun from Morning (grooming) through Daytime (day care) and Evening (evening care) to Overnight (boarding, the sky goes dark and the house light comes on), and a night-time footer with the moon and the lit house. A small sun also travels along the header's bottom edge as you scroll and turns into a moon near the end.

## Editing

- **Text:** edit `index.html` directly.
- **Colours:** `tailwind.config.js`, then `npm install && npm run build`. A few colours used inside SVG drawings are written in `index.html` and `src/input.css`.
- **Add a groom photo:** make `images/work/groomed-13.webp` (~1400px tall portrait) and `groomed-13-sm.webp` (800px wide), then copy one `<li>` in the `lineup-list` in `index.html` and change `data-full`, `data-caption`, `src` and `alt`. The lightbox picks it up automatically.
- **Services explorer:** each time of day is a `<button class="stop">` plus an `<article class="panel">` in the SERVICES section. Text and "what's included" lists live in the panels. Positions on the arc are `STOPS` in `assets/js/main.js` (0 = sunrise, 1 = sunset).
- **Reviews / FAQ:** plain HTML in their sections.

## Going live — checklist

- [ ] Client buys their domain in their own name (roughly £10 a year for .com, £30–40 for .gg)
- [ ] Help the client create a free Cloudflare account in their name; connect this repo to Cloudflare Pages on their account (production branch `main`, no build command, output = repo root) and add their domain to the Pages project
- [ ] Swap the GitHub Pages URL for the real domain everywhere: canonical, og tags, JSON-LD, sitemap.xml, robots.txt, the form's `_next`
- [ ] Switch the form from the team's email to the client's (`topdoggrooming@suremail.gg`?) and activate FormSubmit
- [ ] Confirm phone/email; get the client to sign off the services wording, especially **evening care** (only described on their flyer) and the GURU food delivery line
- [ ] Assumptions to check: the photo captions in "Fresh off the table" describe the cut, not the dog's name or breed for certain; the cliff walk and sea photos are used for day care and evening care; opening hours and prices are not shown because the pack has none
- [ ] Left out on purpose: review counts, the 10th-anniversary post wording, the birthday post (Penny), the "share your photos" call-out, the illustrated cartoon of Laura and Stuart, the "10 Years of Happy Paws" collages (one crop used for boarding), the one negative review
- [ ] Optional: transfer the repo to the client's own GitHub if they want it

Source: built from the Facebook pack in `_fb-pack/` (not published on the live site).

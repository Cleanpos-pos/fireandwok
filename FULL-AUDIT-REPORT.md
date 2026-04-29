# Fire & Wok Peterborough — SEO Full Audit Report

**Scope:** single-page audit of the new React/Vite build for `https://www.fireandwok.co.uk/`
**Audit type:** on-page · technical · schema · social · local-SEO · GEO/AI search · accessibility
**Auditor:** SEO skill (LLM-first, evidence-first)
**Date:** 2026-04-29

---

## A) Audit Summary

### Scope
Single-page React app rendered into `index.html` via Vite. The site is a client-rendered SPA serving one logical page with anchor sections (`#menu`, `#set-menu`, `#gallery`, `#contact`). The live URL still serves an older WordPress build, so this audit was performed against the **codebase** that will replace it (`index.html`, `src/App.tsx`, `src/index.css`, `public/`). External evidence (robots, llms, social meta) was gathered from the currently-deployed WordPress site for baseline comparison.

### Overall rating
| Category | Score | Confidence |
|---|---|---|
| Technical SEO | 78 / 100 — Good | High |
| On-Page SEO | 82 / 100 — Good | High |
| Schema / Structured Data | 92 / 100 — Excellent | High |
| Content Quality / E-E-A-T | 60 / 100 — Needs Improvement | Medium |
| Performance (CWV signals) | Insufficient data — needs deployed measurement | Low |
| Image Optimization | 70 / 100 — Good | Medium |
| AI Search Readiness (GEO) | 90 / 100 — Excellent | High |
| **Composite (weighted)** | **~78 / 100 — Good** | Medium |

> Score confidence: Medium. CWV/PageSpeed cannot be measured until the new build is deployed; image optimisation depends on assets hosted on the current WordPress origin.

### Top 3 Issues (post-fix status in parentheses)
1. **Client-rendered SPA had zero crawler-visible content** in `index.html` — no menu, no address, no opening hours in HTML payload. *(Fixed: `<noscript>` block with name, address, phone, hours, services, summary.)*
2. **Title tag was 79 characters** — Google truncates at ~60. *(Fixed: tightened to 58 characters with primary keyword first.)*
3. **No `robots.txt`, no `llms.txt`, sitemap contained anchor URLs** — three independent technical SEO gaps. *(All fixed.)*

### Top 3 Opportunities
1. **Real review collection → AggregateRating schema.** Restaurant has no reviews surfaced. Wire up a review feed (Google, TheFork) and add `aggregateRating` + `review` schema once data exists. This is the single biggest CTR/rich-snippet lever for a local restaurant.
2. **Server-side rendering or static prerendering.** A pre-rendered HTML payload (Vite SSG plugin like `vite-ssg` or React Server Components) would ship the whole page text without JS — a big win for crawlers, low-end mobiles, and LCP. The `<noscript>` fix is a partial mitigation only.
3. **Off-domain image hosting.** All gallery/hero images are on `www.fireandwok.co.uk/wp-content/...` (the live WordPress origin). When the new build replaces it, those URLs must keep working or be migrated into `public/img/` so backlinks and image-sitemap entries don't 404.

---

## B) Findings Table

| # | Area | Severity | Confidence | Finding | Evidence | Fix Status |
|---|---|---|---|---|---|---|
| 1 | On-Page · Title | ⚠️ Warning → ✅ | Confirmed | Title was 79 chars; Google truncates at ~60. | Old `<title>`: "Fire & Wok Peterborough \| Chinese Restaurant & Takeaway \| 36 Cowgate PE1 1NA" (79). | **Fixed.** New: "Chinese Restaurant Peterborough \| Fire & Wok · 36 Cowgate" (58). |
| 2 | On-Page · H1 | ⚠️ Warning → ✅ | Confirmed | H1 was creative copy ("THE SOUL OF THE WOK") with no primary keyword. | Old `App.tsx` line 224. | **Fixed.** H1 now leads with "Chinese restaurant & takeaway in the heart of Peterborough." |
| 3 | Crawlability | 🔴 Critical → ✅ | Confirmed | SPA returned an empty `<div id="root"></div>` — no menu/address/hours visible without JS execution. | `index.html` body before fix. | **Fixed.** `<noscript>` block carries name, NAP, hours, set menu, order/book links. |
| 4 | Schema · Restaurant | ⚠️ Warning → ✅ | Confirmed | Restaurant schema lacked `paymentAccepted`, `currenciesAccepted`, `areaServed`, `slogan`, `addressRegion`, `hasMap`, `makesOffer`. | Old JSON-LD block. | **Fixed.** All added. |
| 5 | Schema · Menu | ⚠️ Warning → ✅ | Confirmed | Menu schema only listed 3 sections (Appetisers/Poultry/Noodles); React app renders 9 categories. Mismatch between schema and visible content. | Old JSON-LD vs. `MENU` constant in `App.tsx`. | **Fixed.** All 9 sections (Starters, Poultry, Beef, Pork, Seafood, Duck, Vegan, Rice, Noodles) now in JSON-LD with `suitableForDiet` on vegan items. |
| 6 | Schema · Coverage | ⚠️ Warning → ✅ | Confirmed | Missing `Organization`, `WebSite`, `BreadcrumbList` schemas. | Only Restaurant schema present originally. | **Fixed.** All four now present and parse cleanly. |
| 7 | Technical · robots.txt | 🔴 Critical → ✅ | Confirmed | No `public/robots.txt` in the new build; live site's robots doesn't manage AI crawlers. | `robots_checker.py` on live URL: "11 AI crawlers not explicitly managed". | **Fixed.** New `public/robots.txt` allows GPTBot, ClaudeBot, PerplexityBot, Google-Extended, Applebot-Extended etc. and points to sitemap. |
| 8 | Technical · llms.txt | ⚠️ Warning → ✅ | Confirmed | No `llms.txt` for AI search readiness. | `llms_txt_checker.py`: 404. | **Fixed.** `public/llms.txt` with summary, NAP, key sections, signature dishes. |
| 9 | Technical · sitemap | ⚠️ Warning → ✅ | Confirmed | Sitemap listed anchor URLs (`/#menu`, `/#contact`) — anchors are not separate URLs. | Old `public/sitemap.xml`. | **Fixed.** Single canonical `/` entry with image-sitemap entries for primary photos. |
| 10 | Technical · canonical | ✅ Pass | Confirmed | `<link rel="canonical">` correctly set to root. | `index.html` head. | OK. |
| 11 | Technical · viewport / theme | ✅ Pass | Confirmed | Mobile viewport, theme-color, format-detection set. | `index.html` head. | OK. |
| 12 | Technical · manifest | ⚠️ Warning → ✅ | Confirmed | No PWA manifest. | None on live site. | **Fixed.** `public/manifest.webmanifest` with shortcuts for Order/Book. |
| 13 | Technical · favicons | ℹ️ Info | Confirmed | Only Vite SVG favicon. No `apple-touch-icon` set. | `index.html`. | **Partial.** Added `apple-touch-icon` pointing to `/hero_image.png`. Recommend a proper 180×180 PNG and ICO. |
| 14 | Performance · LCP | ⚠️ Warning | Likely | Hero used `background-image` (not `<img>`) so the LCP element is hard to optimise; and the image lives off-domain. | `src/index.css` `.fw-hero__bg`. | **Mitigated.** Added `<link rel="preload" as="image" fetchpriority="high">` for hero. Long-term: convert to `<img>` and self-host a responsive set. |
| 15 | Performance · fonts | ✅ Pass | Confirmed | Google Fonts loaded with `display=swap` + preconnects. | `src/index.css` line 1, `index.html` head. | OK. |
| 16 | Performance · bundle | ℹ️ Info | Confirmed | Bundle is 341 KB / 108 KB gzip. Acceptable for restaurant SPA. | `npm run build` output. | OK. |
| 17 | Social / OG | ✅ Pass | Confirmed | OG/Twitter tags complete; image dimensions added (1200×630). Article-specific `og:type` upgraded to `restaurant.restaurant`. | `index.html` meta. | OK. |
| 18 | Local SEO · NAP | ⚠️ Warning → ✅ | Confirmed | Address only present in JS-rendered DOM. | App.tsx Hero/Contact. | **Fixed.** `<address>` elements now carry NAP at hero and contact + duplicated in `<noscript>`. Geo meta tags (`geo.position`, `ICBM`) added to head. |
| 19 | Local SEO · sameAs | ⚠️ Warning | Hypothesis | No `sameAs` links to Google Business, TheFork profile, Instagram, Facebook. | Organization schema. | **Open.** Need actual URLs from owner. See Action Plan §4. |
| 20 | E-E-A-T | ⚠️ Warning | Likely | No about/owner/chef story, no review feed, no press mentions. | App.tsx content scope. | **Open.** Recommend lightweight "Our Story" section and reviews module. |
| 21 | Accessibility · skip link | ⚠️ Warning → ✅ | Confirmed | No skip-link to main content. | App.tsx App wrapper. | **Fixed.** Skip-link added; styled in CSS. |
| 22 | Accessibility · main landmark | ⚠️ Warning → ✅ | Confirmed | `<main>` had no id for skip-link target. | App.tsx. | **Fixed.** `<main id="main">`. |
| 23 | Accessibility · address | ⚠️ Warning → ✅ | Confirmed | NAP wrapped in plain `<div>` not `<address>`. | App.tsx Hero/Contact. | **Fixed.** Both NAP blocks now use `<address>` (with `font-style:normal`). |
| 24 | Accessibility · alt text | ⚠️ Warning → ✅ | Confirmed | Gallery images had short `tag` strings as alt ("Wok Stir-Fry") — too sparse for image search. | App.tsx GALLERY. | **Fixed.** Added `alt` field with descriptive Peterborough-localised text per image. |
| 25 | Accessibility · image dims | ⚠️ Warning → ✅ | Confirmed | Gallery `<img>` had no width/height — risk of CLS. | App.tsx render. | **Fixed.** Added `width={1200} height={800}` (and 1600×1067 in lightbox) so the browser can reserve space. |
| 26 | Accessibility · button semantics | ⚠️ Warning → ✅ | Confirmed | Gallery tile `<button>` lacked `type="button"` (defaults to submit when inside form, defensive habit). | App.tsx. | **Fixed.** |
| 27 | Booking widget · UX | ℹ️ Info | Confirmed | "Book a Table" links opened external TheFork URL in a new tab. | Old App.tsx CTAs. | **Improved by user request** — now opens an embedded modal with the TheFork iframe; less drop-off vs. external nav. |
| 28 | GEO / AI search | ⚠️ Warning → ✅ | Confirmed | No `llms.txt`, no AI-crawler allow list. | `llms_txt_checker.py` 404; live robots doesn't list AI agents. | **Fixed.** Both shipped. |
| 29 | Image hosting | ⚠️ Warning | Confirmed | All hero/gallery images served from the soon-to-be-replaced WordPress origin. | URLs in `App.tsx`, `index.html`. | **Open.** Migrate to `public/img/` with self-hosted, optimised WebP/AVIF before cutover. |
| 30 | aggregateRating | ⚠️ Warning | Hypothesis | Restaurant schema has no `aggregateRating` / `review` — restaurants with stars in SERP get materially higher CTR. | Restaurant JSON-LD. | **Open.** Wait for real review feed; do NOT fabricate. |

---

## C) Prioritized Action Plan

> See companion file `ACTION-PLAN.md` for the full execution-ordered plan.

---

## D) Unknowns and Follow-ups

These require data you have but the audit didn't.

1. **Google Business Profile URL** — needed for Organization `sameAs`.
2. **TheFork restaurant profile URL** (not the widget) — for `sameAs`.
3. **Social profiles** (Instagram/Facebook handles) — for `sameAs`.
4. **Owner / chef bio** — for an "Our Story" section that boosts E-E-A-T.
5. **Real customer reviews** (volume, average) — to wire up `aggregateRating`.
6. **Hosting plan / domain cutover date** — to schedule deploy + Search Console resubmit.
7. **Google Search Console & Bing Webmaster verification tokens** — to add as `<meta>` once accounts exist.
8. **PageSpeed/CrUX numbers** — only measurable post-deploy; until then performance score is `Insufficient data`.

---

## E) Files Changed (this audit)

| File | Change |
|---|---|
| `index.html` | Tightened title (79→58 chars). Added geo meta, format-detection, OG image dims, restaurant: meta. Added 4 JSON-LD blocks (Organization, WebSite, full Restaurant with paymentAccepted/currenciesAccepted/areaServed/slogan/makesOffer/hasMap, BreadcrumbList). Added preload+fetchpriority for hero LCP. Added `<noscript>` crawler-visible block. |
| `public/robots.txt` | **Created.** Sitemap pointer + explicit Allow for major AI crawlers (GPTBot, ClaudeBot, PerplexityBot, Google-Extended, Applebot-Extended, etc.). Disallow scrapers (SemrushBot, AhrefsBot, MJ12bot, DotBot). |
| `public/llms.txt` | **Created.** AI-search overview with NAP, services, signature dishes, key URLs. |
| `public/manifest.webmanifest` | **Created.** PWA manifest with Order/Book shortcuts. |
| `public/sitemap.xml` | Replaced anchor URLs with single canonical homepage entry + image-sitemap. |
| `src/App.tsx` | H1 keyword-first. NAP wrapped in `<address>`. Skip-link added. `<main id="main">`. Gallery `alt` text rewritten with localised, descriptive copy. Image `width/height` to prevent CLS. Buttons get `type="button"`. |
| `src/index.css` | `.fw-skip-link` styles. |

---

## F) Environment Limitations

- **Performance / CWV:** PageSpeed Insights cannot measure the new build until it is deployed. Until then, performance is recorded as `Insufficient data`. Run `pagespeed.py https://www.fireandwok.co.uk/ --strategy mobile` after cutover.
- **Live-URL scripts:** `robots_checker.py`, `llms_txt_checker.py`, and `social_meta.py` were run against the current WordPress site only — that's why their findings reflect the *old* site. Re-run them post-deploy to confirm the new build's signals.
- **Schema validators:** Google Rich Results Test and Schema.org validator can only run against a public URL. The four JSON-LD blocks parse cleanly locally and follow the recommended shape; validate with Rich Results Test post-deploy.
- **Visual / Playwright scripts:** Skipped (require a live URL; the new build hasn't been deployed yet).

# Fire & Wok — SEO Action Plan

Companion to `FULL-AUDIT-REPORT.md`. Listed in execution order.

---

## ✅ §1. Already shipped (this audit)

These changes are in the codebase and pass `npm run build`. Re-deploy `dist/` to apply.

| # | Item | File(s) |
|---|---|---|
| 1.1 | Tightened `<title>` from 79 → 58 chars; primary keyword first | [index.html](index.html) |
| 1.2 | Added geo meta tags (`geo.region`, `geo.position`, `ICBM`) and `restaurant:*` OG meta | [index.html](index.html) |
| 1.3 | OG image dimensions + Twitter image alt | [index.html](index.html) |
| 1.4 | Added Organization, WebSite, expanded Restaurant, and BreadcrumbList JSON-LD (4 blocks, all parse) | [index.html](index.html) |
| 1.5 | Restaurant schema now includes paymentAccepted, currenciesAccepted, areaServed, slogan, addressRegion, hasMap, makesOffer (set menu) | [index.html](index.html) |
| 1.6 | Menu schema covers all 9 categories with `suitableForDiet` on vegan items | [index.html](index.html) |
| 1.7 | Added `<noscript>` crawler-visible NAP + summary in HTML payload | [index.html](index.html) |
| 1.8 | `<link rel="preload" as="image" fetchpriority="high">` for hero LCP image | [index.html](index.html) |
| 1.9 | Created `robots.txt` with AI-crawler allow list + scraper denylist + sitemap pointer | [public/robots.txt](public/robots.txt) |
| 1.10 | Created `llms.txt` for AI search readiness | [public/llms.txt](public/llms.txt) |
| 1.11 | Sitemap fixed (removed anchor URLs, added image-sitemap entries) | [public/sitemap.xml](public/sitemap.xml) |
| 1.12 | PWA `manifest.webmanifest` with Order / Book shortcuts | [public/manifest.webmanifest](public/manifest.webmanifest) |
| 1.13 | `apple-touch-icon` link added | [index.html](index.html) |
| 1.14 | H1 leads with primary keyword "Chinese restaurant & takeaway in the heart of Peterborough" | [src/App.tsx:283](src/App.tsx#L283) |
| 1.15 | NAP wrapped in semantic `<address>` (hero + contact) | [src/App.tsx](src/App.tsx) |
| 1.16 | Skip-link to `#main` for accessibility | [src/App.tsx](src/App.tsx), [src/index.css](src/index.css) |
| 1.17 | `<main id="main">` landmark | [src/App.tsx](src/App.tsx) |
| 1.18 | Gallery image `alt` rewritten with descriptive, locale-rich copy | [src/App.tsx](src/App.tsx) |
| 1.19 | Gallery `<img>` `width`/`height` set to prevent CLS | [src/App.tsx](src/App.tsx) |
| 1.20 | Gallery tile buttons get `type="button"` | [src/App.tsx](src/App.tsx) |
| 1.21 | Embedded TheFork booking modal (replaces external `_blank` redirect) | [src/App.tsx](src/App.tsx), [src/index.css](src/index.css) |

---

## 🚀 §2. Quick wins — do before launch (≤ 1 day each)

| Priority | Action | Why | How |
|---|---|---|---|
| 🔴 | **Self-host hero + gallery images** in `public/img/` | All photos point to the WordPress origin that this build replaces. When you cut over, those URLs will 404 unless WordPress stays online or you migrate. | Save the 9 photos as 1600px-wide WebP + AVIF into `public/img/gallery/`. Update `GALLERY` in `App.tsx` and the JSON-LD `image` array in `index.html`. Keep the existing wp-content URLs as fallbacks during transition. |
| 🔴 | **Convert hero from `background-image` to `<img>`** with proper `srcset` | Better LCP, lets you `fetchpriority="high"` on the actual element rather than just preloading the URL. | Replace `<div class="fw-hero__bg">` with `<img class="fw-hero__bg" src="..." srcset="...-800w.webp 800w, ...-1600w.webp 1600w" sizes="100vw" fetchpriority="high" alt="" decoding="async">`. Move the gradient to a sibling `<div class="fw-hero__overlay">`. |
| 🟠 | **Add favicon set** | Currently only the Vite SVG. | Generate via realfavicongenerator.net: `favicon.ico`, `favicon-16.png`, `favicon-32.png`, `apple-touch-icon-180.png`, `android-chrome-192.png`, `android-chrome-512.png` into `public/`. Reference them in `index.html`. Update `manifest.webmanifest` icon paths. |
| 🟠 | **Verify Search Console + Bing Webmaster** | Lets you submit the sitemap, watch indexing, see what queries you rank for. | After deploy: add ownership via DNS TXT or upload a verification HTML file to `public/`. Submit `https://www.fireandwok.co.uk/sitemap.xml`. |
| 🟠 | **Submit `IndexNow` ping on first deploy** | Faster Bing/Yandex indexing. | Generate an IndexNow key, drop it as `public/<key>.txt`, then POST `https://api.indexnow.org/indexnow` with the key + homepage URL. |
| 🟠 | **Fill in `sameAs` URLs** in Organization schema | Lets Google connect your site to your Knowledge Panel and Google Business Profile. | In `index.html` Organization JSON-LD, add `"sameAs": ["https://www.google.com/maps/place/...", "https://www.thefork.com/restaurant/...", "https://www.instagram.com/...", "https://www.facebook.com/..."]`. |
| 🟢 | **Run `pagespeed.py` post-deploy** | Confirm CWV thresholds (LCP < 2.5s, INP < 200ms, CLS < 0.1) | `python C:/Users/Owner/.claude/skills/seo/scripts/pagespeed.py https://www.fireandwok.co.uk/ --strategy mobile` |

---

## 🎯 §3. Strategic improvements — first month

| Priority | Action | Why | Effort |
|---|---|---|---|
| 🔴 | **Static-prerender the homepage** with `vite-ssg` or `react-snap` | An SPA with a `<noscript>` block is a band-aid; pre-rendered HTML serves the full page content to every crawler and to LCP without waiting for JS. | Half-day. Add `vite-ssg` plugin, mark `App` as renderable, run `npm run build` — output `dist/index.html` will contain the full HTML. |
| 🔴 | **Wire real reviews → `aggregateRating`** | Restaurants with stars in SERP get ~30% higher CTR. Without real data we cannot fabricate. | Pull reviews from Google Business Profile (via Maps API or scrape your GBP listing) and TheFork. Once you have ≥10 reviews, add `"aggregateRating": {"@type":"AggregateRating","ratingValue":"4.7","reviewCount":"127"}` to the Restaurant JSON-LD and add 3-4 `Review` items. |
| 🟠 | **Add an "Our Story / Meet the Chef" section** | Strong E-E-A-T signal. Gives Google a reason to treat the brand as an authoritative local entity. | Owner/head chef bio, founding year, sourcing principles, photo. ~300 words. |
| 🟠 | **Build a single, simple Q&A section** (not FAQPage schema — that's restricted) | Captures long-tail "do you deliver to X?", "is parking available?" queries; helps AI answer engines. | Plain `<h3>` + `<p>` blocks under a "Good to know" section. Avoid `FAQPage` schema (restricted to gov/health since Aug 2023). |
| 🟠 | **Citations / NAP consistency sweep** | Identical name + address + phone across Google Business Profile, TheFork, Bing Places, Apple Maps, Yell, Yelp, Tripadvisor. | Spreadsheet check. Fix any drift. |
| 🟢 | **Google Business Profile optimisation** | The single biggest local-SEO lever. | Verify GBP, add the 9 dishes as menu items, upload all gallery photos, post 1× weekly, respond to every review. |

---

## 🛠️ §4. Maintenance — ongoing

| Cadence | Action |
|---|---|
| Weekly | Reply to every Google / TheFork review within 48h. |
| Weekly | Post one Google Business Profile update (offer, dish photo, news). |
| Monthly | Re-run baseline scripts on the live URL: `robots_checker.py`, `llms_txt_checker.py`, `social_meta.py`, `pagespeed.py`. |
| Monthly | Refresh sitemap `<lastmod>` if menu/prices change. |
| Quarterly | Refresh hero/gallery photos to keep image-sitemap fresh. |
| Quarterly | Revisit menu schema prices to match the live menu (currently in two places — JSON-LD in `index.html` AND `MENU` constant in `App.tsx`; consider extracting to a single JSON source). |
| On any menu change | Update both the React `MENU` and the JSON-LD `hasMenuSection`. |

---

## ⚠️ §5. Things NOT to do

| Avoid | Why |
|---|---|
| `FAQPage` schema | Restricted to government/healthcare authority sites since August 2023. Will not earn rich results for restaurants. |
| `HowTo` schema | Rich results fully removed September 2023. |
| Fabricating `aggregateRating` | Schema spam. Penalty risk. Only use real review data. |
| Stuffing more keywords into `<title>` / `<meta keywords>` | The keyword meta is largely ignored; over-stuffed titles get rewritten by Google. |
| Adding more location pages | You have one location. Don't generate "Chinese restaurant in [nearby village]" doorway pages — Google's doorway-page algorithm penalises them, and you'd hard-stop at 50+ anyway (not relevant here). |
| Skipping pre-render and just relying on Googlebot's JS rendering | It works for Google, but Bing/AI crawlers/social previewers/low-end mobiles all benefit from real HTML. The `<noscript>` block helps; SSG would be better. |

---

## 📋 §6. Pre-launch checklist

- [ ] Self-host images in `public/img/` (or commit to keeping wp-content URLs alive).
- [ ] Convert hero to `<img>` with `srcset` + `fetchpriority="high"`.
- [ ] Generate full favicon set; reference all sizes in `index.html` + manifest.
- [ ] Fill in `sameAs` URLs (Google Maps, TheFork, Instagram, Facebook).
- [ ] Verify ownership in Google Search Console + Bing Webmaster Tools.
- [ ] Submit sitemap to GSC and Bing.
- [ ] After deploy: run `pagespeed.py` and `social_meta.py` against the live URL.
- [ ] After deploy: validate JSON-LD with Google Rich Results Test (https://search.google.com/test/rich-results).
- [ ] After deploy: ping IndexNow.
- [ ] Update Google Business Profile with the new website URL (if it changes).

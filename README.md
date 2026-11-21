# vsmgrowth.com

| Layer | Technology | Where |
|---|---|---|
| Website architecture | Astro 7 (static output, View Transitions), 20 pages | `src/pages`, `src/layouts` |
| Language | TypeScript (strict) | everywhere |
| Structure | Semantic HTML, server-rendered | `src/components/*.astro` |
| Styling | Modern CSS (grid, `color-mix`, view-transition pseudo-elements) | `src/styles/global.css` |
| 3D graphics | Three.js particle word/globe + star field, lazy-loaded on the homepage only | `src/scripts/hero3d.ts` |
| Rendering | WebGL2, falls back to a CSS sphere | `src/scripts/main.ts` |
| Shaders | GLSL point sprites: text↔globe morph, cursor repulsion, click burst, scroll scatter, twinkling stars | `src/scripts/hero3d.ts` |
| Motion | GSAP + ScrollTrigger + Flip: reveals, count-ups, parallax, filters, marquee, magnetic, cursor | `src/scripts/motion.ts`, `src/scripts/interactions.ts` |
| Content management | Sanity (schemas in `/sanity`), local fallback in `src/content/site.ts` | `src/lib/content.ts` |
| Hosting | Cloudflare Pages + Pages Functions | `wrangler.toml`, `functions/` |
| Analytics | GA4 (page views on every view-transition navigation, lead + click events) + Search Console verification + sitemap | `src/scripts/analytics.ts` |
| Lead tracking | `POST /api/lead` → Zoho CRM Leads (India DC), optional backup webhook, WhatsApp fallback | `functions/api/lead.ts`, `src/scripts/form.ts` |

## Design
Visual design from vsm-growth-2 (paper / ink / dark sections, Manrope + DM Mono + Instrument Serif italic, orange accent, VSM logo), type sizes raised for reading.

## Interactions
- Splash (homepage only, on every load/refresh; other pages open directly): VSM logo fades in, breathes, then an extreme zoom flies through it and the site appears. Skip button, `?nosplash` to bypass, CSS failsafe after 6s, off for reduced motion.
- Live-site sections: hero stat tags, Attention / Performance / Growth pillars, "Not just another agency" cards, "Brands we've grown" wall, "Certified. Verified. Trusted." badges, Founders & team, client testimonials slider, WhatsApp button. Animated aurora shading behind badges and team.
- Every service page: overview, ideal-for, 6-step timeline that lights up as you scroll, monthly deliverables, KPIs reported, tools.
- Hero: full-bleed Three.js particle field. ~9,000 points (4,200 on phones) spell "VSM" from the brand font, start spread across the hero while the splash plays, collect into "VSM" as it ends, drift, get pushed aside by the cursor, burst and re-form on click, and scatter as you scroll down (re-forming when you scroll back). A twinkling star field covers the whole hero (no boxed canvas). Scrolling scatters the particles away.
- Call: stacked Call / WhatsApp buttons (bottom right, expand on hover).
- Reviews: two rows of cards sliding in opposite directions (client quotes + case-study results), pause on hover, swipe on mobile; live Google reviews join the rows when the Places key is set.
- Custom cursor (desktop): grows on links, becomes a "View / Next / Talk / Map" disc on cards.
- Magnetic buttons, 3D-tilt project cards with cursor-following shapes, reels play on hover once files exist.
- Work filters animate with GSAP Flip. Service rows show a floating tag card that follows the cursor.
- Client marquee that speeds up and skews with scroll velocity. Count-up stats. Word-by-word heading reveals.
- Process line draws as you scroll. Pricing cards have a cursor spotlight. Header hides on scroll down; reading progress bar.
- Google reviews rotate in the quote stage (with prev/next) once the Places key is set.
- View transitions between pages. Everything respects prefers-reduced-motion.

## Pages (50)
`/` · `/work/` + 4 case studies · `/services/` + 6 service pages + 30 sub-service pages at `/services/<service>/<topic>/` (every tag links to its own page: what's included, who it's for, steps, FAQ, related) (video production is part of Social Media Marketing; old /services/video-production/ 301-redirects there) (deliverables, process, FAQ, proof, Service + FAQ schema) · `/studio/` · `/journal/` · `/contact/` (prefills from `?service=` `?plan=` `?industry=`) · privacy · terms · refunds · 404

## Run locally
    npm install
    cp .env.example .env      # fill what you have; everything is optional
    npm run dev               # http://localhost:4321
    npm run build             # astro check + static build to /dist
    npm run preview           # Cloudflare Pages locally, including /api/lead

## Deploy to Cloudflare Pages
1. Push this folder to GitHub.
2. Cloudflare dashboard > Workers & Pages > Create > Pages > connect the repo.
   Build command `npm run build`, output `dist`, Node 22.
3. Settings > Variables and secrets: add the PUBLIC_* and SANITY_* values (build) and the ZOHO_* secrets (functions). See `.env.example`.
4. Custom domains: add `vsmgrowth.com` and `www.vsmgrowth.com`. Move DNS from cPanel to Cloudflare (or add the CNAME Cloudflare shows) at Namecheap.

## Zoho CRM (lead tracking)
1. https://api-console.zoho.in > Self Client > scope `ZohoCRM.modules.leads.CREATE` > generate code.
2. Exchange the code for a refresh token (one POST to `https://accounts.zoho.in/oauth/v2/token` with `grant_type=authorization_code`).
3. Save `ZOHO_CLIENT_ID`, `ZOHO_CLIENT_SECRET`, `ZOHO_REFRESH_TOKEN` as Cloudflare secrets.
Leads arrive with Lead Source = Website, the service, the page and any UTM / gclid / fbclid in the description.
If Zoho is down or not configured, the visitor still gets a pre-written WhatsApp message, so nothing is lost.

## GA4 + Search Console
- Set `PUBLIC_GA4_ID`. In GA4 > Admin > Events, mark `generate_lead` as a key event.
  Other events: `form_start`, `call`, `email`, `whatsapp`, `cta_hero`, `cta_header`, `plan_select`, `directions`, `reviews_open`.
- Set `PUBLIC_GSC_VERIFICATION` (HTML tag method), deploy, verify, then submit `https://vsmgrowth.com/sitemap-index.xml`.

## Sanity
    cd sanity && npm install && SANITY_STUDIO_PROJECT_ID=xxxx npm run dev
Create documents (Site settings, Case study, Client logo, Service, Pricing plan, FAQ, Built by VSM), then set `SANITY_PROJECT_ID` for the site build.
Add a Sanity webhook to a Cloudflare Pages deploy hook so publishing in Sanity rebuilds the site.
Anything missing in Sanity falls back to `src/content/site.ts`.

## Real media (without Sanity)
Put files in `public/media/` with these names; missing files keep the designed poster.
- Reels (9:16 MP4, under ~4 MB): `pushpdeep-1..3.mp4`, `quivira-1..3.mp4`, `kq-1..3.mp4`, `deesha-1..3.mp4` (the first of each also plays on card hover)
- Team photo (4:5 JPG): `team.jpg`
- Logos (SVG): `logos/dough-and-pan.svg`, `janta-timbers.svg`, `taruvan.svg`, `trackonn.svg`, `rkgit.svg`, `oram.svg`, `khanna-opticians.svg`, `sight-care.svg`, `millennium-kids.svg`, `vertex.svg`, `attraqtive.svg`, `script-aura.svg`
- Social share image: `public/og-image.jpg` (1200×630)
- Logo: `public/vsm-marketing-logo.png` (210×106). Replace with an SVG for sharp rendering.

## Google reviews
Set `PUBLIC_GOOGLE_PLACE_ID` and `PUBLIC_GOOGLE_PLACES_KEY` (Places API New, key restricted to `https://vsmgrowth.com/*`). Without them the section links to the Google listing.

## Google Search Console + Google Business Profile (go-live checklist)

1. **Search Console → Add property → Domain** `vsmgrowth.com`. Copy the TXT record → Cloudflare DNS → add TXT on `@` → Verify. (Optional URL-prefix fallback: set `PUBLIC_GSC_VERIFICATION` in Cloudflare Pages env and redeploy.)
2. **Sitemaps** → submit `sitemap-index.xml` (54 URLs: home, 6 services, 30 topic pages, 4 city pages, work, legal).
3. **URL Inspection → Request indexing** for `/`, `/services/`, and the 4 city pages first.
4. **Settings → Associations** → link GA4 property (`PUBLIC_GA4_ID`).
5. Check **Page experience / Core Web Vitals** after 28 days; check **Enhancements** for Breadcrumbs, FAQ, Local business.
6. Validate schema: https://search.google.com/test/rich-results and https://validator.schema.org.

**Google Business Profile** (https://share.google/tWNXKK3oV4GFiah31)
- Website field: `https://vsmgrowth.com/` (Noida listing → `/digital-marketing-agency-noida/`).
- Name, address, phone must match the site exactly (NAP): `VSM Marketing`, Aakansha Tower, 3rd Floor, Mangal Pandey Nagar, Meerut 250001, +91 82795 74755.
- Primary category: *Internet marketing service*; secondary: *Marketing agency*, *Social media agency*, *Website designer*, *Video production service*.
- Services list = the 6 site services. Hours Mon–Sat 10–7.
- Ask every happy client for a review via the GMB link; reply to all reviews. Post weekly (reel + offer).
- Live reviews on the site: set `PUBLIC_GOOGLE_PLACE_ID` + `PUBLIC_GOOGLE_PLACES_KEY` (restrict key to vsmgrowth.com).

**SEO built in:** rich Organization/WebSite/LocalBusiness ×2 schema (geo, hours, hasMap → GMB, sameAs, knowsAbout, areaServed), sitewide BreadcrumbList, FAQ schema on services/topics/cities, Service schema, canonical + hreflang en-IN, geo meta, OG/Twitter image (1200×630), web manifest + PNG icons, sitemap with lastmod/priority, robots.txt, 4 city landing pages with unique copy.

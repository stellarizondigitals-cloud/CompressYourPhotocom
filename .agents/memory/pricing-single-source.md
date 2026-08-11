---
name: Pricing single source of truth
description: All plan prices and Stripe price ID defaults live in shared/pricing.ts — every surface and both server runtimes derive from it
---

Rule: any plan price, price-derived copy, or Stripe price ID fallback must come from `shared/pricing.ts`. Never hardcode "£1.99" etc. in components, FAQ/SEO copy, checkout descriptions, or webhook emails.

**Why:** Prices previously drifted across UI, checkout, and emails (negative-savings bug). Also note the app has TWO checkout backends that must stay in sync: the Express server (`server/routes.ts`, used by `npm run dev`/production) and the Vercel functions in `api/` — changes to checkout behavior must be mirrored in both.

**How to apply:**
- Display strings: import `DISPLAY` / tier configs from `@shared/pricing` (client alias) or `../shared/pricing` (api/).
- Geo checkout amounts are validated server-side via `isAllowedGeoAmount()` — new prices/tiers must be added to the config or checkout will reject them.
- Tier-1 monthly/lifetime charges come from Stripe price objects (`STRIPE_PRICE_ID_DEFAULTS` + env overrides); changing a tier-1 amount requires a matching Stripe price.
- Tests: `npx tsx --test shared/pricing.test.ts`.
- Geo prices are cached in localStorage for 24h (see follow-up about stale prices).

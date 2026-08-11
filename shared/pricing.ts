// Single source of truth for all plan prices.
// Change a price here and every surface (Pricing page, Premium modal,
// Home page, tool pages, FAQ copy) updates automatically.

export interface PlanPrice {
  /** Amount in the smallest currency unit (pence), used for Stripe checkout */
  amount: number;
  /** Formatted display string, e.g. "£1.99" */
  display: string;
}

function gbp(amount: number): PlanPrice {
  return { amount, display: `£${(amount / 100).toFixed(2)}` };
}

/** Tier 1 (GB/US/EU etc.) — the default prices shown on marketing pages */
export const PRICING_TIER_1 = {
  weekPass: gbp(99),
  monthly: gbp(199),
  lifetime: gbp(2499),
} as const;

/**
 * Default Stripe price IDs for the tier-1 fixed-price plans.
 * ⚠️ The Stripe price objects behind these IDs carry their own amounts.
 * If you change PRICING_TIER_1.monthly or .lifetime above, you MUST also
 * create/point to a matching Stripe price (or set the
 * STRIPE_MONTHLY_PRICE_ID / STRIPE_LIFETIME_PRICE_ID and
 * VITE_STRIPE_MONTHLY_PRICE_ID / VITE_STRIPE_LIFETIME_PRICE_ID env vars),
 * otherwise the displayed price and the charged amount will diverge.
 */
export const STRIPE_PRICE_ID_DEFAULTS = {
  monthly: 'price_1THNBOA1YPAyGFWbw3FewHiI', // £1.99/month
  lifetime: 'price_1THNNnA1YPAyGFWbJs3kmtST', // £24.99 one-time
} as const;

/** Tier 2 (mid-income regions) */
export const PRICING_TIER_2 = {
  weekPass: gbp(49),
  monthly: null,
  lifetime: gbp(999),
} as const;

/** Tier 3 (all other regions) */
export const PRICING_TIER_3 = {
  weekPass: gbp(49),
  monthly: null,
  lifetime: gbp(499),
} as const;

/** "Save £X.XX vs monthly" for tier 1, or null if lifetime isn't cheaper */
export function tier1SavingsVs12Months(): string | null {
  const saving = (PRICING_TIER_1.monthly.amount * 12 - PRICING_TIER_1.lifetime.amount) / 100;
  return saving > 0 ? `Save £${saving.toFixed(2)} vs monthly` : null;
}

// ---------------------------------------------------------------------------
// Server-side geo checkout: authoritative amounts & copy
// ---------------------------------------------------------------------------

export type GeoPlanType = 'week_pass' | 'lifetime_geo';

/**
 * The only amounts (in pence) a geo checkout may charge for each plan type.
 * Derived from the tier configs above, so a price change here automatically
 * updates server-side validation too. Servers must reject any other amount.
 */
export const GEO_PLAN_ALLOWED_AMOUNTS: Record<GeoPlanType, readonly number[]> = {
  week_pass: [
    PRICING_TIER_1.weekPass.amount,
    PRICING_TIER_2.weekPass.amount,
    PRICING_TIER_3.weekPass.amount,
  ],
  // Tier-1 lifetime uses the fixed Stripe price ID checkout, not the geo flow.
  lifetime_geo: [
    PRICING_TIER_2.lifetime.amount,
    PRICING_TIER_3.lifetime.amount,
  ],
};

export function isAllowedGeoAmount(planType: GeoPlanType, amount: number): boolean {
  return GEO_PLAN_ALLOWED_AMOUNTS[planType]?.includes(amount) ?? false;
}

/** Authoritative product copy for geo checkout sessions */
export function geoProductCopy(planType: GeoPlanType): { name: string; description: string } {
  if (planType === 'week_pass') {
    return {
      name: '7-Day Pro Trial',
      description: `One-time trial fee — then ${PRICING_TIER_1.monthly.display}/month, cancel any time`,
    };
  }
  return {
    name: 'Lifetime Pro Access',
    description: 'Lifetime access to all Pro features — pay once, use forever',
  };
}

// Common derived display strings (tier 1 / default pricing)
export const DISPLAY = {
  weekPass: PRICING_TIER_1.weekPass.display,
  monthly: PRICING_TIER_1.monthly.display,
  monthlyPerMonth: `${PRICING_TIER_1.monthly.display}/month`,
  lifetime: PRICING_TIER_1.lifetime.display,
  thenMonthly: `Then ${PRICING_TIER_1.monthly.display}/month`,
} as const;

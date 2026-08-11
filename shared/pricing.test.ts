// Run with: npx tsx --test shared/pricing.test.ts
import test from 'node:test';
import assert from 'node:assert/strict';
import {
  PRICING_TIER_1,
  PRICING_TIER_2,
  PRICING_TIER_3,
  DISPLAY,
  GEO_PLAN_ALLOWED_AMOUNTS,
  isAllowedGeoAmount,
  geoProductCopy,
  tier1SavingsVs12Months,
} from './pricing';

test('display strings are derived from tier-1 amounts', () => {
  assert.equal(DISPLAY.weekPass, `£${(PRICING_TIER_1.weekPass.amount / 100).toFixed(2)}`);
  assert.equal(DISPLAY.monthly, `£${(PRICING_TIER_1.monthly.amount / 100).toFixed(2)}`);
  assert.equal(DISPLAY.lifetime, `£${(PRICING_TIER_1.lifetime.amount / 100).toFixed(2)}`);
  assert.equal(DISPLAY.monthlyPerMonth, `${DISPLAY.monthly}/month`);
  assert.equal(DISPLAY.thenMonthly, `Then ${DISPLAY.monthly}/month`);
});

test('geo checkout only allows configured plan amounts', () => {
  // week pass: every tier's week-pass amount is allowed, nothing else
  for (const t of [PRICING_TIER_1, PRICING_TIER_2, PRICING_TIER_3]) {
    assert.ok(isAllowedGeoAmount('week_pass', t.weekPass.amount));
  }
  assert.ok(!isAllowedGeoAmount('week_pass', 1));
  assert.ok(!isAllowedGeoAmount('week_pass', PRICING_TIER_1.lifetime.amount));

  // lifetime geo: tier 2/3 lifetime amounts only (tier 1 uses fixed price ID)
  assert.ok(isAllowedGeoAmount('lifetime_geo', PRICING_TIER_2.lifetime.amount));
  assert.ok(isAllowedGeoAmount('lifetime_geo', PRICING_TIER_3.lifetime.amount));
  assert.ok(!isAllowedGeoAmount('lifetime_geo', 50));
  assert.ok(!isAllowedGeoAmount('lifetime_geo', PRICING_TIER_2.lifetime.amount + 1));
});

test('allowed amount lists stay in lockstep with tier configs', () => {
  assert.deepEqual(
    [...GEO_PLAN_ALLOWED_AMOUNTS.week_pass],
    [PRICING_TIER_1.weekPass.amount, PRICING_TIER_2.weekPass.amount, PRICING_TIER_3.weekPass.amount],
  );
  assert.deepEqual(
    [...GEO_PLAN_ALLOWED_AMOUNTS.lifetime_geo],
    [PRICING_TIER_2.lifetime.amount, PRICING_TIER_3.lifetime.amount],
  );
});

test('geo product copy derives the trial description from the monthly price', () => {
  const weekPass = geoProductCopy('week_pass');
  assert.ok(weekPass.description.includes(PRICING_TIER_1.monthly.display));
  const lifetime = geoProductCopy('lifetime_geo');
  assert.ok(lifetime.name.toLowerCase().includes('lifetime'));
});

test('savings string is computed, never negative', () => {
  const saving = (PRICING_TIER_1.monthly.amount * 12 - PRICING_TIER_1.lifetime.amount) / 100;
  const s = tier1SavingsVs12Months();
  if (saving > 0) {
    assert.equal(s, `Save £${saving.toFixed(2)} vs monthly`);
  } else {
    assert.equal(s, null);
  }
});

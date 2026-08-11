import type { VercelRequest, VercelResponse } from '@vercel/node';
import Stripe from 'stripe';
import { STRIPE_PRICE_ID_DEFAULTS, isAllowedGeoAmount, geoProductCopy, type GeoPlanType } from '../shared/pricing';

const ALLOWED_PLAN_TYPES: GeoPlanType[] = ['week_pass', 'lifetime_geo'];
const MONTHLY_PRICE_ID = process.env.STRIPE_MONTHLY_PRICE_ID || STRIPE_PRICE_ID_DEFAULTS.monthly;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { planType, amount, userId, userEmail, successUrl, cancelUrl } = req.body || {};

    if (!planType || !amount || !userId) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    if (!ALLOWED_PLAN_TYPES.includes(planType)) {
      return res.status(400).json({ error: 'Invalid plan type' });
    }

    // Amounts are validated against the shared pricing config — the client
    // cannot charge anything other than a configured plan price.
    const numAmount = parseInt(amount, 10);
    if (isNaN(numAmount) || !isAllowedGeoAmount(planType as GeoPlanType, numAmount)) {
      return res.status(400).json({ error: 'Invalid amount' });
    }

    const copy = geoProductCopy(planType as GeoPlanType);

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '');

    if (planType === 'week_pass') {
      // 7-day trial subscription: charge the week-pass fee upfront, then auto-bills monthly
      // Cast to any: Stripe v20 TS types omit add_invoice_items from SessionCreateParams
      // but the REST API fully supports it — this is a type definition gap, not a bug.
      const session = await stripe.checkout.sessions.create({
        mode: 'subscription',
        line_items: [{ price: MONTHLY_PRICE_ID, quantity: 1 }],
        subscription_data: {
          trial_period_days: 7,
          metadata: { userId, planType: 'week_pass' },
        },
        add_invoice_items: [
          {
            price_data: {
              currency: 'gbp',
              product_data: {
                name: copy.name,
                description: copy.description,
              },
              unit_amount: numAmount,
            },
          },
        ],
        customer_email: userEmail,
        metadata: { userId, planType: 'week_pass' },
        success_url: successUrl || 'https://www.compressyourphoto.com?checkout=success',
        cancel_url: cancelUrl || 'https://www.compressyourphoto.com?checkout=cancelled',
      } as any);

      return res.status(200).json({ url: session.url });
    }

    // Lifetime geo plan — one-time payment
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            currency: 'gbp',
            unit_amount: numAmount,
            product_data: {
              name: copy.name,
              description: copy.description,
            },
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: successUrl || 'https://www.compressyourphoto.com?checkout=success',
      cancel_url: cancelUrl || 'https://www.compressyourphoto.com?checkout=cancelled',
      customer_email: userEmail,
      metadata: { userId, planType, amount: numAmount.toString() },
    });

    return res.status(200).json({ url: session.url });
  } catch (error: any) {
    console.error('[CheckoutGeo] Error:', error);
    return res.status(500).json({ error: error.message });
  }
}

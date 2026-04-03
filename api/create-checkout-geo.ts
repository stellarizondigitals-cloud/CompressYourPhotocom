import type { VercelRequest, VercelResponse } from '@vercel/node';
import Stripe from 'stripe';

const ALLOWED_PLAN_TYPES = ['week_pass', 'lifetime_geo'];
const MIN_AMOUNT = 49;
const MAX_AMOUNT = 9999;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { planType, amount, productName, mode, userId, userEmail, successUrl, cancelUrl } = req.body || {};

    if (!planType || !amount || !mode || !userId) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const numAmount = parseInt(amount, 10);
    if (isNaN(numAmount) || numAmount < MIN_AMOUNT || numAmount > MAX_AMOUNT) {
      return res.status(400).json({ error: 'Invalid amount' });
    }

    if (!ALLOWED_PLAN_TYPES.includes(planType)) {
      return res.status(400).json({ error: 'Invalid plan type' });
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '');

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'gbp',
            unit_amount: numAmount,
            product_data: {
              name: productName || 'Pro Access',
              description:
                planType === 'week_pass'
                  ? '7-day full access to all Pro features'
                  : 'Lifetime access to all Pro features — pay once, use forever',
            },
            ...(mode === 'subscription' ? { recurring: { interval: 'month' } } : {}),
          },
          quantity: 1,
        },
      ],
      mode: mode as 'subscription' | 'payment',
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

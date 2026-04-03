import type { VercelRequest, VercelResponse } from '@vercel/node';
import Stripe from 'stripe';

const ALLOWED_PLAN_TYPES = ['week_pass', 'lifetime_geo'];
const MIN_AMOUNT = 49;
const MAX_AMOUNT = 9999;
const MONTHLY_PRICE_ID = process.env.STRIPE_MONTHLY_PRICE_ID || 'price_1THNBOA1YPAyGFWbw3FewHiI';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { planType, amount, productName, userId, userEmail, successUrl, cancelUrl } = req.body || {};

    if (!planType || !amount || !userId) {
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

    if (planType === 'week_pass') {
      // 7-day trial subscription: charge £0.99 upfront, then auto-bills monthly at £1.99
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
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
                name: productName || '7-Day Pro Trial',
                description: 'One-time trial fee — then £1.99/month, cancel any time',
              },
              unit_amount: numAmount,
            },
          },
        ],
        customer_email: userEmail,
        metadata: { userId, planType: 'week_pass' },
        success_url: successUrl || 'https://www.compressyourphoto.com?checkout=success',
        cancel_url: cancelUrl || 'https://www.compressyourphoto.com?checkout=cancelled',
      });

      return res.status(200).json({ url: session.url });
    }

    // Lifetime geo plan — one-time payment
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'gbp',
            unit_amount: numAmount,
            product_data: {
              name: productName || 'Lifetime Pro Access',
              description: 'Lifetime access to all Pro features — pay once, use forever',
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

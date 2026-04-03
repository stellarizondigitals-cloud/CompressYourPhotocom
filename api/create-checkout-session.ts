import type { VercelRequest, VercelResponse } from '@vercel/node';
import Stripe from 'stripe';

const MONTHLY_PRICE_ID = process.env.STRIPE_MONTHLY_PRICE_ID || 'price_1THNBOA1YPAyGFWbw3FewHiI';
const LIFETIME_PRICE_ID = process.env.STRIPE_LIFETIME_PRICE_ID || 'price_1THNNnA1YPAyGFWbJs3kmtST';
const ALLOWED_PRICE_IDS = [MONTHLY_PRICE_ID, LIFETIME_PRICE_ID];

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { priceId, mode, userId, userEmail, successUrl, cancelUrl } = req.body || {};

    if (!priceId || !mode || !userId) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    if (!ALLOWED_PRICE_IDS.includes(priceId)) {
      console.error('[Checkout] Invalid priceId attempted:', priceId);
      return res.status(400).json({ error: 'Invalid price ID' });
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '');

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      mode: mode as 'subscription' | 'payment',
      success_url: successUrl || 'https://www.compressyourphoto.com?checkout=success',
      cancel_url: cancelUrl || 'https://www.compressyourphoto.com?checkout=cancelled',
      customer_email: userEmail,
      metadata: { userId, priceId },
      ...(mode === 'subscription' && {
        subscription_data: { metadata: { userId } },
      }),
    });

    return res.status(200).json({ url: session.url });
  } catch (error: any) {
    console.error('[Checkout] Error:', error);
    return res.status(500).json({ error: error.message });
  }
}

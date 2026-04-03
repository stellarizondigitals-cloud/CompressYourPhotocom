import type { VercelRequest, VercelResponse } from '@vercel/node';
import Stripe from 'stripe';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { userEmail, returnUrl } = req.body || {};

    if (!userEmail) {
      return res.status(400).json({ error: 'Missing userEmail' });
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '');

    const customers = await stripe.customers.list({ email: userEmail, limit: 1 });
    if (!customers.data.length) {
      return res.status(404).json({ error: 'No Stripe customer found for this email' });
    }

    const session = await stripe.billingPortal.sessions.create({
      customer: customers.data[0].id,
      return_url: returnUrl || 'https://www.compressyourphoto.com/account',
    });

    return res.status(200).json({ url: session.url });
  } catch (error: any) {
    console.error('[Portal] Error:', error);
    return res.status(500).json({ error: error.message });
  }
}

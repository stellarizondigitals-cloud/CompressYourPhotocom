import type { VercelRequest, VercelResponse } from '@vercel/node';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const MONTHLY_PRICE_ID = process.env.STRIPE_MONTHLY_PRICE_ID || 'price_1THNBOA1YPAyGFWbw3FewHiI';
const LIFETIME_PRICE_ID = process.env.STRIPE_LIFETIME_PRICE_ID || 'price_1THNNnA1YPAyGFWbJs3kmtST';
const ALLOWED_PRICE_IDS = [MONTHLY_PRICE_ID, LIFETIME_PRICE_ID];

export const config = {
  api: { bodyParser: false },
};

async function getRawBody(req: VercelRequest): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    req.on('data', (chunk: Buffer) => chunks.push(chunk));
    req.on('end', () => resolve(Buffer.concat(chunks)));
    req.on('error', reject);
  });
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '');
  const supabaseAdmin = createClient(
    process.env.SUPABASE_URL || '',
    process.env.SUPABASE_SERVICE_ROLE_KEY || '',
    { auth: { autoRefreshToken: false, persistSession: false } }
  );

  const sig = req.headers['stripe-signature'] as string;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  let event: Stripe.Event;

  try {
    const rawBody = await getRawBody(req);
    if (webhookSecret && sig) {
      event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret);
    } else {
      event = JSON.parse(rawBody.toString()) as Stripe.Event;
    }
  } catch (err: any) {
    console.error('[Webhook] Signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.userId;
        const priceId = session.metadata?.priceId;
        const planType = session.metadata?.planType;

        if (!userId) {
          console.error('[Webhook] Missing userId in session metadata');
          break;
        }

        if (planType) {
          const subscriptionType = planType === 'week_pass' ? 'weekly' : 'lifetime';
          const { error } = await supabaseAdmin
            .from('profiles')
            .upsert({ id: userId, is_pro: true, subscription_type: subscriptionType }, { onConflict: 'id' });
          if (error) console.error('[Webhook] Error updating profile (geo):', error);
          else console.log(`[Webhook] User ${userId} upgraded via geo plan (${planType})`);
          break;
        }

        if (!priceId || !ALLOWED_PRICE_IDS.includes(priceId)) {
          console.error('[Webhook] Invalid or missing priceId:', priceId);
          break;
        }

        const subscriptionType = priceId === LIFETIME_PRICE_ID ? 'lifetime' : 'monthly';
        const { error } = await supabaseAdmin
          .from('profiles')
          .upsert({ id: userId, is_pro: true, subscription_type: subscriptionType }, { onConflict: 'id' });

        if (error) console.error('[Webhook] Error updating profile:', error);
        else console.log(`[Webhook] User ${userId} upgraded to Pro (${subscriptionType})`);
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        const userId = subscription.metadata?.userId;
        if (userId) {
          const { error } = await supabaseAdmin
            .from('profiles')
            .update({ is_pro: false })
            .eq('id', userId);
          if (error) console.error('[Webhook] Error downgrading profile:', error);
          else console.log(`[Webhook] User ${userId} subscription cancelled`);
        }
        break;
      }
    }

    return res.status(200).json({ received: true });
  } catch (error: any) {
    console.error('[Webhook] Processing error:', error);
    return res.status(500).json({ error: error.message });
  }
}

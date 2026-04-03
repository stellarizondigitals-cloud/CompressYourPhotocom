import type { VercelRequest, VercelResponse } from '@vercel/node';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

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

async function sendEmail(to: string, subject: string, html: string, text: string) {
  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    await resend.emails.send({
      from: 'CompressYourPhoto <hello@compressyourphoto.com>',
      to,
      subject,
      html,
      text,
      replyTo: 'contact@compressyourphoto.com',
    });
    console.log('[Webhook] Email sent to', to);
  } catch (err: any) {
    console.error('[Webhook] Email failed:', err.message);
  }
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
        const customerEmail = session.customer_email || session.customer_details?.email || '';

        if (!userId) {
          console.error('[Webhook] Missing userId in session metadata');
          break;
        }

        // Geo-priced plans (week_pass trial or lifetime_geo)
        if (planType) {
          const isWeekPass = planType === 'week_pass';
          const subscriptionType = isWeekPass ? 'weekly' : 'lifetime';
          const subscriptionId = session.subscription as string | null;

          const updateData: Record<string, unknown> = {
            id: userId,
            is_pro: true,
            subscription_type: subscriptionType,
          };

          if (subscriptionId) updateData.stripe_subscription_id = subscriptionId;
          if (session.customer) updateData.stripe_customer_id = session.customer as string;

          const { error } = await supabaseAdmin
            .from('profiles')
            .upsert(updateData, { onConflict: 'id' });

          if (error) console.error('[Webhook] Error updating profile (geo):', error);
          else console.log(`[Webhook] User ${userId} upgraded via geo plan (${planType})`);

          // Send trial started email for week_pass
          if (isWeekPass && customerEmail) {
            const trialEndDate = new Date();
            trialEndDate.setDate(trialEndDate.getDate() + 7);
            const dateStr = trialEndDate.toLocaleDateString('en-GB', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

            await sendEmail(
              customerEmail,
              'Your 7-Day Pro Trial Has Started — CompressYourPhoto',
              `<!DOCTYPE html>
<html>
<body style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;padding:24px;color:#1a1a1a;">
<img src="https://www.compressyourphoto.com/brand/logo-horizontal.svg" alt="CompressYourPhoto" style="height:40px;margin-bottom:24px;" />
<h2 style="margin:0 0 8px;">Your Pro trial is live! 🎉</h2>
<p style="color:#555;margin:0 0 20px;">Your 7-day Pro trial started today. You now have full access to every Pro feature.</p>
<div style="background:#f7f7f7;border-radius:8px;padding:16px 20px;margin-bottom:20px;">
  <p style="margin:0 0 8px;font-weight:600;">What's included in your trial:</p>
  <ul style="margin:0;padding-left:20px;color:#555;line-height:1.8;">
    <li>Process up to 50 images at once</li>
    <li>Completely ad-free experience</li>
    <li>Unlimited compressions, no session limits</li>
    <li>AI Background Remover — unlimited</li>
    <li>AI Alt Text Generator</li>
    <li>Image Upscaler (2x, 4x, 8x)</li>
    <li>Image to PDF — unlimited pages</li>
    <li>Priority processing speed</li>
  </ul>
</div>
<div style="background:#fff3cd;border-left:4px solid #ffc107;padding:12px 16px;border-radius:4px;margin-bottom:20px;">
  <p style="margin:0;font-size:14px;"><strong>Important:</strong> After your 7-day trial ends on <strong>${dateStr}</strong>, you'll be automatically charged <strong>£1.99/month</strong> unless you cancel.</p>
</div>
<p style="margin:0 0 16px;">You can cancel any time — before or after the trial ends — from your account page. No hidden fees, no penalties.</p>
<a href="https://www.compressyourphoto.com/account" style="display:inline-block;background:#2563eb;color:#fff;text-decoration:none;padding:12px 24px;border-radius:8px;font-weight:600;margin-bottom:24px;">Manage My Subscription</a>
<hr style="border:none;border-top:1px solid #eee;margin:24px 0;">
<p style="font-size:12px;color:#999;">CompressYourPhoto · Operated by Stellarizon Digitals Ltd (Co. No. 16748429)</p>
</body>
</html>`,
              `Your 7-Day Pro Trial Has Started\n\nYou now have full access to every Pro feature.\n\nAfter your 7-day trial ends on ${dateStr}, you'll be charged £1.99/month unless you cancel.\n\nCancel any time at https://www.compressyourphoto.com/account\n\n— CompressYourPhoto`
            );
          }

          break;
        }

        // Fixed-price plans (monthly / lifetime via Stripe price IDs)
        if (!priceId || !ALLOWED_PRICE_IDS.includes(priceId)) {
          console.error('[Webhook] Invalid or missing priceId:', priceId);
          break;
        }

        const subscriptionType = priceId === LIFETIME_PRICE_ID ? 'lifetime' : 'monthly';
        const updateData: Record<string, unknown> = {
          id: userId,
          is_pro: true,
          subscription_type: subscriptionType,
        };
        if (session.subscription) updateData.stripe_subscription_id = session.subscription as string;
        if (session.customer) updateData.stripe_customer_id = session.customer as string;

        const { error } = await supabaseAdmin
          .from('profiles')
          .upsert(updateData, { onConflict: 'id' });

        if (error) console.error('[Webhook] Error updating profile:', error);
        else console.log(`[Webhook] User ${userId} upgraded to Pro (${subscriptionType})`);
        break;
      }

      case 'customer.subscription.trial_will_end': {
        // Fires 3 days before trial ends
        const subscription = event.data.object as Stripe.Subscription;
        const userId = subscription.metadata?.userId;
        const planType = subscription.metadata?.planType;

        if (!userId || planType !== 'week_pass') break;

        // Get user email
        const { data: profile } = await supabaseAdmin
          .from('profiles')
          .select('id')
          .eq('id', userId)
          .single();

        if (!profile) break;

        // Get email from Stripe customer
        const customerId = subscription.customer as string;
        const customer = await stripe.customers.retrieve(customerId) as Stripe.Customer;
        const email = customer.email;
        if (!email) break;

        const trialEnd = new Date((subscription.trial_end || 0) * 1000);
        const dateStr = trialEnd.toLocaleDateString('en-GB', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

        await sendEmail(
          email,
          'Your Pro Trial Ends in 3 Days — CompressYourPhoto',
          `<!DOCTYPE html>
<html>
<body style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;padding:24px;color:#1a1a1a;">
<img src="https://www.compressyourphoto.com/brand/logo-horizontal.svg" alt="CompressYourPhoto" style="height:40px;margin-bottom:24px;" />
<h2 style="margin:0 0 8px;">Your trial ends in 3 days</h2>
<p style="color:#555;margin:0 0 20px;">Your 7-day Pro trial will end on <strong>${dateStr}</strong>. After that, you'll be charged <strong>£1.99/month</strong> to keep your Pro access going.</p>
<p style="color:#555;margin:0 0 20px;">If you'd like to cancel before being charged, you can do so any time from your account page — it takes just one click.</p>
<a href="https://www.compressyourphoto.com/account" style="display:inline-block;background:#2563eb;color:#fff;text-decoration:none;padding:12px 24px;border-radius:8px;font-weight:600;margin-bottom:24px;">Manage My Subscription</a>
<p style="font-size:13px;color:#555;">If you choose to stay on Pro, you'll be charged £1.99/month starting ${dateStr}. Cancel any time — no questions asked.</p>
<hr style="border:none;border-top:1px solid #eee;margin:24px 0;">
<p style="font-size:12px;color:#999;">CompressYourPhoto · Stellarizon Digitals Ltd (Co. No. 16748429)</p>
</body>
</html>`,
          `Your Pro trial ends in 3 days (${dateStr}).\n\nAfter that, you'll be charged £1.99/month. Cancel any time at:\nhttps://www.compressyourphoto.com/account\n\n— CompressYourPhoto`
        );

        console.log(`[Webhook] Trial ending reminder sent to customer ${customerId}`);
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        const userId = subscription.metadata?.userId;
        if (userId) {
          const { error } = await supabaseAdmin
            .from('profiles')
            .update({ is_pro: false, subscription_type: null, stripe_subscription_id: null })
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

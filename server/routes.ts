import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";
import { storage } from "./storage";

const MONTHLY_PRICE_ID = process.env.STRIPE_MONTHLY_PRICE_ID || 'price_1THNBOA1YPAyGFWbw3FewHiI';
const LIFETIME_PRICE_ID = process.env.STRIPE_LIFETIME_PRICE_ID || 'price_1THNNnA1YPAyGFWbJs3kmtST';
const ALLOWED_PRICE_IDS = [MONTHLY_PRICE_ID, LIFETIME_PRICE_ID];

console.log('[Server] Environment check:', {
  hasGeminiKey: !!process.env.GEMINI_API_KEY,
  hasStripeKey: !!process.env.STRIPE_SECRET_KEY,
  hasSupabaseUrl: !!process.env.SUPABASE_URL,
  hasSupabaseServiceKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
  hasWebhookSecret: !!process.env.STRIPE_WEBHOOK_SECRET,
  hasResendKey: !!process.env.RESEND_API_KEY,
  monthlyPriceId: MONTHLY_PRICE_ID,
  lifetimePriceId: LIFETIME_PRICE_ID,
});

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "");

const supabaseAdmin = createClient(
  process.env.SUPABASE_URL || "",
  process.env.SUPABASE_SERVICE_ROLE_KEY || ""
);

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  app.post("/api/create-checkout-session", async (req: Request, res: Response) => {
    try {
      const { priceId, mode, userId, userEmail, successUrl, cancelUrl } = req.body;

      if (!priceId || !mode || !userId) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      if (!ALLOWED_PRICE_IDS.includes(priceId)) {
        console.error("[Checkout] Invalid priceId attempted:", priceId);
        return res.status(400).json({ error: "Invalid price ID" });
      }

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
          {
            price: priceId,
            quantity: 1,
          },
        ],
        mode: mode as "subscription" | "payment",
        success_url: successUrl || `${req.headers.origin}?checkout=success`,
        cancel_url: cancelUrl || `${req.headers.origin}?checkout=cancelled`,
        customer_email: userEmail,
        metadata: {
          userId,
          priceId,
        },
        ...(mode === "subscription" && {
          subscription_data: {
            metadata: {
              userId,
            },
          },
        }),
      });

      res.json({ url: session.url });
    } catch (error: any) {
      console.error("Checkout session error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/create-checkout-geo", async (req: Request, res: Response) => {
    try {
      const { planType, amount, productName, mode, userId, userEmail, successUrl, cancelUrl } = req.body;

      if (!planType || !amount || !mode || !userId) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      const MIN_AMOUNT = 49;
      const MAX_AMOUNT = 9999;
      const numAmount = parseInt(amount, 10);
      if (isNaN(numAmount) || numAmount < MIN_AMOUNT || numAmount > MAX_AMOUNT) {
        return res.status(400).json({ error: "Invalid amount" });
      }

      const ALLOWED_PLAN_TYPES = ['week_pass', 'lifetime_geo'];
      if (!ALLOWED_PLAN_TYPES.includes(planType)) {
        return res.status(400).json({ error: "Invalid plan type" });
      }

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
          {
            price_data: {
              currency: 'gbp',
              unit_amount: numAmount,
              product_data: {
                name: productName || 'Pro Access',
                description: planType === 'week_pass'
                  ? '7-day full access to all Pro features'
                  : 'Lifetime access to all Pro features — pay once, use forever',
              },
              ...(mode === 'subscription' ? { recurring: { interval: 'month' } } : {}),
            },
            quantity: 1,
          },
        ],
        mode: mode as "subscription" | "payment",
        success_url: successUrl || `${req.headers.origin}?checkout=success`,
        cancel_url: cancelUrl || `${req.headers.origin}?checkout=cancelled`,
        customer_email: userEmail,
        metadata: {
          userId,
          planType,
          amount: numAmount.toString(),
        },
      });

      res.json({ url: session.url });
    } catch (error: any) {
      console.error("Geo checkout session error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/create-portal-session", async (req: Request, res: Response) => {
    try {
      const { userEmail, returnUrl } = req.body;
      if (!userEmail) return res.status(400).json({ error: "Missing userEmail" });

      const customers = await stripe.customers.list({ email: userEmail, limit: 1 });
      if (!customers.data.length) {
        return res.status(404).json({ error: "No Stripe customer found for this email" });
      }

      const session = await stripe.billingPortal.sessions.create({
        customer: customers.data[0].id,
        return_url: returnUrl || "https://www.compressyourphoto.com/account",
      });

      res.json({ url: session.url });
    } catch (error: any) {
      console.error("Portal session error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  app.post(
    "/api/webhook",
    async (req: Request, res: Response) => {
      const sig = req.headers["stripe-signature"] as string;
      const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

      let event: Stripe.Event;

      try {
        if (webhookSecret && sig) {
          const rawBody = (req as any).rawBody as Buffer;
          event = stripe.webhooks.constructEvent(
            rawBody,
            sig,
            webhookSecret
          );
        } else {
          event = req.body as Stripe.Event;
        }
      } catch (err: any) {
        console.error("Webhook signature verification failed:", err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
      }

      try {
        switch (event.type) {
          case "checkout.session.completed": {
            const session = event.data.object as Stripe.Checkout.Session;
            const userId = session.metadata?.userId;
            const priceId = session.metadata?.priceId;

            if (!userId) {
              console.error("[Webhook] Missing userId in session metadata");
              break;
            }

            const planType = session.metadata?.planType;

            if (planType) {
              const subscriptionType = planType === 'week_pass' ? 'weekly' : 'lifetime';
              const { error } = await supabaseAdmin
                .from("profiles")
                .upsert({ id: userId, is_pro: true, subscription_type: subscriptionType }, { onConflict: "id" });
              if (error) console.error("[Webhook] Error updating profile (geo):", error);
              else console.log(`[Webhook] User ${userId} upgraded via geo plan (${planType})`);
              break;
            }

            if (!priceId || !ALLOWED_PRICE_IDS.includes(priceId)) {
              console.error("[Webhook] Invalid or missing priceId:", priceId);
              break;
            }

            const subscriptionType = priceId === LIFETIME_PRICE_ID ? 'lifetime' : 'monthly';
            
            const { error } = await supabaseAdmin
              .from("profiles")
              .upsert({ 
                id: userId, 
                is_pro: true,
                subscription_type: subscriptionType
              }, { onConflict: "id" });

            if (error) {
              console.error("[Webhook] Error updating profile:", error);
            } else {
              console.log(`[Webhook] User ${userId} upgraded to Pro (${subscriptionType})`);
            }
            break;
          }

          case "customer.subscription.deleted": {
            const subscription = event.data.object as Stripe.Subscription;
            const userId = subscription.metadata?.userId;

            if (userId) {
              const { error } = await supabaseAdmin
                .from("profiles")
                .update({ is_pro: false })
                .eq("id", userId);

              if (error) {
                console.error("Error downgrading profile:", error);
              } else {
                console.log(`User ${userId} subscription cancelled`);
              }
            }
            break;
          }
        }

        res.json({ received: true });
      } catch (error: any) {
        console.error("Webhook processing error:", error);
        res.status(500).json({ error: error.message });
      }
    }
  );

  app.post("/api/auth/magic-link", async (req: Request, res: Response) => {
    try {
      const { email, redirectTo } = req.body;
      if (!email) {
        return res.status(400).json({ error: "Email is required" });
      }

      const supabaseUrl = process.env.SUPABASE_URL;
      const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
      const resendApiKey = process.env.RESEND_API_KEY;

      if (!supabaseUrl || !supabaseServiceKey) {
        return res.status(500).json({ error: "Auth service not configured" });
      }

      const callbackUrl = redirectTo || "https://www.compressyourphoto.com/auth/callback";

      const { data, error } = await supabaseAdmin.auth.admin.generateLink({
        type: "magiclink",
        email,
        options: { redirectTo: callbackUrl },
      });

      if (error || !data?.properties?.action_link) {
        console.error("[MagicLink] Generate error:", error?.message);
        return res.status(500).json({ error: error?.message || "Failed to generate login link" });
      }

      const magicLink = data.properties.action_link;

      if (resendApiKey) {
        const emailRes = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${resendApiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: "CompressYourPhoto <noreply@compressyourphoto.com>",
            to: email,
            subject: "Your login link for CompressYourPhoto",
            html: `
              <div style="font-family:sans-serif;max-width:520px;margin:0 auto;padding:32px 24px;background:#fff">
                <h2 style="margin:0 0 8px;font-size:22px;color:#1a1a1a">Log in to CompressYourPhoto</h2>
                <p style="color:#555;margin:0 0 24px;font-size:15px">Click the button below to sign in instantly. This link expires in 1 hour and can only be used once.</p>
                <a href="${magicLink}" style="display:inline-block;background:#7c3aed;color:#fff;text-decoration:none;padding:13px 28px;border-radius:7px;font-weight:600;font-size:15px">Sign in to CompressYourPhoto</a>
                <p style="color:#888;margin:28px 0 0;font-size:13px">If you didn't request this email, you can safely ignore it.</p>
                <hr style="border:none;border-top:1px solid #eee;margin:24px 0">
                <p style="color:#aaa;font-size:12px;margin:0">CompressYourPhoto &middot; <a href="https://www.compressyourphoto.com" style="color:#aaa">compressyourphoto.com</a></p>
              </div>`,
          }),
        });

        if (!emailRes.ok) {
          const errText = await emailRes.text();
          console.error("[MagicLink] Resend error:", emailRes.status, errText);
          return res.status(502).json({ error: "Failed to send login email. Please try again." });
        }

        console.log("[MagicLink] Sent via Resend to:", email);
        return res.json({ message: "Login link sent! Check your email." });
      } else {
        console.error("[MagicLink] RESEND_API_KEY not configured");
        return res.status(503).json({ error: "Email service not configured. Please contact support." });
      }
    } catch (err: any) {
      console.error("[MagicLink] Error:", err);
      return res.status(500).json({ error: err.message || "Failed to send login link" });
    }
  });

  app.post("/api/generate-alt-text", async (req: Request, res: Response) => {
    try {
      const { imageBase64, mimeType } = req.body;
      if (!imageBase64 || !mimeType) {
        return res.status(400).json({ error: "Missing image data" });
      }

      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(500).json({ error: "AI service not configured" });
      }

      const payload = {
        contents: [{
          parts: [
            { inline_data: { mime_type: mimeType, data: imageBase64 } },
            {
              text: `You are an SEO expert. Analyze this image and generate professional, SEO-optimized alt text for web use.

Respond ONLY with valid JSON in this exact format (no markdown, no extra text):
{
  "primary": "concise alt text under 125 chars describing what is in the image for accessibility and SEO",
  "alternative1": "keyword-rich version optimized for search engines, under 125 chars",
  "alternative2": "detailed descriptive version with more context, under 150 chars",
  "tips": [
    "specific actionable tip 1 for this image",
    "specific actionable tip 2 for this image",
    "specific actionable tip 3 for this image"
  ]
}`
            }
          ]
        }],
        generationConfig: { temperature: 0.3, maxOutputTokens: 8192 }
      };

      const geminiModels = ['gemini-2.5-flash', 'gemini-2.0-flash-lite', 'gemini-2.0-flash'];
      let response: Response | null = null;
      let lastStatus = 0;

      for (const model of geminiModels) {
        // gemini-2.5-flash is a thinking model — disable thinking to avoid token budget issues
        const modelPayload = model === 'gemini-2.5-flash'
          ? { ...payload, generationConfig: { ...payload.generationConfig, thinkingConfig: { thinkingBudget: 0 } } }
          : payload;
        response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
          { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(modelPayload) }
        );
        lastStatus = response.status;
        if (response.ok) break;
        const errText = await response.text();
        console.error(`[Gemini] ${model} error:`, response.status, errText.substring(0, 200));
        if (response.status === 400 || response.status === 403) break;
      }

      if (!response || !response.ok) {
        const msg = lastStatus === 429
          ? "AI quota temporarily reached. Please try again in a moment."
          : "AI generation failed. Please try again.";
        return res.status(502).json({ error: msg });
      }

      const data: any = await response.json();
      // gemini-2.5-flash is a thinking model — combine all non-thought text parts
      const parts: any[] = data.candidates?.[0]?.content?.parts || [];
      let text = parts.filter(p => !p.thought).map(p => p.text || '').join('\n').trim();
      if (!text) text = parts.map(p => p.text || '').join('\n').trim();
      // Strip markdown code fences (```json ... ```) if present
      text = text.replace(/^```(?:json)?\s*/i, '').replace(/\s*```\s*$/, '').trim();
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        console.error('[Gemini] No JSON in response:', text.substring(0, 300));
        return res.status(500).json({ error: "Unexpected AI response. Please try again." });
      }

      const result = JSON.parse(jsonMatch[0]);
      res.json(result);
    } catch (error: any) {
      console.error('[Alt Text] Error:', error);
      res.status(500).json({ error: error.message || "Generation failed" });
    }
  });

  return httpServer;
}

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
        generationConfig: { temperature: 0.3, maxOutputTokens: 2048 }
      };

      const geminiModels = ['gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-2.0-flash-lite'];
      let response: Response | null = null;
      let lastStatus = 0;

      for (const model of geminiModels) {
        response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
          { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) }
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

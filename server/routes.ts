import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";
import { storage } from "./storage";

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

  app.post(
    "/api/webhook",
    async (req: Request, res: Response) => {
      const sig = req.headers["stripe-signature"] as string;
      const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

      let event: Stripe.Event;

      try {
        if (webhookSecret && sig) {
          event = stripe.webhooks.constructEvent(
            req.body,
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

            if (userId) {
              const { error } = await supabaseAdmin
                .from("profiles")
                .upsert({ id: userId, is_pro: true }, { onConflict: "id" });

              if (error) {
                console.error("Error updating profile:", error);
              } else {
                console.log(`User ${userId} upgraded to Pro`);
              }
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

  return httpServer;
}

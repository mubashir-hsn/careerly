"use server";

import { db } from "@/lib/prisma";
import { checkAuth } from "@/services/authCheck";
import { stripe } from "@/lib/stripe";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { createNotification } from "./notifications";

/**
 * Get all active subscription plans.
 */
export async function getPlans() {
  return await db.subscriptionPlan.findMany({
    where: { isActive: true },
    orderBy: { price: "asc" },
  });
}

/**
 * Internal helper to get subscription with self-healing logic.
 */
async function getSafeSubscription(userId) {
  let subscription = await db.userSubscription.findUnique({
    where: { userId: userId },
    include: { plan: true },
  });

  return subscription;
}

/**
 * Get the current user's active subscription with plan details.
 */
export async function getCurrentPlan() {
  const user = await checkAuth();
  if (!user) throw new Error("Unauthorized");

  return await getSafeSubscription(user.id);
}

/**
 * Create a Stripe Checkout session for a specific subscription plan.
 */
export async function createCheckoutSession(planId) {
  const user = await checkAuth();
  if (!user) throw new Error("Unauthorized");

  // Fetch plan details from the database
  const plan = await db.subscriptionPlan.findUnique({
    where: { id: planId },
  });

  if (!plan) throw new Error("Subscription plan not found");

  const origin = (await headers()).get("origin");

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "pkr",
          product_data: {
            name: `${plan.name} - ${plan.tokensIncluded.toLocaleString()} Tokens`,
            description: `Upgrade to ${plan.name} and get ${plan.tokensIncluded.toLocaleString()} AI credits.`,
          },
          unit_amount: plan.price * 100, // PKR to Paisa
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: `${origin}/dashboard?success=true&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/pricing?canceled=true`,
    client_reference_id: user.id,
    metadata: {
      userId: user.id,
      planId: plan.id,
      tokens: plan.tokensIncluded.toString(),
    },
    customer_email: user.email,
  });

  return { url: session.url };
}

/**
 * Verify a Stripe session and update tokens (Safe fallback for no webhooks).
 */
export async function verifyStripeSession(sessionId) {
  const user = await checkAuth();
  if (!user) throw new Error("Unauthorized");

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status === "paid" && session.client_reference_id === user.id) {
       const tokens = parseInt(session.metadata.tokens);
       
       const existingSub = await db.userSubscription.findUnique({
         where: { userId: user.id }
       });

       if (existingSub.clerkSubscriptionId === sessionId) {
         return { success: true, message: "Already processed" };
       }

        const planId = session.metadata.planId;

        // Update tokens, promote to Pro, and log the payment
        await db.$transaction([
          db.userSubscription.update({
            where: { userId: user.id },
            data: {
              tokensRemaining: {
                increment: tokens,
              },
              planId: planId || undefined,
              clerkSubscriptionId: sessionId,
              status: "ACTIVE",
              startDate: new Date(),
            }
          }),
          db.payment.create({
            data: {
              userId: user.id,
              stripeSessionId: sessionId,
              amount: session.amount_total / 100,
              currency: session.currency || "pkr",
              tokens: tokens,
              planId: planId || null,
              status: "paid",
            }
          })
        ]);

        // Trigger notification for admin
        try {
          await createNotification({
            type: "PAYMENT_SUCCESS",
            title: "Payment Received",
            message: `Success! PKR ${session.amount_total / 100} received from user ${user.id} (Manual Verification).`,
            link: "/admin/revenue",
          });
        } catch (notifyError) {
          console.log("Admin notification failed:", notifyError.message);
        }

       return { success: true, tokensAdded: tokens };
    }
    return { success: false, message: "Payment not verified" };
  } catch (error) {
    console.error("Session verification error:", error.message);
    throw new Error("Could not verify payment session");
  }
}

/**
 * Cancel current subscription (Simplified).
 */
export async function cancelSubscription() {
  const user = await checkAuth();
  if (!user) throw new Error("Unauthorized");

  const freePlan = await db.subscriptionPlan.findFirst({
    where: { type: "FREE", isActive: true },
  });

  if (!freePlan) throw new Error("No Free plan found");

  const updated = await db.userSubscription.update({
    where: { userId: user.id },
    data: {
      planId: freePlan.id,
      status: "ACTIVE",
      startDate: new Date(),
      endDate: null,
    },
    include: { plan: true },
  });

  // Revalidate to ensure UI updates
  revalidatePath("/dashboard");
  revalidatePath("/billing");

  // Trigger notification for admin
  try {
    await createNotification({
      type: "PLAN_CHANGE",
      title: "Plan Downgraded",
      message: `User ${user.id} has switched back to the Free Plan.`,
      link: "/admin/users",
    });
  } catch (notifyError) {
    console.log("Admin notification failed:", notifyError.message);
  }

  return { success: true, subscription: updated };
}

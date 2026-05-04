import { stripe } from "@/lib/stripe";
import { db } from "@/lib/prisma";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(req) {
  const body = await req.text();
  const signature = (await headers()).get("Stripe-Signature");

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (error) {
    console.error("Webhook signature verification failed:", error.message);
    return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 });
  }

  const session = event.data.object;

  if (event.type === "checkout.session.completed") {
    const userId = session.client_reference_id;
    const tokens = parseInt(session.metadata.tokens);

    if (!userId || !tokens) {
      return new NextResponse("Invalid session metadata", { status: 400 });
    }

    try {
      // Find or create user subscription and add tokens
      await db.userSubscription.update({
        where: { userId },
        data: {
          tokensRemaining: {
            increment: tokens,
          },
          status: "ACTIVE",
          updatedAt: new Date(),
        },
      });

      console.log(`Successfully added ${tokens} tokens to user ${userId}`);
    } catch (dbError) {
      console.error("Error updating user subscription via webhook:", dbError.message);
      return new NextResponse("Database update failed", { status: 500 });
    }
  }

  return new NextResponse(null, { status: 200 });
}

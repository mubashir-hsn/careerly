"use server";

import { db } from "@/lib/prisma";

/**
 * Get the user's active subscription with plan details.
 * If no subscription exists, auto-assigns the Free plan.
 */
export async function getUserSubscription(userId) {
  let subscription = await db.userSubscription.findUnique({
    where: { userId },
    include: { plan: true },
  });

  // Auto-assign Free plan if no subscription exists
  if (!subscription) {
    const freePlan = await db.subscriptionPlan.findFirst({
      where: { type: "FREE", isActive: true },
    });

    if (!freePlan) {
      throw new Error("No Free plan found in database. Please run seed.");
    }

    subscription = await db.userSubscription.create({
      data: {
        userId,
        planId: freePlan.id,
        tokensUsed: 0,
        tokensRemaining: freePlan.tokensIncluded,
        status: "ACTIVE",
      },
      include: { plan: true },
    });
  }

  return subscription;
}

/**
 * Check if user has enough tokens remaining.
 * Throws an error if tokens are exhausted.
 */
export async function checkTokenBalance(userId) {
  const subscription = await getUserSubscription(userId);

  if (subscription.status !== "ACTIVE") {
    throw new Error(
      "Your subscription is not active. Please renew your plan."
    );
  }

  if (subscription.tokensRemaining <= 0) {
    throw new Error(
      "Token limit reached. Please upgrade your plan to continue using AI features."
    );
  }

  return subscription;
}

/**
 * Deduct tokens after a successful AI call and log the usage.
 * @param {string} userId
 * @param {string} feature - One of: COVER_LETTER, INTERVIEW, RESUME_ANALYSIS, INSIGHTS, CHATBOT, CONTENT_IMPROVER
 * @param {number} tokensUsed - Number of tokens to deduct
 */
export async function deductTokens(userId, feature, tokensUsed) {
  // Update subscription token counts
  const subscription = await db.userSubscription.update({
    where: { userId },
    data: {
      tokensUsed: { increment: tokensUsed },
      tokensRemaining: { decrement: tokensUsed },
    },
  });

  // Log the usage
  await db.tokenUsageLog.create({
    data: {
      userId,
      feature,
      tokensUsed,
    },
  });

  return subscription;
}

/**
 * Estimate token count from text (rough approximation: 1 token ≈ 4 characters).
 */
export async function estimateTokens(text) {
  if (!text) return 0;
  return Math.ceil(text.length / 4);
}

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
  } else if (subscription.plan) {
    const totalAllocated = subscription.tokensRemaining + subscription.tokensUsed;
    if (totalAllocated < subscription.plan.tokensIncluded) {
      subscription = await db.userSubscription.update({
        where: { id: subscription.id },
        data: {
          tokensRemaining: subscription.plan.tokensIncluded - subscription.tokensUsed,
        },
        include: { plan: true },
      });
    }
  }

  return subscription;
}

/**
 * Check if user has enough tokens remaining.
 * Throws an error if tokens are exhausted or below the required amount.
 */
export async function checkTokenBalance(userId, requiredTokens = 1) {
  const subscription = await getUserSubscription(userId);
  const requestedTokens = Math.max(1, Math.ceil(Number(requiredTokens) || 1));

  if (subscription.status !== "ACTIVE") {
    throw new Error(
      "Your subscription is not active. Please renew your plan."
    );
  }

  if (subscription.tokensRemaining < requestedTokens) {
    throw new Error(
      `Insufficient tokens. This action needs about ${requestedTokens.toLocaleString()} tokens, but you have ${Math.max(0, subscription.tokensRemaining).toLocaleString()} remaining. Please upgrade or recharge your plan.`
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
  const normalizedTokens = Math.max(1, Math.ceil(Number(tokensUsed) || 0));

  await getUserSubscription(userId);

  return await db.$transaction(async (tx) => {
    const updateResult = await tx.userSubscription.updateMany({
      where: {
        userId,
        status: "ACTIVE",
        tokensRemaining: { gte: normalizedTokens },
      },
      data: {
        tokensUsed: { increment: normalizedTokens },
        tokensRemaining: { decrement: normalizedTokens },
      },
    });

    if (updateResult.count === 0) {
      const subscription = await tx.userSubscription.findUnique({
        where: { userId },
      });

      throw new Error(
        `Insufficient tokens. This action needs ${normalizedTokens.toLocaleString()} tokens, but you have ${Math.max(0, subscription?.tokensRemaining || 0).toLocaleString()} remaining. Please upgrade or recharge your plan.`
      );
    }

    await tx.tokenUsageLog.create({
      data: {
        userId,
        feature,
        tokensUsed: normalizedTokens,
      },
    });

    return await tx.userSubscription.findUnique({
      where: { userId },
      include: { plan: true },
    });
  });
}

/**
 * Estimate token count from text (rough approximation: 1 token ≈ 4 characters).
 */
export async function estimateTokens(text) {
  if (!text) return 0;
  return Math.ceil(text.length / 4);
}

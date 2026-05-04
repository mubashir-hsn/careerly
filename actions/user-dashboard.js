"use server";

import { db } from "@/lib/prisma";
import { checkAuth } from "@/services/authCheck";
import { stripe } from "@/lib/stripe";

import { getCurrentPlan } from "@/actions/subscription";

/**
 * Get aggregated dashboard statistics for the user.
 */
export async function getDashboardStats() {
  const user = await checkAuth();
  if (!user) throw new Error("Unauthorized");

  const [
    subscription,
    coverLetters,
    interviews,
    resumeAnalyses,
    chats,
    contentImprovements,
    insights
  ] = await Promise.all([
    getCurrentPlan(),
    db.coverLetter.count({ where: { userId: user.id } }),
    db.assessment.count({ where: { userId: user.id } }),
    db.resumeAnalysis.count({ where: { userId: user.id } }),
    db.chat.count({ where: { userId: user.id } }),
    db.tokenUsageLog.count({ 
      where: { 
        userId: user.id,
        feature: "CONTENT_IMPROVER"
      } 
    }),
    db.industryInsight.count({ where: { industry: user.industry } }) // Rough count
  ]);

  return {
    subscription,
    stats: {
      coverLetters,
      interviews,
      resumeAnalyses,
      chats,
      contentImprovements,
      insights,
    },
  };
}

/**
 * Get token usage history for the activity graph.
 * Returns daily usage for the last 7 days.
 */
export async function getTokenUsageHistory() {
  const user = await checkAuth();
  if (!user) throw new Error("Unauthorized");

  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const logs = await db.tokenUsageLog.findMany({
    where: {
      userId: user.id,
      createdAt: { gte: sevenDaysAgo },
    },
    orderBy: { createdAt: "asc" },
  });

  // Group by day
  const dailyUsage = {};
  for (let i = 0; i <= 7; i++) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split("T")[0];
    dailyUsage[dateStr] = 0;
  }

  logs.forEach((log) => {
    const dateStr = log.createdAt.toISOString().split("T")[0];
    if (dailyUsage[dateStr] !== undefined) {
      dailyUsage[dateStr] += log.tokensUsed;
    }
  });

  return Object.entries(dailyUsage)
    .map(([date, tokens]) => ({ date, tokens }))
    .reverse();
}

/**
 * Get the latest 10 token usage logs.
 */
export async function getRecentActivity() {
  const user = await checkAuth();
  if (!user) throw new Error("Unauthorized");

  return await db.tokenUsageLog.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    take: 10,
  });
}

/**
 * Get detailed token usage per feature for the user.
 */
export async function getUserFeatureUsageStats() {
  const user = await checkAuth();
  if (!user) throw new Error("Unauthorized");

  const usage = await db.tokenUsageLog.groupBy({
    by: ["feature"],
    where: { userId: user.id },
    _count: { feature: true },
    _sum: { tokensUsed: true },
  });

  return usage.map((f) => ({
    feature: f.feature,
    count: f._count.feature,
    tokens: f._sum.tokensUsed || 0,
  }));
}

/**
 * Get user's payment history from Stripe.
 */
export async function getUserPaymentHistory() {
  const user = await checkAuth();
  if (!user) throw new Error("Unauthorized");

  try {
    const sessions = await stripe.checkout.sessions.list({
      customer_details: { email: user.email }, // This might not be enough, better use customer ID if stored
      limit: 10,
    });
    
    // Filter sessions for this specific user
    return sessions.data
      .filter(s => s.client_reference_id === user.id && s.payment_status === "paid")
      .map(s => ({
        id: s.id,
        amount: s.amount_total / 100,
        currency: s.currency,
        tokens: s.metadata.tokens,
        date: new Date(s.created * 1000).toISOString(),
        status: s.payment_status,
      }));
  } catch (error) {
    console.error("Error fetching payment history:", error.message);
    return [];
  }
}

/**
 * Get all token usage logs for the user (latest 50).
 */
export async function getTokenUsageLogs(limit = 50) {
  const user = await checkAuth();
  if (!user) throw new Error("Unauthorized");

  return await db.tokenUsageLog.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    take: limit,
  });
}

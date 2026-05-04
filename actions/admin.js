"use server";

import { db } from "@/lib/prisma";
import { checkAuth } from "@/services/authCheck";
import { redirect } from "next/navigation";

/**
 * Verify if the current user is an admin.
 * Throws an error or redirects if not.
 */
export async function checkAdmin() {
  const user = await checkAuth();
  if (!user) throw new Error("Unauthorized");

  const admin = await db.adminUser.findUnique({
    where: { userId: user.id },
  });

  if (!admin) {
    throw new Error("Forbidden: Admin access required");
  }

  return admin;
}

/**
 * Get aggregated platform analytics for the admin dashboard.
 */
export async function getPlatformStats() {
  await checkAdmin();

  const [totalUsers, activeSubscriptions, totalTokensUsed, totalRevenue, featureUsage] = await Promise.all([
    db.user.count(),
    db.userSubscription.count({ where: { status: "ACTIVE" } }),
    db.tokenUsageLog.aggregate({ _sum: { tokensUsed: true } }),
    db.payment.aggregate({ _sum: { amount: true }, where: { status: "paid" } }),
    db.tokenUsageLog.groupBy({
      by: ["feature"],
      _count: { feature: true },
      _sum: { tokensUsed: true },
    }),
  ]);

  return {
    totalUsers,
    activeSubscriptions,
    totalTokensUsed: totalTokensUsed._sum.tokensUsed || 0,
    totalRevenue: totalRevenue._sum.amount || 0,
    featureUsage: featureUsage.map((f) => ({
      feature: f.feature,
      count: f._count.feature,
      tokens: f._sum.tokensUsed || 0,
    })),
  };
}

/**
 * Get all users with their subscription details.
 */
export async function getAllUsers(page = 1, pageSize = 20) {
  await checkAdmin();

  const skip = (page - 1) * pageSize;

  const [users, total] = await Promise.all([
    db.user.findMany({
      include: {
        subscription: {
          include: { plan: true },
        },
      },
      orderBy: { createdAt: "desc" },
      skip,
      take: pageSize,
    }),
    db.user.count(),
  ]);

  return {
    users,
    total,
    totalPages: Math.ceil(total / pageSize),
  };
}

/**
 * Create a new subscription plan.
 */
export async function createSubscriptionPlan(data) {
  await checkAdmin();

  return await db.subscriptionPlan.create({
    data: {
      name: data.name,
      type: data.type,
      tier: data.tier,
      tokensIncluded: parseInt(data.tokensIncluded),
      price: parseInt(data.price),
      features: data.features || [],
      isActive: data.isActive !== undefined ? data.isActive : true,
    },
  });
}

/**
 * Update an existing subscription plan.
 */
export async function updateSubscriptionPlan(planId, data) {
  await checkAdmin();

  return await db.subscriptionPlan.update({
    where: { id: planId },
    data: {
      name: data.name,
      type: data.type,
      tier: data.tier,
      tokensIncluded: parseInt(data.tokensIncluded),
      price: parseInt(data.price),
      features: data.features,
      isActive: data.isActive,
    },
  });
}

/**
 * Delete a subscription plan.
 * Check if any users are currently on this plan before deletion.
 */
export async function deleteSubscriptionPlan(planId) {
  await checkAdmin();

  const activeUserCount = await db.userSubscription.count({
    where: { planId: planId },
  });

  if (activeUserCount > 0) {
    throw new Error(`Cannot delete plan: ${activeUserCount} users are currently subscribed to it. Deactivate it instead.`);
  }

  return await db.subscriptionPlan.delete({
    where: { id: planId },
  });
}

/**
 * Get all payment records for the revenue ledger.
 */
export async function getAllPayments(page = 1, pageSize = 20) {
  await checkAdmin();
  const skip = (page - 1) * pageSize;

  const [payments, total] = await Promise.all([
    db.payment.findMany({
      include: { 
        user: { select: { id: true, name: true, email: true, imageUrl: true } },
        plan: true 
      },
      orderBy: { createdAt: "desc" },
      skip,
      take: pageSize,
    }),
    db.payment.count(),
  ]);

  return {
    payments,
    total,
    totalPages: Math.ceil(total / pageSize),
  };
}

/**
 * Get detailed audit data for a specific user.
 */
export async function getUserAuditData(userId) {
  await checkAdmin();

  const [user, subscription, payments, usageLogs] = await Promise.all([
    db.user.findUnique({
      where: { id: userId }
    }),
    db.userSubscription.findUnique({
      where: { userId },
      include: { plan: true }
    }),
    db.payment.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" }
    }),
    db.tokenUsageLog.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 50
    })
  ]);

  return {
    user,
    subscription,
    payments,
    usageLogs,
  };
}

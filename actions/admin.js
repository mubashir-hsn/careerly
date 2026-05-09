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

  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
  sixMonthsAgo.setDate(1);
  sixMonthsAgo.setHours(0, 0, 0, 0);

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

  // Fetch monthly data for comparison
  const monthlyData = [];
  for (let i = 5; i >= 0; i--) {
    const start = new Date();
    start.setDate(1); // Set to 1st first to avoid overflow issues
    start.setMonth(new Date().getMonth() - i);
    start.setHours(0, 0, 0, 0);

    const end = new Date(start);
    end.setMonth(end.getMonth() + 1);

    monthlyData.push({
      name: start.toLocaleString("default", { month: "short" }),
      start,
      end,
    });
  }

  const monthlyStats = await Promise.all(
    monthlyData.map(async (m) => {
      const [users, revenue, usage] = await Promise.all([
        db.user.count({ 
          where: { createdAt: { gte: m.start, lt: m.end } } 
        }),
        db.payment.aggregate({
          _sum: { amount: true },
          where: { status: "paid", createdAt: { gte: m.start, lt: m.end } },
        }),
        db.tokenUsageLog.aggregate({
          _sum: { tokensUsed: true },
          where: { createdAt: { gte: m.start, lt: m.end } },
        }),
      ]);

      return {
        name: m.name,
        users,
        revenue: revenue._sum.amount || 0,
        usage: usage._sum.tokensUsed || 0,
      };
    })
  );

  return {
    totalUsers,
    activeSubscriptions,
    totalTokensUsed: totalTokensUsed._sum.tokensUsed || 0,
    totalRevenue: totalRevenue._sum.amount || 0,
    monthlyStats,
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

  const plan = await db.subscriptionPlan.create({
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

  // Trigger notification
  try {
    const { createNotification } = await import("./notifications");
    await createNotification({
      type: "PLAN_CREATED",
      title: "New Plan Created",
      message: `Administrator has created a new subscription plan: "${data.name}"`,
      link: "/admin/subscriptions",
    });
  } catch (err) {
    console.error("Notification failed", err);
  }

  return plan;
}

/**
 * Update an existing subscription plan.
 */
export async function updateSubscriptionPlan(planId, data) {
  await checkAdmin();

  const plan = await db.subscriptionPlan.update({
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

  // Trigger notification
  try {
    const { createNotification } = await import("./notifications");
    await createNotification({
      type: "PLAN_CHANGE",
      title: "Plan Updated",
      message: `The configuration for plan "${data.name}" has been modified.`,
      link: "/admin/subscriptions",
    });
  } catch (err) {
    console.error("Notification failed", err);
  }

  return plan;
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

  const plan = await db.subscriptionPlan.delete({
    where: { id: planId },
  });

  // Trigger notification
  try {
    const { createNotification } = await import("./notifications");
    await createNotification({
      type: "PLAN_DELETED",
      title: "Plan Removed",
      message: `A subscription plan (ID: ${planId}) has been deleted from the platform.`,
      link: "/admin/subscriptions",
    });
  } catch (err) {
    console.error("Notification failed", err);
  }

  return plan;
}

/**
 * Get all payment records for the revenue ledger.
 */
export async function exportAllPayments(searchQuery = "", startDate = null, endDate = null) {
  await checkAdmin();

  const where = {
    AND: [
      searchQuery ? {
        OR: [
          { user: { name: { contains: searchQuery, mode: "insensitive" } } },
          { user: { email: { contains: searchQuery, mode: "insensitive" } } },
          { stripeSessionId: { contains: searchQuery, mode: "insensitive" } },
        ]
      } : {},
      startDate ? { createdAt: { gte: new Date(new Date(startDate).setHours(0, 0, 0, 0)) } } : {},
      endDate ? { createdAt: { lte: new Date(new Date(endDate).setHours(23, 59, 59, 999)) } } : {},
    ].filter(Boolean)
  };

  const payments = await db.payment.findMany({
    where,
    include: { 
      user: { select: { name: true, email: true } },
      plan: true 
    },
    orderBy: { createdAt: "desc" },
  });

  return payments;
}

export async function getAllPayments(page = 1, pageSize = 20, searchQuery = "", startDate = null, endDate = null) {
  await checkAdmin();
  const skip = (page - 1) * pageSize;

  const where = {
    AND: [
      searchQuery ? {
        OR: [
          { user: { name: { contains: searchQuery, mode: "insensitive" } } },
          { user: { email: { contains: searchQuery, mode: "insensitive" } } },
          { stripeSessionId: { contains: searchQuery, mode: "insensitive" } },
        ]
      } : {},
      startDate ? { createdAt: { gte: new Date(new Date(startDate).setHours(0, 0, 0, 0)) } } : {},
      endDate ? { createdAt: { lte: new Date(new Date(endDate).setHours(23, 59, 59, 999)) } } : {},
    ].filter(Boolean)
  };

  const [payments, total] = await Promise.all([
    db.payment.findMany({
      where,
      include: { 
        user: { select: { id: true, name: true, email: true, imageUrl: true } },
        plan: true 
      },
      orderBy: { createdAt: "desc" },
      skip,
      take: pageSize,
    }),
    db.payment.count({ where }),
  ]);

  return {
    payments,
    total,
    totalPages: Math.ceil(total / pageSize),
  };
}

import { clerkClient } from "@clerk/nextjs/server";

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

  if (!user) return { user: null };

  // Fetch login history from Clerk
  let loginHistory = [];
  try {
    const client = await clerkClient();
    const sessions = await client.sessions.getSessionList({
      userId: user.clerkUserId,
    });
    
    loginHistory = sessions.data.map(session => ({
      id: session.id,
      ipAddress: session.ipAddress,
      userAgent: session.userAgent,
      lastActiveAt: session.lastActiveAt,
      status: session.status,
    }));
  } catch (error) {
    console.error("Error fetching Clerk sessions:", error.message);
  }

  return {
    user,
    subscription,
    payments,
    usageLogs,
    loginHistory,
  };
}

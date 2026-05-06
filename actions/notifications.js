"use server";

import { db } from "@/lib/prisma";
import { checkAdmin } from "./admin";

/**
 * Creates a system notification for admins.
 * This is an internal helper called by other server actions or webhooks.
 */
export async function createNotification({ type, title, message, link }) {
  try {
    return await db.notification.create({
      data: {
        type,
        title,
        message,
        link,
      },
    });
  } catch (error) {
    console.error("Error creating notification:", error);
    // Suppress error to avoid breaking the main flow of user actions
  }
}

/**
 * Fetches latest notifications for the admin console.
 */
export async function getAdminNotifications() {
  try {
    await checkAdmin();
    
    return await db.notification.findMany({
      orderBy: { createdAt: "desc" },
      take: 20,
    });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return [];
  }
}

/**
 * Marks a specific notification as read.
 */
export async function markNotificationRead(id) {
  await checkAdmin();
  
  return await db.notification.update({
    where: { id },
    data: { isRead: true },
  });
}

/**
 * Marks all notifications as read.
 */
export async function markAllNotificationsRead() {
  await checkAdmin();
  
  return await db.notification.updateMany({
    where: { isRead: false },
    data: { isRead: true },
  });
}

/**
 * Creates a test notification for debugging purposes.
 */
export async function createTestNotification() {
  await checkAdmin();
  
  return await createNotification({
    type: "PLAN_CHANGE",
    title: "System Test Notification",
    message: "This is a diagnostic alert to verify that your Notification Center is polling and displaying correctly. 🛰️✨",
    link: "/admin",
  });
}

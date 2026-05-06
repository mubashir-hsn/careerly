"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { createNotification } from "./notifications";
import { checkAdmin } from "./admin";

export async function submitFeedback(data) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
    include: { adminUser: true },
  });

  if (!user) throw new Error("User not found");

  const feedback = await db.feedback.create({
    data: {
      userId: user.id,
      subject: data.subject,
      message: data.message,
    },
  });

  // Notify Admins
  await createNotification({
    type: "NEW_FEEDBACK",
    title: "New Support Request",
    message: `${user.name || 'A professional'} submitted a new ticket: ${data.subject.slice(0, 30)}...`,
    link: "/admin/support",
  });

  revalidatePath("/support");
  return feedback;
}

export async function getUserFeedbacks() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) return [];

  return await db.feedback.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
  });
}


export async function getAdminFeedbacks() {
  await checkAdmin();

  return await db.feedback.findMany({
    include: {
      user: true,
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function updateFeedbackStatus(id, status) {
  await checkAdmin();

  const updated = await db.feedback.update({
    where: { id },
    data: { status },
  });

  revalidatePath("/admin/support");
  return updated;
}

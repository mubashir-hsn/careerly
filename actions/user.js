"use server"

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server"
import { generateAIInsight } from "./dashboard.js";

export const updateUser = async (data) => {
  const { userId } = await auth();

  if (!userId) throw new Error('Unauthorized');

  const user = await db.user.findUnique({
    where: {
      clerkUserId: userId
    }
  });

  if (!user) throw new Error('User not found');

  try {
    const result = await db.$transaction(
      async (tx) => {
        // find if industry already exist
        let industryInsight = await tx.industryInsight.findUnique({
          where: {
            industry: data.industry
          }
        });

        // generate industry insights with AI 
        if (!industryInsight) {
          const insights = await generateAIInsight(data.industry);

          industryInsight = await db.industryInsight.create({
            data: {
              industry: data.industry,
              ...insights,
              lastUpdated: new Date(Date.now),
              nextUpdate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            },
          });
        }

        // update user
        const updatedUser = await tx.user.update({
          where: {
            id: user.id
          },
          data: {
            industry: data.industry,
            experience: data.experience,
            bio: data.bio,
            skills: data.skills
          }

        })

        return { updatedUser, industryInsight };

      },
      {
        timeout: 10000, // default 5000

      })

    return { success: true, ...result };
  } catch (error) {
    console.log("Error updating user and industry", error.message);
    throw new Error('Failed to update profile.' + error.message)
  }

}

export async function userOnboardingStatus() {
  try {
    const { userId } = await auth();
    if (!userId) return { isOnboarded: false };

    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
      select: { industry: true }
    });

    if (!user) return { isOnboarded: false };

    //   console.log("RAW INDUSTRY VALUE:", user.industry);
    //   console.log("TYPE:", typeof user.industry);

    const isOnboarded =
      typeof user.industry === "string" &&
      user.industry.trim().length > 0;

    return { isOnboarded };

  } catch (error) {
    console.log("Error checking onboarding:", error.message);
    return { isOnboarded: false };
  }
}

export async function updateIndustryInsights() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
    include: {
      industryInsight: true,
    },
  });

  if (!user) throw new Error("User not found");
  if (!user.industry) throw new Error("User has no industry defined");

  // Generate new insights based on the user's industry
  const insights = await generateAIInsight(user.industry);

  const updatedInsight = await db.industryInsight.update({
    where: {
      id: user.industryInsight.id,
    },
    data: {
      ...insights,
      lastUpdated: new Date(),
      nextUpdate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
  });

  return updatedInsight;
}
"use server"

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server"
import { generateAIInsight } from "./dashboard.js";

export async function userProfile(){
  const { userId } = await auth();

  if (!userId) throw new Error('Unauthorized');

  const user = await db.user.findUnique({
    where: {
      clerkUserId: userId
    }
  });

  if (!user) throw new Error('User not found');
    
  return user;
  
}

export const updateUser = async (data) => {
  const { userId } = await auth();
  if (!userId) throw new Error('Unauthorized');

  const user = await db.user.findUnique({
    where: { clerkUserId: userId }
  });
  if (!user) throw new Error('User not found');

  try {
    
    const updatedUser = await db.$transaction(async (tx) => {
      return await tx.user.update({
        where: { id: user.id },
        data: {
          industry: data.industry,
          experience: data.experience,
          bio: data.bio,
          skills: data.skills
        }
      });
    });

    (async () => {
      try {
        // check if industryInsight exists
        let industryInsight = await db.industryInsight.findUnique({
          where: { industry: data.industry }
        });

        if (!industryInsight) {
          const insights = await generateAIInsight(data.industry);

          await db.industryInsight.create({
            data: {
              industry: data.industry,
              ...insights,
              lastUpdated: new Date(),
              nextUpdate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
            }
          });
        }
      } catch (aiError) {
        console.log("AI / industry insight failed:", aiError.message);
      }
    })();

    return { success: true, updatedUser };

  } catch (error) {
    console.log("Error updating user", error.message);
    throw new Error('Failed to update profile. ' + error.message);
  }
};


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
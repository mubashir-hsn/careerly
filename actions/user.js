"use server"

import { db } from "@/lib/prisma";
import { generateAIInsight, generateAIInsightWithTokens } from "./dashboard.js";
import { checkAuth } from "@/services/authCheck.js";

export async function userProfile() {

  try {
    const user = await checkAuth();
    if (!user) return null
    return user;
  } catch (error) {
    return null;
  }
}

export const updateUser = async (data) => {
  const user = await checkAuth();
  if (!user) throw new Error("Unauthorized");

  try {
    // Ensure industry exists
    let industryInsight = await db.industryInsight.findUnique({
      where: { industry: data.industry },
    });

    if (!industryInsight) {
      // Create a placeholder industryInsight immediately so the user can complete onboarding instantly
      industryInsight = await db.industryInsight.create({
        data: {
          industry: data.industry,
          growthScore: 0,
          industryTrends: [],
          learningPaths: [],
          skillGap: { matched: [], missing: [], matchPercentage: 0 },
          salaryRanges: [],
          topSkills: [],
          marketOutlook: { summary: "Generating insights in background...", demandLevel: "Medium", automationRisk: "Medium" },
          nextUpdate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        },
      });

      // Generate insights in the background
      generateAIInsight(data)
        .then(async (insights) => {
          await db.industryInsight.update({
            where: { industry: data.industry },
            data: {
              ...insights,
              lastUpdated: new Date(),
            },
          });
        })
        .catch((err) => {
          console.error("Background insight generation failed:", err.message);
        });
    }

    // Now update user safely
    const updatedUser = await db.user.update({
      where: { id: user.id },
      data: {
        industry: data.industry,
        experience: data.experience,
        bio: data.bio,
        skills: data.skills,
      },
    });

    return { success: true, updatedUser };
  } catch (error) {
    console.log("Error updating user:", error.message);
    throw new Error(error.message || "Failed to update profile");
  }
};

export async function userOnboardingStatus() {
  try {
    const user = await checkAuth();

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
  const user = await checkAuth();
  if (!user) throw new Error("Unauthorized");

  if (!user.industry) throw new Error("User has no industry defined");

  // Generate new insights with token balance checking and tracking
  const insights = await generateAIInsightWithTokens(user, user.id);

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
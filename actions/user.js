"use server"

import { db } from "@/lib/prisma";
import { generateAIInsight } from "./dashboard.js";
import { checkAuth } from "@/services/authCheck.js";
import { NextResponse } from "next/server.js";

export async function userProfile(){

  try {
    const user = await checkAuth(); 
    if(!user) return null
    return user; 
  } catch (error) {
    return null;
  }
}

export const updateUser = async (data) => {
  const user = await checkAuth();

  try {
    // Ensure industry exists
    let industryInsight = await db.industryInsight.findUnique({
      where: { industry: data.industry },
    });

    if (!industryInsight) {
      const insights = await generateAIInsight(data);
      industryInsight = await db.industryInsight.create({
        data: {
          industry: data.industry,
          ...insights,
          lastUpdated: new Date(),
          nextUpdate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        },
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
    return NextResponse.json(
      {
        success: false,
        message: "Failed to update profile"
      },
      { status: 500 }
    )
    
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
  
  if (!user.industry) throw new Error("User has no industry defined");

  // Generate new insights based on the user's industry
  const insights = await generateAIInsight(user, process.env.GEMINI_MODEL_C);

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
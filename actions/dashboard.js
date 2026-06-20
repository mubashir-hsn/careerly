import { db } from "@/lib/prisma.js";
import { inngest } from "@/lib/inngest/client";
import { checkAuth } from "@/services/authCheck";
import { generateAIResponse } from "@/services/geminiService";
import { checkTokenBalance, deductTokens, estimateTokens } from "@/services/subscriptionService";


const modelName = process.env.GEMINI_MODEL_C;

// Utility: Generate raw AI insights
export async function generateAIInsight(data) {

  const prompt = `Analyze the ${data.industry} industry for this user:
Skills: ${data.skills}, Exp: ${data.experience}, Bio: ${data.bio}

Output ONLY valid JSON with real-time Pakistan market data:
{
  "salaryRanges": [{ "role": "", "min": 0, "max": 0, "median": 0, "location": "Pakistan" }],
  "marketOutlook": { "summary": "", "demandLevel": "Low|Medium|High", "automationRisk": "Low|Medium|High" },
  "industryTrends": [{ "trend": "", "impact": "Low|Medium|High" }],
  "topSkills": [{ "skill": "", "demandScore": 0 }],
  "skillGap": { "matched": [""], "missing": [""], "matchPercentage": 0 },
  "learningPaths": [{ 
    "path": "", "durationMonths": 0, "outcome": "",
    "courses": [{ "title": "", "platform": "", "link": "" }],
    "books": [{ "title": "", "author": "" }]
  }],
  "growthScore": 0
}

Rules: 5+ trends/skills, 5 common roles (PKR), real free course links if possible. 0-100 scores.`;

  const result = await generateAIResponse(prompt,modelName);

  const cleanedText = result.replace(/```(?:json)?\n?/g, "").trim();
  return JSON.parse(cleanedText);
}

// Wrapper that adds token tracking to insight generation
export async function generateAIInsightWithTokens(data, userId) {
  await checkTokenBalance(userId, await estimateTokens(JSON.stringify(data)));

  const insights = await generateAIInsight(data);

  // Estimate tokens from the data (rough estimate based on output size)
  const tokensUsed = await estimateTokens(JSON.stringify(insights));
  await deductTokens(userId, "INSIGHTS", tokensUsed);

  return insights;
}

// Inngest function: Runs when triggered
export const generateAIInsightFn = inngest.createFunction(
  { id: "generate-ai-insight" },
  { event: "ai/insight.requested" }, // event name
  async ({ event, step }) => {
    const industry = event.data.industry;
    const insights = await generateAIInsight(industry);

    return {
      industry,
      insights,
    };
  }
);

// Regular server action (for Clerk + Prisma flow)
export async function getIndustryInsight() {
  const user = await checkAuth();
  if (!user) throw new Error("Unauthorized");

  if (!user.industryInsight) {
    const insights = await generateAIInsightWithTokens(user, user.id);

    const industryInsight = await db.industryInsight.create({
      data: {
        industry: user.industry,
        ...insights,
        nextUpdate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days later
      },
    });

    return industryInsight;
  }

  return user.industryInsight;
}


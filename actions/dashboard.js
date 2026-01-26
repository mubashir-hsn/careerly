import { db } from "@/lib/prisma.js";
import { inngest } from "@/lib/inngest/client";
import { checkAuth } from "@/services/authCheck";
import { generateAIResponse } from "@/services/geminiService";


// Utility: Generate raw AI insights
export async function generateAIInsight(data) {

  const prompt = `
You are a market analyst AI that gives realistic and practical industry insights.

Analyze the current state of the ${data.industry} industry and user's information and return data in ONLY the following JSON format.

Here is user information:
User Industry: ${data.industry},
User Skills: ${data.skills},
User Experience: ${data.experience},
User Bio: ${data.bio}

Do not add explanations, notes, or extra text.

{
  "salaryRanges": [
    { "role": "string", "min": number, "max": number, "median": number, "location": "string" }
  ],
  "marketOutlook": {
    "summary": "string",
    "demandLevel": "Low" | "Medium" | "High",
    "automationRisk": "Low" | "Medium" | "High"
  },
  "industryTrends": [
    {
      "trend": "string",
      "impact": "Low" | "Medium" | "High"
    }
  ],
  "topSkills": [
    {
      "skill": "string",
      "demandScore": number
    }
  ],
  "skillGap": {
    "matched": ["string"],
    "missing": ["string"],
    "matchPercentage": number
  },
  "learningPaths": [
    {
      "path": "string",
      "durationMonths": number,
      "outcome": "string",
      "courses": [
        {
          "title": "string",
          "platform": "string",
          "link": "string"
        }
      ],
      "books": [
        {
          "title": "string",
          "author": "string"
        }
      ]
    }
  ],
  "growthScore": number
}

IMPORTANT RULES:
Return ONLY valid JSON and Real Time Data.
Do not include markdown or extra text.
Base insights on the Pakistani job market where possible.
Include at least 5 industry trends and 5 top skills..
Demand score and Growth score should be between 0 and 100.
If available , Provide free correct course links in the courses section.
Include at least 5 common roles for salary ranges in Pakistani rupees (Rs.).
`;


  const result = await generateAIResponse(prompt);

  const cleanedText = result.replace(/```(?:json)?\n?/g, "").trim();
  return JSON.parse(cleanedText);
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

  if (!user.industryInsight) {
    const insights = await generateAIInsight(user.industry);

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

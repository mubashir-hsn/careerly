"use server";

import { db } from "@/lib/prisma";
import { checkAuth } from "@/services/authCheck";
import { generateAIResponse } from "@/services/geminiService";

const modelName = process.env.GEMINI_MODEL_B;

export async function generateCoverLetter(data) {
  const user = await checkAuth();

  const prompt = `
  You are a professional career writer. You write honest and role specific cover letters.
  Avoid generic statements. Focus on value and relevance.
    Write a professional cover letter for a ${data.jobTitle} position at ${
    data.companyName
  }.
    
    About the candidate:
    - Industry: ${user.industry}
    - Years of Experience: ${user.experience}
    - Skills: ${user.skills?.join(", ")}
    - Professional Background: ${user.bio}
    
    Job Description:
    ${data.jobDescription}
    
    Requirements:
    1. Use a professional, enthusiastic tone
    2. Highlight relevant skills and experience
    3. Show understanding of the company's needs
    4. Keep it concise (max 400 words)
    5. Use proper business letter formatting in markdown
    6. Include specific examples of achievements
    7. Relate candidate's background to job requirements
  `;

  try {
    const result = await generateAIResponse(prompt,modelName)
    const content = result.trim();

    const coverLetter = await db.coverLetter.create({
      data: {
        content,
        jobDescription: data.jobDescription,
        companyName: data.companyName,
        jobTitle: data.jobTitle,
        status: "completed",
        userId: user.id,
      },
    });

    return coverLetter;
  } catch (error) {
    console.error("Error generating cover letter:", error.message);
    throw new Error("Failed to generate cover letter");
  }
}

export async function getCoverLetters() {
  const user = await checkAuth();

  return await db.coverLetter.findMany({
    where: {
      userId: user.id,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function getCoverLetter(id) {
  const user = await checkAuth();

  return await db.coverLetter.findUnique({
    where: {
      id,
      userId: user.id,
    },
  });
}

export async function deleteCoverLetter(id) {
  const user = await checkAuth();

  return await db.coverLetter.delete({
    where: {
      id,
      userId: user.id,
    },
  });
}

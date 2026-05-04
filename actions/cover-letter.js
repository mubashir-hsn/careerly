"use server";
import { db } from "@/lib/prisma";
import { checkAuth } from "@/services/authCheck";
import { generateAIResponse } from "@/services/geminiService";
import { checkTokenBalance, deductTokens, estimateTokens } from "@/services/subscriptionService";
import { NextResponse } from "next/server";

const modelName = process.env.GEMINI_MODEL_A;

export async function generateCoverLetter(data) {
  const user = await checkAuth();
  if (!user) throw new Error("Unauthorized");
 
  const cleanJD = data.jobDescription?.toString().replace(/\s+/g, " ").trim().slice(0, 2000);
  const cleanBio = user.bio?.toString().replace(/\s+/g, " ").trim().slice(0, 1000);

  const prompt = `Write only 2-3 body paragraphs for a cover letter for the role of ${data.jobTitle} at ${data.companyName}.
No headers, addresses, sign-offs, or "Dear Hiring Manager". 

Context:
- Industry: ${user.industry} (${user.experience} yrs exp)
- Skills: ${user.skills?.join(", ")}
- Bio: ${cleanBio}
- JD: ${cleanJD}

Rules:
1. Para 1: Connect exp to ${data.companyName} needs.
2. Para 2: Show value using skills: ${user.skills?.slice(0, 3).join(", ")}.
3. Para 3: Professional closing.
4. No clichés or markdown. Plain text only.`;

  try {
    // Check token balance before AI call
    await checkTokenBalance(user.id);

    const result = await generateAIResponse(prompt, modelName)
    const content = result.trim();

    // Deduct tokens after successful AI call
    const tokensUsed = await estimateTokens(prompt + content);
    await deductTokens(user.id, "COVER_LETTER", tokensUsed);

    const coverLetter = await db.coverLetter.create({
      data: {
        content,
        name: data.name,
        email: data.email,
        contact: data?.contact || '',
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
    return NextResponse.json(
      {
        success: false,
        message: "Failed to generate cover letter"
      },{ status: 502 })
  }
}

export async function getCoverLetters() {
  const user = await checkAuth();
  if (!user) throw new Error("Unauthorized");

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
  if (!user) throw new Error("Unauthorized");

  return await db.coverLetter.findUnique({
    where: {
      id,
      userId: user.id,
    },
  });
}

export async function deleteCoverLetter(id) {
  const user = await checkAuth();
  if (!user) throw new Error("Unauthorized");

  return await db.coverLetter.delete({
    where: {
      id,
      userId: user.id,
    },
  });
}

export async function saveCoverLetter(coverLetter) {
  try {

    const user = await checkAuth();
  if (!user) throw new Error("Unauthorized");

    const updateCoverLetter = await db.coverLetter.update({
      where: {
        id: coverLetter.id,
        userId: user.id,
      },
      data: {
        name: coverLetter.name,
        email: coverLetter.email,
        contact: coverLetter.contact,
        companyName: coverLetter.companyName,
        jobTitle: coverLetter.jobTitle,
        jobDescription: coverLetter.jobDescription ?? null,
        content: coverLetter.content,
        status: coverLetter.status,
      },
    })

    if (!updateCoverLetter) {
      throw new Error('Failed to save cover letter')
    }

    return {
      data: updateCoverLetter
    }

  } catch (error) {
    console.log('Error while saving cover letter', error)
    throw new Error('Failed to save cover letter.')
  }
}
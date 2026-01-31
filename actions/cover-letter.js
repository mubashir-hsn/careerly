"use server";

import { db } from "@/lib/prisma";
import { checkAuth } from "@/services/authCheck";
import { generateAIResponse } from "@/services/geminiService";

const modelName = process.env.GEMINI_MODEL_A;

export async function generateCoverLetter(data) {
  const user = await checkAuth();

  const prompt = `
  You are an expert career consultant. Your task is to write ONLY the core body paragraphs for a professional cover letter. 
  
  IMPORTANT: Do NOT include any headers, addresses, dates, subject lines, contact information (email/phone), or sign-offs (like "Sincerely"). 
  Start directly after "Dear Hiring Manager," and end immediately after the final paragraph.Donot write "Dear Hiring Manager,". Only write coverletter body. 

  Context for the Letter:
  - Role: ${data.jobTitle}
  - Company: ${data.companyName}
  - Candidate Industry: ${user.industry}
  - Years of Experience: ${user.experience}
  - Key Skills: ${user.skills?.join(", ")}
  - Professional Background: ${user.bio}
  - Job Description: ${data.jobDescription}

  Writing Rules:
  1. Structure: Exactly 2 to 3 professional paragraphs.
  3. Content: 
     - Para 1: Hook the reader by connecting ${user.experience} years of experience in ${user.industry} to the specific needs of ${data.companyName}.
     - Para 2: Demonstrate value by explaining how skills like ${user.skills?.slice(0, 3).join(", ")} will solve challenges mentioned in the Job Description.
     - Para 3: Professional closing statement about contributing to the team's success.
  4. Avoid Clichés: Do not use "I am the perfect candidate." Instead, use "My track record in [X] aligns with your goal of [Y]."
  5. Formatting Rules:
      - Use plain text only.
      - Do not use hyphens or dashes.No Markdown bolding (**), no headers (#).
      - Use spaces instead of hyphens for compound words.
  Output ONLY the body text after from "Dear Hiring Manager,".
`;

  try {
    const result = await generateAIResponse(prompt, modelName)
    console.log('Trim result',result)
    const content = result.trim();

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

export async function saveCoverLetter(coverLetter) {
  try {

    const user = await checkAuth();

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
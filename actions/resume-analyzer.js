"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from 'fs';
import { createRequire } from "module";
import path from "path";


const require = createRequire(import.meta.url);
const pdfParse = require("pdf-parse-new");
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });


export async function generateResumeFeedback(formData) {

  const { userId } = await auth();

  if (!userId) {
    throw new Error('Unauthorized access');
  }

  const user = await db.user.findUnique({
    where: {
      clerkUserId: userId
    }
  })

  if (!user) {
    throw new Error("User not found")
  }

  // FormData values
  const companyName = formData.get("companyName");
  const jobTitle = formData.get("jobTitle");
  const jobDescription = formData.get("jobDescription");
  const resumeFile = formData.get("resumeFile");

  if (!resumeFile || !jobTitle || !jobDescription) {
    throw new Error("Missing required data");
  }

  if (resumeFile.type !== 'application/pdf') {
    throw new Error("only PDF Allowed");
  }

  if (resumeFile.size > 2 * 1024 * 1024) {
    throw new Error("File too long (Max 2MB)");
  }

  // Convert PDF to buffer
  const buffer = Buffer.from(await resumeFile.arrayBuffer());

  // Save file
  const uploadDir = path.join(process.cwd(), "/public/uploads");
  if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

  const fileName = `resume_${user.id}_${Date.now()}.pdf`;
  const filePath = path.join(uploadDir, fileName);

  fs.writeFileSync(filePath, buffer);

  // public URL
  const resumeUrl = `/uploads/${fileName}`;

  // Parse PDF text
  const pdfData = await pdfParse(buffer);
  const resumeText = (pdfData.text || "").trim().slice(0, 6000);

  const prompt = `
    You are an expert in ATS (Applicant Tracking System) and resume analysis.
    Please analyze and rate this resume and suggest how to improve it.
    The rating can be low if the resume is bad.
    Be thorough and detailed. Don't be afraid to point out any mistakes or areas for improvement.
    If there is a lot to improve, don't hesitate to give low scores. This is to help the user to improve their resume.
    If available, use the job description for the job user is applying to to give more detailed feedback.
    If provided, take the job description into consideration.
    The job title is: ${jobTitle}
    The job description is: ${jobDescription}

    Focus strongly on skills analysis.
    Match resume skills with job required skills.
    Identify missing skills based on the job description.
    Recommend which skills the user should improve first.
    Recommend new skills and tools the user should learn to better fit this role.
    Explain why each missing skill matters for this job.
    
    When giving tips, write the tip in a short concise sentence, and provide detailed explanation in the "explanation" field But For "ATS" give detailed explanation tips.
    Return ONLY valid JSON in the exact structure below.

{
  "overallScore": 0,
  "ATS": {
    "score": 0,
    "tips": [{ "type": "good | improve", "tip": "" }]
  },
  "toneAndStyle": {
    "score": 0,
    "tips": [{ "type": "good | improve", "tip": "", "explanation": "" }]
  },
  "content": {
    "score": 0,
    "tips": [{ "type": "good | improve", "tip": "", "explanation": "" }]
  },
  "structure": {
    "score": 0,
    "tips": [{ "type": "good | improve", "tip": "", "explanation": "" }]
  },
  "skills": {
    "score": 0,
    "matchedSkills": [],
    "missingSkills": [],
    "skillImprovementAdvice": [
      {
        "skill": "",
        "reason": "",
        "howToImprove": ""
      }
    ],
    "recommendedNewSkillsAndTools": [
      {
        "name": "",
        "whyImportant": ""
      }
    ],
    "tips": [{ "type": "good | improve", "tip": "", "explanation": "" }]
  }
}

Rules
Return strictly valid JSON
Do not use markdown
Do not add comments
Do not write anything outside JSON

Resume text
${resumeText}
`;


  try {
    const result = await model.generateContent(prompt);
    const aiFeedback = result.response.text().replace(/```json|```/g, "").trim();

    const parsed = JSON.parse(aiFeedback);

    // save analysis in db

    const analysis = await db.resumeAnalysis.create({
      data: {
        userId: user.id,
        resumeUrl: resumeUrl,
        companyName,
        jobTitle,
        jobDescription,
        overallScore: Number(parsed.overallScore) || 0,
        atsScore: Number(parsed.ATS?.score || parsed.atsScore) || 0,
        matchedSkills: Array.isArray(parsed.skills?.matchedSkills) ? parsed.skills.matchedSkills : [],
        missingSkills: Array.isArray(parsed.skills?.missingSkills) ? parsed.skills.missingSkills : [],
        // Store the whole object as JSON
        aiFeedback: parsed,
      }
    });

    return analysis;


  } catch (error) {
    console.log("Error while analyzing resume", error)
    throw new Error("Error while analyzing resume");
  }

}

export async function getResumeFeedback(id) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) throw new Error("User not found");

  return await db.resumeAnalysis.findUnique({
    where: {
      id,
      userId: user.id,
    },
  });
}

export async function getAllResumeFeedbacks() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) throw new Error("User not found");

  return await db.resumeAnalysis.findMany({
    where: {
      userId: user.id,
    },
    orderBy: {
      createdAt: "asc",
    },
  });
}


export async function deleteResumeFeedback(id) {

  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized access");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) throw new Error("User not found");

  return await db.resumeAnalysis.delete({
    where: {
      id,
      userId: user.id,
    },
  })

}


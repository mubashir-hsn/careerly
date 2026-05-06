"use server";

import { db } from "@/lib/prisma";
import { checkAuth } from "@/services/authCheck";
import { generateAIResponse } from "@/services/geminiService";
import { checkTokenBalance, deductTokens, estimateTokens } from "@/services/subscriptionService";
import fs from 'fs';
import { createRequire } from "module";
import path from "path";

const require = createRequire(import.meta.url);
const pdfParse = require("pdf-parse-new");

const modelName = process.env.GEMINI_MODEL_B;

export async function generateResumeFeedback(formData) {

  const user = await checkAuth();
  if (!user) throw new Error("Unauthorized");

  // FormData values
  const companyName = formData.get("companyName");
  const jobTitle = formData.get("jobTitle");
  const jobDescription = formData.get("jobDescription")?.toString().trim().slice(0, 2000);
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
  const resumeText = (pdfData.text || "").replace(/\s+/g, " ").trim().slice(0, 4000);

  const prompt = `Analyze resume as an expert ATS/Hiring Manager. Be honest and critical.
Role: ${jobTitle}
JD: ${jobDescription}
Resume: ${resumeText}

Rules:
- Score 0-100 (accurate, not inflated)
- Provide Exactly 2-3 actionable tips for each section
- matchedSkills: 3-4 items, missingSkills: 3-4 items
- skillImprovementAdvice: 2 items, recommendedNewSkillsAndTools: 3-4 items
- Output ONLY valid JSON in this exact structure:

{
  "overallScore": 0,
  "ATS": { "score": 0, "tips": [{ "type": "good|improve", "tip": "" }] },
  "toneAndStyle": { "score": 0, "tips": [{ "type": "good|improve", "tip": "", "explanation": "" }] },
  "content": { "score": 0, "tips": [{ "type": "good|improve", "tip": "", "explanation": "" }] },
  "structure": { "score": 0, "tips": [{ "type": "good|improve", "tip": "", "explanation": "" }] },
  "skills": { 
    "score": 0, 
    "matchedSkills": [], 
    "missingSkills": [],
    "skillImprovementAdvice": [{ "skill": "", "reason": "", "howToImprove": "" }],
    "recommendedNewSkillsAndTools": [{ "name": "", "whyImportant": "" }],
    "tips": [{ "type": "good|improve", "tip": "", "explanation": "" }]
  }
}`;

  try {
    // Check token balance before AI call
    await checkTokenBalance(user.id);

    const result = await generateAIResponse(prompt, modelName);

    const aiFeedback = result.replace(/```json|```/g, "").trim();

    const parsed = JSON.parse(aiFeedback);

    // Deduct tokens after successful AI call
    const tokensUsed = await estimateTokens(prompt + aiFeedback);
    await deductTokens(user.id, "RESUME_ANALYSIS", tokensUsed);

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
    throw new Error(error.message || "Error while analyzing resume. AI services might be busy.");
  }
}

export async function getResumeFeedback(id) {
  const user = await checkAuth();
  if (!user) throw new Error("Unauthorized");

  return await db.resumeAnalysis.findUnique({
    where: {
      id,
      userId: user.id,
    },
  });
}

export async function getAllResumeFeedbacks() {
  const user = await checkAuth();
  if (!user) throw new Error("Unauthorized");

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

  const user = await checkAuth();
  if (!user) throw new Error("Unauthorized");

  return await db.resumeAnalysis.delete({
    where: {
      id,
      userId: user.id,
    },
  })

}


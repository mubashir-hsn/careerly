"use server";

import { db } from "@/lib/prisma";
import { checkAuth } from "@/services/authCheck";
import { generateAIResponse } from "@/services/geminiService";
import fs from 'fs';
import { createRequire } from "module";
import path from "path";


const require = createRequire(import.meta.url);
const pdfParse = require("pdf-parse-new");



export async function generateResumeFeedback(formData) {

  const user = await checkAuth();

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
  You are an expert ATS and hiring manager. Your task is to analyze resumes for real hiring scenarios.
   Be honest and critical. Do not inflate scores. Focus on skills, relevance, and ATS friendliness.

  Job Title:
  ${jobTitle}
  
  Job Description:
  ${jobDescription}
  
  Resume Content:
  ${resumeText}
  
  Evaluation rules:
  - Give scores from 0 to 100
  - Low quality resumes must receive low scores
  - Be specific and actionable in suggestions
  - Prioritize skills and experience gaps
  - Recommendations must be realistic for the role level
  
  Output rules:
  - Return ONLY valid JSON
  - Match the exact schema below
  - Do not add extra fields
  - Do not use markdown
  - Do not add comments
  - Do not write text outside JSON
  
  Required JSON schema:
    
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
    const result = await generateAIResponse(prompt);

    const aiFeedback = result.replace(/```json|```/g, "").trim();

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
  const user = await checkAuth();

  return await db.resumeAnalysis.findUnique({
    where: {
      id,
      userId: user.id,
    },
  });
}

export async function getAllResumeFeedbacks() {
  const user = await checkAuth();

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

  return await db.resumeAnalysis.delete({
    where: {
      id,
      userId: user.id,
    },
  })

}


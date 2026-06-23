"use server";

import { db } from "@/lib/prisma";
import { checkAuth } from "@/services/authCheck";
import { generateAIResponse } from "@/services/geminiService";
import { checkTokenBalance, deductTokens, estimateTokens } from "@/services/subscriptionService";
import { createRequire } from "module";
import { revalidatePath } from "next/cache";

const require = createRequire(import.meta.url);
const pdfParse = require("pdf-parse-new");

const modelName = process.env.GEMINI_MODEL_A || "gemini-2.5-flash";

/**
 * Retrieve the current user's portfolio.
 */
export async function getPortfolio() {
  const user = await checkAuth();
  if (!user) return null;

  try {
    const portfolio = await db.portfolio.findUnique({
      where: { userId: user.id },
    });
    return portfolio;
  } catch (error) {
    console.error("Error fetching portfolio:", error);
    return null;
  }
}

/**
 * Retrieve a public portfolio by username.
 */
export async function getPublicPortfolio(username) {
  if (!username) return null;

  try {
    const portfolio = await db.portfolio.findUnique({
      where: {
        username: username.toLowerCase().trim(),
        isPublished: true,
      },
      include: {
        user: {
          select: {
            name: true,
            imageUrl: true,
            email: true,
            industry: true,
          },
        },
      },
    });
    return portfolio;
  } catch (error) {
    console.error("Error fetching public portfolio:", error);
    return null;
  }
}

/**
 * Check if a username is available.
 */
export async function checkUsernameAvailability(username) {
  const user = await checkAuth();
  if (!user) throw new Error("Unauthorized");

  const cleanUsername = username.toLowerCase().replace(/[^a-z0-9-_]/g, "").trim();
  if (cleanUsername.length < 3) {
    return { available: false, error: "Username must be at least 3 characters." };
  }

  try {
    const existing = await db.portfolio.findUnique({
      where: { username: cleanUsername },
    });

    // If it's taken by someone else
    if (existing && existing.userId !== user.id) {
      return { available: false };
    }

    return { available: true, cleanUsername };
  } catch (error) {
    console.error("Error checking username:", error);
    return { available: false, error: "Failed to check username availability." };
  }
}

/**
 * Save or update the portfolio.
 */
export async function savePortfolio(data) {
  const user = await checkAuth();
  if (!user) throw new Error("Unauthorized");

  const cleanUsername = data.username.toLowerCase().replace(/[^a-z0-9-_]/g, "").trim();
  if (cleanUsername.length < 3) {
    throw new Error("Username must be at least 3 characters and alphanumeric (dashes/underscores allowed).");
  }

  // Check if username is taken by someone else
  const existingUsername = await db.portfolio.findUnique({
    where: { username: cleanUsername },
  });

  if (existingUsername && existingUsername.userId !== user.id) {
    throw new Error("Username is already taken.");
  }

  try {
    const portfolio = await db.portfolio.upsert({
      where: { userId: user.id },
      update: {
        username: cleanUsername,
        aboutMe: data.aboutMe,
        skills: data.skills || [],
        education: data.education || [],
        experience: data.experience || [],
        projects: data.projects || [],
        certifications: data.certifications || [],
        achievements: data.achievements || [],
        customSections: data.customSections || [],
        theme: data.theme || "modern",
        layout: data.layout || "standard",
        profileImage: data.profileImage || user.imageUrl,
        sectionVisibility: data.sectionVisibility || {},
        contactEmail: data.contactEmail || user.email,
        contactPhone: data.contactPhone || "",
        location: data.location || "",
        linkedinUrl: data.linkedinUrl || "",
        githubUrl: data.githubUrl || "",
        websiteUrl: data.websiteUrl || "",
        resumeUrl: data.resumeUrl || "",
        isPublished: data.isPublished !== undefined ? data.isPublished : false,
      },
      create: {
        userId: user.id,
        username: cleanUsername,
        aboutMe: data.aboutMe,
        skills: data.skills || [],
        education: data.education || [],
        experience: data.experience || [],
        projects: data.projects || [],
        certifications: data.certifications || [],
        achievements: data.achievements || [],
        customSections: data.customSections || [],
        theme: data.theme || "modern",
        layout: data.layout || "standard",
        profileImage: data.profileImage || user.imageUrl,
        sectionVisibility: data.sectionVisibility || {},
        contactEmail: data.contactEmail || user.email,
        contactPhone: data.contactPhone || "",
        location: data.location || "",
        linkedinUrl: data.linkedinUrl || "",
        githubUrl: data.githubUrl || "",
        websiteUrl: data.websiteUrl || "",
        resumeUrl: data.resumeUrl || "",
        isPublished: data.isPublished !== undefined ? data.isPublished : false,
      },
    });

    revalidatePath(`/portfolio/${cleanUsername}`);
    revalidatePath(`/portfolio`);
    return { success: true, data: portfolio };
  } catch (error) {
    console.error("Error saving portfolio:", error);
    throw new Error(error.message || "Failed to save portfolio.");
  }
}

/**
 * AI-powered Portfolio content extractor and improver.
 * Accepts career goals and optional PDF document.
 */
export async function generateAIPortfolio(formData) {
  const user = await checkAuth();
  if (!user) throw new Error("Unauthorized");

  const careerGoals = formData.get("careerGoals") || "";
  const additionalDoc = formData.get("additionalDoc");

  let additionalDocText = "";
  if (additionalDoc && additionalDoc.size > 0) {
    if (additionalDoc.type !== "application/pdf") {
      throw new Error("Only PDF documents are supported for upload.");
    }
    if (additionalDoc.size > 2 * 1024 * 1024) {
      throw new Error("Document exceeds the 2MB size limit.");
    }
    try {
      const buffer = Buffer.from(await additionalDoc.arrayBuffer());
      const parsedPdf = await pdfParse(buffer);
      additionalDocText = (parsedPdf.text || "").replace(/\s+/g, " ").trim().slice(0, 3000);
    } catch (pdfErr) {
      console.error("Failed to parse PDF document:", pdfErr);
      throw new Error("Failed to parse uploaded PDF document.");
    }
  }

  // Fetch resume data
  const resume = await db.resume.findUnique({
    where: { userId: user.id },
  });

  let parsedResume = null;
  if (resume && resume.content) {
    try {
      parsedResume = JSON.parse(resume.content);
    } catch (e) {
      console.error("Failed to parse resume content JSON:", e);
    }
  }

  // Construct context
  const context = {
    profile: {
      name: user.name,
      bio: user.bio,
      skills: user.skills,
      experienceYears: user.experience,
      industry: user.industry,
    },
    resume: parsedResume,
    careerGoals,
    additionalDocText,
  };

  const prompt = `You are an elite career strategist and executive portfolio designer. Your goal is to analyze the user's profile, existing resume details (if available), career goals, and additional documents, and generate a fully optimized, professionally enhanced portfolio JSON configuration.

  Context Data:
  ${JSON.stringify(context, null, 2)}

  Rules for Generation:
  1. Determine the user's exact professional field (e.g., "Senior Software Engineer", "Data Scientist", "Digital Marketer", "Creative Designer") based on their industry, bio, and resume summary. Store this title in the "field" key.
  2. "heroDescription": Write a short, highly persuasive 1-2 sentence tagline/description suited for the Hero section based on their field, goals, and experience.
  3. "aboutMe": Craft a compelling, polished 3-4 sentence professional introduction. Tailor it to highlight their unique value proposition and align with their Career Goals if provided. Write in first person ("I am..."), make it premium and persuasive.
  4. "skills": Generate an array of 5-15 highly relevant skills based on their profile, resume, and goals.
  5. "experience": Review their work experience. Rewrite descriptions to be achievement-oriented, using strong action verbs and including metrics/impact where possible. Keep it professional. (Array of objects: school/company name is 'company', job title is 'position', plus 'startDate', 'endDate', 'description', 'current').
  6. "education": Extract educational history. (Array of objects: 'school', 'degree', 'fieldOfStudy', 'startDate', 'endDate', 'description').
  7. "projects": Improve project descriptions to sound high-impact, listing tech stack and core outcomes. (Array of objects: 'title', 'description', 'technologies' as array of strings, 'link').
  8. "certifications": Extract certifications. (Array of: 'name', 'issuer', 'date', 'link').
  9. "achievements": Extract key accomplishments/achievements. (Array of: 'title', 'description', 'date').
  10. "contactEmail" & "contactPhone": Use their email/phone from resume or profile.
  11. "linkedinUrl", "githubUrl", "websiteUrl": Populate from resume contact info if available.
  
  Format Requirement:
  You must output ONLY valid JSON in this exact schema. No markdown formatting blocks around it (no \`\`\`json, just pure raw JSON text):
  {
    "field": "string",
    "heroDescription": "string",
    "aboutMe": "string",
    "skills": ["string"],
    "experience": [
      { "company": "string", "position": "string", "startDate": "string", "endDate": "string", "description": "string", "current": boolean }
    ],
    "education": [
      { "school": "string", "degree": "string", "fieldOfStudy": "string", "startDate": "string", "endDate": "string", "description": "string" }
    ],
    "projects": [
      { "title": "string", "description": "string", "technologies": ["string"], "link": "string" }
    ],
    "certifications": [
      { "name": "string", "issuer": "string", "date": "string", "link": "string" }
    ],
    "achievements": [
      { "title": "string", "description": "string", "date": "string" }
    ],
    "contactEmail": "string",
    "contactPhone": "string",
    "location": "string",
    "linkedinUrl": "string",
    "githubUrl": "string",
    "websiteUrl": "string"
  }`;

  try {
    const estimatedTokens = await estimateTokens(prompt) + 1500;
    await checkTokenBalance(user.id, estimatedTokens);

    const result = await generateAIResponse(prompt, modelName);
    const cleanJsonText = result.replace(/```json|```/g, "").trim();
    
    let parsedPortfolio;
    try {
      parsedPortfolio = JSON.parse(cleanJsonText);
    } catch (parseErr) {
      console.error("Gemini output was not valid JSON:", cleanJsonText);
      throw new Error("AI generated a response that could not be parsed. Please try again.");
    }

    // Deduct tokens after successful AI call
    const tokensUsed = await estimateTokens(prompt + cleanJsonText);
    await deductTokens(user.id, "CONTENT_IMPROVER", tokensUsed);

    // Save extracted field & heroDescription inside sectionVisibility JSON for backwards compatibility
    parsedPortfolio.sectionVisibility = {
      ...parsedPortfolio.sectionVisibility,
      field: parsedPortfolio.field || "",
      heroDescription: parsedPortfolio.heroDescription || ""
    };

    return parsedPortfolio;
  } catch (error) {
    console.error("Error generating portfolio with AI:", error);
    throw new Error(error.message || "Failed to generate portfolio with AI.");
  }
}

/**
 * AI-powered individual content improver (for custom text or description segments).
 */
export async function improvePortfolioText({ type, currentText, careerGoals }) {
  const user = await checkAuth();
  if (!user) throw new Error("Unauthorized");

  const prompt = `You are a premium career brand writer. Improve this portfolio ${type} to be high-impact, persuasive, and aligned with these career goals: "${careerGoals || 'general career growth'}".
  
  Original text:
  "${currentText}"
  
  Rules:
  - Output ONLY the polished, improved version.
  - No explanations, no introduction, no markdown formatting.
  - Maintain honesty but elevate professionalism.`;

  try {
    await checkTokenBalance(user.id, await estimateTokens(prompt));
    const result = await generateAIResponse(prompt, modelName);
    const content = result.trim();

    const tokensUsed = await estimateTokens(prompt + content);
    await deductTokens(user.id, "CONTENT_IMPROVER", tokensUsed);

    return content;
  } catch (error) {
    console.error("Error improving portfolio text:", error);
    throw new Error(error.message || "Failed to improve text.");
  }
}

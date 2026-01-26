"use server"
import { db } from "@/lib/prisma.js";
import { checkAuth } from "@/services/authCheck";
import { generateAIResponse } from "@/services/geminiService";
import { revalidatePath } from "next/cache";

const modelName = process.env.GEMINI_MODEL_A;

export const saveResume = async(content)=>{
  const user = await checkAuth();

    try {

        const resume = await db.resume.upsert({
            where:{
                userId: user.id
            },
            update:{
                content
            },
            create:{
                userId: user.id,
                content
            }
        })

        revalidatePath('/resume/resume-builder');
        return {
          success:true,
          data: resume
        }
        
    } catch (error) {
        console.log("Error while saving resume:" , error);
        throw new Error("Failed to save resume")
    }
}

export const getResume = async()=>{
  const user = await checkAuth();

    return await db.resume.findUnique({
        where:{
            userId: user.id
        }
    })
}

export async function improveWithAI({ current, type }) {
  const user = await checkAuth();

  let prompt = "";

  if (type == "summary") {
    
    const skillsText = user.skills.join(", ");

    prompt = `
      As an expert resume writer, create a professional summary for a user using the provided data.
      
      USER DATA:
      - Bio/Current: ${current || user?.bio}
      - Industry: ${user?.industry}
      - Skills: ${skillsText}
      - Experience: ${user?.experience || 0}

      CRITICAL CONSTRAINTS:
      1. Length: Exactly 3 to 4 high-impact lines.
      2. Content: Synthesize the highest degree, core technical skills, and key work highlights.
      3. Tone: Professional, third-person, and result-oriented.
      4. Goal: Make it sound like a top-tier industry leader.
      
      Format the response as a single paragraph without any intro or outro text.
    `;
  } else {
    // Logic for Experience or Project descriptions
    prompt = `
      As an expert career coach, improve the following ${type} content for a ${user.industry} professional.
      Current content: 
       - Title: ${current?.title || ''}
       - Organization: ${current?.organization || ''}
       - Description: ${current?.description || ''}

      CRITICAL CONSTRAINTS:
      1. Length: Exactly 2 to 3 lines of high-impact text.
      2. No Bullets: Provide 2 to 3 powerful, fluid sentences.
      3. Requirements: First read current content then use action verbs, include quantifiable metrics (e.g., %, Rs.), and focus on achievements.
      4. Tone: Professional and third-person.

      Format the response as a single paragraph without any additional explanation.
    `;
  }

  try {
    const response = await generateAIResponse(prompt, modelName)
    return response.trim();
  } catch (error) {
    console.error("Error improving content:", error);
    throw new Error("Failed to improve content");
  }
}


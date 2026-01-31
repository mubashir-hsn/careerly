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

  if (type === "summary") {

    const skillsText = user.skills.join(", ");
  
    prompt = `
    As an expert resume writer, create a professional summary for a user using the provided data.
  
    User details
    Bio ${current || user?.bio}
    Industry ${user?.industry}
    Skills ${skillsText}
    Experience ${user?.experience || 0} years
  
    Writing rules
    1. Length: Exactly 3 to 4 high-impact lines.
    2. Content: Synthesize the highest degree, core technical skills, and key work highlights. 
    3. Tone: Professional, third-person, and result-oriented.
    4. Avoid buzzwords, hype, and complex terms.
    5. Write in third person.Suitable for both technical and non technical roles.
    6. Make it sound human, not AI written.
  
    Output format
    Return only paragraph.
    Do not add headings or extra text.
    `;
  } else {
  
    prompt = `
    Improve the following ${type} section for a resume.
  
    Current content
    Title ${current?.title || ""}
    Organization ${current?.organization || ""}
    Description ${current?.description || ""}
  
    Writing rules
    1. Length: Exactly 2 to 3 lines of high-impact text.
    2. No Bullets: Provide 2 to 3 powerful, fluid sentences. 
    3. Requirements: First read current content then use action verbs, include quantifiable metrics (e.g., %, Rs.), and focus on achievements.
    4. Tone: Professional and third-person. Avoid buzzwords, hype, and complex terms.
    5. Suitable for ATS parsing and easy reading.
  
    Output format
    Return only one paragraph.
    Do not add bullets, headings, or explanations.
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


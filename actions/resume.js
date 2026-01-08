"use server"
import { db } from "@/lib/prisma.js";
import { auth } from "@clerk/nextjs/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { revalidatePath } from "next/cache";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash",
});


export const saveResume = async(content)=>{
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");
  
    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });
  
    if (!user) throw new Error("User not found");

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
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");
  
    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });
  
    if (!user) throw new Error("User not found");

    return await db.resume.findUnique({
        where:{
            userId: user.id
        }
    })
}


export async function improveWithAI({ current, type }) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
    select: {
      experience:true,
      skills: true,
      bio: true,
      industry:true,
      industryInsight: true,
    }
  });

  if (!user) throw new Error("User not found");

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
    const result = await model.generateContent(prompt);
    const response = result.response;
    return response.text().trim();
  } catch (error) {
    console.error("Error improving content:", error);
    throw new Error("Failed to improve content");
  }
}


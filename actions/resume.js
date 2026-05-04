"use server"
import { db } from "@/lib/prisma.js";
import { checkAuth } from "@/services/authCheck";
import { generateAIResponse } from "@/services/geminiService";
import { checkTokenBalance, deductTokens, estimateTokens } from "@/services/subscriptionService";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

const modelName = process.env.GEMINI_MODEL_A;

export const saveResume = async(content)=>{
  const user = await checkAuth();
  if (!user) throw new Error("Unauthorized");

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
        return NextResponse.json(
          {
            success: false,
            message: "Failed to save resume"
          },
          { status: 500 }
        )
            }
}

export const getResume = async()=>{
  const user = await checkAuth();
  if (!user) throw new Error("Unauthorized");

    return await db.resume.findUnique({
        where:{
            userId: user.id
        }
    })
}

export async function improveWithAI({ current, type }) {
  const user = await checkAuth();
  if (!user) throw new Error("Unauthorized");

  let prompt = "";

  if (type === "summary") {

    const skillsText = user.skills.join(", ");
  
    prompt = `Create a 3-4 line professional summary for a ${user.industry} professional (${user.experience} yrs exp).
Bio: ${ (current || user.bio)?.toString().replace(/\s+/g, " ").trim().slice(0, 1000) }
Skills: ${user.skills.join(", ")}

Rules: Professional, 3rd person, result-oriented. No clichés. Output ONLY the paragraph.`;
  } else {
  
    prompt = `Improve this ${type} section for a resume:
Title: ${current?.title}, Org: ${current?.organization}, Desc: ${current?.description?.toString().replace(/\s+/g, " ").trim().slice(0, 1000)}

Rules: 2-3 high-impact sentences. Use action verbs and metrics. 3rd person. No bullets or markdown. Output ONLY the paragraph.`;
  }
  

  try {
    // Check token balance before AI call
    await checkTokenBalance(user.id);

    const response = await generateAIResponse(prompt, modelName)

    // Deduct tokens after successful AI call
    const tokensUsed = await estimateTokens(prompt + response);
    await deductTokens(user.id, "CONTENT_IMPROVER", tokensUsed);

    return response.trim();
  } catch (error) {
    console.error("Error improving content:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to improve content"
      },
      { status: 502 }
    )
      }
}


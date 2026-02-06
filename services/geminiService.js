'use server'

import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function generateAIResponse(userPrompt,modelName) {
  try {
  
    const model = genAI.getGenerativeModel({ model: modelName });
    const result = await model.generateContent({
        contents: [
          { role: "user", parts: [{ text: userPrompt }] }
        ],
        generationConfig: {
          temperature: 0.4,
        }
      });

      if (!result?.response) {
        return NextResponse.json({
          success: false,
          message:"Empty AI response"
        }, {status: 502});
      }
  
      return result.response.text();
  } catch (error) {
    console.error("Gemini Service Error:", error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Something went wrong"
      }, { status: 502 })
  }
}

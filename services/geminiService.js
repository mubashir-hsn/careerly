'use server'

import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function generateAIResponse(userPrompt, modelName) {
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

    const responseText = result?.response?.text();
    if (!responseText) {
      throw new Error("Empty AI response received from Gemini.");
    }

    return responseText;
  } catch (error) {
    if (error.status === 503 || error.message?.includes("503") || error.message?.includes("high demand")) {
      throw new Error("AI services are currently overloaded. Please try again in 30 seconds.");
    }
    console.error("Gemini Service Error:", error);
    throw error;
  }
}

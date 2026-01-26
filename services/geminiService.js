'use server'

import { GoogleGenerativeAI } from "@google/generative-ai";

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
          maxOutputTokens: 1000,
        }
      });

      if (!result?.response) {
        throw new Error("Empty AI response");
      }
  
      return result.response.text();
  } catch (error) {
    console.error("Gemini Service Error:", error);
    throw new Error("AI generation failed");
  }
}

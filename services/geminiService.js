'use server'

import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const model = genAI.getGenerativeModel({
  model: `${process.env.GEMINI_MODEL}`,
});

export async function generateAIResponse(userPrompt) {
  try {
    const result = await model.generateContent({
        contents: [
          { role: "user", parts: [{ text: userPrompt }] }
        ],
        generationConfig: {
          temperature: 0.4,
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

import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req) {
    try {
        const { prompt } = await req.json();

        // Initialize the Generative AI model
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        // Define the system instruction for the AI's role
        const systemInstruction = "You are an AI career guide. Your purpose is to provide helpful and concise information on technology skills, career paths, and industry trends. Be friendly and encouraging, but keep your answers brief and to the point. Avoid lengthy explanations.";

        const result = await model.generateContent({
            contents: [{
                role: "user",
                parts: [{ text: prompt }]
            }],
            systemInstruction: {
                parts: [{ text: systemInstruction }]
            }
        });

        // Extract the text from the API response
        const textResponse = result.response.text();

        if (!textResponse) {
            return NextResponse.json({ error: 'No response received from the model.' }, { status: 500 });
        }

        return NextResponse.json({ response: textResponse });

    } catch (error) {
        console.error('API Route Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { db } from '@/lib/prisma';
import { checkAuth } from '@/services/authCheck';

export async function POST(req) {
    try {

        const user = await checkAuth();

        const { prompt, chatId } = await req.json();

        // Initialize the AI model
        const systemInstruction = "You are an AI career guide. Your purpose is to provide helpful and brief information on technology, skills, career paths, and industry trends. Be friendly and encouraging, but keep your answers brief , professional and to the point.";
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({
            model: `${process.env.GEMINI_MODEL_C}`,
            systemInstruction: systemInstruction
        });

        // Fetch History & Context
        let currentChatId = chatId;
        let history = [];

        if (currentChatId) {
            const previousMessages = await db.message.findMany({
                where: {
                    chatId: currentChatId
                  },
                  orderBy: {
                    createdAt: "asc"
                  },
                  take: 10
            })
            history = previousMessages.map(msg => ({
                role: msg?.role === "USER" ? 'user' : 'model',
                parts: [{ text: msg.content }]
            }))
        }
        // generate chat session
        const chatSession = model.startChat({ history })
        const result = await chatSession.sendMessage(prompt);
        const textResponse = result.response.text();

        if (!textResponse) {
            return NextResponse.json({ error: 'No response received. Please try again' }, { status: 500 });
        }

        let generatedTitle = null
        if (!currentChatId) {
            const titleResult = await model.generateContent(`Generate a short, 3-4 word title for this conversation: "${prompt}". Return only the title text.`);
            generatedTitle = titleResult.response.text().trim().replace(/[*"']/g, "");

            //create new chat
            const newChat = await db.chat.create({
                data: {
                    userId: user.id,
                    title: generatedTitle || 'New Conversation'
                }
            })

            currentChatId = newChat.id
        }

        // save messages in database
        await db.message.createMany({
            data: [
                { chatId: currentChatId, role: "USER", content: prompt },
                { chatId: currentChatId, role: "MODEL", content: textResponse },
            ]
        })


        return NextResponse.json({
            chatId: currentChatId,
            response: textResponse,
            title: generatedTitle
        });

    } catch (error) {
        console.error('Chat API Route Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

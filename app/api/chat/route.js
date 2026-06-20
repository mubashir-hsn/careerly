import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { db } from '@/lib/prisma';
import { checkAuth } from '@/services/authCheck';
import { checkTokenBalance, deductTokens, estimateTokens } from '@/services/subscriptionService';

export async function POST(req) {
    try {

        const user = await checkAuth();
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const { prompt, chatId } = await req.json();

        await checkTokenBalance(user.id, await estimateTokens(prompt));

        // Initialize the AI model
        const systemInstruction = "AI career guide. Brief, helpful info on tech, careers, and trends. Professional and concise.";
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

        // For new sessions, create chat immediately with a temp title so we can return fast
        if (!currentChatId) {
            const newChat = await db.chat.create({
                data: {
                    userId: user.id,
                    title: prompt.slice(0, 40) || 'New Conversation'
                }
            })
            currentChatId = newChat.id
        }

        // Save messages and deduct tokens in parallel (don't block response)
        const tokensUsed = await estimateTokens(prompt + textResponse);
        await Promise.all([
            deductTokens(user.id, "CHATBOT", tokensUsed),
            db.message.createMany({
                data: [
                    { chatId: currentChatId, role: "USER", content: prompt },
                    { chatId: currentChatId, role: "MODEL", content: textResponse },
                ]
            })
        ]);

        // Generate a proper AI title in the background (non-blocking)
        const bgChatId = currentChatId;
        model.generateContent(`Generate a 3-4 word title for: "${prompt}". Return ONLY the title.`)
            .then(async (titleResult) => {
                const title = titleResult.response.text().trim().replace(/[*"']/g, "");
                if (title) {
                    await db.chat.update({
                        where: { id: bgChatId },
                        data: { title }
                    });
                }
            })
            .catch((err) => console.error("Background title generation failed:", err.message));

        return NextResponse.json({
            chatId: currentChatId,
            response: textResponse,
        });

    } catch (error) {
        console.error('Chat API Route Error:', error);
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}

import { db } from "@/lib/prisma";
import { checkAuth } from "@/services/authCheck";
import { NextResponse } from "next/server";

export async function GET(){
    try {
    
        const user = await checkAuth();

        const chats = await db.chat.findMany({
            where:{ userId: user.id },
            orderBy: {updatedAt: 'desc'},
            select: {id:true, title:true, createdAt: true}
        })

        if (!chats) {
            return NextResponse.json({ error: "Not chat available." }, { status: 404 });
        }

        return NextResponse.json(chats);

    } catch (error) {
        console.error('Failed to fetch chat history:', error);
        return NextResponse.json({ error: 'Failed to fetch chat history' }, { status: 500 });
    }
}


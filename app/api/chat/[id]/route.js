import { db } from "@/lib/prisma";
import { checkAuth } from "@/services/authCheck";
import { NextResponse } from "next/server";

export async function GET( _ , { params }){
    try {
        const { id } = await params;
    
        const user = await checkAuth();
        
       const chats = await db.chat.findUnique({
        where:{
            id: id,
            userId: user.id
        },
        include:{
            messages:{
                orderBy:{ createdAt: 'asc'} 
            }
        },
        
       })

       if (!chats) {
        return NextResponse.json({error: 'Chat not found.'}, {status:404})
       }

       return NextResponse.json(chats)

    } catch (error) {
        console.error('Failed to fetch chat:', error);
        return NextResponse.json({ error: 'Failed to fetch chat.' }, { status: 500 });
    }
}

export async function DELETE(_,{ params }){
    try{
        const { id } = await params;
        const user = await checkAuth()

        const deleteChat = await db.chat.delete({
            where:{
                id:id,
                userId: user.id
            }
        })

        if (!deleteChat) {
            return NextResponse.json({error: 'Chat not found'})
        }

        return NextResponse.json({message: 'Chat deleted successfully'}, {status: 201})


    }catch (error) {
        console.error('Failed to delete chat:', error);
        return NextResponse.json({ error: 'Failed to delete chat.' }, { status: 500 });
    }
}
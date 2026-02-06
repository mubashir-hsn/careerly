'use server'
import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function checkAuth() {
    try {

        const { userId } = await auth();
        if (!userId) return NextResponse.json({
            success: false,
            message:"Unauthorized Access"
        }, {status: 401});

        const user = await db.user.findUnique({
            where: { clerkUserId: userId },
            include: {
              industryInsight: true
            }
        });

        if (!user) {
            return NextResponse.json(
              {
                success: false,
                message: "User not found"
              }, { status: 404 })
          }

        return user;


    } catch (error) {
        console.log("Error while check auth: ", error)
        return NextResponse.json({ 
            success: false,
            mesage: 'Failed to check users authentication'
        }, {status: 500})
    }
}
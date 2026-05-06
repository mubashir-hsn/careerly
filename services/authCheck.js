'use server'
import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function checkAuth() {
    try {

        const { userId } = await auth();
        if (!userId) return null;

        const user = await db.user.findUnique({
            where: { clerkUserId: userId },
            include: {
              industryInsight: true,
              adminUser: true,
            }
        });

        return user;


    } catch (error) {
        console.error("Error while check auth: ", error);
        return null;
    }
}
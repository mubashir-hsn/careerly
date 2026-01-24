'use server'
import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function checkAuth() {
    try {

        const { userId } = await auth();
        if (!userId) throw new Error("Unauthorized Access");

        const user = await db.user.findUnique({
            where: { clerkUserId: userId },
            include: {
              industryInsight: true
            }
        });

        if (!user) throw new Error("User not found");

        return user;


    } catch (error) {
        console.log("Error while check auth: ", error)
        throw new Error('Failed to check auth')
    }
}
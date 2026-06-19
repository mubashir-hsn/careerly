import { currentUser } from "@clerk/nextjs/server";
import { db } from "./prisma"
import { createNotification } from "@/actions/notifications";


export const checkUser = async()=>{

    try {
    const user = await currentUser();
    if (!user) {
        return null;
    }
    
    const loggedInUser = await db.user.findUnique({
       where:{
           clerkUserId : user.id
       },
       include: {
           adminUser: true
       }
    });
    
    if (loggedInUser) {
        return loggedInUser;
    }

    const name = `${user.firstName} ${user.lastName}`;

    const newUser = await db.user.create({
        data:{
            clerkUserId : user.id,
            name,
            imageUrl : user.imageUrl,
            email: user.emailAddresses[0].emailAddress
        }
    })

    // Auto-assign Free subscription plan to new user
    try {
      const freePlan = await db.subscriptionPlan.findFirst({
        where: { type: "FREE", isActive: true },
      });

      if (freePlan) {
        await db.userSubscription.create({
          data: {
            userId: newUser.id,
            planId: freePlan.id,
            tokensUsed: 0,
            tokensRemaining: freePlan.tokensIncluded,
            status: "ACTIVE",
          },
        });
      }
    } catch (subError) {
      console.log("Could not auto-assign Free plan:", subError.message);
    }

    // Trigger notification for admin
    try {
      await createNotification({
        type: "NEW_USER",
        title: "New User Registered",
        message: `A new professional, ${name}, has joined the platform.`,
        link: "/admin/users",
      });
    } catch (notifyError) {
      console.log("Admin notification failed:", notifyError.message);
    }

    return newUser;

 } catch (error) {

    console.log('Error while checking new user' , error.message);
    return null
 }


}
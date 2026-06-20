import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function checkPlans() {
  const plans = await prisma.subscriptionPlan.findMany();
  console.log("Plans in DB:", JSON.stringify(plans, null, 2));

  const subs = await prisma.userSubscription.findMany({
    include: { plan: true },
    take: 5
  });
  console.log("Recent Subscriptions:", JSON.stringify(subs, null, 2));
}

checkPlans()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());

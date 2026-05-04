const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding simplified subscription plans...");

  // Upsert Free Plan
  await prisma.subscriptionPlan.upsert({
    where: { type_tier: { type: "FREE", tier: "" } },
    update: {},
    create: {
      name: "Free",
      type: "FREE",
      tier: "",
      tokensIncluded: 1000,
      price: 0,
      features: [
        "COVER_LETTER",
        "INTERVIEW",
        "RESUME_ANALYSIS",
        "INSIGHTS",
        "CHATBOT",
        "CONTENT_IMPROVER",
      ],
      isActive: true,
    },
  });

  // Simplified Pro Plan (Template)
  await prisma.subscriptionPlan.upsert({
    where: { type_tier: { type: "PRO", tier: "Standard" } },
    update: {
      name: "Pro Plan",
    },
    create: {
      name: "Pro Plan",
      type: "PRO",
      tier: "Standard",
      tokensIncluded: 0, // Tokens are bought dynamically via recharge
      price: 0,
      features: [
        "COVER_LETTER",
        "INTERVIEW",
        "RESUME_ANALYSIS",
        "INSIGHTS",
        "CHATBOT",
        "CONTENT_IMPROVER",
      ],
      isActive: true,
    },
  });

  console.log("✅ Subscription plans simplified successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

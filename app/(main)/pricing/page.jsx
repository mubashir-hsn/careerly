import { getPlans, getCurrentPlan } from "@/actions/subscription";
import { checkAuth } from "@/services/authCheck";
import { redirect } from "next/navigation";
import PricingCards from "./_components/PricingCards";

export const metadata = {
  title: "Pricing - Careerly",
  description: "Choose the right plan for your career growth",
};

const PricingPage = async () => {
  const user = await checkAuth();
  if (!user) redirect("/sign-in");

  const [plans, currentPlan] = await Promise.all([
    getPlans(),
    getCurrentPlan(),
  ]);

  return (
    <div className="container mx-auto px-4 py-10">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-4">
          Choose Your Plan
        </h1>
        <p className="text-lg text-gray-500 max-w-2xl mx-auto">
          Unlock AI-powered career tools with the right plan. Start free and
          upgrade anytime.
        </p>
      </div>

      {/* Plan Cards */}
      <PricingCards plans={plans} currentPlan={currentPlan} />
    </div>
  );
};

export default PricingPage;

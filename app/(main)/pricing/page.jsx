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
    <div className="container mx-auto px-4 py-16 max-w-7xl min-h-screen">
      {/* Header */}
      <div className="text-center mb-16 space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 border border-indigo-100 rounded-full">
            <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-widest text-indigo-600">Premium Access Plans</span>
        </div>
        <h1 className="text-5xl md:text-6xl font-black text-slate-900 tracking-tighter">
          Elevate Your <span className="text-primary italic">Potential.</span>
        </h1>
        <p className="text-lg text-slate-500 max-w-2xl mx-auto font-medium leading-relaxed opacity-80">
          Unlock enterprise-grade AI orchestration and specialized career tools. Start with our foundational free tier and scale your growth as you dominate your market.
        </p>
      </div>

      {/* Plan Cards */}
      <PricingCards plans={plans} currentPlan={currentPlan} />
    </div>
  );
};

export default PricingPage;

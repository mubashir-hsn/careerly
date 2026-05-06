import { getPlans } from "@/actions/subscription";
import { Check, Crown, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import LandingPricingProCard from "./LandingPricingProCard";

export default async function PricingSection() {
  const plans = await getPlans();
  const proPlans = plans.filter(p => p.type === "PRO" && p.isActive).sort((a, b) => a.price - b.price);
  const freePlan = plans.find(p => p.type === "FREE");

  return (
    <section className="w-full py-24 bg-slate-900 text-white overflow-hidden relative">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full opacity-10 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-indigo-500 rounded-full blur-[120px]" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <Badge className="bg-indigo-500/20 text-indigo-400 border-indigo-500/30 px-4 py-1 mb-4 rounded-full font-bold tracking-widest text-[10px] uppercase">
            Pricing Plans
          </Badge>
          <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tight">
            Invest in Your <span className="text-indigo-400">Future Career</span>
          </h2>
          <p className="text-slate-400 text-lg font-medium">
            Choose the right plan to unlock AI-powered career growth tools and market insights.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Free Plan */}
          {freePlan && (
            <div className="bg-slate-800/40 backdrop-blur-md border-2 border-slate-700/50 p-10 rounded-[2.5rem] flex flex-col transition-all hover:border-slate-600 group">
              <div className="mb-10 flex justify-between items-start">
                <div>
                  <h3 className="text-3xl font-black mb-2">{freePlan.name}</h3>
                  <p className="text-slate-400 text-xs font-black uppercase tracking-widest bg-slate-700/30 px-3 py-1 rounded-full inline-block">Basic Access</p>
                </div>
                <div className="p-4 rounded-3xl bg-slate-700/30 text-slate-400 group-hover:text-white transition-colors">
                  <Zap className="w-8 h-8" />
                </div>
              </div>

              <div className="mb-10">
                <div className="flex items-baseline gap-1">
                  <span className="text-6xl font-black">Rs. 0</span>
                  <span className="text-slate-500 font-bold text-lg">/mo</span>
                </div>
                <p className="text-slate-400 text-sm mt-3 font-medium">
                  Includes <span className="text-white font-bold">{freePlan.tokensIncluded.toLocaleString()} free tokens</span> monthly for AI features.
                </p>
              </div>

              <div className="flex-1 space-y-5 mb-12">
                {(freePlan.features || ["Basic AI Analysis", "Career Basics", "Community Access"]).map((f) => (
                  <div key={f} className="flex items-center gap-4 text-slate-300 font-bold text-sm">
                    <div className="w-6 h-6 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                      <Check className="w-3.5 h-3.5 text-emerald-500" />
                    </div>
                    {f}
                  </div>
                ))}
              </div>

              <Button asChild variant="outline" className="w-full h-16 rounded-2xl border-slate-700  bg-slate-700 hover:bg-slate-800 hover:text-white text-white font-black text-xl transition-all hover:scale-[1.02]">
                <Link href="/sign-up">Start for Free</Link>
              </Button>
            </div>
          )}

          {/* Pro Plan - Custom Options Card */}
          {proPlans.length > 0 && (
            <LandingPricingProCard proPlans={proPlans} />
          )}
        </div>

      </div>
    </section>
  );
}

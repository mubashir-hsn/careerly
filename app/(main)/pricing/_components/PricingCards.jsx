"use client";

import { useState } from "react";
import { createCheckoutSession, cancelSubscription } from "@/actions/subscription";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  Check,
  Crown,
  Sparkles,
} from "lucide-react";

const features = [
  "AI Cover Letter Generator",
  "Interview Quiz Prep",
  "Resume ATS Analyzer",
  "Industry Insights",
  "AI Career Chatbot",
  "Content Improver",
];

export default function PricingCards({ currentPlan, plans = [] }) {
  const [loading, setLoading] = useState(null);

  // Dynamic Plans from Database
  const freePlan = plans.find(p => p.type === "FREE");
  const proPlans = plans.filter(p => p.type === "PRO" && p.isActive).sort((a, b) => a.price - b.price);

  // Default to the first pro plan if available
  const [selectedTier, setSelectedTier] = useState(proPlans[0] || null);

  const handleUpgrade = async () => {
    if (!selectedTier?.id) {
      toast.error("Please select a tier to recharge");
      return;
    }
    try {
      setLoading("upgrade");
      const result = await createCheckoutSession(selectedTier.id);
      if (result.url) {
        window.location.href = result.url;
      }
    } catch (error) {
      toast.error(error.message || "Failed to initiate payment");
    } finally {
      setLoading(null);
    }
  };

  const handleDowngrade = async () => {
    try {
      setLoading("downgrade");
      const result = await cancelSubscription();
      if (result.success) {
        toast.success("Successfully downgraded to Free Plan");
        window.location.reload();
      }
    } catch (error) {
      toast.error(error.message || "Failed to downgrade");
    } finally {
      setLoading(null);
    }
  };

  const isFree = currentPlan?.plan?.type === "FREE";
  const maxProTokens = proPlans.length > 0 ? proPlans[proPlans.length - 1].tokensIncluded : 1;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 max-w-6xl mx-auto">
      {/* Free Plan Card */}
      <div className="relative rounded-[2.5rem] border-0 bg-white p-10 flex flex-col transition-all duration-500 hover:shadow-[0_40px_80px_rgba(0,0,0,0.1)] hover:-translate-y-2 group shadow-xl">
        <div className="absolute top-0 right-0 w-48 h-48 bg-slate-50 rounded-bl-full -mr-12 -mt-12 opacity-50 group-hover:scale-110 transition-transform duration-700" />

        {!isFree && (
          <div className="absolute top-6 right-8">
            <Badge className="bg-slate-100 text-slate-400 border-0 px-4 py-1 text-[10px] font-black uppercase tracking-[0.2em] shadow-none">
              Basic Access
            </Badge>
          </div>
        )}
        {isFree && (
          <div className="absolute top-6 right-8">
            <Badge className="bg-emerald-500 text-white border-0 px-4 py-1 text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-emerald-100">
              Active Plan
            </Badge>
          </div>
        )}

        <div className="flex items-center gap-5 mb-10 relative z-10">
          <div className="w-16 h-16 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 shadow-sm transition-transform group-hover:rotate-12">
            <Sparkles className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-3xl font-black text-slate-900 tracking-tighter">{freePlan?.name || "Tier 0"}</h3>
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.3em]">Foundation Level</p>
          </div>
        </div>

        <div className="mb-10 relative z-10">
          <div className="flex items-baseline gap-2">
            <span className="text-6xl font-black text-slate-900 tracking-tighter">Rs. 0</span>
            <span className="text-slate-300 font-black text-lg uppercase">/ Life</span>
          </div>
          <p className="text-sm text-slate-500 mt-4 font-medium leading-relaxed">
            Allocated <span className="text-slate-900 font-black px-2 py-0.5 bg-emerald-50 rounded-lg">{freePlan?.tokensIncluded.toLocaleString() || "2,000"} Credits</span> per cycle for ecosystem exploration.
          </p>
        </div>

        <div className="flex-1 mb-12 relative z-10">
          <ul className="space-y-5">
            {(freePlan?.features?.length > 0 ? freePlan.features : features).map((feature) => (
              <li key={feature} className="flex items-center gap-4 text-sm text-slate-600 font-bold">
                <div className="w-6 h-6 rounded-full bg-emerald-50 flex items-center justify-center shrink-0">
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                </div>
                {feature}
              </li>
            ))}
            <li className="flex items-center gap-4 text-sm text-slate-300 font-bold line-through italic">
              <div className="w-6 h-6 rounded-full bg-slate-50 flex items-center justify-center shrink-0 opacity-50">
                <Crown className="w-3 h-3 text-slate-400" />
              </div>
              Priority AI Orchestration
            </li>
          </ul>
        </div>

        <Button
          variant="outline"
          onClick={handleDowngrade}
          disabled={isFree || loading === "downgrade"}
          className="w-full h-16 text-xs font-black uppercase tracking-[0.2em] rounded-2xl bg-white border-2 border-slate-100 hover:bg-slate-50 hover:border-slate-200 transition-all text-slate-700 relative z-10 active:scale-[0.98]"
        >
          {loading === "downgrade" ? "Synchronizing..." : isFree ? "Standard tier active" : "Revert to standard"}
        </Button>
      </div>

      {/* Pro Plan Card */}
      <div className="relative rounded-[2.5rem] border-0 bg-slate-900 text-white p-10 flex flex-col transition-all duration-500 hover:shadow-[0_50px_100px_rgba(79,70,229,0.25)] hover:-translate-y-2 group shadow-2xl overflow-hidden">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-indigo-600/10 rounded-full blur-[100px] -mr-48 -mt-48 transition-all duration-1000 group-hover:bg-indigo-600/20" />

        <div className="absolute top-6 right-8 z-10">
          <Badge className="bg-indigo-500 text-white border-0 px-5 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-indigo-500/20">
            Pro Plan
          </Badge>
        </div>

        <div className="flex items-center gap-5 mb-10 relative z-10">
          <div className="w-16 h-16 rounded-2xl bg-indigo-500/20 border border-indigo-500/30 text-indigo-400 flex items-center justify-center shadow-[0_0_20px_rgba(99,102,241,0.2)] transition-transform group-hover:rotate-12">
            <Crown className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-3xl font-black text-white tracking-tighter">Pro Pack</h3>
            <p className="text-[10px] text-indigo-400 font-black uppercase tracking-[0.3em]">Credits Included</p>
          </div>
        </div>

        {/* Token Selector UI */}
        <div className="mb-10 bg-white/5 backdrop-blur-xl p-8 rounded-4xl border border-white/10 shadow-2xl relative overflow-hidden z-10">
          <div className="relative z-10">
            <div className="flex justify-between items-center mb-6">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                  Choose Credits
                </label>
                <p className="text-xs font-black text-indigo-400 uppercase">
                  {selectedTier?.name || "Power User"} Allocation
                </p>
              </div>
              <div className="text-right">
                <span className="px-3 py-1 bg-white/10 rounded-lg text-[10px] font-black text-white uppercase tracking-widest border border-white/10">
                  Active Plan
                </span>
              </div>
            </div>

            <div className="grid grid-cols-5 gap-3 mb-8">
              {proPlans.map((option) => (
                <button
                  key={option.id}
                  onClick={() => setSelectedTier(option)}
                  className={`py-4 text-center rounded-xl border transition-all text-xs font-black duration-300 active:scale-90 ${selectedTier?.id === option.id
                    ? "bg-white text-slate-900 border-white shadow-[0_0_25px_rgba(255,255,255,0.3)]"
                    : "border-white/10 bg-white/5 text-slate-400 hover:border-white/30 hover:bg-white/10"
                    }`}
                >
                  {option.tokensIncluded / 1000}K
                </button>
              ))}
            </div>

            {/* Dynamic Progress Bar */}
            <div className="relative h-4 bg-white/5 rounded-full overflow-hidden mb-8 border border-white/5">
              <div
                className="absolute top-0 left-0 h-full bg-linear-to-r from-indigo-500 via-purple-500 to-white transition-all duration-1000 ease-in-out"
                style={{ width: `${selectedTier ? (selectedTier.tokensIncluded / maxProTokens) * 100 : 0}%` }}
              />
            </div>

            <div className="flex items-end justify-between border-t border-white/5 pt-6">
              <div>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Price</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-black text-white tracking-tighter">
                    Rs. {selectedTier?.price.toLocaleString() || 0}
                  </span>
                </div>
              </div>
              <div className="text-right bg-indigo-500/10 p-3 rounded-2xl border border-indigo-500/20">
                <p className="text-3xl font-black text-indigo-400 tracking-tighter leading-none mb-1">
                  {selectedTier?.tokensIncluded.toLocaleString() || 0}
                </p>
                <p className="text-[9px] font-black text-indigo-300 uppercase tracking-widest text-center">AI Credits</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 mb-12 relative z-10">
          <ul className="space-y-5">
            {(selectedTier?.features?.length > 0 ? selectedTier.features : features).map((feature) => (
              <li key={feature} className="flex items-center gap-4 text-sm text-slate-200 font-bold">
                <div className="w-6 h-6 rounded-full bg-indigo-500/20 flex items-center justify-center shrink-0 border border-indigo-500/30">
                  <Check className="w-3.5 h-3.5 text-indigo-400" />
                </div>
                {feature}
              </li>
            ))}
            <li className="flex items-center gap-4 text-sm text-amber-400 font-black italic mt-6">
              <div className="w-6 h-6 rounded-full bg-amber-500/20 flex items-center justify-center shrink-0 border border-amber-500/30">
                <Sparkles className="w-3.5 h-3.5 text-amber-400 fill-current" />
              </div>
              Priority AI Tools
            </li>
          </ul>
        </div>

        <Button
          onClick={handleUpgrade}
          disabled={loading === "upgrade" || !selectedTier}
          className="w-full h-20 text-sm font-black uppercase tracking-[0.2em] rounded-2xl bg-white text-slate-900 border-0 shadow-[0_20px_50px_rgba(255,255,255,0.1)] transition-all hover:scale-[1.02] hover:text-slate-100 active:scale-95 relative z-10 group/btn overflow-hidden"
        >
          <span className="relative z-10 flex items-center justify-center gap-3">
            {loading === "upgrade" ? "Processing..." : "Upgrade to Pro"}
            <Crown size={18} className="transition-transform group-hover/btn:rotate-12" />
          </span>
          <div className="absolute top-0 -left-full w-full h-full bg-linear-to-r from-transparent via-indigo-200/20 to-transparent transition-all duration-1000 group-hover:left-full" />
        </Button>
      </div>
    </div>
  );
}

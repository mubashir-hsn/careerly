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
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
      {/* Free Plan Card */}
      <div className="relative rounded-2xl border-2 border-slate-200 bg-linear-to-b from-slate-50 to-white p-8 flex flex-col transition-all hover:shadow-xl hover:border-slate-300">
        {!isFree && (
          <div className="absolute -top-3 right-4">
            <Badge className="bg-slate-400 text-white px-3 py-1 text-xs font-bold tracking-wider">
              BASIC ACCESS
            </Badge>
          </div>
        )}
        {isFree && (
          <div className="absolute -top-3 right-4">
            <Badge className="bg-emerald-600 text-white px-3 py-1 text-xs font-bold tracking-wider">
              CURRENT PLAN
            </Badge>
          </div>
        )}

        <div className="flex items-center gap-4 mb-8">
          <div className="p-4 rounded-2xl bg-white shadow-sm border border-slate-100 text-slate-600">
            <Sparkles className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-2xl font-black text-slate-900 tracking-tight">{freePlan?.name || "Free Tier"}</h3>
            <p className="text-sm text-slate-400 font-bold uppercase tracking-widest">Lifetime Access</p>
          </div>
        </div>

        <div className="mb-8">
          <div className="flex items-baseline gap-1">
            <span className="text-5xl font-black text-slate-900">Rs. 0</span>
            <span className="text-slate-400 font-bold">/mo</span>
          </div>
          <p className="text-sm text-slate-500 mt-2 font-medium">
            Includes <span className="text-black font-bold underline decoration-emerald-400">{freePlan?.tokensIncluded.toLocaleString() || "1,000"} Free Tokens</span> monthly
          </p>
        </div>

        <div className="flex-1 mb-10">
          <ul className="space-y-4">
            {(freePlan?.features?.length > 0 ? freePlan.features : features).map((feature) => (
              <li key={feature} className="flex items-center gap-3 text-sm text-slate-600 font-medium">
                <div className="w-5 h-5 rounded-full bg-emerald-50 flex items-center justify-center">
                  <Check className="w-3 h-3 text-emerald-600" />
                </div>
                {feature}
              </li>
            ))}
          </ul>
        </div>

        <Button 
          variant="outline" 
          onClick={handleDowngrade}
          disabled={isFree || loading === "downgrade"}
          className="w-full py-7 text-lg font-black rounded-2xl bg-white border-2 border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-all text-slate-700"
        >
          {loading === "downgrade" ? "Switching..." : isFree ? "Standard Free Active" : "Downgrade to Free"}
        </Button>
      </div>

      {/* Pro Plan Card */}
      <div className="relative rounded-2xl border-2 border-indigo-600 bg-linear-to-b from-indigo-50 to-white p-8 flex flex-col transition-all hover:shadow-2xl ring-8 ring-indigo-50/50">
        <div className="absolute -top-4 left-1/2 -translate-x-1/2">
          <Badge className="bg-indigo-600 text-white px-6 py-2 text-xs font-black uppercase tracking-widest shadow-lg shadow-indigo-200">
            Pro Powerhouse
          </Badge>
        </div>

        <div className="flex items-center gap-4 mb-8">
          <div className="p-4 rounded-2xl bg-indigo-600 text-white shadow-xl shadow-indigo-100">
            <Crown className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-2xl font-black text-slate-900 tracking-tight">Pro Plan</h3>
            <p className="text-sm text-indigo-600 font-black uppercase tracking-widest">Select Your Recharge</p>
          </div>
        </div>

        {/* Token Selector UI */}
        <div className="mb-8 bg-white/80 backdrop-blur-sm p-5 rounded-2xl border-2 border-indigo-100 shadow-sm relative overflow-hidden group">
          <div className="relative z-10">
            <div className="flex justify-between items-center mb-4">
               <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                Token Threshold
              </label>
              <span className="text-xs font-black text-indigo-600 bg-indigo-50 px-2 py-1 rounded">
                Tier: {selectedTier?.name || "Premium Access"}
              </span>
            </div>
            
            <div className="grid grid-cols-5 gap-2 mb-6">
              {proPlans.map((option) => (
                <button
                  key={option.id}
                  onClick={() => setSelectedTier(option)}
                  className={`py-3 text-center rounded-xl border-2 transition-all text-sm font-black ${
                    selectedTier?.id === option.id
                      ? "bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-100"
                      : "border-slate-100 bg-slate-50 text-slate-400 hover:border-indigo-200"
                  }`}
                >
                  {option.tokensIncluded / 1000}K
                </button>
              ))}
            </div>
            
            {/* Dynamic Progress Bar */}
            <div className="relative h-3 bg-slate-100 rounded-full overflow-hidden mb-6">
              <div 
                className="absolute top-0 left-0 h-full bg-linear-to-r from-indigo-500 via-purple-500 to-indigo-600 transition-all duration-700 ease-out"
                style={{ width: `${selectedTier ? (selectedTier.tokensIncluded / maxProTokens) * 100 : 0}%` }}
              />
            </div>
            
            <div className="flex items-end justify-between">
               <div>
                  <p className="text-xs font-bold text-slate-400 uppercase mb-1">Total Payment</p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-black text-slate-900">
                      Rs. {selectedTier?.price.toLocaleString() || 0}
                    </span>
                  </div>
               </div>
               <div className="text-right">
                 <p className="text-2xl font-black text-indigo-600">
                   {selectedTier?.tokensIncluded.toLocaleString() || 0}
                 </p>
                 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">AI Credits</p>
               </div>
            </div>
          </div>
        </div>

        <div className="flex-1 mb-10">
          <ul className="space-y-4">
            {(selectedTier?.features?.length > 0 ? selectedTier.features : features).map((feature) => (
              <li key={feature} className="flex items-center gap-3 text-sm text-slate-700 font-bold">
                <div className="w-5 h-5 rounded-full bg-indigo-50 flex items-center justify-center">
                  <Check className="w-3 h-3 text-indigo-600" />
                </div>
                {feature}
              </li>
            ))}
            <li className="flex items-center gap-3 text-sm text-indigo-800 font-black italic">
              <Sparkles className="w-4 h-4 text-amber-500" />
              Priority AI Processing
            </li>
          </ul>
        </div>

        <Button 
          onClick={handleUpgrade}
          disabled={loading === "upgrade" || !selectedTier}
          className="w-full py-8 text-xl font-black rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-2xl shadow-indigo-200 transition-all hover:scale-[1.02] active:scale-95 border-b-4 border-indigo-800"
        >
          {loading === "upgrade" ? "Preparing Secure Checkout..." : "Upgrade & Recharge Now"}
        </Button>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { Check, Crown, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export default function LandingPricingProCard({ proPlans = [] }) {
  const [selectedTier, setSelectedTier] = useState(proPlans[0] || null);
  const maxProTokens = proPlans.length > 0 ? proPlans[proPlans.length - 1].tokensIncluded : 1;

  if (!selectedTier) return null;

  return (
    <div className="relative p-10 rounded-[2.5rem] flex flex-col transition-all hover:scale-[1.02] border-4 border-indigo-500 bg-linear-to-br from-indigo-600 to-indigo-700 shadow-2xl shadow-indigo-500/20 group h-full">
      <div className="absolute -top-5 left-1/2 -translate-x-1/2 z-20">
        <Badge className="bg-amber-400 text-amber-950 px-6 py-2 rounded-full font-black text-xs uppercase tracking-[0.2em] shadow-xl">
          Most Popular
        </Badge>
      </div>

      <div className="mb-8 flex justify-between items-start relative z-10">
        <div>
          <h3 className="text-3xl font-black mb-2">{selectedTier.name}</h3>
          <p className="text-indigo-200 text-xs font-black uppercase tracking-widest bg-white/10 px-3 py-1 rounded-full inline-block">Professional Pro</p>
        </div>
        <div className="p-4 rounded-3xl bg-white/10 text-white animate-pulse">
          <Crown className="w-8 h-8" />
        </div>
      </div>

      {/* Token Selector UI / Custom Options */}
      <div className="mb-8 bg-black/20 backdrop-blur-xl p-6 rounded-4xl border border-white/10 relative z-10">
        <div className="flex justify-between items-center mb-4">
          <label className="text-[10px] font-black text-indigo-200 uppercase tracking-[0.2em]">Select Credit Tier</label>
        </div>

        <div className="grid grid-cols-5 gap-2 mb-6">
          {proPlans.map((plan) => (
            <button
              key={plan.id}
              onClick={() => setSelectedTier(plan)}
              className={`py-3 text-center rounded-xl border transition-all text-[10px] font-black duration-300 active:scale-95 ${selectedTier.id === plan.id
                  ? "bg-white text-indigo-600 border-white shadow-lg"
                  : "border-white/10 bg-white/5 text-indigo-200 hover:bg-white/10 hover:border-white/30"
                }`}
            >
              {plan.tokensIncluded / 1000}K
            </button>
          ))}
        </div>

        {/* Mini progress bar */}
        <div className="h-1.5 bg-white/10 rounded-full overflow-hidden mb-6">
          <div
            className="h-full bg-white transition-all duration-700 ease-out"
            style={{ width: `${(selectedTier.tokensIncluded / maxProTokens) * 100}%` }}
          />
        </div>

        <div className="flex items-end justify-between border-t border-white/10 pt-4">
          <div>
            <span className="text-4xl font-black text-white">Rs. {selectedTier.price.toLocaleString()}</span>
          </div>
          <div className="text-right">
            <p className="text-2xl font-black text-white leading-none">{selectedTier.tokensIncluded.toLocaleString()}</p>
            <p className="text-[8px] font-black text-indigo-200 uppercase tracking-widest">AI CREDITS</p>
          </div>
        </div>
      </div>

      <div className="flex-1 space-y-5 mb-10 relative z-10">
        {(selectedTier.features || ["Interview Quiz Prep", "Resume ATS Analyzer", "AI Career Chatbot", "Priority Support"]).map((f) => (
          <div key={f} className="flex items-center gap-4 text-white font-bold text-sm">
            <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
              <Check className="w-3.5 h-3.5 text-white" />
            </div>
            {f}
          </div>
        ))}
      </div>

      <Button asChild className="w-full h-16 rounded-2xl font-black text-xl shadow-2xl bg-white text-indigo-600 hover:bg-slate-50 transition-all hover:scale-[1.05] active:scale-95 relative z-10">
        <Link href="/pricing" className="flex items-center gap-2">
          <Zap className="w-6 h-6 fill-current" />
          Get Premium Access
        </Link>
      </Button>
    </div>
  );
}

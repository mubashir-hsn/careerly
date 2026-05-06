"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CreditCard, Zap, Info } from "lucide-react";
import Link from "next/link";

export default function DashboardOverview({ subscription }) {
  if (!subscription) return null;

  const { plan, tokensUsed, tokensRemaining } = subscription;

  // Logic Fix: Calculate total capacity based on actual tokens rather than just static plan limit
  // This ensures that recharges beyond the base limit are reflected correctly in the UI
  const totalCapacity = Math.max(plan.tokensIncluded, tokensUsed + tokensRemaining);
  const usagePercentage = totalCapacity > 0 ? (tokensUsed / totalCapacity) * 100 : 0;
  const isFree = plan.type === "FREE";

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
      {/* Token Usage Card */}
      <Card className="border-0 shadow-2xl bg-white rounded-[2rem] overflow-hidden relative group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-bl-full -mr-8 -mt-8 opacity-50 group-hover:scale-110 transition-transform duration-500" />

        <CardHeader className="relative z-10">
          <CardTitle className="text-sm font-black flex items-center gap-2 uppercase tracking-widest text-slate-400">
            <Zap className="w-4 h-4 text-indigo-600" />
            AI Credits
          </CardTitle>
        </CardHeader>
        <CardContent className="relative z-10 pt-4">
          <div className="space-y-8">
            <div className="flex justify-between items-end">
              <div>
                <p className="text-5xl font-black text-slate-900 tracking-tighter flex items-center gap-3">
                  {tokensRemaining.toLocaleString()}
                  <span className="text-[10px] font-black uppercase tracking-widest bg-indigo-600 text-white px-2.5 py-1 rounded-lg leading-none shadow-lg shadow-indigo-200">
                    Active
                  </span>
                </p>
                <p className="text-sm text-slate-500 font-bold mt-2 uppercase tracking-wide">Tokens remaining in cycle</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-black text-slate-800">
                  {tokensUsed.toLocaleString()} <span className="text-slate-300">/</span> {totalCapacity.toLocaleString()}
                </p>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Usage Stats</p>
              </div>
            </div>

            <div className="space-y-3">
              <Progress value={usagePercentage} className="h-4 bg-slate-100 rounded-full" />
              <div className="flex justify-between items-center text-xs font-black uppercase tracking-widest">
                <span className="text-indigo-600">{usagePercentage.toFixed(1)}% Capacity Used</span>
                <span className="text-slate-400">{isFree ? "Resets in 30 days" : "Continuous access"}</span>
              </div>
            </div>

            {usagePercentage > 80 && (
              <div className="flex items-center gap-3 p-4 bg-amber-50 border border-amber-100 rounded-2xl text-amber-700 text-xs font-bold shadow-sm animate-pulse">
                <Info className="w-5 h-5 flex-shrink-0" />
                <span>Critical Threshold: You have consumed over 80% of your allocated tokens. Upgrade to prevent interruption.</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Current Plan Card */}
      <Card className="border-0 shadow-2xl bg-slate-900 text-white rounded-[2rem] relative overflow-hidden flex flex-col group">
        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-white/5 rounded-full blur-3xl group-hover:scale-150 transition-all duration-700" />

        <CardHeader className="pb-2 relative z-10">
          <CardTitle className="text-sm font-black flex items-center gap-2 uppercase tracking-widest text-slate-400/60">
            <CreditCard className="w-4 h-4 text-purple-400" />
            Current Plan
          </CardTitle>
        </CardHeader>

        <CardContent className="relative z-10 flex-1 flex flex-col justify-between pt-4">
          <div className="space-y-6">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-4xl font-black tracking-tighter text-white">{plan.name}</h3>
                  <Badge className={`px-2.5 py-1 text-[9px] font-black uppercase tracking-widest shadow-xl ${isFree ? "bg-white/10 text-white border-white/20" : "bg-purple-500 text-white border-0 shadow-purple-500/20"}`}>
                    {isFree ? "Standard" : "Elite Tier"}
                  </Badge>
                </div>
                <p className="text-slate-400 text-sm font-medium leading-relaxed max-w-xs">
                  {isFree ? "Standard access to basic AI tools." : "Priority AI help with higher credit limits."}
                </p>
              </div>
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 border ${isFree ? "bg-white/5 border-white/10 text-white/40" : "bg-purple-500/20 border-purple-500/30 text-purple-400"}`}>
                <CreditCard className="w-7 h-7" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Status</p>
                <p className="text-xs font-black text-emerald-400 uppercase flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  Active
                </p>
              </div>
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">
                  {isFree ? "Cycle" : "Validity"}
                </p>
                <p className="text-xs font-black text-white uppercase tracking-tight">
                  {isFree ? "Monthly Refresh" : (subscription.endDate ? new Date(subscription.endDate).toLocaleDateString() : "Lifetime")}
                </p>
              </div>
            </div>

            <div className="flex gap-4 pt-2">
              <Button asChild className={`flex-1 h-14 font-black rounded-2xl shadow-xl transition-all active:scale-95 text-xs uppercase tracking-widest ${isFree ? "bg-white text-slate-900 hover:bg-slate-50" : "bg-purple-500 hover:bg-purple-600 text-white shadow-purple-500/40 border-0"}`}>
                <Link href="/pricing" className="flex items-center justify-center gap-2">
                  {isFree ? "Upgrade to Pro" : "Get More Credits"}
                  <Zap className="w-4 h-4 fill-current" />
                </Link>
              </Button>
              <Button asChild variant="outline" className="h-14 font-black bg-slate-800 rounded-2xl border-white/10 text-white hover:text-white hover:bg-slate-700 px-6 text-xs uppercase tracking-widest">
                <Link href="/billing">History</Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

    </div>
  );
}

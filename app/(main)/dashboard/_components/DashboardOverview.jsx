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
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      {/* Token Usage Card */}
      <Card className="border-0 shadow-lg bg-gradient-to-br from-indigo-50 to-white overflow-hidden relative">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <Zap className="w-24 h-24 text-indigo-600" />
        </div>
        <CardHeader>
          <CardTitle className="text-xl font-bold flex items-center gap-2">
            <Zap className="w-5 h-5 text-indigo-600" />
            AI Token Usage
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-end">
              <div>
                <p className="text-3xl font-extrabold text-gray-900">
                  {tokensRemaining.toLocaleString()}
                </p>
                <p className="text-sm text-gray-500 font-medium">Tokens Remaining</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-gray-700">
                  {tokensUsed.toLocaleString()} used
                </p>
                <p className="text-xs text-gray-400">of {totalCapacity.toLocaleString()}</p>
              </div>
            </div>

            <div className="space-y-2">
              <Progress value={usagePercentage} className="h-3 bg-indigo-100" />
              <div className="flex justify-between text-xs font-medium">
                <span className="text-indigo-600">{usagePercentage.toFixed(1)}% consumed</span>
                <span className="text-gray-400">{isFree ? "Resets monthly" : "Renews with plan"}</span>
              </div>
            </div>

            {usagePercentage > 80 && (
              <div className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-100 rounded-lg text-amber-700 text-xs">
                <Info className="w-4 h-4 flex-shrink-0" />
                <span>Running low on tokens! Upgrade your plan for more.</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Current Plan Card */}
      <Card className="border-0 shadow-lg bg-white relative overflow-hidden flex flex-col group">
        <div className="absolute top-0 right-0 w-24 h-24 bg-purple-50 rounded-bl-full -mr-8 -mt-8 transition-all group-hover:scale-125 duration-500 opacity-50" />

        <CardHeader className="pb-2 relative z-10">
          <CardTitle className="text-sm font-black flex items-center gap-2 uppercase tracking-widest text-slate-400">
            <CreditCard className="w-4 h-4 text-purple-600" />
            Membership Tier
          </CardTitle>
        </CardHeader>

        <CardContent className="relative z-10 flex-1 flex flex-col justify-between pt-2">
          <div className="space-y-5">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-3xl font-black text-slate-900 tracking-tighter">{plan.name}</h3>
                  <Badge className={`px-2 py-0.5 text-[8px] font-black uppercase tracking-widest ${isFree ? "bg-slate-100 text-slate-500 shadow-none border-0" : "bg-purple-600 text-white shadow-lg shadow-purple-100"}`}>
                    {isFree ? "Standard" : "Premium"}
                  </Badge>
                </div>
                <p className="text-slate-500 text-xs font-medium max-w-[180px]">
                  {isFree ? "Access to basic AI tools and limited tokens." : "Priority AI processing and higher token limits."}
                </p>
              </div>
              <div className={`p-3 rounded-xl ${isFree ? "bg-slate-50 text-slate-400" : "bg-purple-50 text-purple-600"}`}>
                <CreditCard className="w-6 h-6" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100/50">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Account Status</p>
                <p className="text-xs font-black text-emerald-600 uppercase flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Active
                </p>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100/50">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">
                  {isFree ? "Token Reset" : "Plan Expires"}
                </p>
                <p className="text-xs font-black text-slate-900 uppercase">
                  {isFree ? "Monthly" : (subscription.endDate ? new Date(subscription.endDate).toLocaleDateString() : "N/A")}
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <Button asChild className={`flex-1 font-black rounded-xl py-6 shadow-sm transition-all hover:scale-[1.01] ${isFree ? "bg-indigo-600 hover:bg-indigo-700 text-white" : "bg-purple-600 hover:bg-purple-700 text-white shadow-purple-100"}`}>
                <Link href="/pricing">
                  {isFree ? "Upgrade to Pro" : "Recharge Tokens"}
                </Link>
              </Button>
              <Button asChild variant="outline" className="font-bold rounded-xl py-6 border-slate-200 text-slate-500 hover:bg-slate-50 px-5">
                <Link href="/billing">History</Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

    </div>
  );
}

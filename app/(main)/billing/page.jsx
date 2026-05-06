import { getCurrentPlan } from "@/actions/subscription";
import { getUserFeatureUsageStats, getUserPaymentHistory, getTokenUsageLogs } from "@/actions/user-dashboard";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CreditCard, History, Zap, ArrowLeft, ArrowUpRight, BarChart3 } from "lucide-react";
import Link from "next/link";
import UsageAnalytics from "./_components/UsageAnalytics";
import { format } from "date-fns";

export const metadata = {
  title: "Billing & Usage - Careerly",
  description: "Manage your subscription, payments, and token usage.",
};

export default async function BillingPage() {
  const [subscription, featureUsage, payments, usageLogs] = await Promise.all([
    getCurrentPlan(),
    getUserFeatureUsageStats(),
    getUserPaymentHistory(),
    getTokenUsageLogs(),
  ]);

  if (!subscription) return null;

  const { plan, tokensUsed, tokensRemaining } = subscription;
  const isFree = plan.type === "FREE";
  
  // Logic Fix: Sync with Dashboard total capacity logic
  const totalCapacity = Math.max(plan.tokensIncluded, tokensUsed + tokensRemaining);
  const usagePercentage = totalCapacity > 0 ? ((tokensUsed / totalCapacity) * 100) : 0;

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl space-y-8">
      {/* Back to Dashboard */}
      <Link href="/dashboard" className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 transition-colors group">
        <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
        <span className="text-sm font-bold uppercase tracking-widest">Back to Dashboard</span>
      </Link>

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Billing & Usage</h1>
          <p className="text-slate-500 font-medium mt-1">Manage your plan and track every AI credit.</p>
        </div>
        <Button asChild className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl py-6 px-8 h-auto shadow-xl shadow-indigo-100 transition-all hover:scale-[1.02]">
          <Link href="/pricing" className="flex items-center gap-2">
            <Zap className="w-5 h-5 fill-current" />
            <span className="font-bold">Recharge Tokens</span>
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Subscription Info */}
        <Card className="border-0 shadow-lg bg-white overflow-hidden flex flex-col">
          <CardHeader className="border-b border-slate-50">
            <CardTitle className="flex items-center gap-2 text-lg font-bold">
              <CreditCard className="w-5 h-5 text-indigo-600" />
              Active Plan
            </CardTitle>
            <CardDescription>Your current subscription tier</CardDescription>
          </CardHeader>
          <CardContent className="pt-6 flex-1 flex flex-col justify-between">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-black text-slate-900 leading-tight">{plan.name}</h3>
                  <Badge className={`mt-1 font-black px-2 uppercase text-[9px] ${isFree ? "bg-slate-100 text-slate-500 shadow-none border-0" : "bg-purple-600 text-white shadow-lg shadow-purple-100"}`}>
                    {isFree ? "Standard Access" : "Premium Tier"}
                  </Badge>
                </div>
                <div className={`p-3 rounded-xl ${isFree ? "bg-slate-50 text-slate-400" : "bg-purple-50 text-purple-600"}`}>
                   <CreditCard className="w-6 h-6" />
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Credit Status</span>
                  <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${usagePercentage > 80 ? "bg-rose-100 text-rose-600" : "bg-emerald-100 text-emerald-600"}`}>
                   {(100 - usagePercentage).toFixed(0)}% Left
                  </span>
                </div>
                <div className="flex items-baseline gap-2">
                  <p className="text-3xl font-black text-slate-900 tracking-tighter flex items-center gap-2">
                    {tokensRemaining.toLocaleString()}
                    <span className="text-[10px] font-black uppercase tracking-tighter bg-emerald-600 text-white px-2 py-0.5 rounded shadow-sm">
                      Cumulative
                    </span>
                  </p>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-tight">Total Accumulated Balance</p>
                </div>
                <div className="mt-3 space-y-1.5">
                   <div className="flex justify-between text-[9px] font-black text-slate-400 uppercase tracking-widest">
                     <span>Consumption</span>
                     <span>{tokensUsed.toLocaleString()} / {totalCapacity.toLocaleString()}</span>
                   </div>
                   <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div 
                         className={`h-full rounded-full transition-all duration-1000 ${usagePercentage > 80 ? "bg-rose-500" : "bg-indigo-600"}`}
                         style={{ width: `${usagePercentage}%` }}
                      />
                   </div>
                </div>
              </div>

              {isFree ? (
                <div className="p-4 bg-indigo-50/50 rounded-xl border border-indigo-100/50">
                  <p className="text-xs text-indigo-600 font-bold leading-relaxed">
                    Upgrade to Premium to unlock higher token limits and professional career tools.
                  </p>
                </div>
              ) : (
                <div className="text-xs text-slate-500 p-4 bg-slate-50 rounded-xl border border-slate-100">
                   <div className="flex justify-between items-center">
                     <span className="font-bold uppercase tracking-widest text-[9px] text-slate-400">Account Status</span>
                     <span className="text-emerald-600 font-black uppercase text-[10px] flex items-center gap-1">
                       <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                       Active
                     </span>
                   </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Feature Usage Stats */}
        <div className="lg:col-span-2">
          <UsageAnalytics featureUsage={featureUsage} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {/* Token Usage History (Per Feature) */}
        <Card className="border-0 shadow-lg bg-white overflow-hidden">
          <CardHeader className="border-b border-slate-50">
            <CardTitle className="flex items-center gap-2 text-lg font-bold">
              <BarChart3 className="w-5 h-5 text-indigo-600" />
              Detailed AI Usage History
            </CardTitle>
            <CardDescription>Comprehensive log of tokens used per AI feature</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            {usageLogs.length > 0 ? (
              <Table>
                <TableHeader className="bg-slate-50">
                  <TableRow>
                    <TableHead className="font-bold text-slate-400 uppercase text-[10px] tracking-widest pl-6">Timestamp</TableHead>
                    <TableHead className="font-bold text-slate-400 uppercase text-[10px] tracking-widest">Feature / Service</TableHead>
                    <TableHead className="font-bold text-slate-400 uppercase text-[10px] tracking-widest">Tokens Consumed</TableHead>
                    <TableHead className="font-bold text-slate-400 uppercase text-[10px] tracking-widest text-right pr-6">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {usageLogs.map((log) => (
                    <TableRow key={log.id} className="hover:bg-slate-50 transition-colors">
                      <TableCell className="text-xs font-semibold text-slate-400 pl-6">
                        {format(new Date(log.createdAt), "MMM dd, yyyy - hh:mm a")}
                      </TableCell>
                      <TableCell className="text-sm font-black text-slate-700 uppercase tracking-tight">
                        {log.feature.replace("_", " ")}
                      </TableCell>
                      <TableCell className="text-sm font-bold text-rose-500">
                        -{log.tokensUsed.toLocaleString()} Tokens
                      </TableCell>
                      <TableCell className="text-right pr-6">
                        <Badge variant="outline" className="text-[10px] uppercase font-bold text-slate-400 border-slate-100">
                          PROCESSED
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="py-20 text-center">
                <BarChart3 className="w-12 h-12 text-slate-100 mx-auto mb-4" />
                <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">No usage logs found</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Payment History Table */}
        <Card className="border-0 shadow-lg bg-white overflow-hidden">
          <CardHeader className="border-b border-slate-50">
            <CardTitle className="flex items-center gap-2 text-lg font-bold">
              <History className="w-5 h-5 text-indigo-600" />
              Payment History
            </CardTitle>
            <CardDescription>Review your recent token recharge transactions</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            {payments.length > 0 ? (
              <Table>
                <TableHeader className="bg-slate-50">
                  <TableRow>
                    <TableHead className="font-bold text-slate-400 uppercase text-[10px] tracking-widest pl-6">Transaction ID</TableHead>
                    <TableHead className="font-bold text-slate-400 uppercase text-[10px] tracking-widest">Date</TableHead>
                    <TableHead className="font-bold text-slate-400 uppercase text-[10px] tracking-widest">Tokens Credited</TableHead>
                    <TableHead className="font-bold text-slate-400 uppercase text-[10px] tracking-widest">Amount</TableHead>
                    <TableHead className="font-bold text-slate-400 uppercase text-[10px] tracking-widest text-right pr-6">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payments.map((p) => (
                    <TableRow key={p.id} className="hover:bg-slate-50 transition-colors">
                      <TableCell className="font-mono text-[10px] text-slate-400 pl-6">{p.id.slice(0, 16)}...</TableCell>
                      <TableCell className="text-sm font-semibold text-slate-600">
                        {format(new Date(p.date), "MMM dd, yyyy")}
                      </TableCell>
                      <TableCell className="text-sm font-black text-emerald-600">
                        +{parseInt(p.tokens).toLocaleString()} Tokens
                      </TableCell>
                      <TableCell className="text-sm font-bold text-slate-700 uppercase">
                        {p.currency} {p.amount.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right pr-6">
                        <Badge className="bg-emerald-50 text-emerald-600 border-emerald-100 capitalize">
                          {p.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="py-20 text-center">
                <History className="w-12 h-12 text-slate-100 mx-auto mb-4" />
                <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">No transactions found</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      {/* Footer Info */}
      <div className="flex justify-center pt-4">
         <p className="text-sm text-slate-400 flex items-center gap-2">
           Detailed AI logs are processed securely via Careerly AI Engine. 
           <Link href="/dashboard" className="text-indigo-600 font-bold hover:underline flex items-center gap-1">
             Go to dashboard <ArrowUpRight className="w-3 h-3" />
           </Link>
         </p>
      </div>
    </div>
  );
}

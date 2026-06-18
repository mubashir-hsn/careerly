import { getUserAuditData } from "@/actions/admin";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, CreditCard, Zap, History, User, ShieldCheck, Mail, Calendar as CalendarIcon, Activity } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export const metadata = {
  title: "User Audit - Admin",
};

export default async function UserAuditPage({ params }) {
  const { id } = await params;
  const { user, subscription, payments, usageLogs, loginHistory } = await getUserAuditData(id);

  if (!user) return <div className="p-10 text-center font-black uppercase text-slate-400 tracking-widest">User Not Found</div>;

  const isFree = subscription?.plan?.type === "FREE";

  return (
    <div className="space-y-10 p-2 md:p-6 pb-20">
      {/* Navigation & Header Section */}
      <div className="space-y-6">
        <Link href="/admin/users" className="inline-flex items-center gap-2 text-slate-400 hover:text-slate-900 transition-all group">
          <div className="p-2 rounded-xl bg-white border border-slate-100 shadow-sm group-hover:shadow-md group-hover:-translate-x-1 transition-all">
            <ArrowLeft className="w-4 h-4" />
          </div>
          <span className="text-xs font-black uppercase tracking-widest">User Directory</span>
        </Link>

        <div className="relative overflow-hidden rounded-[2.5rem] bg-slate-900 text-white p-8 md:p-12 shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-[100px] -mr-48 -mt-48" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-[80px] -ml-32 -mb-32" />

          <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
            <div className="relative">
              <Avatar className="w-24 h-24 md:w-32 md:h-32 border-4 border-white/10 shadow-2xl">
                <AvatarImage src={user.imageUrl} />
                <AvatarFallback className="bg-linear-to-br from-indigo-600 to-purple-600 text-white font-black text-4xl">
                  {user.name?.charAt(0) || "U"}
                </AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-2 -right-2 bg-emerald-500 p-2 rounded-2xl border-4 border-slate-900 shadow-xl">
                <ShieldCheck className="w-5 h-5 text-white" />
              </div>
            </div>

            <div className="text-center md:text-left space-y-3">
              <div className="flex flex-col md:flex-row items-center gap-4">
                <h1 className="text-4xl capitalize md:text-5xl font-black tracking-tight">{user.name || "Anonymous User"}</h1>
                <Badge className={`px-4 py-1.5 font-black uppercase text-[10px] tracking-[0.2em] border-0 shadow-lg ${isFree ? "bg-white/10 text-white" : "bg-purple-600 text-white"}`}>
                  {isFree ? "Standard tier" : "pro executive"}
                </Badge>
              </div>

              <div className="flex flex-wrap justify-center md:justify-start gap-4 md:gap-8 text-slate-400 font-medium pt-2">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  <span className="text-sm">{user.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CalendarIcon className="w-4 h-4" />
                  <span className="text-sm">Joined {format(new Date(user.createdAt), "MMMM yyyy")}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-400 font-black">
                  <div className="w-2 h-2 rounded-full bg-slate-400 animate-pulse" />
                  <span className="text-xs uppercase tracking-widest">Active session detected</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Area Start */}
      <div className="space-y-10">
        
        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 px-1">
          <div className="bg-white p-8 rounded-4xl border border-slate-100 shadow-sm hover:shadow-xl transition-all group">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Available Credits</p>
            <h4 className="text-4xl font-black text-slate-900 tracking-tighter group-hover:text-primary transition-colors">
              {subscription?.tokensRemaining.toLocaleString() || 0}
            </h4>
          </div>
          <div className="bg-white p-8 rounded-4xl border border-slate-100 shadow-sm hover:shadow-xl transition-all">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Lifetime Usage</p>
            <h4 className="text-4xl font-black text-slate-900 tracking-tighter">
              {subscription?.tokensUsed.toLocaleString() || 0}
            </h4>
          </div>
          <div className="bg-white p-8 rounded-4xl border border-slate-100 shadow-sm hover:shadow-xl transition-all">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Total Revenue</p>
            <h4 className="text-4xl font-black text-emerald-600 tracking-tighter">
              {payments.reduce((acc, p) => acc + p.amount, 0).toLocaleString()} <span className="text-sm font-bold text-slate-400">USD</span>
            </h4>
          </div>
          <div className="bg-white p-8 rounded-4xl border border-slate-100 shadow-sm hover:shadow-xl transition-all">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Membership Status</p>
            <h4 className="text-2xl font-black text-indigo-600 tracking-tight uppercase">
              {subscription?.plan?.name || "Free Plan"}
            </h4>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Activity Trail */}
          <div className="lg:col-span-8 flex flex-col gap-8">
            <Card className="border border-slate-100 shadow-sm rounded-[2.5rem] bg-white overflow-hidden flex-1">
              <CardHeader className="p-8 md:p-10 border-b border-slate-50 flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-xl font-black text-slate-900 flex items-center gap-3">
                    <Zap className="w-5 h-5 text-primary" />
                    AI Execution Audit
                  </CardTitle>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Real-time resource consumption logs</p>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                {usageLogs.length > 0 ? (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader className="bg-slate-50/50">
                        <TableRow className="border-0">
                          <TableHead className="font-black text-slate-400 uppercase text-[9px] tracking-widest pl-10 h-16">Timestamp</TableHead>
                          <TableHead className="font-black text-slate-400 uppercase text-[9px] tracking-widest h-16">Operation</TableHead>
                          <TableHead className="font-black text-slate-400 uppercase text-[9px] tracking-widest text-right pr-10 h-16">Tokens</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {usageLogs.map((log) => (
                          <TableRow key={log.id} className="hover:bg-slate-50/50 transition-colors border-slate-50">
                            <TableCell className="text-[11px] font-bold text-slate-400 pl-10 py-6">
                              {format(new Date(log.createdAt), "MMM dd, HH:mm:ss")}
                            </TableCell>
                            <TableCell className="py-6">
                              <span className="text-sm font-black text-slate-900 uppercase tracking-tight">
                                {log.feature.replace("_", " ")}
                              </span>
                            </TableCell>
                            <TableCell className="text-right pr-10 py-6">
                              <Badge variant="ghost" className="bg-rose-50 text-rose-600 font-black text-[11px] px-3 py-1 rounded-xl">
                                -{log.tokensUsed}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="py-32 text-center">
                    <Zap className="w-16 h-16 text-slate-50 mx-auto mb-6" />
                    <p className="text-slate-400 font-black uppercase tracking-[0.2em] text-xs">No execution history found</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Side Billing History */}
          <div className="lg:col-span-4 flex flex-col gap-8">
            <Card className="border border-slate-100 shadow-sm rounded-[2.5rem] bg-white overflow-hidden h-full">
              <CardHeader className="p-8 border-b border-slate-50">
                <CardTitle className="text-xl font-black text-slate-900 flex items-center gap-3">
                  <CreditCard className="w-5 h-5 text-indigo-500" />
                  Revenue Trail
                </CardTitle>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Payment & Invoice History</p>
              </CardHeader>
              <CardContent className="p-8">
                <div className="space-y-6">
                  {payments.length > 0 ? (
                    payments.map((p) => (
                      <div key={p.id} className="flex items-center justify-between p-5 bg-slate-50/50 rounded-3xl border border-slate-100 hover:border-indigo-100 hover:bg-white hover:shadow-xl transition-all group">
                        <div>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{format(new Date(p.createdAt), "MMM dd, yyyy")}</p>
                          <p className="text-xs font-black text-slate-900">Purchase +{p.tokens.toLocaleString()}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-black text-slate-900 group-hover:text-indigo-600 transition-colors">{p.currency.toUpperCase()} {p.amount.toLocaleString()}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="py-20 text-center flex flex-col items-center">
                       <CreditCard className="w-12 h-12 text-slate-50 mb-4" />
                       <p className="text-slate-300 font-black uppercase tracking-widest text-[10px]">No payments detected</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Login History - Final Section */}
          <div className="lg:col-span-12">
            <Card className="border border-slate-100 shadow-sm rounded-[3rem] bg-white overflow-hidden">
              <CardHeader className="p-10 border-b border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <CardTitle className="text-xl font-black text-slate-900 flex items-center gap-4">
                    <History className="w-6 h-6 text-slate-400" />
                    Security Access Logs
                  </CardTitle>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Audit report for the last 3 access points</p>
                </div>
                <div className="flex -space-x-2">
                   {loginHistory?.slice(0, 5).map((s, i) => (
                      <div key={i} className="w-8 h-8 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center text-[10px] font-black text-slate-400 shadow-sm">
                        {s.ipAddress ? (s.ipAddress.split('.')[0]) : "?"}
                      </div>
                   ))}
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="grid grid-cols-1 md:grid-cols-3 divide-x divide-slate-50">
                  {loginHistory && loginHistory.length > 0 ? (
                    loginHistory.slice(0, 3).map((session) => (
                      <div key={session.id} className="p-10 hover:bg-slate-50/50 transition-all group">
                        <div className="flex justify-between items-center mb-6">
                          <code className="text-[11px] font-black text-slate-900 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200 shadow-sm group-hover:bg-white transition-colors">{session.ipAddress}</code>
                          <Badge variant="outline" className={`text-[9px] font-black uppercase px-3 py-1 rounded-full ${session.status === 'active' ? 'text-emerald-600 border-emerald-100 bg-emerald-50' : 'text-slate-400 border-slate-100 bg-white'}`}>
                            {session.status}
                          </Badge>
                        </div>
                        <p className="text-xs text-slate-400 font-bold mb-6 leading-relaxed bg-slate-50/50 p-4 rounded-2xl border border-slate-100 italic" title={session.userAgent || "Unknown Device"}>
                          "{session.userAgent ? session.userAgent.slice(0, 60) : "Unknown Device Identifier"}..."
                        </p>
                        <div className="flex items-center gap-3 text-[10px] font-black text-slate-900 uppercase tracking-widest">
                           <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center">
                             <CalendarIcon className="w-4 h-4 text-slate-400" />
                           </div>
                           <span>{format(new Date(session.lastActiveAt), "MMM dd, HH:mm")}</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-3 py-20 text-center">
                      <p className="text-slate-300 font-black uppercase tracking-widest text-[11px]">No access records</p>
                    </div>
                  )}
                </div>
                {loginHistory?.length > 3 && (
                  <div className="p-6 text-center bg-slate-50/30 border-t border-slate-50">
                    <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Global Audit Complete • {loginHistory.length} total sessions monitored</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

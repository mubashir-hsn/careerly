import { getUserAuditData } from "@/actions/admin";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CreditCard, Zap, History, User } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export const metadata = {
  title: "User Audit - Admin",
};

export default async function UserAuditPage({ params }) {
  const { id } = await params;
  const { user, subscription, payments, usageLogs } = await getUserAuditData(id);

  if (!user) return <div className="p-10 text-center font-black uppercase text-slate-400 tracking-widest">User Not Found</div>;

  const isFree = subscription?.plan?.type === "FREE";

  return (
    <div className="space-y-8 p-6">
      {/* Header */}
      <div>
        <Link href="/admin/users" className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 transition-colors mb-2 group">
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          <span className="text-xs font-bold uppercase tracking-widest">Back to Users</span>
        </Link>
        <div className="flex items-center gap-4">
          <Avatar className="w-16 h-16 border-2 border-white shadow-xl">
            <AvatarImage src={user.imageUrl} />
            <AvatarFallback className="bg-indigo-600 text-white font-black text-2xl">
              {user.name?.charAt(0) || "U"}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">{user.name || "Anonymous User"}</h1>
            <p className="text-slate-500 font-medium">{user.email}</p>
          </div>
          <Badge className={`ml-auto px-4 py-1 font-black uppercase tracking-widest ${isFree ? "bg-slate-100 text-slate-500" : "bg-purple-600 text-white shadow-lg shadow-purple-100"}`}>
            {isFree ? "Standard User" : "Premium Member"}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Account Snapshot */}
        <div className="space-y-6">
          <Card className="border-0 shadow-lg bg-white overflow-hidden">
            <CardHeader className="bg-slate-50/50 border-b border-slate-100">
              <CardTitle className="text-sm font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                <User className="w-4 h-4" />
                Account Snapshot
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Current Balance</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black text-slate-900">{subscription?.tokensRemaining.toLocaleString() || 0}</span>
                  <span className="text-xs font-bold text-slate-400 uppercase">Credits</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Lifetime Used</p>
                  <p className="text-sm font-black text-slate-700">{subscription?.tokensUsed.toLocaleString() || 0}</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Plan</p>
                  <p className="text-sm font-black text-indigo-600">{subscription?.plan?.name || "Free"}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-white overflow-hidden">
            <CardHeader className="bg-slate-50/50 border-b border-slate-100">
              <CardTitle className="text-sm font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                <CreditCard className="w-4 h-4" />
                Billing Profile
              </CardTitle>
            </CardHeader>
            <CardContent className="">
              <div className="space-y-4">
                {payments.length > 0 ? (
                  payments.map((p) => (
                    <div key={p.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100 hover:border-indigo-200 transition-colors">
                      <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">{format(new Date(p.createdAt), "MMM dd, yyyy")}</p>
                        <p className="text-xs font-bold text-slate-700">+{p.tokens.toLocaleString()} Tokens</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-black text-emerald-600">{p.currency.toUpperCase()} {p.amount.toLocaleString()}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="py-10 text-center text-[10px] font-black text-slate-300 uppercase tracking-widest">No payments found</div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* AI Usage Logs */}
        <div className="lg:col-span-2">
          <Card className="border-0 shadow-lg bg-white overflow-hidden h-full">
            <CardHeader className="bg-slate-50/50 border-b border-slate-100">
              <CardTitle className="text-sm font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                <Zap className="w-4 h-4" />
                Recent AI Consumption Logs
              </CardTitle>
              <CardDescription>Snapshot of the last 50 activity logs</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              {usageLogs.length > 0 ? (
                <Table>
                  <TableHeader className="bg-slate-50/30">
                    <TableRow>
                      <TableHead className="font-bold text-slate-400 uppercase text-[9px] tracking-widest pl-8">Time</TableHead>
                      <TableHead className="font-bold text-slate-400 uppercase text-[9px] tracking-widest">Feature</TableHead>
                      <TableHead className="font-bold text-slate-400 uppercase text-[9px] tracking-widest text-right pr-8">Tokens</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {usageLogs.map((log) => (
                      <TableRow key={log.id}>
                        <TableCell className="text-[10px] font-semibold text-slate-400 pl-8">
                          {format(new Date(log.createdAt), "MMM dd, HH:mm")}
                        </TableCell>
                        <TableCell className="text-xs font-black text-slate-700 uppercase tracking-tight">
                          {log.feature.replace("_", " ")}
                        </TableCell>
                        <TableCell className="text-right pr-8">
                          <span className="text-xs font-black text-rose-500">-{log.tokensUsed}</span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="py-20 text-center">
                  <Zap className="w-12 h-12 text-slate-100 mx-auto mb-4" />
                  <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">No consumption logs</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

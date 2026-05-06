import { getAllPayments } from "@/actions/admin";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download, Filter, Search, IndianRupee } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export const metadata = {
  title: "Revenue Ledger - Admin",
};

export default async function AdminRevenuePage({ searchParams }) {
  const params = await searchParams;
  const page = parseInt(params.page) || 1;
  const { payments, total, totalPages } = await getAllPayments(page);

  return (
    <div className="space-y-8 p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <Link href="/admin" className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 transition-colors mb-2 group">
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            <span className="text-xs font-bold uppercase tracking-widest">Back to Admin</span>
          </Link>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Revenue Ledger</h1>
          <p className="text-slate-500 font-medium">Platform-wide transaction history and financial audits.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="rounded-xl border-slate-200">
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Transaction Table */}
      <Card className="border-0 shadow-lg bg-white overflow-hidden">
        <CardHeader className="border-b border-slate-50 bg-slate-50/50">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <CardTitle>All Transactions</CardTitle>
              <CardDescription>A total of {total} successful payments processed.</CardDescription>
            </div>
            <div className="flex gap-2">
               <div className="relative">
                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                 <input 
                   placeholder="Search transactions..." 
                   className="pl-10 pr-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 w-64"
                 />
               </div>
               <Button variant="outline" size="icon" className="rounded-xl border-slate-200">
                 <Filter className="w-4 h-4" />
               </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-slate-50/50">
              <TableRow>
                <TableHead className="font-bold text-slate-400 uppercase text-[10px] tracking-widest pl-8">User</TableHead>
                <TableHead className="font-bold text-slate-400 uppercase text-[10px] tracking-widest">Plan / Item</TableHead>
                <TableHead className="font-bold text-slate-400 uppercase text-[10px] tracking-widest">Amount</TableHead>
                <TableHead className="font-bold text-slate-400 uppercase text-[10px] tracking-widest">Date</TableHead>
                <TableHead className="font-bold text-slate-400 uppercase text-[10px] tracking-widest">Transaction ID</TableHead>
                <TableHead className="font-bold text-slate-400 uppercase text-[10px] tracking-widest text-right pr-8">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payments.length > 0 ? (
                payments.map((p) => (
                  <TableRow key={p.id} className="hover:bg-slate-50/80 transition-colors">
                    <TableCell className="pl-8">
                       <div className="flex items-center gap-3">
                         <Avatar className="w-8 h-8 border border-slate-100">
                           <AvatarImage src={p.user.imageUrl} />
                           <AvatarFallback className="bg-indigo-50 text-indigo-600 font-bold text-[10px]">
                             {p.user.name?.charAt(0) || "U"}
                           </AvatarFallback>
                         </Avatar>
                         <div>
                           <p className="text-sm font-black text-slate-900 group-hover:text-indigo-600">{p.user.name || "Anonymous User"}</p>
                           <p className="text-[10px] text-slate-400 font-medium">{p.user.email}</p>
                         </div>
                       </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-slate-700 uppercase tracking-tight">
                          {p.plan?.name || "Token Recharge"}
                        </span>
                        <span className="text-[10px] text-slate-400 font-medium">
                          {p.tokens.toLocaleString()} Credits
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center text-sm font-black text-emerald-600">
                         <span className="uppercase text-[10px] mr-1">{p.currency}</span>
                         {p.amount.toLocaleString()}
                      </div>
                    </TableCell>
                    <TableCell className="text-xs font-semibold text-slate-500">
                      {format(new Date(p.createdAt), "MMM dd, yyyy HH:mm")}
                    </TableCell>
                    <TableCell className="font-mono text-[10px] text-slate-400">
                      {p.stripeSessionId.slice(0, 20)}...
                    </TableCell>
                    <TableCell className="text-right pr-8">
                      <Badge className="bg-emerald-50 text-emerald-600 border-emerald-100 hover:bg-emerald-100 uppercase text-[9px] font-black tracking-widest px-2">
                        {p.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="h-32 text-center text-slate-400 font-bold uppercase tracking-widest text-xs">
                    No transactions recorded yet
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2">
          {Array.from({ length: totalPages }).map((_, i) => (
            <Button
              key={i}
              asChild
              variant={page === i + 1 ? "default" : "outline"}
              className="w-10 h-10 rounded-xl font-bold"
            >
              <Link href={`/admin/revenue?page=${i + 1}`}>{i + 1}</Link>
            </Button>
          ))}
        </div>
      )}
    </div>
  );
}

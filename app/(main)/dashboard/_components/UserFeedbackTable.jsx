"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { format } from "date-fns";
import { MessageSquare, Calendar } from "lucide-react";

export default function UserFeedbackTable({ feedbacks }) {
  const getStatusBadge = (status) => {
    switch (status) {
      case "pending": return <Badge className="bg-amber-100 text-amber-600 shadow-none border-0">Pending</Badge>;
      case "in_progress": return <Badge className="bg-blue-100 text-blue-600 shadow-none border-0">In Progress</Badge>;
      case "resolved": return <Badge className="bg-emerald-100 text-emerald-600 shadow-none border-0">Resolved</Badge>;
      default: return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-3">
          <MessageSquare className="w-6 h-6 text-indigo-600" />
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Your Support Requests</h2>
        </div>
        <Button asChild variant="outline" className="rounded-xl border-indigo-200 text-indigo-600 hover:bg-indigo-50 font-bold transition-all hover:-translate-y-0.5">
          <Link href="/support">New Request</Link>
        </Button>
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] w-48">Date Submitted</th>
                <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Request Details</th>
                <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] w-48 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {feedbacks && feedbacks.length > 0 ? (
                feedbacks.map((f) => (
                  <tr key={f.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="p-6">
                      <div className="flex items-center gap-3">
                         <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center border border-slate-200 shadow-sm overflow-hidden text-slate-400 group-hover:text-indigo-600 transition-colors">
                            <Calendar className="w-5 h-5" />
                         </div>
                         <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{format(new Date(f.createdAt), "MMM dd")}</p>
                            <p className="text-sm font-black text-slate-900">{format(new Date(f.createdAt), "yyyy")}</p>
                         </div>
                      </div>
                    </td>
                    <td className="p-6 max-w-2xl">
                       <h4 className="font-black text-slate-800 text-sm mb-1">{f.subject}</h4>
                       <p className="text-xs text-slate-500 font-medium leading-relaxed italic line-clamp-2">
                         &quot;{f.message}&quot;
                       </p>
                    </td>
                    <td className="p-6 text-right">
                       {getStatusBadge(f.status)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="p-20 text-center">
                    <MessageSquare className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                    <p className="text-slate-400 font-black uppercase tracking-widest text-xs mb-6">No pending or past requests.</p>
                    <Button asChild className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold px-6 shadow-md shadow-indigo-200 transition-all hover:-translate-y-0.5">
                        <Link href="/support">Submit a Request</Link>
                    </Button>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

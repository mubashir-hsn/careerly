"use client";

import { useState } from "react";
import { updateFeedbackStatus } from "@/actions/feedback";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { format } from "date-fns";
import { User, Clock, CheckCircle2, AlertCircle, Mail } from "lucide-react";

export default function AdminFeedbackList({ initialFeedbacks }) {
  const [feedbacks, setFeedbacks] = useState(initialFeedbacks);
  const [updating, setUpdating] = useState(null);

  const handleStatusChange = async (id, newStatus) => {
    try {
      setUpdating(id);
      await updateFeedbackStatus(id, newStatus);
      setFeedbacks(feedbacks.map(f => f.id === id ? { ...f, status: newStatus } : f));
      toast.success("Ticket status updated successfully!");
    } catch (error) {
      toast.error(error.message || "Failed to update status");
    } finally {
      setUpdating(null);
    }
  };

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
      <div className="bg-white rounded-3xl border border-slate-100 shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">User</th>
                <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Request Details</th>
                <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Contact</th>
                <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Status</th>
                <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {feedbacks.length > 0 ? (
                feedbacks.map((f) => (
                  <tr key={f.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="p-6">
                      <div className="flex items-center gap-3">
                         <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center border border-slate-200 shadow-sm overflow-hidden text-slate-400 group-hover:text-indigo-600 transition-colors">
                            <User className="w-5 h-5" />
                         </div>
                         <div>
                            <p className="text-sm font-black text-slate-900">{f.user.name || "Anonymous"}</p>
                            <p className="text-[10px] font-bold text-slate-400 uppercase">{format(new Date(f.createdAt), "MMM dd, yyyy")}</p>
                         </div>
                      </div>
                    </td>
                    <td className="p-6 max-w-md">
                       <h4 className="font-black text-slate-800 text-sm mb-1">{f.subject}</h4>
                       <p className="text-xs text-slate-500 font-medium leading-relaxed italic line-clamp-2">
                         &quot;{f.message}&quot;
                       </p>
                    </td>
                    <td className="p-6">
                       <a href={`mailto:${f.user.email}`} className="flex items-center gap-2 text-indigo-600 hover:underline transition-all">
                          <Mail className="w-4 h-4" />
                          <span className="text-xs font-bold">{f.user.email}</span>
                       </a>
                    </td>
                    <td className="p-6">
                       {getStatusBadge(f.status)}
                    </td>
                    <td className="p-6 text-right">
                       <Select
                         disabled={updating === f.id}
                         value={f.status}
                         onValueChange={(value) => handleStatusChange(f.id, value)}
                       >
                         <SelectTrigger className="w-[140px] rounded-xl border-slate-200 h-10 text-[11px] font-black uppercase tracking-widest bg-white">
                           <SelectValue placeholder="Status" />
                         </SelectTrigger>
                         <SelectContent className="rounded-xl border-slate-100 shadow-2xl">
                           <SelectItem value="pending" className="text-amber-600 font-bold">Pending</SelectItem>
                           <SelectItem value="in_progress" className="text-blue-600 font-bold">In Progress</SelectItem>
                           <SelectItem value="resolved" className="text-emerald-600 font-bold">Resolved</SelectItem>
                         </SelectContent>
                       </Select>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="p-20 text-center">
                    <MessageSquare className="w-12 h-12 text-slate-100 mx-auto mb-4" />
                    <p className="text-slate-400 font-black uppercase tracking-widest text-xs">No feedback logs found</p>
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

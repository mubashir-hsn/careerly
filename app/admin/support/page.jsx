import { getAdminFeedbacks } from "@/actions/feedback";
import AdminFeedbackList from "./_components/AdminFeedbackList";
import { Badge } from "@/components/ui/badge";
import { MessageSquare } from "lucide-react";

export const metadata = {
  title: "User Support Management - Admin",
};

export default async function AdminSupportPage() {
  const feedbacks = await getAdminFeedbacks();

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 border border-indigo-100 rounded-full mb-3">
             <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
             <span className="text-[10px] font-black uppercase tracking-widest text-indigo-600">Support Center</span>
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">User Feedback</h1>
          <p className="text-slate-500 font-medium mt-1">Manage and resolve user feedback and support tickets.</p>
        </div>
        <div className="flex gap-4">
           <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center justify-center min-w-[120px]">
              <span className="text-2xl font-black text-slate-900">{feedbacks.length}</span>
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Total Tickets</span>
           </div>
           <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center justify-center min-w-[120px]">
              <span className="text-2xl font-black text-amber-500">{feedbacks.filter(f => f.status === 'pending').length}</span>
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Pending</span>
           </div>
        </div>
      </div>

      <AdminFeedbackList initialFeedbacks={feedbacks} />
    </div>
  );
}

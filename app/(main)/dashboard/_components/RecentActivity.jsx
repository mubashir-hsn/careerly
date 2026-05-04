"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  FileText, 
  GraduationCap, 
  Search, 
  MessageSquare, 
  LineChart, 
  PenTool,
  Clock,
  ExternalLink
} from "lucide-react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";

const featureIcons = {
  COVER_LETTER: <FileText className="w-4 h-4" />,
  INTERVIEW: <GraduationCap className="w-4 h-4" />,
  RESUME_ANALYSIS: <Search className="w-4 h-4" />,
  CHATBOT: <MessageSquare className="w-4 h-4" />,
  INSIGHTS: <LineChart className="w-4 h-4" />,
  CONTENT_IMPROVER: <PenTool className="w-4 h-4" />,
};

const featureConfig = {
  COVER_LETTER: { label: "Cover Letter", color: "text-blue-600", bg: "bg-blue-50" },
  INTERVIEW: { label: "Interview Prep", color: "text-indigo-600", bg: "bg-indigo-50" },
  RESUME_ANALYSIS: { label: "Resume Analysis", color: "text-rose-600", bg: "bg-rose-50" },
  CHATBOT: { label: "Career Chat", color: "text-purple-600", bg: "bg-purple-50" },
  INSIGHTS: { label: "Market Insights", color: "text-emerald-600", bg: "bg-emerald-50" },
  CONTENT_IMPROVER: { label: "Content Editor", color: "text-amber-600", bg: "bg-amber-50" },
};

export default function RecentActivity({ activities }) {
  if (!activities || activities.length === 0) {
    return (
      <Card className="border-0 shadow-2xl bg-white h-full">
        <CardHeader>
          <CardTitle className="text-xl font-black text-slate-900 tracking-tight">Recent Activity</CardTitle>
          <CardDescription className="text-xs font-bold uppercase tracking-widest text-slate-400">Your AI interaction feed</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4 border-2 border-dashed border-slate-200">
             <Clock className="w-6 h-6 text-slate-300" />
          </div>
          <p className="text-sm font-bold text-slate-400 max-w-[200px]">No recent activity found. Start using AI tools!</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-0 shadow-2xl bg-white h-full flex flex-col group">
      <CardHeader className="pb-4">
        <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                <Clock className="w-5 h-5 text-indigo-600" />
                Latest Events
              </CardTitle>
              <CardDescription className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mt-1">Real-time usage feed</CardDescription>
            </div>
            <Badge variant="outline" className="text-[10px] uppercase font-bold text-slate-400 border-slate-100">
              Live
            </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 overflow-y-auto px-6">
        <div className="space-y-6 relative before:absolute before:left-4 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-100">
          {activities.map((activity) => {
            const config = featureConfig[activity.feature] || { label: activity.feature, color: "text-slate-600", bg: "bg-slate-50" };
            return (
              <div key={activity.id} className="relative pl-10 group/item transition-all">
                {/* Timeline Dot */}
                <div className={`absolute left-[13px] top-1 w-2.5 h-2.5 rounded-full border-2 border-white shadow-sm transition-all group-hover/item:scale-150 ${config.bg.replace("50", "500")}`} />
                
                <div className="flex flex-col gap-1">
                  <div className="flex justify-between items-center">
                    <p className={`text-sm font-black uppercase tracking-tight ${config.color}`}>
                      {config.label}
                    </p>
                    <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {formatDistanceToNow(new Date(activity.createdAt), { addSuffix: true })}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-4 bg-slate-50/50 p-2 rounded-xl border border-transparent group-hover/item:border-slate-100 group-hover/item:bg-white group-hover/item:shadow-sm transition-all">
                    <div className={`p-2 rounded-lg ${config.bg} ${config.color}`}>
                      {featureIcons[activity.feature] || <Clock className="w-4 h-4" />}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-600">Consumed Credits</p>
                      <p className="text-sm font-black text-slate-900 tracking-tighter">-{activity.tokensUsed} Tokens</p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>

      <div className="p-6 pt-0 mt-auto">
        <Button asChild variant="outline" className="w-full border-2 border-slate-100 text-slate-500 font-bold hover:bg-slate-50 hover:text-indigo-600 rounded-2xl py-6 transition-all group">
           <Link href="/billing" className="flex items-center justify-center gap-2">
             Detailed Usage History
             <ExternalLink className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
           </Link>
        </Button>
      </div>
    </Card>
  );
}

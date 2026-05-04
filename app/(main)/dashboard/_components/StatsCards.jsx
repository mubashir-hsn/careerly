"use client";

import { Card, CardContent } from "@/components/ui/card";
import { 
  FileText, 
  GraduationCap, 
  Search, 
  MessageSquare, 
  LineChart, 
  PenTool 
} from "lucide-react";

export default function StatsCards({ stats }) {
  const items = [
    {
      title: "Cover Letters",
      value: stats.coverLetters,
      icon: <FileText className="w-6 h-6" />,
      color: "text-blue-600",
      bg: "bg-blue-50/50",
      border: "border-blue-100",
      glow: "shadow-blue-100",
    },
    {
      title: "Interview Prep",
      value: stats.interviews,
      icon: <GraduationCap className="w-6 h-6" />,
      color: "text-indigo-600",
      bg: "bg-indigo-50/50",
      border: "border-indigo-100",
      glow: "shadow-indigo-100",
    },
    {
      title: "ATS Analysis",
      value: stats.resumeAnalyses,
      icon: <Search className="w-6 h-6" />,
      color: "text-rose-600",
      bg: "bg-rose-50/50",
      border: "border-rose-100",
      glow: "shadow-rose-100",
    },
    {
      title: "AI Chats",
      value: stats.chats,
      icon: <MessageSquare className="w-6 h-6" />,
      color: "text-purple-600",
      bg: "bg-purple-50/50",
      border: "border-purple-100",
      glow: "shadow-purple-100",
    },
    {
      title: "Industry Logs",
      value: stats.insights,
      icon: <LineChart className="w-6 h-6" />,
      color: "text-emerald-600",
      bg: "bg-emerald-50/50",
      border: "border-emerald-100",
      glow: "shadow-emerald-100",
    },
    {
      title: "Content Edits",
      value: stats.contentImprovements,
      icon: <PenTool className="w-6 h-6" />,
      color: "text-amber-600",
      bg: "bg-amber-50/50",
      border: "border-amber-100",
      glow: "shadow-amber-100",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-12">
      {items.map((item) => (
        <Card 
          key={item.title} 
          className={`group border-2 ${item.border} shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2 relative overflow-hidden bg-white`}
        >
          <div className={`absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity`}>
             <div className="w-24 h-24 transform rotate-12">{item.icon}</div>
          </div>
          
          <CardContent className="p-6 flex flex-col items-center text-center relative z-10">
            <div className={`p-4 rounded-2xl ${item.bg} ${item.color} mb-4 group-hover:scale-110 transition-transform duration-300 shadow-sm ${item.glow}`}>
              {item.icon}
            </div>
            <p className="text-4xl font-black text-slate-900 tracking-tighter mb-1 select-none">
              {item.value || 0}
            </p>
            <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em] leading-tight">
              {item.title}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { Calendar as CalendarIcon, X, ArrowRight, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DateFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [startDate, setStartDate] = useState(searchParams.get("startDate") || "");
  const [endDate, setEndDate] = useState(searchParams.get("endDate") || "");

  const handleApply = () => {
    const params = new URLSearchParams(searchParams);
    if (startDate) params.set("startDate", startDate);
    else params.delete("startDate");
    
    if (endDate) params.set("endDate", endDate);
    else params.delete("endDate");
    
    params.set("page", "1");
    router.push(`/admin/revenue?${params.toString()}`);
  };

  const handleClear = () => {
    setStartDate("");
    setEndDate("");
    const params = new URLSearchParams(searchParams);
    params.delete("startDate");
    params.delete("endDate");
    params.set("page", "1");
    router.push(`/admin/revenue?${params.toString()}`);
  };

  const isActive = searchParams.get("startDate") || searchParams.get("endDate");

  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className={`flex items-center gap-0 bg-white border ${isActive ? 'border-indigo-200 ring-2 ring-indigo-50' : 'border-slate-200'} rounded-xl shadow-sm overflow-hidden transition-all`}>
        <div className="flex items-center px-3 py-2 gap-2 bg-slate-50/50 border-r border-slate-100">
           <CalendarIcon className={`w-3.5 h-3.5 ${isActive ? 'text-indigo-500' : 'text-slate-400'}`} />
           <span className="text-[10px] font-black uppercase tracking-tighter text-slate-400">From</span>
        </div>
        
        <input 
          type="date" 
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="px-3 py-2 text-xs font-bold text-slate-700 focus:outline-none bg-transparent hover:bg-slate-50/30 transition-colors"
        />

        <div className="flex items-center px-2 py-2 text-slate-300">
           <ArrowRight className="w-3 h-3" />
        </div>

        <div className="flex items-center px-3 py-2 gap-2 bg-slate-50/50 border-x border-slate-100">
           <span className="text-[10px] font-black uppercase tracking-tighter text-slate-400">To</span>
        </div>

        <input 
          type="date" 
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="px-3 py-2 text-xs font-bold text-slate-700 focus:outline-none bg-transparent hover:bg-slate-50/30 transition-colors"
        />

        <div className="p-1 border-l border-slate-100 bg-slate-50/30">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleApply}
            className="h-8 text-[10px] font-black uppercase tracking-widest text-indigo-600 hover:text-indigo-700 hover:bg-white px-4 rounded-lg shadow-sm border border-transparent hover:border-slate-100 transition-all"
          >
            Apply Filter
          </Button>
        </div>
      </div>

      {isActive && (
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleClear}
          className="h-10 px-3 rounded-xl border-red-100 bg-red-50/50 text-red-600 hover:bg-red-50 hover:text-red-700 hover:border-red-200 transition-all group"
        >
          <X className="w-4 h-4 mr-2 group-hover:rotate-90 transition-transform" />
          <span className="text-[10px] font-black uppercase tracking-widest">Clear</span>
        </Button>
      )}
    </div>
  );
}

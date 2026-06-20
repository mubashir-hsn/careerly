"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { RefreshCcw, Home, AlertCircle } from "lucide-react";
import Link from "next/link";

/**
 * Global error boundary for the application.
 * Handles server-side crashes and runtime errors gracefully.
 */
export default function Error({ error, reset }) {
  useEffect(() => {
    // Log the error to an error reporting service if needed
    console.error("Application Error Caught:", error);
  }, [error]);

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 py-20 text-center bg-white">
      {/* Animated Error Icon */}
      <div className="relative mb-10">
        <div className="w-28 h-28 bg-red-50 rounded-full flex items-center justify-center border-4 border-red-100 animate-pulse">
          <AlertCircle className="w-14 h-14 text-red-500" />
        </div>
        <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg border border-slate-100">
           <div className="w-6 h-6 bg-red-500 rounded-full animate-ping opacity-20" />
           <div className="absolute w-3 h-3 bg-red-500 rounded-full" />
        </div>
      </div>
      
      {/* Error Message */}
      <div className="max-w-2xl">
        <h1 className="text-4xl md:text-7xl font-black text-slate-900 tracking-tighter mb-6 leading-tight">
          INTERNAL <br className="md:hidden" /> SERVER ERROR
        </h1>
        
        <p className="text-lg md:text-xl text-slate-500 font-bold mb-12 leading-relaxed max-w-lg mx-auto">
          {error?.message || "Our system encountered an unexpected bottleneck. This usually happens during high demand or temporary database sync issues."}
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-5 w-full max-w-md px-4">
        <Button 
          onClick={() => reset()}
          className="h-16 flex-1 px-8 rounded-2xl bg-slate-900 hover:bg-black text-white font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-3 shadow-2xl hover:shadow-slate-300 transition-all hover:scale-[1.02] active:scale-95"
        >
          <RefreshCcw className="w-4 h-4" />
          Attempt Reconnect
        </Button>
        <Link href="/" className="flex-1">
          <Button 
            variant="outline"
            className="h-16 w-full px-8 rounded-2xl border-2 border-slate-200 hover:bg-slate-50 text-slate-900 font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-3 transition-all hover:scale-[1.02] active:scale-95"
          >
            <Home className="w-4 h-4" />
            Go To Home
          </Button>
        </Link>
      </div>

      {/* Technical Details (Minimalist) */}
      <div className="mt-20 pt-10 border-t border-slate-100 w-full max-w-xs opacity-60">
        <div className="flex items-center justify-center gap-6 mb-2">
            <div className="text-center">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Status</p>
              <p className="text-[11px] font-black text-red-600">CRITICAL</p>
            </div>
            <div className="h-6 w-px bg-slate-100" />
            <div className="text-center">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Error Code</p>
              <p className="text-[11px] font-black text-slate-900">500_DB_TIMEOUT</p>
            </div>
        </div>
        <p className="text-[9px] text-slate-300 font-bold tracking-tight mt-4 italic">
          Try refreshing after 10-15 seconds if the error persists.
        </p>
      </div>
    </div>
  );
}

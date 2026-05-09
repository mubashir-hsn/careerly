import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home, Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[85vh] px-4 py-20 text-center bg-white">
      {/* 404 Visual */}
      <div className="relative mb-12">
        <h1 className="text-[12rem] font-black text-slate-100 leading-none select-none">404</h1>
        <div className="absolute inset-0 flex items-center justify-center">
             <div className="bg-white p-4 rounded-3xl shadow-xl border border-slate-50 flex items-center gap-4 rotate-3 transform translate-y-8 animate-bounce transition-all duration-1000">
                <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center">
                   <Search className="w-6 h-6 text-indigo-600" />
                </div>
                <div className="text-left">
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">System Alert</p>
                   <p className="text-sm font-black text-slate-900 tracking-tight">PAGE_NOT_FOUND</p>
                </div>
             </div>
        </div>
      </div>

      <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tighter mb-6">
        LOST IN TRANSITION?
      </h2>
      
      <p className="text-lg text-slate-500 font-bold mb-12 max-w-md mx-auto leading-relaxed">
        The destination you are seeking doesn&apos;t exist or has been moved to a new coordinate within our system.
      </p>

      <div className="flex flex-col sm:flex-row gap-5 w-full max-w-md px-4">
        <Link href="/" className="flex-1 w-full">
          <Button 
            className="h-16 w-full px-8 rounded-2xl bg-slate-900 hover:bg-black text-white font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-3 shadow-2xl transition-all hover:scale-[1.02] active:scale-95"
          >
            <Home className="w-4 h-4" />
            Back to Base
          </Button>
        </Link>
      </div>

      <div className="mt-20 flex items-center gap-2 opacity-30">
        <div className="w-1.5 h-1.5 rounded-full bg-slate-400" />
        <div className="w-1.5 h-1.5 rounded-full bg-slate-200" />
        <div className="w-1.5 h-1.5 rounded-full bg-slate-100" />
      </div>
    </div>
  );
}
"use client";

import { RefreshCcw } from "lucide-react";

/**
 * Top-level global error boundary.
 * Must include <html> and <body> tags as it wraps the entire app.
 */
export default function GlobalError({ error, reset }) {
  return (
    <html lang="en">
      <body className="bg-white">
        <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center font-sans">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-8 border-4 border-red-50">
             <div className="w-10 h-10 bg-red-600 rounded-full animate-pulse flex items-center justify-center text-white font-black">!</div>
          </div>
          
          <h1 className="text-5xl font-black text-slate-900 tracking-tighter mb-4">CRITICAL SYSTEM ERROR</h1>
          <p className="text-slate-500 font-bold text-lg mb-10 max-w-md">
            A core system component failed to initialize. This is likely due to a server-side timeout or platform-wide connectivity issue.
          </p>

          <button
            onClick={() => reset()}
            className="h-16 px-10 rounded-2xl bg-slate-900 hover:bg-black text-white font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 shadow-2xl transition-all"
          >
            <RefreshCcw className="w-4 h-4" />
            Hard Reset App
          </button>

          <p className="mt-12 text-[10px] font-black text-slate-300 uppercase tracking-widest">
            ERROR_REF: {error?.digest || "GENERAL_FAILURE"}
          </p>
        </div>
      </body>
    </html>
  );
}

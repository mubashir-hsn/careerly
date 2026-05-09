"use client";

import { Search, X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useDebounce } from "@/hooks/use-debounce";

export default function SearchTransactions() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("search") || "");
  const debouncedQuery = useDebounce(query, 500);

  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    if (debouncedQuery) {
      params.set("search", debouncedQuery);
      params.set("page", "1");
    } else {
      params.delete("search");
    }
    router.push(`/admin/revenue?${params.toString()}`);
  }, [debouncedQuery]);

  const clearSearch = () => {
    setQuery("");
  };

  return (
    <div className="relative group">
      <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center pointer-events-none transition-colors group-focus-within:text-indigo-500">
        <Search className="w-4 h-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
      </div>
      
      <input 
        placeholder="Search name, email or ID..." 
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="pl-10 pr-10 py-2 bg-slate-50/50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all w-72 h-10 placeholder:text-slate-400"
      />

      {query && (
        <button 
          onClick={clearSearch}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 rounded-md hover:bg-slate-200 text-slate-400 transition-colors"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
}

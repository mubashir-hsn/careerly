"use client";

import { UserButton } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import {
  Bell,
  Search,
  ChevronRight,
  Home
} from "lucide-react";
import NotificationCenter from "@/app/admin/_components/NotificationCenter";

export default function AdminHeader() {
  const pathname = usePathname();

  // Format breadcrumbs: /admin/users -> Admin > Users
  const pathParts = pathname.split('/').filter(Boolean);
  const breadcrumbs = pathParts.map((part, index) => {
    const href = `/${pathParts.slice(0, index + 1).join('/')}`;
    const label = part.charAt(0).toUpperCase() + part.slice(1);
    return { label, href };
  });

  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-30 shadow-sm">
      {/* Search & Breadcrumbs */}
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2 text-slate-400 text-sm font-medium">
          <Home className="w-4 h-4" />
          <ChevronRight className="w-3 h-3" />
          {breadcrumbs.map((crumb, index) => (
            <div key={crumb.href} className="flex items-center gap-2">
              <span className={index === breadcrumbs.length - 1 ? "text-indigo-600 font-bold" : "hover:text-slate-600 transition-colors"}>
                {crumb.label}
              </span>
              {index < breadcrumbs.length - 1 && <ChevronRight className="w-3 h-3" />}
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4">
        <NotificationCenter />

        <div className="h-8 w-px bg-slate-100 mx-1" />

        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-xs font-black text-slate-900 leading-none">Admin Console</p>
            <p className="text-[10px] font-bold text-emerald-500 mt-1 uppercase tracking-tighter">Live Systems</p>
          </div>
          <UserButton />
        </div>
      </div>
    </header>
  );
}

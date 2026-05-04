"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Users, 
  CreditCard, 
  BarChart3, 
  Settings,
  ShieldCheck,
  LogOut
} from "lucide-react";
import { Button } from "@/components/ui/button";

const menuItems = [
  {
    title: "Overview",
    href: "/admin",
    icon: <LayoutDashboard className="w-5 h-5" />,
  },
  {
    title: "Users",
    href: "/admin/users",
    icon: <Users className="w-5 h-5" />,
  },
  {
    title: "Subscriptions",
    href: "/admin/subscriptions",
    icon: <CreditCard className="w-5 h-5" />,
  },
  {
    title: "Analytics",
    href: "/admin/analytics",
    icon: <BarChart3 className="w-5 h-5" />,
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col h-full shadow-sm">
      {/* Brand Header */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center gap-2 mb-2 text-indigo-600">
          <ShieldCheck className="w-6 h-6" />
          <span className="font-bold text-xl tracking-tight">Careerly Admin</span>
        </div>
        <p className="text-xs text-gray-400 font-medium uppercase tracking-widest">
          Management Console
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.href} href={item.href}>
              <div
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                  isActive
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-100"
                    : "text-gray-600 hover:bg-indigo-50 hover:text-indigo-600"
                }`}
              >
                <div className={`${isActive ? "text-white" : "text-gray-400 group-hover:text-indigo-500"}`}>
                  {item.icon}
                </div>
                <span className="font-semibold">{item.title}</span>
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Footer / Exit */}
      <div className="p-4 border-t border-gray-100">
        <Button
          asChild
          variant="ghost"
          className="w-full justify-start gap-3 rounded-xl text-gray-500 hover:text-red-600 hover:bg-red-50"
        >
          <Link href="/dashboard">
            <LogOut className="w-5 h-5" />
            <span className="font-semibold">Exit Admin</span>
          </Link>
        </Button>
      </div>
    </div>
  );
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import {
  LayoutDashboard,
  Users,
  CreditCard,
  BarChart3,
  LogOut,
  ArrowLeft,
  MessageSquare
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { UserButton } from "@clerk/nextjs";

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
  {
    title: "User Feedback",
    href: "/admin/support",
    icon: <MessageSquare className="w-5 h-5" />,
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col h-full shadow-sm relative z-20 transition-all duration-300">
      {/* Brand Header */}
      <div className="p-6 border-b border-gray-100 bg-slate-50/50 flex justify-center">
        <Link href="/" className="group block">
          <div className="relative w-full h-full overflow-hidden bg-white">
            <Image
              src="/careerly.jpg"
              alt="Careerly Logo"
              className="object-cover"
              width={120} height={130}
            />
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto mt-4">
        <div className="px-4 mb-4">
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Management</p>
        </div>
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.href} href={item.href}>
              <div
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group relative ${isActive
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-100"
                  : "text-slate-600 hover:bg-slate-50 hover:text-indigo-600"
                  }`}
              >
                <div className={`${isActive ? "text-white" : "text-slate-400 group-hover:text-indigo-600"}`}>
                  {item.icon}
                </div>
                <span className="font-bold text-sm tracking-tight">{item.title}</span>
                {isActive && (
                  <div className="absolute right-3 w-1.5 h-1.5 rounded-full bg-white shadow-sm" />
                )}
              </div>
            </Link>
          );
        })}
      </nav>

      {/* User Section & Exit */}
      <div className="p-4 border-t border-gray-100 bg-slate-50/30 space-y-3">
        <div className="flex items-center justify-between px-3 py-3 rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center gap-3">
            <UserButton
              appearance={{
                elements: {
                  avatarBox: "w-8 h-8 rounded-lg"
                }
              }}
            />
            <div className="hidden lg:block overflow-hidden">
              <p className="text-xs font-black text-slate-900 truncate">Account</p>
              <p className="text-[10px] font-bold text-slate-400">Admin Session</p>
            </div>
          </div>
        </div>

        <Button
          asChild
          variant="outline"
          className="w-full justify-start gap-3 rounded-xl text-slate-600 border-slate-200 hover:bg-slate-100 hover:text-slate-900 h-11"
        >
          <Link href="/">
            <ArrowLeft className="w-4 h-4" />
            <span className="font-bold text-xs">Return to App</span>
          </Link>
        </Button>
      </div>
    </div>
  );
}

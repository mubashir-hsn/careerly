"use client";

import { useEffect, useState } from "react";
import { 
  Bell, 
  Check, 
  CreditCard, 
  UserPlus, 
  Settings, 
  Trash2,
  ExternalLink,
  MessageSquare
} from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { getAdminNotifications, markNotificationRead, markAllNotificationsRead, createTestNotification } from "@/actions/notifications";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function NotificationCenter() {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchNotifications = async () => {
    try {
      const data = await getAdminNotifications();
      if (data) {
        setNotifications(data);
        setUnreadCount(data.filter(n => !n.isRead).length);
      }
    } catch (err) {
      console.error("Failed to fetch notifications");
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000); // Poll every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const handleMarkAsRead = async (id) => {
    try {
      await markNotificationRead(id);
      fetchNotifications();
    } catch (err) {
      toast.error("Failed to update notification");
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await markAllNotificationsRead();
      fetchNotifications();
      toast.success("All notifications marked as read");
    } catch (err) {
      toast.error("Failed to update notifications");
    }
  };

  const handleSendTestNotify = async () => {
    try {
      await createTestNotification();
      fetchNotifications();
      toast.success("Test notification emitted! Polling will reveal it soon.");
    } catch (err) {
      toast.error("Failed to send test");
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case "NEW_USER": return <UserPlus className="w-4 h-4 text-blue-500" />;
      case "PAYMENT_SUCCESS": return <CreditCard className="w-4 h-4 text-emerald-500" />;
      case "PLAN_CREATED": return <Settings className="w-4 h-4 text-indigo-500" />;
      case "PLAN_CHANGE": return <Settings className="w-4 h-4 text-amber-500" />;
      case "PLAN_DELETED": return <Trash2 className="w-4 h-4 text-red-500" />;
      case "NEW_FEEDBACK": return <MessageSquare className="w-4 h-4 text-purple-500" />;
      default: return <Bell className="w-4 h-4 text-slate-400" />;
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="p-2 rounded-xl text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all relative">
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className="absolute top-2 right-2.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white animate-pulse" />
          )}
        </button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent align="end" className="w-80 p-0 rounded-2xl overflow-hidden border-slate-200 shadow-2xl z-[100]">
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <h3 className="font-black text-slate-900 text-sm uppercase tracking-wider">Notifications</h3>
          {unreadCount > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-7 text-[10px] font-bold uppercase tracking-tighter text-indigo-600 hover:text-indigo-700 p-0 hover:bg-transparent"
              onClick={handleMarkAllRead}
            >
              Mark all read
            </Button>
          )}
        </div>

        <div className="max-h-[400px] overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="p-8 text-center">
              <Bell className="w-8 h-8 text-slate-200 mx-auto mb-2" />
              <p className="text-xs text-slate-400 font-medium">All caught up!</p>
            </div>
          ) : (
            notifications.map((n) => (
              <div 
                key={n.id} 
                className={`p-4 border-b border-slate-50 hover:bg-slate-50 transition-colors group relative ${!n.isRead ? "bg-indigo-50/30" : ""}`}
              >
                <div className="flex gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${!n.isRead ? "bg-white shadow-sm" : "bg-slate-100"}`}>
                    {getIcon(n.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-black text-slate-900 leading-tight mb-0.5">{n.title}</p>
                    <p className="text-[11px] text-slate-500 font-medium line-clamp-2 mb-2">{n.message}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">
                        {formatDistanceToNow(new Date(n.createdAt), { addSuffix: true })}
                      </span>
                      <div className="flex items-center gap-2">
                         {n.link && (
                           <Link 
                            href={n.link} 
                            className="text-[10px] font-black text-indigo-600 uppercase tracking-widest flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
                           >
                             View <ExternalLink className="w-2.5 h-2.5" />
                           </Link>
                         )}
                         {!n.isRead && (
                           <button 
                             onClick={() => handleMarkAsRead(n.id)}
                             className="text-slate-400 hover:text-emerald-600 transition-colors"
                             title="Mark as read"
                           >
                             <Check className="w-3.5 h-3.5" />
                           </button>
                         )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="p-3 bg-slate-50 text-center border-t border-slate-200">
           <button 
            onClick={handleSendTestNotify}
            className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-indigo-600 transition-colors"
           >
            Send Test Alert 🛰️
          </button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

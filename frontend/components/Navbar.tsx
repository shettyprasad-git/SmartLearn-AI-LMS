"use client";

import { useState, useEffect } from "react";
import { Bell, Search, Settings, User, LogOut, Shield, Monitor, CheckCircle2, Info, ChevronDown } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import apiClient from "@/lib/apiClient";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout, isAuthenticated } = useAuthStore();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      fetchNotifications();
    }
  }, [isAuthenticated]);

  const fetchNotifications = async () => {
    try {
      const res = await apiClient.get("/notifications/me");
      setNotifications(res.data);
    } catch (err) {
      console.error("Failed to fetch notifications", err);
    }
  };

  const markRead = async (id: string) => {
    try {
      await apiClient.patch(`/notifications/${id}/read`);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
    } catch (err) {
      console.error(err);
    }
  };

  const markAllRead = async () => {
    try {
      await apiClient.patch("/notifications/read-all");
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
    } catch (err) {
      console.error(err);
    }
  };

  const unreadCount = notifications.filter(n => !n.is_read).length;

  if (pathname.includes("/auth")) return null;

  return (
    <header className="h-24 px-10 flex items-center justify-between z-40 bg-background/20 backdrop-blur-3xl sticky top-0 border-b border-white/5">
      {/* Search Bar - Center Style */}
      <div className="flex-1 max-w-xl relative group">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
        </div>
        <input 
          type="text" 
          placeholder="Search for courses, lessons, skills..." 
          className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all font-medium text-white placeholder:text-muted-foreground/50"
        />
      </div>

      {/* Right Side Tools */}
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-3 pr-6 border-r border-white/10">
          {/* Notifications */}
          <div className="relative">
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className={cn(
                "p-3 rounded-2xl transition-all relative glass-card",
                showNotifications ? "bg-primary/20 text-primary" : "hover:bg-white/10 text-muted-foreground hover:text-white"
              )}
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-3 right-3 w-2.5 h-2.5 bg-primary rounded-full border-2 border-[#0A0A0A]" />
              )}
            </button>

            <AnimatePresence>
              {showNotifications && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 mt-4 w-96 glass-premium rounded-[32px] overflow-hidden z-50 p-6 space-y-4 shadow-2xl"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-black text-white uppercase tracking-tighter">Notifications</h4>
                    {unreadCount > 0 && (
                      <span 
                        onClick={markAllRead}
                        className="text-[10px] font-black text-primary uppercase cursor-pointer hover:underline"
                      >
                        Mark all read
                      </span>
                    )}
                  </div>
                  <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 scrollbar-hide">
                    {notifications.length > 0 ? notifications.map(notif => (
                      <div 
                        key={notif.id} 
                        onClick={() => !notif.is_read && markRead(notif.id)}
                        className={cn(
                          "p-4 rounded-2xl transition-all flex gap-4 cursor-pointer",
                          notif.is_read ? "bg-white/5 opacity-60" : "bg-white/10 border border-white/10"
                        )}
                      >
                         <div className={cn(
                           "w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0",
                           notif.type === 'success' ? "bg-green-500/20 text-green-400" : "bg-primary/20 text-primary"
                         )}>
                            {notif.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <Info className="w-5 h-5" />}
                         </div>
                         <div className="flex-1 space-y-1">
                            <h5 className="text-xs font-bold text-white leading-none">{notif.title}</h5>
                            <p className="text-[10px] text-muted-foreground leading-snug">{notif.message}</p>
                            <span className="text-[9px] text-primary font-bold uppercase tracking-widest">
                              {new Date(notif.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                         </div>
                      </div>
                    )) : (
                      <div className="py-10 text-center">
                        <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest">No notifications</p>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Settings */}
          <button 
            className="p-3 rounded-2xl hover:bg-white/10 text-muted-foreground hover:text-white transition-all glass-card"
            onClick={() => router.push("/profile")}
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>

        {/* Profile */}
        <div className="relative">
          <button 
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-3 p-1.5 pl-4 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition-all"
          >
            <div className="flex flex-col items-end hidden sm:flex">
              <span className="text-xs font-black text-white leading-none mb-1">{user?.name || "Guest User"}</span>
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Student Alpha</span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary to-indigo-500 flex items-center justify-center text-white font-black shadow-lg overflow-hidden border-2 border-white/10">
              {user?.name?.charAt(0) || <User className="w-5 h-5" />}
            </div>
          </button>
          
          <AnimatePresence>
            {showProfileMenu && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute right-0 mt-4 w-48 glass-premium rounded-2xl overflow-hidden z-50 p-2 shadow-2xl"
              >
                <button 
                  onClick={() => { router.push("/profile"); setShowProfileMenu(false); }}
                  className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 text-muted-foreground hover:text-white transition-all text-sm font-bold"
                >
                  <User className="w-4 h-4" />
                  My Profile
                </button>
                <div className="h-px bg-white/10 my-1" />
                  <button 
                    onClick={() => {
                      router.push("/settings");
                      setShowProfileMenu(false);
                    }}
                    className="w-full flex items-center gap-3 p-3 rounded-xl text-muted-foreground hover:bg-white/5 hover:text-white transition-all group"
                  >
                  <Settings className="w-4 h-4" />
                  Settings
                </button>
                <div className="h-px bg-white/10 my-1" />
                <button 
                  onClick={logout}
                  className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-red-500/10 text-red-500 transition-all text-sm font-bold"
                >
                  <LogOut className="w-4 h-4" />
                  Log Out
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}

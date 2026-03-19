"use client";

import { useState } from "react";
import { Bell, Search, Settings, User, LogOut, Shield, Laptop, Monitor, CheckCircle2, Info } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const MOCK_NOTIFICATIONS = [
  { id: 1, title: "Course Completed", message: "Congratulations! You've finished React Mastery.", time: "2h ago", type: "success" },
  { id: 2, title: "New AI Feature", message: "Your Global AI Assistant is now online.", time: "5h ago", type: "info" },
  { id: 3, title: "Certificate Ready", message: "Your Python certificate is ready to download.", time: "1d ago", type: "success" },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  // Hide Navbar on auth pages
  if (pathname.includes("/auth")) return null;

  const getTitle = () => {
    if (pathname === "/") return "Overview Dashboard";
    if (pathname.startsWith("/subjects")) return "Learning Hub";
    if (pathname === "/certificates") return "Achievements";
    if (pathname === "/profile") return "User Profile";
    return "LMS Platform";
  };

  return (
    <header className="h-20 border-b border-white/5 flex items-center justify-between px-8 z-40 bg-background/50 backdrop-blur-md sticky top-0">
      <div className="flex flex-col">
        <h1 className="text-xl font-bold text-white tracking-tight">{getTitle()}</h1>
        <p className="text-xs text-muted-foreground">Welcome back, {user?.name || "Guest"}</p>
      </div>

      <div className="flex items-center gap-6">
        <div className="relative group flex-1 min-w-[300px] hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <input 
            type="text" 
            placeholder="Search for courses, lessons..." 
            className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all font-medium text-white"
          />
        </div>

        <div className="flex items-center gap-2">
          {/* Notifications */}
          <div className="relative">
            <button 
              onClick={() => {
                setShowNotifications(!showNotifications);
                setShowSettings(false);
              }}
              className={cn(
                "p-2.5 rounded-xl transition-all relative",
                showNotifications ? "bg-primary/20 text-primary border border-primary/20" : "hover:bg-white/5 text-muted-foreground hover:text-white"
              )}
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-primary rounded-full border-2 border-background" />
            </button>

            <AnimatePresence>
              {showNotifications && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 mt-3 w-80 glass-card rounded-2xl border-white/10 shadow-2xl p-4 space-y-3 z-50"
                >
                  <div className="flex items-center justify-between pb-2 border-b border-white/5">
                    <h4 className="text-sm font-bold text-white uppercase tracking-tight">Notifications</h4>
                    <span className="text-[10px] font-black text-primary uppercase">Mark all read</span>
                  </div>
                  <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2 scrollbar-hide">
                    {MOCK_NOTIFICATIONS.map(notif => (
                      <div key={notif.id} className="p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors flex gap-3">
                         <div className={cn(
                           "w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0",
                           notif.type === 'success' ? "bg-green-500/20 text-green-400" : "bg-primary/20 text-primary"
                         )}>
                            {notif.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <Info className="w-4 h-4" />}
                         </div>
                         <div className="space-y-0.5">
                            <h5 className="text-[11px] font-bold text-white">{notif.title}</h5>
                            <p className="text-[10px] text-muted-foreground leading-tight">{notif.message}</p>
                            <span className="text-[9px] text-primary font-bold">{notif.time}</span>
                         </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Settings */}
          <div className="relative">
            <button 
              onClick={() => {
                setShowSettings(!showSettings);
                setShowNotifications(false);
              }}
              className={cn(
                "p-2.5 rounded-xl transition-all",
                showSettings ? "bg-primary/20 text-primary border border-primary/20" : "hover:bg-white/5 text-muted-foreground hover:text-white"
              )}
            >
              <Settings className="w-5 h-5" />
            </button>

            <AnimatePresence>
              {showSettings && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 mt-3 w-56 glass-card rounded-2xl border-white/10 shadow-2xl overflow-hidden z-50"
                >
                  <div className="p-2 space-y-1">
                    <button 
                      onClick={() => { router.push("/profile"); setShowSettings(false); }}
                      className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-white/5 text-muted-foreground hover:text-white transition-all text-sm font-medium"
                    >
                      <User className="w-4 h-4" />
                      View Profile
                    </button>
                    <button 
                      onClick={() => { alert("Account security settings coming soon!"); setShowSettings(false); }}
                      className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-white/5 text-muted-foreground hover:text-white transition-all text-sm font-medium"
                    >
                      <Shield className="w-4 h-4" />
                      Security
                    </button>
                    {user?.email?.includes("admin") && (
                      <button 
                        onClick={() => { router.push("/admin"); setShowSettings(false); }}
                        className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-white/5 text-primary transition-all text-sm font-bold"
                      >
                        <Monitor className="w-4 h-4" />
                        Admin Dashboard
                      </button>
                    )}
                    <div className="h-px bg-white/5 my-1" />
                    <button 
                      onClick={() => { logout(); setShowSettings(false); }}
                      className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-red-500/10 text-red-400 transition-all text-sm font-bold"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout Session
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  );
}

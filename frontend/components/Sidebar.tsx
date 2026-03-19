"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  BookOpen, 
  Map, 
  FileText, 
  BarChart3, 
  Users, 
  Wand2, 
  LifeBuoy,
  ChevronRight,
  Monitor,
  Sparkles
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/authStore";
import { motion } from "framer-motion";

const mainMenuItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/" },
  { icon: BookOpen, label: "My Courses", href: "/subjects" },
  { icon: Map, label: "Learning Paths", href: "/learning-paths", badge: "Active" },
  { icon: FileText, label: "Assignments", href: "/assignments" },
  { icon: BarChart3, label: "Analytics", href: "/analytics" },
];

const secondaryMenuItems = [
  { icon: Users, label: "Community", href: "#" },
  { icon: Wand2, label: "AI Tools", href: "/ai-tools" },
  { icon: LifeBuoy, label: "Support", href: "#" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { user } = useAuthStore();
  
  if (pathname.includes("/auth")) return null;

  return (
    <div className="w-72 h-full glass-card border-r border-white/5 flex flex-col p-6 z-50 overflow-y-auto scrollbar-hide">
      {/* Logo */}
      <div className="flex items-center gap-3 px-2 mb-12">
        <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center shadow-2xl shadow-primary/40 group overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-all duration-1000" />
          <Sparkles className="text-white w-7 h-7" />
        </div>
        <div className="flex flex-col">
          <span className="text-2xl font-black tracking-tighter text-white leading-none">Smart<span className="text-primary italic">Learn</span></span>
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] ml-0.5">AI Ecosystem</span>
        </div>
      </div>

      <div className="space-y-8">
        {/* Main Menu */}
        <nav className="space-y-1.5">
          {mainMenuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.label}
                href={item.href}
                className={cn(
                  "group flex items-center justify-between p-3.5 rounded-2xl transition-all duration-300 relative overflow-hidden",
                  isActive 
                    ? "bg-primary/10 text-primary" 
                    : "text-muted-foreground hover:bg-white/5 hover:text-white"
                )}
              >
                {isActive && (
                  <motion.div 
                    layoutId="activeTab"
                    className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-r-full"
                  />
                )}
                <div className="flex items-center gap-4">
                  <item.icon className={cn("w-5 h-5 transition-transform group-hover:scale-110", isActive ? "text-primary" : "text-muted-foreground")} />
                  <span className="font-bold text-sm tracking-tight">{item.label}</span>
                </div>
                {item.badge && (
                  <span className="px-2 py-0.5 rounded-full bg-green-500/10 text-green-400 text-[10px] font-black uppercase tracking-widest border border-green-500/20">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Support & Others */}
        <nav className="space-y-1.5 pt-8 border-t border-white/5">
          {secondaryMenuItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="group flex items-center gap-4 p-3.5 rounded-2xl text-muted-foreground hover:bg-white/5 hover:text-white transition-all duration-300"
            >
              <item.icon className="w-5 h-5 transition-transform group-hover:scale-110" />
              <span className="font-bold text-sm tracking-tight">{item.label}</span>
            </Link>
          ))}
        </nav>
      </div>

      {/* Pro Badge / Banner */}
      <div className="mt-auto pt-10">
        <div className="glass-premium p-6 rounded-[32px] border-primary/20 bg-primary/5 relative overflow-hidden group">
          <div className="absolute -top-4 -right-4 w-16 h-16 bg-primary/20 blur-3xl rounded-full group-hover:bg-primary/40 transition-all duration-700" />
          <h4 className="text-white font-black text-sm mb-1 uppercase tracking-tight">Upgrade to Pro</h4>
          <p className="text-[10px] text-muted-foreground mb-4 font-medium uppercase tracking-widest">Get Unlimited AI Credits</p>
          <button className="w-full py-2.5 bg-primary text-white text-xs font-black rounded-xl hover:scale-105 active:scale-95 transition-all shadow-xl shadow-primary/20 uppercase tracking-widest">
            Level Up Now
          </button>
        </div>
      </div>
    </div>
  );
}

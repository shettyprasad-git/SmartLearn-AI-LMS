"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Home, 
  BookOpen, 
  User, 
  Award, 
  LogOut, 
  ShieldCheck,
  ChevronRight,
  Monitor
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/authStore";
import { motion } from "framer-motion";

const menuItems = [
  { icon: Home, label: "Home", href: "/" },
  { icon: BookOpen, label: "Explore Courses", href: "/subjects" },
  { icon: Award, label: "Certificates", href: "/certificates" },
  { icon: User, label: "My Profile", href: "/profile" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuthStore();
  
  // Hide sidebar on auth pages
  if (pathname.includes("/auth")) return null;

  return (
    <div className="w-64 h-full glass border-r border-white/5 flex flex-col p-4 z-50">
      <div className="flex items-center gap-3 px-2 mb-10">
        <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/25">
          <Monitor className="text-white w-6 h-6" />
        </div>
        <span className="text-xl font-bold tracking-tight text-white">Smart<span className="text-primary italic">Learn</span></span>
      </div>

      <nav className="flex-1 space-y-2">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group flex items-center justify-between p-3 rounded-xl transition-all duration-300",
                isActive 
                  ? "bg-primary/10 text-primary border border-primary/20" 
                  : "text-muted-foreground hover:bg-white/5 hover:text-white"
              )}
            >
              <div className="flex items-center gap-3">
                <item.icon className={cn("w-5 h-5", isActive ? "text-primary" : "text-muted-foreground")} />
                <span className="font-medium">{item.label}</span>
              </div>
              {isActive && (
                <motion.div layoutId="activeInd" className="w-1.5 h-1.5 rounded-full bg-primary" />
              )}
            </Link>
          );
        })}

        {user?.email?.includes("admin") && (
          <Link
            href="/admin"
            className={cn(
              "group flex items-center gap-3 p-3 rounded-xl transition-all duration-300",
              pathname.includes("/admin") 
                ? "bg-primary/10 text-primary border border-primary/20" 
                : "text-muted-foreground hover:bg-white/5 hover:text-white"
            )}
          >
            <ShieldCheck className="w-5 h-5" />
            <span className="font-medium">Admin Panel</span>
          </Link>
        )}
      </nav>

      <div className="mt-auto space-y-4 pt-4 border-t border-white/5">
        {user ? (
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3 px-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary to-purple-500 flex items-center justify-center text-white text-xs font-bold">
                {user.name.charAt(0)}
              </div>
              <div className="flex flex-col overflow-hidden">
                <span className="text-sm font-semibold truncate text-white">{user.name}</span>
                <span className="text-[10px] text-muted-foreground truncate">{user.email}</span>
              </div>
            </div>
            <button
              onClick={logout}
              className="flex items-center gap-3 p-3 rounded-xl text-red-400 hover:bg-red-400/10 transition-all duration-300"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        ) : (
          <Link
            href="/auth/login"
            className="flex items-center gap-3 p-3 rounded-xl bg-primary text-white font-semibold justify-center hover:opacity-90 transition-all"
          >
            Login / Join
          </Link>
        )}
      </div>
    </div>
  );
}

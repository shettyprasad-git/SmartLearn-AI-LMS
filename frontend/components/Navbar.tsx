"use client";

import { Bell, Search, Settings } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();
  const { user } = useAuthStore();

  // Hide Navbar on auth pages
  if (pathname.includes("/auth")) return null;

  // Derive title from pathname
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
            className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all"
          />
        </div>

        <div className="flex items-center gap-2">
          <button className="p-2.5 rounded-xl hover:bg-white/5 text-muted-foreground hover:text-white transition-all relative">
            <Bell className="w-5 h-5" />
            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-primary rounded-full border-2 border-background" />
          </button>
          <button className="p-2.5 rounded-xl hover:bg-white/5 text-muted-foreground hover:text-white transition-all">
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
}

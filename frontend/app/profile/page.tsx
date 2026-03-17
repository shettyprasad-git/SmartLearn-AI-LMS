"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/authStore";
import apiClient from "@/lib/apiClient";
import { 
  User, 
  Mail, 
  Settings, 
  Shield, 
  LogOut, 
  CheckCircle2, 
  Clock, 
  BookOpen,
  Edit2
} from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export default function ProfilePage() {
  const { user, logout } = useAuthStore();
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      apiClient.get("/analytics/me")
        .then(res => setAnalytics(res.data))
        .catch(err => console.error(err))
        .finally(() => setLoading(false));
    }
  }, [user]);

  if (!user) return <div className="p-10 text-white">Please login to view profile.</div>;

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-10 space-y-10">
      <div className="flex flex-col md:flex-row items-center gap-10">
        <div className="relative group">
          <div className="w-32 h-32 md:w-40 md:h-40 rounded-[48px] bg-gradient-to-tr from-primary to-purple-600 flex items-center justify-center text-5xl font-black text-white shadow-2xl shadow-primary/30 relative z-10">
            {user.name.charAt(0)}
          </div>
          <div className="absolute inset-0 bg-primary blur-3xl opacity-20 group-hover:opacity-40 transition-opacity" />
          <button className="absolute bottom-2 right-2 p-3 bg-white text-black rounded-2xl shadow-xl hover:scale-110 active:scale-95 transition-all z-20">
            <Edit2 className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 text-center md:text-left space-y-4">
          <div className="space-y-1">
             <h1 className="text-4xl font-black text-white">{user.name}</h1>
             <p className="text-muted-foreground flex items-center justify-center md:justify-start gap-2">
                <Mail className="w-4 h-4" /> {user.email}
             </p>
          </div>
          <div className="flex items-center justify-center md:justify-start gap-3">
             <span className="bg-primary/20 text-primary px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-primary/20">Student</span>
             <span className="bg-white/5 text-muted-foreground px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-white/5">Joined 2026</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
           <button className="p-4 glass rounded-2xl text-muted-foreground hover:text-white transition-all">
              <Settings className="w-6 h-6" />
           </button>
           <button 
             onClick={logout}
             className="px-8 py-4 bg-red-500/10 text-red-500 border border-red-500/20 rounded-2xl font-bold hover:bg-red-500 hover:text-white transition-all"
           >
              Logout
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: "Courses Enrolled", value: analytics?.enrolledCount || 0, icon: BookOpen, color: "text-blue-400" },
          { label: "Learning Hours", value: analytics?.learningHours || 0, icon: Clock, color: "text-purple-400" },
          { label: "Certificates Earned", value: analytics?.completedCount || 0, icon: Shield, color: "text-yellow-400" },
        ].map((stat, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className="glass-card p-8 rounded-[40px] border-white/5 space-y-4"
          >
            <div className={cn("w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center", stat.color)}>
              <stat.icon className="w-7 h-7" />
            </div>
            <div className="space-y-1">
               <h3 className="text-3xl font-black text-white">{stat.value}</h3>
               <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{stat.label}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <section className="space-y-6">
         <h2 className="text-2xl font-black text-white px-2 border-l-4 border-primary">Learning Progress</h2>
         <div className="glass-card rounded-[40px] border-white/5 overflow-hidden">
            <div className="p-8 space-y-8">
               {loading ? (
                 [1, 2].map(i => <div key={i} className="h-20 bg-white/5 rounded-2xl animate-pulse" />)
               ) : analytics?.recentProgress?.length > 0 ? (
                 analytics.recentProgress.map((p: any, i: number) => (
                   <div key={i} className="flex items-center justify-between gap-6">
                      <div className="flex items-center gap-4 flex-1">
                         <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-primary">
                            <BookOpen className="w-6 h-6" />
                         </div>
                         <div className="flex flex-col">
                            <span className="font-bold text-white mb-1">{p.videoTitle}</span>
                            <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden min-w-[200px]">
                               <motion.div initial={{ width: 0 }} animate={{ width: "100%" }} className="bg-primary h-full" />
                            </div>
                         </div>
                      </div>
                      <div className="flex flex-col items-end">
                         <span className="text-[10px] font-black text-primary uppercase mb-1">Completed</span>
                         <span className="text-xs text-muted-foreground">{new Date(p.completedAt).toLocaleDateString()}</span>
                      </div>
                   </div>
                 ))
               ) : (
                 <div className="text-center py-20 text-muted-foreground">
                    Enroll in courses to track your progress here.
                 </div>
               )}
            </div>
         </div>
      </section>
    </div>
  );
}

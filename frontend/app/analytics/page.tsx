"use client";

import { useEffect, useState } from "react";
import { 
  BarChart3, 
  TrendingUp, 
  Clock, 
  BookOpen, 
  CheckCircle2, 
  Award, 
  Zap, 
  ArrowUpRight, 
  Target, 
  Calendar,
  Loader2,
  PieChart,
  Flame,
  Star
} from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import apiClient from "@/lib/apiClient";

export default function AnalyticsPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = async () => {
    try {
      const res = await apiClient.get("/analytics/me");
      setData(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center space-y-6">
         <Loader2 className="w-12 h-12 text-primary animate-spin" />
         <p className="text-xs font-black text-primary uppercase tracking-[0.4em]">Calibrating Neural Metrics...</p>
      </div>
    );
  }

  return (
    <div className="p-8 md:p-12 space-y-12 max-w-7xl mx-auto pb-32">
       {/* Hero Header */}
       <div className="space-y-6">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-[0.3em] w-fit"
          >
            <BarChart3 className="w-4 h-4" />
            Learning Intelligence
          </motion.div>
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
             <div className="space-y-4">
               <h1 className="text-5xl md:text-8xl font-black text-white tracking-tighter leading-none italic uppercase">
                  Growth <span className="text-gradient">Analytics.</span>
               </h1>
               <p className="text-muted-foreground max-w-xl font-medium tracking-tight text-lg leading-relaxed">
                  Quantitative insights into your neural evolution. Track your velocity, mastery levels, and curriculum coverage in real-time.
               </p>
             </div>
             
             <div className="flex gap-4">
                <button className="px-8 py-4 bg-white text-black text-[10px] font-black uppercase tracking-widest rounded-3xl shadow-xl shadow-white/5 hover:scale-105 active:scale-95 transition-all">Export JSON</button>
             </div>
          </div>
       </div>

       {/* Core KPI Grid */}
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { label: "Global Progress", value: `${data.globalProgress}%`, icon: <Target />, color: "text-primary", bg: "bg-primary/10" },
            { label: "Learning Hours", value: data.learningHours, icon: <Clock />, color: "text-blue-400", bg: "bg-blue-400/10" },
            { label: "Courses Enrolled", value: data.enrolledCount, icon: <BookOpen />, color: "text-purple-400", bg: "bg-purple-400/10" },
            { label: "Milestones", value: data.completedCount, icon: <Award />, color: "text-emerald-400", bg: "bg-emerald-400/10" }
          ].map((stat, i) => (
             <motion.div
               key={i}
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: i * 0.1 }}
               className="glass-premium p-8 rounded-[40px] border-white/5 space-y-4 relative overflow-hidden group"
             >
                <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform", stat.bg, stat.color)}>
                   {stat.icon as any}
                </div>
                <div>
                   <span className="text-4xl font-black text-white italic tracking-tighter">{stat.value}</span>
                   <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mt-1">{stat.label}</p>
                </div>
                <div className="absolute top-8 right-8 text-white/5">
                   <Zap className="w-16 h-16" />
                </div>
             </motion.div>
          ))}
       </div>

       {/* Secondary Analytics */}
       <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Active Courses Progress */}
          <div className="lg:col-span-2 glass-premium p-10 rounded-[56px] border-white/5 space-y-10">
             <div className="flex items-center justify-between">
                <div>
                   <h3 className="text-xl font-black text-white uppercase tracking-tighter italic">Active Curriculums</h3>
                   <p className="text-xs text-muted-foreground font-medium uppercase mt-1">Live coverage tracking</p>
                </div>
                <button className="p-3 glass rounded-xl text-muted-foreground hover:text-white transition-all">
                   <Calendar className="w-4 h-4" />
                </button>
             </div>

             <div className="space-y-8">
                {data.activeCourses.map((course: any, i: number) => (
                   <div key={i} className="space-y-3">
                      <div className="flex justify-between items-end px-2">
                         <span className="text-xs font-black text-white uppercase tracking-tight">{course.title}</span>
                         <span className="text-[10px] font-black text-primary uppercase">{course.progressPercentage}% Complete</span>
                      </div>
                      <div className="h-3 w-full bg-white/5 rounded-full overflow-hidden border border-white/5 p-0.5">
                         <motion.div 
                           initial={{ width: 0 }}
                           animate={{ width: `${course.progressPercentage}%` }}
                           transition={{ duration: 1, delay: i * 0.1 }}
                           className="h-full bg-gradient-to-r from-primary to-indigo-600 rounded-full relative"
                         >
                            <div className="absolute inset-0 bg-white/20 animate-pulse" />
                         </motion.div>
                      </div>
                   </div>
                ))}
             </div>
          </div>

          {/* User Streak & Engagement */}
          <div className="glass-premium p-10 rounded-[56px] border-white/5 flex flex-col justify-between relative overflow-hidden">
             <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-[100px] pointer-events-none" />
             <div className="space-y-2">
                <Flame className="w-10 h-10 text-orange-400 mb-6" />
                <h3 className="text-xl font-black text-white uppercase tracking-tighter italic">Learning Streak</h3>
                <p className="text-xs text-muted-foreground font-medium uppercase">Stay consistent to maintain momentum</p>
             </div>

             <div className="py-12 flex flex-col items-center">
                <div className="relative">
                   <div className="w-32 h-32 rounded-full border-4 border-white/5 flex items-center justify-center">
                      <span className="text-5xl font-black text-white italic tracking-tighter">7</span>
                   </div>
                   <div className="absolute -bottom-2 -right-2 w-12 h-12 rounded-2xl bg-orange-400 flex items-center justify-center text-white shadow-xl shadow-orange-400/20 rotate-12">
                      <Star className="w-6 h-6 fill-current" />
                   </div>
                </div>
                <p className="mt-8 text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em]">Days Uninterrupted</p>
             </div>

             <button className="w-full py-5 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all">
                Daily Mission Log
             </button>
          </div>

       </div>

       {/* Recent Activity Mini-Feed */}
       <div className="space-y-8">
          <div className="flex items-center gap-4">
             <div className="h-px bg-white/5 flex-1" />
             <span className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.5em] whitespace-nowrap">Recent Neural Commits</span>
             <div className="h-px bg-white/5 flex-1" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
             {data.recentProgress.map((item: any, i: number) => (
                <div key={i} className="glass-card p-6 rounded-3xl border-white/5 flex items-center gap-6 group hover:translate-x-2 transition-transform">
                   <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                      <CheckCircle2 className="w-6 h-6" />
                   </div>
                   <div className="space-y-1">
                      <h4 className="text-xs font-black text-white uppercase tracking-tight line-clamp-1">{item.videoTitle}</h4>
                      <p className="text-[8px] font-black text-muted-foreground uppercase tracking-widest">{new Date(item.completedAt).toLocaleDateString()}</p>
                   </div>
                </div>
             ))}
             {data.recentProgress.length === 0 && (
                <div className="col-span-full py-12 text-center glass-card rounded-[32px] border-white/5 p-6">
                   <p className="text-xs font-black text-muted-foreground uppercase tracking-[0.3em]">No recent activity recorded.</p>
                </div>
             )}
          </div>
       </div>
    </div>
  );
}

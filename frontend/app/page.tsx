"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { 
  Play, 
  BookOpen, 
  Trophy, 
  ArrowRight, 
  Zap, 
  Search, 
  LayoutDashboard, 
  CheckCircle2, 
  Sparkles,
  Command,
  TrendingUp,
  BrainCircuit
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import apiClient from "@/lib/apiClient";
import { cn } from "@/lib/utils";

export default function Home() {
  const { user, isAuthenticated } = useAuthStore();
  const [analytics, setAnalytics] = useState<any>(null);
  const [recommendations, setRecommendations] = useState<any[]>([]);

  useEffect(() => {
    if (isAuthenticated) {
      apiClient.get("/analytics/me").then(res => setAnalytics(res.data));
      apiClient.get("/recommendations").then(res => setRecommendations(res.data));
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-96px)] px-4 bg-mesh">
        <div className="max-w-4xl text-center space-y-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border-primary/20 text-primary text-xs font-black uppercase tracking-widest animate-glow"
          >
             <Sparkles className="w-4 h-4" />
             AI-Powered Mastery Platform
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h1 className="text-6xl md:text-8xl font-black text-white tracking-tighter leading-none mb-6">
              Learn Anything <br />
              <span className="text-gradient">Evolve Everywhere.</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-medium leading-relaxed">
              The world's first adaptive LMS powered by YouTube and Advanced AI. Build custom roads to mastery in minutes.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex items-center justify-center gap-6"
          >
            <Link 
              href="/auth/register" 
              className="px-10 py-5 bg-primary text-white rounded-[32px] font-black text-xl hover:shadow-[0_0_40px_rgba(168,85,247,0.4)] active:scale-95 transition-all flex items-center gap-3 uppercase tracking-tighter"
            >
              Start Free Journey <ArrowRight className="w-6 h-6" />
            </Link>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-10 space-y-12 max-w-[1600px] mx-auto">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-2"
        >
          <h1 className="text-5xl font-black text-white tracking-tighter">
            Welcome Back, <span className="text-primary italic">{user?.name?.split(' ')[0] || "Scholar"}!</span>
          </h1>
          <p className="text-muted-foreground font-medium tracking-tight">Personalized greetings, thank you for choosing SmartLearn!</p>
        </motion.div>
        
        <button className="flex items-center gap-3 px-8 py-4 glass-premium rounded-2xl text-white font-bold hover:bg-white/5 transition-all active:scale-95">
           <Command className="w-5 h-5 text-primary" />
           <span>Key Dashboard</span>
        </button>
      </div>

      {/* Grid Layout - 2 Main Columns */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
        
        {/* LEFT COLUMN - Progress & Insights */}
        <div className="xl:col-span-8 space-y-10">
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Learning Progress Widget */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card p-10 rounded-[48px] bg-gradient-to-br from-white/5 to-transparent flex flex-col items-center justify-center relative overflow-hidden"
            >
               <div className="absolute top-8 left-8">
                  <h3 className="text-lg font-black text-white tracking-tight">My Learning Progress</h3>
               </div>
               
               {/* Custom SVG Circular Progress */}
               <div className="relative w-48 h-48 mt-10">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle cx="96" cy="96" r="80" fill="transparent" stroke="rgba(255,255,255,0.05)" strokeWidth="16" />
                    <circle 
                      cx="96" 
                      cy="96" 
                      r="80" 
                      fill="transparent" 
                      stroke="url(#gradient)" 
                      strokeWidth="16" 
                      strokeDasharray={502.4} 
                      strokeDashoffset={502.4 * (1 - (analytics?.globalProgress || 0) / 100)} 
                      strokeLinecap="round" 
                      className="transition-all duration-1000" 
                    />
                    <defs>
                      <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#a855f7" />
                        <stop offset="100%" stopColor="#6366f1" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                     <span className="text-5xl font-black text-white leading-none">{analytics?.globalProgress || 0}%</span>
                     <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mt-2">Complete</span>
                  </div>
               </div>

               {/* Wavy Activity Chart Mockup - Still partially mock but can use analytics.videosWatched to scale */}
               <div className="mt-12 w-full flex items-end justify-between h-20 gap-2">
                  {[40, 70, 45, 90, 65, 80, 50, 85].map((h, i) => (
                    <div 
                      key={i} 
                      className="flex-1 bg-primary/20 rounded-t-lg relative group transition-all"
                      style={{ height: `${Math.min(100, (analytics?.videosWatched || 1) * h / 5)}%` }}
                    >
                       <div className="absolute inset-0 bg-primary opacity-20 group-hover:opacity-100 transition-opacity rounded-t-lg" />
                    </div>
                  ))}
               </div>
            </motion.div>

            {/* Active Courses Widget */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="glass-card p-10 rounded-[48px] space-y-8"
            >
               <div className="flex items-center justify-between">
                  <h3 className="text-lg font-black text-white tracking-tight">Active Courses</h3>
                  <div className="px-3 py-1.5 glass rounded-xl text-[10px] font-black text-white uppercase tracking-widest border-white/5">
                     Latest ↓
                  </div>
               </div>

               <div className="space-y-6">
                   {analytics?.activeCourses?.length > 0 ? analytics.activeCourses.map((course: any, i: number) => (
                    <Link key={course.id} href={`/dashboard/courses/${course.id}`} className="block space-y-3 group/course p-2 rounded-2xl hover:bg-white/5 transition-all">
                       <div className="flex items-center justify-between">
                          <span className="text-sm font-bold text-white tracking-tight group-hover/course:text-primary transition-colors">{course.title}</span>
                          <span className="text-xs font-black text-muted-foreground">{course.progressPercentage}%</span>
                       </div>
                       <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${course.progressPercentage}%` }}
                            transition={{ duration: 1, delay: i * 0.2 }}
                            className={cn("h-full rounded-full shadow-[0_0_15px_rgba(0,0,0,0.5)]", i % 3 === 0 ? "bg-purple-500" : i % 3 === 1 ? "bg-blue-500" : "bg-pink-500")} 
                          />
                       </div>
                    </Link>
                  )) : (
                    <div className="py-10 text-center">
                       <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest">No Active Enrollments</p>
                    </div>
                  )}
               </div>
            </motion.div>
          </div>

          {/* AI Insights Section */}
          <section className="space-y-6">
            <div className="flex items-center gap-3">
               <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center text-primary">
                  <BrainCircuit className="w-6 h-6" />
               </div>
               <h2 className="text-2xl font-black text-white tracking-tight">AI Insights & Recommendations</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               {[
                 { title: "Advanced Neural Networks", desc: "Based on your interest in ML, this deep dive into neural architectures is your next big move.", tag: "Recommended Course" },
                 { title: "Data Science Masterclass", desc: "A structured path covering data cleansing, analysis, and visualization for modern markets.", tag: "Learning Path" }
               ].map((insight, i) => (
                 <motion.div 
                   key={i} 
                   whileHover={{ y: -5 }}
                   className="glass-premium p-8 rounded-[40px] border-white/5 bg-gradient-to-tr from-primary/5 to-transparent relative group"
                 >
                    <div className="px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-widest w-fit mb-6">
                       {insight.tag}
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3 tracking-tight group-hover:text-primary transition-colors">{insight.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-8">{insight.desc}</p>
                    <button className="px-6 py-2.5 glass rounded-xl text-white text-xs font-black uppercase tracking-widest hover:bg-primary transition-all active:scale-95">
                       Learn more
                    </button>
                 </motion.div>
               ))}
            </div>
          </section>
        </div>

        {/* RIGHT COLUMN - Activity & Actions */}
        <div className="xl:col-span-4 space-y-10">
          
          <section className="glass-premium p-10 rounded-[48px] space-y-8 relative overflow-hidden group">
             <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/10 blur-[80px] rounded-full group-hover:bg-primary/20 transition-all duration-1000" />
             
             <h3 className="text-xl font-black text-white tracking-tight">Recent Activity</h3>
             
             <div className="space-y-6 relative z-10">
                {[
                  { title: "Completed Lesson 1", sub: "Python for Data Science", type: "check" },
                  { title: "New Badge Earned", sub: "React Mastery Fundamentals", type: "medal" },
                  { title: "Quiz Score: 95%", sub: "Machine Learning L2", type: "score" }
                ].map((act, i) => (
                  <motion.div 
                    key={i} 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-center gap-5 p-4 rounded-3xl hover:bg-white/5 transition-all group/item"
                  >
                     <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-primary group-hover/item:scale-110 transition-transform">
                        {act.type === 'check' ? <CheckCircle2 className="w-6 h-6" /> : <Trophy className="w-6 h-6" />}
                     </div>
                     <div className="flex flex-col">
                        <span className="text-sm font-bold text-white tracking-tight leading-none mb-1">{act.title}</span>
                        <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-widest">{act.sub}</span>
                     </div>
                  </motion.div>
                ))}
             </div>
             
             <button className="w-full py-4 bg-white/5 hover:bg-white/10 text-muted-foreground hover:text-white rounded-2xl text-xs font-black uppercase tracking-widest transition-all">
                Full Activity Feed
             </button>
          </section>

          {/* Quick AI Action Card */}
          <div className="glass-premium p-10 rounded-[48px] bg-primary shadow-2xl shadow-primary/20 relative overflow-hidden group">
             <Sparkles className="absolute -right-6 -top-6 w-32 h-32 text-white/10 rotate-12 group-hover:rotate-[30deg] transition-all duration-700" />
             <div className="relative z-10 space-y-6">
                <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center text-white backdrop-blur-xl">
                   <TrendingUp className="w-8 h-8" />
                </div>
                <div className="space-y-2">
                   <h3 className="text-2xl font-black text-white leading-tight">Elevate Your Growth.</h3>
                   <p className="text-sm text-white/70 font-medium">Unlocked unlimited roadmap generations and expert mentor sessions.</p>
                </div>
                <button className="w-full py-4 bg-white text-black font-black rounded-2xl shadow-2xl shadow-black/20 hover:scale-[1.05] active:scale-95 transition-all uppercase tracking-widest text-xs">
                   Get Pro Access
                </button>
             </div>
          </div>

        </div>

      </div>
    </div>
  );
}

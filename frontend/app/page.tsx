"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { Play, BookOpen, Clock, Trophy, ArrowRight, Zap } from "lucide-react";
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
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] px-4">
        <div className="max-w-4xl text-center space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-6xl md:text-8xl font-black text-white tracking-tighter leading-tight">
              Master Any Skill <br />
              With <span className="text-gradient">SmartLearn</span>
            </h1>
            <p className="mt-6 text-xl text-muted-foreground max-w-2xl mx-auto">
              The world's first YouTube-powered LMS with AI Tutoring, automated quizzes, and structured learning paths.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="flex items-center justify-center gap-4"
          >
            <Link 
              href="/auth/register" 
              className="px-8 py-4 bg-primary text-white rounded-2xl font-bold text-lg hover:shadow-2xl hover:shadow-primary/30 active:scale-95 transition-all flex items-center gap-2"
            >
              Start Learning Now <ArrowRight className="w-5 h-5" />
            </Link>
            <Link 
              href="/subjects" 
              className="px-8 py-4 glass text-white rounded-2xl font-bold text-lg hover:bg-white/10 active:scale-95 transition-all"
            >
              Explore Courses
            </Link>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20">
            {[
              { icon: Play, title: "YouTube Powered", desc: "Access the best educational content from across the globe." },
              { icon: Zap, title: "AI Tutoring", desc: "Get instant answers and summaries for every lesson." },
              { icon: Trophy, title: "Certified", desc: "Earn certificates of completion for every subject." },
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.1 }}
                className="glass-card p-6 rounded-3xl text-left border-white/5 active:border-primary/50 transition-colors"
              >
                <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mb-4">
                  <feature.icon className="text-primary w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-10">
      {/* Stats Section */}
      <section className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { icon: BookOpen, label: "Courses Enrolled", value: analytics?.enrolledCount || 0, color: "text-blue-400" },
          { icon: Trophy, label: "Courses Completed", value: analytics?.completedCount || 0, color: "text-yellow-400" },
          { icon: Play, label: "Videos Watched", value: analytics?.videosWatched || 0, color: "text-purple-400" },
          { icon: Clock, label: "Learning Hours", value: `${analytics?.learningHours || 0}h`, color: "text-green-400" },
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass-card p-6 rounded-3xl flex items-center gap-5 border-white/5"
          >
            <div className={cn("w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center", stat.color)}>
              <stat.icon className="w-7 h-7" />
            </div>
            <div className="flex flex-col">
              <span className="text-3xl font-black text-white">{stat.value}</span>
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{stat.label}</span>
            </div>
          </motion.div>
        ))}
      </section>

      {/* Main Content Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-10">
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-black text-white px-2 border-l-4 border-primary">Continue Learning</h2>
              <Link href="/subjects" className="text-sm font-semibold text-primary hover:underline flex items-center gap-1">
                View All <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            {/* If enrolled courses existed we'd map them here */}
            <div className="glass-card rounded-[40px] p-10 flex flex-col items-center justify-center text-center space-y-4 border-dashed border-2 border-white/10 h-64">
              <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-2">
                <BookOpen className="text-muted-foreground w-8 h-8" />
              </div>
              <p className="text-muted-foreground font-medium">No courses in progress. <br /> Start your journey today!</p>
              <Link href="/subjects" className="px-6 py-2.5 bg-white text-black rounded-xl font-bold hover:scale-105 transition-transform">Explore Catalog</Link>
            </div>
          </section>

          <section>
             <h2 className="text-2xl font-black text-white mb-6 px-2 border-l-4 border-primary">Recommended for You</h2>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {recommendations.length > 0 ? recommendations.map((subject, i) => (
                  <Link key={subject.id} href={`/subjects/${subject.id}`}>
                    <div className="glass-card rounded-3xl overflow-hidden group hover:border-primary/20 transition-all border-white/5">
                       <div className="aspect-video bg-white/5 relative">
                          <img src={`https://img.youtube.com/vi/${subject.slug}/0.jpg`} alt="" className="w-full h-full object-cover opacity-50 group-hover:scale-110 transition-transform duration-500" />
                          <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
                          <div className="absolute bottom-4 left-4">
                             <h3 className="text-lg font-bold text-white group-hover:text-primary transition-colors">{subject.title}</h3>
                          </div>
                       </div>
                    </div>
                  </Link>
                )) : (
                  [1,2].map(i => <div key={i} className="glass-card rounded-3xl aspect-video animate-pulse bg-white/5" />)
                )}
             </div>
          </section>
        </div>

        <div className="space-y-10">
           <section className="glass-card p-6 rounded-3xl border-primary/20 bg-primary/5 relative overflow-hidden group">
              <Zap className="absolute -right-4 -top-4 w-24 h-24 text-primary/10 group-hover:scale-110 transition-transform duration-700" />
              <div className="relative z-10 space-y-4">
                <h3 className="text-xl font-black text-white">Upgrade Your Learning</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">Unlock advanced AI features, priority support, and exclusive content with SmartLearn Pro.</p>
                <button className="w-full py-3 bg-primary text-white font-bold rounded-2xl shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all">Go Premium</button>
              </div>
           </section>

           <section>
              <h2 className="text-lg font-black text-white mb-4">Latest Achievements</h2>
              <div className="space-y-4">
                {analytics?.recentProgress?.length > 0 ? analytics.recentProgress.map((p: any, i: number) => (
                   <div key={i} className="flex items-center gap-4 p-4 glass rounded-2xl border-white/5">
                      <div className="w-10 h-10 rounded-xl bg-yellow-400/10 flex items-center justify-center text-yellow-400">
                         <Trophy className="w-5 h-5" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-white truncate max-w-[150px]">{p.videoTitle}</span>
                        <span className="text-[10px] text-muted-foreground uppercase">{new Date(p.completedAt).toLocaleDateString()}</span>
                      </div>
                   </div>
                )) : (
                  <p className="text-xs text-muted-foreground text-center py-10 bg-white/5 rounded-3xl border border-dashed border-white/5">Complete lessons to earn rewards!</p>
                )}
              </div>
           </section>
        </div>
      </div>
    </div>
  );
}

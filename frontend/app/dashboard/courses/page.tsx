"use client";

import { useEffect, useState } from "react";
import { 
  BookOpen, 
  Play, 
  Clock, 
  ChevronRight, 
  Trophy,
  Search,
  BookMarked
} from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import apiClient from "@/lib/apiClient";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/authStore";

export default function MyCoursesPage() {
  const { user, isAuthenticated } = useAuthStore();
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (isAuthenticated) {
      fetchMyCourses();
    }
  }, [isAuthenticated]);

  const fetchMyCourses = async () => {
    try {
      const res = await apiClient.get("/enrollments/me");
      setCourses(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredCourses = courses.filter(c => 
    c.subject.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="p-10 space-y-8 animate-pulse">
        <div className="h-20 bg-white/5 rounded-3xl w-1/3" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
           {[1, 2, 3].map(i => <div key={i} className="h-80 bg-white/5 rounded-[40px]" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 md:p-12 space-y-12 max-w-7xl mx-auto pb-32">
      {/* Header */}
      <div className="space-y-6">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-[0.3em] w-fit"
        >
          <BookMarked className="w-4 h-4" />
          My Learning Vault
        </motion.div>
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="space-y-4">
            <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter italic uppercase">
              My <span className="text-gradient">Courses.</span>
            </h1>
            <p className="text-muted-foreground font-medium tracking-tight text-lg max-w-xl">
              Manage your active curriculums and continue your journey towards mastery.
            </p>
          </div>

          <div className="relative group max-w-xs w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <input 
              type="text"
              placeholder="Search your vault..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm text-white focus:outline-none focus:border-primary/50 transition-all"
            />
          </div>
        </div>
      </div>

      {filteredCourses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCourses.map((enrollment, i) => (
            <motion.div
              key={enrollment.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="glass-premium rounded-[40px] border-white/5 overflow-hidden group hover:scale-[1.02] transition-all duration-500"
            >
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={enrollment.subject.thumbnail_url || `https://img.youtube.com/vi/${enrollment.subject.youtube_id}/maxresdefault.jpg`}
                  alt={enrollment.subject.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center text-white">
                   <span className="text-[10px] font-black uppercase tracking-widest bg-primary/20 backdrop-blur-md px-2 py-1 rounded-lg border border-primary/30">
                     {enrollment.subject.category || "General"}
                   </span>
                   <div className="flex items-center gap-1.5 glass px-2 py-1 rounded-lg text-[10px] font-black border-white/10">
                      <Trophy className="w-3 h-3 text-yellow-400" />
                      {enrollment.subject.difficulty || "All Levels"}
                   </div>
                </div>
              </div>

              <div className="p-8 space-y-6">
                <div className="space-y-2">
                  <h3 className="text-xl font-black text-white leading-tight group-hover:text-primary transition-colors">{enrollment.subject.title}</h3>
                  <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">{enrollment.subject.description}</p>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                    <span>Progress</span>
                    <span className="text-primary">{enrollment.progress_percentage || 0}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${enrollment.progress_percentage || 0}%` }}
                      className="h-full bg-primary"
                    />
                  </div>
                </div>

                <Link 
                  href={`/subjects/${enrollment.subject.id}`}
                  className="w-full py-4 bg-white text-black rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-primary hover:text-white transition-all active:scale-95 shadow-xl shadow-black/20"
                >
                   Continue Learning <Play className="w-4 h-4 fill-current" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="py-20 text-center glass-card rounded-[48px] border-white/5 flex flex-col items-center gap-6">
           <div className="w-20 h-20 rounded-[32px] bg-white/5 flex items-center justify-center text-muted-foreground">
              <BookOpen className="w-10 h-10" />
           </div>
           <div className="space-y-2">
              <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter">Your vault is empty</h3>
              <p className="text-muted-foreground font-medium">Start exploring our catalog to begin your evolution.</p>
           </div>
           <Link href="/subjects" className="px-10 py-4 bg-primary text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:shadow-2xl shadow-primary/20 transition-all">
              Discover Courses
           </Link>
        </div>
      )}
    </div>
  );
}

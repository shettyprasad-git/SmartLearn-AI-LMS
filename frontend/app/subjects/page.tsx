"use client";

import { useEffect, useState } from "react";
import apiClient from "@/lib/apiClient";
import Link from "next/link";
import { BookOpen, Search, ArrowRight, Play, Star, Users, Filter, LayoutGrid, Sparkles, Loader2, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const CATEGORIES = ["All", "Programming", "Artificial Intelligence", "Cloud Computing", "Design", "Cybersecurity", "Mobile Dev", "Data Science"];

export default function SubjectsPage() {
  const [subjects, setSubjects] = useState<any[]>([]);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSubjects();
    fetchRecommendations();
  }, [selectedCategory, searchTerm]);

  const fetchSubjects = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiClient.get("/subjects", {
        params: {
          category: selectedCategory,
          search: searchTerm
        }
      });
      setSubjects(res.data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to fetch courses. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  const fetchRecommendations = async () => {
    try {
      const res = await apiClient.get("/subjects/recommendations");
      setRecommendations(res.data);
    } catch (err) {
      // Might not be logged in or endpoint fails, ignore silently
    }
  };

  return (
    <div className="p-4 md:p-10 space-y-12 max-w-7xl mx-auto">
      {/* Search & Intro */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-10">
        <div className="space-y-3">
          <div className="flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-full w-fit">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-[10px] font-black text-primary uppercase tracking-widest">New Content Weekly</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white px-2 border-l-8 border-primary tracking-tight leading-none">EXPLORE CATALOG</h1>
          <p className="text-muted-foreground ml-2">Master any skill with structured learning paths from the world's best creators.</p>
        </div>

        <div className="relative w-full lg:w-96 group">
          <div className="absolute inset-0 bg-primary/20 blur-2xl group-hover:bg-primary/30 transition-all -z-10" />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5 group-focus-within:text-primary transition-colors" />
          <input 
            type="text" 
            placeholder="Search for courses, lessons..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-primary/50 transition-all font-medium"
          />
        </div>
      </div>

      {/* Categories */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 scrollbar-hide">
        <div className="flex items-center justify-center p-3 rounded-2xl bg-white/5 border border-white/10 text-muted-foreground mr-2">
           <Filter className="w-5 h-5" />
        </div>
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={cn(
              "px-6 py-3 rounded-2xl text-sm font-bold whitespace-nowrap transition-all border",
              selectedCategory === cat 
                ? "bg-primary text-white border-primary shadow-xl shadow-primary/20 scale-105" 
                : "bg-white/5 text-muted-foreground border-white/5 hover:bg-white/10 hover:text-white"
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Main Grid */}
      <div className="space-y-8">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map(i => (
               <div key={i} className="h-80 glass-card animate-pulse rounded-[40px]" />
            ))}
          </div>
        ) : error ? (
          <div className="py-20 flex flex-col items-center justify-center text-center space-y-4 glass-card rounded-[48px] border-red-500/20 bg-red-500/5">
             <div className="w-20 h-20 rounded-full bg-red-500/10 flex items-center justify-center text-red-500">
                <AlertCircle className="w-10 h-10" />
             </div>
             <div className="space-y-1">
                <h3 className="text-xl font-bold text-white">Connection Error</h3>
                <p className="text-red-400 font-medium max-w-sm mx-auto">{error}</p>
             </div>
             <button 
               onClick={fetchSubjects}
               className="px-6 py-3 bg-white text-black font-bold rounded-xl hover:scale-105 transition-all"
             >
               Try Again
             </button>
          </div>
        ) : subjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {subjects.map((subject, idx) => (
              <motion.div
                key={subject.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                <Link href={`/subjects/${subject.id}`} className="group block h-full">
                  <div className="glass-card h-full rounded-[40px] border-white/5 overflow-hidden group-hover:border-primary/30 transition-all hover:translate-y-[-8px] flex flex-col relative">
                    {/* Badge */}
                    <div className="absolute top-6 left-6 z-10 px-3 py-1 bg-white/10 backdrop-blur-md border border-white/10 rounded-full text-[10px] font-black text-white uppercase tracking-widest">
                       {subject.category}
                    </div>

                    <div className="h-48 bg-gradient-to-br from-primary/20 via-purple-500/10 to-transparent relative overflow-hidden flex items-center justify-center">
                       <Play className="w-12 h-12 text-white/20 group-hover:text-primary transition-all group-hover:scale-125" />
                       <div className="absolute inset-0 bg-primary/5 group-hover:bg-primary/0 transition-all" />
                    </div>
                    
                    <div className="p-8 flex-1 flex flex-col">
                      <div className="flex items-center gap-2 mb-4">
                         <div className="flex -space-x-2">
                           {[1, 2, 3].map(i => (
                             <div key={i} className="w-6 h-6 rounded-full border-2 border-[#0A0A0A] bg-white/20" />
                           ))}
                         </div>
                         <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">1.2k+ Students</span>
                      </div>
                      
                      <h3 className="text-2xl font-black text-white mb-3 group-hover:text-primary transition-colors leading-tight">
                        {subject.title}
                      </h3>
                      
                      <p className="text-muted-foreground text-sm line-clamp-2 mb-8 flex-1">
                        {subject.description}
                      </p>
                      
                      <div className="flex items-center justify-between pt-6 border-t border-white/5">
                        <div className="flex items-center gap-2">
                           <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                              <Users className="w-4 h-4" />
                           </div>
                           <span className="text-xs font-bold text-white">{subject.tutor_name || "Expert"}</span>
                        </div>
                        <div className="w-10 h-10 rounded-2xl bg-white/5 group-hover:bg-primary flex items-center justify-center text-white transition-all group-hover:rotate-[360deg] duration-700">
                           <ArrowRight className="w-5 h-5" />
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="py-20 bg-white/5 rounded-[48px] border-2 border-dashed border-white/10 flex flex-col items-center justify-center text-center space-y-4">
             <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center text-muted-foreground">
                <LayoutGrid className="w-10 h-10" />
             </div>
             <div className="space-y-1">
                <h3 className="text-xl font-bold text-white">No Results Found</h3>
                <p className="text-muted-foreground max-w-sm mx-auto">We couldn't find any courses matching your search or filters at this time.</p>
             </div>
             <button 
               onClick={() => { setSearchTerm(""); setSelectedCategory("All"); }}
               className="px-6 py-3 bg-primary text-white font-bold rounded-xl hover:scale-105 transition-all shadow-xl shadow-primary/20"
             >
               Reset All Filters
             </button>
          </div>
        )}
      </div>
    </div>
  );
}

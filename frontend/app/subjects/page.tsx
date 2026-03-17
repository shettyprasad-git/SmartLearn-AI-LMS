"use client";

import { useEffect, useState } from "react";
import apiClient from "@/lib/apiClient";
import Link from "next/link";
import { BookOpen, Search, ArrowRight, Play, Star, Users, Filter, LayoutGrid, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const CATEGORIES = ["All", "Programming", "Artificial Intelligence", "Business", "Design", "Marketing", "Others"];

export default function SubjectsPage() {
  const [subjects, setSubjects] = useState<any[]>([]);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  useEffect(() => {
    fetchSubjects();
    fetchRecommendations();
  }, [selectedCategory, searchTerm]);

  const fetchSubjects = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get("/subjects", {
        params: {
          category: selectedCategory,
          search: searchTerm
        }
      });
      setSubjects(res.data);
    } catch (err) {
      console.error(err);
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

        <div className="relative group w-full lg:max-w-md">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <input 
            type="text" 
            placeholder="What do you want to learn today?" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-3xl py-5 pl-14 pr-8 text-white text-lg focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary/50 transition-all shadow-2xl shadow-black/40"
          />
        </div>
      </div>

      {/* Categories Bar */}
      <div className="flex items-center gap-3 overflow-x-auto pb-4 no-scrollbar">
        <div className="p-3 bg-white/5 rounded-2xl text-muted-foreground mr-2 border border-white/5">
           <Filter className="w-5 h-5" />
        </div>
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={cn(
              "px-6 py-3 rounded-2xl text-sm font-black whitespace-nowrap transition-all border-2",
              selectedCategory === cat 
                ? "bg-primary border-primary text-white shadow-xl shadow-primary/20 scale-105" 
                : "bg-white/5 border-transparent text-muted-foreground hover:bg-white/10 hover:text-white"
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
          >
            {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
              <div key={i} className="glass-card h-[400px] rounded-[48px] animate-pulse bg-white/5 border-white/5" />
            ))}
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-16"
          >
            {/* Main Listing */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 pb-10">
              {subjects.map((subject, i) => (
                <motion.div
                  key={subject.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link href={`/subjects/${subject.id}`} className="group block h-full">
                    <div className="glass-card rounded-[48px] h-full overflow-hidden border-white/5 group-hover:border-primary/40 group-hover:shadow-[0_20px_50px_rgba(124,58,237,0.15)] transition-all duration-700 flex flex-col relative bg-white/[0.02]">
                      <div className="aspect-[4/3] relative overflow-hidden bg-white/5">
                        <img 
                          src={`https://img.youtube.com/vi/${subject.slug.split('-').slice(0,-1).join('-')}/maxresdefault.jpg`} 
                          onError={(e: any) => e.target.src = `https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80`}
                          alt={subject.title} 
                          className="w-full h-full object-cover group-hover:scale-125 transition-transform duration-1000 opacity-60"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0F0F1A] via-transparent to-transparent opacity-80" />
                        
                        <div className="absolute top-6 left-6 flex flex-col gap-2">
                          <div className="bg-primary/95 backdrop-blur-md text-white text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-[0.2em] shadow-2xl">
                            {subject.category}
                          </div>
                          {recommendations.some(r => r.id === subject.id) && (
                             <div className="bg-yellow-500 text-black text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-[0.2em] flex items-center gap-2">
                               <Sparkles className="w-3 h-3" /> Recommended
                             </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="p-8 flex-1 flex flex-col space-y-4">
                        <h3 className="text-xl font-bold text-white group-hover:text-primary transition-colors line-clamp-2 leading-[1.2]">
                          {subject.title}
                        </h3>
                        <p className="text-xs text-muted-foreground/60 line-clamp-3 leading-relaxed font-medium">
                          {subject.description || "In this course, you will dive deep into the concepts through structured learning."}
                        </p>
                        
                        <div className="mt-auto flex items-center justify-between pt-6 border-t border-white/5">
                          <div className="flex items-center gap-4 text-[11px] font-black text-white/40 uppercase tracking-widest">
                            <span className="flex items-center gap-2"><Play className="w-3.5 h-3.5 text-primary" /> 12 Modules</span>
                          </div>
                          <div className="w-12 h-12 rounded-[20px] bg-white/5 flex items-center justify-center group-hover:bg-primary group-hover:scale-110 active:scale-95 transition-all shadow-lg">
                            <ArrowRight className="w-5 h-5 group-hover:text-white" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
              
              {subjects.length === 0 && (
                <div className="col-span-full py-40 flex flex-col items-center justify-center space-y-8 text-center bg-white/[0.02] rounded-[64px] border-2 border-dashed border-white/5">
                  <div className="w-32 h-32 rounded-full bg-white/5 flex items-center justify-center">
                    <LayoutGrid className="w-16 h-16 text-muted-foreground opacity-20" />
                  </div>
                  <div className="space-y-2">
                    <h2 className="text-3xl font-black text-white">No Results Found</h2>
                    <p className="text-muted-foreground max-w-sm mx-auto">We couldn't find any courses matching your search or filters at this time.</p>
                  </div>
                  <button 
                    onClick={() => { setSearchTerm(""); setSelectedCategory("All"); }}
                    className="px-10 py-4 bg-primary text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:scale-105 active:scale-95 transition-all hover:shadow-2xl hover:shadow-primary/30"
                  >
                    Reset All Filters
                  </button>
                </div>
              )}
            </div>
            
            {/* Recommendation Strip if results are few */}
            {subjects.length < 4 && recommendations.length > 0 && !searchTerm && (
              <div className="pt-20 space-y-8">
                 <div className="flex items-center gap-4">
                    <h2 className="text-3xl font-black text-white tracking-tight uppercase">Recommended For You</h2>
                    <div className="h-[2px] flex-1 bg-white/5" />
                 </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {recommendations.slice(0, 4).map((r) => (
                      <Link key={r.id} href={`/subjects/${r.id}`} className="block p-6 glass rounded-[32px] border-white/5 hover:border-primary/20 transition-all group">
                         <span className="text-[10px] font-black text-primary uppercase tracking-widest mb-2 block">{r.category}</span>
                         <h3 className="text-sm font-bold text-white group-hover:text-primary transition-colors line-clamp-1">{r.title}</h3>
                      </Link>
                    ))}
                 </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

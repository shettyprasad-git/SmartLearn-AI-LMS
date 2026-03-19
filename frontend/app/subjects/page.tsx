"use client";

import { useEffect, useState, useCallback } from "react";
import apiClient from "@/lib/apiClient";
import Link from "next/link";
import { 
  BookOpen, 
  Search, 
  ArrowRight, 
  Play, 
  Star, 
  Users, 
  Filter, 
  LayoutGrid, 
  Sparkles, 
  Loader2, 
  AlertCircle,
  Youtube,
  GraduationCap,
  Clock,
  BarChart
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";

const CATEGORIES = ["All", "Programming", "Artificial Intelligence", "Cloud Computing", "Design", "Cybersecurity", "Mobile Dev", "Data Science"];

export default function SubjectsPage() {
  const [subjects, setSubjects] = useState<any[]>([]);
  const [discoveries, setDiscoveries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchLocalSubjects();
  }, [selectedCategory]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchTerm.length > 1) {
        fetchSuggestions();
      } else {
        setSuggestions([]);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  const fetchSuggestions = async () => {
    try {
      const res = await apiClient.get("/youtube/suggestions", {
        params: { q: searchTerm }
      });
      setSuggestions(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSearch = async (termOverride?: string) => {
    const term = termOverride || searchTerm;
    if (!term.trim()) return;
    setSearching(true);
    setShowSuggestions(false);
    try {
      const res = await apiClient.get("/youtube/search", {
        params: { q: term }
      });
      setDiscoveries(res.data);
    } catch (err) {
      toast.error("Discovery engine failed. Using local results.");
    } finally {
      setSearching(false);
    }
  };

  const fetchLocalSubjects = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get("/subjects", {
        params: { category: selectedCategory }
      });
      setSubjects(res.data);
    } catch (err: any) {
      console.error(err);
      setError("Failed to fetch local courses.");
    } finally {
      setLoading(false);
    }
  };

  const handleEnrollDiscovery = async (discovery: any) => {
    const tId = toast.loading(`Orchestrating "${discovery.title}"...`);
    try {
      const res = await apiClient.post("/youtube/import", {
        youtubeId: discovery.id,
        sourceType: discovery.sourceType,
        title: discovery.title,
        description: discovery.description,
        thumbnail: discovery.thumbnail,
        category: discovery.category,
        difficulty: discovery.difficulty,
        channelTitle: discovery.channelTitle
      });

      // Backend now auto-enrolls during import!
      
      toast.success("Course added to dashboard!", { id: tId });
      fetchLocalSubjects(); // Refresh local list
    } catch (err) {
      toast.error("Failed to import course.", { id: tId });
    }
  };

  return (
    <div className="p-4 md:p-10 space-y-12 max-w-7xl mx-auto">
      {/* Search Hero */}
      <div className="flex flex-col items-center text-center space-y-8 max-w-3xl mx-auto mt-10">
        <div className="space-y-4">
          <div className="flex items-center gap-2 px-4 py-1.5 bg-primary/10 rounded-full w-fit mx-auto border border-primary/20">
            <Sparkles className="w-4 h-4 text-primary animate-pulse" />
            <span className="text-[10px] font-black text-primary uppercase tracking-widest">Global Discovery Active</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter leading-[0.9]">
            WHAT DO YOU WANT TO <span className="text-primary italic">LEARN</span> TODAY?
          </h1>
          <p className="text-muted-foreground text-lg max-w-lg mx-auto">Search across the entire YouTube ecosystem for the world's best educational content.</p>
        </div>

        <div className="relative w-full group">
          <div className="absolute inset-x-0 -bottom-4 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent blur-sm" />
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-muted-foreground w-6 h-6 group-focus-within:text-primary transition-colors" />
          <input 
            type="text" 
            placeholder="Search for any topic (e.g. 'Advanced React', 'Machine Learning'...)" 
            value={searchTerm}
            onFocus={() => setShowSuggestions(true)}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setShowSuggestions(true);
            }}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            className="w-full bg-white/5 border-2 border-white/10 rounded-[32px] py-6 pl-16 pr-32 text-xl text-white focus:outline-none focus:border-primary/50 transition-all font-medium placeholder:text-muted-foreground/50 shadow-2xl backdrop-blur-xl"
          />
          
          <AnimatePresence>
            {showSuggestions && suggestions.length > 0 && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute top-full left-0 right-0 mt-2 bg-[#1A1A1A] border border-white/10 rounded-3xl overflow-hidden z-50 shadow-2xl backdrop-blur-3xl"
              >
                {suggestions.map((s, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setSearchTerm(s);
                      handleSearch(s);
                    }}
                    className="w-full px-6 py-4 text-left text-sm font-bold text-muted-foreground hover:bg-white/5 hover:text-white flex items-center gap-3 transition-all border-b border-white/5 last:border-0"
                  >
                    <Search className="w-4 h-4 text-primary" />
                    {s}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          <button 
            onClick={() => handleSearch()}
            disabled={searching}
            className="absolute right-3 top-1/2 -translate-y-1/2 px-8 py-3.5 bg-primary text-white font-black rounded-2xl hover:scale-105 active:scale-95 transition-all flex items-center gap-2 shadow-xl shadow-primary/30"
          >
            {searching ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
            DISCOVER
          </button>
        </div>
      </div>

      {/* Discovery Results */}
      <AnimatePresence>
        {discoveries.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <div className="flex items-center gap-4">
               <div className="h-px flex-1 bg-gradient-to-r from-transparent to-white/10" />
               <h2 className="text-xs font-black text-white uppercase tracking-widest flex items-center gap-2">
                 <Youtube className="w-5 h-5 text-red-500" />
                 Global YouTube Discoveries
               </h2>
               <div className="h-px flex-1 bg-gradient-to-l from-transparent to-white/10" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {discoveries.map((it, idx) => (
                <motion.div
                  key={it.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.05 }}
                  className="glass-card group rounded-[40px] border-white/5 overflow-hidden border hover:border-primary/40 transition-all flex flex-col relative"
                >
                  <div className="h-48 overflow-hidden relative">
                    <img src={it.thumbnail} alt={it.title} className="w-full h-full object-cover group-hover:scale-105 transition-all duration-700" />
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-all" />
                    <div className="absolute top-4 left-4 flex gap-2">
                      <span className="px-3 py-1 bg-black/60 backdrop-blur-md rounded-full text-[10px] font-black text-white uppercase">
                        {it.category}
                      </span>
                      <span className="px-3 py-1 bg-primary/80 backdrop-blur-md rounded-full text-[10px] font-black text-white uppercase">
                        {it.difficulty}
                      </span>
                    </div>
                    {it.sourceType === "playlist" && (
                      <div className="absolute bottom-4 left-4 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-[10px] font-black text-white uppercase flex items-center gap-1">
                        <LayoutGrid className="w-3 h-3" /> Full Course
                      </div>
                    )}
                  </div>

                  <div className="p-6 flex flex-col flex-1">
                    <h3 className="text-lg font-black text-white mb-2 line-clamp-2 leading-tight group-hover:text-primary transition-colors">
                      {it.title}
                    </h3>
                    <div className="flex items-center gap-2 mb-4 text-muted-foreground text-xs font-bold">
                       <GraduationCap className="w-4 h-4" />
                       {it.channelTitle}
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2 mb-6 flex-1 italic">
                       {it.description}
                    </p>
                    <button 
                      onClick={() => handleEnrollDiscovery(it)}
                      className="w-full py-4 bg-white/5 border border-white/10 hover:bg-primary hover:text-white transition-all rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      Enroll in Course
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Local Subjects Grid (Existing) */}
      <div className="space-y-8 pt-10 border-t border-white/5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <h2 className="text-2xl font-black text-white uppercase tracking-tighter italic">Featured Catalog</h2>
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={cn(
                  "px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border",
                  selectedCategory === cat 
                    ? "bg-white text-black border-white shadow-xl scale-105" 
                    : "bg-white/5 text-muted-foreground border-white/5 hover:bg-white/10 hover:text-white"
                )}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map(i => (
               <div key={i} className="h-80 glass-card animate-pulse rounded-[40px]" />
            ))}
          </div>
        ) : subjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {subjects.map((subject, idx) => (
              <Link key={subject.id} href={`/subjects/${subject.id}`} className="group block h-full">
                <div className="glass-card h-full rounded-[40px] border-white/5 overflow-hidden group-hover:border-primary/30 transition-all hover:translate-y-[-8px] flex flex-col relative shadow-2xl">
                  {subject.thumbnail_url && (
                    <div className="h-48 overflow-hidden relative">
                      <img 
          src={subject.thumbnail_url || `https://img.youtube.com/vi/${subject.youtube_id || subject.slug}/maxresdefault.jpg`} 
          onError={(e: any) => e.target.src = `https://img.youtube.com/vi/${subject.youtube_id || subject.slug}/0.jpg`}
          className="w-full h-full object-cover opacity-40 group-hover:scale-105 transition-transform duration-1000"
          alt=""
        />
    <div className="absolute inset-0 bg-primary/10 group-hover:bg-primary/0 transition-all" />
                      <div className="absolute top-4 left-4 z-10 px-3 py-1 bg-white/10 backdrop-blur-md border border-white/10 rounded-full text-[10px] font-black text-white uppercase">
                        {subject.category}
                      </div>
                    </div>
                  )}
                  <div className="p-8 flex-1 flex flex-col">
                    <div className="flex items-center gap-2 mb-4 text-[10px] font-black uppercase tracking-widest">
                       <span className={cn(
                         "px-2 py-0.5 rounded-md",
                         subject.difficulty === "Beginner" ? "bg-green-500/20 text-green-400" :
                         subject.difficulty === "Intermediate" ? "bg-orange-500/20 text-orange-400" :
                         "bg-red-500/20 text-red-400"
                       )}>{subject.difficulty}</span>
                       <span className="text-muted-foreground">• {subject.source_type === "playlist" ? "Full Course" : "Tutorial"}</span>
                    </div>
                    
                    <h3 className="text-2xl font-black text-white mb-3 group-hover:text-primary transition-colors leading-tight">
                      {subject.title}
                    </h3>
                    
                    <p className="text-muted-foreground text-sm line-clamp-2 mb-8 flex-1 italic">
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
            ))}
          </div>
        ) : (
          <div className="py-20 bg-white/5 rounded-[48px] border-2 border-dashed border-white/10 flex flex-col items-center justify-center text-center space-y-4">
             <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center text-muted-foreground">
                <LayoutGrid className="w-10 h-10" />
             </div>
             <p className="text-muted-foreground max-w-sm mx-auto">No courses found in this category. Use the search above to discover millions of courses on YouTube!</p>
          </div>
        )}
      </div>
    </div>
  );
}

// Add missing icon
function Plus({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <line x1="12" y1="5" x2="12" y2="19"></line>
      <line x1="5" y1="12" x2="19" y2="12"></line>
    </svg>
  );
}

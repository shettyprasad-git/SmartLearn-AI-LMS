"use client";

import { useState } from "react";
import { 
  Map, 
  Search, 
  Sparkles, 
  ChevronRight, 
  BrainCircuit, 
  Zap, 
  Trophy, 
  Loader2,
  ArrowRight,
  Target
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import apiClient from "@/lib/apiClient";

export default function LearningPathsPage() {
  const [topic, setTopic] = useState("");
  const [loading, setLoading] = useState(false);
  const [roadmap, setRoadmap] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!topic.trim() || loading) return;
    setLoading(true);
    setError(null);
    setRoadmap(null);

    try {
      const res = await apiClient.post("/ai/generate-roadmap", { topic });
      setRoadmap(res.data);
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to generate roadmap. Neural logic timed out.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 md:p-12 space-y-12 max-w-6xl mx-auto">
      {/* Intro Header */}
      <div className="flex flex-col items-center text-center space-y-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-[0.3em] animate-glow"
        >
          <Sparkles className="inline-block w-4 h-4 mr-2 mb-0.5" />
          AI Learning Architect
        </motion.div>
        
        <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter leading-none">
          Generate Your <span className="text-gradient italic">Expert Path.</span>
        </h1>
        <p className="text-muted-foreground max-w-2xl font-medium tracking-tight text-lg">
          Tell us what you want to master, and our AI will build a professional roadmap from fundamentals to industry expert.
        </p>

        {/* Search/Generator Input */}
        <div className="w-full max-w-2xl relative group mt-8">
          <div className="absolute inset-x-0 -bottom-4 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent blur-sm opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="absolute left-6 top-1/2 -translate-y-1/2">
             <Target className="w-6 h-6 text-primary animate-pulse" />
          </div>
          <input 
            type="text" 
            placeholder="e.g. Full Stack Web Development, Quantum Physics, Marketing Strategy..." 
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
            className="w-full bg-white/5 border border-white/10 rounded-[32px] py-6 pl-16 pr-40 text-lg text-white focus:outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all font-bold placeholder:text-muted-foreground/30"
          />
          <button 
            onClick={handleGenerate}
            disabled={loading || !topic.trim()}
            className="absolute right-3 top-1/2 -translate-y-1/2 px-8 py-4 bg-primary text-white rounded-[24px] font-black uppercase text-xs tracking-widest shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:scale-100"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : "Build Map"}
          </button>
        </div>
      </div>

      {/* Error Message */}
      <AnimatePresence>
        {error && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-6 rounded-3xl bg-red-500/10 border border-red-500/20 text-red-500 text-center font-bold"
          >
             {error}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Roadmap Visualization */}
      <div className="relative">
        {loading && (
          <div className="py-40 flex flex-col items-center justify-center space-y-6">
             <div className="relative">
                <div className="w-24 h-24 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
                <BrainCircuit className="absolute inset-0 m-auto w-10 h-10 text-primary animate-pulse" />
             </div>
             <p className="text-primary font-black uppercase tracking-[0.2em] animate-pulse">Consulting Neural Architect...</p>
          </div>
        )}

        {roadmap && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-16"
          >
            {/* Header info */}
            <div className="flex items-center justify-between border-b border-white/5 pb-8">
               <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center text-white shadow-2xl">
                     <Map className="w-8 h-8" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-black text-white uppercase tracking-tighter italic">{topic}</h2>
                    <span className="text-[10px] font-black text-primary uppercase tracking-[0.3em]">{roadmap.nodes.length} Key Milestones</span>
                  </div>
               </div>
               <button className="px-6 py-3 glass-premium rounded-2xl text-white font-bold text-xs uppercase tracking-widest hover:bg-white/5 transition-all">
                  Save to My Learning
               </button>
            </div>

            {/* The actual Roadmap Map */}
            <div className="relative flex flex-col items-center max-w-md mx-auto">
              {/* Connecting Line */}
              <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-1 bg-gradient-to-b from-primary via-indigo-600 to-transparent rounded-full -z-10" />
              
              <div className="space-y-12 w-full">
                {roadmap.nodes.map((node: any, idx: number) => (
                  <motion.div 
                    key={node.id}
                    initial={{ opacity: 0, x: idx % 2 === 0 ? -20 : 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className={cn(
                      "flex items-center w-full relative",
                      idx % 2 === 0 ? "flex-row" : "flex-row-reverse"
                    )}
                  >
                     {/* Node Point */}
                     <div className="absolute left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-background border-4 border-primary z-10 flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                     </div>

                     {/* Content Card */}
                     <div className={cn(
                       "w-[45%] group",
                       idx % 2 === 0 ? "mr-auto text-right" : "ml-auto text-left"
                     )}>
                        <div className="glass-premium p-6 rounded-[32px] border-white/5 hover:border-primary/50 transition-all hover:scale-105 group relative overflow-hidden">
                           <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                           <span className={cn(
                             "inline-block px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest mb-3",
                             node.level === 'Beginner' ? "bg-green-500/20 text-green-400" :
                             node.level === 'Intermediate' ? "bg-yellow-500/20 text-yellow-400" :
                             "bg-red-500/20 text-red-500"
                           )}>
                             {node.level}
                           </span>
                           <h3 className="text-sm font-black text-white uppercase tracking-tight mb-2 group-hover:text-primary transition-colors">{node.title}</h3>
                           <p className="text-[10px] text-muted-foreground leading-relaxed line-clamp-2 md:line-clamp-none opacity-0 group-hover:opacity-100 transition-all">
                             {node.description}
                           </p>
                        </div>
                     </div>
                  </motion.div>
                ))}
              </div>

              {/* End Point */}
              <div className="mt-12 w-16 h-16 rounded-full bg-primary/20 border-4 border-dashed border-primary flex items-center justify-center">
                 <Trophy className="w-8 h-8 text-primary animate-bounce mt-[-4px]" />
              </div>
            </div>
          </motion.div>
        )}

        {!roadmap && !loading && (
          <div className="py-20 border-2 border-dashed border-white/5 rounded-[48px] flex flex-col items-center justify-center text-center space-y-4">
             <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center text-muted-foreground">
                <BrainCircuit className="w-10 h-10" />
             </div>
             <p className="text-muted-foreground font-medium italic">Neural engine ready. Awaiting your first goal.</p>
          </div>
        )}
      </div>

      {/* Featured Roadmaps */}
      {!roadmap && !loading && (
        <section className="space-y-8">
           <h3 className="text-xl font-black text-white uppercase tracking-tighter italic">Popular Learning paths</h3>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { title: "Frontend Engineering", level: "Complete Journey" },
                { title: "AI/ML Scientist", level: "Mathematical Deep Dive" },
                { title: "DevOps Architect", level: "Cloud & Infrastructure" }
              ].map((p, i) => (
                <div 
                  key={i} 
                  onClick={() => { setTopic(p.title); handleGenerate(); }}
                  className="glass-card p-6 rounded-3xl border-white/5 hover:border-primary/30 transition-all cursor-pointer group"
                >
                   <Zap className="w-6 h-6 text-primary mb-4 group-hover:scale-110 transition-transform" />
                   <h4 className="text-sm font-black text-white mb-1">{p.title}</h4>
                   <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">{p.level}</p>
                </div>
              ))}
           </div>
        </section>
      )}
    </div>
  );
}

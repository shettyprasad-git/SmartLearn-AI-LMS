"use client";

import { useEffect, useState } from "react";
import apiClient from "@/lib/apiClient";
import Link from "next/link";
import { BookOpen, Search, ArrowRight, Play, Star, Users } from "lucide-react";
import { motion } from "framer-motion";

export default function SubjectsPage() {
  const [subjects, setSubjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    apiClient.get("/subjects")
      .then(res => setSubjects(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const filteredSubjects = subjects.filter(s => 
    s.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-8 space-y-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-black text-white px-2 border-l-8 border-primary tracking-tight">Explore Catalog</h1>
          <p className="text-muted-foreground ml-2">Discover high-quality structured courses from top educators.</p>
        </div>

        <div className="relative group min-w-[350px]">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <input 
            type="text" 
            placeholder="Search by title, topic or keyword..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-6 text-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all shadow-2xl shadow-black/20"
          />
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="glass-card h-80 rounded-[40px] animate-pulse bg-white/5 border-white/5" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-20">
          {filteredSubjects.map((subject, i) => (
            <motion.div
              key={subject.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Link href={`/subjects/${subject.id}`} className="group block h-full">
                <div className="glass-card rounded-[40px] h-full overflow-hidden border-white/10 group-hover:border-primary/30 group-hover:shadow-2xl group-hover:shadow-primary/10 transition-all duration-500 flex flex-col">
                  <div className="aspect-video relative overflow-hidden bg-white/5">
                    <img 
                      src={`https://img.youtube.com/vi/${subject.slug}/maxresdefault.jpg`} 
                      onError={(e: any) => e.target.src = `https://img.youtube.com/vi/${subject.slug}/0.jpg`}
                      alt={subject.title} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-80"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
                    <div className="absolute top-4 left-4 bg-primary/90 backdrop-blur-md text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest shadow-lg">
                      Free Course
                    </div>
                    <div className="absolute bottom-4 left-4 right-4">
                       <h3 className="text-xl font-bold text-white line-clamp-2 leading-tight group-hover:text-primary transition-colors">{subject.title}</h3>
                    </div>
                  </div>
                  
                  <div className="p-6 flex-1 flex flex-col space-y-4">
                    <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
                      {subject.description || "No description available for this course. Start learning to discover the content."}
                    </p>
                    
                    <div className="mt-auto flex items-center justify-between pt-4 border-t border-white/5">
                      <div className="flex items-center gap-4 text-xs font-bold text-muted-foreground">
                        <div className="flex items-center gap-1.5">
                          <Play className="w-3.5 h-3.5" /> 8 Lessons
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Users className="w-3.5 h-3.5" /> 1.2k Enrolled
                        </div>
                      </div>
                      <div className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center group-hover:bg-primary transition-colors">
                        <ArrowRight className="w-5 h-5 group-hover:text-white" />
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
          
          {filteredSubjects.length === 0 && (
            <div className="col-span-full py-32 flex flex-col items-center justify-center space-y-6">
              <div className="w-24 h-24 rounded-full bg-white/5 flex items-center justify-center">
                <Search className="w-12 h-12 text-muted-foreground" />
              </div>
              <p className="text-xl text-muted-foreground font-medium">No subjects found matching your search.</p>
              <button 
                onClick={() => setSearchTerm("")}
                className="px-6 py-2 glass rounded-xl text-primary font-bold"
              >
                Clear Search
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

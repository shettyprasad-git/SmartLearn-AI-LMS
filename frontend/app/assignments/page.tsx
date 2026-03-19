"use client";

import { useEffect, useState } from "react";
import { 
  Award, 
  BookOpen, 
  Calendar, 
  CheckCircle2, 
  ChevronRight, 
  HelpCircle, 
  Loader2, 
  Search, 
  Sparkles, 
  Target, 
  TrendingUp,
  Clock,
  ExternalLink,
  Zap
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import apiClient from "@/lib/apiClient";
import Link from "next/link";

export default function AssignmentsPage() {
  const [assignments, setAssignments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");

  const fetchAssignments = async () => {
    try {
      const res = await apiClient.get("/progress/me/assignments");
      setAssignments(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssignments();
  }, []);

  const filteredAssignments = assignments.filter(a => 
    a.video.title.toLowerCase().includes(filter.toLowerCase()) ||
    a.video.section.subject.title.toLowerCase().includes(filter.toLowerCase())
  );

  const averageScore = assignments.length > 0 
    ? Math.round(assignments.reduce((acc, curr) => acc + curr.score, 0) / assignments.length)
    : 0;

  return (
    <div className="p-8 md:p-12 space-y-12 max-w-7xl mx-auto">
      {/* Header & Stats Section */}
      <div className="flex flex-col lg:flex-row gap-12 border-b border-white/5 pb-16">
        <div className="flex-1 space-y-6">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-[0.3em] w-fit"
          >
            <Target className="w-4 h-4" />
            Performance Insights
          </motion.div>
          <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter leading-none">
            Assessments & <span className="text-gradient italic">Results.</span>
          </h1>
          <p className="text-muted-foreground max-w-xl font-medium tracking-tight text-lg leading-relaxed">
            Review your neural assessments across all courses. Analyze your strengths, identify skill gaps, and master every concept.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full lg:w-[450px]">
           <div className="glass-premium p-8 rounded-[40px] border-white/5 flex flex-col justify-between">
              <TrendingUp className="w-8 h-8 text-primary mb-4" />
              <div>
                 <span className="text-4xl font-black text-white italic tracking-tighter">{averageScore}%</span>
                 <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mt-1">Average Proficiency</p>
              </div>
           </div>
           <div className="glass-premium p-8 rounded-[40px] border-white/5 flex flex-col justify-between">
              <Award className="w-8 h-8 text-emerald-400 mb-4" />
              <div>
                 <span className="text-4xl font-black text-white italic tracking-tighter">{assignments.length}</span>
                 <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mt-1">Quizzes Mastered</p>
              </div>
           </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="space-y-8">
         {/* Filters */}
         <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative w-full md:w-96 group">
               <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground transition-colors group-hover:text-primary" />
               <input 
                 type="text" 
                 placeholder="Search by lesson or course title..." 
                 value={filter}
                 onChange={(e) => setFilter(e.target.value)}
                 className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-14 pr-6 text-sm focus:outline-none focus:border-primary/50 transition-all focus:ring-4 focus:ring-primary/5"
               />
            </div>

            <div className="flex gap-4">
               <button className="px-6 py-3 rounded-xl glass text-[10px] font-black uppercase text-white tracking-widest border border-white/5 hover:bg-white/10 transition-all">Latest First</button>
               <button className="px-6 py-3 rounded-xl glass text-[10px] font-black uppercase text-muted-foreground tracking-widest border border-white/5 hover:bg-white/10 transition-all">Top Scores</button>
            </div>
         </div>

         {/* Assignments List */}
         <div className="space-y-4">
            <AnimatePresence mode="popLayout">
               {loading ? (
                 <div className="py-20 flex flex-col items-center justify-center space-y-4">
                    <Loader2 className="w-10 h-10 text-primary animate-spin" />
                    <p className="text-xs font-black text-primary uppercase tracking-[0.3em]">Querying Neural Records...</p>
                 </div>
               ) : filteredAssignments.length > 0 ? (
                 filteredAssignments.map((submission, i) => (
                   <motion.div 
                     key={submission.id}
                     initial={{ opacity: 0, y: 20 }}
                     animate={{ opacity: 1, y: 0 }}
                     transition={{ delay: i * 0.05 }}
                     className="glass-card group p-6 rounded-[32px] border-white/5 hover:border-primary/30 transition-all flex flex-col md:flex-row items-center gap-8 relative overflow-hidden"
                   >
                      {/* Course Identity */}
                      <div className="flex items-center gap-6 flex-1 min-w-0">
                         <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-indigo-600 flex items-center justify-center text-white shadow-xl flex-shrink-0">
                            <BookOpen className="w-8 h-8" />
                         </div>
                         <div className="space-y-1 min-w-0">
                            <h3 className="text-lg font-black text-white uppercase tracking-tight truncate leading-tight transition-colors group-hover:text-primary">
                              {submission.video.title}
                            </h3>
                            <p className="text-xs text-muted-foreground font-bold tracking-tight uppercase flex items-center gap-2">
                               {submission.video.section.subject.title}
                               <span className="w-1 h-1 rounded-full bg-white/20" />
                               Section {submission.video.section.order_index + 1}
                            </p>
                         </div>
                      </div>

                      {/* Performance Stats */}
                      <div className="flex items-center gap-12 w-full md:w-auto">
                         <div className="text-center md:text-right">
                             <div className="flex items-center justify-center md:justify-end gap-2 text-white">
                                <Target className="w-4 h-4 text-primary" />
                                <span className="text-2xl font-black italic tracking-tighter transition-all group-hover:scale-110 group-hover:text-primary">{submission.score}%</span>
                             </div>
                             <p className="text-[8px] font-black text-muted-foreground uppercase tracking-widest mt-1">Assessment Score</p>
                         </div>

                         <div className="text-center md:text-right hidden sm:block">
                             <div className="flex items-center justify-center md:justify-end gap-2 text-white/50">
                                <Calendar className="w-4 h-4" />
                                <span className="text-xs font-bold">{new Date(submission.created_at).toLocaleDateString()}</span>
                             </div>
                             <p className="text-[8px] font-black text-muted-foreground uppercase tracking-widest mt-1">Submission Date</p>
                         </div>

                         <Link 
                           href={`/subjects/${submission.video.section.subject_id}/video/${submission.video_id}`}
                           className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-primary transition-all hover:border-primary group/link"
                         >
                            <ChevronRight className="w-6 h-6 group-hover/link:translate-x-1 transition-transform" />
                         </Link>
                      </div>
                   </motion.div>
                 ))
               ) : (
                 <div className="py-32 border-2 border-dashed border-white/5 rounded-[56px] flex flex-col items-center justify-center text-center space-y-6">
                    <div className="w-24 h-24 rounded-full bg-white/5 flex items-center justify-center text-muted-foreground/30">
                       <HelpCircle className="w-12 h-12" />
                    </div>
                    <div>
                       <h3 className="text-xl font-black text-white uppercase italic tracking-tight">No Neural Records Found</h3>
                       <p className="text-sm text-muted-foreground font-medium max-w-xs mx-auto mt-2">Start a practice quiz in any lesson to see your learning performance quantified here.</p>
                    </div>
                    <Link href="/dashboard" className="px-8 py-3 bg-primary text-white text-[10px] font-black uppercase tracking-widest rounded-xl shadow-xl shadow-primary/20 hover:scale-105 transition-all">
                       Jump Back to Learning
                    </Link>
                 </div>
               )}
            </AnimatePresence>
         </div>
      </div>

      {/* Career Potential Banner */}
      {assignments.length >= 3 && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="glass-premium p-12 rounded-[64px] bg-gradient-to-r from-emerald-500/10 via-transparent to-transparent flex flex-col md:flex-row items-center gap-12 border-white/5"
        >
           <div className="w-20 h-20 rounded-[24px] bg-emerald-500 flex items-center justify-center text-white shadow-2xl shadow-emerald-500/20">
              <Award className="w-12 h-12" />
           </div>
           <div className="space-y-2 flex-1 text-center md:text-left">
              <h4 className="text-2xl font-black text-white italic tracking-tighter">Your Learning Velocity is High.</h4>
              <p className="text-sm text-muted-foreground font-medium max-w-xl">Based on your recent assessment scores, you're performing 14% better than average. Why not scan your updated resume against a job description?</p>
           </div>
           <Link href="/ai-tools/resume" className="px-10 py-5 bg-white text-black rounded-3xl font-black uppercase text-xs tracking-[0.2em] hover:scale-105 active:scale-95 transition-all shadow-xl shadow-white/5 whitespace-nowrap">
              Optimize My Resume
           </Link>
        </motion.div>
      )}

      {/* Footer Meta */}
      <div className="pt-12 grid grid-cols-2 md:grid-cols-4 gap-8 opacity-40 grayscale hover:grayscale-0 transition-all">
         {[
           { icon: <Clock />, value: "Live Sync", label: "Real-time Scoring" },
           { icon: <ShieldCheck />, value: "Encrypted", label: "Student Data" },
           { icon: <Zap />, value: "Neural", label: "AI Scored Quizzes" },
           { icon: <ExternalLink />, value: "Portable", label: "CSV Export Soon" },
         ].map((stat, i) => (
            <div key={i} className="flex items-center gap-3">
               <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white">
                  {stat.icon as any}
               </div>
               <div>
                  <h5 className="text-[10px] font-black text-white uppercase leading-none">{stat.value}</h5>
                  <p className="text-[8px] font-black text-muted-foreground uppercase opacity-50 mt-1">{stat.label}</p>
               </div>
            </div>
         ))}
      </div>
    </div>
  );
}

function ShieldCheck(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

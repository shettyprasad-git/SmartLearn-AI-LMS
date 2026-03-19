"use client";

import { useState } from "react";
import { 
  FileSearch, 
  Sparkles, 
  Target, 
  Loader2, 
  CheckCircle2, 
  Zap, 
  BrainCircuit,
  ArrowLeft,
  Briefcase,
  AlertCircle,
  TrendingUp,
  Award
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import apiClient from "@/lib/apiClient";
import Link from "next/link";
import toast from "react-hot-toast";

export default function ResumeOptimizerPage() {
  const [resume, setResume] = useState("");
  const [jobDesc, setJobDesc] = useState("");
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<any>(null);

  const handleAnalyze = async () => {
    if (!resume.trim() || !jobDesc.trim() || loading) return;
    setLoading(true);
    setAnalysis(null);

    try {
      const res = await apiClient.post("/ai/chat", { 
        message: `Act as an expert Technical Recruiter. Analyze this Resume against the Job Description. 
        Provide a JSON response with:
        "score" (0-100), 
        "match_summary" (string), 
        "missing_skills" (array of strings), 
        "optimization_tips" (array of strings). 
        Resume: ${resume} 
        Job Description: ${jobDesc}`
      });

      let text = res.data.reply;
      try {
        const jsonStart = text.indexOf('{');
        const jsonEnd = text.lastIndexOf('}') + 1;
        if (jsonStart !== -1) {
          const parsed = JSON.parse(text.substring(jsonStart, jsonEnd));
          setAnalysis(parsed);
        } else {
           toast.error("AI returned unstructured data. Try again.");
        }
      } catch {
        toast.error("Failed to parse AI response.");
      }
    } catch (err: any) {
      console.error(err);
      toast.error("Analysis failed. Neural logic timed out.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 md:p-12 space-y-12 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
         <Link href="/ai-tools" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl glass-card flex items-center justify-center group-hover:bg-primary/20 transition-all">
               <ArrowLeft className="w-5 h-5 text-white" />
            </div>
            <span className="text-xs font-black text-white uppercase tracking-widest hidden md:block">Back to Hub</span>
         </Link>

         <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center text-white shadow-2xl">
               <FileSearch className="w-7 h-7" />
            </div>
            <div>
               <h1 className="text-2xl font-black text-white uppercase tracking-tighter italic leading-none">Resume Optimizer</h1>
               <span className="text-[10px] font-black text-primary uppercase tracking-[0.3em]">AI Career Catalyst</span>
            </div>
         </div>

         <div className="w-10 md:w-32" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
         {/* Input: Resume */}
         <div className="space-y-4">
            <div className="flex items-center gap-2 px-4">
               <Briefcase className="w-4 h-4 text-primary" />
               <span className="text-[10px] font-black text-white uppercase tracking-widest">Your Professional Resume</span>
            </div>
            <textarea 
              placeholder="Paste your full resume text here (Skills, Experience, Projects)..." 
              value={resume}
              onChange={(e) => setResume(e.target.value)}
              className="w-full h-80 bg-white/5 border border-white/10 rounded-[32px] p-8 text-white focus:outline-none focus:border-primary/50 transition-all font-medium placeholder:text-muted-foreground/20 resize-none text-xs leading-relaxed"
            />
         </div>

         {/* Input: Job Desc */}
         <div className="space-y-4">
            <div className="flex items-center gap-2 px-4">
               <Target className="w-4 h-4 text-primary" />
               <span className="text-[10px] font-black text-white uppercase tracking-widest">Job Description / Requirements</span>
            </div>
            <textarea 
              placeholder="Paste the target job description or key requirements here..." 
              value={jobDesc}
              onChange={(e) => setJobDesc(e.target.value)}
              className="w-full h-80 bg-white/5 border border-white/10 rounded-[32px] p-8 text-white focus:outline-none focus:border-primary/50 transition-all font-medium placeholder:text-muted-foreground/20 resize-none text-xs leading-relaxed"
            />
         </div>
      </div>

      <button 
        onClick={handleAnalyze}
        disabled={loading || !resume.trim() || !jobDesc.trim()}
        className="w-full py-6 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-[32px] font-black uppercase text-xs tracking-[0.2em] shadow-xl shadow-emerald-500/20 hover:scale-[1.01] active:scale-95 transition-all disabled:opacity-50 disabled:scale-100 flex items-center justify-center gap-3"
      >
         {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Sparkles className="w-5 h-5" /> Start Neural Scan</>}
      </button>

      {/* Analysis Results */}
      <AnimatePresence>
         {analysis && (
           <motion.div 
             initial={{ opacity: 0, y: 30 }}
             animate={{ opacity: 1, y: 0 }}
             className="space-y-8 pb-20"
           >
              {/* Score Banner */}
              <div className="glass-premium p-12 rounded-[56px] border-white/5 flex flex-col md:flex-row items-center gap-12 relative overflow-hidden">
                 <div className="absolute inset-0 bg-emerald-500/5 blur-3xl" />
                 
                 <div className="relative w-40 h-40 flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90">
                       <circle cx="80" cy="80" r="70" fill="transparent" stroke="rgba(255,255,255,0.05)" strokeWidth="12" />
                       <motion.circle 
                         initial={{ strokeDashoffset: 440 }}
                         animate={{ strokeDashoffset: 440 * (1 - analysis.score / 100) }}
                         transition={{ duration: 1.5, ease: "easeOut" }}
                         cx="80" cy="80" r="70" fill="transparent" stroke="#10b981" strokeWidth="12" strokeDasharray={440} strokeLinecap="round" 
                       />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                       <span className="text-4xl font-black text-white italic">{analysis.score}%</span>
                       <span className="text-[8px] font-black text-emerald-400 uppercase tracking-widest mt-1">Match Score</span>
                    </div>
                 </div>

                 <div className="flex-1 space-y-4 text-center md:text-left">
                    <h3 className="text-2xl font-black text-white uppercase tracking-tighter italic">Analysis Complete.</h3>
                    <p className="text-sm text-muted-foreground font-medium leading-relaxed">
                       {analysis.match_summary}
                    </p>
                    <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                       {analysis.score > 80 ? (
                         <div className="px-4 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-[9px] font-black uppercase tracking-widest">High Potential Match</div>
                       ) : (
                         <div className="px-4 py-1.5 rounded-full bg-yellow-500/20 border border-yellow-500/30 text-yellow-400 text-[9px] font-black uppercase tracking-widest">Needs Optimization</div>
                       )}
                    </div>
                 </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 {/* Missing Skills */}
                 <div className="glass-card p-10 rounded-[48px] border-red-500/10 space-y-6">
                    <div className="flex items-center gap-3">
                       <AlertCircle className="w-5 h-5 text-red-400" />
                       <h4 className="text-sm font-black text-white uppercase tracking-widest">Skill Gaps Detected</h4>
                    </div>
                    <div className="flex flex-wrap gap-3">
                       {analysis.missing_skills?.map((skill: string, i: number) => (
                         <span key={i} className="px-4 py-2 rounded-2xl bg-red-500/5 border border-red-500/10 text-[10px] font-bold text-red-400">
                           {skill}
                         </span>
                       ))}
                    </div>
                 </div>

                 {/* Optimization Tips */}
                 <div className="glass-card p-10 rounded-[48px] border-emerald-500/10 space-y-6">
                    <div className="flex items-center gap-3">
                       <TrendingUp className="w-5 h-5 text-emerald-400" />
                       <h4 className="text-sm font-black text-white uppercase tracking-widest">Neural Optimization Tips</h4>
                    </div>
                    <div className="space-y-4">
                       {analysis.optimization_tips?.map((tip: string, i: number) => (
                         <div key={i} className="flex gap-4 items-start">
                            <div className="w-6 h-6 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400 flex-shrink-0">
                               <Award className="w-3 h-3" />
                            </div>
                            <p className="text-[11px] font-medium text-muted-foreground leading-snug">{tip}</p>
                         </div>
                       ))}
                    </div>
                 </div>
              </div>
           </motion.div>
         )}
      </AnimatePresence>

      {!analysis && !loading && (
        <div className="py-20 flex flex-col items-center justify-center text-center space-y-4 opacity-40">
           <BrainCircuit className="w-16 h-16 text-muted-foreground animate-pulse" />
           <p className="text-xs font-black uppercase tracking-[0.3em] text-muted-foreground">Neural scanner standing by...</p>
        </div>
      )}
    </div>
  );
}

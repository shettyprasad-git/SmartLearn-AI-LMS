"use client";

import { useState } from "react";
import { 
  BrainCircuit, 
  Sparkles, 
  BookOpen, 
  FileText, 
  Map, 
  Zap, 
  FileSearch, 
  MessageSquare,
  ArrowRight,
  Monitor,
  Rocket,
  ShieldCheck,
  Bot
} from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import Link from "next/link";

const TOOLS = [
  {
    id: "summarizer",
    title: "Smart Summarizer",
    desc: "Extract key insights and summaries from any video or long-form documentation instantly.",
    icon: <FileText className="w-8 h-8" />,
    color: "from-blue-500 to-indigo-600",
    badge: "Most Used",
    link: "/ai-tools/summarizer"
  },
  {
    id: "roadmaps",
    title: "Roadmap Architect",
    desc: "Generate professional career and skill roadmaps from fundamentals to expert level.",
    icon: <Map className="w-8 h-8" />,
    color: "from-purple-500 to-pink-600",
    badge: "Expert",
    link: "/learning-paths"
  },
  {
    id: "quiz",
    title: "Quiz Master",
    desc: "Challenge your knowledge with AI-generated assessments based on your learning history.",
    icon: <Zap className="w-8 h-8" />,
    color: "from-orange-400 to-red-500",
    badge: "Popular",
    link: "/assignments"
  },
  {
    id: "resume",
    title: "Resume Optimizer",
    desc: "Scan your resume against technical job descriptions and get AI-driven match scores.",
    icon: <FileSearch className="w-8 h-8" />,
    color: "from-emerald-400 to-teal-600",
    badge: "New",
    link: "/ai-tools/resume"
  }
];

export default function AIToolsPage() {
  return (
    <div className="p-8 md:p-12 space-y-12 max-w-7xl mx-auto">
      {/* Hero Section */}
      <div className="flex flex-col md:flex-row items-center gap-12 border-b border-white/5 pb-16">
        <div className="flex-1 space-y-6 text-center md:text-left">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-[0.3em] w-fit mx-auto md:mx-0"
          >
            <Sparkles className="w-4 h-4" />
            Elite Neural Suite
          </motion.div>
          <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter leading-none">
            Your Personal <span className="text-gradient italic">AI Power-Hub.</span>
          </h1>
          <p className="text-muted-foreground max-w-xl font-medium tracking-tight text-lg">
            Harness the full potential of our specialized LLMs. From generating expert roadmaps to optimizing your career docs—everything is here.
          </p>
          <div className="flex items-center gap-4 justify-center md:justify-start">
             <div className="flex -space-x-3">
                {[1,2,3,4].map(i => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-[#0A0A0A] bg-zinc-800 flex items-center justify-center text-[10px] font-black text-white overflow-hidden">
                     <img src={`https://i.pravatar.cc/100?img=${i+10}`} alt="user" />
                  </div>
                ))}
             </div>
             <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">+2.4k students using AI tools today</p>
          </div>
        </div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.9, rotate: -5 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          className="w-full md:w-[400px] aspect-square glass-premium rounded-[64px] relative flex items-center justify-center group"
        >
           <div className="absolute inset-0 bg-primary/10 rounded-[64px] blur-3xl group-hover:bg-primary/20 transition-all" />
           <div className="relative w-48 h-48 bg-gradient-to-br from-primary to-indigo-600 rounded-[48px] flex items-center justify-center shadow-2xl animate-float">
              <BrainCircuit className="w-24 h-24 text-white" />
              <div className="absolute -top-4 -right-4 w-16 h-16 rounded-3xl bg-white flex items-center justify-center text-primary shadow-xl">
                 <Zap className="w-8 h-8 fill-primary" />
              </div>
           </div>
        </motion.div>
      </div>

      {/* Tools Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {TOOLS.map((tool, i) => (
          <Link href={tool.link} key={tool.id}>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="group glass-card p-8 rounded-[40px] border-white/5 hover:border-primary/50 transition-all hover:-translate-y-2 relative h-full flex flex-col"
            >
               <div className={cn(
                 "w-16 h-16 rounded-2xl bg-gradient-to-br flex items-center justify-center text-white shadow-xl mb-6 group-hover:scale-110 transition-transform",
                 tool.color
               )}>
                  {tool.icon}
               </div>

               <div className="flex items-center gap-3 mb-4">
                  <h3 className="text-lg font-black text-white uppercase tracking-tight">{tool.title}</h3>
                  <span className="px-2 py-0.5 rounded-full bg-white/5 text-[8px] font-black text-primary uppercase border border-white/10">{tool.badge}</span>
               </div>

               <p className="text-xs text-muted-foreground font-medium leading-relaxed mb-8 flex-1">
                 {tool.desc}
               </p>

               <div className="flex items-center text-xs font-black text-white uppercase tracking-widest gap-2 group-hover:text-primary transition-colors">
                  Get Started <ArrowRight className="w-4 h-4 translate-x-0 group-hover:translate-x-2 transition-transform" />
               </div>
            </motion.div>
          </Link>
        ))}
      </div>

      {/* Featured Insight Card */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="glass-premium p-12 rounded-[56px] bg-gradient-to-r from-primary/20 via-transparent to-transparent flex flex-col md:flex-row items-center gap-12 border-white/10"
      >
         <div className="w-20 h-20 rounded-3xl bg-primary flex items-center justify-center text-white flex-shrink-0">
            <Bot className="w-12 h-12" />
         </div>
         <div className="space-y-2 flex-1 text-center md:text-left">
            <h4 className="text-2xl font-black text-white tracking-tight italic">Coming Soon: Smart Interviewer</h4>
            <p className="text-sm text-muted-foreground font-medium">We're training our neural engines to conduct voice-based mock interviews tailored to your course history.</p>
         </div>
         <button className="px-10 py-5 bg-white text-black rounded-3xl font-black uppercase text-xs tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl shadow-white/5">
            Join Waitlist
         </button>
      </motion.div>

      {/* Platform Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-12">
         {[
           { label: "AI Generations", value: "1.2M", icon: <Rocket className="w-5 h-5" /> },
           { label: "Accuracy Rate", value: "98.4%", icon: <ShieldCheck className="w-5 h-5" /> },
           { label: "Models Active", value: "Mistral-7B", icon: <Zap className="w-5 h-5" /> },
           { label: "Average Latency", value: "1.2s", icon: <Monitor className="w-5 h-5" /> },
         ].map((stat, i) => (
           <div key={i} className="text-center md:text-left space-y-1">
              <div className="flex items-center justify-center md:justify-start gap-2 text-primary font-bold">
                 {stat.icon}
                 <span className="text-lg font-black text-white tracking-tighter italic">{stat.value}</span>
              </div>
              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">{stat.label}</p>
           </div>
         ))}
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { 
  FileText, 
  Sparkles, 
  Search, 
  Loader2, 
  CheckCircle2, 
  Copy, 
  Zap, 
  BrainCircuit,
  ArrowLeft,
  Youtube,
  Quote
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import apiClient from "@/lib/apiClient";
import Link from "next/link";
import toast from "react-hot-toast";

export default function SummarizerPage() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState<any>(null);

  const handleSummarize = async () => {
    if (!input.trim() || loading) return;
    setLoading(true);
    setSummary(null);

    try {
      // For now, using the chat-tutor endpoint as it uses the same Mistral LLM
      // But we prompt it specifically for summarization
      const res = await apiClient.post("/ai/chat", { 
        message: `Summarize the following content into key insights and a concise overview. Provide the output in a structured way with a "summary" and "key_points" (as an array). Input: ${input}`
      });

      // Try to parse if it returned JSON, else show raw
      let text = res.data.reply;
      try {
        const jsonStart = text.indexOf('{');
        const jsonEnd = text.lastIndexOf('}') + 1;
        if (jsonStart !== -1) {
          const parsed = JSON.parse(text.substring(jsonStart, jsonEnd));
          setSummary(parsed);
        } else {
           setSummary({ summary: text, key_points: [] });
        }
      } catch {
        setSummary({ summary: text, key_points: [] });
      }
    } catch (err: any) {
      console.error(err);
      toast.error("Failed to generate summary. Neural logic timed out.");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    const text = summary ? `${summary.summary}\n\n${summary.key_points?.join("\n")}` : "";
    navigator.clipboard.writeText(text);
    toast.success("Summary copied to clipboard!");
  };

  return (
    <div className="p-8 md:p-12 space-y-12 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
         <Link href="/ai-tools" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl glass-card flex items-center justify-center group-hover:bg-primary/20 transition-all">
               <ArrowLeft className="w-5 h-5 text-white" />
            </div>
            <span className="text-xs font-black text-white uppercase tracking-widest hidden md:block">Back to Hub</span>
         </Link>

         <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-2xl">
               <FileText className="w-7 h-7" />
            </div>
            <div>
               <h1 className="text-2xl font-black text-white uppercase tracking-tighter italic leading-none">Smart Summarizer</h1>
               <span className="text-[10px] font-black text-primary uppercase tracking-[0.3em]">Knowledge Extraction Engine</span>
            </div>
         </div>

         <div className="w-10 md:w-32" />
      </div>

      {/* Input Section */}
      <section className="space-y-6">
         <div className="glass-premium p-8 rounded-[48px] border-white/5 space-y-6">
            <div className="flex items-center justify-between">
               <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                  <span className="text-[10px] font-black text-white uppercase tracking-widest">Input Neural Source</span>
               </div>
               <div className="flex gap-2">
                  <button className="px-4 py-1.5 rounded-full bg-white/5 text-[9px] font-black text-muted-foreground uppercase border border-white/10 hover:bg-primary/20 hover:text-primary transition-all">
                    Paste Text
                  </button>
                  <button className="px-4 py-1.5 rounded-full bg-white/5 text-[9px] font-black text-muted-foreground uppercase border border-white/10 hover:bg-red-500/20 hover:text-red-500 transition-all">
                    <Youtube className="w-3 h-3 inline-block mr-1 mb-0.5" /> Video URL
                  </button>
               </div>
            </div>

            <textarea 
              placeholder="Paste your long-form text, documentation, or YouTube URL here..." 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="w-full h-48 bg-white/5 border border-white/10 rounded-[32px] p-8 text-white focus:outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all font-medium placeholder:text-muted-foreground/30 resize-none"
            />

            <button 
              onClick={handleSummarize}
              disabled={loading || !input.trim()}
              className="w-full py-6 bg-primary text-white rounded-[32px] font-black uppercase text-xs tracking-[0.2em] shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:scale-100 flex items-center justify-center gap-3 overflow-hidden group relative"
            >
               <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
               {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Zap className="w-5 h-5" /> Generate Insights</>}
            </button>
         </div>
      </section>

      {/* Output Section */}
      <section className="min-h-[400px] relative">
         <AnimatePresence mode="wait">
            {loading && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 flex flex-col items-center justify-center space-y-6"
              >
                 <div className="relative">
                    <div className="w-16 h-16 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
                    <BrainCircuit className="absolute inset-0 m-auto w-6 h-6 text-primary animate-pulse" />
                 </div>
                 <p className="text-primary font-black uppercase tracking-[0.2em] animate-pulse">Decompressing Knowledge...</p>
              </motion.div>
            )}

            {summary && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-8"
              >
                 {/* Main Summary */}
                 <div className="glass-card p-10 rounded-[48px] border-primary/20 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-8">
                       <Quote className="w-12 h-12 text-primary opacity-10" />
                    </div>
                    <div className="flex items-center justify-between mb-8">
                       <h3 className="text-lg font-black text-white uppercase tracking-tight">AI Generated Overview</h3>
                       <button 
                         onClick={copyToClipboard}
                         className="p-3 rounded-2xl glass hover:bg-white/10 text-muted-foreground hover:text-white transition-all"
                       >
                          <Copy className="w-4 h-4" />
                       </button>
                    </div>
                    <p className="text-sm text-muted-foreground font-medium leading-relaxed">
                      {summary.summary || summary}
                    </p>
                 </div>

                 {/* Key Points */}
                 {summary.key_points?.length > 0 && (
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {summary.key_points.map((point: string, i: number) => (
                        <motion.div 
                          key={i}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: i * 0.1 }}
                          className="glass-premium p-6 rounded-3xl border-white/5 flex gap-4 items-start"
                        >
                           <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                              <CheckCircle2 className="w-4 h-4" />
                           </div>
                           <p className="text-[11px] font-bold text-white leading-snug">{point}</p>
                        </motion.div>
                      ))}
                   </div>
                 )}
              </motion.div>
            )}

            {!summary && !loading && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="py-20 border-2 border-dashed border-white/5 rounded-[48px] flex flex-col items-center justify-center text-center space-y-4"
              >
                 <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center text-muted-foreground">
                    <Sparkles className="w-10 h-10" />
                 </div>
                 <p className="text-muted-foreground font-medium italic">Your executive summary will appear here.</p>
              </motion.div>
            )}
         </AnimatePresence>
      </section>
    </div>
  );
}

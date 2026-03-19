"use client";

import { useState, useEffect, useRef } from "react";
import { 
  Sparkles, 
  X, 
  Send, 
  Loader2, 
  MessageSquare,
  Bot,
  User,
  Minus,
  Maximize2,
  Cpu,
  Zap,
  Globe
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import apiClient from "@/lib/apiClient";

export default function GlobalAIChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<{ role: 'ai' | 'user', content: string }[]>([
    { role: 'ai', content: "Hello! I'm SmartLearn AI. I can help you with course navigation, skill roadmaps, or any learning questions. How can I assist you today?" }
  ]);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg = input.trim();
    setInput("");
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setLoading(true);

    try {
      const res = await apiClient.post("/ai/chat", { question: userMsg });
      setMessages(prev => [...prev, { role: 'ai', content: res.data.response }]);
    } catch (err: any) {
      setMessages(prev => [...prev, { role: 'ai', content: "SYSTEM_ERROR: Neural link interrupted. Please reconnect shortly." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-8 right-8 z-[100] flex flex-col items-end pointer-events-none">
      <AnimatePresence>
        {isOpen && !isMinimized && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.9, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: 30, scale: 0.9, filter: "blur(10px)" }}
            className="mb-6 w-[420px] h-[600px] glass-premium rounded-[40px] border-primary/20 shadow-[0_0_100px_rgba(0,0,0,0.8)] flex flex-col overflow-hidden pointer-events-auto relative"
          >
            {/* Glow Background */}
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-primary/10 blur-[80px] rounded-full -z-10" />
            
            {/* Header */}
            <div className="p-6 border-b border-white/5 bg-gradient-to-r from-primary/10 to-transparent flex items-center justify-between relative overflow-hidden">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center shadow-2xl shadow-primary/30 relative group">
                  <div className="absolute inset-0 bg-white/20 animate-pulse rounded-2xl" />
                  <Bot className="text-white w-7 h-7 relative z-10" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-black text-white tracking-tighter uppercase">SmartLearn AI</h3>
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
                  </div>
                  <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em] opacity-80">Neural Assistant</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button onClick={() => setIsMinimized(true)} className="p-2 hover:bg-white/5 rounded-xl text-muted-foreground transition-all">
                  <Minus className="w-5 h-5" />
                </button>
                <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-red-500/10 rounded-xl text-muted-foreground hover:text-red-400 transition-all">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide">
              {messages.map((msg, i) => (
                <div key={i} className={cn("flex flex-col", msg.role === 'user' ? "items-end" : "items-start")}>
                  <div className={cn(
                    "max-w-[85%] p-4 rounded-[24px] text-sm leading-relaxed relative group transition-all",
                    msg.role === 'ai' 
                      ? "bg-white/5 text-white rounded-tl-none border border-white/5" 
                      : "bg-primary text-white rounded-tr-none shadow-xl shadow-primary/20"
                  )}>
                    {msg.role === 'ai' && (
                       <Zap className="absolute -left-10 top-0 w-6 h-6 text-primary/30 group-hover:text-primary transition-colors" />
                    )}
                    {msg.content}
                  </div>
                  <span className="text-[9px] text-muted-foreground font-black uppercase tracking-widest mt-2 px-1">
                    {msg.role === 'ai' ? "Model v2.0" : "Me"}
                  </span>
                </div>
              ))}
              {loading && (
                <div className="flex flex-col items-start">
                  <div className="p-4 rounded-[24px] rounded-tl-none bg-white/5 border border-white/5 flex items-center gap-3">
                    <div className="flex gap-1">
                       <motion.div animate={{ scale: [1, 1.5, 1] }} transition={{ repeat: Infinity, duration: 1 }} className="w-1.5 h-1.5 rounded-full bg-primary" />
                       <motion.div animate={{ scale: [1, 1.5, 1] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-1.5 h-1.5 rounded-full bg-primary" />
                       <motion.div animate={{ scale: [1, 1.5, 1] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-1.5 h-1.5 rounded-full bg-primary" />
                    </div>
                    <span className="text-[10px] font-black text-primary uppercase tracking-widest">Processing...</span>
                  </div>
                </div>
              )}
            </div>

            {/* Input Footer */}
            <div className="p-6 border-t border-white/5 bg-background/40 backdrop-blur-xl">
              <div className="relative group">
                <input 
                  type="text" 
                  placeholder="Tell me your learning goals..." 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-6 pr-14 text-sm text-white focus:outline-none focus:border-primary/50 transition-all font-medium placeholder:text-muted-foreground/30"
                />
                <button 
                  onClick={handleSend}
                  disabled={loading || !input.trim()}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2.5 bg-primary text-white rounded-xl hover:scale-110 active:scale-90 transition-all shadow-xl shadow-primary/30"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
              <div className="flex items-center justify-between mt-4 px-1">
                 <div className="flex items-center gap-3">
                    <Globe className="w-3 h-3 text-muted-foreground" />
                    <span className="text-[9px] text-muted-foreground font-bold uppercase tracking-widest">Global Assist</span>
                 </div>
                 <span className="text-[9px] text-muted-foreground font-bold">Press Enter ↵</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Glowium FAB */}
      <div className="pointer-events-auto relative">
        <motion.div
           animate={{ 
             scale: [1, 1.2, 1],
             opacity: [0.3, 0.6, 0.3]
           }}
           transition={{ repeat: Infinity, duration: 4 }}
           className="absolute inset-0 bg-primary blur-[30px] rounded-full"
        />
        <motion.button
          whileHover={{ scale: 1.1, rotate: 5 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => {
            setIsOpen(true);
            setIsMinimized(false);
          }}
          className={cn(
            "w-20 h-20 rounded-full bg-gradient-to-br from-primary to-indigo-600 flex items-center justify-center text-white shadow-[0_20px_60px_rgba(168,85,247,0.5)] group relative overflow-hidden border-2 border-white/20",
            isOpen && !isMinimized ? "hidden" : "flex"
          )}
        >
          {/* Internal Glow Glass */}
          <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
          
          {/* Animated SVG Robot / AI Icon */}
          <div className="relative z-10 flex flex-col items-center">
            {isMinimized ? (
               <MessageSquare className="w-9 h-9" />
            ) : (
               <div className="flex flex-col items-center">
                  <motion.div 
                    animate={{ y: [0, -2, 0] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                  >
                    <Bot className="w-10 h-10 group-hover:scale-110 transition-transform" />
                  </motion.div>
                  <motion.div 
                    animate={{ scaleX: [1, 1.1, 1] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                    className="w-6 h-1 bg-white/30 rounded-full blur-[1px] mt-1" 
                  />
               </div>
            )}
          </div>

          {/* New Message Dot */}
          <span className="absolute top-2 right-2 w-4 h-4 bg-red-500 rounded-full border-2 border-[#0A0A0A] shadow-lg shadow-red-500/50" />
        </motion.button>
      </div>
    </div>
  );
}

"use client";

import { 
  HelpCircle, 
  Book, 
  MessageSquare, 
  LifeBuoy, 
  FileText, 
  Search, 
  ChevronRight, 
  PlayCircle,
  ShieldQuestion,
  Headphones,
  Mail,
  ExternalLink
} from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default function SupportPage() {
  const faqs = [
    { q: "How do I download my certificate?", a: "Once you complete 100% of a course, a 'Download' button will appear in your Courses dashboard and on the course page." },
    { q: "What is the token limit for AI tools?", a: "Free tier users get 5,000 tokens per month. Pro users have unlimited access to all Mistral-powered tools." },
    { q: "Can I access courses offline?", a: "Currently, we only support online streaming to ensure the latest AI features are integrated with your learning path." },
    { q: "How is my progress calculated?", a: "Progress is tracked based on video completion and quiz scores. You must finish a video to mark it as complete." },
  ];

  return (
    <div className="p-8 md:p-12 space-y-12 max-w-7xl mx-auto pb-32">
       {/* Hero Section */}
       <div className="space-y-6">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-[0.3em] w-fit"
          >
            <LifeBuoy className="w-4 h-4" />
            Support Center
          </motion.div>
          <h1 className="text-5xl md:text-8xl font-black text-white tracking-tighter leading-none italic uppercase">
             How can we <span className="text-gradient">Help?</span>
          </h1>
          
          <div className="relative max-w-2xl mt-8">
             <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
             <input 
               type="text" 
               placeholder="Search for answers, guides, or tutorials..." 
               className="w-full bg-white/5 border border-white/10 rounded-[32px] py-6 pl-16 pr-8 text-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all text-lg font-medium"
             />
          </div>
       </div>

       {/* Support Channels */}
       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { title: "Documentation", desc: "Browse in-depth guides", icon: <FileText />, link: "#", color: "text-blue-400" },
            { title: "AI Assistant", desc: "Instant answers from Gemini", icon: <MessageSquare />, link: "#", color: "text-primary" },
            { title: "Report Issue", desc: "Technical support ticket", icon: <ShieldQuestion />, link: "mailto:support@smartlearn.ai", color: "text-red-400" }
          ].map((channel, i) => (
             <Link href={channel.link} key={i}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="glass-premium p-8 rounded-[40px] border-white/5 space-y-4 hover:border-primary/30 transition-all group"
                >
                   <div className={cn("w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform", channel.color)}>
                      {channel.icon}
                   </div>
                   <div>
                      <h3 className="text-lg font-black text-white uppercase tracking-tighter">{channel.title}</h3>
                      <p className="text-xs text-muted-foreground font-medium uppercase mt-1">{channel.desc}</p>
                   </div>
                   <div className="pt-4 flex items-center gap-2 text-[10px] font-black text-primary uppercase tracking-widest group-hover:gap-4 transition-all">
                      Access Channel <ChevronRight className="w-4 h-4" />
                   </div>
                </motion.div>
             </Link>
          ))}
       </div>

       {/* FAQ Section */}
       <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-12 space-y-8">
             <h3 className="text-2xl font-black text-white uppercase tracking-tighter italic">Frequently Asked Questions</h3>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {faqs.map((faq, i) => (
                   <div key={i} className="glass-card p-8 rounded-[32px] border-white/5 space-y-3">
                      <div className="flex items-start gap-4">
                         <HelpCircle className="w-5 h-5 text-primary shrink-0 mt-1" />
                         <div className="space-y-2">
                            <h4 className="text-sm font-black text-white uppercase tracking-tight">{faq.q}</h4>
                            <p className="text-xs text-muted-foreground leading-relaxed italic">{faq.a}</p>
                         </div>
                      </div>
                   </div>
                ))}
             </div>
          </div>
       </div>

       {/* Contact Card */}
       <div className="glass-premium p-12 rounded-[56px] border-white/5 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-primary/5 to-transparent pointer-events-none" />
          <div className="space-y-4 relative z-10 text-center md:text-left">
             <h2 className="text-3xl font-black text-white uppercase tracking-tighter italic">Still need help?</h2>
             <p className="text-muted-foreground max-w-md font-medium">Our neural response team is available 24/7 for premium subscribers.</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 relative z-10 w-full md:w-auto">
             <button className="px-8 py-5 bg-white text-black text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl hover:scale-105 transition-all">
                Book a Call
             </button>
             <button className="px-8 py-5 glass text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl border border-white/10 hover:bg-white/5 transition-all">
                Live Chat
             </button>
          </div>
       </div>
    </div>
  );
}

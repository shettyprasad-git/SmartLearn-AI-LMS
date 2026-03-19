"use client";

import { 
  Users, 
  MessageSquare, 
  Trophy, 
  Star, 
  Zap, 
  Flame, 
  Share2, 
  Search, 
  Plus, 
  Hash, 
  Compass, 
  TrendingUp,
  Heart
} from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default function CommunityPage() {
  const leaderboard = [
    { name: "Prasad Shetty", points: 12540, rank: 1, avatar: "PS", color: "bg-yellow-400" },
    { name: "Alex Rivers", points: 10420, rank: 2, avatar: "AR", color: "bg-slate-300" },
    { name: "Satoshi N.", points: 9850, rank: 3, avatar: "SN", color: "bg-orange-400" },
    { name: "Elena K.", points: 8120, rank: 4, avatar: "EK", color: "bg-blue-400" },
    { name: "David G.", points: 7640, rank: 5, avatar: "DG", color: "bg-purple-400" },
  ];

  const threads = [
    { title: "Best resources for learning Next.js 14 App Router?", author: "Alex R.", category: "Web dev", comments: 12, likes: 24, time: "2h ago" },
    { title: "How to optimize Mistral 7B prompts for better quiz generation?", author: "Sarah W.", category: "AI Help", comments: 34, likes: 58, time: "5h ago" },
    { title: "Weekly Study Group: Python for Data Science", author: "Prasad S.", category: "Group Study", comments: 8, likes: 15, time: "1d ago" },
  ];

  return (
    <div className="p-8 md:p-12 space-y-12 max-w-7xl mx-auto pb-32">
       {/* Hero Section */}
       <div className="flex flex-col lg:flex-row gap-12 lg:items-end justify-between border-b border-white/5 pb-16">
          <div className="space-y-6">
             <motion.div 
               initial={{ opacity: 0, x: -20 }}
               animate={{ opacity: 1, x: 0 }}
               className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-[0.3em] w-fit"
             >
               <Users className="w-4 h-4" />
               Global Community
             </motion.div>
             <h1 className="text-5xl md:text-8xl font-black text-white tracking-tighter leading-none italic uppercase">
                Neural <span className="text-gradient">Space.</span>
             </h1>
             <p className="text-muted-foreground max-w-xl font-medium tracking-tight text-lg leading-relaxed">
                Connect with thousands of learners worldwide. Share insights, compete on the leaderboard, and grow your neural network.
             </p>
          </div>

          <div className="flex gap-4">
             <button className="px-10 py-5 bg-primary text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-[24px] shadow-2xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-3">
                <Plus className="w-4 h-4" /> Start Discussion
             </button>
          </div>
       </div>

       <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Main Feed */}
          <div className="lg:col-span-8 space-y-8">
             <div className="flex items-center justify-between">
                <div className="flex gap-8">
                   <button className="text-[10px] font-black text-white uppercase tracking-widest border-b-2 border-primary pb-2">Trending</button>
                   <button className="text-[10px] font-black text-muted-foreground uppercase tracking-widest hover:text-white pb-2 transition-colors">Latest</button>
                   <button className="text-[10px] font-black text-muted-foreground uppercase tracking-widest hover:text-white pb-2 transition-colors">Following</button>
                </div>
                <div className="flex items-center gap-2 text-primary">
                   <Compass className="w-4 h-4" />
                   <span className="text-[10px] font-black uppercase tracking-widest">Discover Hubs</span>
                </div>
             </div>

             <div className="space-y-4">
                {threads.map((thread, i) => (
                   <motion.div 
                     key={i}
                     initial={{ opacity: 0, y: 10 }}
                     animate={{ opacity: 1, y: 0 }}
                     transition={{ delay: i * 0.1 }}
                     className="glass-card p-8 rounded-[40px] border-white/5 hover:border-primary/30 transition-all space-y-6 group"
                   >
                      <div className="flex justify-between items-start">
                         <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-[10px] font-black text-white">{thread.author.substring(0,2)}</div>
                            <span className="text-xs font-black text-white/50 uppercase tracking-tight">{thread.author} <span className="mx-2 text-white/10">•</span> {thread.time}</span>
                         </div>
                         <div className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[8px] font-black text-muted-foreground uppercase tracking-widest">{thread.category}</div>
                      </div>

                      <h3 className="text-xl font-bold text-white group-hover:text-primary transition-colors leading-tight">{thread.title}</h3>

                      <div className="flex items-center justify-between pt-4 border-t border-white/5">
                         <div className="flex gap-6">
                            <button className="flex items-center gap-2 text-muted-foreground hover:text-pink-400 transition-colors">
                               <Heart className="w-4 h-4" />
                               <span className="text-[10px] font-black">{thread.likes}</span>
                            </button>
                            <button className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
                               <MessageSquare className="w-4 h-4" />
                               <span className="text-[10px] font-black">{thread.comments}</span>
                            </button>
                         </div>
                         <button className="p-3 glass rounded-xl text-muted-foreground hover:text-white transition-all">
                            <Share2 className="w-4 h-4" />
                         </button>
                      </div>
                   </motion.div>
                ))}
             </div>
          </div>

          {/* Sidebar Widgets */}
          <div className="lg:col-span-4 space-y-8">
             
             {/* Leaderboard */}
             <div className="glass-premium p-8 rounded-[48px] border-white/5 space-y-8">
                <div className="flex items-center gap-3">
                   <Trophy className="w-6 h-6 text-yellow-500" />
                   <h3 className="text-lg font-black text-white uppercase tracking-tighter">Leaderboard</h3>
                </div>

                <div className="space-y-6">
                   {leaderboard.map((user, i) => (
                      <div key={i} className="flex items-center justify-between group">
                         <div className="flex items-center gap-4">
                            <div className="text-xs font-black text-white/20 w-4">#{user.rank}</div>
                            <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center text-[10px] font-black text-white shadow-lg", user.color)}>
                               {user.avatar}
                            </div>
                            <div className="min-w-0">
                               <span className="text-xs font-black text-white uppercase truncate block transition-colors group-hover:text-primary">{user.name}</span>
                               <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-widest">{user.points.toLocaleString()} pts</span>
                            </div>
                         </div>
                         {user.rank === 1 && <Flame className="w-4 h-4 text-orange-500 animate-pulse" />}
                      </div>
                   ))}
                </div>

                <button className="w-full py-4 glass hover:bg-white/10 text-white border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all">
                   View Full Rankings
                </button>
             </div>

             {/* Trending Hubs */}
             <div className="glass-premium p-8 rounded-[40px] border-white/5 space-y-6">
                <div className="flex items-center gap-3">
                   <Hash className="w-5 h-5 text-primary" />
                   <h3 className="text-md font-black text-white uppercase tracking-tighter">Trending Hubs</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                   {["NextJS", "PromptEngineering", "CareerGrowth", "PythonStats", "Web3", "UIUX"].map((tag) => (
                      <button key={tag} className="px-4 py-2 rounded-xl glass text-[8px] font-black uppercase text-muted-foreground hover:text-white hover:border-primary/50 border border-white/5 transition-all">#{tag}</button>
                   ))}
                </div>
             </div>

          </div>

       </div>
    </div>
  );
}

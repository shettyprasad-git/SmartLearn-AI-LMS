"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import apiClient from "@/lib/apiClient";
import { ShieldCheck, Calendar, User, BookOpen, AlertTriangle, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

export default function VerifyPage() {
  const { code } = useParams();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    apiClient.get(`/certificates/verify/${code}`)
      .then(res => setData(res.data))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [code]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-background">
       <Loader2 className="w-10 h-10 text-primary animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[radial-gradient(circle_at_top_right,_#7c3aed_0%,_transparent_25%),_radial-gradient(circle_at_bottom_left,_#3b82f6_0%,_transparent_20%)] bg-background">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-2xl"
      >
        <div className="glass-card p-10 md:p-16 rounded-[64px] border-white/10 relative overflow-hidden text-center space-y-10">
          {/* Decorative elements */}
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary via-purple-500 to-blue-500" />
          
          {error ? (
            <div className="space-y-6">
               <div className="w-20 h-20 rounded-full bg-red-500/10 mx-auto flex items-center justify-center text-red-500 border border-red-500/20">
                  <AlertTriangle className="w-10 h-10" />
               </div>
               <div className="space-y-2">
                 <h1 className="text-3xl font-black text-white">Invalid Certificate</h1>
                 <p className="text-muted-foreground">The certificate code <b>{code}</b> could not be verified in our system. Please check the ID and try again.</p>
               </div>
            </div>
          ) : (
            <>
              <div className="space-y-6">
                <div className="w-24 h-24 rounded-[32px] bg-primary/10 mx-auto flex items-center justify-center text-primary shadow-2xl shadow-primary/20 border-2 border-primary/20">
                   <ShieldCheck className="w-12 h-12" />
                </div>
                <div className="space-y-2">
                  <h1 className="text-[12px] font-black tracking-[0.3em] uppercase text-primary">Certificate of Excellence</h1>
                  <h2 className="text-4xl font-black text-white tracking-tight">Verified Achievement</h2>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
                 <div className="space-y-4 p-6 glass rounded-3xl border-white/5">
                    <div className="flex items-center gap-3 text-muted-foreground uppercase text-[10px] font-black tracking-widest">
                       <User className="w-4 h-4" /> Recipient
                    </div>
                    <p className="text-xl font-bold text-white">{data.userName}</p>
                 </div>
                 <div className="space-y-4 p-6 glass rounded-3xl border-white/5">
                    <div className="flex items-center gap-3 text-muted-foreground uppercase text-[10px] font-black tracking-widest">
                       <BookOpen className="w-4 h-4" /> Course
                    </div>
                    <p className="text-xl font-bold text-white">{data.courseName}</p>
                 </div>
                 <div className="space-y-4 p-6 glass rounded-3xl border-white/5">
                    <div className="flex items-center gap-3 text-muted-foreground uppercase text-[10px] font-black tracking-widest">
                       <Calendar className="w-4 h-4" /> Issue Date
                    </div>
                    <p className="text-xl font-bold text-white">{new Date(data.issuedAt).toLocaleDateString("en-US", { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                 </div>
                 <div className="space-y-4 p-6 glass rounded-3xl border-white/5">
                    <div className="flex items-center gap-3 text-muted-foreground uppercase text-[10px] font-black tracking-widest">
                       <ShieldCheck className="w-4 h-4" /> Credential ID
                    </div>
                    <p className="text-xl font-black text-primary font-mono">{code}</p>
                 </div>
              </div>

              <div className="pt-10 border-t border-white/5 space-y-4">
                 <p className="text-sm text-muted-foreground">This certificate verifies that the recipient has successfully completed all required modules and passed assessments for the mentioned course on the SmartLearn AI Platform.</p>
                 <div className="flex items-center justify-center gap-3 text-[10px] font-black text-primary uppercase tracking-[0.2em]">
                    <span className="w-10 h-[1px] bg-primary/30" />
                    Verified by SmartLearn AI
                    <span className="w-10 h-[1px] bg-primary/30" />
                 </div>
              </div>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
}

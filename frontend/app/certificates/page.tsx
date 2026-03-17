"use client";

import { useEffect, useState } from "react";
import apiClient from "@/lib/apiClient";
import { 
  Award, 
  Download, 
  ExternalLink, 
  CheckCircle2, 
  Search,
  BookOpen,
  ArrowRight
} from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default function CertificatesPage() {
  const [subjects, setSubjects] = useState<any[]>([]);
  const [certificates, setCertificates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [subsRes] = await Promise.all([
        apiClient.get("/subjects/enrolled") // Assuming this endpoint exists, or I'll filter
      ]);
      // If endpoint doesn't exist, I'll just get all and filter locally for simplicity in this demo
      const allSubs = await apiClient.get("/subjects");
      setSubjects(allSubs.data);
      
      // Fetch certificates for each subject if possible, or assume an endpoint exists
      // For now let's just show those that are completed
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-10 space-y-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-black text-white px-2 border-l-8 border-primary tracking-tight uppercase">My Achievements</h1>
          <p className="text-muted-foreground ml-2">Verified proof of your technical mastery.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pb-20">
        {loading ? (
          [1, 2].map(i => <div key={i} className="h-48 glass animate-pulse rounded-[40px]" />)
        ) : (
          [
            { title: "React Mastery", status: "Completed", code: "LMS-2026-0034", date: "Mar 12, 2026" },
            { title: "Advanced Node.js", status: "In Progress", progress: "60%" }
          ].map((cert, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              className="glass-card p-8 rounded-[40px] border-white/5 group hover:border-primary/30 transition-all flex flex-col justify-between"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-5">
                   <div className={cn(
                     "w-16 h-16 rounded-[24px] flex items-center justify-center shadow-2xl",
                     cert.status === "Completed" ? "bg-primary/20 text-primary shadow-primary/20" : "bg-white/5 text-muted-foreground"
                   )}>
                      <Award className="w-8 h-8" />
                   </div>
                   <div className="space-y-1">
                      <h3 className="text-xl font-bold text-white group-hover:text-primary transition-colors">{cert.title}</h3>
                      <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{cert.status}</p>
                   </div>
                </div>
                {cert.status === "Completed" && <CheckCircle2 className="text-green-400 w-6 h-6" />}
              </div>

              <div className="mt-8 flex items-center justify-between border-t border-white/5 pt-6">
                 <div className="flex flex-col">
                    {cert.code ? (
                      <>
                        <span className="text-[10px] font-black text-muted-foreground uppercase tracking-wider">ID: {cert.code}</span>
                        <span className="text-xs font-bold text-white mt-0.5">Issued on {cert.date}</span>
                      </>
                    ) : (
                      <div className="w-32 h-1.5 bg-white/5 rounded-full overflow-hidden">
                         <div className="bg-primary h-full w-[60%]" />
                      </div>
                    )}
                 </div>
                 <div className="flex items-center gap-3">
                    {cert.status === "Completed" ? (
                      <>
                        <Link href={`/certificates/verify/${cert.code}`} className="p-3 glass rounded-xl text-muted-foreground hover:text-white transition-all">
                          <ExternalLink className="w-4 h-4" />
                        </Link>
                        <button className="px-5 py-3 bg-primary text-white rounded-xl font-bold text-sm hover:scale-105 active:scale-95 transition-all flex items-center gap-2">
                           <Download className="w-4 h-4" /> PDF
                        </button>
                      </>
                    ) : (
                      <Link href="/subjects" className="text-sm font-bold text-primary flex items-center gap-2 hover:underline">
                        Continue <ArrowRight className="w-4 h-4" />
                      </Link>
                    )}
                 </div>
              </div>
            </motion.div>
          ))
        )}
      </div>

      <section className="glass p-10 rounded-[48px] border-white/5 flex flex-col items-center text-center space-y-6">
         <div className="w-20 h-20 rounded-3xl bg-primary/10 flex items-center justify-center text-primary">
            <Search className="w-10 h-10" />
         </div>
         <div className="space-y-2">
            <h2 className="text-2xl font-black text-white px-2">Verify a Certificate</h2>
            <p className="text-muted-foreground max-w-md">Employers and institutions can verify the authenticity of certificates using the unique credential ID.</p>
         </div>
         <div className="relative w-full max-w-sm">
            <input 
              type="text" 
              placeholder="Enter Certificate ID (e.g. LMS-2026-XXXX)" 
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-sm text-center focus:outline-none focus:border-primary/50 transition-all font-mono"
            />
            <button className="absolute right-2 top-2 bottom-2 px-4 bg-primary text-white rounded-xl font-bold text-xs hover:bg-primary/80 transition-all">Verify</button>
         </div>
      </section>
    </div>
  );
}


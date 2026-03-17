"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import apiClient from "@/lib/apiClient";
import { 
  Play, 
  CheckCircle2, 
  Clock, 
  ChevronRight, 
  ChevronDown, 
  Lock, 
  BookOpen, 
  ShieldCheck,
  ArrowLeft 
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useAuthStore } from "@/store/authStore";

export default function SubjectDetailPage() {
  const { subjectId } = useParams();
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  
  const [subject, setSubject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [openSections, setOpenSections] = useState<string[]>([]);

  useEffect(() => {
    fetchSubject();
  }, [subjectId]);

  const fetchSubject = async () => {
    try {
      const res = await apiClient.get(`/subjects/${subjectId}`);
      setSubject(res.data);
      setIsEnrolled(res.data.isEnrolled);
      // Open the first section by default
      if (res.data.sections?.length > 0) {
        setOpenSections([res.data.sections[0].id]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async () => {
    if (!isAuthenticated) {
      router.push("/auth/login");
      return;
    }
    setEnrolling(true);
    try {
      await apiClient.post(`/subjects/${subjectId}/enroll`);
      setIsEnrolled(true);
      fetchSubject();
    } catch (err) {
      console.error(err);
    } finally {
      setEnrolling(false);
    }
  };

  const toggleSection = (id: string) => {
    setOpenSections(prev => 
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  if (loading) return <div className="p-10 animate-pulse space-y-8">
    <div className="h-64 bg-white/5 rounded-[40px]" />
    <div className="h-96 bg-white/5 rounded-[40px]" />
  </div>;

  if (!subject) return <div className="p-10 text-center text-white">Subject not found.</div>;

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 space-y-10">
      <Link href="/subjects" className="inline-flex items-center gap-2 text-muted-foreground hover:text-white transition-colors mb-4 group">
        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" /> Back to Catalog
      </Link>

      {/* Hero Section */}
      <section className="relative h-80 rounded-[40px] overflow-hidden border border-white/10 group">
        <img 
          src={`https://img.youtube.com/vi/${subject.slug}/maxresdefault.jpg`} 
          onError={(e: any) => e.target.src = `https://img.youtube.com/vi/${subject.slug}/0.jpg`}
          className="w-full h-full object-cover opacity-40 group-hover:scale-105 transition-transform duration-1000"
          alt=""
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        
        <div className="absolute inset-0 p-10 flex flex-col justify-end gap-4">
          <div className="flex items-center gap-3">
            <span className="bg-primary px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">Premium Content</span>
            <span className="bg-white/10 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest text-white">8 Lessons</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">{subject.title}</h1>
          <div className="flex items-center gap-6 mt-2">
            {!isEnrolled ? (
              <button 
                onClick={handleEnroll}
                disabled={enrolling}
                className="px-10 py-4 bg-white text-black rounded-2xl font-bold text-lg hover:bg-primary hover:text-white hover:scale-105 active:scale-95 transition-all shadow-2xl"
              >
                {enrolling ? "Enrolling..." : "Enroll for Free"}
              </button>
            ) : (
              <Link 
                href={`/subjects/${subjectId}/video/${subject.sections[0]?.videos[0]?.id}`}
                className="px-10 py-4 bg-primary text-white rounded-2xl font-bold text-lg hover:shadow-2xl hover:shadow-primary/30 hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
              >
                Continue Learning <Play className="w-5 h-5" />
              </Link>
            )}
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-10">
          <section className="space-y-4">
             <h2 className="text-2xl font-black text-white px-2 border-l-4 border-primary">Course Overview</h2>
             <p className="text-muted-foreground leading-relaxed">
               {subject.description || "In this course, you will dive deep into the concepts through structured learning. Each module is carefully designed to build upon the previous one, ensuring a solid foundation."}
             </p>
             <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pt-4">
                {[
                  { icon: BookOpen, label: "Full Lifetime Access" },
                  { icon: Play, label: "Expert Videos" },
                  { icon: ShieldCheck, label: "Certificate Included" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 p-4 glass rounded-2xl border-white/5">
                     <item.icon className="text-primary w-5 h-5" />
                     <span className="text-xs font-bold text-white">{item.label}</span>
                  </div>
                ))}
             </div>
          </section>

          <section className="space-y-6">
            <h2 className="text-2xl font-black text-white px-2 border-l-4 border-primary">Curriculum</h2>
            <div className="space-y-4">
              {subject.sections?.map((section: any, sectionIdx: number) => (
                <div key={section.id} className="glass rounded-[32px] border-white/5 overflow-hidden">
                  <button 
                    onClick={() => toggleSection(section.id)}
                    className="w-full flex items-center justify-between p-6 hover:bg-white/5 transition-colors"
                  >
                    <div className="flex items-center gap-4 text-left">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold">
                        {sectionIdx + 1}
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-white">{section.title}</h3>
                        <p className="text-xs text-muted-foreground">{section.videos?.length || 0} Lessons</p>
                      </div>
                    </div>
                    {openSections.includes(section.id) ? <ChevronDown className="w-6 h-6" /> : <ChevronRight className="w-6 h-6" />}
                  </button>

                  <AnimatePresence>
                    {openSections.includes(section.id) && (
                      <motion.div 
                        initial={{ height: 0 }}
                        animate={{ height: "auto" }}
                        exit={{ height: 0 }}
                        className="overflow-hidden border-t border-white/5"
                      >
                        <div className="p-4 space-y-2">
                           {section.videos?.map((video: any, videoIdx: number) => (
                             <Link 
                               key={video.id} 
                               href={isEnrolled ? `/subjects/${subjectId}/video/${video.id}` : "#"}
                               className={cn(
                                 "flex items-center justify-between p-4 rounded-2xl transition-all group",
                                 isEnrolled ? "hover:bg-white/5 cursor-pointer" : "opacity-50 cursor-not-allowed"
                               )}
                             >
                                <div className="flex items-center gap-4">
                                   <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-xs font-black text-muted-foreground group-hover:text-primary transition-colors">
                                      {videoIdx + 1}
                                   </div>
                                   <div className="flex flex-col">
                                      <span className="text-sm font-semibold text-white group-hover:text-primary transition-colors">{video.title}</span>
                                      <div className="flex items-center gap-3 mt-1">
                                         <span className="flex items-center gap-1 text-[10px] text-muted-foreground"><Clock className="w-3 h-3" /> {Math.floor(video.duration_seconds / 60)}m</span>
                                      </div>
                                   </div>
                                </div>
                                {isEnrolled ? (
                                  <div className="w-8 h-8 rounded-full flex items-center justify-center border border-white/10 group-hover:border-primary transition-all">
                                    <Play className="w-4 h-4 text-muted-foreground group-hover:text-primary" />
                                  </div>
                                ) : (
                                  <Lock className="w-4 h-4 text-muted-foreground" />
                                )}
                             </Link>
                           ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="space-y-8">
           <div className="glass-card p-8 rounded-[40px] border-primary/20 sticky top-24">
              <h3 className="text-xl font-black text-white mb-6">Course Benefits</h3>
              <ul className="space-y-4">
                {[
                  "Self-paced learning",
                  "AI Tutor support available 24/7",
                  "Verified Certificates",
                  "Structured Learning Path"
                ].map((benefit, i) => (
                  <li key={i} className="flex items-start gap-4 text-sm text-muted-foreground">
                    <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
                    {benefit}
                  </li>
                ))}
              </ul>
              
              <div className="mt-8 pt-8 border-t border-white/5">
                 {!isEnrolled ? (
                   <button 
                     onClick={handleEnroll}
                     disabled={enrolling}
                     className="w-full py-4 bg-primary text-white rounded-2xl font-bold text-lg hover:shadow-2xl hover:shadow-primary/30 transition-all"
                   >
                     Enroll Now
                   </button>
                 ) : (
                   <div className="space-y-3">
                      <p className="text-center text-xs font-black text-primary uppercase tracking-widest">You are enrolled!</p>
                      <Link 
                        href={`/subjects/${subjectId}/video/${subject.sections[0]?.videos[0]?.id}`}
                        className="w-full py-4 glass border-primary/20 text-white flex items-center justify-center gap-2 rounded-2xl font-bold text-lg hover:bg-primary/10 transition-all"
                      >
                        Start Playing <Play className="w-4 h-4" />
                      </Link>
                   </div>
                 )}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}

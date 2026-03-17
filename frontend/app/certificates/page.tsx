"use client";

import { useEffect, useState, useRef } from "react";
import apiClient from "@/lib/apiClient";
import { 
  Award, 
  Download, 
  ExternalLink, 
  CheckCircle2, 
  Search,
  BookOpen,
  ArrowRight,
  Loader2,
  Trophy,
  History
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn, formatDate } from "@/lib/utils";
import Link from "next/link";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export default function CertificatesPage() {
  const [certificates, setCertificates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  
  // Ref for the hidden certificate template used for PDF generation
  const certTemplateRef = useRef<HTMLDivElement>(null);
  const [activeDownloadCert, setActiveDownloadCert] = useState<any>(null);

  useEffect(() => {
    fetchCertificates();
  }, []);

  const fetchCertificates = async () => {
    try {
      const res = await apiClient.get("/certificates");
      setCertificates(res.data);
    } catch (err) {
      console.error("Failed to fetch certificates:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = async (cert: any) => {
    setDownloadingId(cert.id);
    setActiveDownloadCert(cert);
    
    // Wait for the template to render with the correct data
    setTimeout(async () => {
      try {
        const element = certTemplateRef.current;
        if (!element) return;

        const canvas = await html2canvas(element, {
          scale: 2,
          useCORS: true,
          backgroundColor: "#ffffff"
        });
        
        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF("l", "mm", "a4");
        const imgProps = pdf.getImageProperties(imgData);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
        
        pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
        pdf.save(`Certificate-${cert.subject.title.replace(/\s+/g, "-")}.pdf`);
      } catch (err) {
        console.error("Failed to download PDF", err);
      } finally {
        setDownloadingId(null);
        setActiveDownloadCert(null);
      }
    }, 500);
  };

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-10 space-y-10 relative">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
             <Trophy className="w-8 h-8 text-primary" />
             <h1 className="text-4xl font-black text-white tracking-tight uppercase">My Achievements</h1>
          </div>
          <p className="text-muted-foreground ml-11">Verified proof of your technical mastery and hard work.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pb-20">
        {loading ? (
          [1, 2].map(i => <div key={i} className="h-56 glass-card animate-pulse rounded-[40px] border-white/5" />)
        ) : certificates.length > 0 ? (
          certificates.map((cert, i) => (
            <motion.div
              key={cert.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              className="glass-card p-8 rounded-[40px] border-white/5 group hover:border-primary/30 transition-all flex flex-col justify-between relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-3xl -mr-10 -mt-10 group-hover:bg-primary/10 transition-all" />
              
              <div className="flex items-start justify-between relative z-10">
                <div className="flex items-center gap-5">
                   <div className="w-16 h-16 rounded-[24px] bg-primary/20 text-primary flex items-center justify-center shadow-2xl shadow-primary/20">
                      <Award className="w-8 h-8" />
                   </div>
                   <div className="space-y-1">
                      <h3 className="text-xl font-bold text-white group-hover:text-primary transition-colors leading-tight">{cert.subject.title}</h3>
                      <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                        <History className="w-3 h-3" /> Issued {formatDate(cert.issued_at)}
                      </p>
                   </div>
                </div>
                <CheckCircle2 className="text-green-400 w-6 h-6" />
              </div>

              <div className="mt-10 flex items-center justify-between border-t border-white/5 pt-6 relative z-10">
                 <div className="flex flex-col">
                    <span className="text-[9px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-1">Verify Authenticity</span>
                    <span className="text-xs font-mono font-bold text-white">{cert.certificate_code}</span>
                    <span className="text-[10px] text-primary font-bold mt-1">Instructor: {cert.subject.tutor_name || "SmartLearn Expert"}</span>
                 </div>
                 <div className="flex items-center gap-3">
                    <button 
                      onClick={() => handleDownloadPDF(cert)}
                      disabled={downloadingId === cert.id}
                      className="px-6 py-3.5 bg-white text-black rounded-2xl font-black text-xs hover:scale-105 active:scale-95 transition-all flex items-center gap-2 shadow-xl"
                    >
                       {downloadingId === cert.id ? (
                         <Loader2 className="w-4 h-4 animate-spin" />
                       ) : (
                         <><Download className="w-4 h-4" /> PDF</>
                       )}
                    </button>
                 </div>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="col-span-1 lg:col-span-2 py-20 bg-white/5 rounded-[48px] border-2 border-dashed border-white/10 flex flex-col items-center justify-center text-center space-y-4">
             <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center text-muted-foreground">
                <BookOpen className="w-10 h-10" />
             </div>
             <p className="text-muted-foreground font-medium">No certificates earned yet. <br /> Finish your first course to unlock your achievements!</p>
             <Link href="/subjects" className="px-6 py-3 bg-primary text-white font-bold rounded-xl hover:scale-105 transition-all">Explore Courses</Link>
          </div>
        )}
      </div>

      <section className="glass-card p-10 rounded-[48px] border-white/5 flex flex-col items-center text-center space-y-6 relative overflow-hidden">
         <div className="absolute inset-0 bg-primary/5 blur-[100px] -z-10" />
         <div className="w-20 h-20 rounded-3xl bg-white/5 flex items-center justify-center text-primary group hover:bg-primary hover:text-white transition-all">
            <Search className="w-10 h-10" />
         </div>
         <div className="space-y-2">
            <h2 className="text-2xl font-black text-white px-2 uppercase tracking-tighter">Verify a Credential</h2>
            <p className="text-muted-foreground max-w-sm text-sm">Employers can verify the authenticity of your knowledge using the unique ID on your certificate.</p>
         </div>
         <div className="relative w-full max-w-sm">
            <input 
              type="text" 
              placeholder="Enter ID (e.g. LMS-2026-XXXX)" 
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 flex items-center justify-center px-6 text-sm text-center focus:outline-none focus:border-primary/50 transition-all font-mono tracking-widest text-white"
            />
            <button className="w-full mt-4 py-4 bg-white/5 border border-white/10 text-white rounded-2xl font-bold text-xs hover:bg-white/10 transition-all">Verify Now</button>
         </div>
      </section>

      {/* HIDDEN CERTIFICATE TEMPLATE FOR PDF GENERATION */}
      <div className="fixed -left-[2000px] top-0">
        <div 
          ref={certTemplateRef}
          style={{ width: "297mm", height: "210mm", backgroundColor: "white", padding: "20mm", position: "relative" }}
          className="certificate-pdf-container text-slate-800"
        >
          {activeDownloadCert && (
            <div className="w-full h-full border-[10px] border-double border-slate-200 p-10 flex flex-col items-center justify-between text-center relative overflow-hidden">
               {/* Decorative background elements */}
               <div className="absolute top-0 right-0 w-64 h-64 bg-slate-50 rounded-full -mr-32 -mt-32" />
               <div className="absolute bottom-0 left-0 w-64 h-64 bg-slate-50 rounded-full -ml-32 -mb-32" />

               <div className="space-y-2">
                  <h4 className="text-xl font-black tracking-[0.3em] text-slate-400 uppercase">Certificate of Completion</h4>
                  <div className="w-24 h-1 bg-primary/30 mx-auto" />
               </div>

               <div className="space-y-6 w-full">
                  <p className="text-xl font-medium text-slate-500">This is to certify that</p>
                  <h2 className="text-6xl font-black text-slate-900 tracking-tight">STUDENT</h2>
                  <p className="text-xl leading-relaxed text-slate-600 max-w-2xl mx-auto">
                    has successfully completed the online training course for
                  </p>
                  <h1 className="text-4xl font-black text-primary uppercase tracking-tighter decoration-4 decoration-primary/20 underline underline-offset-8">
                    {activeDownloadCert.subject.title}
                  </h1>
               </div>

               <div className="grid grid-cols-3 w-full border-t pt-10 mt-10">
                  <div className="flex flex-col items-center">
                    <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Instructor</span>
                    <span className="text-lg font-bold text-slate-800 mt-2">{activeDownloadCert.subject.tutor_name || "SmartLearn Expert"}</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="w-20 h-20 bg-slate-900 text-white rounded-2xl flex items-center justify-center font-black text-2xl mb-2">SL</div>
                    <span className="text-[8px] font-black uppercase tracking-widest">Verified Digital Credential</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Date Issued</span>
                    <span className="text-lg font-bold text-slate-800 mt-2">{formatDate(activeDownloadCert.issued_at)}</span>
                  </div>
               </div>

               <div className="absolute bottom-2 left-1/2 -translate-x-1/2 opacity-20 text-[10px] font-mono">
                  VERIFICATION ID: {activeDownloadCert.certificate_code}
               </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import apiClient from "@/lib/apiClient";
import YouTube from "react-youtube";
import { 
  ChevronRight, 
  ChevronLeft, 
  MessageSquare, 
  FileText, 
  HelpCircle,
  Clock,
  CheckCircle2,
  Menu,
  X,
  Sparkles,
  Award
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

export default function VideoPlayerPage() {
  const { subjectId, videoId } = useParams();
  const router = useRouter();
  const playerRef = useRef<any>(null);

  const [video, setVideo] = useState<any>(null);
  const [subject, setSubject] = useState<any>(null);
  const [progress, setProgress] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"chat" | "notes" | "quiz">("chat");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // AI State
  const [chatQuestion, setChatQuestion] = useState("");
  const [chatHistory, setChatHistory] = useState<any[]>([]);
  const [notes, setNotes] = useState<any>(null);
  const [quiz, setQuiz] = useState<any>(null);
  const [userAnswers, setUserAnswers] = useState<number[]>([]);
  const [quizResult, setQuizResult] = useState<any>(null);
  const [aiLoading, setAiLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, [videoId]);

  const fetchData = async () => {
    try {
      const [subjectRes, progressRes] = await Promise.all([
        apiClient.get(`/subjects/${subjectId}`),
        apiClient.get(`/progress/subjects/${subjectId}`)
      ]);
      
      const allVideos = subjectRes.data.sections.flatMap((s: any) => s.videos);
      const currentVideo = allVideos.find((v: any) => v.id === videoId);
      
      setSubject(subjectRes.data);
      setVideo(currentVideo);
      setProgress(progressRes.data.find((p: any) => p.video_id === videoId));
      
      // Reset AI states
      setChatHistory([]);
      setNotes(null);
      setQuiz(null);
      setUserAnswers([]);
      setQuizResult(null);

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleProgressUpdate = async (isCompleted = false) => {
    if (!playerRef.current) return;
    const currentTime = Math.floor(playerRef.current.getCurrentTime());
    try {
      await apiClient.post(`/progress/videos/${videoId}`, {
        last_position_seconds: currentTime,
        is_completed: isCompleted
      });
    } catch (err) {
      console.error("Failed to sync progress:", err);
    }
  };

  const handleAskAI = async () => {
    if (!chatQuestion.trim()) return;
    const q = chatQuestion;
    setChatQuestion("");
    setChatHistory(prev => [...prev, { role: "user", text: q }]);
    setAiLoading(true);
    try {
      const res = await apiClient.post("/ai/chat", { videoId, question: q });
      setChatHistory(prev => [...prev, { role: "ai", text: res.data.response }]);
    } catch (err) {
      console.error(err);
    } finally {
      setAiLoading(false);
    }
  };

  const handleGenerateNotes = async () => {
    setAiLoading(true);
    try {
      const res = await apiClient.post(`/ai/videos/${videoId}/generate-notes`);
      setNotes(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setAiLoading(false);
    }
  };

  const handleGenerateQuiz = async () => {
    setAiLoading(true);
    try {
      const res = await apiClient.post(`/ai/videos/${videoId}/generate-quiz`);
      setQuiz(JSON.parse(res.data.questions));
      setUserAnswers(new Array(JSON.parse(res.data.questions).length).fill(-1));
    } catch (err) {
      console.error(err);
    } finally {
      setAiLoading(false);
    }
  };

  const handleSubmitQuiz = async () => {
    if (userAnswers.includes(-1)) {
        alert("Please answer all questions before submitting.");
        return;
    }

    let correctCount = 0;
    quiz.forEach((q: any, i: number) => {
      // Assuming a standard format where we might need to find the correct index
      // For now, let's treat the first option as correct or check for a 'correct' field if provided
      // Mistral usually gives the correct one as the last or first, let's look for indicator
      if (q.correct_option === userAnswers[i] || q.correctIndex === userAnswers[i]) {
        correctCount++;
      }
    });

    const score = Math.round((correctCount / quiz.length) * 100);
    
    try {
      const res = await apiClient.post(`/progress/videos/${videoId}/quiz`, {
          score,
          answers: userAnswers
      });
      setQuizResult(res.data.submission);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="p-10 text-white animate-pulse">Loading core player...</div>;
  if (!video) return <div className="p-10 text-white">Video not found.</div>;

  const playerOptions = {
    height: '100%',
    width: '100%',
    playerVars: {
      autoplay: 1,
      modestbranding: 1,
      rel: 0,
      start: progress?.last_position_seconds || 0,
    },
  };

  return (
    <div className="h-[calc(100vh-80px)] flex flex-col lg:flex-row overflow-hidden bg-black/20">
      {/* Video Section */}
      <div className="flex-1 flex flex-col min-w-0">
        <div className="aspect-video w-full bg-black relative">
          <YouTube 
            videoId={video.video_url} 
            opts={playerOptions}
            className="w-full h-full"
            onReady={(e) => playerRef.current = e.target}
            onEnd={() => handleProgressUpdate(true)}
            onPause={() => handleProgressUpdate(false)}
          />
        </div>

        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h1 className="text-2xl font-black text-white">{video.title}</h1>
              <p className="text-sm text-muted-foreground">{subject.title} • Lesson {video.order_index + 1}</p>
            </div>
            <button 
              onClick={() => handleProgressUpdate(true)}
              className="px-6 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs font-black text-white hover:bg-white/10 transition-all flex items-center gap-2"
            >
              {progress?.is_completed ? <CheckCircle2 className="w-4 h-4 text-green-400" /> : "Mark Lesson Complete"}
            </button>
          </div>

          <div className="flex items-center gap-2 border-b border-white/5 pb-1">
            {[
              { id: "chat", label: "AI Tutor", icon: MessageSquare },
              { id: "notes", label: "Summaries", icon: FileText },
              { id: "quiz", label: "Practice Quiz", icon: HelpCircle },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={cn(
                  "flex items-center gap-2 px-6 py-3 text-sm font-bold transition-all relative",
                  activeTab === tab.id ? "text-primary" : "text-muted-foreground hover:text-white"
                )}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
                {activeTab === tab.id && (
                  <motion.div layoutId="tabUnderline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
                )}
              </button>
            ))}
          </div>

          <div className="flex-1 min-h-0">
            <AnimatePresence mode="wait">
              {activeTab === "chat" && (
                <motion.div 
                  initial={{ opacity: 0, x: -10 }} 
                  animate={{ opacity: 1, x: 0 }} 
                  exit={{ opacity: 0, x: 10 }}
                  className="space-y-6"
                >
                  <div className="space-y-4 max-h-64 overflow-y-auto p-2">
                    {chatHistory.length === 0 && (
                      <div className="text-center py-10 space-y-3">
                         <div className="w-12 h-12 rounded-full bg-white/5 mx-auto flex items-center justify-center text-primary">
                            <Sparkles className="w-6 h-6" />
                         </div>
                         <p className="text-sm text-muted-foreground">Ask anything about this lesson. <br /> Our AI Tutor is ready to help!</p>
                      </div>
                    )}
                    {chatHistory.map((msg, i) => (
                      <div key={i} className={cn("flex", msg.role === "user" ? "justify-end" : "justify-start")}>
                        <div className={cn(
                          "max-w-[80%] p-4 rounded-2xl text-sm leading-relaxed",
                          msg.role === "user" ? "bg-primary text-white" : "glass text-muted-foreground border-white/5"
                        )}>
                          {msg.text}
                        </div>
                      </div>
                    ))}
                    {aiLoading && <div className="text-xs text-primary animate-pulse font-bold">AI Thinking...</div>}
                  </div>
                  <div className="relative group">
                    <input 
                      type="text" 
                      placeholder="Ask the AI Tutor a question..." 
                      value={chatQuestion}
                      onChange={(e) => setChatQuestion(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleAskAI()}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-sm focus:outline-none focus:border-primary/50 transition-all pr-12"
                    />
                    <button 
                      onClick={handleAskAI}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-xl bg-primary/20 text-primary hover:bg-primary hover:text-white transition-all"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              )}

              {activeTab === "notes" && (
                <motion.div 
                  initial={{ opacity: 0, x: -10 }} 
                  animate={{ opacity: 1, x: 0 }} 
                  exit={{ opacity: 0, x: 10 }}
                  className="space-y-6"
                >
                  {notes ? (
                    <div className="glass-card p-6 rounded-3xl border-white/5 space-y-4">
                      <h3 className="text-lg font-bold text-white uppercase tracking-tighter">AI Summary</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">{notes.summary}</p>
                      <div className="space-y-2 pt-4 border-t border-white/5">
                        <h4 className="text-sm font-black text-primary uppercase">Key Points</h4>
                        <ul className="space-y-2">
                          {JSON.parse(notes.key_points).map((p: any, i: number) => (
                            <li key={i} className="text-sm text-muted-foreground flex gap-3">
                              <span className="text-primary font-black">•</span> {p}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-20">
                      <button 
                        onClick={handleGenerateNotes} 
                        className="px-8 py-3 bg-primary text-white font-bold rounded-2xl hover:scale-105 transition-all shadow-xl shadow-primary/20"
                      >
                        Generate Study Notes
                      </button>
                    </div>
                  )}
                </motion.div>
              )}

              {activeTab === "quiz" && (
                <motion.div 
                  initial={{ opacity: 0, x: -10 }} 
                  animate={{ opacity: 1, x: 0 }} 
                  exit={{ opacity: 0, x: 10 }}
                  className="space-y-6"
                >
                  {quiz ? (
                    <div className="space-y-6">
                       {quizResult ? (
                          <div className="glass-premium p-10 rounded-[48px] border-primary/20 text-center space-y-4">
                             <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center text-primary mx-auto">
                                <Award className="w-10 h-10" />
                             </div>
                             <h3 className="text-2xl font-black text-white uppercase italic">Assessment Complete!</h3>
                             <p className="text-muted-foreground font-medium">You scored <span className="text-primary text-xl font-black">{quizResult.score}%</span> on this lesson quiz.</p>
                             <div className="pt-4 flex gap-4 justify-center">
                                <button onClick={() => setQuizResult(null)} className="text-[10px] font-black text-primary uppercase tracking-widest hover:underline">Retake Quiz</button>
                                <Link href="/assignments" className="text-[10px] font-black text-white uppercase tracking-widest hover:underline">View All Assignments</Link>
                             </div>
                          </div>
                       ) : (
                         <>
                            {quiz.map((q: any, i: number) => (
                              <div key={i} className="glass-card p-6 rounded-3xl border-white/5 space-y-4">
                                 <span className="text-[10px] font-black text-primary uppercase tracking-widest">Question {i + 1}</span>
                                 <h3 className="text-md font-bold text-white">{q.question}</h3>
                                 <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
                                    {q.options.map((opt: string, optIdx: number) => (
                                      <button 
                                        key={optIdx} 
                                        onClick={() => {
                                          const newAns = [...userAnswers];
                                          newAns[i] = optIdx;
                                          setUserAnswers(newAns);
                                        }}
                                        className={cn(
                                          "p-4 glass rounded-xl text-sm font-medium transition-all text-left border",
                                          userAnswers[i] === optIdx ? "bg-primary/20 border-primary text-primary" : "border-white/5 hover:bg-white/5 text-muted-foreground"
                                        )}
                                      >
                                        {opt}
                                      </button>
                                    ))}
                                 </div>
                              </div>
                            ))}
                            <button 
                              onClick={handleSubmitQuiz}
                              className="w-full py-5 bg-primary text-white font-black uppercase text-xs tracking-widest rounded-2xl shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all"
                            >
                              Submit Assessment
                            </button>
                         </>
                       )}
                    </div>
                  ) : (
                    <div className="text-center py-20">
                      <button 
                        onClick={handleGenerateQuiz} 
                        className="px-8 py-3 bg-primary text-white font-bold rounded-2xl hover:scale-105 transition-all shadow-xl shadow-primary/20"
                      >
                        Start Practice Quiz
                      </button>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Curriculum Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div 
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 400, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            className="hidden lg:flex flex-col border-l border-white/5 glass z-30"
          >
            <div className="p-6 border-b border-white/5 flex items-center justify-between">
              <h2 className="font-black text-white uppercase tracking-widest">Course Curriculum</h2>
              <button 
                onClick={() => setSidebarOpen(false)}
                className="p-2 hover:bg-white/5 rounded-lg text-muted-foreground"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto">
               {subject.sections.map((section: any, sectionIdx: number) => (
                 <div key={section.id} className="space-y-1">
                    <div className="p-4 bg-white/5 text-[10px] font-black text-muted-foreground uppercase tracking-widest flex items-center justify-between">
                       Section {sectionIdx + 1}: {section.title}
                       <span className="text-primary">{section.videos.length} videos</span>
                    </div>
                    <div>
                       {section.videos.map((v: any, vIdx: number) => {
                         const isActive = v.id === videoId;
                         // Check completion logic
                         const isCompleted = progress?.video_id === v.id && progress?.is_completed;
                         
                         return (
                           <Link 
                             key={v.id} 
                             href={`/subjects/${subjectId}/video/${v.id}`}
                             className={cn(
                               "flex items-center gap-4 p-4 hover:bg-white/5 transition-all group border-l-2",
                               isActive ? "bg-primary/10 border-primary" : "border-transparent"
                             )}
                           >
                             <div className={cn(
                               "w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold transition-all",
                               isActive ? "bg-primary text-white shadow-lg shadow-primary/30" : "bg-white/5 text-muted-foreground group-hover:bg-white/10"
                             )}>
                               {vIdx + 1}
                             </div>
                             <div className="flex flex-col flex-1 min-w-0">
                               <span className={cn(
                                 "text-sm font-semibold truncate transition-colors",
                                 isActive ? "text-primary" : "text-white group-hover:text-primary"
                               )}>{v.title}</span>
                               <span className="text-[10px] text-muted-foreground uppercase tracking-widest">{Math.floor(v.duration_seconds / 60)}m</span>
                             </div>
                             {isCompleted && <CheckCircle2 className="w-4 h-4 text-green-400" />}
                           </Link>
                         );
                       })}
                    </div>
                 </div>
               ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {!sidebarOpen && (
        <button 
          onClick={() => setSidebarOpen(true)}
          className="hidden lg:flex absolute right-6 bottom-6 w-14 h-14 rounded-2xl bg-primary text-white shadow-2xl items-center justify-center hover:scale-110 active:scale-95 transition-all z-40"
        >
          <Menu className="w-6 h-6" />
        </button>
      )}
    </div>
  );
}

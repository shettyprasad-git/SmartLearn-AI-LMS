"use client";

import { useState, useEffect } from "react";
import { 
  User, 
  Lock, 
  Bell, 
  Shield, 
  ChevronRight, 
  Camera, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle,
  Loader2,
  LogOut,
  Mail,
  Smartphone,
  Globe,
  Target
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import apiClient from "@/lib/apiClient";
import { useAuthStore } from "@/store/authStore";
import toast from "react-hot-toast";

export default function SettingsPage() {
  const { user, setUser } = useAuthStore();
  const [activeSection, setActiveSection] = useState<"profile" | "security" | "notifications">("profile");
  
  // Profile State
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  
  // Security State
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const [loading, setLoading] = useState(false);

  const handleUpdateProfile = async () => {
    if (!name.trim()) return;
    setLoading(true);
    try {
      await apiClient.put("/auth/profile", { name });
      if (user) setUser({ ...user, name });
      toast.success("Profile updated successfully!");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }
    setLoading(true);
    try {
      await apiClient.put("/auth/change-password", { currentPassword, newPassword });
      toast.success("Password updated successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to change password");
    } finally {
      setLoading(false);
    }
  };

  const SECTIONS = [
    { id: "profile", label: "Profile Identity", icon: User },
    { id: "security", label: "Security & Access", icon: Lock },
    { id: "notifications", label: "Notifications", icon: Bell },
  ];

  return (
    <div className="p-8 md:p-12 space-y-12 max-w-6xl mx-auto">
      {/* Header */}
      <div className="space-y-4">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-[0.3em] w-fit"
        >
          <Shield className="w-4 h-4" />
          Account Management
        </motion.div>
        <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter leading-none italic">
          System <span className="text-gradient">Settings.</span>
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Navigation Sidebar */}
        <div className="lg:col-span-4 space-y-4">
          <div className="glass-premium p-4 md:p-6 rounded-[40px] border-white/5 space-y-2">
            {SECTIONS.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id as any)}
                className={cn(
                  "w-full flex items-center justify-between p-4 rounded-2xl transition-all group",
                  activeSection === section.id 
                    ? "bg-primary text-white shadow-xl shadow-primary/20" 
                    : "text-muted-foreground hover:bg-white/5 hover:text-white"
                )}
              >
                <div className="flex items-center gap-4">
                  <section.icon className={cn("w-5 h-5", activeSection === section.id ? "text-white" : "group-hover:text-primary")} />
                  <span className="text-xs font-black uppercase tracking-widest">{section.label}</span>
                </div>
                <ChevronRight className={cn("w-4 h-4 transition-transform", activeSection === section.id ? "translate-x-0" : "opacity-0 group-hover:opacity-100 group-hover:translate-x-1")} />
              </button>
            ))}
          </div>

          <div className="glass-card p-8 rounded-[40px] border-white/5 text-center space-y-4 relative overflow-hidden group">
             <div className="absolute inset-0 bg-primary/5 blur-3xl group-hover:bg-primary/10 transition-all" />
             <div className="w-20 h-20 rounded-full bg-zinc-800 mx-auto border-2 border-white/10 flex items-center justify-center overflow-hidden relative">
                <img src={`https://ui-avatars.com/api/?name=${user?.name}&background=random`} alt="avatar" />
                 <button className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                    <Camera className="w-6 h-6 text-white" />
                 </button>
             </div>
             <div>
                <h3 className="text-lg font-black text-white uppercase tracking-tight">{user?.name}</h3>
                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mt-1 italic">Pro Neural Member</p>
             </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="lg:col-span-8">
           <AnimatePresence mode="wait">
              {activeSection === "profile" && (
                <motion.div 
                  key="profile"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-8"
                >
                   <div className="glass-premium p-10 md:p-12 rounded-[56px] border-white/5 space-y-10">
                      <div className="space-y-2 border-b border-white/5 pb-8">
                         <h2 className="text-2xl font-black text-white uppercase tracking-tighter italic">Personal Identity</h2>
                         <p className="text-xs text-muted-foreground font-medium">Update your public profile and contact preferences.</p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                         <div className="space-y-4">
                            <label className="text-[10px] font-black text-white uppercase tracking-widest px-4 block">Full Name</label>
                            <input 
                              type="text" 
                              value={name}
                              onChange={(e) => setName(e.target.value)}
                              className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-sm focus:outline-none focus:border-primary/50 transition-all"
                            />
                         </div>
                         <div className="space-y-4 opacity-50 cursor-not-allowed">
                            <label className="text-[10px] font-black text-white uppercase tracking-widest px-4 block">Email Address</label>
                            <div className="relative">
                               <input 
                                 type="email" 
                                 value={email}
                                 disabled
                                 className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-sm pr-12 cursor-not-allowed"
                               />
                               <Lock className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            </div>
                         </div>
                      </div>

                      <button 
                        onClick={handleUpdateProfile}
                        disabled={loading || name === user?.name}
                        className="px-10 py-5 bg-white text-black font-black uppercase text-xs tracking-widest rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-xl shadow-white/5 disabled:opacity-50 disabled:scale-100 flex items-center justify-center gap-3"
                      >
                         {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Save Changes"}
                      </button>
                   </div>
                </motion.div>
              )}

              {activeSection === "security" && (
                <motion.div 
                  key="security"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-8"
                >
                   <div className="glass-premium p-10 md:p-12 rounded-[56px] border-white/5 space-y-10">
                      <div className="space-y-2 border-b border-white/5 pb-8">
                         <h2 className="text-2xl font-black text-white uppercase tracking-tighter italic">Neural Shield</h2>
                         <p className="text-xs text-muted-foreground font-medium">Manage your access credentials and session security.</p>
                      </div>

                      <div className="space-y-6">
                         <div className="space-y-4">
                            <label className="text-[10px] font-black text-white uppercase tracking-widest px-4 block">Current Password</label>
                            <input 
                              type="password" 
                              value={currentPassword}
                              onChange={(e) => setCurrentPassword(e.target.value)}
                              className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-sm focus:outline-none focus:border-red-500/50 transition-all font-mono"
                            />
                         </div>
                         
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-4">
                               <label className="text-[10px] font-black text-white uppercase tracking-widest px-4 block">New Password</label>
                               <input 
                                 type="password" 
                                 value={newPassword}
                                 onChange={(e) => setNewPassword(e.target.value)}
                                 className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-sm focus:outline-none focus:border-primary/50 transition-all font-mono"
                               />
                            </div>
                            <div className="space-y-4">
                               <label className="text-[10px] font-black text-white uppercase tracking-widest px-4 block">Confirm Password</label>
                               <input 
                                 type="password" 
                                 value={confirmPassword}
                                 onChange={(e) => setConfirmPassword(e.target.value)}
                                 className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-sm focus:outline-none focus:border-primary/50 transition-all font-mono"
                               />
                            </div>
                         </div>
                      </div>

                      <button 
                        onClick={handleChangePassword}
                        disabled={loading || !currentPassword || !newPassword}
                        className="px-10 py-5 bg-primary text-white font-black uppercase text-xs tracking-widest rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-xl shadow-primary/20 disabled:opacity-50 disabled:scale-100 flex items-center justify-center gap-3"
                      >
                         {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Sparkles className="w-5 h-5" /> Update Neural Key</>}
                      </button>
                   </div>
                </motion.div>
              )}

              {activeSection === "notifications" && (
                <motion.div 
                  key="notifications"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-8"
                >
                   <div className="glass-premium p-10 md:p-12 rounded-[56px] border-white/5 space-y-10">
                      <div className="space-y-2 border-b border-white/5 pb-8">
                         <h2 className="text-2xl font-black text-white uppercase tracking-tighter italic">Alert Preferences</h2>
                         <p className="text-xs text-muted-foreground font-medium">Configure how the system communicates with you.</p>
                      </div>

                      <div className="space-y-8">
                         {[
                           { title: "Course Updates", desc: "Get notified when new lessons are added to your enrolled subjects.", icon: <Globe className="w-5 h-5 text-primary" /> },
                           { title: "AI Reports", desc: "Weekly neural analysis of your learning performance and roadmap progress.", icon: <Sparkles className="w-5 h-5 text-purple-400" /> },
                           { title: "Assignments", desc: "Alerts for upcoming practice quizzes and assessment scoring.", icon: <Target className="w-5 h-5 text-emerald-400" /> },
                           { title: "Smart Alerts", desc: "Push notifications for platform announcements and security.", icon: <Smartphone className="w-5 h-5 text-orange-400" /> },
                         ].map((notif, i) => (
                           <div key={i} className="flex items-center justify-between group">
                              <div className="flex items-center gap-6">
                                 <div className="w-12 h-12 rounded-2xl glass flex items-center justify-center transition-transform group-hover:scale-110">
                                    {notif.icon}
                                 </div>
                                 <div className="min-w-0">
                                    <h4 className="text-sm font-black text-white uppercase tracking-tight">{notif.title}</h4>
                                    <p className="text-[10px] text-muted-foreground font-medium truncate max-w-xs">{notif.desc}</p>
                                 </div>
                              </div>
                              <div className="w-12 h-6 rounded-full bg-primary/20 p-1 cursor-pointer">
                                 <div className="w-4 h-4 rounded-full bg-primary shadow-lg shadow-primary/50 translate-x-6 transition-transform" />
                              </div>
                           </div>
                         ))}
                      </div>
                   </div>
                </motion.div>
              )}
           </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

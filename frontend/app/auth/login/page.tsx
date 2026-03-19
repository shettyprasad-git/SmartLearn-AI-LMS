"use client";

import { useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Mail, Lock, ArrowRight, Loader2, Monitor } from "lucide-react";
import { motion } from "framer-motion";
import apiClient from "@/lib/apiClient";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const router = useRouter();
  const setAuth = useAuthStore(state => state.setAuth);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await apiClient.post("/auth/login", { email, password });
      setAuth(res.data.user, res.data.accessToken);
      router.push("/");
    } catch (err: any) {
      console.error("Login full error:", err);
      const msg = err.response?.data?.message || err.message || "Login failed. Please check your credentials.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-[radial-gradient(circle_at_top_right,_var(--color-primary)_0%,_transparent_25%),_radial-gradient(circle_at_bottom_left,_#3b82f6_0%,_transparent_20%)] bg-background">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="flex items-center justify-center gap-3 mb-8">
           <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center shadow-2xl shadow-primary/40">
              <Monitor className="text-white w-7 h-7" />
           </div>
           <h1 className="text-3xl font-black text-white tracking-tighter">Smart<span className="text-primary">Learn</span></h1>
        </div>

        <div className="glass-card p-8 rounded-[36px] border-white/10 space-y-6">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold text-white">Welcome back</h2>
            <p className="text-sm text-muted-foreground">Sign in to continue your learning journey.</p>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-red-400/10 border border-red-400/20 text-red-400 text-sm font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all"
                  placeholder="name@example.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between ml-1">
                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Password</label>
                <Link href="#" className="text-xs font-bold text-primary hover:underline">Forgot?</Link>
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-primary text-white rounded-2xl font-bold text-lg shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Sign In <ArrowRight className="w-5 h-5" /></>}
            </button>
          </form>

          <div className="text-center pt-2">
            <p className="text-sm text-muted-foreground">
              Don&apos;t have an account?{" "}
              <Link href="/auth/register" className="text-primary font-bold hover:underline">Join for free</Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

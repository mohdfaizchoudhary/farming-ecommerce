"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Mail, Lock, ArrowRight, Sprout, ShieldCheck } from "lucide-react";
import { useAuth } from "@/components/AuthProvider";
import { getSafeNextPath } from "@/lib/auth-redirect";
import { getSupabaseClient } from "@/lib/supabase";

export default function LoginPage() {
  const router = useRouter();
  const { session, loading: authLoading, configured, authError } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nextPath, setNextPath] = useState("/");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const destination = getSafeNextPath(new URLSearchParams(window.location.search).get("next"), "/");
    setNextPath(destination);
    if (!authLoading && session) router.replace(destination);
  }, [authLoading, router, session]);

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    const supabase = getSupabaseClient();
    if (!supabase) {
      setError("Sign-in is unavailable because Supabase is not configured.");
      return;
    }

    setBusy(true);
    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
      if (signInError) {
        setError(signInError.message);
        return;
      }
      const destination = getSafeNextPath(new URLSearchParams(window.location.search).get("next"), "/");
      router.replace(destination);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Unable to sign in. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-[85vh] bg-[#F7F5EF] flex items-center justify-center p-4 py-16">
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white rounded-[2.25rem] p-8 sm:p-10 border border-[#123C32]/10 shadow-xl"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-11 h-11 rounded-2xl bg-[#123C32] text-[#D9A65A] flex items-center justify-center">
            <Sprout className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-serif text-2xl font-bold text-[#123C32]">
              Welcome Back
            </h1>
            <p className="text-xs text-[#202824]/60">
              Sign in to manage orders & saved addresses
            </p>
          </div>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="text-xs font-bold uppercase text-[#123C32] block mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#123C32]/45 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#F7F5EF] border border-[#123C32]/10 text-sm focus:outline-none focus:border-[#123C32]"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold uppercase text-[#123C32]">
                Password
              </label>
              <Link
                href="/forgot-password"
                className="text-xs font-semibold text-[#123C32] hover:text-[#D9A65A]"
              >
                Forgot?
              </Link>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#123C32]/45 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#F7F5EF] border border-[#123C32]/10 text-sm focus:outline-none focus:border-[#123C32]"
              />
            </div>
          </div>

          {(error || authError || !configured) && (
            <p role="alert" className="text-sm text-rose-700">
              {error || authError || "Sign-in is unavailable because Supabase is not configured."}
            </p>
          )}

          <button
            type="submit"
            disabled={busy || authLoading || !configured}
            className="w-full py-3.5 rounded-2xl bg-[#123C32] hover:bg-[#1a5244] text-[#F7F5EF] font-bold text-sm flex items-center justify-center gap-2 shadow-md transition-all"
          >
            {busy ? "Signing in..." : "Sign In"}
            <ArrowRight className="w-4 h-4 text-[#D9A65A]" />
          </button>
        </form>

        <p className="text-xs text-center text-[#202824]/70 mt-6">
          New to SMS Marketplace?{" "}
          <Link
            href={nextPath === "/" ? "/signup" : `/signup?next=${encodeURIComponent(nextPath)}`}
            className="font-bold text-[#123C32] hover:text-[#D9A65A] underline"
          >
            Create an account
          </Link>
        </p>

        <div className="mt-5 pt-4 border-t border-[#123C32]/10 flex items-center justify-center gap-1.5 text-[11px] text-[#202824]/55">
          <ShieldCheck className="w-3.5 h-3.5 text-[#123C32]" />
          <span>Protected by Supabase Auth & Row Level Security</span>
        </div>
      </motion.div>
    </div>
  );
}
"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { User, Mail, Phone, Lock, ArrowRight, Sprout } from "lucide-react";
import { useAuth } from "@/components/AuthProvider";
import { getSafeNextPath } from "@/lib/auth-redirect";
import { getSupabaseClient } from "@/lib/supabase";

export default function SignupPage() {
  const router = useRouter();
  const { session, loading: authLoading, configured, authError } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [nextPath, setNextPath] = useState("/");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const destination = getSafeNextPath(new URLSearchParams(window.location.search).get("next"), "/");
    setNextPath(destination);
    if (!authLoading && session) router.replace(destination);
  }, [authLoading, router, session]);

  async function handleSignup(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setMessage("");
    const supabase = getSupabaseClient();
    if (!supabase) {
      setError("Sign-up is unavailable because Supabase is not configured.");
      return;
    }

    setBusy(true);
    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: name.trim(), phone: phone.trim() } },
      });
      if (signUpError) {
        setError(signUpError.message);
        return;
      }
      if (data.session) {
        const destination = getSafeNextPath(new URLSearchParams(window.location.search).get("next"), "/");
        router.replace(destination);
      } else {
        setMessage("Account created. Check your email to confirm your account, then sign in.");
      }
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Unable to create your account. Please try again.");
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
              Create Account
            </h1>
            <p className="text-xs text-[#202824]/60">
              Join for direct farm sourcing & cold-chain delivery
            </p>
          </div>
        </div>

        <form onSubmit={handleSignup} className="space-y-3.5">
          <div>
            <label className="text-xs font-bold uppercase text-[#123C32] block mb-1">
              Full Name
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-[#123C32]/45 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                required
                autoComplete="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Rajesh Verma"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#F7F5EF] border border-[#123C32]/10 text-sm"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold uppercase text-[#123C32] block mb-1">
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
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#F7F5EF] border border-[#123C32]/10 text-sm"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold uppercase text-[#123C32] block mb-1">
              Phone Number
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-[#123C32]/45 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                required
                type="tel"
                autoComplete="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98765 43210"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#F7F5EF] border border-[#123C32]/10 text-sm"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold uppercase text-[#123C32] block mb-1">
              Create Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#123C32]/45 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                autoComplete="new-password"
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Min. 6 characters"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#F7F5EF] border border-[#123C32]/10 text-sm"
              />
            </div>
          </div>

          {(error || authError || !configured) && (
            <p role="alert" className="text-sm text-rose-700">
              {error || authError || "Sign-up is unavailable because Supabase is not configured."}
            </p>
          )}
          {message && <p role="status" className="text-sm text-forest">{message}</p>}

          <button
            type="submit"
            disabled={busy || authLoading || !configured}
            className="w-full py-3.5 rounded-2xl bg-[#123C32] hover:bg-[#1a5244] text-[#F7F5EF] font-bold text-sm flex items-center justify-center gap-2 shadow-md transition-all mt-2"
          >
            {busy ? "Creating Account..." : "Create Account"}
            <ArrowRight className="w-4 h-4 text-[#D9A65A]" />
          </button>
        </form>

        <p className="text-xs text-center text-[#202824]/70 mt-6">
          Already have an account?{" "}
          <Link
            href={nextPath === "/" ? "/login" : `/login?next=${encodeURIComponent(nextPath)}`}
            className="font-bold text-[#123C32] hover:text-[#D9A65A] underline"
          >
            Sign in
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
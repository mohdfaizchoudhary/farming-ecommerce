"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { requestApi } from "@/lib/client-api";

function getNextPath(search: URLSearchParams) {
  const value = search.get("next");
  return value && value.startsWith("/") && !value.startsWith("//") ? value : "/admin";
}

function AdminLoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setBusy(true);
    try {
      await requestApi("/api/admin/session", {
        method: "POST",
        body: JSON.stringify({ email: email.trim(), password }),
      });
      router.replace(getNextPath(new URLSearchParams(params.toString())));
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Admin sign-in failed.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="container-shell max-w-lg py-10 sm:py-16">
      <div className="rounded-2xl border border-[#dce6df] bg-white p-5 shadow-sm sm:p-8">
        <p className="eyebrow">Admin access</p>
        <h1 className="section-title mt-3">Sign in to manage the store</h1>
        <p className="mt-4 text-sm leading-6 text-charcoal/60">Sign in with a Supabase account that has an authorized admin role.</p>
        <form onSubmit={submit} className="mt-6 space-y-4">
          <label className="block text-sm font-medium text-forest">
            Admin email
            <input className="field mt-2" type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
          </label>
          <label className="block text-sm font-medium text-forest">
            Password
            <input className="field mt-2" type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} required />
          </label>
          {error && <p className="text-sm text-rose-700" role="alert">{error}</p>}
          <button type="submit" disabled={busy} className="btn-primary w-full disabled:opacity-60">
            {busy ? "Verifying access…" : "Admin sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return <Suspense fallback={<div className="container-shell py-16 text-sm text-charcoal/60">Loading admin sign-in…</div>}><AdminLoginForm /></Suspense>;
}

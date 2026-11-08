"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";
import OrderHistory from "@/components/OrderHistory";
import { getSupabaseClient } from "@/lib/supabase";

function metadataValue(value: unknown) {
  return typeof value === "string" && value.trim() ? value.trim() : "";
}

export default function Profile() {
  const { session, loading, configured, authError } = useAuth();
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const router = useRouter();

  async function signOut() {
    setError("");
    const supabase = getSupabaseClient();
    if (!supabase) {
      setError("Sign-out is unavailable because Supabase is not configured.");
      return;
    }

    setBusy(true);
    try {
      const { error: signOutError } = await supabase.auth.signOut();
      if (signOutError) {
        setError(signOutError.message);
        return;
      }
      router.push("/");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Unable to sign out. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  const metadata = session?.user.user_metadata ?? {};
  const details = [
    ["Full name", metadataValue(metadata.full_name) || metadataValue(metadata.name)],
    ["Email address", metadataValue(session?.user.email)],
    ["Phone number", metadataValue(metadata.phone)],
    ["Address", metadataValue(metadata.address)],
  ].filter((detail): detail is [string, string] => Boolean(detail[1]));

  return (
    <div className="container-shell py-12">
      {loading ? (
        <div className="text-sm text-charcoal/60" role="status">Loading your account…</div>
      ) : !session ? (
        <section className="mx-auto max-w-lg rounded-2xl bg-white p-6 shadow-xl ring-1 ring-forest/10 sm:p-8">
          <p className="eyebrow">Your space</p>
          <h1 className="section-title mt-3">Your account</h1>
          <p className="mt-4 text-sm leading-6 text-charcoal/60">
            Sign in to view your account details and order history, or create an account to get started.
          </p>
          {(authError || !configured) && (
            <p role="alert" className="mt-4 text-sm text-rose-700">
              {authError || "Customer sign-in is currently unavailable because Supabase is not configured."}
            </p>
          )}
          <div className="mt-5 flex flex-wrap gap-3">
            <Link href="/login" className="btn-primary">Sign in</Link>
            <Link href="/signup" className="btn-secondary">Create account</Link>
          </div>
        </section>
      ) : (
        <section className="mx-auto max-w-2xl rounded-2xl bg-white p-6 shadow-xl ring-1 ring-forest/10 sm:p-8">
          <p className="eyebrow">Your space</p>
          <h1 className="section-title mt-3">Account details</h1>
          <dl className="divide-y divide-forest/10">
            {details.map(([label, value]) => (
              <div key={label} className="py-4 first:pt-0 last:pb-0">
                <dt className="text-xs font-medium uppercase tracking-wide text-charcoal/50">{label}</dt>
                <dd className="mt-1 break-words text-sm text-charcoal">{value}</dd>
              </div>
            ))}
          </dl>

          {error && <p role="alert" className="mt-4 text-sm text-rose-700">{error}</p>}

          <button
            type="button"
            disabled={busy}
            onClick={signOut}
            className="btn-primary mt-6 w-full disabled:opacity-60"
          >
            {busy ? "Signing out…" : "Logout"}
          </button>
        </section>
      )}
      <OrderHistory embedded />
    </div>
  );
}

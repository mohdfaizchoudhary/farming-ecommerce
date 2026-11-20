"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  User,
  MapPin,
  Package,
  Heart,
  CheckCircle2,
  LogOut,
} from "lucide-react";
import { useAuth } from "@/components/AuthProvider";
import OrderHistory from "@/components/OrderHistory";
import { useStore } from "@/components/StoreProvider";
import { getSupabaseClient } from "@/lib/supabase";

export default function CustomerProfilePage() {
  const { session, loading, configured, authError } = useAuth();
  const { customers, upsertCustomer } = useStore();
  const router = useRouter();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [saved, setSaved] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const customer = session ? customers.find((entry) => entry.id === session.user.id) : undefined;
  const metadata = session?.user.user_metadata ?? {};
  const metadataName = typeof metadata.full_name === "string" && metadata.full_name.trim()
    ? metadata.full_name.trim()
    : typeof metadata.name === "string" && metadata.name.trim()
      ? metadata.name.trim()
      : "";
  const profileName = metadataName || customer?.fullName || session?.user.email?.split("@")[0] || "";
  const profilePhone = typeof metadata.phone === "string" && metadata.phone.trim()
    ? metadata.phone.trim()
    : customer?.phone ?? "";
  const profileAddress = typeof metadata.address === "string" && metadata.address.trim()
    ? metadata.address.trim()
    : customer?.address ?? "";

  useEffect(() => {
    setName(profileName);
    setPhone(profilePhone);
    setAddress(profileAddress);
    setSaved(false);
    setError("");
  }, [session?.user.id, profileName, profilePhone, profileAddress]);

  async function handleSave(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!session) return;
    const supabase = getSupabaseClient();
    if (!supabase) {
      setError("Profile updates are unavailable because Supabase is not configured.");
      return;
    }

    setBusy(true);
    setSaved(false);
    setError("");
    try {
      const fullName = name.trim();
      const savedPhone = phone.trim();
      const savedAddress = address.trim();
      const { error: updateError } = await supabase.auth.updateUser({
        data: { full_name: fullName, phone: savedPhone, address: savedAddress },
      });
      if (updateError) throw updateError;

      upsertCustomer({
        id: session.user.id,
        email: session.user.email ?? "",
        fullName,
        phone: savedPhone,
        address: savedAddress,
        createdAt: session.user.created_at,
      });
      setSaved(true);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Unable to update your profile.");
    } finally {
      setBusy(false);
    }
  }

  async function handleSignOut() {
    const supabase = getSupabaseClient();
    if (!supabase) {
      setError("Sign-out is unavailable because Supabase is not configured.");
      return;
    }

    setBusy(true);
    setError("");
    try {
      const { error: signOutError } = await supabase.auth.signOut({ scope: "local" });
      if (signOutError) throw signOutError;
      router.replace("/");
      router.refresh();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Unable to sign out. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  if (loading) {
    return <div className="container-shell py-12 text-sm text-[#202824]/60" role="status">Loading your account…</div>;
  }

  if (!session) {
    return (
      <div className="container-shell py-12">
        <section className="mx-auto max-w-lg rounded-2xl bg-white p-6 shadow-xl ring-1 ring-forest/10 sm:p-8">
          <p className="eyebrow">Your space</p>
          <h1 className="section-title mt-3">Your account</h1>
          <p className="mt-4 text-sm leading-6 text-charcoal/60">Sign in to view your account details and order history.</p>
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
      </div>
    );
  }

  return (
    <div className="bg-[#F7F5EF] min-h-screen pb-20">
      <div className="bg-[#123C32] text-[#F7F5EF] py-10 sm:py-14">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-[#D9A65A] text-[#123C32] font-serif text-3xl font-bold flex items-center justify-center">
              {(profileName || session.user.email || "?").charAt(0).toUpperCase()}
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#D9A65A]">Signed-in account</span>
              <h1 className="font-serif text-2xl sm:text-4xl font-bold">
                {profileName || "Your account"}
              </h1>
            </div>
          </div>

          <button
            type="button"
            disabled={busy}
            onClick={() => void handleSignOut()}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold self-start"
          >
            <LogOut className="w-4 h-4 text-[#D9A65A]" /> {busy ? "Please wait…" : "Sign Out"}
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 grid lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4 space-y-2.5">
          <Link
            href="/orders"
            className="flex items-center gap-3 p-4 rounded-2xl bg-white border border-[#123C32]/10 font-bold text-sm text-[#123C32] hover:bg-[#123C32] hover:text-white transition-all"
          >
            <Package className="w-4 h-4 text-[#D9A65A]" /> My Orders & Tracking
          </Link>
          <Link
            href="/wishlist"
            className="flex items-center gap-3 p-4 rounded-2xl bg-white border border-[#123C32]/10 font-bold text-sm text-[#123C32] hover:bg-[#123C32] hover:text-white transition-all"
          >
            <Heart className="w-4 h-4 text-[#D9A65A]" /> Saved Wishlist
          </Link>
          <div className="p-5 rounded-2xl bg-[#E5EDE6]/70 border border-[#123C32]/10 space-y-1.5">
            <span className="text-xs font-bold uppercase text-[#123C32] flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5" /> Default Delivery Address
            </span>
            <p className="text-xs text-[#202824]/80 leading-relaxed">
              {address || "Add your delivery address to your account details."}
            </p>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-8 bg-white rounded-3xl p-6 sm:p-8 border border-[#123C32]/10 shadow-sm"
        >
          <h2 className="font-serif text-2xl font-bold text-[#123C32] mb-6 flex items-center gap-2">
            <User className="w-5 h-5 text-[#D9A65A]" /> Personal Details
          </h2>

          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold uppercase text-[#123C32] block mb-1.5">
                  Full Name
                </label>
                <input
                  required
                  maxLength={200}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  autoComplete="name"
                  className="w-full px-4 py-3 rounded-xl bg-[#F7F5EF] border border-[#123C32]/10 text-sm font-medium"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase text-[#123C32] block mb-1.5">
                  Phone Number
                </label>
                <input
                  maxLength={40}
                  autoComplete="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-[#F7F5EF] border border-[#123C32]/10 text-sm font-medium"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold uppercase text-[#123C32] block mb-1.5">
                Email Address (Verified)
              </label>
              <input
                disabled
                value={session.user.email ?? ""}
                className="w-full px-4 py-3 rounded-xl bg-[#F7F5EF]/60 border border-[#123C32]/10 text-sm text-[#202824]/60"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase text-[#123C32] block mb-1.5">
                Delivery Address
              </label>
              <textarea
                maxLength={500}
                rows={3}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                autoComplete="street-address"
                className="w-full px-4 py-3 rounded-xl bg-[#F7F5EF] border border-[#123C32]/10 text-sm font-medium"
              />
            </div>

            {error && <p role="alert" className="text-sm text-rose-700">{error}</p>}

            <button
              type="submit"
              disabled={busy}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-[#123C32] text-[#F7F5EF] font-bold text-sm hover:bg-[#1a5244] transition-all shadow-md disabled:opacity-60"
            >
              {busy ? "Saving…" : saved ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-[#D9A65A]" /> Saved
                  Successfully
                </>
              ) : (
                "Update Profile"
              )}
            </button>
          </form>
        </motion.div>
      </div>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <OrderHistory embedded />
      </div>
    </div>
  );
}
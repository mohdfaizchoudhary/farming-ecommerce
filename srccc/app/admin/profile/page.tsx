// "use client";

// import Link from "next/link";
// import { ADMIN_CREDENTIALS } from "@/lib/admin";

// export default function AdminProfile() {
//   return (
//     <div>
//       <p className="eyebrow">Admin account</p>
//       <h1 className="section-title mt-2">Admin profile</h1>
//       <section className="mt-5 max-w-2xl rounded-2xl bg-white p-5 sm:p-7">
//         <div className="grid gap-4 sm:grid-cols-2">
//           <div>
//             <p className="text-xs font-medium uppercase tracking-wide text-charcoal/50">Account email</p>
//             <p className="mt-2 break-all text-sm text-forest">{ADMIN_CREDENTIALS.email}</p>
//           </div>
//           <div>
//             <p className="text-xs font-medium uppercase tracking-wide text-charcoal/50">Account type</p>
//             <p className="mt-2 text-sm text-forest">SMS Farmstead administrator</p>
//           </div>
//         </div>
//         <p className="mt-5 border-t border-forest/10 pt-4 text-xs leading-5 text-charcoal/55">
//           Admin access is active for this browser session. Admin credentials are managed separately from customer accounts.
//         </p>
//         <div className="mt-5 flex flex-wrap gap-3">
//           <Link href="/admin/products" className="btn-primary">Manage products</Link>
//           <Link href="/admin" className="btn-secondary">Product overview</Link>
//         </div>
//       </section>
//     </div>
//   );
// }





"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { ShieldCheck, KeyRound, CheckCircle2, UserCog } from "lucide-react";

export default function AdminProfilePage() {
  const [saved, setSaved] = useState(false);
  const [name, setName] = useState("SMS Operations Admin");
  const [phone, setPhone] = useState("+91 98765 43210");

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <span className="text-xs font-bold uppercase tracking-[0.18em] text-[#123C32]/60">
          Staff Account & RBAC
        </span>
        <h1 className="font-serif text-2xl sm:text-4xl font-bold text-[#123C32] mt-1">
          Admin Profile & Security
        </h1>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-3xl p-6 sm:p-8 border border-[#123C32]/10 shadow-sm space-y-6"
      >
        <div className="flex items-center gap-4 pb-6 border-b border-[#123C32]/10">
          <div className="w-16 h-16 rounded-2xl bg-[#123C32] text-[#D9A65A] flex items-center justify-center">
            <UserCog className="w-8 h-8" />
          </div>
          <div>
            <h2 className="font-serif text-2xl font-bold text-[#123C32]">
              {name}
            </h2>
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full mt-1">
              <ShieldCheck className="w-3.5 h-3.5" /> Owner / Super Admin Role
            </span>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold uppercase text-[#123C32] block mb-1.5">
                Full Name
              </label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-[#F7F5EF] border border-[#123C32]/15 text-sm font-medium"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase text-[#123C32] block mb-1.5">
                Contact Phone
              </label>
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-[#F7F5EF] border border-[#123C32]/15 text-sm font-medium"
              />
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#E5EDE6]/60 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <KeyRound className="w-5 h-5 text-[#123C32]" />
              <div>
                <p className="text-sm font-bold text-[#123C32]">
                  Audit Logging & RLS Protection
                </p>
                <p className="text-xs text-[#202824]/70">
                  All price edits, order transitions, and refunds are logged.
                </p>
              </div>
            </div>
            <span className="text-xs font-bold text-[#123C32] bg-white px-3 py-1 rounded-full">
              Enforced
            </span>
          </div>

          <button
            type="submit"
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-[#123C32] text-[#F7F5EF] font-bold text-sm hover:bg-[#1a5244] transition-all shadow-md"
          >
            {saved ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-[#D9A65A]" /> Profile Updated
              </>
            ) : (
              "Save Admin Settings"
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
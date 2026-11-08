"use client";

import Link from "next/link";
import { ADMIN_CREDENTIALS } from "@/lib/admin";

export default function AdminProfile() {
  return (
    <div>
      <p className="eyebrow">Admin account</p>
      <h1 className="section-title mt-2">Admin profile</h1>
      <section className="mt-5 max-w-2xl rounded-2xl bg-white p-5 sm:p-7">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-charcoal/50">Account email</p>
            <p className="mt-2 break-all text-sm text-forest">{ADMIN_CREDENTIALS.email}</p>
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-charcoal/50">Account type</p>
            <p className="mt-2 text-sm text-forest">SMS Farmstead administrator</p>
          </div>
        </div>
        <p className="mt-5 border-t border-forest/10 pt-4 text-xs leading-5 text-charcoal/55">
          Admin access is active for this browser session. Admin credentials are managed separately from customer accounts.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link href="/admin/products" className="btn-primary">Manage products</Link>
          <Link href="/admin" className="btn-secondary">Product overview</Link>
        </div>
      </section>
    </div>
  );
}

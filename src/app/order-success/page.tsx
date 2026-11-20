"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

function OrderConfirmation() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get("id");

  return (
    <div className="min-h-[75vh] bg-[#F7F5EF] flex items-center justify-center p-4 py-16">
      <section className="w-full max-w-xl rounded-[2rem] border border-[#123C32]/10 bg-white p-8 sm:p-12 text-center shadow-xl">
        <CheckCircle2 className="mx-auto h-16 w-16 text-emerald-700" />
        <p className="mt-5 text-xs font-bold uppercase tracking-widest text-[#123C32]/60">Order confirmed</p>
        <h1 className="mt-2 font-serif text-3xl font-bold text-[#123C32]">Thank you for your order</h1>
        {orderNumber && <p className="mt-3 text-sm text-[#202824]/70">Reference <b>{orderNumber}</b></p>}
        <p className="mt-3 text-sm text-[#202824]/65">Your order has been saved. You can follow its status from your order history.</p>
        <Link href="/orders" className="mt-7 inline-flex rounded-xl bg-[#123C32] px-6 py-3 font-bold text-white">Track my order</Link>
      </section>
    </div>
  );
}

export default function OrderSuccessPage() {
  return <Suspense fallback={<div className="container-shell py-20">Loading order confirmation…</div>}><OrderConfirmation /></Suspense>;
}

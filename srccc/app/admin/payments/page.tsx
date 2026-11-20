// "use client";

// import { useStore } from "@/components/StoreProvider";
// import { money } from "@/lib/catalog";

// const requestLabels = {
//   cancellation: "Cancellation",
//   replacement: "Replacement",
//   return: "Return",
// };

// export default function Page() {
//   const { orders, orderRequests, updateOrderRequestStatus } = useStore();
//   const sortedRequests = [...orderRequests].sort((a, b) => {
//     if (a.status === "requested" && b.status !== "requested") return -1;
//     if (b.status === "requested" && a.status !== "requested") return 1;
//     return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
//   });

//   return (
//     <div>
//       <p className="eyebrow">Customer service</p>
//       <h1 className="section-title mt-2">Order requests</h1>
//       <p className="mt-3 text-sm text-charcoal/60">Review cancellation, replacement and return requests submitted from order history.</p>
//       <p className="mt-2 text-xs text-charcoal/50">Demo requests are saved in this browser and sync across its open tabs.</p>
//       <div className="mt-5 space-y-3">
//         {sortedRequests.map((request) => {
//           const order = orders.find((entry) => entry.id === request.orderId);
//           const priceDifference = (request.replacementTotal ?? 0) - (request.originalTotal ?? 0);

//           return (
//             <article key={request.id} className="rounded-2xl bg-white p-5">
//               <div className="flex flex-wrap items-start justify-between gap-3">
//                 <div>
//                   <p className="font-semibold text-forest">{requestLabels[request.type]} · {request.orderId}</p>
//                   <p className="mt-1 text-xs text-charcoal/55">
//                     {order?.customerName ?? "Customer"} · {new Date(request.createdAt).toLocaleString()}
//                   </p>
//                 </div>
//                 <span className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${request.status === "requested" ? "bg-amber-100 text-amber-900" : request.status === "approved" ? "bg-emerald-100 text-emerald-900" : "bg-rose-100 text-rose-800"}`}>
//                   {request.status}
//                 </span>
//               </div>
//               <p className="mt-4 text-sm"><span className="text-charcoal/55">Reason:</span> {request.reason}</p>
//               {request.type === "replacement" && (
//                 <div className="mt-3 rounded-xl bg-sage p-3 text-sm text-forest">
//                   <p>{request.originalProductName} × {request.quantity} → {request.replacementProductName}</p>
//                   <p className="mt-1">Original: {money(request.originalTotal ?? 0)} · Replacement: {money(request.replacementTotal ?? 0)}</p>
//                   {priceDifference > 0 ? (
//                     <p className="mt-1">Additional amount to be paid if approved: {money(priceDifference)}</p>
//                   ) : priceDifference < 0 ? (
//                     <p className="mt-1">Potential bank credit within 7 days if approved: {money(Math.abs(priceDifference))}</p>
//                   ) : (
//                     <p className="mt-1">No price difference.</p>
//                   )}
//                 </div>
//               )}
//               {request.status === "requested" && (
//                 <div className="mt-4 flex flex-wrap gap-3">
//                   <button type="button" onClick={() => updateOrderRequestStatus(request.id, "approved")} className="btn-primary">
//                     Approve request
//                   </button>
//                   <button type="button" onClick={() => updateOrderRequestStatus(request.id, "rejected")} className="btn-secondary">
//                     Reject request
//                   </button>
//                 </div>
//               )}
//             </article>
//           );
//         })}
//       </div>
//       {!sortedRequests.length && <p className="mt-5 rounded-2xl bg-white p-6 text-sm">No customer requests yet.</p>}
//     </div>
//   );
// }




"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  CreditCard,
  CheckCircle2,
  Clock,
  RotateCcw,
  ShieldCheck,
} from "lucide-react";

const TRANSACTIONS = [
  {
    id: "pay_P9xK2mL8qR1",
    orderId: "ORD-2026-1084",
    method: "Razorpay UPI",
    amount: 1798,
    status: "Captured",
    timestamp: "17 Nov 2026, 10:16 AM",
  },
  {
    id: "COD-1083",
    orderId: "ORD-2026-1083",
    method: "Cash on Delivery",
    amount: 827,
    status: "Collection Pending",
    timestamp: "17 Nov 2026, 09:40 AM",
  },
  {
    id: "pay_P9wJ8nV4tY7",
    orderId: "ORD-2026-1082",
    method: "Razorpay NetBanking",
    amount: 7400,
    status: "Captured",
    timestamp: "16 Nov 2026, 06:22 PM",
  },
];

export default function AdminPaymentsPage() {
  const [txns, setTxns] = useState(TRANSACTIONS);

  const issueRefund = (id: string) => {
    setTxns((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: "Refund Initiated" } : t))
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <span className="text-xs font-bold uppercase tracking-[0.18em] text-[#123C32]/60">
          Gateway & COD Ledger
        </span>
        <h1 className="font-serif text-2xl sm:text-4xl font-bold text-[#123C32] mt-1">
          Payments & Refunds
        </h1>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        {[
          { label: "Verified Online Settlements", value: "₹2,14,320", icon: ShieldCheck },
          { label: "Pending COD Reconciliation", value: "₹38,490", icon: Clock },
          { label: "Processed Refunds", value: "₹4,120", icon: RotateCcw },
        ].map((stat, idx) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.06 }}
            className="bg-white p-5 rounded-3xl border border-[#123C32]/10 flex items-center gap-4 shadow-sm"
          >
            <div className="w-12 h-12 rounded-2xl bg-[#123C32] text-[#D9A65A] flex items-center justify-center shrink-0">
              <stat.icon className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs text-[#202824]/60 block">{stat.label}</span>
              <span className="text-xl font-extrabold text-[#123C32]">
                {stat.value}
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="bg-white rounded-3xl border border-[#123C32]/10 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#F7F5EF] text-[11px] font-bold uppercase tracking-wider text-[#123C32]/70">
                <th className="py-4 px-5">Gateway Ref ID</th>
                <th className="py-4 px-5">Order #</th>
                <th className="py-4 px-5">Method</th>
                <th className="py-4 px-5">Amount</th>
                <th className="py-4 px-5">Verification</th>
                <th className="py-4 px-5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#123C32]/10 text-sm">
              {txns.map((t) => (
                <tr key={t.id} className="hover:bg-[#F7F5EF]/50 transition-colors">
                  <td className="py-4 px-5 font-mono text-xs font-bold text-[#123C32]">
                    {t.id}
                  </td>
                  <td className="py-4 px-5 font-bold">{t.orderId}</td>
                  <td className="py-4 px-5 text-xs flex items-center gap-1.5">
                    <CreditCard className="w-3.5 h-3.5 text-[#123C32]" />
                    {t.method}
                  </td>
                  <td className="py-4 px-5 font-extrabold text-[#123C32]">
                    ₹{t.amount.toLocaleString("en-IN")}
                  </td>
                  <td className="py-4 px-5">
                    <span
                      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${
                        t.status === "Captured"
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" /> {t.status}
                    </span>
                  </td>
                  <td className="py-4 px-5 text-right">
                    {t.status === "Captured" && (
                      <button
                        onClick={() => issueRefund(t.id)}
                        className="px-3 py-1.5 rounded-xl bg-rose-50 text-rose-700 hover:bg-rose-600 hover:text-white text-xs font-bold transition-colors"
                      >
                        Initiate Refund
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
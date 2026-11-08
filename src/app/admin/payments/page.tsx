"use client";

import { useStore } from "@/components/StoreProvider";
import { money } from "@/lib/catalog";

const requestLabels = {
  cancellation: "Cancellation",
  replacement: "Replacement",
  return: "Return",
};

export default function Page() {
  const { orders, orderRequests, updateOrderRequestStatus } = useStore();
  const sortedRequests = [...orderRequests].sort((a, b) => {
    if (a.status === "requested" && b.status !== "requested") return -1;
    if (b.status === "requested" && a.status !== "requested") return 1;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  return (
    <div>
      <p className="eyebrow">Customer service</p>
      <h1 className="section-title mt-2">Order requests</h1>
      <p className="mt-3 text-sm text-charcoal/60">Review cancellation, replacement and return requests submitted from order history.</p>
      <p className="mt-2 text-xs text-charcoal/50">Demo requests are saved in this browser and sync across its open tabs.</p>
      <div className="mt-5 space-y-3">
        {sortedRequests.map((request) => {
          const order = orders.find((entry) => entry.id === request.orderId);
          const priceDifference = (request.replacementTotal ?? 0) - (request.originalTotal ?? 0);

          return (
            <article key={request.id} className="rounded-2xl bg-white p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-forest">{requestLabels[request.type]} · {request.orderId}</p>
                  <p className="mt-1 text-xs text-charcoal/55">
                    {order?.customerName ?? "Customer"} · {new Date(request.createdAt).toLocaleString()}
                  </p>
                </div>
                <span className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${request.status === "requested" ? "bg-amber-100 text-amber-900" : request.status === "approved" ? "bg-emerald-100 text-emerald-900" : "bg-rose-100 text-rose-800"}`}>
                  {request.status}
                </span>
              </div>
              <p className="mt-4 text-sm"><span className="text-charcoal/55">Reason:</span> {request.reason}</p>
              {request.type === "replacement" && (
                <div className="mt-3 rounded-xl bg-sage p-3 text-sm text-forest">
                  <p>{request.originalProductName} × {request.quantity} → {request.replacementProductName}</p>
                  <p className="mt-1">Original: {money(request.originalTotal ?? 0)} · Replacement: {money(request.replacementTotal ?? 0)}</p>
                  {priceDifference > 0 ? (
                    <p className="mt-1">Additional amount to be paid if approved: {money(priceDifference)}</p>
                  ) : priceDifference < 0 ? (
                    <p className="mt-1">Potential bank credit within 7 days if approved: {money(Math.abs(priceDifference))}</p>
                  ) : (
                    <p className="mt-1">No price difference.</p>
                  )}
                </div>
              )}
              {request.status === "requested" && (
                <div className="mt-4 flex flex-wrap gap-3">
                  <button type="button" onClick={() => updateOrderRequestStatus(request.id, "approved")} className="btn-primary">
                    Approve request
                  </button>
                  <button type="button" onClick={() => updateOrderRequestStatus(request.id, "rejected")} className="btn-secondary">
                    Reject request
                  </button>
                </div>
              )}
            </article>
          );
        })}
      </div>
      {!sortedRequests.length && <p className="mt-5 rounded-2xl bg-white p-6 text-sm">No customer requests yet.</p>}
    </div>
  );
}
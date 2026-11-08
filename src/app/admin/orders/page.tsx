"use client";

import { useStore, type OrderStatus } from "@/components/StoreProvider";
import { money } from "@/lib/catalog";

const statuses: OrderStatus[] = ["placed", "confirmed", "processing", "shipped", "delivered", "cancelled"];
const paymentMethods = { cod: "Cash on Delivery", upi: "UPI", card: "Credit / Debit Card", unknown: "Not recorded" };

export default function Page() {
  const { orders, updateOrderStatus } = useStore();

  return (
    <div>
      <p className="eyebrow">Fulfilment</p>
      <h1 className="section-title mt-2">Orders</h1>
      <p className="mt-3 text-sm text-charcoal/60">Demo orders are saved in this browser and sync across its open tabs.</p>
      <div className="mt-5 space-y-3">
        {orders.map((order) => (
          <article key={order.id} className="rounded-2xl bg-white p-5">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <b className="text-forest">{order.id}</b>
                <p className="mt-1 text-xs text-charcoal/55">{order.customerName} · {new Date(order.date).toLocaleString()}</p>
              </div>
              <b>{money(order.total)}</b>
            </div>
            <div className="mt-4 grid gap-2 text-sm sm:grid-cols-2">
              <p><span className="text-charcoal/55">Payment method:</span> {paymentMethods[order.paymentMethod] ?? "Demo"}</p>
              <p><span className="text-charcoal/55">Payment status:</span> <span className="capitalize">{order.paymentStatus}</span></p>
            </div>
            <div className="mt-4 grid gap-3 rounded-xl bg-sage/60 p-4 text-sm sm:grid-cols-2">
              <p className="break-all"><span className="text-charcoal/55">Email:</span> {order.customerEmail || "Not recorded"}</p>
              <p><span className="text-charcoal/55">Phone:</span> {order.customerPhone || "Not recorded"}</p>
              <p className="whitespace-pre-wrap break-words sm:col-span-2"><span className="text-charcoal/55">Delivery address:</span> {order.customerAddress || "Not recorded"}</p>
            </div>
            <ul className="mt-3 space-y-1 text-xs text-charcoal/60">
              {order.items.map((item, index) => <li key={`${item.name}-${index}`}>{item.name} × {item.quantity}</li>)}
            </ul>
            <label className="mt-4 flex flex-wrap items-center gap-3 text-sm font-medium text-forest">
              Order status
              <select
                className="field max-w-52 capitalize"
                value={order.status}
                onChange={(event) => updateOrderStatus(order.id, event.target.value as OrderStatus)}
                aria-label={`Update status for order ${order.id}`}
              >
                {statuses.map((status) => <option key={status} value={status} className="capitalize">{status}</option>)}
              </select>
            </label>
          </article>
        ))}
      </div>
      {!orders.length && <p className="mt-5 rounded-2xl bg-white p-6 text-sm">No local orders found.</p>}
    </div>
  );
}

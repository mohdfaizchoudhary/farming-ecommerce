"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { CheckCircle2, Clock, Package } from "lucide-react";
import { useAuth } from "@/components/AuthProvider";
import { money } from "@/lib/catalog";
import { getLocalOrders, LOCAL_ORDERS_STORAGE_KEY } from "@/lib/local-orders";

type CustomerOrder = {
  id: string;
  orderNumber: string;
  date: string;
  total: number;
  status: string;
  paymentMethod: string;
  paymentStatus: string;
  items: { name: string; quantity: number }[];
};

const trackingSteps = [
  ["confirmed", "Confirmed"],
  ["processing", "Processing"],
  ["packed", "Packed"],
  ["shipped", "Shipped"],
  ["delivered", "Delivered"],
] as const;

export default function OrderHistory({ embedded = false }: { embedded?: boolean }) {
  const { session, loading } = useAuth();
  const [orders, setOrders] = useState<CustomerOrder[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [error, setError] = useState("");

  const refreshOrders = useCallback(() => {
    if (!session) return;
    try {
      setOrders(getLocalOrders()
        .filter((order) => order.customerId === session.user.id)
        .map((order): CustomerOrder => ({
          id: order.id,
          orderNumber: order.orderNumber,
          date: order.date,
          total: order.total,
          status: order.status,
          paymentMethod: order.paymentMethod,
          paymentStatus: order.paymentStatus,
          items: order.items.map((item) => ({ name: item.name, quantity: item.quantity })),
        })));
      setError("");
    } catch (cause) {
      console.error("Could not load locally saved customer orders.", cause);
      setError(cause instanceof Error ? cause.message : "Could not load your locally saved orders.");
    } finally {
      setOrdersLoading(false);
    }
  }, [session]);

  useEffect(() => {
    if (!session) {
      setOrders([]);
      setOrdersLoading(false);
      return;
    }
    setOrdersLoading(true);
    refreshOrders();
    const syncOrders = (event: StorageEvent) => {
      if (event.key === LOCAL_ORDERS_STORAGE_KEY) refreshOrders();
    };
    window.addEventListener("local-orders-changed", refreshOrders);
    window.addEventListener("storage", syncOrders);
    window.addEventListener("focus", refreshOrders);
    return () => {
      window.removeEventListener("local-orders-changed", refreshOrders);
      window.removeEventListener("storage", syncOrders);
      window.removeEventListener("focus", refreshOrders);
    };
  }, [refreshOrders, session]);

  const wrapper = embedded ? "mt-12 border-t border-forest/10 pt-10" : "container-shell py-12";
  if (loading || ordersLoading) {
    return <div className={`${wrapper} text-sm text-charcoal/60`} role="status">Loading your orders…</div>;
  }
  if (!session) {
    return (
      <div className={wrapper}>
        <p className="eyebrow">Your account</p>
        <h1 className="section-title mt-3">Order history</h1>
        <div className="mt-6 rounded-2xl bg-white p-7">
          <p className="text-sm text-charcoal/60">Sign in to view your order history.</p>
          <Link href="/login?next=%2Forders" className="btn-primary mt-4">Sign in</Link>
        </div>
      </div>
    );
  }

  return (
    <div className={wrapper}>
      <p className="eyebrow">Your account</p>
      <h1 className="section-title mt-3">Order history</h1>
      <p className="mt-3 text-sm text-charcoal/60">Orders are saved locally in this browser and are not synced to other devices.</p>
      {error && (
        <div className="mt-5 rounded-xl bg-rose-50 p-4 text-sm text-rose-700">
          <p role="alert">{error}</p>
          <button type="button" onClick={() => void refreshOrders()} className="mt-2 font-semibold underline">Try again</button>
        </div>
      )}
      {!orders.length && !error ? (
        <div className="mt-6 rounded-2xl bg-white p-7">
          <p>No orders yet.</p>
          <Link href="/products" className="btn-primary mt-4">Shop products</Link>
        </div>
      ) : (
        <div className="mt-6 space-y-4">
          {orders.map((order) => {
            const currentStep = trackingSteps.findIndex(([status]) => status === order.status);
            const cancelled = order.status === "cancelled";
            return (
              <article key={order.id} className="rounded-2xl bg-white p-5 sm:p-6">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <b className="text-forest">{order.orderNumber}</b>
                    <p className="mt-1 text-xs text-charcoal/50">{new Date(order.date).toLocaleString()}</p>
                  </div>
                  <b className="text-forest">{money(order.total)}</b>
                </div>
                <div className="mt-4 flex items-center gap-2 text-sm font-semibold">
                  {cancelled ? <Package className="h-4 w-4 text-rose-700" /> : order.status === "delivered" ? <CheckCircle2 className="h-4 w-4 text-emerald-700" /> : <Clock className="h-4 w-4 text-[#123C32]" />}
                  <span className={cancelled ? "text-rose-700" : "text-[#123C32]"}>
                    {cancelled ? "Cancelled" : trackingSteps.find(([status]) => status === order.status)?.[1] ?? "Order placed"}
                  </span>
                </div>
                {cancelled ? (
                  <p className="mt-3 rounded-xl bg-rose-50 p-3 text-sm text-rose-700">This order was cancelled.</p>
                ) : (
                  <ol className="mt-4 grid grid-cols-5 gap-2" aria-label={`Order progress: ${order.status}`}>
                    {trackingSteps.map(([status, label], index) => {
                      const complete = currentStep >= 0 && index <= currentStep;
                      return (
                        <li key={status} className="text-center">
                          <span className={`mx-auto block h-2 rounded-full ${complete ? "bg-forest" : "bg-forest/10"}`} />
                          <span className={`mt-2 block text-[10px] sm:text-xs ${complete ? "font-semibold text-forest" : "text-charcoal/45"}`}>{label}</span>
                        </li>
                      );
                    })}
                  </ol>
                )}
                <div className="mt-5 border-t border-forest/10 pt-4">
                  <ul className="space-y-1 text-sm text-charcoal/70">
                    {order.items.map((item, index) => <li key={`${item.name}-${index}`}>{item.name} × {item.quantity}</li>)}
                  </ul>
                  <p className="mt-3 text-xs text-charcoal/55">
                    Payment: {order.paymentMethod === "cod" ? "Cash on Delivery" : order.paymentMethod.toUpperCase()} · <span className="capitalize">{order.paymentStatus}</span>
                  </p>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}

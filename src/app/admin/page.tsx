"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  CreditCard,
  IndianRupee,
  Package,
  PackageCheck,
  Plus,
  ShoppingBag,
  Truck,
  Users,
} from "lucide-react";
import { useStore } from "@/components/StoreProvider";
import { money } from "@/lib/catalog";
import {
  getLocalOrders,
  LOCAL_ORDERS_STORAGE_KEY,
  type LocalOrder,
} from "@/lib/local-orders";

function localDateKey(date: Date) {
  return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
}

function getWeeklyOrderActivity(orders: LocalOrder[]) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const days = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(today);
    date.setDate(today.getDate() - (6 - index));
    const key = localDateKey(date);
    const count = orders.filter((order) => {
      if (order.status === "cancelled") return false;
      const orderDate = new Date(order.date);
      return !Number.isNaN(orderDate.getTime()) && localDateKey(orderDate) === key;
    }).length;

    return {
      key,
      day: date.toLocaleDateString(undefined, { weekday: "short" }),
      count,
    };
  });
  const maximum = Math.max(0, ...days.map((day) => day.count));
  return days.map((day) => ({
    ...day,
    pct: maximum ? Math.round((day.count / maximum) * 100) : 0,
  }));
}

export default function AdminDashboardPage() {
  const { customers, products, catalogLoading, catalogError } = useStore();
  const [orders, setOrders] = useState<LocalOrder[]>([]);
  const [ordersReady, setOrdersReady] = useState(false);
  const [ordersError, setOrdersError] = useState("");

  const refreshOrders = useCallback(() => {
    try {
      setOrders(getLocalOrders());
      setOrdersError("");
    } catch (cause) {
      console.error("Could not load locally saved dashboard orders.", cause);
      setOrdersError(cause instanceof Error ? cause.message : "Could not load locally saved orders.");
    } finally {
      setOrdersReady(true);
    }
  }, []);

  useEffect(() => {
    refreshOrders();
    const syncOrders = (event: StorageEvent) => {
      if (event.key === LOCAL_ORDERS_STORAGE_KEY) refreshOrders();
    };
    window.addEventListener("local-orders-changed", refreshOrders);
    window.addEventListener("storage", syncOrders);
    window.addEventListener("focus", refreshOrders);
    const interval = window.setInterval(refreshOrders, 15000);
    return () => {
      window.removeEventListener("local-orders-changed", refreshOrders);
      window.removeEventListener("storage", syncOrders);
      window.removeEventListener("focus", refreshOrders);
      window.clearInterval(interval);
    };
  }, [refreshOrders]);

  const weeklyActivity = useMemo(() => getWeeklyOrderActivity(orders), [orders]);
  const activeOrders = orders.filter((order) => order.status !== "cancelled");
  const cancelledOrders = orders.length - activeOrders.length;
  const revenue = activeOrders.reduce((sum, order) => sum + order.total, 0);
  const pendingDispatches = activeOrders.filter((order) =>
    ["confirmed", "processing", "packed"].includes(order.status),
  ).length;
  const inTransitOrders = activeOrders.filter((order) => order.status === "shipped").length;
  const deliveredOrders = activeOrders.filter((order) => order.status === "delivered").length;
  const paymentsToConfirm = activeOrders.filter((order) =>
    order.paymentMethod !== "cod" && order.paymentStatus !== "successful",
  ).length;

  const kpis = [
    {
      title: "Total Revenue",
      value: money(revenue),
      detail: "Non-cancelled order value; payments may need confirmation",
      icon: IndianRupee,
      accent: "bg-[#123C32] text-[#D9A65A]",
    },
    {
      title: "Total Orders",
      value: orders.length.toLocaleString("en-IN"),
      detail: `${cancelledOrders} cancelled`,
      icon: ShoppingBag,
      accent: "bg-[#E5EDE6] text-[#123C32]",
    },
    {
      title: "Registered Customers",
      value: customers.length.toLocaleString("en-IN"),
      detail: "Accounts saved in this browser",
      icon: Users,
      accent: "bg-[#E5EDE6] text-[#123C32]",
    },
    {
      title: "Active Products",
      value: products.length.toLocaleString("en-IN"),
      detail: catalogLoading ? "Refreshing local catalogue…" : "Published catalogue listings",
      icon: Package,
      accent: "bg-[#E5EDE6] text-[#123C32]",
    },
    {
      title: "Pending Dispatches",
      value: pendingDispatches.toLocaleString("en-IN"),
      detail: "Confirmed, processing or packed",
      icon: PackageCheck,
      accent: "bg-amber-100 text-amber-800",
    },
    {
      title: "Payments to Confirm",
      value: paymentsToConfirm.toLocaleString("en-IN"),
      detail: "UPI/card orders not marked successful",
      icon: CreditCard,
      accent: "bg-sky-100 text-sky-800",
    },
  ];

  const queueItems = [
    { label: "Awaiting dispatch", count: pendingDispatches, icon: PackageCheck },
    { label: "In transit", count: inTransitOrders, icon: Truck },
    { label: "Delivered orders", count: deliveredOrders, icon: CheckCircle2 },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-[0.18em] text-[#123C32]/60">
            Executive Command Center
          </span>
          <h1 className="font-serif text-2xl sm:text-4xl font-bold text-[#123C32] mt-1">
            Dashboard
          </h1>
          <p className="mt-2 text-xs text-[#202824]/60">
            Live local data. Revenue is based on non-cancelled orders; local demo payments are not independently verified.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/products"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-[#123C32] text-[#F7F5EF] text-xs sm:text-sm font-bold hover:bg-[#1a5244] transition-all shadow-md"
          >
            <Plus className="w-4 h-4 text-[#D9A65A]" /> Add Listing
          </Link>
          <Link
            href="/admin/orders"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white border border-[#123C32]/15 text-[#123C32] text-xs sm:text-sm font-bold hover:bg-[#E5EDE6] transition-all"
          >
            Manage Orders
          </Link>
        </div>
      </div>

      {ordersError && (
        <p role="alert" className="rounded-2xl bg-rose-50 p-4 text-sm text-rose-700">
          Could not refresh order metrics: {ordersError}
        </p>
      )}
      {catalogError && (
        <p role="alert" className="rounded-2xl bg-rose-50 p-4 text-sm text-rose-700">
          Could not refresh product metrics: {catalogError}
        </p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        {kpis.map((kpi, index) => {
          const Icon = kpi.icon;
          return (
            <motion.div
              key={kpi.title}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.06 }}
              whileHover={{ y: -4 }}
              className="bg-white rounded-3xl p-6 border border-[#123C32]/10 shadow-sm hover:shadow-xl transition-all"
            >
              <span className={`w-11 h-11 rounded-2xl flex items-center justify-center ${kpi.accent}`}>
                <Icon className="w-5 h-5" />
              </span>
              <div className="mt-5">
                <p className="text-xs font-semibold text-[#202824]/60 uppercase tracking-wider">
                  {kpi.title}
                </p>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#123C32] mt-1" aria-live="polite">
                  {kpi.value}
                </h2>
                <p className="text-xs font-medium text-[#202824]/60 mt-1.5">
                  {kpi.detail}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-[#123C32]/10 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-serif text-xl font-bold text-[#123C32]">
                7-Day Order Activity
              </h3>
              <p className="text-xs text-[#202824]/60">
                Non-cancelled orders by day
              </p>
            </div>
            <span className="px-3 py-1 rounded-full bg-[#E5EDE6] text-[#123C32] text-xs font-bold">
              Live local data
            </span>
          </div>

          <div className="h-52 flex items-end justify-between gap-3 pt-6 px-2">
            {weeklyActivity.map((bar, index) => (
              <div
                key={bar.key}
                className="flex-1 flex flex-col items-center gap-2 h-full justify-end"
              >
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${bar.pct}%` }}
                  transition={{
                    duration: 0.7,
                    delay: index * 0.08,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  aria-label={`${bar.count} orders on ${bar.day}`}
                  title={`${bar.count} orders`}
                  className="w-full max-w-[2.5rem] rounded-t-xl bg-gradient-to-t from-[#123C32] to-[#236b59] hover:from-[#D9A65A] hover:to-[#e6bc7a] transition-colors"
                />
                <span className="text-xs font-bold text-[#202824]/65">
                  {bar.day}
                </span>
              </div>
            ))}
          </div>
          {!ordersReady && (
            <p role="status" className="mt-3 text-xs text-[#202824]/60">
              Loading saved orders…
            </p>
          )}
        </div>

        <div className="lg:col-span-5 bg-[#123C32] text-[#F7F5EF] rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#D9A65A]">
              Live Order Status
            </span>
            <h3 className="font-serif text-2xl font-bold mt-1">
              Dispatch & Delivery Queue
            </h3>

            <div className="mt-6 space-y-3.5">
              {queueItems.map((row) => {
                const Icon = row.icon;
                return (
                  <div
                    key={row.label}
                    className="flex items-center justify-between p-3.5 rounded-2xl bg-white/10 border border-white/10"
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-4 h-4 text-[#D9A65A]" />
                      <span className="text-xs sm:text-sm font-medium">
                        {row.label}
                      </span>
                    </div>
                    <span className="text-xs font-bold text-[#D9A65A]">
                      {row.count.toLocaleString("en-IN")}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <Link
            href="/admin/orders"
            className="mt-6 w-full text-center py-3 rounded-2xl bg-[#D9A65A] text-[#202824] font-bold text-xs sm:text-sm hover:bg-[#e5b56d] transition-colors"
          >
            Open All Orders →
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-[#123C32]/10 shadow-sm overflow-hidden">
        <div className="p-6 flex items-center justify-between border-b border-[#123C32]/10">
          <h3 className="font-serif text-xl font-bold text-[#123C32]">
            Recent Orders
          </h3>
          <Link
            href="/admin/orders"
            className="text-xs font-bold text-[#123C32] hover:text-[#D9A65A]"
          >
            View All Orders →
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[850px] text-left border-collapse">
            <thead>
              <tr className="bg-[#F7F5EF] text-[11px] font-bold uppercase tracking-wider text-[#123C32]/70">
                <th className="py-3.5 px-6">Order ID</th>
                <th className="py-3.5 px-6">Customer</th>
                <th className="py-3.5 px-6">Items</th>
                <th className="py-3.5 px-6">Amount</th>
                <th className="py-3.5 px-6">Payment</th>
                <th className="py-3.5 px-6">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#123C32]/10 text-sm">
              {orders.slice(0, 5).map((order) => (
                <tr key={order.id} className="hover:bg-[#F7F5EF]/60 transition-colors">
                  <td className="py-4 px-6">
                    <span className="font-mono font-bold text-[#123C32]">{order.orderNumber}</span>
                    <span className="block text-[11px] text-[#202824]/55">
                      {new Date(order.date).toLocaleString()}
                    </span>
                  </td>
                  <td className="py-4 px-6 font-semibold">{order.customerName}</td>
                  <td className="py-4 px-6 text-xs">
                    {order.items.map((item) => `${item.name} × ${item.quantity}`).join(", ")}
                  </td>
                  <td className="py-4 px-6 font-bold">{money(order.total)}</td>
                  <td className="py-4 px-6 text-xs">
                    <span className="block">
                      {order.paymentMethod === "cod" ? "Cash on Delivery" : order.paymentMethod.toUpperCase()}
                    </span>
                    <span className="capitalize text-[#202824]/60">{order.paymentStatus}</span>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold capitalize ${
                      order.status === "cancelled"
                        ? "bg-rose-100 text-rose-700"
                        : order.status === "delivered"
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-[#E5EDE6] text-[#123C32]"
                    }`}>
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
              {ordersReady && orders.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-sm text-[#202824]/60">
                    No orders are saved in this browser yet.
                  </td>
                </tr>
              )}
              {!ordersReady && (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-sm text-[#202824]/60">
                    Loading saved orders…
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

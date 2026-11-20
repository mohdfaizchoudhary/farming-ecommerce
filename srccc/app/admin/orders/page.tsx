"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, MapPin, Package, Phone, Search, X } from "lucide-react";
import { money } from "@/lib/catalog";
import {
  getLocalOrders,
  LOCAL_ORDERS_STORAGE_KEY,
  updateLocalOrderStatus,
  type LocalOrderStatus,
} from "@/lib/local-orders";

type AdminOrder = {
  id: string;
  orderNumber: string;
  date: string;
  customer: string;
  phone: string;
  address: string;
  items: { name: string; quantity: number; price: number }[];
  total: number;
  paymentMethod: string;
  paymentStatus: string;
  status: LocalOrderStatus;
};

const ORDER_STATUS_OPTIONS: { value: LocalOrderStatus; label: string }[] = [
  { value: "confirmed", label: "Confirmed" },
  { value: "processing", label: "Processing" },
  { value: "packed", label: "Packed" },
  { value: "shipped", label: "Shipped" },
  { value: "delivered", label: "Delivered" },
  { value: "cancelled", label: "Cancelled" },
];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<AdminOrder | null>(null);
  const [savingOrderId, setSavingOrderId] = useState("");

  const refreshOrders = useCallback(() => {
    try {
      setOrders(getLocalOrders().map((order): AdminOrder => ({
        id: order.id,
        orderNumber: order.orderNumber,
        date: order.date,
        customer: order.customerName,
        phone: order.customerPhone,
        address: order.customerAddress,
        items: order.items.map((item) => ({ name: item.name, quantity: item.quantity, price: item.price })),
        total: order.total,
        paymentMethod: order.paymentMethod,
        paymentStatus: order.paymentStatus,
        status: order.status,
      })));
      setError("");
    } catch (cause) {
      console.error("Could not load locally saved admin orders.", cause);
      setError(cause instanceof Error ? cause.message : "Could not load locally saved orders.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    setLoading(true);
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
  }, [refreshOrders]);

  const filteredOrders = useMemo(() => orders.filter((order) => {
    const matchStatus = statusFilter === "All" || order.status === statusFilter;
    const query = search.toLowerCase();
    const matchText = order.orderNumber.toLowerCase().includes(query) || order.customer.toLowerCase().includes(query);
    return matchStatus && matchText;
  }), [orders, search, statusFilter]);

  function handleStatusChange(orderId: string, newStatus: LocalOrderStatus) {
    setSavingOrderId(orderId);
    setError("");
    try {
      const updated = updateLocalOrderStatus(orderId, newStatus);
      refreshOrders();
      setSelectedOrder((current) => current?.id === orderId
        ? { ...current, status: updated.status }
        : current);
    } catch (cause) {
      console.error("Could not update order status.", cause);
      setError(cause instanceof Error ? cause.message : "Could not update locally saved order status.");
    } finally {
      setSavingOrderId("");
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <span className="text-xs font-bold uppercase tracking-[0.18em] text-[#123C32]/60">Fulfilment</span>
        <h1 className="font-serif text-2xl sm:text-4xl font-bold text-[#123C32] mt-1">Orders</h1>
        <p className="mt-2 text-sm text-[#202824]/60">Orders are saved only in this browser and appear here when placed from the same browser.</p>
      </div>

      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white p-4 rounded-3xl border border-[#123C32]/10 shadow-sm">
        <div className="flex flex-wrap gap-1.5">
          {["All", ...ORDER_STATUS_OPTIONS.map((status) => status.value)].map((status) => (
            <button key={status} type="button" onClick={() => setStatusFilter(status)} className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize ${statusFilter === status ? "bg-[#123C32] text-white" : "bg-[#F7F5EF] text-[#202824]/75"}`}>
              {status}
            </button>
          ))}
        </div>
        <label className="relative w-full lg:w-72">
          <span className="sr-only">Search orders by ID or customer</span>
          <Search className="w-4 h-4 text-[#123C32]/45 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Order ID or customer..." className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#F7F5EF] text-sm focus:outline-none" />
        </label>
      </div>

      {error && <p role="alert" className="rounded-xl bg-rose-50 p-4 text-sm text-rose-700">{error}</p>}
      {loading ? (
        <p role="status" className="rounded-2xl bg-white p-6 text-sm text-[#202824]/60">Loading orders…</p>
      ) : !filteredOrders.length ? (
        <p className="rounded-2xl bg-white p-6 text-sm text-[#202824]/60">{orders.length ? "No orders match your filters." : "No customer orders found."}</p>
      ) : (
        <div className="bg-white rounded-3xl border border-[#123C32]/10 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[850px] text-left border-collapse">
              <thead>
                <tr className="bg-[#F7F5EF] text-[11px] font-bold uppercase tracking-wider text-[#123C32]/70">
                  <th className="py-4 px-5">Order</th><th className="py-4 px-5">Customer</th><th className="py-4 px-5">Items</th><th className="py-4 px-5">Total</th><th className="py-4 px-5">Status</th><th className="py-4 px-5 text-right">Manage</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#123C32]/10 text-sm">
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-[#F7F5EF]/50">
                    <td className="py-4 px-5"><b className="font-mono text-[#123C32]">{order.orderNumber}</b><span className="block text-[11px] text-[#202824]/55">{new Date(order.date).toLocaleString()}</span></td>
                    <td className="py-4 px-5"><b className="block">{order.customer}</b><span className="text-xs">{order.phone}</span></td>
                    <td className="py-4 px-5 text-xs">{order.items.map((item) => `${item.name} × ${item.quantity}`).join(", ")}</td>
                    <td className="py-4 px-5"><b>{money(order.total)}</b><span className="block text-[11px] capitalize">{order.paymentMethod === "cod" ? "Cash on Delivery" : order.paymentMethod.toUpperCase()} · {order.paymentStatus}</span></td>
                    <td className="py-4 px-5"><span className={`rounded-full px-3 py-1 text-xs font-bold capitalize ${order.status === "cancelled" ? "bg-rose-100 text-rose-700" : order.status === "delivered" ? "bg-emerald-100 text-emerald-800" : "bg-[#E5EDE6] text-[#123C32]"}`}>{order.status}</span></td>
                    <td className="py-4 px-5 text-right"><button type="button" onClick={() => setSelectedOrder(order)} className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#123C32] text-white text-xs font-bold"><Eye className="h-3.5 w-3.5" /> Manage</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <AnimatePresence>
        {selectedOrder && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedOrder(null)} className="fixed inset-0 bg-black/50 z-50" />
            <motion.aside initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} className="fixed inset-y-0 right-0 z-50 w-full max-w-md overflow-y-auto bg-[#F7F5EF] p-6 sm:p-8 shadow-2xl">
              <div className="flex items-center justify-between border-b border-[#123C32]/10 pb-4">
                <div><span className="font-mono text-xs font-bold text-[#123C32]">{selectedOrder.orderNumber}</span><h2 className="font-serif text-2xl font-bold text-[#123C32]">Manage Order</h2></div>
                <button type="button" onClick={() => setSelectedOrder(null)} aria-label="Close order details" className="p-2 rounded-full bg-[#E5EDE6]"><X className="h-5 w-5" /></button>
              </div>
              <div className="mt-6 space-y-4">
                <div className="rounded-2xl bg-white p-4 space-y-2">
                  <b>{selectedOrder.customer}</b>
                  <p className="flex gap-2 text-sm"><Phone className="h-4 w-4 shrink-0" />{selectedOrder.phone}</p>
                  <p className="flex gap-2 text-sm"><MapPin className="h-4 w-4 shrink-0" />{selectedOrder.address || "No delivery address recorded."}</p>
                </div>
                <div className="rounded-2xl bg-white p-4">
                  <p className="flex items-center gap-2 font-semibold text-[#123C32]"><Package className="h-4 w-4" />Order items</p>
                  <ul className="mt-3 space-y-2 text-sm">
                    {selectedOrder.items.map((item, index) => <li key={`${item.name}-${index}`} className="flex justify-between gap-3"><span>{item.name} × {item.quantity}</span><span>{money(item.price * item.quantity)}</span></li>)}
                  </ul>
                  <p className="mt-3 border-t pt-3 font-bold">Total: {money(selectedOrder.total)}</p>
                </div>
                <label className="block rounded-2xl bg-[#123C32] p-5 text-white">
                  <span className="block text-xs font-bold uppercase tracking-wider text-[#D9A65A]">Update order status</span>
                  <select value={selectedOrder.status} disabled={savingOrderId === selectedOrder.id} onChange={(event) => handleStatusChange(selectedOrder.id, event.target.value as LocalOrderStatus)} className="mt-3 w-full rounded-xl bg-white px-4 py-3 text-sm font-bold text-[#123C32] disabled:opacity-60">
                    {ORDER_STATUS_OPTIONS.map((status) => <option key={status.value} value={status.value}>{status.label}</option>)}
                  </select>
                </label>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

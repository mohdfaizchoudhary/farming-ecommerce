"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useStore, type OrderRequest, type OrderStatus, type StoreOrder } from "@/components/StoreProvider";
import { useAuth } from "@/components/AuthProvider";
import { getCatalogProducts, money, type Product } from "@/lib/catalog";

const trackingSteps: OrderStatus[] = ["placed", "confirmed", "processing", "shipped", "delivered"];
const paymentMethods = { cod: "Cash on Delivery", upi: "UPI", card: "Credit / Debit Card", unknown: "Not recorded" };
const cancellationReasons = [
  "Ordered by mistake",
  "Found a better price",
  "Delivery is taking too long",
  "Other",
];
const returnReasons = [
  "Item arrived damaged",
  "Wrong item delivered",
  "Quality issue",
  "Other",
];

type RequestDialog = { orderId: string; mode: "cancel" | "replace-return" } | null;

export default function OrderHistory({ embedded = false }: { embedded?: boolean }) {
  const { orders, orderRequests, addOrderRequest } = useStore();
  const { session, loading } = useAuth();
  const [catalog, setCatalog] = useState<Product[]>([]);
  const [dialog, setDialog] = useState<RequestDialog>(null);
  const [dialogClosing, setDialogClosing] = useState(false);
  const [requestType, setRequestType] = useState<"replace" | "return">("return");
  const [reason, setReason] = useState("");
  const [originalItemIndex, setOriginalItemIndex] = useState(0);
  const [replacementProductId, setReplacementProductId] = useState("");
  const [confirmDifference, setConfirmDifference] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => setCatalog(getCatalogProducts()), []);

  const activeOrder = dialog ? orders.find((order) => order.id === dialog.orderId) : undefined;
  const originalItem = activeOrder?.items[originalItemIndex];
  const replacementProduct = catalog.find((product) => product.id === replacementProductId);
  const replacementOptions = catalog.filter((product) => product.name !== originalItem?.name);
  const originalTotal = originalItem ? originalItem.price * originalItem.quantity : 0;
  const replacementTotal = replacementProduct && originalItem
    ? replacementProduct.price * originalItem.quantity
    : 0;
  const priceDifference = replacementTotal - originalTotal;
  const customerOrders = session
    ? orders.filter((order) =>
        order.customerId === session.user.id
        || (!!session.user.email && order.customerEmail?.toLowerCase() === session.user.email.toLowerCase()),
      )
    : [];

  function openDialog(orderId: string, mode: NonNullable<RequestDialog>["mode"]) {
    const order = orders.find((entry) => entry.id === orderId);
    const firstItem = order?.items[0];
    setDialog({ orderId, mode });
    setDialogClosing(false);
    setRequestType("return");
    setReason("");
    setOriginalItemIndex(0);
    setReplacementProductId(catalog.find((product) => product.name !== firstItem?.name)?.id ?? "");
    setConfirmDifference(false);
    setError("");
  }

  function closeDialog() {
    setDialogClosing(true);
    setError("");
  }

  function submitRequest(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!activeOrder || !dialog) return;
    setError("");

    if (!reason && (dialog.mode === "cancel" || requestType === "return")) {
      setError("Select a reason before submitting your request.");
      return;
    }
    if (dialog.mode === "replace-return" && requestType === "replace"
      && (!originalItem || !replacementProduct || (priceDifference > 0 && !confirmDifference))) {
      setError("Choose a replacement product and confirm any additional amount due.");
      return;
    }

    setSubmitting(true);

    try {
      const request: Omit<OrderRequest, "id" | "status" | "createdAt"> = dialog.mode === "cancel"
        ? { orderId: activeOrder.id, type: "cancellation", reason }
        : requestType === "return"
          ? { orderId: activeOrder.id, type: "return", reason }
          : {
              orderId: activeOrder.id,
              type: "replacement",
              reason: "Replacement requested",
              originalProductName: originalItem?.name,
              replacementProductId: replacementProduct?.id,
              replacementProductName: replacementProduct?.name,
              quantity: originalItem?.quantity,
              originalTotal,
              replacementTotal,
            };

      addOrderRequest(request);
      closeDialog();
    } catch (cause) {
      console.error("Could not submit the order request.", cause);
      setError(cause instanceof Error ? cause.message : "We couldn't submit this request. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return <div className={embedded ? "mt-12 border-t border-forest/10 pt-10 text-sm text-charcoal/60" : "container-shell py-12 text-sm text-charcoal/60"} role="status">Checking your sign-in…</div>;
  }

  if (!session) {
    return (
      <div className={embedded ? "mt-12 border-t border-forest/10 pt-10" : "container-shell py-12"}>
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
    <div className={embedded ? "mt-12 border-t border-forest/10 pt-10" : "container-shell py-12"}>
      <p className="eyebrow">Your account</p>
      <h1 className="section-title mt-3">Order history</h1>
      <p className="mt-3 text-sm text-charcoal/60">Requests are saved in this browser and appear in the admin request inbox.</p>
      {!customerOrders.length ? (
        <div className="mt-6 rounded-2xl bg-white p-7">
          <p>No demo orders yet.</p>
          <Link href="/products" className="btn-primary mt-4">Shop products</Link>
        </div>
      ) : (
        <div className="mt-6 space-y-4">
          {customerOrders.map((order: StoreOrder) => {
            const currentStep = trackingSteps.indexOf(order.status);
            const requests = orderRequests.filter((request) => request.orderId === order.id);
            const hasPendingRequest = requests.some((request) => request.status === "requested");
            return (
              <article key={order.id} className="rounded-2xl bg-white p-5 sm:p-6">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <b className="text-forest">{order.id}</b>
                    <p className="mt-1 text-xs text-charcoal/50">{new Date(order.date).toLocaleString()}</p>
                  </div>
                  <b className="text-forest">{money(order.total)}</b>
                </div>
                {order.status === "cancelled" ? (
                  <p className="mt-5 rounded-xl bg-rose-50 p-3 text-sm font-medium text-rose-700">This order was cancelled.</p>
                ) : (
                  <ol className="mt-6 grid grid-cols-5 gap-2" aria-label={`Order tracking: ${order.status}`}>
                    {trackingSteps.map((step, index) => {
                      const complete = index <= currentStep;
                      return (
                        <li key={step} className="text-center">
                          <span className={`mx-auto block h-2 rounded-full ${complete ? "bg-forest" : "bg-forest/10"}`} />
                          <span className={`mt-2 block text-[10px] capitalize sm:text-xs ${complete ? "font-semibold text-forest" : "text-charcoal/45"}`}>{step}</span>
                        </li>
                      );
                    })}
                  </ol>
                )}
                <div className="mt-5 grid gap-2 border-t border-forest/10 pt-4 text-sm sm:grid-cols-2">
                  <p><span className="text-charcoal/55">Payment method:</span> {paymentMethods[order.paymentMethod] ?? "Demo"}</p>
                  <p><span className="text-charcoal/55">Payment status:</span> <span className="capitalize">{order.paymentStatus}</span></p>
                </div>
                <ul className="mt-3 space-y-1 text-xs text-charcoal/60">
                  {order.items.map((item, index) => <li key={`${item.name}-${index}`}>{item.name} × {item.quantity}</li>)}
                </ul>
                <div className="mt-5 flex flex-wrap gap-3 border-t border-forest/10 pt-4">
                  <button
                    type="button"
                    disabled={["shipped", "delivered", "cancelled"].includes(order.status) || hasPendingRequest}
                    onClick={() => openDialog(order.id, "cancel")}
                    className="btn-secondary disabled:cursor-not-allowed disabled:opacity-45"
                  >
                    Cancel Order
                  </button>
                  {order.status === "delivered" && (
                    <button
                      type="button"
                      disabled={hasPendingRequest}
                      onClick={() => openDialog(order.id, "replace-return")}
                      className="btn-secondary disabled:cursor-not-allowed disabled:opacity-45"
                    >
                      Replace/Return
                    </button>
                  )}
                </div>
                {requests.length > 0 && (
                  <div className="mt-4 space-y-2" aria-label="Order request status">
                    {requests.map((request) => (
                      <div key={request.id} className="rounded-xl bg-sage p-3 text-sm text-forest">
                        <p>
                          {request.type === "cancellation" ? "Cancellation" : request.type === "replacement" ? "Replacement" : "Return"} request · <span className="capitalize">{request.status}</span>
                          {request.status === "requested" && " — awaiting admin review"}
                          {request.type === "replacement" && request.replacementProductName && ` · ${request.replacementProductName}`}
                        </p>
                        {request.type === "replacement" && request.status === "approved" && request.originalTotal !== undefined && request.replacementTotal !== undefined && (
                          <p className="mt-1 text-xs">
                            {request.replacementTotal > request.originalTotal
                              ? `${money(request.replacementTotal - request.originalTotal)} is due at replacement checkout.`
                              : request.replacementTotal < request.originalTotal
                                ? `${money(request.originalTotal - request.replacementTotal)} will be credited to your bank account within 7 days.`
                                : "There is no price difference."}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </article>
            );
          })}
        </div>
      )}
      {dialog && activeOrder && (
        <div
          className="modal-backdrop fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-charcoal/60 p-4"
          data-state={dialogClosing ? "closing" : "open"}
          role="presentation"
          onAnimationEnd={(event) => {
            if (event.target === event.currentTarget && event.animationName === "backdrop-exit") {
              setDialog(null);
              setDialogClosing(false);
            }
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="order-request-title"
            className="modal-panel my-auto max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl"
            data-state={dialogClosing ? "closing" : "open"}
          >
            <h2 id="order-request-title" className="font-serif text-2xl text-forest">
              {dialog.mode === "cancel" ? "Cancel order" : "Replace or return"}
            </h2>
            <p className="mt-2 text-sm text-charcoal/60">Order {activeOrder.id}</p>
            <form onSubmit={submitRequest} className="mt-5 space-y-4">
              {dialog.mode === "cancel" ? (
                <label className="block text-sm font-medium text-forest">
                  Reason for cancellation
                  <select className="field mt-2" value={reason} onChange={(event) => setReason(event.target.value)} required>
                    <option value="">Select a reason</option>
                    {cancellationReasons.map((option) => <option key={option} value={option}>{option}</option>)}
                  </select>
                </label>
              ) : (
                <>
                  <label className="block text-sm font-medium text-forest">
                    What would you like to do?
                    <select
                      className="field mt-2"
                      value={requestType}
                      onChange={(event) => {
                        setRequestType(event.target.value as "replace" | "return");
                        setReason("");
                        setConfirmDifference(false);
                      }}
                    >
                      <option value="return">Return</option>
                      <option value="replace">Replace</option>
                    </select>
                  </label>
                  {requestType === "return" ? (
                    <label className="block text-sm font-medium text-forest">
                      Reason for return
                      <select className="field mt-2" value={reason} onChange={(event) => setReason(event.target.value)} required>
                        <option value="">Select a reason</option>
                        {returnReasons.map((option) => <option key={option} value={option}>{option}</option>)}
                      </select>
                    </label>
                  ) : (
                    <>
                      <label className="block text-sm font-medium text-forest">
                        Item to replace
                        <select
                          className="field mt-2"
                          value={originalItemIndex}
                          onChange={(event) => {
                            const nextIndex = Number(event.target.value);
                            setOriginalItemIndex(nextIndex);
                            setReplacementProductId(
                              catalog.find((product) => product.name !== activeOrder.items[nextIndex]?.name)?.id ?? "",
                            );
                            setConfirmDifference(false);
                          }}
                        >
                          {activeOrder.items.map((item, index) => (
                            <option key={`${item.name}-${index}`} value={index}>{item.name} × {item.quantity}</option>
                          ))}
                        </select>
                      </label>
                      <label className="block text-sm font-medium text-forest">
                        Replacement product
                        <select
                          className="field mt-2"
                          value={replacementProductId}
                          onChange={(event) => {
                            setReplacementProductId(event.target.value);
                            setConfirmDifference(false);
                          }}
                          required
                        >
                          <option value="">Select a product</option>
                          {replacementOptions.map((product) => (
                            <option key={product.id} value={product.id}>{product.name} · {money(product.price)}</option>
                          ))}
                        </select>
                      </label>
                      {replacementProduct && originalItem && (
                        <div className="rounded-xl bg-sage p-4 text-sm text-forest">
                          <p>Original item total: <b>{money(originalTotal)}</b></p>
                          <p className="mt-1">Replacement total: <b>{money(replacementTotal)}</b></p>
                          {priceDifference > 0 ? (
                            <label className="mt-3 flex items-start gap-2">
                              <input
                                type="checkbox"
                                className="mt-1 accent-[#123C32]"
                                checked={confirmDifference}
                                onChange={(event) => setConfirmDifference(event.target.checked)}
                                required
                              />
                              <span>If approved, I agree to pay the {money(priceDifference)} difference during replacement checkout.</span>
                            </label>
                          ) : priceDifference < 0 ? (
                            <p className="mt-3">If approved, the remaining {money(Math.abs(priceDifference))} will be credited to your bank account within 7 days.</p>
                          ) : (
                            <p className="mt-3">There is no price difference.</p>
                          )}
                        </div>
                      )}
                    </>
                  )}
                </>
              )}
              <p className="text-xs leading-5 text-charcoal/55">This demo saves your request in this browser only. No payment or bank credit is processed here.</p>
              {error && <p role="alert" className="text-sm text-rose-700">{error}</p>}
              <div className="flex flex-wrap gap-3">
                <button type="submit" disabled={submitting} className="btn-primary disabled:opacity-60">
                  {submitting ? "Submitting…" : "Submit request"}
                </button>
                <button type="button" onClick={closeDialog} className="btn-secondary">Keep order</button>
              </div>
            </form>
          </section>
        </div>
      )}
    </div>
  );
}

"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Banknote, CreditCard, Smartphone } from "lucide-react";
import { toDataURL } from "qrcode";
import { useAuth } from "@/components/AuthProvider";
import { useStore } from "@/components/StoreProvider";
import { getCatalogProducts, money, saveCatalogProducts } from "@/lib/catalog";
import { placeLocalOrder, type LocalPaymentMethod } from "@/lib/local-orders";

const merchantUpiId = process.env.NEXT_PUBLIC_UPI_ID?.trim() || "9068104055-2@ybl";
const merchantName = "SMS Farmstead Ventures Pvt. Ltd.";

export default function CheckoutPage() {
  const router = useRouter();
  const { session, loading } = useAuth();
  const { cart, products, clearCart } = useStore();
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<LocalPaymentMethod>("cod");
  const [upiQr, setUpiQr] = useState("");
  const [upiQrError, setUpiQrError] = useState("");
  const [upiQrLoading, setUpiQrLoading] = useState(false);

  const items = useMemo(() => cart.flatMap((item) => {
    const product = products.find((entry) => entry.id === item.productId);
    return product ? [{ ...item, product }] : [];
  }), [cart, products]);
  const total = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const upiIntent = useMemo(() => {
    const params = new URLSearchParams({
      pa: merchantUpiId,
      pn: merchantName,
      am: total.toFixed(2),
      cu: "INR",
      tn: "SMS Farmstead order",
    });
    return `upi://pay?${params.toString()}`;
  }, [total]);

  useEffect(() => {
    if (!loading && !session) router.replace("/login?next=%2Fcheckout");
  }, [loading, router, session]);

  useEffect(() => {
    if (!session) return;
    setFullName((value) => value || String(session.user.user_metadata.full_name ?? ""));
  }, [session]);

  useEffect(() => {
    if (paymentMethod !== "upi" || total <= 0) {
      setUpiQr("");
      setUpiQrError("");
      setUpiQrLoading(false);
      return;
    }

    let active = true;
    setUpiQr("");
    setUpiQrError("");
    setUpiQrLoading(true);
    toDataURL(upiIntent, { width: 256, margin: 1, errorCorrectionLevel: "M" })
      .then((dataUrl) => {
        if (active) setUpiQr(dataUrl);
      })
      .catch((cause: unknown) => {
        if (active) setUpiQrError(cause instanceof Error ? cause.message : "Could not generate the UPI QR code.");
      })
      .finally(() => {
        if (active) setUpiQrLoading(false);
      });

    return () => {
      active = false;
    };
  }, [paymentMethod, total, upiIntent]);

  async function placeOrder(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    if (!session) {
      router.replace("/login?next=%2Fcheckout");
      return;
    }
    if (!items.length || items.length !== cart.length) {
      setError("Your cart contains unavailable products. Remove them and try again.");
      return;
    }
    const unavailable = items.find((item) => item.quantity > item.product.stock);
    if (unavailable) {
      setError(`Only ${unavailable.product.stock} of ${unavailable.product.name} are currently available.`);
      return;
    }

    setSubmitting(true);
    setError("");
    const checkoutDetails = {
      customerId: session.user.id,
      customerName: fullName.trim(),
      customerEmail: session.user.email ?? "",
      customerPhone: phone.trim(),
      customerAddress: [address.trim(), city.trim(), state.trim(), postalCode.trim()].filter(Boolean).join(", "),
      paymentMethod,
    };
    try {
      const currentCatalog = getCatalogProducts();
      const orderItems = cart.map((cartItem) => {
        const product = currentCatalog.find((entry) => entry.id === cartItem.productId && entry.published !== false);
        if (!product) throw new Error("Your cart contains unavailable products. Remove them and try again.");
        if (cartItem.quantity > product.stock) {
          throw new Error(`Only ${product.stock} of ${product.name} are currently available.`);
        }
        return {
          productId: product.id,
          name: product.name,
          quantity: cartItem.quantity,
          price: product.price,
        };
      });

      const quantities = new Map(orderItems.map((item) => [item.productId, item.quantity]));
      const updatedCatalog = currentCatalog.map((product) => ({
        ...product,
        stock: product.stock - (quantities.get(product.id) ?? 0),
      }));
      saveCatalogProducts(updatedCatalog);
      window.dispatchEvent(new Event("catalog-changed"));
      let order: ReturnType<typeof placeLocalOrder>;
      try {
        order = placeLocalOrder({ ...checkoutDetails, items: orderItems });
      } catch (cause) {
        saveCatalogProducts(currentCatalog);
        window.dispatchEvent(new Event("catalog-changed"));
        throw cause;
      }
      clearCart();
      router.push(`/order-success?id=${encodeURIComponent(order.orderNumber)}`);
    } catch (cause) {
      console.error("Could not place order.", cause);
      setError(cause instanceof Error ? cause.message : "We couldn't save your order in this browser.");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading || !session) {
    return <div className="container-shell py-12" role="status">Checking your sign-in…</div>;
  }

  if (!cart.length) {
    return (
      <div className="container-shell py-12">
        <h1 className="section-title">Your cart is empty</h1>
        <Link href="/products" className="btn-primary mt-5">Browse products</Link>
      </div>
    );
  }

  return (
    <div className="bg-[#F7F5EF] min-h-screen py-10 sm:py-14">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-xs font-bold uppercase tracking-widest text-[#123C32]/65">Order details</p>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#123C32] mt-2">Checkout</h1>
        <div className="mt-7 grid lg:grid-cols-[minmax(0,1fr)_340px] gap-6 items-start">
          <form onSubmit={placeOrder} autoComplete="off" className="bg-white rounded-3xl p-5 sm:p-7 border border-[#123C32]/10 space-y-4">
            <h2 className="font-serif text-xl font-bold text-[#123C32]">Delivery Address</h2>
            <label className="block text-sm font-medium text-[#123C32]">
              Recipient name
              <input required maxLength={200} value={fullName} onChange={(event) => setFullName(event.target.value)} className="mt-2 w-full rounded-xl bg-[#F7F5EF] px-4 py-3 text-sm" autoComplete="name" />
            </label>
            <label className="block text-sm font-medium text-[#123C32]">
              Phone number
              <input required minLength={5} maxLength={40} value={phone} onChange={(event) => setPhone(event.target.value)} className="mt-2 w-full rounded-xl bg-[#F7F5EF] px-4 py-3 text-sm" autoComplete="tel" />
            </label>
            <label className="block text-sm font-medium text-[#123C32]">
              Address
              <textarea required minLength={5} maxLength={500} value={address} onChange={(event) => setAddress(event.target.value)} className="mt-2 w-full rounded-xl bg-[#F7F5EF] px-4 py-3 text-sm" autoComplete="street-address" rows={3} />
            </label>
            <div className="grid sm:grid-cols-3 gap-3">
              <label className="block text-sm font-medium text-[#123C32]">
                City
                <input required value={city} onChange={(event) => setCity(event.target.value)} className="mt-2 w-full rounded-xl bg-[#F7F5EF] px-3 py-3 text-sm" autoComplete="address-level2" />
              </label>
              <label className="block text-sm font-medium text-[#123C32]">
                State
                <input value={state} onChange={(event) => setState(event.target.value)} className="mt-2 w-full rounded-xl bg-[#F7F5EF] px-3 py-3 text-sm" autoComplete="address-level1" />
              </label>
              <label className="block text-sm font-medium text-[#123C32]">
                PIN code
                <input required minLength={3} maxLength={20} value={postalCode} onChange={(event) => setPostalCode(event.target.value)} className="mt-2 w-full rounded-xl bg-[#F7F5EF] px-3 py-3 text-sm" autoComplete="postal-code" />
              </label>
            </div>

            <fieldset className="space-y-3">
              <legend className="font-serif text-xl font-bold text-[#123C32]">Payment method</legend>
              {([
                { value: "upi", label: "UPI", description: "Scan a QR with the order amount prefilled", icon: Smartphone },
                { value: "card", label: "Credit Card / Debit Card", description: "Card form is shown in demo mode only", icon: CreditCard },
                { value: "cod", label: "Cash on Delivery", description: "Pay when your order arrives", icon: Banknote },
              ] as const).map((option) => {
                const Icon = option.icon;
                return (
                  <label
                    key={option.value}
                    className={`flex cursor-pointer items-center gap-3 rounded-2xl border p-4 transition-colors ${
                      paymentMethod === option.value
                        ? "border-[#123C32] bg-[#E5EDE6]"
                        : "border-[#123C32]/10 bg-white hover:border-[#123C32]/40"
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={option.value}
                      checked={paymentMethod === option.value}
                      onChange={() => setPaymentMethod(option.value)}
                      className="accent-[#123C32]"
                    />
                    <Icon className="h-5 w-5 shrink-0 text-[#123C32]" aria-hidden="true" />
                    <span className="flex-1">
                      <span className="block text-sm font-bold text-[#123C32]">{option.label}</span>
                      <span className="mt-0.5 block text-xs text-[#202824]/60">{option.description}</span>
                    </span>
                  </label>
                );
              })}
              {paymentMethod === "upi" && (
                <div className="rounded-2xl border border-[#123C32]/10 bg-[#F7F5EF] p-4 text-center">
                  <h3 className="font-semibold text-[#123C32]">Scan to pay</h3>
                  <p className="mt-1 text-sm text-[#202824]/70">Pay {money(total)} to {merchantUpiId}</p>
                  <div className="mx-auto mt-3 flex min-h-64 w-64 items-center justify-center rounded-xl bg-white p-3">
                    {upiQrLoading ? (
                      <p role="status" className="text-sm text-[#202824]/60">Generating QR code…</p>
                    ) : upiQr ? (
                      <img src={upiQr} alt={`UPI payment QR for ${money(total)}`} className="h-full w-full" />
                    ) : (
                      <p role="alert" className="text-sm text-rose-700">
                        {upiQrError || "A QR code is available for orders with a positive total."}
                      </p>
                    )}
                  </div>
                  <a href={upiIntent} className="mt-3 inline-block text-sm font-semibold text-[#123C32] underline">
                    Open a UPI app on this device
                  </a>
                  <p className="mt-2 text-left text-xs text-[#202824]/70">
                    The amount is prefilled in the payment app. After paying, return here and place the order. This local store cannot verify UPI transfers automatically; the admin must confirm payment separately.
                  </p>
                </div>
              )}
              {paymentMethod === "card" && (
                <div className="space-y-3 rounded-2xl border border-[#123C32]/10 bg-[#F7F5EF] p-4">
                  <h3 className="font-semibold text-[#123C32]">Card details</h3>
                  <p className="text-xs text-rose-700">
                    Demo only. Do not enter real card details: these fields are not sent, processed, or saved.
                  </p>
                  <label className="block text-xs font-medium text-[#123C32]">
                    Name on card
                    <input type="text" autoComplete="off" placeholder="Demo cardholder" className="mt-1.5 w-full rounded-xl bg-white px-3 py-2.5 text-sm" />
                  </label>
                  <label className="block text-xs font-medium text-[#123C32]">
                    Card number
                    <input type="text" inputMode="numeric" autoComplete="off" maxLength={19} placeholder="Demo card number" className="mt-1.5 w-full rounded-xl bg-white px-3 py-2.5 text-sm" />
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <label className="block text-xs font-medium text-[#123C32]">
                      Expiry date
                      <input type="text" autoComplete="off" maxLength={5} placeholder="MM/YY" className="mt-1.5 w-full rounded-xl bg-white px-3 py-2.5 text-sm" />
                    </label>
                    <label className="block text-xs font-medium text-[#123C32]">
                      CVV
                      <input type="password" inputMode="numeric" autoComplete="off" maxLength={4} placeholder="Demo CVV" className="mt-1.5 w-full rounded-xl bg-white px-3 py-2.5 text-sm" />
                    </label>
                  </div>
                </div>
              )}
              {paymentMethod === "cod" && (
                <p className="rounded-xl bg-[#E5EDE6] p-3 text-xs text-[#123C32]">
                  No payment details are needed now. The order and Cash on Delivery selection are saved locally in this browser.
                </p>
              )}
            </fieldset>
            {error && <p role="alert" className="text-sm text-rose-700">{error}</p>}
            <button
              type="submit"
              disabled={submitting || !items.length}
              className="w-full rounded-2xl bg-[#123C32] px-5 py-4 font-bold text-white disabled:opacity-50"
            >
              {submitting ? "Placing order…" : `Place Order · ${money(total)}`}
            </button>
          </form>

          <aside className="bg-[#123C32] text-white rounded-3xl p-6 space-y-4 lg:sticky lg:top-24">
            <h2 className="font-serif text-xl font-bold">Order Summary</h2>
            <ul className="space-y-3 border-y border-white/15 py-4 text-sm">
              {items.map((item) => (
                <li key={item.productId} className="flex justify-between gap-3">
                  <span>{item.product.name} × {item.quantity}</span>
                  <b className="shrink-0">{money(item.product.price * item.quantity)}</b>
                </li>
              ))}
            </ul>
            <div className="flex justify-between font-bold"><span>Total</span><span>{money(total)}</span></div>
          </aside>
        </div>
      </div>
    </div>
  );
}

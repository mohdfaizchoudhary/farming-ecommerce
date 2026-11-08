"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import QRCode from "qrcode";
import { useStore, type PaymentMethod } from "@/components/StoreProvider";
import { useAuth } from "@/components/AuthProvider";
import { getCatalogProducts, money, products as sampleProducts, type Product } from "@/lib/catalog";

export default function Checkout() {
  const { cart, placeOrder } = useStore();
  const { session, loading } = useAuth();
  const [error, setError] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationMessage, setLocationMessage] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cod");
  const [upiConfirmed, setUpiConfirmed] = useState(false);
  const [qrCode, setQrCode] = useState("");
  const [qrError, setQrError] = useState("");
  const [catalog, setCatalog] = useState<Product[]>(sampleProducts);
  const router = useRouter();

  const list = cart
    .flatMap((item) => {
      const product = catalog.find((entry) => entry.id === item.productId);
      return product ? [{ ...item, product }] : [];
    });
  const total = list.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  function useCurrentLocation() {
    setLocationMessage("");
    if (!navigator.geolocation) {
      setLocationMessage("Location is not available in this browser.");
      return;
    }

    setLocationLoading(true);
    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        try {
          const query = new URLSearchParams({
            format: "jsonv2",
            lat: String(coords.latitude),
            lon: String(coords.longitude),
          });
          const response = await fetch(`https://nominatim.openstreetmap.org/reverse?${query}`);
          if (!response.ok) {
            throw new Error(`Address lookup failed with status ${response.status}.`);
          }

          const result: { display_name?: string } = await response.json();
          if (!result.display_name) {
            throw new Error("No address was found for your current location.");
          }
          setAddress(result.display_name);
          setLocationMessage("Your current location was added to the delivery address.");
        } catch (locationError) {
          console.error("Could not look up the current location address.", locationError);
          setLocationMessage("We couldn't find an address for your location. Please enter it manually.");
        } finally {
          setLocationLoading(false);
        }
      },
      (locationError) => {
        setLocationLoading(false);
        if (locationError.code === locationError.PERMISSION_DENIED) {
          setLocationMessage("Location permission was denied. Please allow access or enter your address manually.");
        } else if (locationError.code === locationError.TIMEOUT) {
          setLocationMessage("We couldn't get your location in time. Please try again or enter your address manually.");
        } else {
          setLocationMessage("We couldn't get your location. Please enter your address manually.");
        }
      },
      { enableHighAccuracy: false, maximumAge: 60_000, timeout: 10_000 },
    );
  }

  useEffect(() => {
    setCatalog(getCatalogProducts());
  }, []);

  useEffect(() => {
    if (!loading && !session) router.replace("/login?next=%2Fcheckout");
  }, [loading, router, session]);

  useEffect(() => {
    if (session) {
      setName(session.user.user_metadata.full_name || "");
      setEmail(session.user.email || "");
      setPhone(session.user.user_metadata.phone || "");
      setAddress(session.user.user_metadata.address || "");
    }
  }, [session]);

  useEffect(() => {
    setUpiConfirmed(false);
    if (paymentMethod !== "upi" || total <= 0) {
      setQrCode("");
      return;
    }

    setQrError("");
    const paymentUri = new URLSearchParams({
      pa: "demo@upi",
      pn: "SMS Farmstead Demo",
      am: total.toFixed(2),
      cu: "INR",
      tn: "Demo order",
    });
    void QRCode.toDataURL(`upi://pay?${paymentUri.toString()}`, { width: 220, margin: 2 })
      .then(setQrCode)
      .catch((qrGenerationError: unknown) => {
        console.error("Could not generate the demo UPI QR code.", qrGenerationError);
        setQrError("The demo QR code could not be generated. Please select another payment method.");
      });
  }, [paymentMethod, total]);

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!session) {
      router.replace("/login?next=%2Fcheckout");
      return;
    }
    if (!list.length) {
      setError("Your cart is empty.");
      return;
    }
    if (!email.includes("@") || address.trim().length < 8 || !name.trim() || !phone.trim()) {
      setError("Enter a valid name, email, phone number and delivery address.");
      return;
    }
    if (paymentMethod === "upi" && !upiConfirmed) {
      setError("Confirm the demo UPI payment above to continue.");
      return;
    }

    try {
      const order = placeOrder({
        paymentMethod,
        paymentStatus: "successful",
        customerName: name.trim(),
        customerId: session.user.id,
        customerEmail: email.trim(),
        customerPhone: phone.trim(),
        customerAddress: address.trim(),
      });
      router.push("/order-success?id=" + order.id);
    } catch (orderError) {
      console.error("Could not place the demo order.", orderError);
      setError("We couldn't place this order. Please refresh and try again.");
    }
  }

  if (loading || !session) return <div className="container-shell py-12" aria-live="polite">Checking your sign-in…</div>;

  return (
    <div className="container-shell py-10 sm:py-12">
      <p className="eyebrow">Almost there</p>
      <h1 className="section-title mt-3">Checkout</h1>
      <div className="mt-7 grid min-w-0 items-start gap-5 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-6">
        <form onSubmit={submit} autoComplete="off" className="min-w-0 space-y-5 rounded-2xl border border-[#dce6df] bg-white p-4 sm:p-6">
          <h2 className="font-serif text-2xl text-forest">Delivery details</h2>
          <input className="field" value={name} onChange={(event) => setName(event.target.value)} placeholder="Full name" required />
          <input className="field" type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Email address" required />
          <input className="field" type="tel" autoComplete="tel" value={phone} onChange={(event) => setPhone(event.target.value)} placeholder="Phone number" required />
          <textarea className="field min-h-28 rounded-2xl" value={address} onChange={(event) => setAddress(event.target.value)} placeholder="Delivery address, city, state and PIN code" required minLength={8} />
          <div className="-mt-3 space-y-1">
            <button type="button" className="btn-secondary" onClick={useCurrentLocation} disabled={locationLoading}>
              {locationLoading ? "Finding your location…" : "Use my current location"}
            </button>
            <p className="text-xs text-charcoal/55">
              Address lookup uses <a className="underline" href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap</a>.
            </p>
            {locationMessage && <p role="status" aria-live="polite" className="text-sm text-charcoal/70">{locationMessage}</p>}
          </div>

          <fieldset>
            <legend className="font-serif text-2xl text-forest">Payment method</legend>
            <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {([
                ["cod", "Cash on Delivery"],
                ["upi", "UPI"],
                ["card", "Credit / Debit Card"],
              ] as const).map(([method, label]) => (
                <label key={method} className={`flex min-w-0 cursor-pointer items-start gap-2 rounded-xl border p-3 text-sm leading-5 ${paymentMethod === method ? "border-forest bg-sage text-forest" : "border-forest/15"}`}>
                  <input
                    className="mt-1 shrink-0 accent-[#123C32]"
                    type="radio"
                    name="paymentMethod"
                    value={method}
                    checked={paymentMethod === method}
                    onChange={() => setPaymentMethod(method)}
                  />
                  {label}
                </label>
              ))}
            </div>
          </fieldset>

          {paymentMethod === "upi" && (
            <div className="rounded-2xl border border-forest/10 bg-ivory p-4 text-center">
              <h3 className="font-semibold text-forest">Scan to pay {money(total)}</h3>
              {qrCode ? <img src={qrCode} alt={`Demo UPI QR code for ${money(total)}`} className="mx-auto mt-3 h-[220px] w-[220px]" /> : <p className="py-10 text-sm text-charcoal/55">{qrError || "Generating QR code…"}</p>}
              <p className="mt-2 text-xs text-charcoal/60">Demo QR only · no payment is processed. The QR contains the exact order amount.</p>
              <button type="button" disabled={!qrCode || Boolean(qrError)} onClick={() => setUpiConfirmed(true)} className="btn-secondary mt-4 disabled:opacity-50">
                {upiConfirmed ? "Demo payment confirmed" : "I've completed the demo payment"}
              </button>
            </div>
          )}

          {paymentMethod === "card" && (
            <fieldset className="space-y-3 rounded-2xl border border-forest/10 bg-ivory p-4">
              <legend className="px-1 font-semibold text-forest">Card details</legend>
              <input className="field" type="text" inputMode="numeric" minLength={12} maxLength={19} placeholder="Card number" aria-label="Card number" required />
              <div className="grid gap-3 sm:grid-cols-2">
                <input className="field" type="text" placeholder="MM/YY" aria-label="Card expiry date" required />
                <input className="field" type="password" inputMode="numeric" minLength={3} maxLength={4} placeholder="CVV" aria-label="Card security code" required />
              </div>
              <p className="text-xs leading-5 text-charcoal/60">Demo form only. Card details are not sent, processed, or saved; submission only simulates a payment.</p>
            </fieldset>
          )}

          {paymentMethod === "cod" && <p className="rounded-xl bg-sage p-3 text-sm text-forest">Cash on Delivery is marked successful in this temporary demo.</p>}
          {error && <p role="alert" className="text-sm text-rose-700">{error}</p>}
          <button className="btn-primary w-full">Place demo order · {money(total)}</button>
        </form>

        <aside className="h-fit rounded-2xl border border-[#dce6df] bg-sage p-5 sm:p-6 lg:sticky lg:top-28">
          <h2 className="font-serif text-2xl text-forest">Order total</h2>
          <div className="mt-5 flex justify-between"><span>Subtotal</span><b>{money(total)}</b></div>
          <p className="mt-3 text-xs text-charcoal/55">Shipping and tax must be configured server-side for production.</p>
          <p className="mt-4 border-t border-forest/10 pt-4 text-xs leading-5 text-charcoal/60">Temporary demo checkout: no real money is moved, and card data is never saved.</p>
        </aside>
      </div>
    </div>
  );
}

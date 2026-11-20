"use client";

import Link from "next/link";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useStore } from "@/components/StoreProvider";
import { useAuth } from "@/components/AuthProvider";
import { categories, money } from "@/lib/catalog";
import ProductImage from "@/components/ProductImage";

export default function CartPage() {
  const { cart, products, change, remove, catalogError, catalogLoading, refreshCatalog } = useStore();
  const { session } = useAuth();
  const items = cart.map((item) => ({
    ...item,
    product: products.find((entry) => entry.id === item.productId),
  }));
  const total = items.reduce((sum, item) => sum + (item.product?.price ?? 0) * item.quantity, 0);
  const hasUnavailableQuantity = items.some((item) => !item.product || item.quantity > item.product.stock);
  const checkoutHref = session ? "/checkout" : "/login?next=%2Fcheckout";

  return (
    <div className="bg-[#F7F5EF] min-h-screen pb-20">
      <div className="bg-[#123C32] text-[#F7F5EF] py-10 sm:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="text-xs font-bold uppercase tracking-[0.18em] text-[#D9A65A]">Your Basket</span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold mt-1">Shopping Cart</h1>
          <p className="text-xs sm:text-sm text-[#F7F5EF]/75 mt-2">
            {items.length} {items.length === 1 ? "item" : "items"} ready for checkout
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {catalogLoading && !products.length && !cart.length ? (
          <p role="status" className="rounded-2xl bg-white p-6 text-sm text-[#65776f]">Loading your cart…</p>
        ) : catalogError && !products.length ? (
          <div className="rounded-2xl bg-white p-6 text-sm">
            <p role="alert" className="text-rose-700">Products could not be loaded: {catalogError}</p>
            <button type="button" onClick={() => void refreshCatalog().catch(() => undefined)} className="mt-4 underline">Try again</button>
            {cart.map((item) => (
              <div key={item.productId} className="mt-4 flex items-center justify-between gap-3 border-t pt-3">
                <span className="text-xs">Saved cart item ({item.productId})</span>
                <button type="button" onClick={() => remove(item.productId)} className="text-xs font-semibold text-rose-700 underline">Remove</button>
              </div>
            ))}
          </div>
        ) : !cart.length ? (
          <div className="bg-white rounded-[2rem] p-12 sm:p-16 text-center border border-[#123C32]/10 shadow-sm max-w-xl mx-auto">
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#123C32]">Your cart is empty</h2>
            <p className="text-sm text-[#202824]/65 mt-2">Browse the catalogue and add products to your cart.</p>
            <Link href="/products" className="mt-6 inline-flex px-7 py-3.5 rounded-2xl bg-[#123C32] text-white font-bold text-sm">
              Browse Catalogue
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-8 space-y-4">
              {items.map((item) => (
                <article key={item.productId} className="bg-white rounded-3xl p-4 sm:p-6 border border-[#123C32]/10 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4 min-w-0">
                    {item.product ? <ProductImage src={item.product.image} alt={item.product.name} className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover bg-[#E5EDE6] shrink-0" /> : <div className="h-20 w-20 shrink-0 rounded-2xl bg-[#E5EDE6]" />}
                    <div className="min-w-0">
                      {item.product ? (
                        <>
                          <span className="text-[11px] font-bold uppercase tracking-wider text-[#123C32]/60">
                            {categories.find((category) => category.slug === item.product?.category)?.name ?? item.product.category} · {item.product.unit}
                          </span>
                          <Link href={`/product/${item.product.slug}`} className="block font-serif text-lg sm:text-xl font-bold text-[#123C32] mt-0.5 hover:underline">
                            {item.product.name}
                          </Link>
                        </>
                      ) : (
                        <>
                          <b className="block text-[#123C32]">Unavailable product</b>
                          <p className="mt-1 text-xs text-rose-700">Remove this stale item from your cart.</p>
                        </>
                      )}
                      <p className="font-extrabold text-base sm:text-lg text-[#123C32] mt-1.5">
                        {item.product ? money(item.product.price * item.quantity) : "—"}
                        {item.product && item.product.mrp > item.product.price && <span className="ml-2 text-xs font-normal text-[#202824]/45 line-through">{money(item.product.mrp * item.quantity)}</span>}
                      </p>
                      {item.product && item.quantity > item.product.stock && (
                        <p role="alert" className="mt-1 text-xs text-rose-700">Only {item.product.stock} currently available.</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-4 pt-3 sm:pt-0 border-t sm:border-0 border-[#123C32]/10">
                    <div className="flex items-center gap-3 bg-[#F7F5EF] px-3 py-1.5 rounded-xl border border-[#123C32]/10">
                      <button type="button" onClick={() => change(item.productId, item.quantity - 1)} aria-label={`Decrease ${item.product?.name ?? "unavailable product"} quantity`} className="p-1 rounded-lg hover:bg-white text-[#123C32]">
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="font-bold text-sm w-5 text-center">{item.quantity}</span>
                      <button type="button" onClick={() => change(item.productId, item.quantity + 1)} disabled={!item.product || item.quantity >= item.product.stock} aria-label={`Increase ${item.product?.name ?? "product"} quantity`} className="p-1 rounded-lg hover:bg-white text-[#123C32] disabled:opacity-40">
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <button type="button" onClick={() => remove(item.productId)} aria-label={`Remove ${item.product?.name ?? "unavailable product"} from cart`} className="p-2.5 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </article>
              ))}
            </div>

            <aside className="lg:col-span-4 bg-[#123C32] text-[#F7F5EF] rounded-3xl p-6 sm:p-7 shadow-xl space-y-4 lg:sticky lg:top-24">
              <h2 className="font-serif text-xl font-bold text-white">Order Summary</h2>
              <div className="flex justify-between border-y border-white/10 py-4 text-sm">
                <span>Item Subtotal</span>
                <b>{money(total)}</b>
              </div>
              <p className="text-xs text-white/65">Shipping and taxes are calculated before order confirmation.</p>
              {hasUnavailableQuantity ? (
                <button type="button" disabled className="flex w-full items-center justify-center py-3.5 rounded-2xl bg-[#D9A65A] text-[#202824] font-bold text-sm opacity-50">
                  Remove unavailable or out-of-stock items
                </button>
              ) : (
                <Link href={checkoutHref} className="flex w-full items-center justify-center py-3.5 rounded-2xl bg-[#D9A65A] text-[#202824] font-bold text-sm">
                  Continue to Checkout
                </Link>
              )}
            </aside>
          </div>
        )}
      </div>
    </div>
  );
}

"use client";

import Link from "next/link";
import { useMemo, useState, useEffect } from "react";
import { Minus, Plus, Trash2 } from "lucide-react";
import { getCatalogProducts, money, products as sampleProducts } from "@/lib/catalog";
import { useStore } from "@/components/StoreProvider";
import { useAuth } from "@/components/AuthProvider";
import type { Product } from "@/lib/catalog";
import ProductImage from "@/components/ProductImage";

export default function Cart() {
  const { cart, change, remove } = useStore();
  const { session } = useAuth();
  const [catalog, setCatalog] = useState<Product[]>(sampleProducts);

  useEffect(() => {
    setCatalog(getCatalogProducts());
  }, []);

  const productsById = useMemo(() => new Map(catalog.map((product) => [product.id, product])), [catalog]);
  const items = cart.flatMap((item) => {
    const product = productsById.get(item.productId);
    return product ? [{ ...item, product }] : [];
  });
  const total = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const checkoutHref = session ? "/checkout" : "/login?next=%2Fcheckout";

  return (
    <div className="container-shell py-10 sm:py-12">
      <p className="eyebrow">Your selection</p>
      <h1 className="section-title mt-3">Shopping bag</h1>
      {!items.length ? (
        <div className="mt-8 rounded-2xl border border-[#dce6df] bg-white p-6 text-center sm:p-10">
          <h2 className="font-serif text-2xl text-forest">Your bag is empty</h2>
          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#65776f]">Explore poultry listings to find hatching eggs, birds and chicks.</p>
          <Link href="/products" className="btn-primary mt-5">Explore listings</Link>
        </div>
      ) : (
        <div className="mt-7 grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-7">
          <div className="grid gap-3">
            {items.map((item) => (
              <article key={item.productId} className="grid min-w-0 grid-cols-[76px_minmax(0,1fr)] gap-3 rounded-2xl border border-[#dce6df] bg-white p-3 sm:grid-cols-[112px_minmax(0,1fr)] sm:gap-5 sm:p-4">
                <ProductImage src={item.product.image} alt={item.product.name} className="aspect-square w-full rounded-xl object-cover" />
                <div className="flex min-w-0 flex-col justify-between gap-3 sm:flex-row sm:items-center">
                  <div className="min-w-0">
                    <Link href={`/product/${item.product.slug}`} className="line-clamp-2 text-sm font-semibold text-[#183a30] hover:text-[#bd5c2c] sm:text-base">
                      {item.product.name}
                    </Link>
                    <p className="mt-1 text-xs text-[#65776f]">{item.product.unit}</p>
                    <p className="mt-2 font-semibold text-[#183a30]">{money(item.product.price * item.quantity)}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button type="button" onClick={() => change(item.productId, item.quantity - 1)} aria-label={`Decrease ${item.product.name} quantity`} className="grid h-9 w-9 place-items-center rounded-lg border border-[#c8d6cc] text-[#287052] hover:bg-[#e8f0ea]">
                      <Minus size={14} />
                    </button>
                    <span className="min-w-6 text-center text-sm font-medium">{item.quantity}</span>
                    <button type="button" onClick={() => change(item.productId, item.quantity + 1)} aria-label={`Increase ${item.product.name} quantity`} className="grid h-9 w-9 place-items-center rounded-lg border border-[#c8d6cc] text-[#287052] hover:bg-[#e8f0ea]">
                      <Plus size={14} />
                    </button>
                    <button type="button" onClick={() => remove(item.productId)} aria-label={`Remove ${item.product.name}`} className="ml-1 grid h-9 w-9 place-items-center rounded-lg text-rose-700 hover:bg-rose-50">
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <aside className="h-fit rounded-2xl border border-[#dce6df] bg-white p-5 sm:p-6 lg:sticky lg:top-28">
            <h2 className="font-serif text-2xl text-forest">Order summary</h2>
            <div className="mt-5 flex items-center justify-between gap-3 text-sm">
              <span>Subtotal ({items.reduce((sum, item) => sum + item.quantity, 0)} items)</span>
              <b className="text-right">{money(total)}</b>
            </div>
            <p className="mt-3 text-xs leading-5 text-charcoal/50">Shipping and taxes are not calculated in demo mode.</p>
            <Link href={checkoutHref} className="btn-primary mt-6 w-full">Continue to checkout</Link>
          </aside>
        </div>
      )}
    </div>
  );
}

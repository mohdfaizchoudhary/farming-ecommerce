"use client";

import { useEffect, useState } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, BadgeCheck, ShoppingBag, Zap } from "lucide-react";
import { categories, getCatalogProducts, money, products as sampleProducts } from "@/lib/catalog";
import { useStore } from "@/components/StoreProvider";
import { useAuth } from "@/components/AuthProvider";
import ProductImage from "@/components/ProductImage";

export default function ProductPage({ params }: { params: { slug: string } }) {
  const [catalog, setCatalog] = useState(sampleProducts);
  const [catalogLoaded, setCatalogLoaded] = useState(false);
  const [added, setAdded] = useState(false);
  const { add, buyNow: setBuyNowCart, orders } = useStore();
  const { session, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    setCatalog(getCatalogProducts());
    setCatalogLoaded(true);
  }, []);

  const product = catalog.find((entry) => entry.slug === params.slug);
  if (!product && !catalogLoaded) {
    return <div className="container-shell py-12 text-sm text-[#65776f]">Loading listing…</div>;
  }
  if (!product) return notFound();

  const listing = product;
  const category = categories.find((entry) => entry.slug === product.category);
  const productOrders = session
    ? orders.filter((order) =>
        (order.customerId === session.user.id
          || (!!session.user.email && order.customerEmail?.toLowerCase() === session.user.email.toLowerCase()))
        && order.items.some((item) => item.productId === product.id || (!item.productId && item.name === product.name)),
      )
    : [];

  function addToCart() {
    add(listing.id, listing.name);
    setAdded(true);
  }

  function buyNow() {
    setBuyNowCart(listing.id);
    if (session) {
      router.push("/checkout");
      return;
    }
    router.push("/login?next=%2Fcheckout");
  }

  return (
    <div className="container-shell py-10 sm:py-14">
      <Link href="/products" className="inline-flex items-center gap-2 text-sm text-[#65776f] transition hover:text-[#287052]">
        <ArrowLeft size={15} /> Back to listings
      </Link>
      <div className="mt-6 grid gap-8 lg:grid-cols-[1.05fr_.95fr] lg:gap-14">
        <div className="relative overflow-hidden rounded-[28px] bg-[#e8f0ea]">
          <ProductImage src={product.image} alt={product.name} loading="eager" className="aspect-[4/3] w-full object-cover lg:aspect-square" />
          <span className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[.12em] text-[#183a30]">
            Sample marketplace listing
          </span>
        </div>
        <div className="py-2 lg:py-7">
          <p className="eyebrow">{category?.name ?? "Poultry marketplace"}</p>
          <h1 className="section-title mt-3">{product.name}</h1>
          <p className="mt-3 text-sm text-[#65776f]">{product.unit} · Listing {product.id.toUpperCase()}</p>
          <p className="mt-6 text-3xl font-semibold text-[#183a30]">
            {money(product.price)}
            <s className="ml-3 text-base font-normal text-[#91a098]">{money(product.mrp)}</s>
          </p>
          <p className="mt-6 text-sm leading-7 text-[#50645a]">{product.description}</p>

          <div className="mt-7 rounded-2xl border border-[#dce6df] bg-white p-5">
            <div className="flex items-center gap-2 text-sm font-semibold text-[#183a30]">
              <BadgeCheck size={17} className="text-[#287052]" /> Confirm listing details
            </div>
            <p className="mt-2 text-xs leading-5 text-[#65776f]">
              Stock shown is sample data, not live inventory. Confirm availability, seller information, health or batch records, final price and transport arrangements directly with the seller.
            </p>
          </div>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <button onClick={addToCart} className="btn-secondary w-full">
              <ShoppingBag size={16} /> {added ? "Added to bag" : "Add to cart"}
            </button>
            <button onClick={buyNow} disabled={loading} className="btn-primary w-full disabled:cursor-wait disabled:opacity-60">
              <Zap size={16} /> {loading ? "Checking account…" : "Buy Now"}
            </button>
          </div>
          {session && (
            <section className="mt-6 rounded-2xl border border-[#dce6df] bg-white p-5">
              <h2 className="font-serif text-xl text-[#183a30]">Your order status</h2>
              {productOrders.length ? (
                <ul className="mt-3 space-y-3">
                  {productOrders.map((order) => (
                    <li key={order.id} className="flex flex-wrap items-center justify-between gap-2 border-t border-[#dce6df] pt-3 text-sm">
                      <span>
                        <b className="text-[#183a30]">{order.id}</b>
                        <span className="ml-2 text-xs text-[#65776f]">{new Date(order.date).toLocaleDateString()}</span>
                      </span>
                      <span className="rounded-full bg-[#e8f0ea] px-3 py-1 font-medium capitalize text-[#23634e]">{order.status}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-2 text-sm text-[#65776f]">You have no orders for this product.</p>
              )}
            </section>
          )}
          <p className="mt-4 text-xs leading-5 text-[#65776f]">
            Illustrative listing only. Review suitability and applicable requirements before arranging a transaction.
          </p>
        </div>
      </div>
    </div>
  );
}

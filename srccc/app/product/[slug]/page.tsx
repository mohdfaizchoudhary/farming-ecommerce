"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Heart, Minus, Plus, ShoppingBag, Zap } from "lucide-react";
import { useAuth } from "@/components/AuthProvider";
import { useStore } from "@/components/StoreProvider";
import { money } from "@/lib/catalog";

export default function ProductDetailPage() {
  const params = useParams<{ slug: string }>();
  const router = useRouter();
  const { add, buyNow, wishlist, toggleWishlist, products: catalog, catalogLoading, catalogError } = useStore();
  const { session, loading } = useAuth();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const product = catalog.find((item) => item.slug === params.slug);
  if (!product) {
    if (catalogLoading) {
      return <div className="container-shell py-12 text-sm text-[#65776f]">Loading listing…</div>;
    }
    return (
      <div className="container-shell py-12">
        <h1 className="text-2xl font-bold text-[#123C32]">{catalogError ? "Products could not be loaded" : "Product not found"}</h1>
        {catalogError && <p role="alert" className="mt-2 text-sm text-rose-700">{catalogError}</p>}
        <Link href="/products" className="mt-4 inline-flex text-sm font-semibold text-[#123C32] underline">
          Return to products
        </Link>
      </div>
    );
  }

  const listing = product;
  const inStock = listing.stock > 0;
  const saved = wishlist.includes(listing.id);

  function addToCart() {
    add(listing.id, listing.name, quantity);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1800);
  }

  function handleBuyNow() {
    buyNow(listing.id, quantity);
    router.push(session ? "/checkout" : "/login?next=%2Fcheckout");
  }

  return (
    <div className="bg-[#F7F5EF] min-h-screen pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-4">
        <Link href="/products" className="inline-flex items-center gap-2 text-sm text-[#65776f] hover:text-[#123C32]">
          <ArrowLeft className="w-4 h-4" /> Back to products
        </Link>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          <div className="relative overflow-hidden rounded-[2rem] bg-white border border-[#123C32]/10 p-4 sm:p-6">
            <Image
              src={listing.image}
              alt={listing.name}
              width={1000}
              height={800}
              priority
              unoptimized
              className="aspect-square w-full rounded-2xl object-cover"
            />
          </div>

          <div className="space-y-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#123C32]/65">
                {listing.unit} · {inStock ? `${listing.stock} available` : "Out of stock"}
              </span>
              <h1 className="text-2xl sm:text-4xl font-extrabold text-[#202824] mt-2 leading-tight">
                {listing.name}
              </h1>
              <p className="text-sm sm:text-base text-[#202824]/75 mt-3 leading-relaxed">
                {listing.description}
              </p>
            </div>

            <div className="p-5 rounded-3xl bg-white border border-[#123C32]/10 flex items-center justify-between gap-4">
              <div>
                <span className="text-3xl sm:text-4xl font-extrabold text-[#123C32]">{money(listing.price)}</span>
                {listing.mrp > listing.price && (
                  <span className="ml-3 text-base text-[#202824]/45 line-through">{money(listing.mrp)}</span>
                )}
              </div>
              <button
                type="button"
                onClick={() => toggleWishlist(listing.id)}
                aria-label={saved ? "Remove from wishlist" : "Add to wishlist"}
                aria-pressed={saved}
                className="w-11 h-11 shrink-0 rounded-2xl bg-[#F7F5EF] flex items-center justify-center border border-[#123C32]/10"
              >
                <Heart className={`w-5 h-5 ${saved ? "fill-rose-500 text-rose-500" : "text-[#202824]"}`} />
              </button>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <div className="flex items-center justify-between gap-4 bg-white px-4 py-3 rounded-2xl border border-[#123C32]/15">
                <button
                  type="button"
                  onClick={() => setQuantity((current) => Math.max(1, current - 1))}
                  aria-label="Decrease quantity"
                  className="p-1.5 rounded-xl hover:bg-[#E5EDE6] text-[#123C32]"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="font-bold text-base w-6 text-center">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity((current) => Math.min(listing.stock, current + 1))}
                  disabled={!inStock || quantity >= listing.stock}
                  aria-label="Increase quantity"
                  className="p-1.5 rounded-xl hover:bg-[#E5EDE6] text-[#123C32] disabled:opacity-40"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <button
                type="button"
                onClick={addToCart}
                disabled={!inStock}
                className="flex-1 py-4 px-6 rounded-2xl bg-white border border-[#123C32] text-[#123C32] font-bold flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <ShoppingBag className="w-5 h-5" /> {added ? "Added to Cart" : "Add to Cart"}
              </button>
              <button
                type="button"
                onClick={handleBuyNow}
                disabled={!inStock || loading}
                className="flex-1 py-4 px-6 rounded-2xl bg-[#123C32] text-[#F7F5EF] font-bold flex items-center justify-center gap-2 hover:bg-[#1a5244] disabled:opacity-50"
              >
                <Zap className="w-5 h-5 text-[#D9A65A]" /> Buy Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { Product, money } from "@/lib/catalog";
import { useStore } from "@/components/StoreProvider";
import ProductImage from "@/components/ProductImage";

export default function ProductCard({ p }: { p: Product }) {
  const { add } = useStore();

  return (
    <article className="product-card-enter flex h-full min-w-0 flex-col">
      <Link
        href={`/product/${p.slug}`}
        className="product-card-image relative block overflow-hidden rounded-[18px] bg-[#e8f0ea]"
      >
        <ProductImage src={p.image} alt={p.name} className="aspect-[4/4.5] w-full object-cover" />
        <span className="absolute left-2.5 top-2.5 rounded-full border border-white/60 bg-[#f6f8f3]/95 px-2.5 py-1 text-[9px] uppercase tracking-[.1em] text-[#183a30] sm:left-3 sm:top-3 sm:text-[10px]">
          Sample listing
        </span>
      </Link>
      <div className="flex items-start justify-between gap-2 pt-3 sm:pt-4">
        <div className="flex min-w-0 flex-1 flex-col">
          <Link href={`/product/${p.slug}`} className="line-clamp-2 min-h-10 text-sm font-medium leading-5 text-[#183a30] transition hover:text-[#bd5c2c] sm:text-[15px]">
            {p.name}
          </Link>
          <p className="mt-1 text-[11px] text-[#65776f]">{p.unit}</p>
          <div className="mt-2 flex flex-wrap items-baseline gap-x-2 gap-y-1">
            <b className="text-sm text-[#183a30]">{money(p.price)}</b>
            <s className="text-[11px] text-[#91a098]">{money(p.mrp)}</s>
          </div>
        </div>
        <button
          type="button"
          onClick={() => add(p.id, p.name)}
          aria-label={`Add ${p.name} to cart`}
          className="grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-[#c8d6cc] text-[#287052] transition hover:border-[#e88445] hover:bg-[#e88445] hover:text-white"
        >
          <ShoppingBag size={15} strokeWidth={1.7} />
        </button>
      </div>
    </article>
  );
}

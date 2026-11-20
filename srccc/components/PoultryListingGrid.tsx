"use client";

import { getCategoryAndDescendantSlugs } from "@/lib/catalog";
import ProductCard from "@/components/ProductCard";
import { useStore } from "@/components/StoreProvider";

export default function PoultryListingGrid({
  category,
  emptyMessage = "No poultry listings are available yet.",
}: {
  category?: string;
  emptyMessage?: string;
}) {
  const { products, catalogLoading, catalogError } = useStore();
  const categorySlugs = category ? getCategoryAndDescendantSlugs(category) : null;
  const listings = products.filter((product) => !categorySlugs || categorySlugs.has(product.category));

  if (catalogLoading && !products.length) return <p role="status" className="text-sm text-[#65776f]">Loading listings…</p>;
  if (catalogError && !products.length) return <p role="alert" className="rounded-2xl bg-white p-6 text-sm text-rose-700">Listings could not be loaded: {catalogError}</p>;
  if (!listings.length) return <p className="rounded-2xl border border-dashed border-[#c8d6cc] bg-white p-8 text-sm leading-6 text-[#65776f]">{emptyMessage}</p>;
  return <div className="grid grid-cols-2 gap-x-3 gap-y-7 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4 xl:grid-cols-5">{listings.map((product) => <ProductCard key={product.id} p={product} />)}</div>;
}

"use client";

import { useEffect, useState } from "react";
import { getCategoryAndDescendantSlugs, getCatalogProducts, products as sampleProducts, type Product } from "@/lib/catalog";
import ProductCard from "@/components/ProductCard";

export default function PoultryListingGrid({
  category,
  emptyMessage = "No poultry listings are available yet.",
}: {
  category?: string;
  emptyMessage?: string;
}) {
  const [listings, setListings] = useState<Product[]>(() => {
    const categorySlugs = category ? getCategoryAndDescendantSlugs(category) : null;
    return sampleProducts.filter((product) => !categorySlugs || categorySlugs.has(product.category));
  });

  useEffect(() => {
    const refresh = (event?: StorageEvent) => {
      if (event && event.key !== "p1-catalog-products-v2") return;
      const catalogProducts = getCatalogProducts();
      const categorySlugs = category ? getCategoryAndDescendantSlugs(category) : null;
      setListings(catalogProducts.filter((product) => !categorySlugs || categorySlugs.has(product.category)));
    };
    refresh();
    window.addEventListener("storage", refresh);
    return () => window.removeEventListener("storage", refresh);
  }, [category]);

  if (!listings.length) return <p className="rounded-2xl border border-dashed border-[#c8d6cc] bg-white p-8 text-sm leading-6 text-[#65776f]">{emptyMessage}</p>;
  return <div className="grid grid-cols-2 gap-x-3 gap-y-7 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4 xl:grid-cols-5">{listings.map((product) => <ProductCard key={product.id} p={product} />)}</div>;
}

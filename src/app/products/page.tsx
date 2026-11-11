"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { categories, getCatalogProducts, products as sampleProducts } from "@/lib/catalog";
import ProductCard from "@/components/ProductCard";

function Listing() {
  const params = useSearchParams();
  const [query, setQuery] = useState(params.get("q") || "");
  const [category, setCategory] = useState("all");
  const [sort, setSort] = useState("featured");
  const [catalog, setCatalog] = useState(sampleProducts);

  useEffect(() => {
    const refresh = (event?: StorageEvent) => {
      if (event && event.key !== "p1-catalog-products-v2") return;
      setCatalog(getCatalogProducts());
    };
    refresh();
    window.addEventListener("storage", refresh);
    return () => window.removeEventListener("storage", refresh);
  }, []);

  const listings = useMemo(() => {
    const filtered = catalog.filter((product) =>
      (product.name + " " + product.description).toLowerCase().includes(query.toLowerCase())
      && (category === "all" || product.category === category),
    );
    if (sort === "low") filtered.sort((a, b) => a.price - b.price);
    if (sort === "high") filtered.sort((a, b) => b.price - a.price);
    return filtered;
  }, [catalog, query, category, sort]);

  return (
    <div className="container-shell py-12 sm:py-16">
      <p className="eyebrow">SMS Farmstead marketplace</p>
      <h1 className="section-title mt-3">Poultry listings</h1>
      <p className="mt-4 max-w-2xl text-sm leading-7 text-[#65776f]">
        Browse poultry, hatching eggs, layer birds and chick listings. Confirm all listing information and availability with the seller.
      </p>

      <div className="mt-8 grid gap-3 rounded-[22px] border border-[#dce6df] bg-white p-4 md:grid-cols-[1fr_260px_190px]">
        <label className="relative block">
          <span className="sr-only">Search poultry listings</span>
          <Search size={16} aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#65776f]" />
          <input className="field search-field" placeholder="Search poultry listings..." value={query} onChange={(event) => setQuery(event.target.value)} />
        </label>
        <label>
          <span className="sr-only">Filter by category</span>
          <select className="field" value={category} onChange={(event) => setCategory(event.target.value)}>
            <option value="all">All poultry categories</option>
            {categories.map((entry) => <option key={entry.slug} value={entry.slug}>{entry.name}</option>)}
          </select>
        </label>
        <label>
          <span className="sr-only">Sort listings</span>
          <select className="field" value={sort} onChange={(event) => setSort(event.target.value)}>
            <option value="featured">Featured</option>
            <option value="low">Price: low to high</option>
            <option value="high">Price: high to low</option>
          </select>
        </label>
      </div>

      <div className="mb-4 mt-7 flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm font-medium text-[#183a30]">{listings.length} listings</p>
        <p className="text-xs text-[#65776f]">All prices and availability are seller-confirmed</p>
      </div>
      {listings.length > 0 ? (
        <div className="grid grid-cols-2 gap-x-3 gap-y-7 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4 xl:grid-cols-5">
          {listings.map((product) => <ProductCard key={product.id} p={product} />)}
        </div>
      ) : (
        <p className="rounded-2xl border border-dashed border-[#c8d6cc] bg-white p-8 text-sm text-[#65776f]">
          No listings match your search. Try another term or select a different category.
        </p>
      )}
      <p className="mt-8 text-xs leading-5 text-[#65776f]">
        Example listings are illustrative. Verify product condition, sourcing, relevant health information and fulfilment arrangements with the seller before purchase.
      </p>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="container-shell py-12 text-sm text-[#65776f]">Loading poultry listings...</div>}>
      <Listing />
    </Suspense>
  );
}

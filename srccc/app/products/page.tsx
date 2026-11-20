// "use client";

// import { Suspense, useEffect, useMemo, useState } from "react";
// import { useSearchParams } from "next/navigation";
// import { Search } from "lucide-react";
// import { categories, getCatalogProducts, products as sampleProducts } from "@/lib/catalog";
// import ProductCard from "@/components/ProductCard";

// function Listing() {
//   const params = useSearchParams();
//   const [query, setQuery] = useState(params.get("q") || "");
//   const [category, setCategory] = useState("all");
//   const [sort, setSort] = useState("featured");
//   const [catalog, setCatalog] = useState(sampleProducts);

//   useEffect(() => {
//     const refresh = (event?: StorageEvent) => {
//       if (event && event.key !== "p1-catalog-products-v2") return;
//       setCatalog(getCatalogProducts());
//     };
//     refresh();
//     window.addEventListener("storage", refresh);
//     return () => window.removeEventListener("storage", refresh);
//   }, []);

//   const listings = useMemo(() => {
//     const filtered = catalog.filter((product) =>
//       (product.name + " " + product.description).toLowerCase().includes(query.toLowerCase())
//       && (category === "all" || product.category === category),
//     );
//     if (sort === "low") filtered.sort((a, b) => a.price - b.price);
//     if (sort === "high") filtered.sort((a, b) => b.price - a.price);
//     return filtered;
//   }, [catalog, query, category, sort]);

//   return (
//     <div className="container-shell py-12 sm:py-16">
//       <p className="eyebrow">SMS Farmstead marketplace</p>
//       <h1 className="section-title mt-3">Poultry listings</h1>
//       <p className="mt-4 max-w-2xl text-sm leading-7 text-[#65776f]">
//         Browse poultry, hatching eggs, layer birds and chick listings. Confirm all listing information and availability with the seller.
//       </p>

//       <div className="mt-8 grid gap-3 rounded-[22px] border border-[#dce6df] bg-white p-4 md:grid-cols-[1fr_260px_190px]">
//         <label className="relative block">
//           <span className="sr-only">Search poultry listings</span>
//           <Search size={16} aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#65776f]" />
//           <input className="field search-field" placeholder="Search poultry listings..." value={query} onChange={(event) => setQuery(event.target.value)} />
//         </label>
//         <label>
//           <span className="sr-only">Filter by category</span>
//           <select className="field" value={category} onChange={(event) => setCategory(event.target.value)}>
//             <option value="all">All poultry categories</option>
//             {categories.map((entry) => <option key={entry.slug} value={entry.slug}>{entry.name}</option>)}
//           </select>
//         </label>
//         <label>
//           <span className="sr-only">Sort listings</span>
//           <select className="field" value={sort} onChange={(event) => setSort(event.target.value)}>
//             <option value="featured">Featured</option>
//             <option value="low">Price: low to high</option>
//             <option value="high">Price: high to low</option>
//           </select>
//         </label>
//       </div>

//       <div className="mb-4 mt-7 flex flex-wrap items-center justify-between gap-2">
//         <p className="text-sm font-medium text-[#183a30]">{listings.length} listings</p>
//         <p className="text-xs text-[#65776f]">All prices and availability are seller-confirmed</p>
//       </div>
//       {listings.length > 0 ? (
//         <div className="grid grid-cols-2 gap-x-3 gap-y-7 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4 xl:grid-cols-5">
//           {listings.map((product) => <ProductCard key={product.id} p={product} />)}
//         </div>
//       ) : (
//         <p className="rounded-2xl border border-dashed border-[#c8d6cc] bg-white p-8 text-sm text-[#65776f]">
//           No listings match your search. Try another term or select a different category.
//         </p>
//       )}
//       <p className="mt-8 text-xs leading-5 text-[#65776f]">
//         Example listings are illustrative. Verify product condition, sourcing, relevant health information and fulfilment arrangements with the seller before purchase.
//       </p>
//     </div>
//   );
// }

// export default function ProductsPage() {
//   return (
//     <Suspense fallback={<div className="container-shell py-12 text-sm text-[#65776f]">Loading poultry listings...</div>}>
//       <Listing />
//     </Suspense>
//   );
// }



"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  SlidersHorizontal,
  Search,
  X,
  Check,
  Sparkles,
} from "lucide-react";
import ProductCard from "@/components/ProductCard";
import { categories } from "@/lib/catalog";
import { useStore } from "@/components/StoreProvider";

export default function ProductsPage() {
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("featured");
  const [maxPrice, setMaxPrice] = useState(5000);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const { products: catalog, catalogError, catalogLoading, refreshCatalog } = useStore();
  const allCategories = ["All Categories", ...categories.map((category) => category.name)];

  const filteredProducts = useMemo(() => {
    return catalog.filter((item) => {
      const matchCategory =
        selectedCategory === "All Categories" ||
        categories.find((category) => category.slug === item.category)?.name === selectedCategory;
      const matchSearch = `${item.name} ${item.description}`
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchPrice = item.price <= maxPrice;
      return matchCategory && matchSearch && matchPrice;
    }).sort((a, b) => {
      if (sortBy === "price-asc") return a.price - b.price;
      if (sortBy === "price-desc") return b.price - a.price;
      return 0;
    });
  }, [catalog, selectedCategory, searchQuery, sortBy, maxPrice]);

  return (
    <div className="bg-[#F7F5EF] min-h-screen pb-20">
      {/* Top Page Banner */}
      <div className="bg-[#123C32] text-[#F7F5EF] py-10 sm:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="text-xs font-bold uppercase tracking-widest text-[#D9A65A]">
            Complete Storefront
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold mt-2">
            Explore All Products
          </h1>
          <p className="text-sm sm:text-base text-[#F7F5EF]/75 mt-2 max-w-2xl">
            Filter across all 7 categories—freshly harvested, batch-verified,
            and ready for scheduled delivery.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Top Search & Sort Bar */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-8 bg-white p-4 rounded-3xl border border-[#123C32]/10 shadow-sm">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#123C32]/50 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by product name, cut, or pack..."
              className="w-full pl-11 pr-4 py-2.5 rounded-2xl bg-[#F7F5EF] text-sm focus:outline-none focus:ring-2 focus:ring-[#123C32]/20"
            />
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileFilterOpen(true)}
              className="lg:hidden flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-[#E5EDE6] text-[#123C32] font-semibold text-sm"
            >
              <SlidersHorizontal className="w-4 h-4" /> Filters
            </button>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="flex-1 md:w-52 px-4 py-2.5 rounded-2xl bg-[#F7F5EF] border border-[#123C32]/15 text-sm font-medium text-[#202824] focus:outline-none"
            >
              <option value="featured">Sort: Featured</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Main Content Split: Sidebar + Product Grid */}
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          {/* Desktop Sticky Sidebar */}
          <aside className="hidden lg:block lg:col-span-3 bg-white p-6 rounded-3xl border border-[#123C32]/10 sticky top-24 space-y-6">
            <div>
              <h3 className="font-bold text-sm uppercase tracking-wider text-[#123C32] mb-3">
                Categories
              </h3>
              <div className="space-y-1">
                {allCategories.map((cat) => {
                  const active = selectedCategory === cat;
                  return (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                        active
                          ? "bg-[#123C32] text-[#F7F5EF] shadow-sm"
                          : "text-[#202824]/80 hover:bg-[#E5EDE6]"
                      }`}
                    >
                      <span>{cat}</span>
                      {active && <Check className="w-4 h-4 text-[#D9A65A]" />}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="pt-4 border-t border-[#123C32]/10">
              <div className="flex items-center justify-between text-sm font-bold text-[#123C32] mb-2">
                <span>Max Price</span>
                <span>₹{maxPrice.toLocaleString("en-IN")}</span>
              </div>
              <input
                type="range"
                min={100}
                max={5000}
                step={100}
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-[#123C32]"
              />
            </div>
          </aside>

          {/* Product Grid */}
          <div className="lg:col-span-9">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-[#202824]/70 font-medium">
                Showing <span className="font-bold text-[#123C32]">{filteredProducts.length}</span> products
              </p>
              {selectedCategory !== "All Categories" && (
                <button
                  onClick={() => setSelectedCategory("All Categories")}
                  className="text-xs font-bold text-[#123C32] underline"
                >
                  Reset Filter
                </button>
              )}
            </div>

            {catalogLoading && !catalog.length ? (
              <p role="status" className="bg-white rounded-3xl p-8 text-sm text-[#202824]/60">Loading products…</p>
            ) : catalogError && !catalog.length ? (
              <div className="bg-white rounded-3xl p-8 text-center border border-rose-200">
                <p role="alert" className="text-sm text-rose-700">Products could not be loaded: {catalogError}</p>
                <button type="button" onClick={() => void refreshCatalog().catch(() => undefined)} className="mt-4 text-sm font-bold text-[#123C32] underline">Try again</button>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-[#123C32]/10">
                <Sparkles className="w-10 h-10 text-[#D9A65A] mx-auto mb-3" />
                <h3 className="text-xl font-bold text-[#202824]">No matching products</h3>
                <p className="text-sm text-[#202824]/60 mt-1">
                  Try clearing your search or selecting another category.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 sm:gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      <AnimatePresence>
        {mobileFilterOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileFilterOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 lg:hidden"
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 26, stiffness: 260 }}
              className="fixed bottom-0 left-0 right-0 bg-[#F7F5EF] rounded-t-3xl p-6 z-50 max-h-[85vh] overflow-y-auto lg:hidden"
            >
              <div className="flex items-center justify-between pb-4 border-b border-[#123C32]/10">
                <h3 className="font-bold text-lg text-[#123C32]">Filter Catalogue</h3>
                <button
                  onClick={() => setMobileFilterOpen(false)}
                  className="p-2 rounded-full bg-[#E5EDE6]"
                >
                  <X className="w-5 h-5 text-[#123C32]" />
                </button>
              </div>

              <div className="py-4 space-y-2">
                {allCategories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => {
                      setSelectedCategory(cat);
                      setMobileFilterOpen(false);
                    }}
                    className={`w-full text-left px-4 py-3 rounded-xl text-sm font-semibold ${
                      selectedCategory === cat
                        ? "bg-[#123C32] text-white"
                        : "bg-white text-[#202824]"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
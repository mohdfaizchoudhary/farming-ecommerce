"use client";

import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import { useStore } from "@/components/StoreProvider";

export default function WishlistPage() {
  const { wishlist, products: catalog, catalogLoading, catalogError } = useStore();
  const savedProducts = catalog.filter((product) => wishlist.includes(product.id));

  return (
    <div className="bg-[#F7F5EF] min-h-screen py-10 sm:py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-xs font-bold uppercase tracking-widest text-[#123C32]/65">Your saved items</p>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#123C32] mt-2">Wishlist</h1>
        {catalogLoading && !catalog.length ? (
          <p role="status" className="mt-7 text-sm text-[#65776f]">Loading products…</p>
        ) : catalogError && !catalog.length ? (
          <p role="alert" className="mt-7 text-sm text-rose-700">Products could not be loaded: {catalogError}</p>
        ) : savedProducts.length ? (
          <div className="mt-7 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {savedProducts.map((product) => <ProductCard key={product.id} product={product} />)}
          </div>
        ) : (
          <div className="mt-7 rounded-3xl border border-[#123C32]/10 bg-white p-8 text-center">
            <p className="text-[#202824]/70">Your wishlist is empty. Save products with the heart button to find them here.</p>
            <Link href="/products" className="inline-flex mt-5 px-5 py-3 rounded-xl bg-[#123C32] text-white font-semibold">
              Browse products
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

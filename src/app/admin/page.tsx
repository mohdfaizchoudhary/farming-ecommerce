"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getCatalogProducts, money, type Product } from "@/lib/catalog";
import { useStore } from "@/components/StoreProvider";

export default function Admin() {
  const [products, setProducts] = useState<Product[]>([]);
  const { orders } = useStore();

  useEffect(() => {
    setProducts(getCatalogProducts());
  }, []);
  const businessTotal = orders
    .filter((order) => order.paymentStatus === "successful")
    .reduce((sum, order) => sum + order.total, 0);

  return (
    <div>
      <p className="eyebrow">Overview</p>
      <h1 className="section-title mt-2">Admin Dashboard</h1>
      <div className="mt-5 rounded-xl bg-amber-50 p-3 text-sm text-amber-900">Admin-only product management is enabled. Only the separate admin account can upload or edit items.</div>
      <div className="mt-5 rounded-2xl bg-white p-5 sm:max-w-sm"><p className="text-xs text-charcoal/50">Total Business</p><b className="mt-3 block font-serif text-3xl text-forest">{money(businessTotal)}</b><p className="mt-2 text-xs text-charcoal/50">Successful demo payments</p></div>
      <div className="mt-5 rounded-2xl bg-white p-5">
        <div className="flex justify-between"><h2 className="font-serif text-xl text-forest">Catalogue Preview</h2><Link href="/admin/products" className="text-xs underline">Manage</Link></div>
        {products.slice(0, 5).map((product) => <div key={product.id} className="flex flex-wrap justify-between gap-2 border-b border-forest/10 py-3 text-sm"><span>{product.name}<span className="ml-2 text-xs text-charcoal/50">Stock: {product.stock}</span></span><b>{money(product.price)}</b></div>)}
      </div>
    </div>
  );
}

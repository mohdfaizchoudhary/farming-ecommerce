"use client";

import { useEffect, useMemo, useState } from "react";
import { categories, createProductId, getCatalogProducts, money, saveCatalogProducts, type Product } from "@/lib/catalog";
import ProductImage from "@/components/ProductImage";

const emptyForm = {
  name: "",
  category: "poultry-buy-sell",
  price: "",
  mrp: "",
  unit: "",
  description: "",
  image: "",
  stock: "",
};

export default function Page() {
  const [products, setProducts] = useState<Product[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [message, setMessage] = useState("");

  useEffect(() => {
    setProducts(getCatalogProducts());
  }, []);

  const normalizedProducts = useMemo(() => products, [products]);

  function setField<K extends keyof typeof emptyForm>(field: K, value: (typeof emptyForm)[K]) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function resetForm() {
    setEditingId(null);
    setForm(emptyForm);
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const id = editingId ?? createProductId(form.name || "product");
    const baseSlug = (form.name || "product").toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "product";
    const slug = normalizedProducts.some((product) => product.id !== id && product.slug === baseSlug)
      ? `${baseSlug}-${id}`
      : baseSlug;
    const nextProduct: Product = {
      id,
      slug,
      name: form.name.trim(),
      category: form.category,
      price: Number(form.price),
      mrp: Number(form.mrp || form.price),
      unit: form.unit.trim() || "Unit",
      description: form.description.trim() || "Poultry listing prepared for review.",
      image: form.image.trim() || "https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?auto=format&fit=crop&w=900&q=85",
      stock: Number(form.stock || 0),
    };

    if (!nextProduct.name || Number.isNaN(nextProduct.price) || Number.isNaN(nextProduct.stock)) {
      setMessage("Please provide a valid product name, price and stock quantity.");
      return;
    }
    if (!categories.some((category) => category.slug === nextProduct.category)) {
      setMessage("Please select a valid poultry marketplace category.");
      return;
    }

    const nextProducts = editingId
      ? normalizedProducts.map((product) => (product.id === editingId ? { ...product, ...nextProduct, id: editingId } : product))
      : [nextProduct, ...normalizedProducts];

    setProducts(nextProducts);
    saveCatalogProducts(nextProducts);
    setMessage(editingId ? "Product updated successfully." : "Product uploaded successfully.");
    resetForm();
  }

  function handleEdit(product: Product) {
    setEditingId(product.id);
    setForm({
      name: product.name,
      category: product.category,
      price: String(product.price),
      mrp: String(product.mrp),
      unit: product.unit,
      description: product.description,
      image: product.image,
      stock: String(product.stock),
    });
  }

  function handleDelete(productId: string) {
    const nextProducts = normalizedProducts.filter((product) => product.id !== productId);
    setProducts(nextProducts);
    saveCatalogProducts(nextProducts);
    setMessage("Product removed from the catalogue.");
    if (editingId === productId) resetForm();
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="eyebrow">Poultry marketplace</p>
        <h1 className="section-title mt-2">Listings</h1>
      </div>

      <form onSubmit={handleSubmit} className="rounded-2xl border border-[#dce6df] bg-white p-4 shadow-sm sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-serif text-2xl text-forest">{editingId ? "Edit product" : "Add product"}</h2>
          {editingId && (
            <button type="button" onClick={resetForm} className="text-xs font-medium text-charcoal/60 underline">
              Cancel edit
            </button>
          )}
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <label className="block text-sm font-medium text-forest">
            Product name
            <input className="field mt-2" value={form.name} onChange={(event) => setField("name", event.target.value)} required />
          </label>

          <label className="block text-sm font-medium text-forest">
            Category
            <select className="field mt-2" value={form.category} onChange={(event) => setField("category", event.target.value)} required>
              {categories.map((category) => (
                <option key={category.slug} value={category.slug}>
                  {category.name}
                </option>
              ))}
            </select>
          </label>

          <label className="block text-sm font-medium text-forest">
            Selling price
            <input className="field mt-2" type="number" min="0" value={form.price} onChange={(event) => setField("price", event.target.value)} required />
          </label>

          <label className="block text-sm font-medium text-forest">
            MRP
            <input className="field mt-2" type="number" min="0" value={form.mrp} onChange={(event) => setField("mrp", event.target.value)} required />
          </label>

          <label className="block text-sm font-medium text-forest">
            Unit
            <input className="field mt-2" value={form.unit} onChange={(event) => setField("unit", event.target.value)} required />
          </label>

          <label className="block text-sm font-medium text-forest">
            Stock
            <input className="field mt-2" type="number" min="0" value={form.stock} onChange={(event) => setField("stock", event.target.value)} required />
          </label>

          <label className="block text-sm font-medium text-forest md:col-span-2">
            Image URL
            <input className="field mt-2" type="url" value={form.image} onChange={(event) => setField("image", event.target.value)} required />
          </label>

          <label className="block text-sm font-medium text-forest md:col-span-2">
            Description
            <textarea className="field mt-2 min-h-28" value={form.description} onChange={(event) => setField("description", event.target.value)} required />
          </label>
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
          <button type="submit" className="btn-primary">{editingId ? "Save changes" : "Publish listing"}</button>
          {message && <p className="text-sm text-forest">{message}</p>}
        </div>
      </form>

      <div className="overflow-x-auto rounded-2xl bg-white">
        <table className="w-full min-w-[880px] text-left text-sm">
          <thead className="bg-sage text-forest">
            <tr>
              {['Listing', 'Category', 'Reference', 'Price', 'Quantity', 'Actions'].map((heading) => (
                <th key={heading} className="p-4 font-semibold">
                  {heading}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {normalizedProducts.map((product) => (
              <tr key={product.id} className="border-t border-forest/10 align-top">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <ProductImage src={product.image} alt={product.name} className="h-12 w-12 rounded-xl object-cover" />
                    <span>{product.name}</span>
                  </div>
                </td>
                <td className="p-4">{categories.find((category) => category.slug === product.category)?.name ?? "Poultry listing"}</td>
                <td className="p-4">{product.id.toUpperCase()}</td>
                <td className="p-4">{money(product.price)}</td>
                <td className="p-4">{product.stock}</td>
                <td className="p-4">
                  <div className="flex gap-2">
                    <button type="button" onClick={() => handleEdit(product)} className="rounded-full bg-sage px-3 py-1.5 text-xs font-medium text-forest">
                      Edit
                    </button>
                    <button type="button" onClick={() => handleDelete(product.id)} className="rounded-full bg-rose-100 px-3 py-1.5 text-xs font-medium text-rose-700">
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

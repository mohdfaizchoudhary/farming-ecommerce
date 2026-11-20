// "use client";

// import { useEffect, useMemo, useState } from "react";
// import { categories, createProductId, getCatalogProducts, money, saveCatalogProducts, type Product } from "@/lib/catalog";
// import ProductImage from "@/components/ProductImage";

// const emptyForm = {
//   name: "",
//   category: "poultry-buy-sell",
//   price: "",
//   mrp: "",
//   unit: "",
//   description: "",
//   image: "",
//   stock: "",
// };

// export default function Page() {
//   const [products, setProducts] = useState<Product[]>([]);
//   const [editingId, setEditingId] = useState<string | null>(null);
//   const [form, setForm] = useState(emptyForm);
//   const [message, setMessage] = useState("");

//   useEffect(() => {
//     setProducts(getCatalogProducts());
//   }, []);

//   const normalizedProducts = useMemo(() => products, [products]);

//   function setField<K extends keyof typeof emptyForm>(field: K, value: (typeof emptyForm)[K]) {
//     setForm((current) => ({ ...current, [field]: value }));
//   }

//   function resetForm() {
//     setEditingId(null);
//     setForm(emptyForm);
//   }

//   function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
//     event.preventDefault();

//     const id = editingId ?? createProductId(form.name || "product");
//     const baseSlug = (form.name || "product").toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "product";
//     const slug = normalizedProducts.some((product) => product.id !== id && product.slug === baseSlug)
//       ? `${baseSlug}-${id}`
//       : baseSlug;
//     const nextProduct: Product = {
//       id,
//       slug,
//       name: form.name.trim(),
//       category: form.category,
//       price: Number(form.price),
//       mrp: Number(form.mrp || form.price),
//       unit: form.unit.trim() || "Unit",
//       description: form.description.trim() || "Poultry listing prepared for review.",
//       image: form.image.trim() || "https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?auto=format&fit=crop&w=900&q=85",
//       stock: Number(form.stock || 0),
//     };

//     if (!nextProduct.name || Number.isNaN(nextProduct.price) || Number.isNaN(nextProduct.stock)) {
//       setMessage("Please provide a valid product name, price and stock quantity.");
//       return;
//     }
//     if (!categories.some((category) => category.slug === nextProduct.category)) {
//       setMessage("Please select a valid poultry marketplace category.");
//       return;
//     }

//     const nextProducts = editingId
//       ? normalizedProducts.map((product) => (product.id === editingId ? { ...product, ...nextProduct, id: editingId } : product))
//       : [nextProduct, ...normalizedProducts];

//     setProducts(nextProducts);
//     saveCatalogProducts(nextProducts);
//     setMessage(editingId ? "Product updated successfully." : "Product uploaded successfully.");
//     resetForm();
//   }

//   function handleEdit(product: Product) {
//     setEditingId(product.id);
//     setForm({
//       name: product.name,
//       category: product.category,
//       price: String(product.price),
//       mrp: String(product.mrp),
//       unit: product.unit,
//       description: product.description,
//       image: product.image,
//       stock: String(product.stock),
//     });
//   }

//   function handleDelete(productId: string) {
//     const nextProducts = normalizedProducts.filter((product) => product.id !== productId);
//     setProducts(nextProducts);
//     saveCatalogProducts(nextProducts);
//     setMessage("Product removed from the catalogue.");
//     if (editingId === productId) resetForm();
//   }

//   return (
//     <div className="space-y-6">
//       <div>
//         <p className="eyebrow">Poultry marketplace</p>
//         <h1 className="section-title mt-2">Listings</h1>
//       </div>

//       <form onSubmit={handleSubmit} className="rounded-2xl border border-[#dce6df] bg-white p-4 shadow-sm sm:p-6">
//         <div className="flex flex-wrap items-center justify-between gap-3">
//           <h2 className="font-serif text-2xl text-forest">{editingId ? "Edit product" : "Add product"}</h2>
//           {editingId && (
//             <button type="button" onClick={resetForm} className="text-xs font-medium text-charcoal/60 underline">
//               Cancel edit
//             </button>
//           )}
//         </div>

//         <div className="mt-5 grid gap-4 md:grid-cols-2">
//           <label className="block text-sm font-medium text-forest">
//             Product name
//             <input className="field mt-2" value={form.name} onChange={(event) => setField("name", event.target.value)} required />
//           </label>

//           <label className="block text-sm font-medium text-forest">
//             Category
//             <select className="field mt-2" value={form.category} onChange={(event) => setField("category", event.target.value)} required>
//               {categories.map((category) => (
//                 <option key={category.slug} value={category.slug}>
//                   {category.name}
//                 </option>
//               ))}
//             </select>
//           </label>

//           <label className="block text-sm font-medium text-forest">
//             Selling price
//             <input className="field mt-2" type="number" min="0" value={form.price} onChange={(event) => setField("price", event.target.value)} required />
//           </label>

//           <label className="block text-sm font-medium text-forest">
//             MRP
//             <input className="field mt-2" type="number" min="0" value={form.mrp} onChange={(event) => setField("mrp", event.target.value)} required />
//           </label>

//           <label className="block text-sm font-medium text-forest">
//             Unit
//             <input className="field mt-2" value={form.unit} onChange={(event) => setField("unit", event.target.value)} required />
//           </label>

//           <label className="block text-sm font-medium text-forest">
//             Stock
//             <input className="field mt-2" type="number" min="0" value={form.stock} onChange={(event) => setField("stock", event.target.value)} required />
//           </label>

//           <label className="block text-sm font-medium text-forest md:col-span-2">
//             Image URL
//             <input className="field mt-2" type="url" value={form.image} onChange={(event) => setField("image", event.target.value)} required />
//           </label>

//           <label className="block text-sm font-medium text-forest md:col-span-2">
//             Description
//             <textarea className="field mt-2 min-h-28" value={form.description} onChange={(event) => setField("description", event.target.value)} required />
//           </label>
//         </div>

//         <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
//           <button type="submit" className="btn-primary">{editingId ? "Save changes" : "Publish listing"}</button>
//           {message && <p className="text-sm text-forest">{message}</p>}
//         </div>
//       </form>

//       <div className="overflow-x-auto rounded-2xl bg-white">
//         <table className="w-full min-w-[880px] text-left text-sm">
//           <thead className="bg-sage text-forest">
//             <tr>
//               {['Listing', 'Category', 'Reference', 'Price', 'Quantity', 'Actions'].map((heading) => (
//                 <th key={heading} className="p-4 font-semibold">
//                   {heading}
//                 </th>
//               ))}
//             </tr>
//           </thead>
//           <tbody>
//             {normalizedProducts.map((product) => (
//               <tr key={product.id} className="border-t border-forest/10 align-top">
//                 <td className="p-4">
//                   <div className="flex items-center gap-3">
//                     <ProductImage src={product.image} alt={product.name} className="h-12 w-12 rounded-xl object-cover" />
//                     <span>{product.name}</span>
//                   </div>
//                 </td>
//                 <td className="p-4">{categories.find((category) => category.slug === product.category)?.name ?? "Poultry listing"}</td>
//                 <td className="p-4">{product.id.toUpperCase()}</td>
//                 <td className="p-4">{money(product.price)}</td>
//                 <td className="p-4">{product.stock}</td>
//                 <td className="p-4">
//                   <div className="flex gap-2">
//                     <button type="button" onClick={() => handleEdit(product)} className="rounded-full bg-sage px-3 py-1.5 text-xs font-medium text-forest">
//                       Edit
//                     </button>
//                     <button type="button" onClick={() => handleDelete(product.id)} className="rounded-full bg-rose-100 px-3 py-1.5 text-xs font-medium text-rose-700">
//                       Delete
//                     </button>
//                   </div>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// }



"use client";

import React, { useCallback, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Search,
  Package,
  AlertTriangle,
  CheckCircle2,
  Edit3,
  Trash2,
  X,
  ImagePlus,
  Snowflake,
  ShieldCheck,
} from "lucide-react";
import {
  categories,
  CATALOG_STORAGE_KEY,
  createProductId,
  getCatalogProducts,
  saveCatalogProducts,
  type Product,
} from "@/lib/catalog";

interface AdminProduct {
  id: string;
  name: string;
  category: string;
  imageUrl: string;
  packSize: string;
  variantType: string;
  description: string;
  price: number;
  mrp: number;
  stock: number;
  handling: "Cold-Chain" | "Live Certified" | "Standard";
  published: boolean;
}

const categorySlugs: Record<string, string> = Object.fromEntries(categories.map((category) => [category.name, category.slug]));
const maxImageSize = 5 * 1024 * 1024;
const maxLocalImageDataUrlLength = 350_000;

function parseAdminProducts(products: Product[]): AdminProduct[] {
  return products.map((product) => ({
    id: product.id,
    name: product.name,
    category: categories.find((item) => item.slug === product.category)?.name ?? product.category,
    imageUrl: product.image,
    packSize: product.unit,
    variantType: product.variantType ?? "Standard",
    description: product.description,
    price: product.price,
    mrp: product.mrp,
    stock: product.stock,
    handling: product.handling ?? "Standard",
    published: product.published !== false,
  }));
}

async function makeLocalProductImage(file: File): Promise<string> {
  if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
    throw new Error("Choose a JPG, PNG, or WebP image.");
  }
  if (file.size > maxImageSize) {
    throw new Error("Choose an image that is 5 MB or smaller.");
  }

  const bitmap = await createImageBitmap(file);
  try {
    let longestEdge = 1200;
    while (true) {
      const scale = Math.min(1, longestEdge / Math.max(bitmap.width, bitmap.height));
      const canvas = document.createElement("canvas");
      canvas.width = Math.max(1, Math.round(bitmap.width * scale));
      canvas.height = Math.max(1, Math.round(bitmap.height * scale));
      const context = canvas.getContext("2d");
      if (!context) throw new Error("Could not prepare this image in your browser.");
      context.fillStyle = "#ffffff";
      context.fillRect(0, 0, canvas.width, canvas.height);
      context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
      const image = canvas.toDataURL("image/jpeg", 0.76);
      if (image.length <= maxLocalImageDataUrlLength) return image;
      if (longestEdge <= 480) {
        throw new Error("This image is too large to save in this browser. Choose a smaller image.");
      }
      longestEdge = Math.max(480, Math.round(longestEdge * 0.75));
    }
  } finally {
    bitmap.close();
  }
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [savingProduct, setSavingProduct] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [message, setMessage] = useState("");
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");

  // Drawer & Edit state
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);

  // Form fields
  const [formName, setFormName] = useState("");
  const [formCategory, setFormCategory] = useState("Farming & Livestock");
  const [formImageUrl, setFormImageUrl] = useState("");
  const [formPackSize, setFormPackSize] = useState("");
  const [formVariantType, setFormVariantType] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formPrice, setFormPrice] = useState("");
  const [formMrp, setFormMrp] = useState("");
  const [formStock, setFormStock] = useState("");
  const [formHandling, setFormHandling] =
    useState<AdminProduct["handling"]>("Live Certified");

  const refreshProducts = useCallback(async () => {
    try {
      setProducts(parseAdminProducts(getCatalogProducts()));
      setMessage("");
    } catch (cause) {
      console.error("Could not load locally saved products.", cause);
      setMessage(cause instanceof Error ? cause.message : "Could not load products.");
    } finally {
      setLoadingProducts(false);
    }
  }, []);

  useEffect(() => {
    setLoadingProducts(true);
    void refreshProducts();
    const syncCatalog = (event: StorageEvent) => {
      if (event.key === CATALOG_STORAGE_KEY) void refreshProducts();
    };
    window.addEventListener("catalog-changed", refreshProducts);
    window.addEventListener("storage", syncCatalog);
    window.addEventListener("focus", refreshProducts);
    return () => {
      window.removeEventListener("catalog-changed", refreshProducts);
      window.removeEventListener("storage", syncCatalog);
      window.removeEventListener("focus", refreshProducts);
    };
  }, [refreshProducts]);

  const filtered = products.filter((p) => {
    const matchSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.packSize.toLowerCase().includes(search.toLowerCase()) ||
      p.variantType.toLowerCase().includes(search.toLowerCase());
    const matchCat = categoryFilter === "All" || p.category === categoryFilter;
    return matchSearch && matchCat;
  });
  const messageIsError = /could not|failed|missing|not configured|invalid|choose|select|must be|unsupported|unknown|too large|storage is full|enter valid|enter a product/i.test(message);

  const openAddDrawer = () => {
    setEditingProductId(null);
    setFormName("");
    setFormCategory("Farming & Livestock");
    setFormImageUrl("");
    setFormPackSize("");
    setFormVariantType("");
    setFormDescription("");
    setFormPrice("");
    setFormMrp("");
    setFormStock("");
    setFormHandling("Live Certified");
    setDrawerOpen(true);
  };

  const openEditDrawer = (product: AdminProduct) => {
    setEditingProductId(product.id);
    setFormName(product.name);
    setFormCategory(product.category);
    setFormImageUrl(product.imageUrl);
    setFormPackSize(product.packSize);
    setFormVariantType(product.variantType);
    setFormDescription(product.description);
    setFormPrice(String(product.price));
    setFormMrp(String(product.mrp));
    setFormStock(String(product.stock));
    setFormHandling(product.handling);
    setDrawerOpen(true);
  };

  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingImage(true);
    setMessage("");
    try {
      setFormImageUrl(await makeLocalProductImage(file));
    } catch (cause) {
      setMessage(cause instanceof Error ? cause.message : "Could not read the selected image.");
    } finally {
      setUploadingImage(false);
      e.target.value = "";
    }
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProduct(true);
    setMessage("");
    try {
      const category = categorySlugs[formCategory];
      if (!category) throw new Error("Select a valid product category.");

      let image = formImageUrl.trim() || "/sms-farmstead-logo.jpeg";
      if (image.toLowerCase().startsWith("data:image/")) {
        const response = await fetch(image);
        if (!response.ok) throw new Error("The selected image could not be read. Choose the image file again.");
        const blob = await response.blob();
        image = await makeLocalProductImage(new File([blob], "product-image", { type: blob.type }));
      } else if (image.startsWith("data:")) {
        throw new Error("Choose a JPG, PNG, or WebP image file.");
      }

      const name = formName.trim();
      const price = Number(formPrice);
      const mrp = Number(formMrp);
      const stock = Number(formStock);
      if (!name) throw new Error("Enter a product name.");
      if (!Number.isFinite(price) || price < 0 || !Number.isFinite(mrp) || mrp < 0) {
        throw new Error("Enter valid product prices.");
      }
      if (mrp < price) throw new Error("MRP must be equal to or greater than the selling price.");
      if (!Number.isInteger(stock) || stock < 0) throw new Error("Enter a valid whole-number stock quantity.");

      const currentProducts = getCatalogProducts();
      const existing = currentProducts.find((product) => product.id === editingProductId);
      const baseSlug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "product";
      let slug = existing?.slug ?? baseSlug;
      let suffix = 2;
      while (currentProducts.some((product) => product.id !== editingProductId && product.slug === slug)) {
        slug = `${baseSlug}-${suffix++}`;
      }
      const saved: Product = {
        id: editingProductId ?? createProductId(name),
        slug,
        name: formName.trim(),
        category,
        image,
        unit: formPackSize.trim() || "Standard Pack",
        variantType: formVariantType.trim() || "Regular",
        description: formDescription.trim(),
        price,
        mrp,
        stock,
        handling: formHandling,
        published: existing?.published !== false,
      };
      const nextProducts = editingProductId
        ? currentProducts.map((product) => product.id === editingProductId ? saved : product)
        : [saved, ...currentProducts];
      saveCatalogProducts(nextProducts);
      setProducts(parseAdminProducts(nextProducts));
      window.dispatchEvent(new Event("catalog-changed"));
      setMessage(editingProductId ? "Product updated in this browser." : "Product saved in this browser.");
      if (image !== formImageUrl.trim()) setFormImageUrl(image);
      setDrawerOpen(false);
    } catch (cause) {
      console.error("Could not save product.", cause);
      setMessage(cause instanceof Error && cause.name === "QuotaExceededError"
        ? "Browser storage is full. Remove unused products or choose smaller images."
        : cause instanceof Error ? cause.message : "Could not save product in this browser.");
    } finally {
      setSavingProduct(false);
    }
  };

  const togglePublish = (product: AdminProduct) => {
    setMessage("");
    try {
      const nextProducts = getCatalogProducts().map((entry) => entry.id === product.id
        ? { ...entry, published: !product.published }
        : entry);
      saveCatalogProducts(nextProducts);
      setProducts(parseAdminProducts(nextProducts));
      window.dispatchEvent(new Event("catalog-changed"));
    } catch (cause) {
      console.error("Could not update product publication status locally.", cause);
      setMessage(cause instanceof Error ? cause.message : "Could not update product.");
    }
  };

  const handleDelete = (productId: string) => {
    setMessage("");
    try {
      const nextProducts = getCatalogProducts().filter((product) => product.id !== productId);
      saveCatalogProducts(nextProducts);
      setProducts(parseAdminProducts(nextProducts));
      window.dispatchEvent(new Event("catalog-changed"));
      setMessage("Product removed from this browser's catalog.");
      if (editingProductId === productId) setDrawerOpen(false);
    } catch (cause) {
      console.error("Could not remove locally saved product.", cause);
      setMessage(cause instanceof Error ? cause.message : "Could not remove product.");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-[0.18em] text-[#123C32]/60">
            Catalogue & Inventory Control
          </span>
          <h1 className="font-serif text-2xl sm:text-4xl font-bold text-[#123C32] mt-1">
            Products & Inventory
          </h1>
        </div>

        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={openAddDrawer}
          className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-[#123C32] text-[#F7F5EF] text-xs sm:text-sm font-bold shadow-md hover:bg-[#1a5244] transition-all"
        >
          <Plus className="w-4 h-4 text-[#D9A65A]" /> Add New Product
        </motion.button>
      </div>

      <p className="rounded-xl bg-[#E5EDE6] p-3 text-sm text-[#123C32]">
        Products are saved in this browser only and are not synced to other devices.
      </p>

      {/* Filters & Search */}
      <div className="bg-white p-4 rounded-3xl border border-[#123C32]/10 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 shadow-sm">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#123C32]/45 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by product name, pack size or variant..."
            className="w-full pl-11 pr-4 py-2.5 rounded-2xl bg-[#F7F5EF] text-sm focus:outline-none"
          />
        </div>

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="px-4 py-2.5 rounded-2xl bg-[#F7F5EF] border border-[#123C32]/10 text-sm font-semibold text-[#123C32]"
        >
          <option value="All">All Categories</option>
          {categories.map((category) => <option key={category.slug} value={category.name}>{category.name}</option>)}
        </select>
      </div>
      {message && (
        <p
          role={messageIsError ? "alert" : "status"}
          className={`rounded-xl p-3 text-sm ${messageIsError ? "bg-rose-50 text-rose-700" : "bg-[#E5EDE6] text-[#123C32]"}`}
        >
          {message}
        </p>
      )}

      {/* Product Table */}
      <div className="bg-white rounded-3xl border border-[#123C32]/10 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#F7F5EF] text-[11px] font-bold uppercase tracking-wider text-[#123C32]/70">
                <th className="py-4 px-5">Product & Pack</th>
                <th className="py-4 px-5">Category & Handling</th>
                <th className="py-4 px-5">Price / MRP</th>
                <th className="py-4 px-5">Available Stock</th>
                <th className="py-4 px-5">Status</th>
                <th className="py-4 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#123C32]/10 text-sm">
              {loadingProducts ? (
                <tr><td colSpan={6} className="p-6 text-center text-[#202824]/60">Loading products…</td></tr>
              ) : filtered.length ? filtered.map((item, idx) => (
                <motion.tr
                  key={item.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.04 }}
                  className="hover:bg-[#F7F5EF]/50 transition-colors"
                >
                  <td className="py-4 px-5">
                    <div className="flex items-center gap-3.5">
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="w-12 h-12 rounded-xl object-cover bg-[#E5EDE6] shrink-0 border border-[#123C32]/10"
                      />
                      <div>
                        <p className="font-bold text-[#123C32]">{item.name}</p>
                        <span className="text-xs text-[#202824]/60">
                          {item.packSize} • {item.variantType}
                        </span>
                      </div>
                    </div>
                  </td>

                  <td className="py-4 px-5">
                    <span className="block text-xs font-semibold text-[#202824]">
                      {item.category}
                    </span>
                    <span className="mt-1 inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-[#E5EDE6] text-[#123C32]">
                      {item.handling === "Cold-Chain" ? (
                        <Snowflake className="w-3 h-3 text-sky-600" />
                      ) : (
                        <ShieldCheck className="w-3 h-3 text-[#123C32]" />
                      )}
                      {item.handling}
                    </span>
                  </td>

                  <td className="py-4 px-5">
                    <span className="font-extrabold text-[#123C32]">
                      ₹{item.price.toLocaleString("en-IN")}
                    </span>
                    <span className="block text-xs text-[#202824]/45 line-through">
                      ₹{item.mrp.toLocaleString("en-IN")}
                    </span>
                  </td>

                  <td className="py-4 px-5">
                    <div className="flex items-center gap-1.5">
                      {item.stock <= 10 ? (
                        <AlertTriangle className="w-4 h-4 text-amber-600" />
                      ) : (
                        <Package className="w-4 h-4 text-emerald-600" />
                      )}
                      <span
                        className={`font-bold ${
                          item.stock <= 10 ? "text-amber-700" : "text-[#202824]"
                        }`}
                      >
                        {item.stock} units
                      </span>
                    </div>
                  </td>

                  <td className="py-4 px-5">
                    <button
                      type="button"
                      onClick={() => void togglePublish(item)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-colors ${
                        item.published
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-gray-200 text-gray-700"
                      }`}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      {item.published ? "Published" : "Draft"}
                    </button>
                  </td>

                  <td className="py-4 px-5 text-right">
                    <div className="inline-flex items-center gap-2">
                      <button
                        onClick={() => openEditDrawer(item)}
                        aria-label="Edit product"
                        className="p-2 rounded-xl bg-[#F7F5EF] hover:bg-[#123C32] hover:text-white text-[#123C32] transition-colors"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => void handleDelete(item.id)}
                        aria-label="Delete product"
                        className="p-2 rounded-xl bg-rose-50 hover:bg-rose-600 hover:text-white text-rose-600 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              )) : (
                <tr><td colSpan={6} className="p-6 text-center text-[#202824]/60">No products match this filter.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Slide-Over Form Drawer */}
      <AnimatePresence>
        {drawerOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDrawerOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 260 }}
              className="fixed inset-y-0 right-0 w-full max-w-lg bg-[#F7F5EF] p-6 sm:p-8 z-50 shadow-2xl overflow-y-auto"
            >
              <div className="flex items-center justify-between pb-4 border-b border-[#123C32]/10">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#D9A65A] bg-[#123C32] px-2.5 py-0.5 rounded-md">
                    {editingProductId ? "Edit Mode" : "New Listing"}
                  </span>
                  <h2 className="font-serif text-2xl font-bold text-[#123C32] mt-1">
                    {editingProductId
                      ? "Edit Product Details"
                      : "Add New Product"}
                  </h2>
                </div>
                <button
                  onClick={() => setDrawerOpen(false)}
                  className="p-2 rounded-full bg-[#E5EDE6] text-[#123C32]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveProduct} className="mt-6 space-y-4">
                {/* Product Image Upload + Preview */}
                <div>
                  <label className="text-xs font-bold uppercase text-[#123C32] block mb-1.5">
                    Product Image
                  </label>
                  <div className="flex items-center gap-4 p-3.5 rounded-2xl bg-white border border-dashed border-[#123C32]/25">
                    {formImageUrl ? (
                      <img
                        src={formImageUrl}
                        alt="Preview"
                        className="w-16 h-16 rounded-xl object-cover shrink-0 border border-[#123C32]/10"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-xl bg-[#E5EDE6] text-[#123C32] flex items-center justify-center shrink-0">
                        <ImagePlus className="w-6 h-6" />
                      </div>
                    )}

                    <div className="flex-1 space-y-2">
                      <label className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#123C32] text-[#F7F5EF] text-xs font-bold ${uploadingImage ? "opacity-50" : "cursor-pointer hover:bg-[#1a5244]"}`}>
                        <ImagePlus className="w-3.5 h-3.5 text-[#D9A65A]" />
                        Choose Image File
                        <input
                          type="file"
                          accept="image/jpeg,image/png,image/webp"
                          onChange={handleImageFileChange}
                          disabled={uploadingImage}
                          className="hidden"
                        />
                      </label>
                      <input
                        type="text"
                        value={formImageUrl}
                        onChange={(e) => setFormImageUrl(e.target.value)}
                        placeholder="Or paste image URL (https://...)"
                        className="w-full px-3 py-1.5 rounded-lg bg-[#F7F5EF] text-xs border border-[#123C32]/10 focus:outline-none"
                      />
                      <p className="text-[10px] leading-4 text-[#202824]/55">
                        Saved only in this browser. Images up to 5 MB are optimized before local storage.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Product Title */}
                <div>
                  <label className="text-xs font-bold uppercase text-[#123C32] block mb-1">
                    Product Name
                  </label>
                  <input
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="e.g. Vaccinated Layer Chicks (Box of 25)"
                    className="w-full px-4 py-3 rounded-xl bg-white border border-[#123C32]/15 text-sm"
                  />
                </div>

                {/* Category & Handling Type */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold uppercase text-[#123C32] block mb-1">
                      Category
                    </label>
                    <select
                      value={formCategory}
                      onChange={(e) => setFormCategory(e.target.value)}
                      className="w-full px-3 py-3 rounded-xl bg-white border border-[#123C32]/15 text-sm"
                    >
                      {categories.map((category) => <option key={category.slug} value={category.name}>{category.name}</option>)}
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold uppercase text-[#123C32] block mb-1">
                      Handling Type
                    </label>
                    <select
                      value={formHandling}
                      onChange={(e) =>
                        setFormHandling(
                          e.target.value as AdminProduct["handling"]
                        )
                      }
                      className="w-full px-3 py-3 rounded-xl bg-white border border-[#123C32]/15 text-sm"
                    >
                      <option value="Live Certified">Live Certified</option>
                      <option value="Cold-Chain">Cold-Chain (0–4°C)</option>
                      <option value="Standard">Standard Pack</option>
                    </select>
                  </div>
                </div>

                {/* Pack Size & Breed / Variant */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold uppercase text-[#123C32] block mb-1">
                      Pack Size / Weight
                    </label>
                    <input
                      required
                      value={formPackSize}
                      onChange={(e) => setFormPackSize(e.target.value)}
                      placeholder="e.g. 500g / 12 Eggs"
                      className="w-full px-3.5 py-3 rounded-xl bg-white border border-[#123C32]/15 text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase text-[#123C32] block mb-1">
                      Breed / Variant Type
                    </label>
                    <input
                      required
                      value={formVariantType}
                      onChange={(e) => setFormVariantType(e.target.value)}
                      placeholder="e.g. Kadaknath / Boneless"
                      className="w-full px-3.5 py-3 rounded-xl bg-white border border-[#123C32]/15 text-sm"
                    />
                  </div>
                </div>

                {/* Pricing & Stock */}
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="text-xs font-bold uppercase text-[#123C32] block mb-1">
                      Selling ₹
                    </label>
                    <input
                      type="number"
                      min="0"
                      required
                      value={formPrice}
                      onChange={(e) => setFormPrice(e.target.value)}
                      placeholder="899"
                      className="w-full px-3 py-3 rounded-xl bg-white border border-[#123C32]/15 text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase text-[#123C32] block mb-1">
                      MRP ₹
                    </label>
                    <input
                      type="number"
                      min={formPrice || "0"}
                      required
                      value={formMrp}
                      onChange={(e) => setFormMrp(e.target.value)}
                      placeholder="1199"
                      className="w-full px-3 py-3 rounded-xl bg-white border border-[#123C32]/15 text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase text-[#123C32] block mb-1">
                      Stock Qty
                    </label>
                    <input
                      type="number"
                      min="0"
                      required
                      value={formStock}
                      onChange={(e) => setFormStock(e.target.value)}
                      placeholder="50"
                      className="w-full px-3 py-3 rounded-xl bg-white border border-[#123C32]/15 text-sm"
                    />
                  </div>
                </div>

                {/* Product Description */}
                <div>
                  <label className="text-xs font-bold uppercase text-[#123C32] block mb-1">
                    Product Details & Storage Info
                  </label>
                  <textarea
                    rows={3}
                    value={formDescription}
                    onChange={(e) => setFormDescription(e.target.value)}
                    placeholder="Add freshness details, storage instructions, or ingredients..."
                    className="w-full px-4 py-3 rounded-xl bg-white border border-[#123C32]/15 text-sm"
                  />
                </div>

                <button
                  type="submit"
                  disabled={savingProduct || uploadingImage}
                  className="w-full py-3.5 rounded-2xl bg-[#123C32] text-[#F7F5EF] font-bold text-sm shadow-lg hover:bg-[#1a5244] transition-all mt-2 disabled:opacity-50"
                >
                  {savingProduct ? "Saving…" : editingProductId
                    ? "Save Product Changes"
                    : "Publish Product"}
                </button>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
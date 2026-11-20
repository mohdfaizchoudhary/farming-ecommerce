// "use client";

// import Link from "next/link";
// import { ShoppingBag } from "lucide-react";
// import { Product, money } from "@/lib/catalog";
// import { useStore } from "@/components/StoreProvider";
// import ProductImage from "@/components/ProductImage";

// export default function ProductCard({ p }: { p: Product }) {
//   const { add } = useStore();

//   return (
//     <article className="product-card-enter flex h-full min-w-0 flex-col">
//       <Link
//         href={`/product/${p.slug}`}
//         className="product-card-image relative block overflow-hidden rounded-[18px] bg-[#e8f0ea]"
//       >
//         <ProductImage src={p.image} alt={p.name} className="aspect-[4/4.5] w-full object-cover" />
//         <span className="absolute left-2.5 top-2.5 rounded-full border border-white/60 bg-[#f6f8f3]/95 px-2.5 py-1 text-[9px] uppercase tracking-[.1em] text-[#183a30] sm:left-3 sm:top-3 sm:text-[10px]">
//           Sample listing
//         </span>
//       </Link>
//       <div className="flex items-start justify-between gap-2 pt-3 sm:pt-4">
//         <div className="flex min-w-0 flex-1 flex-col">
//           <Link href={`/product/${p.slug}`} className="line-clamp-2 min-h-10 text-sm font-medium leading-5 text-[#183a30] transition hover:text-[#bd5c2c] sm:text-[15px]">
//             {p.name}
//           </Link>
//           <p className="mt-1 text-[11px] text-[#65776f]">{p.unit}</p>
//           <div className="mt-2 flex flex-wrap items-baseline gap-x-2 gap-y-1">
//             <b className="text-sm text-[#183a30]">{money(p.price)}</b>
//             <s className="text-[11px] text-[#91a098]">{money(p.mrp)}</s>
//           </div>
//         </div>
//         <button
//           type="button"
//           onClick={() => add(p.id, p.name)}
//           aria-label={`Add ${p.name} to cart`}
//           className="grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-[#c8d6cc] text-[#287052] transition hover:border-[#e88445] hover:bg-[#e88445] hover:text-white"
//         >
//           <ShoppingBag size={15} strokeWidth={1.7} />
//         </button>
//       </div>
//     </article>
//   );
// }






"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ShoppingCart,
  Heart,
  Snowflake,
  Sparkles,
  Check,
  ShieldCheck,
} from "lucide-react";
import { useStore } from "@/components/StoreProvider";

type ProductCardItem = {
  id?: string;
  slug?: string;
  name?: string;
  title?: string;
  categoryName?: string;
  category?: string | { name?: string };
  imageUrl?: string;
  image?: string;
  images?: string[];
  mrp?: number;
  originalPrice?: number;
  regular_price?: number;
  sellingPrice?: number;
  sale_price?: number;
  price?: number;
  variantLabel?: string;
  unit?: string;
  packSize?: string;
  breed?: string;
  badgeType?: "cold-chain" | "live" | "fresh" | "organic";
  inStock?: boolean;
  stock?: number;
};

export interface ProductCardProps extends ProductCardItem {
  product?: ProductCardItem;
  p?: ProductCardItem;
  onAddToCart?: (item: ProductCardItem) => void;
}

export default function ProductCard(props: ProductCardProps) {
  const [added, setAdded] = useState(false);
  const { add, wishlist, toggleWishlist } = useStore();

  // Support both <ProductCard product={item} /> and flat props
  const item = props.product ?? props.p ?? props;

  const id = item.id ?? item.slug ?? "item";
  const slug = item.slug ?? item.id ?? "";
  const name = item.name ?? item.title ?? "Farm Listing";
  const categoryName =
    item.categoryName ??
    (typeof item.category === "string"
      ? item.category
      : item.category?.name) ??
    "Poultry & Livestock";

  const imageUrl =
    item.imageUrl ??
    item.image ??
    (Array.isArray(item.images) && item.images.length > 0
      ? item.images[0]
      : "https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?auto=format&fit=crop&w=800&q=80");

  const safeSellingPrice = Number(
    item.sellingPrice ?? item.price ?? item.sale_price ?? 0
  );
  const safeMrp = Number(
    item.mrp ?? item.originalPrice ?? item.regular_price ?? safeSellingPrice
  );

  const variantLabel =
    item.variantLabel ?? item.unit ?? item.packSize ?? item.breed ?? "Standard";
  const badgeType = item.badgeType ?? "live";
  const inStock =
    item.inStock !== undefined
      ? Boolean(item.inStock)
      : item.stock !== undefined
      ? Number(item.stock) > 0
      : true;

  const discount =
    safeMrp > safeSellingPrice && safeMrp > 0
      ? Math.round(((safeMrp - safeSellingPrice) / safeMrp) * 100)
      : 0;

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!inStock) return;
    setAdded(true);
    if (props.onAddToCart) props.onAddToCart(item);
    else add(id, name);
    setTimeout(() => setAdded(false), 1500);
  };
  const liked = wishlist.includes(id);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="group relative bg-white rounded-3xl border border-[#123C32]/10 overflow-hidden transition-all duration-500 hover:shadow-[0_20px_50px_rgba(18,60,50,0.12)] hover:-translate-y-1.5 flex flex-col justify-between"
    >
      {/* Top Image & Floating Badges */}
      <Link
        href={slug ? `/product/${slug}` : "/products"}
        className="block relative overflow-hidden"
      >
        <div className="aspect-[4/3] w-full bg-[#E5EDE6]/50 overflow-hidden relative">
          <img
            src={imageUrl}
            alt={name}
            loading="lazy"
            className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#123C32]/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </div>

        {/* Left Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {discount > 0 && (
            <span className="bg-[#123C32] text-[#D9A65A] text-[11px] font-bold px-2.5 py-1 rounded-full shadow-md">
              {discount}% OFF
            </span>
          )}

          {badgeType === "cold-chain" && (
            <span className="inline-flex items-center gap-1 bg-white/90 backdrop-blur-md text-[#123C32] text-[10px] font-semibold px-2.5 py-1 rounded-full border border-[#123C32]/10">
              <Snowflake className="w-3 h-3 text-sky-600" /> Chilled
            </span>
          )}
          {badgeType === "live" && (
            <span className="inline-flex items-center gap-1 bg-[#D9A65A] text-[#202824] text-[10px] font-bold px-2.5 py-1 rounded-full">
              <ShieldCheck className="w-3 h-3" /> Verified Listing
            </span>
          )}
        </div>
      </Link>
      <motion.button
        type="button"
        whileTap={{ scale: 0.8 }}
        onClick={() => toggleWishlist(id)}
        aria-label={liked ? "Remove from wishlist" : "Save to wishlist"}
        aria-pressed={liked}
        className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center shadow-sm border border-[#123C32]/10 hover:bg-white transition-colors"
      >
        <Heart
          className={`w-4 h-4 transition-colors ${
            liked ? "fill-rose-500 text-rose-500" : "text-[#202824]"
          }`}
        />
      </motion.button>

      {/* Card Body */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#123C32]/65 truncate">
              {categoryName}
            </span>
            <span className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-[#E5EDE6] text-[#123C32] shrink-0">
              {variantLabel}
            </span>
          </div>

          <Link href={slug ? `/product/${slug}` : "/products"}>
            <h3 className="font-bold text-base sm:text-lg text-[#202824] group-hover:text-[#123C32] transition-colors line-clamp-2 leading-snug">
              {name}
            </h3>
          </Link>
        </div>

        {/* Price + Animated Add Button */}
        <div className="mt-4 pt-3.5 border-t border-[#123C32]/10 flex items-center justify-between gap-2">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-lg sm:text-xl font-extrabold text-[#123C32]">
                {safeSellingPrice > 0
                  ? `₹${safeSellingPrice.toLocaleString("en-IN")}`
                  : "Enquire"}
              </span>
              {discount > 0 && (
                <span className="text-xs text-[#202824]/45 line-through">
                  ₹{safeMrp.toLocaleString("en-IN")}
                </span>
              )}
            </div>
            <span className="text-[11px] text-emerald-700 font-medium flex items-center gap-1 mt-0.5">
              <Sparkles className="w-3 h-3 text-[#D9A65A]" />
              {inStock ? "Available" : "Out of stock"}
            </span>
          </div>

          <motion.button
            whileHover={{ scale: inStock ? 1.04 : 1 }}
            whileTap={{ scale: inStock ? 0.94 : 1 }}
            onClick={handleAdd}
            disabled={!inStock}
            className={`px-3.5 sm:px-4 py-2.5 rounded-2xl font-semibold text-xs sm:text-sm flex items-center gap-1.5 shadow-sm transition-all ${
              !inStock
                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                : added
                ? "bg-emerald-600 text-white"
                : "bg-[#123C32] text-[#F7F5EF] hover:bg-[#D9A65A] hover:text-[#202824]"
            }`}
          >
            {added ? (
              <>
                <Check className="w-4 h-4" /> Added
              </>
            ) : (
              <>
                <ShoppingCart className="w-4 h-4" /> Add
              </>
            )}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
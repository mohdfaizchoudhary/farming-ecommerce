// import { notFound } from "next/navigation";
// import Link from "next/link";
// import { ArrowLeft } from "lucide-react";
// import { categories } from "@/lib/catalog";
// import PoultryListingGrid from "@/components/PoultryListingGrid";

// export function generateStaticParams() {
//   return categories.map((category) => ({ slug: category.slug }));
// }

// export default function CategoryPage({ params }: { params: { slug: string } }) {
//   const category = categories.find((entry) => entry.slug === params.slug);
//   if (!category) return notFound();
//   const subcategories = categories.filter((entry) => entry.parentSlug === category.slug);

//   return (
//     <div className="container-shell py-12 sm:py-16">
//       <Link href="/categories" className="inline-flex items-center gap-2 text-sm text-[#65776f] transition hover:text-[#287052]">
//         <ArrowLeft size={15} /> All categories
//       </Link>
//       <div className="mt-6 rounded-[28px] border border-[#dce6df] bg-white p-7 sm:p-10">
//         <span className="grid h-14 w-14 place-items-center rounded-2xl bg-[#e8f0ea] text-3xl">{category.emoji}</span>
//         <p className="eyebrow mt-6">Poultry marketplace</p>
//         <h1 className="section-title mt-3">{category.name}</h1>
//         <p className="mt-4 max-w-2xl text-sm leading-7 text-[#65776f]">{category.description}</p>
//       </div>

//       {subcategories.length > 0 && (
//         <section className="mt-8" aria-labelledby="subcategory-heading">
//           <h2 id="subcategory-heading" className="font-serif text-2xl text-[#183a30]">Browse by type</h2>
//           <div className="mt-4 flex flex-wrap gap-3">
//             {subcategories.map((subcategory) => (
//               <Link
//                 key={subcategory.slug}
//                 href={`/category/${subcategory.slug}`}
//                 className="inline-flex items-center gap-2 rounded-full border border-[#c8d6cc] bg-white px-4 py-2 text-sm text-[#183a30] transition hover:border-[#9dbca9] hover:bg-[#e8f0ea]"
//               >
//                 <span aria-hidden="true">{subcategory.emoji}</span>
//                 {subcategory.name}
//               </Link>
//             ))}
//           </div>
//         </section>
//       )}

//       <div className="mb-5 mt-10 flex items-end justify-between gap-4">
//         <div>
//           <p className="eyebrow">Marketplace</p>
//           <h2 className="mt-2 font-serif text-3xl text-[#183a30]">Available listings</h2>
//         </div>
//         <span className="text-xs text-[#65776f]">Seller listings</span>
//       </div>
//       <PoultryListingGrid category={category.slug} emptyMessage="There are no listings in this category yet. Contact us if you would like to list poultry here." />
//       <p className="mt-8 text-xs leading-5 text-[#65776f]">
//         Sample marketplace listings only. Confirm all listing details, prices, health records, availability and fulfilment directly with the seller.
//       </p>
//     </div>
//   );
// }



"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, ShieldCheck, Snowflake } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import { useStore } from "@/components/StoreProvider";

const CATEGORY_META: Record<
  string,
  { title: string; subtitle: string; badge: string }
> = {
  "farming-livestock": {
    title: "Farming & Livestock",
    subtitle:
      "Vaccinated chicks, fertile hatching eggs, layer birds, and certified farm rabbits with health records.",
    badge: "Live & Farm Certified",
  },
  "eggs-foods": {
    title: "Eggs & Egg-Based Foods",
    subtitle:
      "Daily-harvested brown eggs, retail trays, and hygienically prepared ready-to-eat egg meals.",
    badge: "Batch Freshness Tracked",
  },
  "ready-to-cook": {
    title: "Ready-to-Eat & Ready-to-Cook",
    subtitle:
      "Chef-crafted momos, nuggets, sausages, burger patties, and seekh kebabs sealed in chilled packs.",
    badge: "Chilled & Frozen Storage",
  },
  "raw-meat": {
    title: "Raw Chicken & Fresh Meat",
    subtitle:
      "Antibiotic-free whole chicken, curry cuts, wings, and drumsticks delivered in a 0–4°C cold chain.",
    badge: "0–4°C Cold Chain",
  },
  supplements: {
    title: "Supplements & Personal Care",
    subtitle:
      "Lab-tested whey protein, egg protein powder, calcium supplements, and clean daily essentials.",
    badge: "FSSAI & Batch Verified",
  },
  "skincare-beauty": {
    title: "Skincare & Beauty",
    subtitle:
      "Dermatologically tested cleansers, toners, active serums, moisturisers, and broad-spectrum sunscreens.",
    badge: "Clean Botanicals",
  },
  "pet-products": {
    title: "Pet Care & Nutrition",
    subtitle:
      "Life-stage tailored pet food, gentle shampoos, grooming essentials, and hygiene care.",
    badge: "Vet Approved Formulations",
  },
};

const CATEGORY_PRODUCT_SLUGS: Record<string, string[]> = {
  "farming-livestock": ["farming-livestock", "poultry-buy-sell", "layer-birds", "buying-birds", "chick-sale", "rabbit", "breeding-rabbits", "pet-rabbits"],
  "eggs-foods": ["eggs-foods", "hatching-eggs"],
  "ready-to-cook": ["ready-to-cook"],
  "raw-meat": ["raw-meat", "chicken-sale"],
  supplements: ["supplements"],
  "skincare-beauty": ["skincare-beauty"],
  "pet-products": ["pet-products", "rabbit", "breeding-rabbits", "pet-rabbits"],
};

export default function CategoryDetailPage() {
  const params = useParams();
  const slug = (params?.slug as string) || "farming-livestock";
  const { products: catalog, catalogError, catalogLoading } = useStore();

  const meta = CATEGORY_META[slug] || {
    title: slug.replace(/-/g, " ").toUpperCase(),
    subtitle: "Explore verified products in this category.",
    badge: "Verified Collection",
  };
  const productCategories = CATEGORY_PRODUCT_SLUGS[slug] ?? [];
  const categoryProducts = catalog.filter((product) => productCategories.includes(product.category));

  return (
    <div className="bg-[#F7F5EF] min-h-screen pb-20">
      {/* Category Header */}
      <div className="bg-[#123C32] text-[#F7F5EF] py-12 sm:py-16 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-xs sm:text-sm text-[#D9A65A] font-semibold mb-4 hover:underline"
          >
            <ArrowLeft className="w-4 h-4" /> Back to All Categories
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-3"
          >
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#F7F5EF]/10 text-[#D9A65A] text-xs font-bold">
              <ShieldCheck className="w-3.5 h-3.5" /> {meta.badge}
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold">{meta.title}</h1>
            <p className="text-sm sm:text-base text-[#F7F5EF]/80 max-w-2xl">
              {meta.subtitle}
            </p>
          </motion.div>
        </div>
      </div>

      {/* Category Products Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        <div className="flex items-center justify-between mb-6">
          <span className="text-sm font-semibold text-[#202824]/70 flex items-center gap-1.5">
            <Snowflake className="w-4 h-4 text-[#123C32]" />
            Showing live inventory for {meta.title}
          </span>
        </div>

        {catalogLoading && !catalog.length ? (
          <p role="status" className="text-sm text-[#65776f]">Loading products…</p>
        ) : catalogError && !catalog.length ? (
          <p role="alert" className="rounded-2xl bg-white p-6 text-sm text-rose-700">Products could not be loaded: {catalogError}</p>
        ) : categoryProducts.length ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categoryProducts.map((product) => <ProductCard key={product.id} product={product} />)}
          </div>
        ) : (
          <p className="rounded-2xl border border-dashed border-[#c8d6cc] bg-white p-8 text-sm text-[#65776f]">
            There are no listings in this category yet. Browse all available products to find current listings.
            {" "}<Link href="/products" className="font-semibold text-[#123C32] underline">Browse products</Link>
          </p>
        )}
      </div>
    </div>
  );
}
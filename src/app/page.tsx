// import Link from "next/link";
// import { ArrowDownRight, ArrowRight, ArrowUpRight, BadgeCheck, Handshake, PackageSearch, Truck } from "lucide-react";
// import { shopCategories } from "@/lib/catalog";
// import HomeHero from "@/components/HomeHero";
// import PoultryListingGrid from "@/components/PoultryListingGrid";

// const assurances = [
//   { icon: PackageSearch, title: "Purpose-built listings", text: "Browse poultry, birds, hatching eggs and chicks in one focused marketplace." },
//   { icon: BadgeCheck, title: "Details that matter", text: "Review seller-provided breed, batch, health and availability information." },
//   { icon: Handshake, title: "Direct connections", text: "Connect with sellers to confirm terms and suitability before you buy." },
//   { icon: Truck, title: "Plan fulfilment", text: "Discuss transport, handling and delivery arrangements with the seller." },
// ];

// const sisterStores = [
//   { name: "SMS Ovanest", category: "Eggs & Egg-Based Foods", icon: "🥚", href: "https://www.flipkart.com/" },
//   { name: "SMS Claude Kitchen", category: "Ready-to-Eat & Ready-to-Cook Foods", icon: "🍲", href: "https://www.amazon.in/" },
//   { name: "SMS Raw Chicken", category: "Raw Chicken & Meat", icon: "🍗", href: "https://www.bigbasket.com/" },
//   { name: "SMS Beauty", category: "Supplements & Personal Care", icon: "🧴", href: "https://www.1mg.com/" },
//   { name: "SMS Grow Naturally", category: "Skincare & Beauty", icon: "▪️", href: "https://www.nykaa.com/" },
//   { name: "SMS Pet Grow Care", category: "Pet Products", icon: "🐾", href: "https://headsupfortails.com/" },
// ];

// export default function Home() {
//   return (
//     <>
//       <HomeHero />

//       <section className="border-b border-[#dce6df] bg-white">
//         <div className="container-shell grid gap-5 py-6 sm:grid-cols-2 lg:grid-cols-4">
//           {assurances.map(({ icon: Icon, title, text }) => (
//             <article key={title} className="flex items-start gap-3">
//               <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#e8f0ea] text-[#23634e]">
//                 <Icon size={18} strokeWidth={1.7} />
//               </span>
//               <div>
//                 <h2 className="text-sm font-semibold text-[#183a30]">{title}</h2>
//                 <p className="mt-1 text-xs leading-5 text-[#65776f]">{text}</p>
//               </div>
//             </article>
//           ))}
//         </div>
//       </section>

//       <section className="container-shell py-16 sm:py-20">
//         <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between sm:gap-5">
//           <div>
//             <p className="eyebrow">Built around poultry trade</p>
//             <h2 className="section-title mt-3">Shop by category</h2>
//             <p className="mt-3 max-w-xl text-sm leading-6 text-[#65776f]">
//               Find hatching eggs, live birds, chicks and poultry listings made for buyers and sellers.
//             </p>
//           </div>
//           <Link href="/categories" className="btn-secondary hidden shrink-0 sm:inline-flex">
//             All categories <ArrowRight size={15} />
//           </Link>
//         </div>

//         <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
//           {shopCategories.map((category, index) => (
//             <Link
//               href={`/category/${category.slug}`}
//               key={category.slug}
//               className="group relative flex min-h-40 flex-col overflow-hidden rounded-[20px] border border-[#dce6df] bg-white p-4 transition hover:-translate-y-1 hover:border-[#9dbca9] hover:shadow-[0_20px_50px_#183a3012] sm:min-h-44 sm:p-5"
//             >
//               <span className="absolute right-4 top-3 font-serif text-5xl text-[#edf3ee] transition group-hover:text-[#e3eee6]">
//                 0{index + 1}
//               </span>
//               <span className="relative grid h-10 w-10 place-items-center rounded-xl bg-[#e8f0ea] text-xl">
//                 {category.emoji}
//               </span>
//               <h3 className="relative mt-4 font-serif text-lg leading-6 text-[#183a30] sm:text-xl">{category.name}</h3>
//               <p className="relative mt-1 flex-1 text-xs leading-5 text-[#65776f]">{category.description}</p>
//               <span className="relative mt-3 inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[.12em] text-[#287052] sm:text-xs">
//                 Browse listings <ArrowDownRight size={15} className="transition group-hover:translate-x-1 group-hover:translate-y-1" />
//               </span>
//             </Link>
//           ))}
//         </div>
//         <Link href="/categories" className="btn-secondary mt-5 sm:hidden">
//           All categories <ArrowRight size={15} />
//         </Link>
//       </section>

//       <section className="bg-[#edf3ee] py-16 sm:py-20">
//         <div className="container-shell">
//           <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between sm:gap-5">
//             <div>
//               <p className="eyebrow">Marketplace examples</p>
//               <h2 className="section-title mt-3">Poultry Listings</h2>
//               <p className="mt-3 max-w-xl text-sm leading-6 text-[#65776f]">
//                 Example listings show how buyers can discover poultry products. Confirm all listing information directly with the seller.
//               </p>
//             </div>
//             <Link href="/products" className="btn-secondary hidden shrink-0 sm:inline-flex">
//               Browse all listings <ArrowRight size={15} />
//             </Link>
//           </div>
//           <PoultryListingGrid />
//           <Link href="/products" className="btn-secondary mt-6 sm:hidden">
//             Browse all listings <ArrowRight size={15} />
//           </Link>
//         </div>
//       </section>

//       <section className="container-shell py-16 sm:py-20">
//         <div className="mb-8 max-w-2xl">
//           <p className="eyebrow">Discover more from SMS</p>
//           <h2 className="section-title mt-3">Explore our other stores</h2>
//           <p className="mt-3 text-sm leading-6 text-[#65776f]">
//             Browse our food, wellness, beauty and pet collections on our partner sites, opening in a new tab.
//           </p>
//         </div>
//         <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
//           {sisterStores.map((store, index) => (
//             <a
//               key={store.name}
//               href={store.href}
//               target="_blank"
//               rel="noopener noreferrer"
//               aria-label={`${store.name} — ${store.category} (opens in a new tab)`}
//               className="group flex min-h-28 items-center gap-4 rounded-2xl border border-[#dce6df] bg-white p-5 transition hover:-translate-y-1 hover:border-[#9dbca9] hover:shadow-[0_16px_38px_#183a3010] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#287052]"
//             >
//               <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-[#e8f0ea] text-2xl">
//                 {store.icon}
//               </span>
//               <span className="min-w-0 flex-1">
//                 <span className="block text-[10px] font-semibold uppercase tracking-[.15em] text-[#7b8c83]">
//                   Collection 0{index + 1}
//                 </span>
//                 <span className="mt-1 block font-serif text-xl text-[#183a30]">{store.name}</span>
//                 <span className="mt-1 block text-xs leading-5 text-[#65776f]">{store.category}</span>
//               </span>
//               <ArrowUpRight size={18} className="shrink-0 text-[#287052] transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
//             </a>
//           ))}
//         </div>
//       </section>

//       <section className="container-shell py-16 sm:py-20">
//         <div className="relative overflow-hidden rounded-[30px] bg-[#153d32] px-7 py-10 text-white sm:px-12 sm:py-14">
//           <div className="pointer-events-none absolute -right-2 -top-32 h-96 w-96 rounded-full border border-white/10" />
//           <div className="pointer-events-none absolute -right-2 -top-20 h-64 w-64 rounded-full border border-white/10" />
//           <div className="relative max-w-2xl">
//             <p className="eyebrow text-[#b8d5c3]">For farms, buyers and sellers</p>
//             <h2 className="mt-3 font-serif text-3xl font-normal leading-tight sm:text-5xl">
//               Better poultry trade starts with the right connection.
//             </h2>
//             <p className="mt-4 max-w-xl text-sm leading-6 text-white/70">
//               Looking to source birds, offer a poultry listing or ask about a product? Talk with our team about your requirements.
//             </p>
//             <Link href="/contact" className="btn-primary mt-7">
//               Discuss a listing <ArrowRight size={15} />
//             </Link>
//           </div>
//         </div>
//       </section>
//     </>
//   );
// }



"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  BadgeCheck,
  ChevronLeft,
  ChevronRight,
  Compass,
  ExternalLink,
  Handshake,
  Layers,
  PackageSearch,
  Sparkles,
  Store,
  Truck,
} from "lucide-react";
import { shopCategories } from "@/lib/catalog";
import HomeHero from "@/components/HomeHero";
import PoultryListingGrid from "@/components/PoultryListingGrid";

const assurances = [
  {
    icon: PackageSearch,
    title: "Purpose-built listings",
    text: "Browse poultry, birds, hatching eggs and chicks in one focused marketplace.",
  },
  {
    icon: BadgeCheck,
    title: "Details that matter",
    text: "Review seller-provided breed, batch, health and availability information.",
  },
  {
    icon: Handshake,
    title: "Direct connections",
    text: "Connect with sellers to confirm terms and suitability before you buy.",
  },
  {
    icon: Truck,
    title: "Plan fulfilment",
    text: "Discuss transport, handling and delivery arrangements with the seller.",
  },
];

const sisterStores = [
  {
    name: "SMS Ovanest",
    category: "Eggs & Egg-Based Foods",
    icon: "🥚",
    href: "https://www.flipkart.com/",
    accent: "from-amber-500/15 via-orange-500/5 to-transparent",
    badge: "Farm Eggs & Meals",
  },
  {
    name: "SMS Claude Kitchen",
    category: "Ready-to-Eat & Ready-to-Cook Foods",
    icon: "🍲",
    href: "https://www.amazon.in/",
    accent: "from-rose-500/15 via-amber-500/5 to-transparent",
    badge: "Chef Prepared",
  },
  {
    name: "SMS Raw Chicken",
    category: "Raw Chicken & Meat",
    icon: "🍗",
    href: "https://www.bigbasket.com/",
    accent: "from-red-600/15 via-orange-500/5 to-transparent",
    badge: "Cold-Chain Cuts",
  },
  {
    name: "SMS Beauty",
    category: "Supplements & Personal Care",
    icon: "🧴",
    href: "https://www.1mg.com/",
    accent: "from-emerald-500/15 via-teal-500/5 to-transparent",
    badge: "Daily Wellness",
  },
  {
    name: "SMS Grow Naturally",
    category: "Skincare & Beauty",
    icon: "▪️",
    href: "https://www.nykaa.com/",
    accent: "from-lime-600/15 via-emerald-500/5 to-transparent",
    badge: "Clean Botanicals",
  },
  {
    name: "SMS Pet Grow Care",
    category: "Pet Products",
    icon: "🐾",
    href: "https://headsupfortails.com/",
    accent: "from-sky-500/15 via-indigo-500/5 to-transparent",
    badge: "Pet Essentials",
  },
];

const tradeHighlights = [
  {
    step: "01",
    tag: "Verified Sourcing",
    title: "Breed & Batch Transparency",
    detail:
      "Every poultry, chick, and hatching egg listing highlights age, lineage, vaccination status, and farm origin.",
  },
  {
    step: "02",
    tag: "Direct Farm Trade",
    title: "Zero Middleman Confusion",
    detail:
      "Communicate directly with verified breeders and farms to lock batch quantities, health checks, and pickup slots.",
  },
  {
    step: "03",
    tag: "Safe Livestock Transit",
    title: "Handled With Care",
    detail:
      "Coordinate ventilated livestock transport and temperature-controlled packaging tailored to your location.",
  },
];

const ctaSlides = [
  {
    id: 1,
    eyebrow: "For farms, buyers and sellers",
    title: "Better poultry trade starts with the right connection.",
    description:
      "Looking to source birds, offer a poultry listing or ask about a product? Talk with our team about your requirements.",
    primaryCta: { label: "Discuss a listing", href: "/contact" },
    secondaryCta: { label: "Explore listings", href: "/products" },
    statBadge: "Direct Farm Network",
    statTitle: "Verified Breeders & Buyers",
    statDetail: "Transparent breed, batch & health records before you commit.",
  },
  {
    id: 2,
    eyebrow: "Bulk Chicks & Hatching Eggs",
    title: "Scale your poultry farm with certified batch supply.",
    description:
      "Book vaccinated day-old chicks, grower birds, and fertile Kadaknath or layer hatching eggs with scheduled farm-gate delivery.",
    primaryCta: { label: "Request bulk quote", href: "/wholesale" },
    secondaryCta: { label: "View livestock", href: "/category/farming-livestock" },
    statBadge: "Vet Certified Batches",
    statTitle: "High Hatchability & Health Logs",
    statDetail: "Coordinated ventilated transport tailored to your farm location.",
  },
  {
    id: 3,
    eyebrow: "Cold-Chain Meat & Daily Eggs",
    title: "Consistent supply for kitchens, retailers & partners.",
    description:
      "Source antibiotic-free fresh chicken cuts, omega-3 brown eggs, and chilled ready-to-cook products with strict 0–4°C handling.",
    primaryCta: { label: "Partner with us", href: "/contact" },
    secondaryCta: { label: "Browse fresh cuts", href: "/category/raw-meat" },
    statBadge: "0–4°C Cold-Chain",
    statTitle: "Slot-Based Express Fulfilment",
    statDetail: "Hygienic vacuum-sealed packs dispatched fresh on schedule.",
  },
];

export default function Home() {
  const [highlightIdx, setHighlightIdx] = useState(0);
  const [hoveredStore, setHoveredStore] = useState<number | null>(null);
  const [ctaIdx, setCtaIdx] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setCtaIdx((prev) => (prev + 1) % ctaSlides.length);
    }, 5500);
    return () => window.clearInterval(timer);
  }, []);

  const prevHighlight = () =>
    setHighlightIdx(
      (prev) => (prev - 1 + tradeHighlights.length) % tradeHighlights.length
    );
  const nextHighlight = () =>
    setHighlightIdx((prev) => (prev + 1) % tradeHighlights.length);
  const prevCta = () =>
    setCtaIdx((prev) => (prev - 1 + ctaSlides.length) % ctaSlides.length);
  const nextCta = () => setCtaIdx((prev) => (prev + 1) % ctaSlides.length);

  const activeCta = ctaSlides[ctaIdx];

  return (
    <div className="bg-[#F7F5EF] text-[#202824] overflow-x-hidden">
      {/* 1. Hero Section */}
      <HomeHero />

      {/* 2. Assurances Bar */}
      <section className="relative z-10 border-y border-[#123C32]/10 bg-white/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid gap-4 py-7 sm:grid-cols-2 lg:grid-cols-4">
          {assurances.map(({ icon: Icon, title, text }, idx) => (
            <motion.article
              key={title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: idx * 0.08 }}
              whileHover={{ y: -3 }}
              className="group flex items-start gap-3.5 p-4 rounded-2xl border border-transparent hover:border-[#123C32]/10 hover:bg-[#F7F5EF] transition-all duration-300"
            >
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-[#123C32] text-[#D9A65A] shadow-sm group-hover:scale-105 transition-transform">
                <Icon size={20} strokeWidth={1.8} />
              </span>
              <div>
                <h2 className="text-sm font-bold text-[#123C32]">{title}</h2>
                <p className="mt-1 text-xs leading-5 text-[#202824]/70">
                  {text}
                </p>
              </div>
            </motion.article>
          ))}
        </div>
      </section>

{/* 3. Shop by Category (Richly Animated & Compact Cards) */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"
        >
          <div>
            <motion.div
              initial={{ opacity: 0, x: -12 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#123C32]/8 border border-[#123C32]/15 text-[11px] font-bold uppercase tracking-[0.16em] text-[#123C32]"
            >
              <motion.span
                animate={{ rotate: [0, 15, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              >
                <Layers className="w-3.5 h-3.5 text-[#D9A65A]" />
              </motion.span>
              For farms, homes & pets
            </motion.div>
            <h2 className="mt-2 font-serif text-2xl sm:text-4xl font-bold text-[#123C32] tracking-tight">
              Shop by category
            </h2>
            <p className="mt-2 max-w-xl text-xs sm:text-sm leading-5 text-[#202824]/70">
              Shop eggs, prepared foods, fresh meat, supplements, skincare, beauty, pet products and rabbits.
            </p>
          </div>

          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            <Link
              href="/categories"
              className="hidden sm:inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#123C32] text-[#F7F5EF] text-xs font-bold hover:bg-[#1a5244] transition-all shadow-sm"
            >
              All categories{" "}
              <ArrowRight
                size={14}
                className="text-[#D9A65A] transition-transform group-hover:translate-x-1"
              />
            </Link>
          </motion.div>
        </motion.div>

        {/* Animated Staggered Grid */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-40px" }}
          variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren: 0.08,
              },
            },
          }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4"
        >
          {shopCategories.map((category, index) => (
            <motion.div
              key={category.slug}
              variants={{
                hidden: { opacity: 0, y: 24, scale: 0.96 },
                visible: {
                  opacity: 1,
                  y: 0,
                  scale: 1,
                  transition: {
                    type: "spring",
                    stiffness: 260,
                    damping: 22,
                  },
                },
              }}
              whileHover={{ y: -6, scale: 1.015 }}
              whileTap={{ scale: 0.98 }}
              onMouseMove={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                e.currentTarget.style.setProperty(
                  "--mouse-x",
                  `${e.clientX - rect.left}px`
                );
                e.currentTarget.style.setProperty(
                  "--mouse-y",
                  `${e.clientY - rect.top}px`
                );
              }}
              className="group relative rounded-2xl"
            >
              <Link
                href={`/category/${category.slug}`}
                className="relative flex h-full flex-col justify-between overflow-hidden rounded-2xl border border-[#123C32]/12 bg-white p-4 sm:p-5 transition-colors duration-300 hover:bg-[#123C32] hover:border-[#D9A65A]/60 shadow-sm hover:shadow-[0_20px_40px_rgba(18,60,50,0.2)]"
              >
                {/* Cursor-Following Radial Spotlight */}
                <div
                  className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{
                    background:
                      "radial-gradient(240px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(217, 166, 90, 0.22), transparent 70%)",
                  }}
                />

                {/* Top Row: Animated Emoji Emblem + Index Badge */}
                <div className="relative z-10 flex items-center justify-between gap-2">
                  <motion.div
                    whileHover={{ rotate: [0, -12, 12, 0], scale: 1.15 }}
                    transition={{ duration: 0.4 }}
                    className="grid h-10 w-10 sm:h-11 sm:w-11 place-items-center rounded-xl bg-[#E5EDE6] text-lg sm:text-xl transition-colors duration-300 group-hover:bg-[#D9A65A]/20"
                  >
                    {category.emoji}
                  </motion.div>

                  <span className="px-2.5 py-0.5 rounded-full font-mono text-[11px] font-bold bg-[#F7F5EF] text-[#123C32]/65 group-hover:bg-white/10 group-hover:text-[#D9A65A] transition-colors">
                    0{index + 1}
                  </span>
                </div>

                {/* Middle Content */}
                <div className="relative z-10 mt-4">
                  <h3 className="font-serif text-base sm:text-lg font-bold leading-snug text-[#123C32] transition-colors group-hover:text-[#F7F5EF]">
                    {category.name}
                  </h3>
                  <p className="mt-1 text-xs leading-relaxed text-[#202824]/70 line-clamp-2 transition-colors group-hover:text-[#F7F5EF]/80">
                    {category.description}
                  </p>
                </div>

                {/* Bottom Compact Action Row + Animated Gold Slide Line */}
                <div className="relative z-10 mt-4 pt-3 border-t border-[#123C32]/10 group-hover:border-white/15 flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#123C32] group-hover:text-[#D9A65A] transition-colors">
                    Browse
                  </span>

                  <span className="grid h-7 w-7 place-items-center rounded-full bg-[#E5EDE6] text-[#123C32] transition-all duration-300 group-hover:bg-[#D9A65A] group-hover:text-[#202824] group-hover:rotate-[-45deg]">
                    <ArrowDownRight size={14} />
                  </span>
                </div>

                {/* Bottom Animated Gold Progress Accent Bar */}
                <span className="absolute bottom-0 left-0 h-1 w-0 bg-gradient-to-r from-[#D9A65A] via-[#f0c784] to-[#D9A65A] transition-all duration-500 ease-out group-hover:w-full" />
              </Link>
            </motion.div>
          ))}
        </motion.div>

        <Link
          href="/categories"
          className="mt-5 w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-[#123C32] text-[#F7F5EF] text-xs font-bold sm:hidden"
        >
          All categories <ArrowRight size={14} className="text-[#D9A65A]" />
        </Link>
      </section>

      {/* 4. Poultry Listings Section */}
      <section className="bg-[#E5EDE6]/70 border-y border-[#123C32]/10 py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"
          >
            <div>
              <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.18em] text-[#123C32]/70">
                <Sparkles className="w-3.5 h-3.5 text-[#D9A65A]" />
                Marketplace examples
              </span>
              <h2 className="mt-2 font-serif text-3xl sm:text-5xl font-bold text-[#123C32]">
                Poultry Listings
              </h2>
              <p className="mt-3 max-w-xl text-sm sm:text-base leading-6 text-[#202824]/75">
                Example listings show how buyers can discover poultry products.
                Confirm all listing information directly with the seller.
              </p>
            </div>

            <Link
              href="/products"
              className="hidden sm:inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-white border border-[#123C32]/15 text-[#123C32] text-sm font-bold hover:bg-[#123C32] hover:text-[#F7F5EF] transition-all shadow-sm"
            >
              Browse all listings <ArrowRight size={16} />
            </Link>
          </motion.div>

          <PoultryListingGrid />

          <Link
            href="/products"
            className="mt-6 w-full inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl bg-[#123C32] text-[#F7F5EF] text-sm font-semibold sm:hidden"
          >
            Browse all listings <ArrowRight size={16} className="text-[#D9A65A]" />
          </Link>
        </div>
      </section>

      {/* 5. Explore Our Other Stores (Architectural Brand Ecosystem Deck) */}
      <section className="relative py-16 sm:py-24 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-[2.25rem] sm:rounded-[3rem] bg-[#123C32] text-[#F7F5EF] p-6 sm:p-12 lg:p-16 relative overflow-hidden shadow-2xl">
            <div className="pointer-events-none absolute -top-28 -right-28 w-96 h-96 rounded-full border border-[#D9A65A]/15" />
            <div className="pointer-events-none absolute -bottom-36 -left-24 w-96 h-96 rounded-full bg-[#D9A65A]/10 blur-3xl" />

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="relative z-10 flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10 sm:mb-12"
            >
              <div className="max-w-2xl">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-[#D9A65A]/35 text-xs font-bold uppercase tracking-[0.18em] text-[#D9A65A]">
                  <Store className="w-3.5 h-3.5" />
                  Discover more from SMS
                </div>
                <h2 className="mt-3 font-serif text-3xl sm:text-5xl font-bold text-white leading-tight">
                  Explore our other stores
                </h2>
                <p className="mt-3 text-sm sm:text-base leading-6 text-[#F7F5EF]/75">
                  Browse our food, wellness, beauty and pet collections on our
                  partner sites, opening in a new tab.
                </p>
              </div>

              <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#D9A65A] bg-white/5 px-4 py-2.5 rounded-2xl border border-white/10 self-start lg:self-auto">
                <Compass className="w-4 h-4" />
                <span>6 Official SMS Storefronts</span>
              </div>
            </motion.div>

            <div className="relative z-10 grid gap-4 sm:gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {sisterStores.map((store, index) => {
                const isHovered = hoveredStore === index;
                return (
                  <motion.a
                    key={store.name}
                    href={store.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    onMouseEnter={() => setHoveredStore(index)}
                    onMouseLeave={() => setHoveredStore(null)}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.45, delay: index * 0.06 }}
                    whileHover={{ y: -6 }}
                    aria-label={`${store.name} — ${store.category} (opens in a new tab)`}
                    className="group relative flex flex-col justify-between rounded-[1.75rem] border border-white/15 bg-white/[0.06] backdrop-blur-md p-6 transition-all duration-300 hover:bg-[#F7F5EF] hover:border-[#D9A65A] hover:shadow-[0_24px_50px_rgba(0,0,0,0.3)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D9A65A]"
                  >
                    <div
                      className={`pointer-events-none absolute inset-0 rounded-[1.75rem] bg-gradient-to-br ${store.accent} opacity-70 group-hover:opacity-0 transition-opacity`}
                    />

                    <div className="relative flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3.5">
                        <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-white/10 text-2xl sm:text-3xl border border-white/15 transition-all duration-300 group-hover:bg-[#123C32] group-hover:scale-110 group-hover:rotate-3">
                          {store.icon}
                        </span>
                        <div>
                          <span className="block text-[10px] font-bold uppercase tracking-[0.16em] text-[#D9A65A] group-hover:text-[#123C32]/60">
                            Collection 0{index + 1}
                          </span>
                          <span className="mt-1 inline-block px-2.5 py-0.5 rounded-full bg-white/10 text-[11px] font-semibold text-[#F7F5EF]/90 group-hover:bg-[#E5EDE6] group-hover:text-[#123C32]">
                            {store.badge}
                          </span>
                        </div>
                      </div>

                      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-white/10 text-[#D9A65A] transition-all duration-300 group-hover:bg-[#123C32] group-hover:text-[#D9A65A]">
                        <ArrowUpRight
                          size={18}
                          className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                        />
                      </span>
                    </div>

                    <div className="relative mt-7">
                      <h3 className="font-serif text-xl sm:text-2xl font-bold text-white group-hover:text-[#123C32] transition-colors">
                        {store.name}
                      </h3>
                      <p className="mt-1.5 text-xs sm:text-sm leading-5 text-[#F7F5EF]/75 group-hover:text-[#202824]/75 transition-colors">
                        {store.category}
                      </p>
                    </div>

                    <div className="relative mt-6 pt-3.5 border-t border-white/10 group-hover:border-[#123C32]/10 flex items-center justify-between text-xs font-bold">
                      <span className="text-[#D9A65A] group-hover:text-[#123C32] uppercase tracking-wider">
                        {isHovered ? "Open Partner Store" : "Visit Storefront"}
                      </span>
                      <ExternalLink
                        size={14}
                        className="text-white/50 group-hover:text-[#123C32] transition-colors"
                      />
                    </div>
                  </motion.a>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* 6. Interactive Trade & Fulfilment Slider Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-14">
        <div className="rounded-3xl bg-white border border-[#123C32]/10 p-6 sm:p-10 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-[0.18em] text-[#123C32]/60">
                How SMS Trade Works
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#123C32] mt-1">
                Transparent Farm-to-Buyer Workflow
              </h3>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={prevHighlight}
                aria-label="Previous step"
                className="w-10 h-10 rounded-full border border-[#123C32]/15 flex items-center justify-center text-[#123C32] hover:bg-[#123C32] hover:text-white transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={nextHighlight}
                aria-label="Next step"
                className="w-10 h-10 rounded-full border border-[#123C32]/15 flex items-center justify-center text-[#123C32] hover:bg-[#123C32] hover:text-white transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            {tradeHighlights.map((item, i) => {
              const isActive = i === highlightIdx;
              return (
                <motion.div
                  key={item.step}
                  onClick={() => setHighlightIdx(i)}
                  animate={{ scale: isActive ? 1.02 : 1 }}
                  className={`cursor-pointer p-6 rounded-2xl border transition-all ${
                    isActive
                      ? "bg-[#123C32] text-[#F7F5EF] border-[#123C32] shadow-lg"
                      : "bg-[#F7F5EF]/60 text-[#202824] border-[#123C32]/10 hover:bg-[#E5EDE6]/60"
                  }`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <span
                      className={`text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full ${
                        isActive
                          ? "bg-[#D9A65A] text-[#202824]"
                          : "bg-[#E5EDE6] text-[#123C32]"
                      }`}
                    >
                      {item.tag}
                    </span>
                    <span
                      className={`font-serif text-2xl font-bold ${
                        isActive ? "text-[#D9A65A]" : "text-[#123C32]/30"
                      }`}
                    >
                      {item.step}
                    </span>
                  </div>
                  <h4 className="font-serif text-xl font-bold">{item.title}</h4>
                  <p
                    className={`mt-2 text-xs sm:text-sm leading-relaxed ${
                      isActive ? "text-[#F7F5EF]/80" : "text-[#202824]/70"
                    }`}
                  >
                    {item.detail}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 7. Premium Animated Bottom CTA Slider */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 sm:pb-24">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-[2.25rem] sm:rounded-[2.75rem] bg-[#123C32] px-6 py-10 text-[#F7F5EF] sm:px-12 sm:py-14 lg:px-16 lg:py-16 shadow-2xl border border-[#D9A65A]/20"
        >
          <div className="pointer-events-none absolute -right-10 -top-32 h-96 w-96 rounded-full border border-[#D9A65A]/20" />
          <div className="pointer-events-none absolute -right-4 -top-20 h-64 w-64 rounded-full border border-[#D9A65A]/20" />
          <motion.div
            animate={{ scale: [1, 1.15, 1], opacity: [0.15, 0.28, 0.15] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
            className="pointer-events-none absolute -bottom-28 left-1/3 h-80 w-80 rounded-full bg-[#D9A65A] blur-3xl"
          />

          <div className="relative z-10 grid lg:grid-cols-12 gap-8 lg:gap-10 items-center min-h-[260px]">
            <div className="lg:col-span-7">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeCta.id}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -18 }}
                  transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
                >
                  <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 border border-[#D9A65A]/35 text-[11px] sm:text-xs font-bold uppercase tracking-[0.2em] text-[#D9A65A]">
                    <Sparkles className="w-3.5 h-3.5" />
                    {activeCta.eyebrow}
                  </span>

                  <h2 className="mt-4 font-serif text-3xl sm:text-5xl font-bold leading-[1.12] text-white">
                    {activeCta.title}
                  </h2>

                  <p className="mt-4 max-w-xl text-sm sm:text-base leading-6 text-[#F7F5EF]/80">
                    {activeCta.description}
                  </p>

                  <div className="mt-8 flex flex-wrap items-center gap-3.5">
                    <Link
                      href={activeCta.primaryCta.href}
                      className="inline-flex items-center gap-2.5 rounded-2xl bg-[#D9A65A] px-7 py-4 text-sm sm:text-base font-bold text-[#202824] shadow-lg hover:bg-[#e5b56d] transition-all"
                    >
                      {activeCta.primaryCta.label} <ArrowRight size={18} />
                    </Link>

                    <Link
                      href={activeCta.secondaryCta.href}
                      className="inline-flex items-center gap-2 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/15 px-6 py-4 text-sm sm:text-base font-semibold text-[#F7F5EF] transition-all"
                    >
                      {activeCta.secondaryCta.label}
                    </Link>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="lg:col-span-5">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeCta.id}
                  initial={{ opacity: 0, scale: 0.95, x: 16 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.95, x: -16 }}
                  transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
                  className="rounded-3xl bg-white/[0.08] backdrop-blur-xl border border-white/15 p-6 sm:p-8 shadow-xl space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 rounded-full bg-[#D9A65A] text-[#202824] text-[11px] font-extrabold uppercase tracking-wider">
                      {activeCta.statBadge}
                    </span>
                    <span className="font-mono text-xs font-bold text-[#D9A65A]">
                      0{ctaIdx + 1} / 0{ctaSlides.length}
                    </span>
                  </div>

                  <h3 className="font-serif text-xl sm:text-2xl font-bold text-white pt-1">
                    {activeCta.statTitle}
                  </h3>

                  <p className="text-xs sm:text-sm leading-relaxed text-[#F7F5EF]/75">
                    {activeCta.statDetail}
                  </p>

                  <div className="pt-2">
                    <div className="h-1 w-full rounded-full bg-white/15 overflow-hidden">
                      <motion.div
                        key={ctaIdx}
                        initial={{ width: "0%" }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 5.5, ease: "linear" }}
                        className="h-full bg-[#D9A65A]"
                      />
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          <div className="relative z-10 mt-8 pt-6 border-t border-white/10 flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              {ctaSlides.map((s, idx) => (
                <button
                  key={s.id}
                  onClick={() => setCtaIdx(idx)}
                  aria-label={`Go to slide ${idx + 1}`}
                  aria-pressed={ctaIdx === idx}
                  className={`h-2.5 rounded-full transition-all duration-300 ${
                    ctaIdx === idx
                      ? "w-9 bg-[#D9A65A]"
                      : "w-2.5 bg-white/25 hover:bg-white/50"
                  }`}
                />
              ))}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={prevCta}
                aria-label="Previous slide"
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-[#D9A65A] hover:text-[#202824] flex items-center justify-center transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={nextCta}
                aria-label="Next slide"
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-[#D9A65A] hover:text-[#202824] flex items-center justify-center transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
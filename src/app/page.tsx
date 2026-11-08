import Link from "next/link";
import { ArrowDownRight, ArrowRight, ArrowUpRight, BadgeCheck, Handshake, PackageSearch, Truck } from "lucide-react";
import { shopCategories } from "@/lib/catalog";
import HomeHero from "@/components/HomeHero";
import PoultryListingGrid from "@/components/PoultryListingGrid";

const assurances = [
  { icon: PackageSearch, title: "Purpose-built listings", text: "Browse poultry, birds, hatching eggs and chicks in one focused marketplace." },
  { icon: BadgeCheck, title: "Details that matter", text: "Review seller-provided breed, batch, health and availability information." },
  { icon: Handshake, title: "Direct connections", text: "Connect with sellers to confirm terms and suitability before you buy." },
  { icon: Truck, title: "Plan fulfilment", text: "Discuss transport, handling and delivery arrangements with the seller." },
];

const sisterStores = [
  { name: "SMS Egg Store", category: "Eggs & Egg-Based Foods", icon: "🥚", href: "https://www.flipkart.com/" },
  { name: "SMS Kitchen", category: "Ready-to-Eat & Ready-to-Cook Foods", icon: "🍲", href: "https://www.amazon.in/" },
  { name: "SMS Fresh Cuts", category: "Raw Chicken & Meat", icon: "🍗", href: "https://www.bigbasket.com/" },
  { name: "SMS NutriLife", category: "Supplements & Personal Care", icon: "🧴", href: "https://www.1mg.com/" },
  { name: "SMS Glow & Care", category: "Skincare & Beauty", icon: "▪️", href: "https://www.nykaa.com/" },
  { name: "SMS Paw & Farm", category: "Pet Products", icon: "🐾", href: "https://headsupfortails.com/" },
];

export default function Home() {
  return (
    <>
      <HomeHero />

      <section className="border-b border-[#dce6df] bg-white">
        <div className="container-shell grid gap-5 py-6 sm:grid-cols-2 lg:grid-cols-4">
          {assurances.map(({ icon: Icon, title, text }) => (
            <article key={title} className="flex items-start gap-3">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#e8f0ea] text-[#23634e]">
                <Icon size={18} strokeWidth={1.7} />
              </span>
              <div>
                <h2 className="text-sm font-semibold text-[#183a30]">{title}</h2>
                <p className="mt-1 text-xs leading-5 text-[#65776f]">{text}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="container-shell py-16 sm:py-20">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between sm:gap-5">
          <div>
            <p className="eyebrow">Built around poultry trade</p>
            <h2 className="section-title mt-3">Shop by category</h2>
            <p className="mt-3 max-w-xl text-sm leading-6 text-[#65776f]">
              Find hatching eggs, live birds, chicks and poultry listings made for buyers and sellers.
            </p>
          </div>
          <Link href="/categories" className="btn-secondary hidden shrink-0 sm:inline-flex">
            All categories <ArrowRight size={15} />
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {shopCategories.map((category, index) => (
            <Link
              href={`/category/${category.slug}`}
              key={category.slug}
              className="group relative flex min-h-40 flex-col overflow-hidden rounded-[20px] border border-[#dce6df] bg-white p-4 transition hover:-translate-y-1 hover:border-[#9dbca9] hover:shadow-[0_20px_50px_#183a3012] sm:min-h-44 sm:p-5"
            >
              <span className="absolute right-4 top-3 font-serif text-5xl text-[#edf3ee] transition group-hover:text-[#e3eee6]">
                0{index + 1}
              </span>
              <span className="relative grid h-10 w-10 place-items-center rounded-xl bg-[#e8f0ea] text-xl">
                {category.emoji}
              </span>
              <h3 className="relative mt-4 font-serif text-lg leading-6 text-[#183a30] sm:text-xl">{category.name}</h3>
              <p className="relative mt-1 flex-1 text-xs leading-5 text-[#65776f]">{category.description}</p>
              <span className="relative mt-3 inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[.12em] text-[#287052] sm:text-xs">
                Browse listings <ArrowDownRight size={15} className="transition group-hover:translate-x-1 group-hover:translate-y-1" />
              </span>
            </Link>
          ))}
        </div>
        <Link href="/categories" className="btn-secondary mt-5 sm:hidden">
          All categories <ArrowRight size={15} />
        </Link>
      </section>

      <section className="bg-[#edf3ee] py-16 sm:py-20">
        <div className="container-shell">
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between sm:gap-5">
            <div>
              <p className="eyebrow">Marketplace examples</p>
              <h2 className="section-title mt-3">Poultry listings</h2>
              <p className="mt-3 max-w-xl text-sm leading-6 text-[#65776f]">
                Example listings show how buyers can discover poultry products. Confirm all listing information directly with the seller.
              </p>
            </div>
            <Link href="/products" className="btn-secondary hidden shrink-0 sm:inline-flex">
              Browse all listings <ArrowRight size={15} />
            </Link>
          </div>
          <PoultryListingGrid />
          <Link href="/products" className="btn-secondary mt-6 sm:hidden">
            Browse all listings <ArrowRight size={15} />
          </Link>
        </div>
      </section>

      <section className="container-shell py-16 sm:py-20">
        <div className="mb-8 max-w-2xl">
          <p className="eyebrow">Discover more from SMS</p>
          <h2 className="section-title mt-3">Explore our other stores</h2>
          <p className="mt-3 text-sm leading-6 text-[#65776f]">
            Browse our food, wellness, beauty and pet collections on our partner sites, opening in a new tab.
          </p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {sisterStores.map((store, index) => (
            <a
              key={store.name}
              href={store.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${store.name} — ${store.category} (opens in a new tab)`}
              className="group flex min-h-28 items-center gap-4 rounded-2xl border border-[#dce6df] bg-white p-5 transition hover:-translate-y-1 hover:border-[#9dbca9] hover:shadow-[0_16px_38px_#183a3010] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#287052]"
            >
              <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-[#e8f0ea] text-2xl">
                {store.icon}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[10px] font-semibold uppercase tracking-[.15em] text-[#7b8c83]">
                  Collection 0{index + 1}
                </span>
                <span className="mt-1 block font-serif text-xl text-[#183a30]">{store.name}</span>
                <span className="mt-1 block text-xs leading-5 text-[#65776f]">{store.category}</span>
              </span>
              <ArrowUpRight size={18} className="shrink-0 text-[#287052] transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </a>
          ))}
        </div>
      </section>

      <section className="container-shell py-16 sm:py-20">
        <div className="relative overflow-hidden rounded-[30px] bg-[#153d32] px-7 py-10 text-white sm:px-12 sm:py-14">
          <div className="pointer-events-none absolute -right-2 -top-32 h-96 w-96 rounded-full border border-white/10" />
          <div className="pointer-events-none absolute -right-2 -top-20 h-64 w-64 rounded-full border border-white/10" />
          <div className="relative max-w-2xl">
            <p className="eyebrow text-[#b8d5c3]">For farms, buyers and sellers</p>
            <h2 className="mt-3 font-serif text-3xl font-normal leading-tight sm:text-5xl">
              Better poultry trade starts with the right connection.
            </h2>
            <p className="mt-4 max-w-xl text-sm leading-6 text-white/70">
              Looking to source birds, offer a poultry listing or ask about a product? Talk with our team about your requirements.
            </p>
            <Link href="/contact" className="btn-primary mt-7">
              Discuss a listing <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

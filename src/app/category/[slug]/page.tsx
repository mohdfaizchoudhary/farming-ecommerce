import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { categories } from "@/lib/catalog";
import PoultryListingGrid from "@/components/PoultryListingGrid";

export function generateStaticParams() {
  return categories.map((category) => ({ slug: category.slug }));
}

export default function CategoryPage({ params }: { params: { slug: string } }) {
  const category = categories.find((entry) => entry.slug === params.slug);
  if (!category) return notFound();
  const subcategories = categories.filter((entry) => entry.parentSlug === category.slug);

  return (
    <div className="container-shell py-12 sm:py-16">
      <Link href="/categories" className="inline-flex items-center gap-2 text-sm text-[#65776f] transition hover:text-[#287052]">
        <ArrowLeft size={15} /> All categories
      </Link>
      <div className="mt-6 rounded-[28px] border border-[#dce6df] bg-white p-7 sm:p-10">
        <span className="grid h-14 w-14 place-items-center rounded-2xl bg-[#e8f0ea] text-3xl">{category.emoji}</span>
        <p className="eyebrow mt-6">Poultry marketplace</p>
        <h1 className="section-title mt-3">{category.name}</h1>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-[#65776f]">{category.description}</p>
      </div>

      {subcategories.length > 0 && (
        <section className="mt-8" aria-labelledby="subcategory-heading">
          <h2 id="subcategory-heading" className="font-serif text-2xl text-[#183a30]">Browse by type</h2>
          <div className="mt-4 flex flex-wrap gap-3">
            {subcategories.map((subcategory) => (
              <Link
                key={subcategory.slug}
                href={`/category/${subcategory.slug}`}
                className="inline-flex items-center gap-2 rounded-full border border-[#c8d6cc] bg-white px-4 py-2 text-sm text-[#183a30] transition hover:border-[#9dbca9] hover:bg-[#e8f0ea]"
              >
                <span aria-hidden="true">{subcategory.emoji}</span>
                {subcategory.name}
              </Link>
            ))}
          </div>
        </section>
      )}

      <div className="mb-5 mt-10 flex items-end justify-between gap-4">
        <div>
          <p className="eyebrow">Marketplace</p>
          <h2 className="mt-2 font-serif text-3xl text-[#183a30]">Available listings</h2>
        </div>
        <span className="text-xs text-[#65776f]">Seller listings</span>
      </div>
      <PoultryListingGrid category={category.slug} emptyMessage="There are no listings in this category yet. Contact us if you would like to list poultry here." />
      <p className="mt-8 text-xs leading-5 text-[#65776f]">
        Sample marketplace listings only. Confirm all listing details, prices, health records, availability and fulfilment directly with the seller.
      </p>
    </div>
  );
}

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { shopCategories } from "@/lib/catalog";

export default function Categories() {
  return (
    <div className="container-shell py-12 sm:py-16">
      <p className="eyebrow">SMS Farmstead marketplace</p>
      <h1 className="section-title mt-3">Poultry categories</h1>
      <p className="mt-4 max-w-2xl text-sm leading-7 text-[#65776f]">
        Browse listings for poultry and poultry-related trade. Review the details on each listing and confirm availability, health information and fulfilment terms with the seller.
      </p>

      <div className="mt-9 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {shopCategories.map((category, index) => (
          <Link
            href={`/category/${category.slug}`}
            key={category.slug}
            className="tile group flex min-h-40 flex-col p-4 sm:min-h-44 sm:p-5"
          >
            <div className="flex items-start justify-between">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-[#e8f0ea] text-xl">
                {category.emoji}
              </span>
              <span className="font-serif text-2xl text-[#dce6df]">0{index + 1}</span>
            </div>
            <h2 className="mt-4 font-serif text-lg leading-6 text-forest sm:text-xl">{category.name}</h2>
            <p className="mt-1 flex-1 text-xs leading-5 text-[#65776f]">{category.description}</p>
            <span className="mt-3 inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[.12em] text-[#287052] sm:text-xs">
              Browse listings <ArrowRight size={14} className="transition group-hover:translate-x-1" />
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}

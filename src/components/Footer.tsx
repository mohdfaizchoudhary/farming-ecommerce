"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Footer() {
  const pathname = usePathname();
  if (pathname.startsWith("/admin")) return null;

  return (
    <footer className="mt-12 bg-[#153d32] text-white">
      <div className="container-shell grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-[1.4fr_.8fr_.8fr] lg:py-16">
        <div>
          <p className="eyebrow text-[#b8d5c3]">Poultry marketplace</p>
          <h2 className="mt-3 font-serif text-2xl font-normal">SMS Farmstead</h2>
          <p className="mt-3 max-w-sm text-sm leading-6 text-white/60">
            A focused marketplace for poultry listings, hatching eggs, layer birds and chicks. Buyers and sellers can connect and confirm listing details directly.
          </p>
        </div>

        <div>
          <b className="eyebrow text-[#b8d5c3]">Explore</b>
          <div className="mt-4 grid gap-3 text-sm text-white/70 [&_a]:transition [&_a]:hover:text-white">
            <Link href="/">Home</Link>
            <Link href="/products">Poultry listings</Link>
            <Link href="/categories">Categories</Link>
            <Link href="/orders">My orders</Link>
          </div>
        </div>

        <div>
          <b className="eyebrow text-[#b8d5c3]">Information</b>
          <div className="mt-4 grid gap-3 text-sm text-white/70 [&_a]:transition [&_a]:hover:text-white">
            <Link href="/contact">Contact</Link>
            <Link href="/shipping-policy">Shipping policy</Link>
            <Link href="/returns-policy">Returns policy</Link>
            <Link href="/privacy-policy">Privacy policy</Link>
            <Link href="/terms">Terms</Link>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 py-4 text-center text-[10px] tracking-wide text-white/45">
        © {new Date().getFullYear()} SMS Farmstead · Poultry marketplace
      </div>
    </footer>
  );
}

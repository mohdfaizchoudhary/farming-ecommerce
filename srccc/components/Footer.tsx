// "use client";

// import Link from "next/link";
// import { ArrowRight, ArrowUpRight } from "lucide-react";
// import { usePathname } from "next/navigation";

// export default function Footer() {
//   const pathname = usePathname();
//   if (pathname.startsWith("/admin")) return null;

//   return (
//     <footer className="site-footer mt-16">
//       <div className="container-shell">
//         <div className="site-footer-callout">
//           <div>
//             <p className="eyebrow text-[#d9c39d]">A more connected farmstead</p>
//             <h2 className="mt-3 font-serif text-3xl font-normal leading-tight sm:text-4xl">
//               Good things grow when the right people connect.
//             </h2>
//           </div>
//           <Link href="/contact" className="site-footer-cta">
//             Talk to our team <ArrowRight size={16} />
//           </Link>
//         </div>
//       </div>

//       <div className="container-shell site-footer-main">
//         <div className="site-footer-brand">
//           <Link href="/" className="font-serif text-2xl tracking-tight text-white">SMS Farmstead</Link>
//           <p className="mt-4 max-w-sm text-sm leading-7 text-white/60">
//             A considered marketplace for poultry, hatching eggs, layer birds and chicks — bringing farms, breeders and buyers closer together.
//           </p>
//           <span className="site-footer-note">Farm-to-farm connections · Buy · Sell · Source</span>
//         </div>

//         <div>
//           <b className="site-footer-heading">Discover</b>
//           <div className="site-footer-links">
//             <Link href="/products">Shop listings</Link>
//             <Link href="/categories">Browse categories</Link>
//             <Link href="/orders">My orders</Link>
//             <Link href="/profile">My account</Link>
//           </div>
//         </div>

//         <div>
//           <b className="site-footer-heading">Here to help</b>
//           <div className="site-footer-links">
//             <Link href="/contact">Contact our team</Link>
//             <Link href="/shipping-policy">Shipping policy</Link>
//             <Link href="/returns-policy">Returns policy</Link>
//             <Link href="/wholesale">Wholesale</Link>
//           </div>
//         </div>

//         <div>
//           <b className="site-footer-heading">The details</b>
//           <div className="site-footer-links">
//             <Link href="/privacy-policy">Privacy policy</Link>
//             <Link href="/terms">Terms of service</Link>
//           </div>
//           <Link href="/products" className="site-footer-browse">
//             Explore the marketplace <ArrowUpRight size={15} />
//           </Link>
//         </div>
//       </div>

//       <div className="site-footer-bottom">
//         <div className="container-shell flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
//           <span>© {new Date().getFullYear()} SMS Farmstead. All rights reserved.</span>
//           <span>Thoughtful sourcing starts here.</span>
//         </div>
//       </div>
//     </footer>
//   );
// }



"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Mail, Phone, MapPin, ShieldCheck } from "lucide-react";
import { shopCategories } from "@/lib/catalog";

export default function Footer() {
  return (
    <footer className="bg-[#123C32] text-[#F7F5EF] mt-auto border-t border-[#D9A65A]/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <Image
                src="/sms-farmstead-logo.jpeg"
                alt="SMS Farmstead Ventures Pvt. Ltd."
                width={48}
                height={48}
                className="h-12 w-12 rounded-lg object-contain"
              />
              <span className="font-bold text-sm sm:text-base leading-tight">
                SMS Farmstead
                <small className="block text-xs font-semibold">Ventures Pvt. Ltd.</small>
              </span>
            </div>
            <p className="text-sm text-[#F7F5EF]/75 leading-relaxed">
              Multi-category farm, cold-chain food, personal care, and pet
              nutrition commerce engineered for quality and batch transparency.
            </p>
            <div className="inline-flex items-center gap-2 text-xs text-[#D9A65A] bg-[#F7F5EF]/5 px-3 py-2 rounded-xl border border-[#D9A65A]/20">
              <ShieldCheck className="w-4 h-4" />
              <span>Razorpay Secured • Cold-Chain Verified</span>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-bold text-sm uppercase tracking-wider text-[#D9A65A] mb-4">
              Categories
            </h4>
            <ul className="space-y-2.5 text-sm text-[#F7F5EF]/80">
              {shopCategories.map((category) => (
                <li key={category.slug}>
                  <Link href={`/category/${category.slug}`} className="hover:text-[#D9A65A]">{category.name}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Policies & Support */}
          <div>
            <h4 className="font-bold text-sm uppercase tracking-wider text-[#D9A65A] mb-4">
              Customer Policies
            </h4>
            <ul className="space-y-2.5 text-sm text-[#F7F5EF]/80">
              <li><Link href="/orders" className="hover:text-[#D9A65A]">Track Your Order</Link></li>
              <li><Link href="/shipping-policy" className="hover:text-[#D9A65A]">Shipping & Cold-Chain Policy</Link></li>
              <li><Link href="/returns-policy" className="hover:text-[#D9A65A]">Returns & Refund Policy</Link></li>
              <li><Link href="/privacy-policy" className="hover:text-[#D9A65A]">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-[#D9A65A]">Terms & Conditions</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold text-sm uppercase tracking-wider text-[#D9A65A] mb-4">
              Reach Us
            </h4>
            <ul className="space-y-3 text-sm text-[#F7F5EF]/80">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#D9A65A] shrink-0 mt-1" />
                <span>Agri-Logistics Hub, Sector 12, Uttar Pradesh, India</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#D9A65A] shrink-0" />
                <span>+91 98765 43210</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#D9A65A] shrink-0" />
                <Link href="/contact" className="hover:text-[#D9A65A]">Customer support</Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-[#F7F5EF]/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#F7F5EF]/60">
          <p>© {new Date().getFullYear()} SMS Farmstead Ventures Pvt. Ltd. All rights reserved.</p>
          <p>Designed for Mobile, Tablet & Desktop</p>
        </div>
      </div>
    </footer>
  );
}
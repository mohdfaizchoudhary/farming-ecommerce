// "use client";

// import Link from "next/link";
// import { usePathname } from "next/navigation";
// import { useState } from "react";
// import Image from "next/image";
// import { ArrowRight, Menu, Search, ShoppingBag, UserRound, X } from "lucide-react";
// import { useStore } from "@/components/StoreProvider";

// export default function Header() {
//   const pathname = usePathname();
//   const [open, setOpen] = useState(false);
//   const [closing, setClosing] = useState(false);
//   const { count } = useStore();

//   if (pathname.startsWith("/admin")) return null;

//   function closeMenu() {
//     setClosing(true);
//   }

//   return (
//     <header className="site-header sticky top-0 z-30">
//       <div className="site-promo">
//         <div className="container-shell site-promo-inner">
//           <span>Grown with care. Sourced with confidence.</span>
//           <span className="hidden sm:inline">A better connection to the farm</span>
//         </div>
//       </div>
//       <div className="container-shell site-header-inner">
//         <Link href="/" className="site-brand">
//           <Image
//             src="/sms-farmstead-logo.jpeg"
//             alt="SMS Farmstead"
//             width={52}
//             height={44}
//             priority
//             className="h-11 w-[52px] rounded-lg object-contain"
//           />
//           <span>
//             <b className="block font-serif text-[15px] font-semibold leading-5 tracking-tight sm:text-[19px]">SMS Farmstead</b>
//             <small className="mt-1 hidden text-[9px] font-semibold uppercase tracking-[.2em] text-[#65776f] min-[360px]:block">Farmstead marketplace</small>
//           </span>
//         </Link>

//         <form action="/products" className="site-search hidden max-w-[250px] flex-1 md:block">
//           <label className="sr-only" htmlFor="header-search">Search poultry listings</label>
//           <div className="relative">
//             <Search size={16} aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#65776f]" />
//             <input id="header-search" name="q" placeholder="Search the farmstead" className="field search-field h-10 border-transparent bg-[#f1f2eb] text-xs focus:border-[#e88445]" />
//           </div>
//         </form>

//         <nav aria-label="Main navigation" className="site-nav hidden lg:flex">
//           <Link href="/" aria-current={pathname === "/" ? "page" : undefined} className={pathname === "/" ? "is-active" : undefined}>Home</Link>
//           <Link href="/products" aria-current={pathname.startsWith("/products") ? "page" : undefined} className={pathname.startsWith("/products") ? "is-active" : undefined}>Shop listings</Link>
//           <Link href="/categories" aria-current={pathname.startsWith("/categories") ? "page" : undefined} className={pathname.startsWith("/categories") ? "is-active" : undefined}>Categories</Link>
//           <Link href="/contact" aria-current={pathname.startsWith("/contact") ? "page" : undefined} className={pathname.startsWith("/contact") ? "is-active" : undefined}>Sell with us</Link>
//         </nav>

//         <div className="site-header-actions">
//           <Link
//             href="/profile"
//             aria-label="My account"
//             className="site-icon-button hidden sm:grid"
//           >
//             <UserRound size={19} strokeWidth={1.7} />
//           </Link>

//           <Link
//             href="/cart"
//             aria-label="Shopping bag"
//             className="site-icon-button relative"
//           >
//             <ShoppingBag size={19} strokeWidth={1.7} />
//             {count > 0 && (
//               <span key={count} className="cart-count-enter absolute right-0 top-0 grid h-[17px] min-w-[17px] place-items-center rounded-full bg-[#e88445] px-1 text-[9px] font-semibold text-white">
//                 {count}
//               </span>
//             )}
//           </Link>

//           <button
//             type="button"
//             aria-label={open ? "Close navigation" : "Open navigation"}
//             aria-expanded={open}
//             className="site-icon-button lg:hidden"
//             onClick={() => {
//               if (open) closeMenu();
//               else {
//                 setClosing(false);
//                 setOpen(true);
//               }
//             }}
//           >
//             {open ? <X size={20} /> : <Menu size={20} />}
//           </button>
//         </div>
//       </div>

//       {open && (
//         <nav
//           aria-label="Mobile navigation"
//           className={`site-mobile-nav mobile-nav-enter lg:hidden ${closing ? "mobile-nav-exit" : ""}`}
//           onAnimationEnd={(event) => {
//             if (event.target === event.currentTarget && event.animationName === "mobile-nav-exit") {
//               setOpen(false);
//               setClosing(false);
//             }
//           }}
//         >
//           <form action="/products" className="site-mobile-search relative">
//             <label className="sr-only" htmlFor="mobile-search">Search poultry listings</label>
//             <Search size={16} aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#65776f]" />
//             <input id="mobile-search" name="q" placeholder="Search the farmstead" className="field search-field text-xs" />
//           </form>
//           <Link href="/" onClick={closeMenu}>Home <ArrowRight size={15} /></Link>
//           <Link href="/products" onClick={closeMenu}>Shop listings <ArrowRight size={15} /></Link>
//           <Link href="/categories" onClick={closeMenu}>Categories <ArrowRight size={15} /></Link>
//           <Link href="/contact" onClick={closeMenu}>Sell with us <ArrowRight size={15} /></Link>
//           <Link href="/profile" onClick={closeMenu}>My account <ArrowRight size={15} /></Link>
//         </nav>
//       )}
//     </header>
//   );
// }


"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingBag,
  Search,
  User,
  Menu,
  X,
  Heart,
  ChevronDown,
  Sparkles,
} from "lucide-react";
import { useStore } from "@/components/StoreProvider";
import { shopCategories } from "@/lib/catalog";

export default function Header() {
  const { count: cartCount, wishlist } = useStore();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  return (
    <>
      {/* Top Announcement Strip */}
      <div className="bg-[#123C32] text-[#F7F5EF] text-xs sm:text-sm py-2 px-4 text-center font-medium tracking-wide border-b border-[#D9A65A]/20">
        <span className="inline-flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-[#D9A65A]" />
          Farm-Fresh Cold-Chain Delivery • Free Shipping on Orders Above ₹999
        </span>
      </div>

      {/* Main Sticky Header */}
      <header
        className={`site-header sticky top-3 z-50 w-full max-w-none rounded-none transition-all duration-300 ${scrolled ? "py-1" : "py-2"}`}
      >
        <div className="site-header-inner w-full max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 flex items-center justify-between gap-1 sm:gap-4">
          {/* Left: Mobile Menu Trigger + Brand Logo */}
          <div className="flex items-center gap-1 sm:gap-3">
            <button
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open Navigation"
              className="lg:hidden p-1.5 sm:p-2 rounded-xl text-[#123C32] hover:bg-[#E5EDE6] transition-colors"
            >
              <Menu className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>

            <Link href="/" className="flex items-center gap-1.5 sm:gap-2.5 group">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="h-9 w-9 sm:h-11 sm:w-11 shrink-0 overflow-hidden rounded-xl bg-white shadow-sm"
              >
                <Image
                  src="/sms-farmstead-logo.jpeg"
                  alt="SMS Farmstead Ventures Pvt. Ltd."
                  width={44}
                  height={44}
                  priority
                  className="h-full w-full object-contain"
                />
              </motion.div>
              <div>
                <span className="font-bold text-xs sm:text-sm tracking-tight text-[#123C32] block leading-tight">
                  SMS Farmstead
                </span>
                <span className="text-[9px] sm:text-[10px] text-[#202824]/60 font-semibold">
                  Ventures Pvt. Ltd.
                </span>
              </div>
            </Link>
          </div>

          {/* Center: Desktop Category Navigation */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            <Link
              href="/products"
              className="px-3.5 py-2 rounded-full text-sm font-medium text-[#202824] hover:bg-[#E5EDE6] hover:text-[#123C32] transition-all"
            >
              All Products
            </Link>

            <div className="relative group">
              <button className="flex items-center gap-1.5 px-3.5 py-2 rounded-full text-sm font-medium text-[#202824] hover:bg-[#E5EDE6] hover:text-[#123C32] transition-all">
                Categories
                <ChevronDown className="w-4 h-4 transition-transform duration-300 group-hover:rotate-180" />
              </button>

              {/* Animated Mega Dropdown */}
              <div className="absolute left-0 top-full pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 translate-y-2 group-hover:translate-y-0 w-72">
                <div className="bg-[#F7F5EF] rounded-2xl p-2 shadow-2xl border border-[#123C32]/15 grid gap-1">
                  {shopCategories.map((cat) => (
                    <Link
                      key={cat.slug}
                      href={`/category/${cat.slug}`}
                      className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium text-[#202824] hover:bg-[#123C32] hover:text-[#F7F5EF] transition-colors"
                    >
                      <span>{cat.name}</span>
                      <span className="text-xs opacity-60">→</span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            <Link
              href="/wholesale"
              className="px-3.5 py-2 rounded-full text-sm font-medium text-[#202824] hover:bg-[#E5EDE6] hover:text-[#123C32] transition-all"
            >
              Wholesale
            </Link>
            <Link
              href="/orders"
              className="px-3.5 py-2 rounded-full text-sm font-medium text-[#202824] hover:bg-[#E5EDE6] hover:text-[#123C32] transition-all"
            >
              Track Order
            </Link>
          </nav>

          {/* Right: Search, Wishlist, Profile, Cart */}
          <div className="site-header-actions flex items-center gap-0 sm:gap-2.5">
            <motion.button
              whileTap={{ scale: 0.92 }}
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-1.5 sm:p-2.5 rounded-full text-[#202824] hover:bg-[#E5EDE6] hover:text-[#123C32] transition-colors"
              aria-label="Search"
            >
              <Search className="w-4 h-4 sm:w-5 sm:h-5" />
            </motion.button>

            <Link
              href="/wishlist"
              className="relative hidden sm:flex p-2.5 rounded-full text-[#202824] hover:bg-[#E5EDE6] hover:text-[#123C32] transition-colors"
              aria-label="Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlist.length > 0 && (
                <span className="absolute -mt-2 ml-3 grid h-4 min-w-4 place-items-center rounded-full bg-[#D9A65A] px-1 text-[9px] font-bold text-[#202824]">
                  {wishlist.length}
                </span>
              )}
            </Link>

            <Link
              href="/profile"
              className="p-1.5 sm:p-2.5 rounded-full text-[#202824] hover:bg-[#E5EDE6] hover:text-[#123C32] transition-colors"
              aria-label="Account"
            >
              <User className="w-4 h-4 sm:w-5 sm:h-5" />
            </Link>

            <Link href="/cart">
              <motion.div
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.95 }}
                className="relative flex items-center gap-1.5 sm:gap-2 bg-[#123C32] text-[#F7F5EF] px-2.5 sm:px-4 py-2 sm:py-2.5 rounded-full font-medium text-sm shadow-md hover:bg-[#1a5244] transition-colors"
              >
                <ShoppingBag className="w-4 h-4 text-[#D9A65A]" />
                <span className="hidden sm:inline">Cart</span>
                <motion.span
                  key={cartCount}
                  initial={{ scale: 0.5 }}
                  animate={{ scale: 1 }}
                  className="bg-[#D9A65A] text-[#202824] text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center"
                >
                  {cartCount}
                </motion.span>
              </motion.div>
            </Link>
          </div>
        </div>

        {/* Expandable Animated Search Bar */}
        <AnimatePresence>
          {searchOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden border-t border-[#123C32]/10 mt-3"
            >
              <div className="max-w-3xl mx-auto px-4 pt-3 pb-1">
                <form action="/products" className="relative">
                  <input
                    type="text"
                    name="q"
                    autoFocus
                    placeholder="Search hatching eggs, fresh chicken, whey protein, skincare..."
                    className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white border border-[#123C32]/20 focus:outline-none focus:border-[#123C32] text-sm shadow-inner"
                  />
                  <Search className="w-5 h-5 text-[#123C32]/50 absolute left-4 top-1/2 -translate-y-1/2" />
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Mobile Full-Height Slide-In Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-[#202824]/60 backdrop-blur-sm z-50 lg:hidden"
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 260 }}
              className="fixed top-0 left-0 bottom-0 w-[85%] max-w-sm bg-[#F7F5EF] z-50 p-6 flex flex-col justify-between overflow-y-auto shadow-2xl lg:hidden"
            >
              <div>
                <div className="flex items-center justify-between pb-6 border-b border-[#123C32]/10">
                  <div className="flex items-center gap-2">
                    <Image
                      src="/sms-farmstead-logo.jpeg"
                      alt="SMS Farmstead Ventures Pvt. Ltd."
                      width={44}
                      height={44}
                      className="h-11 w-11 rounded-lg object-contain"
                    />
                    <span className="font-bold leading-tight text-[#123C32]">
                      SMS Farmstead
                      <small className="block text-[10px] font-semibold">Ventures Pvt. Ltd.</small>
                    </span>
                  </div>
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-2 rounded-full bg-[#E5EDE6] text-[#123C32]"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="mt-6 space-y-1">
                  <p className="text-xs font-bold uppercase tracking-wider text-[#123C32]/50 px-3 mb-2">
                    8 Shop Categories
                  </p>
                    {shopCategories.map((cat, idx) => (
                    <motion.div
                      key={cat.slug}
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.04 }}
                    >
                      <Link
                        href={`/category/${cat.slug}`}
                        className="block px-3 py-3 rounded-xl font-medium text-[#202824] hover:bg-[#123C32] hover:text-[#F7F5EF] transition-colors"
                      >
                        {cat.name}
                      </Link>
                    </motion.div>
                  ))}
                  <Link
                    href="/wishlist"
                    className="flex items-center gap-2 px-3 py-3 rounded-xl font-medium text-[#202824] hover:bg-[#123C32] hover:text-[#F7F5EF] transition-colors"
                  >
                    <Heart className="w-4 h-4" /> Wishlist
                    {wishlist.length > 0 && <span className="text-xs">({wishlist.length})</span>}
                  </Link>
                </div>
              </div>

              <div className="pt-6 border-t border-[#123C32]/10 grid grid-cols-2 gap-3">
                <Link
                  href="/login"
                  className="text-center py-2.5 rounded-xl border border-[#123C32] text-[#123C32] font-semibold text-sm"
                >
                  Login
                </Link>
                <Link
                  href="/wholesale"
                  className="text-center py-2.5 rounded-xl bg-[#123C32] text-[#F7F5EF] font-semibold text-sm"
                >
                  Wholesale
                </Link>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import Image from "next/image";
import { Menu, Search, ShoppingBag, UserRound, X } from "lucide-react";
import { useStore } from "@/components/StoreProvider";

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [closing, setClosing] = useState(false);
  const { count } = useStore();

  if (pathname.startsWith("/admin")) return null;

  function closeMenu() {
    setClosing(true);
  }

  return (
    <header className="sticky top-0 z-30 border-b border-[#dce6df] bg-[#f6f8f3]/95 backdrop-blur-md">
      <div className="bg-[#153d32] py-2 text-center text-[10px] font-medium tracking-[.16em] text-white/85">
        FARM-TO-FARM CONNECTIONS · BUY · SELL · SOURCE
      </div>
      <div className="container-shell relative flex min-h-[78px] items-center gap-2 sm:gap-5">
        <Link href="/" className="flex shrink-0 items-center gap-3 text-[#183a30]">
          <Image
            src="/sms-farmstead-logo.jpeg"
            alt="SMS Farmstead"
            width={52}
            height={44}
            priority
            className="h-11 w-[52px] rounded-lg object-contain"
          />
          <span>
            <b className="block font-serif text-[15px] font-semibold leading-5 tracking-tight sm:text-[19px]">SMS Farmstead</b>
            <small className="mt-1 hidden text-[9px] font-semibold uppercase tracking-[.2em] text-[#65776f] min-[360px]:block">Poultry marketplace</small>
          </span>
        </Link>

        <form action="/products" className="ml-5 hidden max-w-[260px] flex-1 md:block">
          <label className="sr-only" htmlFor="header-search">Search poultry listings</label>
          <div className="relative">
            <Search size={16} aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#65776f]" />
            <input id="header-search" name="q" placeholder="Search poultry listings" className="field search-field h-10 border-transparent bg-[#e8f0ea] text-xs focus:border-[#e88445]" />
          </div>
        </form>

        <nav className="ml-auto hidden items-center gap-6 text-[12px] font-medium text-[#42584e] lg:flex">
          <Link href="/" className="transition hover:text-[#bd5c2c]">Home</Link>
          <Link href="/products" className="transition hover:text-[#bd5c2c]">Browse listings</Link>
          <Link href="/categories" className="transition hover:text-[#bd5c2c]">Raw Chicken</Link>
          <Link href="/contact" className="transition hover:text-[#bd5c2c]">Sell with us</Link>
        </nav>

        <div className="ml-auto flex shrink-0 items-center gap-1 sm:gap-3 lg:ml-5">
          <Link
            href="/profile"
            aria-label="My account"
            className="hidden h-10 w-10 place-items-center rounded-xl text-[#42584e] transition hover:bg-[#e8f0ea] hover:text-[#bd5c2c] sm:grid"
          >
            <UserRound size={19} strokeWidth={1.7} />
          </Link>

          <Link
            href="/cart"
            aria-label="Shopping bag"
            className="relative grid h-10 w-10 place-items-center rounded-xl text-[#42584e] transition hover:bg-[#e8f0ea] hover:text-[#bd5c2c]"
          >
            <ShoppingBag size={19} strokeWidth={1.7} />
            {count > 0 && (
              <span key={count} className="cart-count-enter absolute right-0 top-0 grid h-[17px] min-w-[17px] place-items-center rounded-full bg-[#e88445] px-1 text-[9px] font-semibold text-white">
                {count}
              </span>
            )}
          </Link>

          <button
            type="button"
            aria-label={open ? "Close navigation" : "Open navigation"}
            aria-expanded={open}
            className="grid h-10 w-10 place-items-center rounded-xl text-[#42584e] transition hover:bg-[#e8f0ea] lg:hidden"
            onClick={() => {
              if (open) closeMenu();
              else {
                setClosing(false);
                setOpen(true);
              }
            }}
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {open && (
        <nav
          aria-label="Mobile navigation"
          className={`grid gap-4 border-t border-[#dce6df] bg-[#f6f8f3] px-5 py-5 text-sm lg:hidden ${closing ? "mobile-nav-exit" : "mobile-nav-enter"}`}
          onAnimationEnd={(event) => {
            if (event.target === event.currentTarget && event.animationName === "mobile-nav-exit") {
              setOpen(false);
              setClosing(false);
            }
          }}
        >
          <form action="/products" className="relative">
            <label className="sr-only" htmlFor="mobile-search">Search poultry listings</label>
            <Search size={16} aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#65776f]" />
            <input id="mobile-search" name="q" placeholder="Search poultry listings" className="field search-field text-xs" />
          </form>
          <Link href="/" onClick={closeMenu}>Home</Link>
          <Link href="/products" onClick={closeMenu}>Browse listings</Link>
          <Link href="/categories" onClick={closeMenu}>Raw Chicken</Link>
          <Link href="/contact" onClick={closeMenu}>Sell with us</Link>
          <Link href="/profile" onClick={closeMenu}>My account</Link>
        </nav>
      )}
    </header>
  );
}

"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { UserRound } from "lucide-react";
import { isAdminAuthenticated, setAdminAuthenticated } from "@/lib/admin";

const navItems = [
  ["Products overview", "/admin"],
  ["Products", "/admin/products"],
  ["Orders", "/admin/orders"],
  ["Customers", "/admin/customers"],
  ["Order requests", "/admin/payments"],
] as const;

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (pathname === "/admin/login") {
      setReady(true);
      return;
    }

    if (!isAdminAuthenticated()) {
      router.replace(`/admin/login?next=${encodeURIComponent(pathname || "/admin")}`);
      return;
    }

    setReady(true);
  }, [pathname, router]);

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  if (!ready) {
    return <div className="container-shell py-12 text-sm text-charcoal/60">Checking admin access…</div>;
  }

  return (
    <div className="min-h-[70vh] bg-[#eef1ec]">
      <div className="container-shell grid min-w-0 gap-4 py-4 sm:gap-5 sm:py-6 md:grid-cols-[200px_minmax(0,1fr)] lg:grid-cols-[220px_minmax(0,1fr)]">
        <aside className="h-fit rounded-2xl bg-forest p-4 text-white sm:p-5">
          <div className="flex items-center justify-between gap-2">
            <b className="text-lg">Admin studio</b>
            <Link
              href="/admin/profile"
              aria-label="Admin profile"
              title="Admin profile"
              className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-white/20 text-white transition hover:bg-white/10"
            >
              <UserRound size={19} strokeWidth={1.7} />
            </Link>
          </div>
          <p className="mt-2 text-[10px] text-amber-300">RESTRICTED ADMIN ACCESS</p>
          <nav className="mt-5 grid grid-cols-2 gap-3 text-sm md:grid-cols-1">
            {navItems.map(([label, href]) => (
              <Link
                key={href}
                href={href}
                className={pathname === href ? "font-semibold text-amber-200" : "text-white/90 hover:text-white"}
              >
                {label}
              </Link>
            ))}
          </nav>

          <button
            type="button"
            onClick={() => {
              setAdminAuthenticated(false);
              router.push("/admin/login");
            }}
            className="mt-6 w-full rounded-xl border border-white/25 px-3 py-2 text-sm text-white/90 hover:bg-white/5"
          >
            Sign out
          </button>
        </aside>

        <section className="min-w-0">{children}</section>
      </div>
    </div>
  );
}

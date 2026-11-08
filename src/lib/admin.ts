import { products as defaultProducts, type Product } from "@/lib/catalog";

export const ADMIN_SESSION_KEY = "p1-admin-session";
export const ADMIN_PRODUCTS_KEY = "p1-admin-products";

export const ADMIN_CREDENTIALS = {
  email: (process.env.NEXT_PUBLIC_ADMIN_EMAIL ?? "faiz@gmail.com").trim().toLowerCase(),
  password: process.env.NEXT_PUBLIC_ADMIN_PASSWORD ?? "Faiz@123",
};

export function isAdminAuthenticated() {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem(ADMIN_SESSION_KEY) === "true";
}

export function setAdminAuthenticated(value: boolean) {
  if (typeof window === "undefined") return;
  if (value) {
    window.localStorage.setItem(ADMIN_SESSION_KEY, "true");
    return;
  }
  window.localStorage.removeItem(ADMIN_SESSION_KEY);
}

export function getAdminProducts(): Product[] {
  if (typeof window === "undefined") return defaultProducts;

  try {
    const saved = window.localStorage.getItem(ADMIN_PRODUCTS_KEY);
    if (!saved) return defaultProducts;
    const parsed = JSON.parse(saved);
    if (Array.isArray(parsed) && parsed.length > 0) return parsed as Product[];
  } catch {
    // fall back to the seeded catalog if the saved payload is invalid
  }

  return defaultProducts;
}

export function saveAdminProducts(products: Product[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(ADMIN_PRODUCTS_KEY, JSON.stringify(products));
}

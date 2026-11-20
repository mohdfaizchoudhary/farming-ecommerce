"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { Check, ShoppingBag, X } from "lucide-react";
import { getCatalogProducts, isMarketplaceProduct, type Product } from "@/lib/catalog";

type Item = { productId: string; quantity: number };
export type CustomerRecord = {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  address: string;
  createdAt: string;
  lastSeenAt: string;
};
type StoreContextValue = {
  cart: Item[];
  products: Product[];
  catalogLoading: boolean;
  catalogError: string;
  refreshCatalog: () => Promise<void>;
  wishlist: string[];
  customers: CustomerRecord[];
  add: (id: string, productName?: string, quantity?: number) => void;
  buyNow: (id: string, quantity?: number) => void;
  clearCart: () => void;
  toggleWishlist: (id: string) => void;
  change: (id: string, quantity: number) => void;
  remove: (id: string) => void;
  upsertCustomer: (customer: Omit<CustomerRecord, "createdAt" | "lastSeenAt"> & {
    createdAt?: string;
    preserveExistingDetails?: boolean;
  }) => void;
  count: number;
};

const C = createContext<StoreContextValue | null>(null);
const CUSTOMERS_KEY = "p1-customers";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function readCustomers(value: string | null): CustomerRecord[] {
  if (!value) return [];
  const parsed: unknown = JSON.parse(value);
  if (!Array.isArray(parsed)) return [];

  return parsed.flatMap((entry): CustomerRecord[] => {
    if (!isRecord(entry)
      || typeof entry.id !== "string"
      || typeof entry.fullName !== "string"
      || typeof entry.email !== "string"
      || typeof entry.phone !== "string"
      || typeof entry.address !== "string"
      || typeof entry.createdAt !== "string"
      || typeof entry.lastSeenAt !== "string") {
      return [];
    }

    return [{
      id: entry.id,
      fullName: entry.fullName,
      email: entry.email,
      phone: entry.phone,
      address: entry.address,
      createdAt: entry.createdAt,
      lastSeenAt: entry.lastSeenAt,
    }];
  });
}

function readCart(value: string | null, availableProductIds?: Set<string>): Item[] {
  if (!value) return [];
  const parsed: unknown = JSON.parse(value);
  if (!Array.isArray(parsed)) return [];

  return parsed.flatMap((entry): Item[] => {
    if (!isRecord(entry)
      || typeof entry.productId !== "string"
      || (availableProductIds && !availableProductIds.has(entry.productId))
      || typeof entry.quantity !== "number"
      || !Number.isInteger(entry.quantity)
      || entry.quantity < 1) {
      return [];
    }

    return [{ productId: entry.productId, quantity: entry.quantity }];
  });
}

function readWishlist(value: string | null, availableProductIds?: Set<string>): string[] {
  if (!value) return [];
  const parsed: unknown = JSON.parse(value);
  if (!Array.isArray(parsed)) return [];
  return [...new Set(parsed.filter((id): id is string =>
    typeof id === "string" && (!availableProductIds || availableProductIds.has(id))))];
}

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<Item[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [catalogLoading, setCatalogLoading] = useState(true);
  const [catalogLoaded, setCatalogLoaded] = useState(false);
  const [catalogError, setCatalogError] = useState("");
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [customers, setCustomers] = useState<CustomerRecord[]>([]);
  const [ready, setReady] = useState(false);
  const [notice, setNotice] = useState<{
    id: number;
    message: string;
    kind: "cart" | "success";
    exiting?: boolean;
  } | null>(null);
  const noticeSequence = useRef(0);

  const refreshCatalog = useCallback(async () => {
    setCatalogLoading(true);
    try {
      const loadedProducts = getCatalogProducts().map((product) => {
        if (!isMarketplaceProduct(product)) {
          throw new Error("The local catalog contains invalid product data.");
        }
        return product;
      }).filter((product) => product.published !== false);
      setProducts(loadedProducts);
      setCatalogLoaded(true);
      setCatalogError("");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Could not load locally saved products.";
      console.error("Could not load locally saved products.", error);
      setCatalogError(message);
      throw error;
    } finally {
      setCatalogLoading(false);
    }
  }, []);

  useEffect(() => {
    try {
      setCart(readCart(localStorage.getItem("p1-cart")));
      setCustomers(readCustomers(localStorage.getItem(CUSTOMERS_KEY)));
      try {
        setWishlist(readWishlist(localStorage.getItem("p1-wishlist")));
      } catch (error) {
        console.error("Could not load saved wishlist.", error);
      }
    } catch (error) {
      console.error("Could not load saved cart and customer data.", error);
    }
    setReady(true);

    function syncCustomers(event: StorageEvent) {
      if (event.key !== CUSTOMERS_KEY) return;
      try {
        setCustomers(readCustomers(event.newValue));
      } catch (error) {
        console.error("Could not sync saved customers.", error);
      }
    }

    window.addEventListener("storage", syncCustomers);
    return () => {
      window.removeEventListener("storage", syncCustomers);
    };
  }, []);

  useEffect(() => {
    void refreshCatalog().catch(() => undefined);
    const refresh = () => { void refreshCatalog().catch(() => undefined); };
    window.addEventListener("catalog-changed", refresh);
    window.addEventListener("storage", refresh);
    window.addEventListener("focus", refresh);
    const interval = window.setInterval(refresh, 30000);
    return () => {
      window.removeEventListener("catalog-changed", refresh);
      window.removeEventListener("storage", refresh);
      window.removeEventListener("focus", refresh);
      window.clearInterval(interval);
    };
  }, [refreshCatalog]);

  useEffect(() => {
    if (!catalogLoaded) return;
    const availableProductIds = new Set(products.map((product) => product.id));
    setCart((items) => items.filter((item) => availableProductIds.has(item.productId)));
    setWishlist((items) => items.filter((id) => availableProductIds.has(id)));
  }, [catalogLoaded, products]);

  useEffect(() => {
    if (ready) localStorage.setItem("p1-cart", JSON.stringify(cart));
  }, [cart, ready]);
  useEffect(() => {
    if (ready) localStorage.setItem("p1-wishlist", JSON.stringify(wishlist));
  }, [wishlist, ready]);
  useEffect(() => {
    if (ready) localStorage.setItem(CUSTOMERS_KEY, JSON.stringify(customers));
  }, [customers, ready]);

  useEffect(() => {
    if (!notice) return;
    if (notice.exiting) return;
    const timeout = window.setTimeout(() => {
      setNotice((current) => current?.id === notice.id ? { ...current, exiting: true } : current);
    }, 2800);
    return () => window.clearTimeout(timeout);
  }, [notice]);

  function dismissNotice(id: number) {
    setNotice((current) => current?.id === id ? { ...current, exiting: true } : current);
  }

  const add = (id: string, productName?: string, quantity = 1) => {
    if (!Number.isInteger(quantity) || quantity < 1) {
      throw new Error("Cart quantity must be a positive whole number.");
    }
    setCart((items) => {
      const existing = items.find((item) => item.productId === id);
      return existing
        ? items.map((item) => (item.productId === id ? { ...item, quantity: item.quantity + quantity } : item))
        : [...items, { productId: id, quantity }];
    });
    setNotice({
      id: ++noticeSequence.current,
      message: `${productName ?? "Product"} added to your bag.`,
      kind: "cart",
    });
  };
  const buyNow = (id: string, quantity = 1) => setCart([{ productId: id, quantity }]);
  const clearCart = () => setCart([]);
  const toggleWishlist = (id: string) => {
    setWishlist((items) => items.includes(id) ? items.filter((item) => item !== id) : [...items, id]);
  };
  const change = (id: string, quantity: number) =>
    setCart((items) =>
      quantity < 1
        ? items.filter((item) => item.productId !== id)
        : items.map((item) => (item.productId === id ? { ...item, quantity } : item)),
    );
  const remove = (id: string) => setCart((items) => items.filter((item) => item.productId !== id));

  const upsertCustomer = useCallback((customer: Omit<CustomerRecord, "createdAt" | "lastSeenAt"> & {
    createdAt?: string;
    preserveExistingDetails?: boolean;
  }) => {
    const now = new Date().toISOString();
    setCustomers((current) => {
      const existing = current.find((entry) => entry.id === customer.id);
      const { preserveExistingDetails, ...details } = customer;
      const savedCustomer: CustomerRecord = {
        id: details.id,
        fullName: preserveExistingDetails ? existing?.fullName || details.fullName : details.fullName,
        email: details.email,
        phone: preserveExistingDetails ? existing?.phone || details.phone : details.phone,
        address: preserveExistingDetails ? existing?.address || details.address : details.address,
        createdAt: existing?.createdAt ?? customer.createdAt ?? now,
        lastSeenAt: now,
      };
      return [savedCustomer, ...current.filter((entry) => entry.id !== savedCustomer.id)];
    });
  }, []);

  const value = useMemo(
    () => ({
      cart,
      products,
      catalogLoading,
      catalogError,
      refreshCatalog,
      wishlist,
      customers,
      add,
      buyNow,
      clearCart,
      toggleWishlist,
      change,
      remove,
      upsertCustomer,
      count: cart.reduce((sum, item) => sum + item.quantity, 0),
    }),
    [cart, products, catalogLoading, catalogError, refreshCatalog, wishlist, customers],
  );
  return (
    <C.Provider value={value}>
      {children}
      {notice && (
        <div
          className="store-toast"
          data-kind={notice.kind}
          data-state={notice.exiting ? "closing" : "open"}
          role="status"
          aria-live="polite"
          key={notice.id}
          onAnimationEnd={(event) => {
            if (event.animationName === "toast-exit") {
              setNotice((current) => current?.id === notice.id ? null : current);
            }
          }}
        >
          <span className="store-toast-check" aria-hidden="true">
            {notice.kind === "success" ? <Check size={16} strokeWidth={2.5} /> : <ShoppingBag size={15} strokeWidth={1.8} />}
          </span>
          <span>{notice.message}</span>
          <button type="button" aria-label="Dismiss notification" onClick={() => dismissNotice(notice.id)}><X size={17} /></button>
        </div>
      )}
    </C.Provider>
  );
}

export function useStore() {
  const context = useContext(C);
  if (!context) throw new Error("useStore must be used within StoreProvider.");
  return context;
}

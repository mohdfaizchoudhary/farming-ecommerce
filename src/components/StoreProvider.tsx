"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { Check, ShoppingBag, X } from "lucide-react";
import { getCatalogProducts } from "@/lib/catalog";

type Item = { productId: string; quantity: number };
export type OrderStatus = "placed" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled";
export type PaymentMethod = "cod" | "upi" | "card" | "unknown";
export type PaymentStatus = "successful" | "pending";
export type CustomerRecord = {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  address: string;
  createdAt: string;
  lastSeenAt: string;
};
export type StoreOrder = {
  id: string;
  date: string;
  total: number;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  customerName: string;
  customerId?: string;
  customerEmail?: string;
  customerPhone?: string;
  customerAddress?: string;
  items: { productId?: string; name: string; quantity: number; price: number }[];
};

export type OrderRequest = {
  id: string;
  orderId: string;
  type: "cancellation" | "replacement" | "return";
  status: "requested" | "approved" | "rejected";
  reason: string;
  createdAt: string;
  originalProductName?: string;
  replacementProductId?: string;
  replacementProductName?: string;
  quantity?: number;
  originalTotal?: number;
  replacementTotal?: number;
};

type NewOrderRequest = Omit<OrderRequest, "id" | "status" | "createdAt">;

type StoreContextValue = {
  cart: Item[];
  orders: StoreOrder[];
  customers: CustomerRecord[];
  orderRequests: OrderRequest[];
  add: (id: string, productName?: string) => void;
  buyNow: (id: string) => void;
  change: (id: string, quantity: number) => void;
  remove: (id: string) => void;
  placeOrder: (details: {
    paymentMethod: PaymentMethod;
    paymentStatus: PaymentStatus;
    customerName: string;
    customerId: string;
    customerEmail: string;
    customerPhone: string;
    customerAddress: string;
  }) => StoreOrder;
  upsertCustomer: (customer: Omit<CustomerRecord, "createdAt" | "lastSeenAt"> & {
    createdAt?: string;
    preserveExistingDetails?: boolean;
  }) => void;
  updateOrderStatus: (id: string, status: OrderStatus) => void;
  addOrderRequest: (request: NewOrderRequest) => OrderRequest;
  updateOrderRequestStatus: (id: string, status: "approved" | "rejected") => void;
  count: number;
};

const C = createContext<StoreContextValue | null>(null);
const orderStatuses: OrderStatus[] = ["placed", "confirmed", "processing", "shipped", "delivered", "cancelled"];
const orderRequestStatuses: OrderRequest["status"][] = ["requested", "approved", "rejected"];
const orderRequestTypes: OrderRequest["type"][] = ["cancellation", "replacement", "return"];
const ORDER_REQUESTS_KEY = "p1-order-requests";
const CUSTOMERS_KEY = "p1-customers";
const ORDERS_KEY = "p1-orders";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function readOrderRequests(value: string | null): OrderRequest[] {
  if (!value) return [];
  const parsed: unknown = JSON.parse(value);
  if (!Array.isArray(parsed)) return [];

  return parsed.flatMap((entry): OrderRequest[] => {
    if (!isRecord(entry)
      || typeof entry.id !== "string"
      || typeof entry.orderId !== "string"
      || typeof entry.reason !== "string"
      || typeof entry.createdAt !== "string"
      || !orderRequestTypes.includes(entry.type as OrderRequest["type"])
      || !orderRequestStatuses.includes(entry.status as OrderRequest["status"])) {
      return [];
    }

    return [{
      id: entry.id,
      orderId: entry.orderId,
      type: entry.type as OrderRequest["type"],
      status: entry.status as OrderRequest["status"],
      reason: entry.reason,
      createdAt: entry.createdAt,
      ...(typeof entry.originalProductName === "string" ? { originalProductName: entry.originalProductName } : {}),
      ...(typeof entry.replacementProductId === "string" ? { replacementProductId: entry.replacementProductId } : {}),
      ...(typeof entry.replacementProductName === "string" ? { replacementProductName: entry.replacementProductName } : {}),
      ...(typeof entry.quantity === "number" && Number.isInteger(entry.quantity) ? { quantity: entry.quantity } : {}),
      ...(typeof entry.originalTotal === "number" ? { originalTotal: entry.originalTotal } : {}),
      ...(typeof entry.replacementTotal === "number" ? { replacementTotal: entry.replacementTotal } : {}),
    }];
  });
}

function readOrders(value: string | null): StoreOrder[] {
  if (!value) return [];
  const parsed: unknown = JSON.parse(value);
  if (!Array.isArray(parsed)) return [];

  return parsed.map((entry): StoreOrder => {
    const saved = entry as Partial<StoreOrder>;
    const savedStatus = typeof saved.status === "string" ? saved.status.toLowerCase() : "";
    const paymentMethod = saved.paymentMethod === "cod" || saved.paymentMethod === "upi" || saved.paymentMethod === "card"
      ? saved.paymentMethod
      : "unknown";

    return {
      id: typeof saved.id === "string" ? saved.id : `P1-${Date.now().toString().slice(-8)}`,
      date: typeof saved.date === "string" ? saved.date : new Date().toISOString(),
      total: typeof saved.total === "number" ? saved.total : 0,
      status: orderStatuses.includes(savedStatus as OrderStatus) ? savedStatus as OrderStatus : "placed",
      paymentMethod,
      paymentStatus: saved.paymentStatus === "successful" ? "successful" : "pending",
      customerName: typeof saved.customerName === "string" ? saved.customerName : "Customer",
      ...(typeof saved.customerId === "string" ? { customerId: saved.customerId } : {}),
      ...(typeof saved.customerEmail === "string" ? { customerEmail: saved.customerEmail } : {}),
      ...(typeof saved.customerPhone === "string" ? { customerPhone: saved.customerPhone } : {}),
      ...(typeof saved.customerAddress === "string" ? { customerAddress: saved.customerAddress } : {}),
      items: Array.isArray(saved.items)
        ? saved.items.flatMap((item): StoreOrder["items"] => {
            if (!isRecord(item)
              || typeof item.name !== "string"
              || typeof item.quantity !== "number"
              || typeof item.price !== "number") {
              return [];
            }
            return [{
              ...(typeof item.productId === "string" ? { productId: item.productId } : {}),
              name: item.name,
              quantity: item.quantity,
              price: item.price,
            }];
          })
        : [],
    };
  });
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

function readCart(value: string | null, availableProductIds: Set<string>): Item[] {
  if (!value) return [];
  const parsed: unknown = JSON.parse(value);
  if (!Array.isArray(parsed)) return [];

  return parsed.flatMap((entry): Item[] => {
    if (!isRecord(entry)
      || typeof entry.productId !== "string"
      || !availableProductIds.has(entry.productId)
      || typeof entry.quantity !== "number"
      || !Number.isInteger(entry.quantity)
      || entry.quantity < 1) {
      return [];
    }

    return [{ productId: entry.productId, quantity: entry.quantity }];
  });
}

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<Item[]>([]);
  const [orders, setOrders] = useState<StoreOrder[]>([]);
  const [customers, setCustomers] = useState<CustomerRecord[]>([]);
  const [orderRequests, setOrderRequests] = useState<OrderRequest[]>([]);
  const [ready, setReady] = useState(false);
  const [notice, setNotice] = useState<{
    id: number;
    message: string;
    kind: "cart" | "success";
    exiting?: boolean;
  } | null>(null);
  const noticeSequence = useRef(0);

  useEffect(() => {
    try {
      const availableProductIds = new Set(getCatalogProducts().map((product) => product.id));
      setCart(readCart(localStorage.getItem("p1-cart"), availableProductIds));
      setOrders(readOrders(localStorage.getItem(ORDERS_KEY)));
      setCustomers(readCustomers(localStorage.getItem(CUSTOMERS_KEY)));
      setOrderRequests(readOrderRequests(localStorage.getItem(ORDER_REQUESTS_KEY)));
    } catch (error) {
      console.error("Could not load saved cart, orders and requests.", error);
    }
    setReady(true);

    function syncOrders(event: StorageEvent) {
      if (event.key !== ORDERS_KEY) return;
      try {
        setOrders(readOrders(event.newValue));
      } catch (error) {
        console.error("Could not sync saved orders.", error);
      }
    }

    function syncCustomers(event: StorageEvent) {
      if (event.key !== CUSTOMERS_KEY) return;
      try {
        setCustomers(readCustomers(event.newValue));
      } catch (error) {
        console.error("Could not sync saved customers.", error);
      }
    }

    function syncOrderRequests(event: StorageEvent) {
      if (event.key !== ORDER_REQUESTS_KEY) return;
      try {
        setOrderRequests(readOrderRequests(event.newValue));
      } catch (error) {
        console.error("Could not sync saved order requests.", error);
      }
    }

    window.addEventListener("storage", syncOrders);
    window.addEventListener("storage", syncCustomers);
    window.addEventListener("storage", syncOrderRequests);
    return () => {
      window.removeEventListener("storage", syncOrders);
      window.removeEventListener("storage", syncCustomers);
      window.removeEventListener("storage", syncOrderRequests);
    };
  }, []);

  useEffect(() => {
    if (ready) localStorage.setItem("p1-cart", JSON.stringify(cart));
  }, [cart, ready]);
  useEffect(() => {
    if (ready) localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
  }, [orders, ready]);
  useEffect(() => {
    if (ready) localStorage.setItem(CUSTOMERS_KEY, JSON.stringify(customers));
  }, [customers, ready]);
  useEffect(() => {
    if (ready) localStorage.setItem(ORDER_REQUESTS_KEY, JSON.stringify(orderRequests));
  }, [orderRequests, ready]);

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

  const add = (id: string, productName?: string) => {
    setCart((items) => {
      const existing = items.find((item) => item.productId === id);
      return existing
        ? items.map((item) => (item.productId === id ? { ...item, quantity: item.quantity + 1 } : item))
        : [...items, { productId: id, quantity: 1 }];
    });
    setNotice({
      id: ++noticeSequence.current,
      message: `${productName ?? "Product"} added to your bag.`,
      kind: "cart",
    });
  };
  const buyNow = (id: string) => setCart([{ productId: id, quantity: 1 }]);
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
      const existing = current.find((entry) => entry.id === customer.id || entry.email.toLowerCase() === customer.email.toLowerCase());
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
      return [savedCustomer, ...current.filter((entry) => entry.id !== savedCustomer.id && entry.email.toLowerCase() !== savedCustomer.email.toLowerCase())];
    });
  }, []);

  const placeOrder = (details: {
    paymentMethod: PaymentMethod;
    paymentStatus: PaymentStatus;
    customerName: string;
    customerId: string;
    customerEmail: string;
    customerPhone: string;
    customerAddress: string;
  }) => {
    const catalog = getCatalogProducts();
    const items = cart.map((item) => {
      const product = catalog.find((entry) => entry.id === item.productId);
      if (!product) throw new Error(`Product ${item.productId} is no longer available.`);
      return { productId: product.id, name: product.name, quantity: item.quantity, price: product.price };
    });
    const order: StoreOrder = {
      id: `P1-${Date.now().toString().slice(-8)}`,
      date: new Date().toISOString(),
      total: items.reduce((sum, item) => sum + item.price * item.quantity, 0),
      status: "placed",
      paymentMethod: details.paymentMethod,
      paymentStatus: details.paymentStatus,
      customerName: details.customerName,
      customerId: details.customerId,
      customerEmail: details.customerEmail,
      customerPhone: details.customerPhone,
      customerAddress: details.customerAddress,
      items,
    };
    upsertCustomer({
      id: details.customerId,
      fullName: details.customerName,
      email: details.customerEmail,
      phone: details.customerPhone,
      address: details.customerAddress,
    });
    setOrders((current) => [order, ...current]);
    setCart([]);
    setNotice({
      id: ++noticeSequence.current,
      message: "Order placed successfully.",
      kind: "success",
    });
    return order;
  };

  const updateOrderStatus = (id: string, status: OrderStatus) => {
    setOrders((current) => current.map((order) => (order.id === id ? { ...order, status } : order)));
  };

  const addOrderRequest = (details: NewOrderRequest) => {
    const order = orders.find((entry) => entry.id === details.orderId);
    if (!order) throw new Error("This order could not be found.");
    if (orderRequests.some((request) => request.orderId === details.orderId && request.status === "requested")) {
      throw new Error("There is already a request awaiting review for this order.");
    }
    if (details.type === "cancellation" && ["shipped", "delivered", "cancelled"].includes(order.status)) {
      throw new Error("This order can no longer be cancelled.");
    }
    if (details.type !== "cancellation" && order.status !== "delivered") {
      throw new Error("Replacement and return requests are available after delivery.");
    }

    const request: OrderRequest = {
      ...details,
      id: `REQ-${crypto.randomUUID()}`,
      status: "requested",
      createdAt: new Date().toISOString(),
    };
    setOrderRequests((current) => [request, ...current]);
    return request;
  };

  const updateOrderRequestStatus = (id: string, status: "approved" | "rejected") => {
    const request = orderRequests.find((entry) => entry.id === id && entry.status === "requested");
    if (!request) return;

    setOrderRequests((current) =>
      current.map((entry) => (entry.id === id && entry.status === "requested" ? { ...entry, status } : entry)),
    );
    if (status === "approved" && request.type === "cancellation") {
      setOrders((current) =>
        current.map((order) => (order.id === request.orderId ? { ...order, status: "cancelled" } : order)),
      );
    }
  };

  const value = useMemo(
    () => ({
      cart,
      orders,
      customers,
      orderRequests,
      add,
      buyNow,
      change,
      remove,
      placeOrder,
      upsertCustomer,
      updateOrderStatus,
      addOrderRequest,
      updateOrderRequestStatus,
      count: cart.reduce((sum, item) => sum + item.quantity, 0),
    }),
    [cart, orders, customers, orderRequests],
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

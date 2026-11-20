export type LocalOrderStatus = "confirmed" | "processing" | "packed" | "shipped" | "delivered" | "cancelled";
export type LocalPaymentMethod = "upi" | "card" | "cod";

export type LocalOrder = {
  id: string;
  orderNumber: string;
  date: string;
  total: number;
  status: LocalOrderStatus;
  paymentMethod: LocalPaymentMethod;
  paymentStatus: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerAddress: string;
  items: { productId: string; name: string; quantity: number; price: number }[];
};

export const LOCAL_ORDERS_STORAGE_KEY = "p1-local-orders-v1";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isLocalOrder(value: unknown): value is LocalOrder {
  return isRecord(value)
    && typeof value.id === "string"
    && typeof value.orderNumber === "string"
    && typeof value.date === "string"
    && typeof value.total === "number"
    && Number.isFinite(value.total)
    && ["confirmed", "processing", "packed", "shipped", "delivered", "cancelled"].includes(String(value.status))
    && ["upi", "card", "cod"].includes(String(value.paymentMethod))
    && typeof value.paymentStatus === "string"
    && typeof value.customerId === "string"
    && typeof value.customerName === "string"
    && typeof value.customerEmail === "string"
    && typeof value.customerPhone === "string"
    && typeof value.customerAddress === "string"
    && Array.isArray(value.items)
    && value.items.every((item) => isRecord(item)
      && typeof item.productId === "string"
      && typeof item.name === "string"
      && typeof item.quantity === "number"
      && Number.isInteger(item.quantity)
      && item.quantity > 0
      && typeof item.price === "number"
      && Number.isFinite(item.price)
      && item.price >= 0);
}

export function getLocalOrders(): LocalOrder[] {
  const saved = window.localStorage.getItem(LOCAL_ORDERS_STORAGE_KEY);
  if (!saved) return [];
  const parsed: unknown = JSON.parse(saved);
  if (!Array.isArray(parsed) || !parsed.every(isLocalOrder)) {
    throw new Error("Locally saved orders are invalid. Clear the browser's local order data and try again.");
  }
  return parsed;
}

function saveLocalOrders(orders: LocalOrder[]) {
  window.localStorage.setItem(LOCAL_ORDERS_STORAGE_KEY, JSON.stringify(orders));
  window.dispatchEvent(new Event("local-orders-changed"));
}

export function placeLocalOrder(input: Omit<LocalOrder, "id" | "orderNumber" | "date" | "total" | "status" | "paymentStatus">) {
  const date = new Date().toISOString();
  const id = crypto.randomUUID();
  const total = input.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const order: LocalOrder = {
    ...input,
    id,
    orderNumber: `LOCAL-${date.slice(0, 10).replace(/-/g, "")}-${id.slice(0, 8).toUpperCase()}`,
    date,
    total,
    status: "confirmed",
    paymentStatus: input.paymentMethod === "cod"
      ? "pending"
      : input.paymentMethod === "upi"
        ? "manual confirmation required"
        : "not processed (local demo)",
  };
  saveLocalOrders([order, ...getLocalOrders()]);
  return order;
}

export function updateLocalOrderStatus(orderId: string, status: LocalOrderStatus) {
  const orders = getLocalOrders();
  let updatedOrder: LocalOrder | undefined;
  const updatedOrders = orders.map((order) => {
    if (order.id !== orderId) return order;
    updatedOrder = { ...order, status };
    return updatedOrder;
  });
  if (!updatedOrder) throw new Error("The locally saved order could not be found.");
  saveLocalOrders(updatedOrders);
  return updatedOrder;
}

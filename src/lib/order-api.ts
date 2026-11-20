import { ApiError } from "@/lib/supabase-server";
import type { SupabaseClient } from "@supabase/supabase-js";

export type OrderApiRecord = {
  id: string;
  orderNumber: string;
  date: string;
  total: number;
  status: string;
  paymentMethod: string;
  paymentStatus: string;
  customerName: string;
  customerId?: string;
  customerEmail?: string;
  customerPhone?: string;
  customerAddress?: string;
  items: { productId?: string; name: string; quantity: number; price: number }[];
};

function statusValue(value: unknown) {
  if (typeof value !== "string") {
    throw new ApiError("An order has an invalid status in Supabase.", 502);
  }
  const normalized = value.toLowerCase();
  if (normalized === "placed" || normalized === "pending_payment") return "confirmed";
  if (["confirmed", "processing", "packed", "shipped", "delivered", "cancelled"].includes(normalized)) {
    return normalized;
  }
  throw new ApiError("An order has an unsupported status in Supabase.", 502);
}

export async function loadOrders(supabase: SupabaseClient, userId?: string): Promise<OrderApiRecord[]> {
  let query = supabase.from("orders").select("*").order("created_at", { ascending: false });
  if (userId) query = query.eq("user_id", userId);
  const { data: orders, error } = await query;
  if (error) throw new ApiError("Could not load orders from Supabase.", 502);
  if (!orders?.length) return [];

  const orderIds = orders.map((order) => order.id);
  const [itemResult, paymentResult] = await Promise.all([
    supabase
      .from("order_items")
      .select("order_id,product_id,product_name_snapshot,unit_price,quantity")
      .in("order_id", orderIds),
    supabase
      .from("payments")
      .select("order_id,gateway_method")
      .in("order_id", orderIds)
      .eq("provider", "razorpay"),
  ]);
  if (itemResult.error) throw new ApiError("Could not load order items from Supabase.", 502);
  if (paymentResult.error) throw new ApiError("Could not load payment details from Supabase.", 502);

  const itemsByOrder = new Map<string, NonNullable<typeof itemResult.data>>();
  for (const item of itemResult.data ?? []) {
    const items = itemsByOrder.get(item.order_id) ?? [];
    items.push(item);
    itemsByOrder.set(item.order_id, items);
  }
  const gatewayMethodByOrder = new Map(
    (paymentResult.data ?? []).map((payment) => [payment.order_id, payment.gateway_method]),
  );

  return orders.map((order): OrderApiRecord => {
    const delivery = typeof order.delivery_snapshot === "object" && order.delivery_snapshot !== null
      ? order.delivery_snapshot as Record<string, unknown>
      : {};
    const address = [delivery.address, delivery.city, delivery.state, delivery.postalCode]
      .filter((part): part is string => typeof part === "string" && part.trim().length > 0)
      .join(", ");
    const gatewayMethod = gatewayMethodByOrder.get(order.id);
    const method = order.payment_method === "cod"
      ? "cod"
      : gatewayMethod === "upi"
        ? "Razorpay UPI"
        : gatewayMethod === "card"
          ? "Razorpay Card"
          : "razorpay";
    return {
      id: order.id,
      orderNumber: order.order_number,
      date: order.created_at,
      total: Number(order.grand_total),
      status: statusValue(order.status),
      paymentMethod: method,
      paymentStatus: order.payment_status === "successful" ? "successful" : "pending",
      customerName: order.customer_name,
      ...(typeof order.user_id === "string" ? { customerId: order.user_id } : {}),
      ...(typeof order.customer_email === "string" ? { customerEmail: order.customer_email } : {}),
      customerPhone: typeof delivery.phone === "string" ? delivery.phone : "",
      customerAddress: address,
      items: (itemsByOrder.get(order.id) ?? []).map((item) => ({
        ...(typeof item.product_id === "string" ? { productId: item.product_id } : {}),
        name: item.product_name_snapshot,
        quantity: Number(item.quantity),
        price: Number(item.unit_price),
      })),
    };
  });
}

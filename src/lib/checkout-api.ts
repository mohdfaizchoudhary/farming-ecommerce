import { z } from "zod";
import type { SupabaseClient, User } from "@supabase/supabase-js";
import { ApiError } from "@/lib/supabase-server";

export const checkoutCartSchema = z.object({
  items: z.array(z.object({
    productId: z.string().uuid(),
    quantity: z.number().int().min(1).max(1000),
  })).min(1).max(50),
});

export const checkoutInputSchema = checkoutCartSchema.extend({
  customerName: z.string().trim().min(1).max(200),
  phone: z.string().trim().min(5).max(40),
  address: z.string().trim().min(5).max(500),
  city: z.string().trim().min(1).max(100),
  state: z.string().trim().max(100).default(""),
  postalCode: z.string().trim().min(3).max(20),
});

export type CheckoutInput = z.infer<typeof checkoutInputSchema>;
type CartItemInput = z.infer<typeof checkoutCartSchema>["items"][number];
type ResolvedOrderItem = {
  product_id: string;
  variant_id: string;
  name: string;
  sku: string;
  quantity: number;
  price: number;
};

type PaymentDetails =
  | { method: "cod" }
  | { method: "razorpay"; providerOrderId: string; providerPaymentId: string; gatewayMethod: "upi" | "card" };

export async function resolveCustomerOrderItems(
  service: SupabaseClient,
  items: CartItemInput[],
): Promise<{ orderItems: ResolvedOrderItem[]; subtotal: number }> {
  const quantities = new Map<string, number>();
  for (const item of items) {
    quantities.set(item.productId, (quantities.get(item.productId) ?? 0) + item.quantity);
  }

  const productIds = [...quantities.keys()];
  const { data: rows, error: productError } = await service
    .from("products")
    .select("id,name,sku,status")
    .in("id", productIds)
    .eq("status", "active");
  if (productError) throw new ApiError("Could not verify the products in your cart.", 502);

  const { data: variants, error: variantError } = await service
    .from("product_variants")
    .select("id,product_id,sku,price,stock_quantity")
    .in("product_id", productIds)
    .eq("active", true)
    .order("id");
  if (variantError) throw new ApiError("Could not verify product stock in your cart.", 502);

  const variantsByProduct = new Map<string, NonNullable<typeof variants>>();
  for (const variant of variants ?? []) {
    const productVariants = variantsByProduct.get(variant.product_id) ?? [];
    productVariants.push(variant);
    variantsByProduct.set(variant.product_id, productVariants);
  }
  const productsById = new Map((rows ?? []).map((row) => [row.id, row]));
  const orderItems: ResolvedOrderItem[] = [];

  for (const [productId, quantity] of quantities) {
    const product = productsById.get(productId);
    const variant = variantsByProduct.get(productId)?.[0];
    if (!product || !variant) throw new ApiError("A product in your cart is no longer available.", 409);
    if (Number(variant.stock_quantity) < quantity) {
      throw new ApiError(`${product.name} does not have enough stock for this quantity.`, 409);
    }
    orderItems.push({
      product_id: product.id,
      variant_id: variant.id,
      name: product.name,
      sku: variant.sku || product.sku,
      quantity,
      price: Number(variant.price),
    });
  }

  return {
    orderItems,
    subtotal: orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
  };
}

export async function createCustomerOrder(
  service: SupabaseClient,
  user: User,
  input: CheckoutInput,
  payment: PaymentDetails,
  expectedAmountInPaise?: number,
) {
  if (!user.email) throw new ApiError("A valid email address is required to place an order.", 400);
  const { orderItems, subtotal } = await resolveCustomerOrderItems(service, input.items);
  if (expectedAmountInPaise !== undefined && Math.round(subtotal * 100) !== expectedAmountInPaise) {
    throw new ApiError("The order total changed during payment. Contact support before retrying.", 409);
  }

  const orderNumber = `ORD-${new Date().toISOString().slice(0, 10).replace(/-/g, "")}-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;
  const deliverySnapshot = {
    recipientName: input.customerName,
    phone: input.phone,
    address: input.address,
    city: input.city,
    state: input.state,
    postalCode: input.postalCode,
    country: "IN",
  };
  const isOnlinePayment = payment.method === "razorpay";
  const { data: orderId, error: createError } = await service.rpc("create_customer_order", {
    p_order_number: orderNumber,
    p_user_id: user.id,
    p_customer_name: input.customerName,
    p_customer_email: user.email,
    p_delivery_snapshot: deliverySnapshot,
    p_subtotal: subtotal,
    p_items: orderItems,
    p_payment_method: payment.method,
    p_payment_status: isOnlinePayment ? "successful" : "pending",
    p_provider_order_id: isOnlinePayment ? payment.providerOrderId : null,
    p_provider_payment_id: isOnlinePayment ? payment.providerPaymentId : null,
    p_gateway_method: isOnlinePayment ? payment.gatewayMethod : null,
  });
  if (createError || typeof orderId !== "string") {
    if (createError?.message.includes("Insufficient stock or product is unavailable")) {
      throw new ApiError("Stock changed while you were checking out. Refresh your cart and try again.", 409);
    }
    console.error("Could not create customer order in Supabase.", createError);
    throw new ApiError("We couldn't save your order. Please try again.", 502);
  }

  return { orderId, orderNumber, status: "confirmed" as const, total: subtotal };
}

import { z } from "zod";
import { checkoutCartSchema, resolveCustomerOrderItems } from "@/lib/checkout-api";
import { apiErrorResponse, ApiError, requireUser } from "@/lib/supabase-server";

const paymentOrderInput = checkoutCartSchema.extend({
  method: z.enum(["upi", "card"]),
});

const razorpayOrderResponse = z.object({
  id: z.string().min(1),
  amount: z.number().int().positive(),
  currency: z.string().length(3),
});

export async function POST(request: Request) {
  try {
    const { service } = await requireUser(request);
    const keyId = process.env.RAZORPAY_KEY_ID;
    const secret = process.env.RAZORPAY_KEY_SECRET;
    if (!keyId || !secret) throw new ApiError("Razorpay is not configured. Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET on the server.", 503);

    const body: unknown = await request.json();
    const parsed = paymentOrderInput.safeParse(body);
    if (!parsed.success) throw new ApiError(parsed.error.issues[0]?.message ?? "Invalid payment details.", 400);

    const { subtotal } = await resolveCustomerOrderItems(service, parsed.data.items);
    const amount = Math.round(subtotal * 100);
    if (!Number.isSafeInteger(amount) || amount <= 0) throw new ApiError("The order total is invalid.", 400);

    const response = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: {
        Authorization: `Basic ${Buffer.from(`${keyId}:${secret}`).toString("base64")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount,
        currency: "INR",
        receipt: `SMS-${crypto.randomUUID().replace(/-/g, "").slice(0, 24)}`,
        notes: { preferred_method: parsed.data.method },
      }),
      cache: "no-store",
    });
    if (!response.ok) {
      console.error("Razorpay order creation failed.", response.status);
      throw new ApiError("The payment provider could not start checkout. Please try again.", 502);
    }

    const result = razorpayOrderResponse.safeParse(await response.json());
    if (!result.success || result.data.amount !== amount || result.data.currency.toUpperCase() !== "INR") {
      throw new ApiError("The payment provider returned invalid order details.", 502);
    }

    return Response.json({
      id: result.data.id,
      amount: result.data.amount,
      currency: result.data.currency,
      keyId,
      method: parsed.data.method,
    });
  } catch (error) {
    return apiErrorResponse(error);
  }
}

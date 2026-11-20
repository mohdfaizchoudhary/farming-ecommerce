import { createHmac, timingSafeEqual } from "node:crypto";
import { z } from "zod";
import { checkoutInputSchema, createCustomerOrder, resolveCustomerOrderItems } from "@/lib/checkout-api";
import { apiErrorResponse, ApiError, requireUser } from "@/lib/supabase-server";

const paymentVerificationInput = checkoutInputSchema.extend({
  method: z.enum(["upi", "card"]),
  razorpay_order_id: z.string().regex(/^order_[A-Za-z0-9]+$/),
  razorpay_payment_id: z.string().regex(/^pay_[A-Za-z0-9]+$/),
  razorpay_signature: z.string().regex(/^[a-f0-9]{64}$/i),
});

const razorpayPaymentResponse = z.object({
  id: z.string(),
  order_id: z.string(),
  amount: z.number().int().positive(),
  currency: z.string(),
  status: z.string(),
  method: z.string(),
});

function isValidSignature(orderId: string, paymentId: string, signature: string, secret: string) {
  const expected = createHmac("sha256", secret).update(`${orderId}|${paymentId}`).digest();
  const received = Buffer.from(signature, "hex");
  return expected.length === received.length && timingSafeEqual(expected, received);
}

export async function POST(request: Request) {
  try {
    const { user, service } = await requireUser(request);
    const keyId = process.env.RAZORPAY_KEY_ID;
    const secret = process.env.RAZORPAY_KEY_SECRET;
    if (!keyId || !secret) throw new ApiError("Razorpay is not configured. Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET on the server.", 503);

    const body: unknown = await request.json();
    const parsed = paymentVerificationInput.safeParse(body);
    if (!parsed.success) throw new ApiError(parsed.error.issues[0]?.message ?? "Invalid payment verification details.", 400);
    const input = parsed.data;
    if (!isValidSignature(input.razorpay_order_id, input.razorpay_payment_id, input.razorpay_signature, secret)) {
      throw new ApiError("The payment signature is invalid.", 400);
    }

    const paymentResponse = await fetch(
      `https://api.razorpay.com/v1/payments/${encodeURIComponent(input.razorpay_payment_id)}`,
      {
        headers: {
          Authorization: `Basic ${Buffer.from(`${keyId}:${secret}`).toString("base64")}`,
        },
        cache: "no-store",
      },
    );
    if (!paymentResponse.ok) {
      console.error("Could not retrieve Razorpay payment details.", paymentResponse.status);
      throw new ApiError("The payment provider could not verify the payment. Contact support before retrying.", 502);
    }

    let paymentPayload: unknown = await paymentResponse.json();
    let payment = razorpayPaymentResponse.safeParse(paymentPayload);
    if (!payment.success) throw new ApiError("The payment provider returned invalid payment details.", 502);
    if (payment.data.order_id !== input.razorpay_order_id) {
      throw new ApiError("The payment does not match this checkout.", 400);
    }
    if (payment.data.currency.toUpperCase() !== "INR" || payment.data.method !== input.method) {
      throw new ApiError("The payment does not match the selected method or currency.", 400);
    }
    const { subtotal } = await resolveCustomerOrderItems(service, input.items);
    if (Math.round(subtotal * 100) !== payment.data.amount) {
      throw new ApiError("The payment amount does not match the verified cart total.", 400);
    }

    if (payment.data.status === "authorized") {
      const captureResponse = await fetch(
        `https://api.razorpay.com/v1/payments/${encodeURIComponent(input.razorpay_payment_id)}/capture`,
        {
          method: "POST",
          headers: {
            Authorization: `Basic ${Buffer.from(`${keyId}:${secret}`).toString("base64")}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ amount: payment.data.amount, currency: payment.data.currency }),
          cache: "no-store",
        },
      );
      if (!captureResponse.ok) {
        console.error("Could not capture authorized Razorpay payment.", captureResponse.status);
        throw new ApiError("Payment authorization succeeded, but capture failed. Contact support before retrying.", 502);
      }
      paymentPayload = await captureResponse.json();
      payment = razorpayPaymentResponse.safeParse(paymentPayload);
      if (!payment.success) throw new ApiError("The payment provider returned invalid captured payment details.", 502);
    }

    if (payment.data.status !== "captured") throw new ApiError("The payment has not been captured.", 400);

    const order = await createCustomerOrder(
      service,
      user,
      input,
      {
        method: "razorpay",
        providerOrderId: input.razorpay_order_id,
        providerPaymentId: input.razorpay_payment_id,
        gatewayMethod: input.method,
      },
      payment.data.amount,
    );
    return Response.json(order, { status: 201 });
  } catch (error) {
    return apiErrorResponse(error);
  }
}

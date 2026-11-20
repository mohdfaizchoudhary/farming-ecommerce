import { checkoutInputSchema, createCustomerOrder } from "@/lib/checkout-api";
import { loadOrders } from "@/lib/order-api";
import { apiErrorResponse, ApiError, requireUser } from "@/lib/supabase-server";

export async function GET(request: Request) {
  try {
    const { user, service } = await requireUser(request);
    const orders = await loadOrders(service, user.id);
    return Response.json({ orders });
  } catch (error) {
    return apiErrorResponse(error);
  }
}

export async function POST(request: Request) {
  try {
    const { user, service } = await requireUser(request);
    const body: unknown = await request.json();
    const parsed = checkoutInputSchema.safeParse(body);
    if (!parsed.success) throw new ApiError(parsed.error.issues[0]?.message ?? "Invalid order details.", 400);
    const order = await createCustomerOrder(service, user, parsed.data, { method: "cod" });
    return Response.json(order, { status: 201 });
  } catch (error) {
    return apiErrorResponse(error);
  }
}

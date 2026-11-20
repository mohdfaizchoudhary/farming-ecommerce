import { loadOrders } from "@/lib/order-api";
import { apiErrorResponse, requireAdmin } from "@/lib/supabase-server";

export const dynamic = "force-dynamic";

const orderRoles = ["owner", "fulfilment", "support", "finance"];

export async function GET(request: Request) {
  try {
    const { service } = await requireAdmin(request, orderRoles);
    const orders = await loadOrders(service);
    return Response.json({ orders });
  } catch (error) {
    return apiErrorResponse(error);
  }
}

import { z } from "zod";
import { apiErrorResponse, ApiError, requireAdmin } from "@/lib/supabase-server";

export const dynamic = "force-dynamic";

const orderRoles = ["owner", "fulfilment", "support"];
const statusInput = z.object({
  status: z.enum(["confirmed", "processing", "packed", "shipped", "delivered", "cancelled"]),
});

export async function PATCH(request: Request, context: { params: { id: string } }) {
  try {
    const { user, service } = await requireAdmin(request, orderRoles);
    const orderId = context.params.id;
    if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(orderId)) {
      throw new ApiError("Invalid order identifier.", 400);
    }
    const body: unknown = await request.json();
    const parsed = statusInput.safeParse(body);
    if (!parsed.success) throw new ApiError("Select a valid order status.", 400);

    const { error } = await service.rpc("admin_update_order_status", {
      p_order_id: orderId,
      p_status: parsed.data.status,
    });
    if (error) {
      if (error.message.includes("Order not found")) throw new ApiError("Order not found.", 404);
      if (error.message.includes("Invalid order status")) throw new ApiError("Select a valid order status.", 400);
      console.error("Could not update order status in Supabase.", error);
      throw new ApiError("Could not update the order status.", 502);
    }

    const { error: auditError } = await service.from("audit_logs").insert({
      actor_user_id: null,
      action: "order.status.updated",
      entity_type: "order",
      entity_id: orderId,
      metadata: { status: parsed.data.status, actor_email: user.email },
    });
    if (auditError) console.error("Could not record the order status audit entry.", auditError);

    return Response.json({ id: orderId, status: parsed.data.status });
  } catch (error) {
    return apiErrorResponse(error);
  }
}

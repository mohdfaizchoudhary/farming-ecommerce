import { apiErrorResponse, getSupabasePublicServerClient } from "@/lib/supabase-server";
import { loadCatalog } from "@/lib/catalog-api";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const products = await loadCatalog(getSupabasePublicServerClient());
    return Response.json({ products });
  } catch (error) {
    return apiErrorResponse(error);
  }
}

import { apiErrorResponse, ApiError, requireAdmin } from "@/lib/supabase-server";
import { loadCatalog } from "@/lib/catalog-api";
import { productInputSchema } from "@/lib/product-input";

export const dynamic = "force-dynamic";

const catalogRoles = ["owner", "catalogue_manager", "inventory_manager"];

export async function PATCH(request: Request, context: { params: { id: string } }) {
  try {
    const productId = context.params.id;
    if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(productId)) {
      throw new ApiError("Invalid product identifier.", 400);
    }
    const { service } = await requireAdmin(request, catalogRoles);
    const body: unknown = await request.json();
    const parsed = productInputSchema.safeParse(body);
    if (!parsed.success) throw new ApiError(parsed.error.issues[0]?.message ?? "Invalid product details.", 400);
    const input = parsed.data;
    if (input.mrp < input.price) throw new ApiError("MRP must be equal to or greater than the selling price.", 400);

    const { data: existing, error: existingError } = await service
      .from("products")
      .select("slug,sku")
      .eq("id", productId)
      .maybeSingle();
    if (existingError) throw new ApiError("Could not load the product being edited.", 502);
    if (!existing) throw new ApiError("Product not found.", 404);
    const { data: category, error: categoryError } = await service
      .from("categories")
      .select("slug")
      .eq("slug", input.category)
      .eq("active", true)
      .maybeSingle();
    if (categoryError) throw new ApiError("Could not verify the selected category.", 502);
    if (!category) throw new ApiError("Select an active product category.", 400);

    const { error: saveError } = await service.rpc("admin_upsert_catalog_product", {
      p_product_id: productId,
      p_category_slug: input.category,
      p_name: input.name,
      p_slug: existing.slug,
      p_sku: existing.sku,
      p_description: input.description,
      p_attributes: { handling: input.handling, variantType: input.variantType },
      p_price: input.price,
      p_mrp: input.mrp,
      p_stock: input.stock,
      p_unit_label: input.unit,
      p_image_url: input.image || "/sms-farmstead-logo.jpeg",
      p_active: input.published,
    });
    if (saveError) {
      console.error("Could not update product in Supabase.", saveError);
      throw new ApiError("Could not save product changes.", 502);
    }
    const products = await loadCatalog(service, true);
    const product = products.find((entry) => entry.id === productId);
    if (!product) throw new ApiError("Product was updated but could not be reloaded.", 502);
    return Response.json({ product });
  } catch (error) {
    return apiErrorResponse(error);
  }
}

export async function DELETE(request: Request, context: { params: { id: string } }) {
  try {
    const { service } = await requireAdmin(request, catalogRoles);
    const productId = context.params.id;
    if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(productId)) {
      throw new ApiError("Invalid product identifier.", 400);
    }
    const { error } = await service.rpc("admin_archive_catalog_product", { p_product_id: productId });
    if (error) {
      console.error("Could not archive product in Supabase.", error);
      throw new ApiError("Could not archive product.", 502);
    }
    return Response.json({ success: true });
  } catch (error) {
    return apiErrorResponse(error);
  }
}

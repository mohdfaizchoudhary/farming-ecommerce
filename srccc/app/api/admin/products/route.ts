import { loadCatalog } from "@/lib/catalog-api";
import { apiErrorResponse, ApiError, getSupabaseServiceClient, requireAdmin } from "@/lib/supabase-server";
import { productInputSchema } from "@/lib/product-input";

export const dynamic = "force-dynamic";

const catalogRoles = ["owner", "catalogue_manager", "inventory_manager"];

function makeSlug(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "product";
}

async function saveProduct(request: Request, productId: string | null) {
  const { service } = await requireAdmin(request, catalogRoles);
  const body: unknown = await request.json();
  const parsed = productInputSchema.safeParse(body);
  if (!parsed.success) throw new ApiError(parsed.error.issues[0]?.message ?? "Invalid product details.", 400);
  const input = parsed.data;
  if (input.mrp < input.price) throw new ApiError("MRP must be equal to or greater than the selling price.", 400);

  const { data: category, error: categoryError } = await service
    .from("categories")
    .select("slug")
    .eq("slug", input.category)
    .eq("active", true)
    .maybeSingle();
  if (categoryError) throw new ApiError("Could not verify the selected category.", 502);
  if (!category) throw new ApiError("Select an active product category.", 400);

  let slug = makeSlug(input.name);
  let sku = `SKU-${crypto.randomUUID().replace(/-/g, "").slice(0, 20).toUpperCase()}`;
  if (productId) {
    const { data: existing, error: existingError } = await service
      .from("products")
      .select("slug,sku")
      .eq("id", productId)
      .maybeSingle();
    if (existingError) throw new ApiError("Could not load the product being edited.", 502);
    if (!existing) throw new ApiError("Product not found.", 404);
    slug = existing.slug;
    sku = existing.sku;
  } else {
    const { data: collision, error: slugError } = await service
      .from("products")
      .select("id")
      .eq("slug", slug)
      .maybeSingle();
    if (slugError) throw new ApiError("Could not check the product URL.", 502);
    if (collision) slug = `${slug}-${crypto.randomUUID().slice(0, 8)}`;
  }

  const { data: savedId, error: saveError } = await service.rpc("admin_upsert_catalog_product", {
    p_product_id: productId,
    p_category_slug: input.category,
    p_name: input.name,
    p_slug: slug,
    p_sku: sku,
    p_description: input.description,
    p_attributes: { handling: input.handling, variantType: input.variantType },
    p_price: input.price,
    p_mrp: input.mrp,
    p_stock: input.stock,
    p_unit_label: input.unit,
    p_image_url: input.image || "/sms-farmstead-logo.jpeg",
    p_active: input.published,
  });
  if (saveError || typeof savedId !== "string") {
    console.error("Could not save product in Supabase.", saveError);
    throw new ApiError("Could not save the product. Check its details and try again.", 502);
  }

  const products = await loadCatalog(service, true);
  const product = products.find((entry) => entry.id === savedId);
  if (!product) throw new ApiError("Product was saved but could not be reloaded.", 502);
  return product;
}

export async function GET(request: Request) {
  try {
    const { service } = await requireAdmin(request, catalogRoles);
    const products = await loadCatalog(service, true);
    return Response.json({ products });
  } catch (error) {
    return apiErrorResponse(error);
  }
}

export async function POST(request: Request) {
  try {
    const product = await saveProduct(request, null);
    return Response.json({ product }, { status: 201 });
  } catch (error) {
    return apiErrorResponse(error);
  }
}

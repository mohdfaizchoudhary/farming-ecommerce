import type { Product } from "@/lib/catalog";
import { ApiError } from "@/lib/supabase-server";
import type { SupabaseClient } from "@supabase/supabase-js";

export type CatalogRecord = Product & {
  sku: string;
  published: boolean;
  handling: string;
  variantType: string;
};

type DbProduct = {
  id: string;
  category_id: string;
  name: string;
  slug: string;
  sku: string;
  description: string;
  status: string;
  attributes: Record<string, unknown> | null;
};

export async function loadCatalog(
  supabase: SupabaseClient,
  includeUnpublished = false,
): Promise<CatalogRecord[]> {
  let productQuery = supabase
    .from("products")
    .select("id,category_id,name,slug,sku,description,status,attributes")
    .order("created_at", { ascending: false });

  if (includeUnpublished) productQuery = productQuery.neq("status", "archived");
  else productQuery = productQuery.eq("status", "active");

  const { data: rawProducts, error: productError } = await productQuery;
  if (productError) throw new ApiError("Could not load products from Supabase.", 502);
  const dbProducts = (rawProducts ?? []) as DbProduct[];
  if (!dbProducts.length) return [];

  const ids = dbProducts.map((product) => product.id);
  const categoryIds = [...new Set(dbProducts.map((product) => product.category_id))];
  const [categoryResult, variantResult, imageResult] = await Promise.all([
    supabase.from("categories").select("id,slug").in("id", categoryIds),
    supabase.from("product_variants")
      .select("id,product_id,sku,variant_name,unit_label,price,mrp,stock_quantity,active")
      .in("product_id", ids)
      .order("id"),
    supabase.from("product_images").select("product_id,url,sort_order").in("product_id", ids).order("sort_order"),
  ]);
  if (categoryResult.error || variantResult.error || imageResult.error) {
    throw new ApiError("Could not load complete product details from Supabase.", 502);
  }

  const categoryById = new Map((categoryResult.data ?? []).map((category) => [category.id, category.slug]));
  const variantsByProduct = new Map<string, NonNullable<typeof variantResult.data>>();
  for (const variant of variantResult.data ?? []) {
    const variants = variantsByProduct.get(variant.product_id) ?? [];
    variants.push(variant);
    variantsByProduct.set(variant.product_id, variants);
  }
  const imageByProduct = new Map<string, string>();
  for (const image of imageResult.data ?? []) {
    if (!imageByProduct.has(image.product_id)) imageByProduct.set(image.product_id, image.url);
  }

  return dbProducts.flatMap((product): CatalogRecord[] => {
    const variant = (variantsByProduct.get(product.id) ?? []).find((item) => item.active)
      ?? (includeUnpublished ? variantsByProduct.get(product.id)?.[0] : undefined);
    const category = categoryById.get(product.category_id);
    if (!variant || !category) return [];
    const attributes = product.attributes ?? {};
    return [{
      id: product.id,
      slug: product.slug,
      name: product.name,
      category,
      price: Number(variant.price),
      mrp: Number(variant.mrp),
      unit: variant.unit_label,
      description: product.description,
      image: imageByProduct.get(product.id) ?? "/sms-farmstead-logo.jpeg",
      stock: Number(variant.stock_quantity),
      sku: variant.sku,
      published: product.status === "active",
      handling: attributes.handling === "Cold-Chain" || attributes.handling === "Live Certified"
        ? attributes.handling
        : "Standard",
      variantType: typeof attributes.variantType === "string" ? attributes.variantType : variant.variant_name,
    }];
  });
}

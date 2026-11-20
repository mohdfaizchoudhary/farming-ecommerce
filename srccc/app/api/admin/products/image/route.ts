import { apiErrorResponse, ApiError, requireAdmin } from "@/lib/supabase-server";

export const dynamic = "force-dynamic";

const catalogRoles = ["owner", "catalogue_manager", "inventory_manager"];
const allowedTypes: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

export async function POST(request: Request) {
  try {
    const { user, service } = await requireAdmin(request, catalogRoles);
    const form = await request.formData();
    const file = form.get("file");
    if (!(file instanceof File)) throw new ApiError("Choose an image to upload.", 400);
    const extension = allowedTypes[file.type];
    if (!extension) throw new ApiError("Use a JPG, PNG, or WebP image.", 400);
    if (file.size > 5 * 1024 * 1024) throw new ApiError("Image size must be 5 MB or less.", 400);

    const path = `${user.id}/${crypto.randomUUID()}.${extension}`;
    const { error } = await service.storage
      .from("product-images")
      .upload(path, file, { contentType: file.type, upsert: false });
    if (error) {
      console.error("Could not upload product image to Supabase Storage.", error);
      throw new ApiError("Image upload failed. Check that the product-images bucket migration has been applied.", 502);
    }

    const { data } = service.storage.from("product-images").getPublicUrl(path);
    return Response.json({ url: data.publicUrl });
  } catch (error) {
    return apiErrorResponse(error);
  }
}

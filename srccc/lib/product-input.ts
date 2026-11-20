import { z } from "zod";

export const productInputSchema = z.object({
  name: z.string().trim().min(1).max(200),
  category: z.string().trim().min(1),
  image: z.string().trim().max(2048, "The image URL is too long. Upload the image file instead."),
  unit: z.string().trim().min(1).max(100),
  description: z.string().trim().max(5000),
  price: z.number().finite().min(0),
  mrp: z.number().finite().min(0),
  stock: z.number().int().min(0),
  handling: z.enum(["Cold-Chain", "Live Certified", "Standard"]),
  variantType: z.string().trim().min(1).max(100),
  published: z.boolean(),
});

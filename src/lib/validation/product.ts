import { z } from "zod";

export const productSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name is too long"),

  price: z.string().regex(/^\d+(\.\d{1,2})?$/, "Price must be a valid number"),

  isFeatured: z.boolean().optional(),
  isArchived: z.boolean().optional(),
});
export type ProductInput = z.infer<typeof productSchema>;
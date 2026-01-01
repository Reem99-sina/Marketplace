import { z } from "zod";
export const checkoutSchema = z.object({
  phone: z
    .string()
    .min(5, "Phone must be at least 5 characters")
    .max(20, "Phone is too long"),
  address: z.string().min(5, "Address is required"),
  commission: z.number("commission is required"),
});

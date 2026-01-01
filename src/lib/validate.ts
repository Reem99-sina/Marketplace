import { ZodSchema } from "zod";

export function validate<T>(schema: ZodSchema<T>, data: unknown) {
  const parsed = schema.safeParse(data);
  if (!parsed.success) {
    return {
      success: false,
      errors: parsed.error.flatten().fieldErrors,
    };
  }
  return { success: true, data: parsed.data };
}
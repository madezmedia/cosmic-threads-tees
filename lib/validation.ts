import { z } from "zod"
import { AppError } from "@/lib/error"

export async function validateRequest<T>(request: Request, schema: z.ZodSchema<T>): Promise<T> {
  try {
    const body = await request.json()
    return schema.parse(body)
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new AppError(
        `Validation error: ${error.errors.map((e) => `${e.path.join(".")}: ${e.message}`).join(", ")}`,
        400,
      )
    }

    throw new AppError("Invalid request body", 400)
  }
}

// Common validation schemas
export const userProfileSchema = z.object({
  full_name: z.string().min(1).max(100).optional(),
  avatar_url: z.string().url().optional().nullable(),
})

export const projectSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().max(500).optional().nullable(),
  is_public: z.boolean().optional(),
})

export const designSchema = z.object({
  project_id: z.string().uuid(),
  name: z.string().min(1).max(100),
  prompt: z.string().min(1).max(1000),
  metadata: z.record(z.any()).optional().nullable(),
})

export const orderSchema = z.object({
  design_id: z.string().uuid(),
  amount: z.number().positive(),
  shipping_address: z.record(z.any()).optional().nullable(),
})


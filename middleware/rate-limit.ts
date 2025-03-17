import type { NextRequest, NextResponse } from "next/server"
import { rateLimit, rateLimitResponse } from "@/lib/rate-limit"

export async function rateLimitMiddleware(
  request: NextRequest,
  endpoint: string,
  limit: number,
  window: number,
): Promise<NextResponse | null> {
  // Get the IP address from the request
  const ip = request.ip || "127.0.0.1"

  // Apply rate limiting
  const rateLimitResult = await rateLimit(ip, endpoint, { limit, window })

  // If rate limit exceeded, return 429 response
  if (!rateLimitResult.success) {
    return rateLimitResponse(rateLimitResult)
  }

  // Otherwise, continue with the request
  return null
}


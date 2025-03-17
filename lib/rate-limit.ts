import redis from "@/lib/redis" // Updated to use default import
import { NextResponse } from "next/server"

export interface RateLimitConfig {
  limit: number
  window: number // in seconds
}

export async function rateLimit(
  ip: string,
  endpoint: string,
  config: RateLimitConfig,
): Promise<{ success: boolean; limit: number; remaining: number; reset: number }> {
  const key = `rate-limit:${endpoint}:${ip}`

  // Get the current count and expiry time
  const [count, ttl] = await Promise.all([redis.incr(key), redis.ttl(key)])

  // If this is the first request, set the expiry time
  if (count === 1) {
    await redis.expire(key, config.window)
  }

  const reset = ttl === -1 ? config.window : ttl
  const remaining = Math.max(0, config.limit - count)
  const success = count <= config.limit

  return { success, limit: config.limit, remaining, reset }
}

export function rateLimitResponse(rateLimitResult: {
  limit: number
  remaining: number
  reset: number
}): NextResponse {
  return NextResponse.json(
    { error: "Too many requests. Please try again later." },
    {
      status: 429,
      headers: {
        "X-RateLimit-Limit": rateLimitResult.limit.toString(),
        "X-RateLimit-Remaining": rateLimitResult.remaining.toString(),
        "X-RateLimit-Reset": rateLimitResult.reset.toString(),
      },
    },
  )
}


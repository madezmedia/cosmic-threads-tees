import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// In-memory cache
const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_TTL = 60 * 60 * 1000; // 1 hour

/**
 * Middleware for caching API responses
 * This helps improve performance for slow API calls
 */
export async function withCache(
  req: NextRequest,
  handler: () => Promise<NextResponse>
) {
  // Only cache GET requests
  if (req.method !== "GET") {
    return handler();
  }

  // Create a cache key based on the URL
  const cacheKey = req.url;

  // Check if we have a cached response
  const cached = cache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    console.log(`[Cache] Hit for ${cacheKey}`);
    return NextResponse.json(cached.data);
  }

  console.log(`[Cache] Miss for ${cacheKey}`);

  // Get the response from the handler
  const response = await handler();
  
  // Only cache successful responses
  if (response.status === 200) {
    try {
      // Clone the response and extract the data
      const clonedResponse = response.clone();
      const data = await clonedResponse.json();
      
      // Store in cache
      cache.set(cacheKey, { data, timestamp: Date.now() });
      
      // Log cache storage
      console.log(`[Cache] Stored data for ${cacheKey}`);
    } catch (error) {
      console.error("[Cache] Failed to cache response:", error);
    }
  }

  return response;
}

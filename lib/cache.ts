import redis from "@/lib/redis" // Updated to use default import

export interface CacheOptions {
  ttl?: number // Time to live in seconds
  prefix?: string
}

export async function getFromCache<T>(key: string, options?: CacheOptions): Promise<T | null> {
  const cacheKey = options?.prefix ? `${options.prefix}:${key}` : key
  return await redis.get(cacheKey)
}

export async function setInCache<T>(key: string, value: T, options?: CacheOptions): Promise<void> {
  const cacheKey = options?.prefix ? `${options.prefix}:${key}` : key

  if (options?.ttl) {
    await redis.set(cacheKey, value, { ex: options.ttl })
  } else {
    await redis.set(cacheKey, value)
  }
}

export async function invalidateCache(key: string, options?: CacheOptions): Promise<void> {
  const cacheKey = options?.prefix ? `${options.prefix}:${key}` : key
  await redis.del(cacheKey)
}

export async function invalidateCachePattern(pattern: string, options?: CacheOptions): Promise<void> {
  const cachePattern = options?.prefix ? `${options.prefix}:${pattern}` : pattern
  const keys = await redis.keys(cachePattern)

  if (keys.length > 0) {
    await redis.del(keys)
  }
}


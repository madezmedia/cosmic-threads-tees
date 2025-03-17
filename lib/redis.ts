import { Redis } from "@upstash/redis"

// The issue is that the environment variable contains a Redis protocol URL (rediss://)
// but the Upstash REST client requires an HTTPS URL
// Let's convert the URL format if needed
const redisUrl = process.env.UPSTASH_REDIS_REST_URL || ""
const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN || ""

// Convert rediss:// URL to https:// format if needed
const formattedUrl = redisUrl.startsWith("rediss://")
  ? redisUrl.replace(/^rediss:\/\/.*?@([^:]+).*$/, "https://$1")
  : redisUrl

// Create Redis client using the properly formatted URL
const redis = new Redis({
  url: formattedUrl,
  token: redisToken,
})

// Export as both default and named export for compatibility
export { redis }
export default redis


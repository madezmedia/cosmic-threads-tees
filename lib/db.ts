import { createServerSupabaseClient } from "@/lib/supabase/server"
import { getFromCache, setInCache } from "@/lib/cache"

export async function getById<T>(
  table: string,
  id: string,
  options?: {
    select?: string
    cache?: boolean
    cacheTtl?: number
  },
): Promise<T | null> {
  // Try to get from cache if caching is enabled
  if (options?.cache) {
    const cacheKey = `${table}:${id}`
    const cached = await getFromCache<T>(cacheKey)

    if (cached) {
      return cached
    }
  }

  // If not in cache or caching is disabled, get from database
  const supabase = createServerSupabaseClient()

  const query = supabase
    .from(table)
    .select(options?.select || "*")
    .eq("id", id)
    .single()

  const { data, error } = await query

  if (error) {
    if (error.code === "PGRST116") {
      // Record not found
      return null
    }

    throw new Error(`Error fetching ${table} with id ${id}: ${error.message}`)
  }

  // Store in cache if caching is enabled
  if (options?.cache) {
    const cacheKey = `${table}:${id}`
    await setInCache(cacheKey, data, { ttl: options.cacheTtl || 300 })
  }

  return data as T
}

export async function query<T>(
  table: string,
  options: {
    select?: string
    filters?: Record<string, any>
    order?: { column: string; ascending?: boolean }
    limit?: number
    offset?: number
    cache?: boolean
    cacheTtl?: number
  },
): Promise<T[]> {
  // Try to get from cache if caching is enabled
  if (options.cache) {
    const cacheKey = `${table}:query:${JSON.stringify(options)}`
    const cached = await getFromCache<T[]>(cacheKey)

    if (cached) {
      return cached
    }
  }

  // If not in cache or caching is disabled, query the database
  const supabase = createServerSupabaseClient()

  let query = supabase.from(table).select(options.select || "*")

  // Apply filters
  if (options.filters) {
    for (const [key, value] of Object.entries(options.filters)) {
      query = query.eq(key, value)
    }
  }

  // Apply ordering
  if (options.order) {
    query = query.order(options.order.column, {
      ascending: options.order.ascending !== false,
    })
  }

  // Apply pagination
  if (options.limit) {
    query = query.limit(options.limit)
  }

  if (options.offset) {
    query = query.range(options.offset, options.offset + (options.limit || 10) - 1)
  }

  const { data, error } = await query

  if (error) {
    throw new Error(`Error querying ${table}: ${error.message}`)
  }

  // Store in cache if caching is enabled
  if (options.cache) {
    const cacheKey = `${table}:query:${JSON.stringify(options)}`
    await setInCache(cacheKey, data, { ttl: options.cacheTtl || 300 })
  }

  return data as T[]
}


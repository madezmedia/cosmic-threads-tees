import { createServerSupabaseClient } from "@/lib/supabase/server"
import redis from "@/lib/redis"
import { NextResponse } from "next/server"

// Get all public projects
export async function GET(request: Request) {
  try {
    const url = new URL(request.url)
    const page = Number.parseInt(url.searchParams.get("page") || "1")
    const limit = Number.parseInt(url.searchParams.get("limit") || "10")

    // Calculate offset
    const offset = (page - 1) * limit

    const supabase = createServerSupabaseClient()

    // Try to get from cache first
    const cacheKey = `public:projects:${page}:${limit}`
    const cachedProjects = await redis.get(cacheKey)

    if (cachedProjects) {
      return NextResponse.json(cachedProjects)
    }

    // If not in cache, get from database
    const {
      data: projects,
      error,
      count,
    } = await supabase
      .from("projects")
      .select("*, users(full_name, avatar_url)", { count: "exact" })
      .eq("is_public", true)
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    const result = {
      projects,
      pagination: {
        total: count,
        page,
        limit,
        pages: Math.ceil((count || 0) / limit),
      },
    }

    // Store in cache for 5 minutes
    await redis.set(cacheKey, result, { ex: 300 })

    return NextResponse.json(result)
  } catch (error) {
    console.error("Error fetching public projects:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}


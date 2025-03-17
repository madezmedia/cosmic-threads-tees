import { createServerSupabaseClient } from "@/lib/supabase/server"
import redis from "@/lib/redis"
import { NextResponse } from "next/server"

// Get a specific public project
export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const projectId = params.id

    const supabase = createServerSupabaseClient()

    // Try to get from cache first
    const cacheKey = `public:project:${projectId}`
    const cachedProject = await redis.get(cacheKey)

    if (cachedProject) {
      return NextResponse.json({ project: cachedProject })
    }

    // If not in cache, get from database
    const { data: project, error } = await supabase
      .from("projects")
      .select("*, users(full_name, avatar_url), designs(id, name, image_url, created_at)")
      .eq("id", projectId)
      .eq("is_public", true)
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    // Store in cache for 5 minutes
    await redis.set(cacheKey, project, { ex: 300 })

    return NextResponse.json({ project })
  } catch (error) {
    console.error("Error fetching public project:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}


import { createServerSupabaseClient } from "@/lib/supabase/server"
import redis from "@/lib/redis"
import { NextResponse } from "next/server"

// Get all projects for the current user
export async function GET() {
  try {
    const supabase = createServerSupabaseClient()

    // Get the current user
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Try to get from cache first
    const cacheKey = `projects:${user.id}`
    const cachedProjects = await redis.get(cacheKey)

    if (cachedProjects) {
      return NextResponse.json({ projects: cachedProjects })
    }

    // If not in cache, get from database
    const { data: projects, error } = await supabase
      .from("projects")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    // Store in cache for 5 minutes
    await redis.set(cacheKey, projects, { ex: 300 })

    return NextResponse.json({ projects })
  } catch (error) {
    console.error("Error fetching projects:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// Create a new project
export async function POST(request: Request) {
  try {
    const { name, description, is_public } = await request.json()

    const supabase = createServerSupabaseClient()

    // Get the current user
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Create the project
    const { data: project, error } = await supabase
      .from("projects")
      .insert({
        name,
        description,
        user_id: user.id,
        is_public: is_public || false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    // Invalidate cache
    await redis.del(`projects:${user.id}`)

    return NextResponse.json({ project })
  } catch (error) {
    console.error("Error creating project:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}


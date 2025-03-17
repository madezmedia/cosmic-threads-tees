import { createServerSupabaseClient } from "@/lib/supabase/server"
import redis from "@/lib/redis"
import { NextResponse } from "next/server"

// Create a new design
export async function POST(request: Request) {
  try {
    const { project_id, name, prompt, metadata } = await request.json()

    const supabase = createServerSupabaseClient()

    // Get the current user
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if the user has access to the project
    const { data: project, error: projectError } = await supabase
      .from("projects")
      .select("user_id")
      .eq("id", project_id)
      .single()

    if (projectError) {
      return NextResponse.json({ error: projectError.message }, { status: 400 })
    }

    if (project.user_id !== user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // Create the design
    const { data: design, error } = await supabase
      .from("designs")
      .insert({
        project_id,
        name,
        prompt,
        metadata,
        status: "draft",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    // Invalidate cache
    await redis.del(`project:${project_id}`)

    return NextResponse.json({ design })
  } catch (error) {
    console.error("Error creating design:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}


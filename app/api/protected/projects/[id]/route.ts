import { createServerSupabaseClient } from "@/lib/supabase/server"
import redis from "@/lib/redis"
import { NextResponse } from "next/server"

// Get a specific project
export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const projectId = params.id

    const supabase = createServerSupabaseClient()

    // Get the current user
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Try to get from cache first
    const cacheKey = `project:${projectId}`
    const cachedProject = await redis.get(cacheKey)

    if (cachedProject) {
      // Check if the user has access to this project
      if (cachedProject.user_id === user.id || cachedProject.is_public) {
        return NextResponse.json({ project: cachedProject })
      } else {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 })
      }
    }

    // If not in cache, get from database
    const { data: project, error } = await supabase
      .from("projects")
      .select("*, designs(*)")
      .eq("id", projectId)
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    // Check if the user has access to this project
    if (project.user_id !== user.id && !project.is_public) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // Store in cache for 5 minutes
    await redis.set(cacheKey, project, { ex: 300 })

    return NextResponse.json({ project })
  } catch (error) {
    console.error("Error fetching project:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// Update a project
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const projectId = params.id
    const { name, description, is_public } = await request.json()

    const supabase = createServerSupabaseClient()

    // Get the current user
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if the user owns this project
    const { data: existingProject, error: fetchError } = await supabase
      .from("projects")
      .select("user_id")
      .eq("id", projectId)
      .single()

    if (fetchError) {
      return NextResponse.json({ error: fetchError.message }, { status: 400 })
    }

    if (existingProject.user_id !== user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // Update the project
    const { data: updatedProject, error } = await supabase
      .from("projects")
      .update({
        name,
        description,
        is_public,
        updated_at: new Date().toISOString(),
      })
      .eq("id", projectId)
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    // Invalidate caches
    await redis.del(`project:${projectId}`)
    await redis.del(`projects:${user.id}`)

    return NextResponse.json({ project: updatedProject })
  } catch (error) {
    console.error("Error updating project:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// Delete a project
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const projectId = params.id

    const supabase = createServerSupabaseClient()

    // Get the current user
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if the user owns this project
    const { data: existingProject, error: fetchError } = await supabase
      .from("projects")
      .select("user_id")
      .eq("id", projectId)
      .single()

    if (fetchError) {
      return NextResponse.json({ error: fetchError.message }, { status: 400 })
    }

    if (existingProject.user_id !== user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // Delete the project
    const { error } = await supabase.from("projects").delete().eq("id", projectId)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    // Invalidate caches
    await redis.del(`project:${projectId}`)
    await redis.del(`projects:${user.id}`)

    return NextResponse.json({ message: "Project deleted successfully" })
  } catch (error) {
    console.error("Error deleting project:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}


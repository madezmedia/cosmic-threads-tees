import { createServerSupabaseClient } from "@/lib/supabase/server"
import redis from "@/lib/redis"
import { NextResponse } from "next/server"

// Get the current user's profile
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
    const cacheKey = `user:${user.id}`
    const cachedUser = await redis.get(cacheKey)

    if (cachedUser) {
      return NextResponse.json({ profile: cachedUser })
    }

    // If not in cache, get from database
    const { data: profile, error } = await supabase.from("users").select("*").eq("id", user.id).single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    // Store in cache for 5 minutes
    await redis.set(cacheKey, profile, { ex: 300 })

    return NextResponse.json({ profile })
  } catch (error) {
    console.error("Error fetching user profile:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// Update the current user's profile
export async function PUT(request: Request) {
  try {
    const { full_name, avatar_url } = await request.json()

    const supabase = createServerSupabaseClient()

    // Get the current user
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Update the user profile
    const { data: updatedProfile, error } = await supabase
      .from("users")
      .update({
        full_name,
        avatar_url,
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id)
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    // Invalidate cache
    await redis.del(`user:${user.id}`)

    return NextResponse.json({ profile: updatedProfile })
  } catch (error) {
    console.error("Error updating user profile:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}


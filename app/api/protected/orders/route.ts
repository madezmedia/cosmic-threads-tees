import { createServerSupabaseClient } from "@/lib/supabase/server"
import redis from "@/lib/redis"
import { NextResponse } from "next/server"

// Get all orders for the current user
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
    const cacheKey = `orders:${user.id}`
    const cachedOrders = await redis.get(cacheKey)

    if (cachedOrders) {
      return NextResponse.json({ orders: cachedOrders })
    }

    // If not in cache, get from database
    const { data: orders, error } = await supabase
      .from("orders")
      .select("*, designs(name, image_url, prompt)")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    // Store in cache for 5 minutes
    await redis.set(cacheKey, JSON.stringify(orders), { ex: 300 })

    return NextResponse.json({ orders })
  } catch (error) {
    console.error("Error fetching orders:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// Create a new order
export async function POST(request: Request) {
  try {
    const { design_id, amount, shipping_address } = await request.json()

    const supabase = createServerSupabaseClient()

    // Get the current user
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if the user has access to the design
    const { data: design, error: designError } = await supabase
      .from("designs")
      .select("project_id, projects(user_id)")
      .eq("id", design_id)
      .single()

    if (designError) {
      return NextResponse.json({ error: designError.message }, { status: 400 })
    }

    if (design.projects.user_id !== user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // Create the order
    const { data: order, error } = await supabase
      .from("orders")
      .insert({
        user_id: user.id,
        design_id,
        amount,
        currency: "usd", // Default currency
        status: "pending",
        shipping_address,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    // Invalidate cache
    await redis.del(`orders:${user.id}`)

    return NextResponse.json({ order })
  } catch (error) {
    console.error("Error creating order:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}


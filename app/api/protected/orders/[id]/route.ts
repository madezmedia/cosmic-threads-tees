import { createServerSupabaseClient } from "@/lib/supabase/server"
import redis from "@/lib/redis"
import { NextResponse } from "next/server"

// Get a specific order
export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const orderId = params.id

    const supabase = createServerSupabaseClient()

    // Get the current user
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Try to get from cache first
    const cacheKey = `order:${orderId}`
    const cachedOrder = await redis.get(cacheKey)

    if (cachedOrder) {
      // Check if the user has access to this order
      if (cachedOrder.user_id === user.id) {
        return NextResponse.json({ order: cachedOrder })
      } else {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 })
      }
    }

    // If not in cache, get from database
    const { data: order, error } = await supabase
      .from("orders")
      .select("*, designs(name, image_url, prompt)")
      .eq("id", orderId)
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    // Check if the user has access to this order
    if (order.user_id !== user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // Store in cache for 5 minutes
    await redis.set(cacheKey, order, { ex: 300 })

    return NextResponse.json({ order })
  } catch (error) {
    console.error("Error fetching order:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// Update an order
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const orderId = params.id
    const { status, shipping_address, payment_intent_id } = await request.json()

    const supabase = createServerSupabaseClient()

    // Get the current user
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if the user owns this order
    const { data: existingOrder, error: fetchError } = await supabase
      .from("orders")
      .select("user_id")
      .eq("id", orderId)
      .single()

    if (fetchError) {
      return NextResponse.json({ error: fetchError.message }, { status: 400 })
    }

    if (existingOrder.user_id !== user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // Update the order
    const { data: updatedOrder, error } = await supabase
      .from("orders")
      .update({
        status,
        shipping_address,
        payment_intent_id,
        updated_at: new Date().toISOString(),
      })
      .eq("id", orderId)
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    // Invalidate caches
    await redis.del(`order:${orderId}`)
    await redis.del(`orders:${user.id}`)

    return NextResponse.json({ order: updatedOrder })
  } catch (error) {
    console.error("Error updating order:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// Cancel an order
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const orderId = params.id

    const supabase = createServerSupabaseClient()

    // Get the current user
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if the user owns this order
    const { data: existingOrder, error: fetchError } = await supabase
      .from("orders")
      .select("user_id, status")
      .eq("id", orderId)
      .single()

    if (fetchError) {
      return NextResponse.json({ error: fetchError.message }, { status: 400 })
    }

    if (existingOrder.user_id !== user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // Only allow cancellation of pending orders
    if (existingOrder.status !== "pending") {
      return NextResponse.json({ error: "Only pending orders can be cancelled" }, { status: 400 })
    }

    // Update the order status to cancelled
    const { data: updatedOrder, error } = await supabase
      .from("orders")
      .update({
        status: "cancelled",
        updated_at: new Date().toISOString(),
      })
      .eq("id", orderId)
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    // Invalidate caches
    await redis.del(`order:${orderId}`)
    await redis.del(`orders:${user.id}`)

    return NextResponse.json({ order: updatedOrder })
  } catch (error) {
    console.error("Error cancelling order:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}


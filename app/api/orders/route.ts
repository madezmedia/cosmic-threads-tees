import { NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import { v4 as uuidv4 } from "uuid"

export async function POST(request: Request) {
  try {
    const supabase = createServerSupabaseClient()

    // Get the current user
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const orderData = await request.json()

    // Validate the order data
    if (!orderData.items || !Array.isArray(orderData.items) || orderData.items.length === 0) {
      return NextResponse.json({ error: "Invalid order data" }, { status: 400 })
    }

    // Create the order
    const orderId = uuidv4()
    const now = new Date().toISOString()

    const { error: orderError } = await supabase.from("orders").insert({
      id: orderId,
      user_id: user.id,
      status: "pending",
      total: orderData.total,
      subtotal: orderData.subtotal,
      tax: orderData.tax,
      shipping: orderData.shipping,
      discount: orderData.discount || 0,
      shipping_address: orderData.shipping_address || {},
      created_at: now,
      updated_at: now,
    })

    if (orderError) {
      throw orderError
    }

    // Create order items
    const orderItems = orderData.items.map((item: any) => ({
      order_id: orderId,
      product_id: item.product_id,
      variant_id: item.variant_id,
      quantity: item.quantity,
      price: item.price,
      created_at: now,
      updated_at: now,
    }))

    const { error: itemsError } = await supabase.from("order_items").insert(orderItems)

    if (itemsError) {
      throw itemsError
    }

    return NextResponse.json({
      success: true,
      order: {
        id: orderId,
        status: "pending",
        created_at: now,
      },
    })
  } catch (error) {
    console.error("Error creating order:", error)
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 })
  }
}


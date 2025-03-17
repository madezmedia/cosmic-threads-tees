import { NextResponse } from "next/server"
import { createPrintfulOrder } from "@/lib/printful-api"
import type { PrintfulOrder } from "@/lib/printful-api"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const order: PrintfulOrder = body.order

    if (!order || !order.recipient || !order.items || order.items.length === 0) {
      return NextResponse.json({ error: "Invalid order data" }, { status: 400 })
    }

    const result = await createPrintfulOrder(order)
    return NextResponse.json({ result })
  } catch (error) {
    console.error("Error creating order:", error)
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 })
  }
}


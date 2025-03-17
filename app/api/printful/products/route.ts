import { NextResponse } from "next/server"
import { fetchPrintfulProducts } from "@/lib/printful-api"

export async function GET() {
  try {
    const products = await fetchPrintfulProducts()
    return NextResponse.json({ products })
  } catch (error) {
    console.error("Error fetching products:", error)
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 })
  }
}


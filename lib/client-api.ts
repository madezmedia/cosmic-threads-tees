import type { PrintfulOrder, PrintfulProduct } from "./printful-api"

/**
 * Fetch all products from our API
 */
export async function getProducts(): Promise<PrintfulProduct[]> {
  try {
    const response = await fetch("/api/printful/products")

    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    return data.products
  } catch (error) {
    console.error("Error fetching products:", error)
    throw error
  }
}

/**
 * Fetch a specific product from our API
 */
export async function getProduct(productId: number): Promise<PrintfulProduct> {
  try {
    const response = await fetch(`/api/printful/products/${productId}`)

    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    return data.product
  } catch (error) {
    console.error(`Error fetching product ${productId}:`, error)
    throw error
  }
}

/**
 * Create a new order through our API
 */
export async function createOrder(order: PrintfulOrder) {
  try {
    const response = await fetch("/api/printful/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ order }),
    })

    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Error creating order:", error)
    throw error
  }
}


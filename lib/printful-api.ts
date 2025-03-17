/**
 * Printful API service
 * This file handles all interactions with the Printful API
 */

// Types for Printful API responses
export interface PrintfulProduct {
  id: number
  name: string
  description: string
  thumbnail_url: string
  price: number
  variants: PrintfulVariant[]
}

export interface PrintfulVariant {
  id: number
  name: string
  size: string
  color: string
  price: number
  in_stock: boolean
}

export interface PrintfulOrderItem {
  variant_id: number
  quantity: number
  name?: string
  retail_price?: string
  files?: {
    url: string
    type: "preview" | "print"
  }[]
}

export interface PrintfulOrder {
  recipient: {
    name: string
    address1: string
    city: string
    state_code: string
    country_code: string
    zip: string
    email?: string
    phone?: string
  }
  items: PrintfulOrderItem[]
}

// Base URL for Printful API
const PRINTFUL_API_URL = "https://api.printful.com"

/**
 * Get the authorization header for Printful API requests
 * Uses the PRINTFUL_API_KEY environment variable
 */
export function getAuthHeader() {
  const apiKey = process.env.PRINTFUL_API_KEY

  if (!apiKey) {
    throw new Error("PRINTFUL_API_KEY environment variable is not set")
  }

  return {
    Authorization: `Bearer ${apiKey}`,
  }
}

/**
 * Fetch products from Printful API
 */
export async function fetchPrintfulProducts(): Promise<PrintfulProduct[]> {
  try {
    const response = await fetch(`${PRINTFUL_API_URL}/store/products`, {
      headers: {
        ...getAuthHeader(),
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      throw new Error(`Printful API error: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    return data.result.map((product: any) => ({
      id: product.id,
      name: product.name,
      description: product.description || "",
      thumbnail_url: product.thumbnail_url,
      price: product.retail_price,
      variants: product.variants.map((variant: any) => ({
        id: variant.id,
        name: variant.name,
        size: variant.size,
        color: variant.color,
        price: variant.retail_price,
        in_stock: variant.in_stock,
      })),
    }))
  } catch (error) {
    console.error("Error fetching Printful products:", error)
    throw error
  }
}

/**
 * Fetch a specific product from Printful API
 */
export async function fetchPrintfulProduct(productId: number): Promise<PrintfulProduct> {
  try {
    const response = await fetch(`${PRINTFUL_API_URL}/store/products/${productId}`, {
      headers: {
        ...getAuthHeader(),
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      throw new Error(`Printful API error: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    const product = data.result

    return {
      id: product.id,
      name: product.name,
      description: product.description || "",
      thumbnail_url: product.thumbnail_url,
      price: product.retail_price,
      variants: product.variants.map((variant: any) => ({
        id: variant.id,
        name: variant.name,
        size: variant.size,
        color: variant.color,
        price: variant.retail_price,
        in_stock: variant.in_stock,
      })),
    }
  } catch (error) {
    console.error(`Error fetching Printful product ${productId}:`, error)
    throw error
  }
}

/**
 * Create a new order in Printful
 */
export async function createPrintfulOrder(order: PrintfulOrder) {
  try {
    const response = await fetch(`${PRINTFUL_API_URL}/orders`, {
      method: "POST",
      headers: {
        ...getAuthHeader(),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        recipient: order.recipient,
        items: order.items,
      }),
    })

    if (!response.ok) {
      throw new Error(`Printful API error: ${response.status} ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Error creating Printful order:", error)
    throw error
  }
}

/**
 * Calculate shipping rates for an order
 */
export async function calculateShippingRates(order: PrintfulOrder) {
  try {
    const response = await fetch(`${PRINTFUL_API_URL}/shipping/rates`, {
      method: "POST",
      headers: {
        ...getAuthHeader(),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        recipient: order.recipient,
        items: order.items,
      }),
    })

    if (!response.ok) {
      throw new Error(`Printful API error: ${response.status} ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Error calculating shipping rates:", error)
    throw error
  }
}

/**
 * Upload a file to Printful for printing
 */
export async function uploadPrintfulFile(file: File) {
  try {
    const formData = new FormData()
    formData.append("file", file)

    const response = await fetch(`${PRINTFUL_API_URL}/files`, {
      method: "POST",
      headers: {
        ...getAuthHeader(),
      },
      body: formData,
    })

    if (!response.ok) {
      throw new Error(`Printful API error: ${response.status} ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Error uploading file to Printful:", error)
    throw error
  }
}


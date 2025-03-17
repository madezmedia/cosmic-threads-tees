import { fetchPrintfulProduct } from "./printful-api"

// Wall art product categories based on research
export const WALL_ART_CATEGORIES = {
  FRAMED_POSTERS: {
    name: "Framed Posters",
    description: "High-quality framed posters with various paper options",
    productIds: [2, 172], // Enhanced Matte Paper and Premium Luster Photo Paper
    image: "/images/categories/framed-posters.jpg",
  },
  CANVAS: {
    name: "Canvas Prints",
    description: "Gallery-quality canvas prints with vibrant colors",
    productIds: [1, 162], // Standard Canvas and Framed Canvas
    image: "/images/categories/canvas-prints.jpg",
  },
  METAL: {
    name: "Metal Prints",
    description: "Glossy metal prints with stunning visual impact",
    productIds: [105], // Metal Prints
    image: "/images/categories/metal-prints.jpg",
  },
  POSTER: {
    name: "Posters",
    description: "Affordable high-quality poster prints",
    productIds: [3, 4], // Enhanced Matte Paper Poster and Premium Luster Photo Paper Poster
    image: "/images/categories/posters.jpg",
  },
}

// Common sizes for wall art
export const WALL_ART_SIZES = {
  SMALL: {
    name: "Small",
    dimensions: ["8×10″", "8×12″", "10×10″"],
    recommendedFor: "Small spaces, bathrooms, desks",
  },
  MEDIUM: {
    name: "Medium",
    dimensions: ["12×16″", "12×18″", "16×16″"],
    recommendedFor: "Bedrooms, offices, small living rooms",
  },
  LARGE: {
    name: "Large",
    dimensions: ["18×24″", "20×24″", "20×30″"],
    recommendedFor: "Living rooms, dining rooms, feature walls",
  },
  EXTRA_LARGE: {
    name: "Extra Large",
    dimensions: ["24×36″", "30×40″", "36×36″"],
    recommendedFor: "Large spaces, statement pieces, galleries",
  },
}

// Get all wall art product IDs
export function getAllWallArtProductIds(): number[] {
  return Object.values(WALL_ART_CATEGORIES).flatMap((category) => category.productIds)
}

// Fetch all wall art products
export async function fetchAllWallArtProducts() {
  const productIds = getAllWallArtProductIds()
  const productPromises = productIds.map((id) => fetchPrintfulProduct(id))

  try {
    return await Promise.all(productPromises)
  } catch (error) {
    console.error("Error fetching wall art products:", error)
    throw error
  }
}

// Get products by category
export async function getProductsByCategory(categoryKey: keyof typeof WALL_ART_CATEGORIES) {
  const category = WALL_ART_CATEGORIES[categoryKey]
  if (!category) {
    throw new Error(`Category ${categoryKey} not found`)
  }

  const productPromises = category.productIds.map((id) => fetchPrintfulProduct(id))

  try {
    return await Promise.all(productPromises)
  } catch (error) {
    console.error(`Error fetching products for category ${categoryKey}:`, error)
    throw error
  }
}

// Get variant ID by size
export function getVariantIdBySize(product: any, size: string): number | null {
  if (!product || !product.variants) {
    return null
  }

  const variant = product.variants.find((v: any) => v.name.includes(size) || v.size === size)

  return variant ? variant.id : null
}

// Generate mockup for a wall art product
export async function generateWallArtMockup(imageUrl: string, productId: number, variantId: number) {
  try {
    const response = await fetch("/api/printful/mockups", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        productId,
        variantId,
        imageUrl,
      }),
    })

    if (!response.ok) {
      throw new Error(`Failed to generate mockup: ${response.status} ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Error generating mockup:", error)
    throw error
  }
}


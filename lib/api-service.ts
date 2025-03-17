import { createClientSupabaseClient } from "@/lib/supabase/client"
import type { Design } from "@/lib/types"

// Initialize Supabase client
const supabase = createClientSupabaseClient()

// Handle API responses
const handleResponse = async (promise: Promise<any>) => {
  try {
    const data = await promise
    return { data, error: null }
  } catch (error: any) {
    console.error("API error:", error)
    return { data: null, error: error.message || "An error occurred" }
  }
}

// Design API functions
export const designApi = {
  generateDesign: async (prompt: string, style: string, complexity: number) => {
    return handleResponse(
      fetch("/api/generate-design", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, style, complexity }),
      }).then((res) => res.json()),
    )
  },

  saveDesign: async (design: Partial<Design>) => {
    const { data: user } = await supabase.auth.getUser()

    if (!user.user) {
      return { data: null, error: "User not authenticated" }
    }

    return handleResponse(
      supabase
        .from("designs")
        .insert({ ...design, user_id: user.user.id })
        .select()
        .single(),
    )
  },

  getUserDesigns: async () => {
    const { data: user } = await supabase.auth.getUser()

    if (!user.user) {
      return { data: null, error: "User not authenticated" }
    }

    return handleResponse(
      supabase.from("designs").select("*").eq("user_id", user.user.id).order("created_at", { ascending: false }),
    )
  },
}

// Product API functions
export const productApi = {
  getProducts: async () => {
    return handleResponse(fetch("/api/printful/products").then((res) => res.json()))
  },

  getProductById: async (id: number) => {
    return handleResponse(fetch(`/api/printful/products/${id}`).then((res) => res.json()))
  },

  getWallArtProducts: async () => {
    const { data, error } = await handleResponse(fetch("/api/printful/products").then((res) => res.json()))

    if (error) return { data: null, error }

    // Filter for wall art products
    const wallArtProducts = data.products.filter(
      (p: any) =>
        p.name.toLowerCase().includes("poster") ||
        p.name.toLowerCase().includes("print") ||
        p.name.toLowerCase().includes("canvas"),
    )

    return { data: wallArtProducts, error: null }
  },
}

// Order API functions
export const orderApi = {
  createOrder: async (orderData: any) => {
    return handleResponse(
      fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      }).then((res) => res.json()),
    )
  },

  getUserOrders: async () => {
    const { data: user } = await supabase.auth.getUser()

    if (!user.user) {
      return { data: null, error: "User not authenticated" }
    }

    return handleResponse(
      supabase.from("orders").select("*").eq("user_id", user.user.id).order("created_at", { ascending: false }),
    )
  },

  getOrderById: async (id: string) => {
    return handleResponse(fetch(`/api/orders/${id}`).then((res) => res.json()))
  },
}

// Upload API functions
export const uploadApi = {
  uploadImage: async (file: File) => {
    const formData = new FormData()
    formData.append("file", file)

    return handleResponse(
      fetch("/api/protected/upload", {
        method: "POST",
        body: formData,
      }).then((res) => res.json()),
    )
  },
}

// AI API functions
export const aiApi = {
  enhancePrompt: async (prompt: string, style: string, complexity: number) => {
    return handleResponse(
      fetch("/api/enhance-prompt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, style, complexity }),
      }).then((res) => res.json()),
    )
  },

  generateArtwork: async (prompt: string, style: string) => {
    return handleResponse(
      fetch("/api/generate-artwork", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, style }),
      }).then((res) => res.json()),
    )
  },
}


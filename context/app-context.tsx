"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { createClientSupabaseClient } from "@/lib/supabase/client"
import { useToast } from "@/hooks/use-toast"
import type { Design } from "@/lib/types"
import type { PrintfulProduct } from "@/lib/printful-api"

type User = {
  id: string
  email: string
  full_name?: string
  avatar_url?: string
} | null

type UserRole = "user" | "admin"

type CartItem = {
  id: string
  product: PrintfulProduct
  variantId: number
  design: Design
  quantity: number
  price: number
}

type AppContextType = {
  user: User
  userRole: UserRole | null
  isAuthenticated: boolean
  isLoading: boolean
  currentDesign: Design | null
  setCurrentDesign: (design: Design | null) => void
  selectedProduct: PrintfulProduct | null
  setSelectedProduct: (product: PrintfulProduct | null) => void
  selectedVariantId: number | null
  setSelectedVariantId: (variantId: number | null) => void
  cart: CartItem[]
  addToCart: (item: Omit<CartItem, "id">) => void
  removeFromCart: (itemId: string) => void
  updateCartItem: (itemId: string, quantity: number) => void
  clearCart: () => void
  cartTotal: number
  loadUserProjects: () => Promise<any>
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  register: (email: string, password: string, full_name: string) => Promise<void>
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User>(null)
  const [userRole, setUserRole] = useState<UserRole | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [currentDesign, setCurrentDesign] = useState<Design | null>(null)
  const [selectedProduct, setSelectedProduct] = useState<PrintfulProduct | null>(null)
  const [selectedVariantId, setSelectedVariantId] = useState<number | null>(null)
  const [cart, setCart] = useState<CartItem[]>([])
  const { toast } = useToast()
  const supabase = createClientSupabaseClient()

  // Calculate cart total
  const cartTotal = cart.reduce((total, item) => total + item.price * item.quantity, 0)

  // Load user session on mount
  useEffect(() => {
    async function loadSession() {
      try {
        setIsLoading(true)
        const {
          data: { session },
        } = await supabase.auth.getSession()
        if (session?.user) {
          setUser({
            id: session.user.id,
            email: session.user.email!,
            full_name: session.user.user_metadata?.full_name,
            avatar_url: session.user.user_metadata?.avatar_url,
          })

          // Fetch user role from the database
          const { data } = await supabase.from("users").select("role").eq("id", session.user.id).single()

          if (data) {
            setUserRole(data.role)
          }

          // Retrieve cart from local storage
          const savedCart = localStorage.getItem("cart")
          if (savedCart) {
            setCart(JSON.parse(savedCart))
          }
        }
      } catch (error) {
        console.error("Error loading session:", error)
        toast({
          title: "Error",
          description: "Failed to load user session.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    loadSession()

    // Set up auth state change listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email!,
          full_name: session.user.user_metadata?.full_name,
          avatar_url: session.user.user_metadata?.avatar_url,
        })

        // Fetch user role
        const { data } = await supabase.from("users").select("role").eq("id", session.user.id).single()

        if (data) {
          setUserRole(data.role)
        }
      } else {
        setUser(null)
        setUserRole(null)
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [supabase, toast])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart))
  }, [cart])

  // Cart management functions
  const addToCart = (item: Omit<CartItem, "id">) => {
    const newItem = {
      ...item,
      id: `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
    }

    setCart((prev) => [...prev, newItem])

    toast({
      title: "Added to cart",
      description: "Your item has been added to the cart.",
    })
  }

  const removeFromCart = (itemId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== itemId))
  }

  const updateCartItem = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId)
      return
    }

    setCart((prev) => prev.map((item) => (item.id === itemId ? { ...item, quantity } : item)))
  }

  const clearCart = () => {
    setCart([])
  }

  // Load user projects
  const loadUserProjects = async () => {
    if (!user) return null

    try {
      const { data, error } = await supabase.from("projects").select("*").eq("user_id", user.id)

      if (error) throw error
      return data
    } catch (error) {
      console.error("Error loading user projects:", error)
      toast({
        title: "Error",
        description: "Failed to load your projects.",
        variant: "destructive",
      })
      return null
    }
  }

  // Authentication functions
  const login = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) throw error

      toast({
        title: "Welcome back!",
        description: "You have successfully logged in.",
      })
    } catch (error: any) {
      console.error("Login error:", error)
      toast({
        title: "Login failed",
        description: error.message || "Failed to log in. Please check your credentials.",
        variant: "destructive",
      })
      throw error
    }
  }

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error

      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      })
    } catch (error: any) {
      console.error("Logout error:", error)
      toast({
        title: "Logout failed",
        description: error.message || "Failed to log out.",
        variant: "destructive",
      })
      throw error
    }
  }

  const register = async (email: string, password: string, full_name: string) => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name },
        },
      })

      if (error) throw error

      toast({
        title: "Registration successful",
        description: "Please check your email to confirm your account.",
      })
    } catch (error: any) {
      console.error("Registration error:", error)
      toast({
        title: "Registration failed",
        description: error.message || "Failed to register. Please try again.",
        variant: "destructive",
      })
      throw error
    }
  }

  return (
    <AppContext.Provider
      value={{
        user,
        userRole,
        isAuthenticated: !!user,
        isLoading,
        currentDesign,
        setCurrentDesign,
        selectedProduct,
        setSelectedProduct,
        selectedVariantId,
        setSelectedVariantId,
        cart,
        addToCart,
        removeFromCart,
        updateCartItem,
        clearCart,
        cartTotal,
        loadUserProjects,
        login,
        logout,
        register,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider")
  }
  return context
}


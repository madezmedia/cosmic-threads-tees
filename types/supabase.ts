export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          full_name: string
          avatar_url: string | null
          created_at: string
          updated_at: string
          role: "user" | "admin"
          stripe_customer_id: string | null
        }
        Insert: {
          id: string
          email: string
          full_name?: string
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
          role?: "user" | "admin"
          stripe_customer_id?: string | null
        }
        Update: {
          id?: string
          email?: string
          full_name?: string
          avatar_url?: string | null
          updated_at?: string
          role?: "user" | "admin"
          stripe_customer_id?: string | null
        }
      }
      projects: {
        Row: {
          id: string
          name: string
          description: string | null
          user_id: string
          created_at: string
          updated_at: string
          is_public: boolean
          thumbnail_url: string | null
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          user_id: string
          created_at?: string
          updated_at?: string
          is_public?: boolean
          thumbnail_url?: string | null
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          user_id?: string
          updated_at?: string
          is_public?: boolean
          thumbnail_url?: string | null
        }
      }
      designs: {
        Row: {
          id: string
          project_id: string
          name: string
          prompt: string
          image_url: string
          created_at: string
          updated_at: string
          metadata: Json | null
          status: "draft" | "completed" | "processing" | "failed"
        }
        Insert: {
          id?: string
          project_id: string
          name: string
          prompt: string
          image_url?: string
          created_at?: string
          updated_at?: string
          metadata?: Json | null
          status?: "draft" | "completed" | "processing" | "failed"
        }
        Update: {
          id?: string
          project_id?: string
          name?: string
          prompt?: string
          image_url?: string
          updated_at?: string
          metadata?: Json | null
          status?: "draft" | "completed" | "processing" | "failed"
        }
      }
      orders: {
        Row: {
          id: string
          user_id: string
          design_id: string
          status: "pending" | "processing" | "completed" | "cancelled"
          amount: number
          currency: string
          payment_intent_id: string | null
          shipping_address: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          design_id: string
          status?: "pending" | "processing" | "completed" | "cancelled"
          amount: number
          currency?: string
          payment_intent_id?: string | null
          shipping_address?: Json | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          design_id?: string
          status?: "pending" | "processing" | "completed" | "cancelled"
          amount?: number
          currency?: string
          payment_intent_id?: string | null
          shipping_address?: Json | null
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}


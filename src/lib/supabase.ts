import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          created_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          created_at?: string
        }
      }
      products: {
        Row: {
          id: string
          name: string
          price: number
          category: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          price: number
          category: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          price?: number
          category?: string
          created_at?: string
        }
      }
      orders: {
        Row: {
          id: string
          product_id: string
          user_id: string
          quantity: number
          state: string
          total_amount: number
          created_at: string
        }
        Insert: {
          id?: string
          product_id: string
          user_id: string
          quantity?: number
          state: string
          total_amount: number
          created_at?: string
        }
        Update: {
          id?: string
          product_id?: string
          user_id?: string
          quantity?: number
          state?: string
          total_amount?: number
          created_at?: string
        }
      }
    }
  }
}
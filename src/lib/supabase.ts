import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      riddles: {
        Row: {
          id: string
          question_text: string
          question_answer: string
          location: string
          tags: string[]
          established_at: string | null
          near_spots: string[] | null
          short_def: string | null
          image: string | null
          created_at: string
        }
        Insert: {
          id?: string
          question_text: string
          question_answer: string
          location: string
          tags: string[]
          established_at?: string | null
          near_spots?: string[] | null
          short_def?: string | null
          image?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          question_text?: string
          question_answer?: string
          location?: string
          tags?: string[]
          established_at?: string | null
          near_spots?: string[] | null
          short_def?: string | null
          image?: string | null
          created_at?: string
        }
      }
    }
  }
}

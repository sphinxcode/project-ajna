export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          name: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      charts: {
        Row: {
          id: string
          user_id: string
          is_primary: boolean
          birth_date: string
          birth_time: string
          birth_location: string
          birth_coordinates: string | null
          birth_timezone: string | null
          type: string | null
          authority: string | null
          profile: string | null
          incarnation_cross: string | null
          definition: string | null
          chart_data: Json | null
          chart_needs_recalculation: boolean
          chart_calculated_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          is_primary?: boolean
          birth_date: string
          birth_time: string
          birth_location: string
          birth_coordinates?: string | null
          birth_timezone?: string | null
          type?: string | null
          authority?: string | null
          profile?: string | null
          incarnation_cross?: string | null
          definition?: string | null
          chart_data?: Json | null
          chart_needs_recalculation?: boolean
          chart_calculated_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          is_primary?: boolean
          birth_date?: string
          birth_time?: string
          birth_location?: string
          birth_coordinates?: string | null
          birth_timezone?: string | null
          type?: string | null
          authority?: string | null
          profile?: string | null
          incarnation_cross?: string | null
          definition?: string | null
          chart_data?: Json | null
          chart_needs_recalculation?: boolean
          chart_calculated_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      shared_charts: {
        Row: {
          id: string
          chart_id: string
          share_token: string
          is_active: boolean
          view_count: number
          created_at: string
          expires_at: string | null
        }
        Insert: {
          id?: string
          chart_id: string
          share_token: string
          is_active?: boolean
          view_count?: number
          created_at?: string
          expires_at?: string | null
        }
        Update: {
          id?: string
          chart_id?: string
          share_token?: string
          is_active?: boolean
          view_count?: number
          created_at?: string
          expires_at?: string | null
        }
      }
    }
    Functions: {
      generate_share_token: {
        Args: Record<string, never>
        Returns: string
      }
    }
  }
}

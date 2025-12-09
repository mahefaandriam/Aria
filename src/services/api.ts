// api.ts - version Supabase

import { createClient } from '@supabase/supabase-js'

// ⚡️ Config Supabase (URL + clé publique depuis ton .env)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types pour TypeScript
export interface Project {
  id?: string
  title: string
  description: string
  technologies: string[]
  sector: string
  objectives: string[]
  solutions: string[]
  client: string
  duration: string
  status: 'EN_COURS' | 'TERMINE' | 'EN_ATTENTE'
  image_url?: string | null
  url?: string
  date: string
  created_at?: string
  updated_at?: string
}

export interface ContactMessage {
  id?: string
  name: string
  email: string
  company?: string
  subject: string
  message: string
  status?: 'NOUVEAU' | 'LU' | 'TRAITE' | 'ARCHIVE'
  created_at?: string
  updated_at?: string
}

export interface User {
  id: string
  email: string
  name: string
  created_at: string
}

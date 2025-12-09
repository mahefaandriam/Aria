// authService.ts
import { supabase } from './api'

// 🔹 Login avec email + mot de passe
export const login = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) throw error
  return data.user
}

// 🔹 Logout
export const logout = async () => {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
  return true
}

// 🔹 Récupérer la session actuelle
export const getSession = async () => {
  const { data, error } = await supabase.auth.getSession()
  if (error) throw error
  return data.session
}

// 🔹 Récupérer l’utilisateur courant
export const getCurrentUser = async () => {
  const { data, error } = await supabase.auth.getUser()
  if (error) throw error
  return data.user
}

// messagesService.ts - version Supabase

import { supabase, type ContactMessage } from './api'

// 🔹 Récupérer tous les messages
export const getMessages = async (): Promise<ContactMessage[]> => {
  const { data, error } = await supabase
    .from('contact_messages_ar')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}


// 🔹 Ajouter un nouveau message (formulaire de contact)
export const addMessage = async (message: Omit<ContactMessage, 'id' | 'created_at' | 'updated_at' | 'status'>) => {
  const { error } = await supabase
    .from('contact_messages_ar')
    .insert([{ ...message, status: 'NOUVEAU' }]);

  if (error) throw error
  return true;
}

// 🔹 Mettre à jour un message (par ex. changer le statut en LU, TRAITE, ARCHIVE)
export const updateMessageStatus = async (id: string, status: 'NOUVEAU' | 'LU' | 'TRAITE' | 'ARCHIVE') => {
  const { data, error } = await supabase
    .from('contact_messages_ar')
    .update({ status })
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return true
}

// 🔹 Supprimer un message
export const deleteMessage = async (id: string) => {
  const { error } = await supabase.from('contact_messages_ar').delete().eq('id', id)
  if (error) throw error
  return true
}

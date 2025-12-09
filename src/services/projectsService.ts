// projectsService.ts - version Supabase

import { supabase, type Project } from './api'

// 🔹 Récupérer tous les projets
export const getProjects = async (): Promise<Project[]> => {
  const { data, error } = await supabase
    .from('projects_ar')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data as Project[];
}


// 🔹 Mettre à jour uniquement le statut d’un projet
export const updateProjectStatus = async (
  id: string,
  status: 'EN_COURS' | 'TERMINE' | 'EN_ATTENTE'
): Promise<Project> => {
  const { data, error } = await supabase
    .from('projects_ar')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data as Project
}

// 🔹 Récupérer tous les projets (client / public/ admin )avec le status "TERIMNE"
export const getClientProjects = async (): Promise<Project[]> => {
  const { data, error } = await supabase
    .from('projects_ar')
    .select('*')
    .eq('status', 'TERMINE')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data as Project[]
}

// 🔹 Ajouter un projet
export const addProject = async (project: Omit<Project, 'id' | 'created_at' | 'updated_at'>, image?: File) => {
  let image_url: string | null = null

  if (image) {
    const { data: storageData, error: storageError } = await supabase.storage
      .from('projects_ar')
      .upload(`images/${Date.now()}_${image.name}`, image)

    if (storageError) throw storageError

    const { data: urlData } = supabase.storage.from('projects_ar').getPublicUrl(storageData.path)
    image_url = urlData.publicUrl
  }

  const { data, error } = await supabase
    .from('projects_ar')
    .insert([{ ...project, image_url }])
    .select()
    .single()

  if (error) throw error
  return true
}

// 🔹 Mettre à jour un projet
export const updateProject = async (id: string, updates: Partial<Project>, image?: File) => {
  let image_url = updates.image_url ?? null

  // Récupérer l’ancien projet
  /*const { data: project, error: fetchError } = await supabase
    .from("projects_ar")
    .select("image_url")
    .eq("id", id)
    .single();

  if (fetchError) throw fetchError;

  // 1. Supprimer l’ancienne image si elle existe
  if (project?.image_url) {
   // const imu = "https://vdpycrwknsfowqrkvkkj.supabase.co/storage/v1/object/public/projects_ar/images/1757789218669_Screenshot%20From%202025-08-25%2011-17-04.png"
    // Ici on suppose que l’URL est de type https://xxx.supabase.co/storage/v1/object/public/project-images/filename.png
    const path = "/images/" + project.image_url.split("/").slice(-1)[0]; // récupérer juste le nom du fichier
    console.log("the path :" + path)
    const { data, error } = await supabase.storage.from("projects_ar").remove([path]);
    if (data) console.log("dataor " + data)
      if (error) console.log(" error" + error) 
  }
  */
  if (image) {
    const { data: storageData, error: storageError } = await supabase.storage
      .from('projects_ar')
      .upload(`images/${Date.now()}_${image.name}`, image, { upsert: true })

    if (storageError) throw storageError

    const { data: urlData } = supabase.storage.from('projects_ar').getPublicUrl(storageData.path)
    image_url = urlData.publicUrl
  }

  const { data, error } = await supabase
    .from('projects_ar')
    .update({ ...updates, image_url })
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return true
}

// 🔹 Supprimer un projet
export const deleteProject = async (id: string) => {
  const { error } = await supabase.from('projects_ar').delete().eq('id', id)
  if (error) throw error
  return true
}

// 🔹 Récupérer seulement quelques projets (ex. 3 par défaut)
export const getDefaultProjects = async (limit = 3): Promise<Project[]> => {
  const { data, error } = await supabase
    .from('projects_ar')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) throw error
  return data as Project[]
}
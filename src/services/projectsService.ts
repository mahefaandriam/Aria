// Service pour gérer les projets - migré vers l'API backend

import { projectsApi, type Project } from './api';

// Interface pour la compatibilité avec l'ancien code
export interface AdminProject {
  id: string; // Changé de number à string pour Prisma
  title: string;
  description: string;
  technologies: string[];
  client: string;
  duration: string;
  status: 'EN_COURS' | 'TERMINE' | 'EN_ATTENTE'; // Mise à jour des statuts
  image?: File | null;
  imagePreview?: string | null;
  imageUrl?: string;
  date: string;
  url?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ClientProject {
  title: string;
  description: string;
  sector: string;
  objectives: string[];
  solutions: string[];
  imageUrl: string;
  websiteUrl?: string;
}

// Fonction pour convertir un projet API vers AdminProject
const convertApiToAdminProject = (project: Project): AdminProject => {
  return {
    id: project.id,
    title: project.title,
    description: project.description,
    technologies: project.technologies,
    client: project.client,
    duration: project.duration,
    status: project.status,
    imageUrl: project.imageUrl,
    imagePreview: project.imageUrl,
    date: project.date,
    url: project.url,
    createdAt: project.createdAt,
    updatedAt: project.updatedAt
  };
};

// Fonction pour convertir un AdminProject vers le format API
const convertAdminToApiProject = (adminProject: AdminProject): Omit<Project, 'id' | 'createdAt' | 'updatedAt'> => {
  return {
    title: adminProject.title,
    description: adminProject.description,
    technologies: adminProject.technologies,
    client: adminProject.client,
    duration: adminProject.duration,
    status: adminProject.status,
    imageUrl: adminProject.imageUrl || adminProject.imagePreview,
    url: adminProject.url,
    date: adminProject.date
  };
};

// Récupérer les projets par défaut en format AdminProject
const getDefaultAdminProjects = (): AdminProject[] => {
  return [
    {
      id: "1",
      title: "CGEPRO",
      description: "Votre spécialiste du bois exotique et des aménagements extérieurs sur La Réunion",
      technologies: ["WordPress", "PHP", "MySQL", "SEO"],
      client: "CGEPRO",
      duration: "2 mois",
      status: "TERMINE",
      imageUrl: "/src/assets/go.jpg",
      date: "15/03/2024",
      url: "https://cgepro.com"
    },
    {
      id: "2",
      title: "ERIC RABY",
      description: "Coaching en compétences sociales et émotionnelles",
      technologies: ["React", "Node.js", "Stripe", "Calendar API"],
      client: "Eric Raby Coaching",
      duration: "3 mois",
      status: "TERMINE",
      imageUrl: "/src/assets/eric.jpg",
      date: "22/04/2024",
      url: "https://eric-raby.com"
    },
    {
      id: "3",
      title: "CONNECT TALENT",
      description: "Plateforme de mise en relation entre entreprises et talents africains",
      technologies: ["Vue.js", "Laravel", "PostgreSQL", "Socket.io"],
      client: "Connect Talent Inc",
      duration: "5 mois",
      status: "TERMINE",
      imageUrl: "/src/assets/connect.png",
      date: "10/05/2024",
      url: "https://connecttalent.cc"
    },
    {
      id: "4",
      title: "SOA DIA TRAVEL",
      description: "Transport & Logistique �� Madagascar",
      technologies: ["Angular", "Express.js", "MongoDB", "Maps API"],
      client: "SOA DIA TRAVEL",
      duration: "4 mois",
      status: "TERMINE",
      imageUrl: "/src/assets/soa.jpg",
      date: "28/06/2024",
      url: "https://soatransplus.mg"
    }
  ];
};

// Fonction pour convertir un projet admin en projet client
export const convertAdminToClientProject = (adminProject: AdminProject): ClientProject => {
  // Générer des objectifs basés sur les données admin
  const generateObjectives = (project: AdminProject): string[] => {
    const objectives = [];
    
    if (project.client) {
      objectives.push(`Répondre aux besoins spécifiques de ${project.client}`);
    }
    
    objectives.push("Créer une solution digitale innovante et performante");
    
    if (project.technologies.length > 0) {
      objectives.push(`Implémenter les technologies ${project.technologies.slice(0, 2).join(' et ')} pour une solution moderne`);
    }
    
    if (project.status === 'TERMINE') {
      objectives.push("Livrer un projet fini dans les délais impartis");
    }
    
    return objectives;
  };

  // Générer des solutions basées sur les données admin
  const generateSolutions = (project: AdminProject): string[] => {
    const solutions = [];
    
    solutions.push("Développement sur mesure avec les meilleures pratiques");
    
    if (project.technologies.includes('React') || project.technologies.includes('Vue') || project.technologies.includes('Angular')) {
      solutions.push("Interface utilisateur moderne et responsive");
    }
    
    if (project.technologies.includes('Node.js') || project.technologies.includes('Express') || project.technologies.includes('API')) {
      solutions.push("Backend robuste avec API sécurisée");
    }
    
    if (project.technologies.includes('MongoDB') || project.technologies.includes('PostgreSQL') || project.technologies.includes('MySQL')) {
      solutions.push("Base de données optimisée pour les performances");
    }
    
    solutions.push("Tests approfondis et déploiement sécurisé");
    
    if (project.status === 'TERMINE') {
      solutions.push("Support et maintenance post-lancement");
    }
    
    return solutions;
  };

  // Déterminer le secteur basé sur le nom du client ou le titre
  const determineSector = (project: AdminProject): string => {
    const title = project.title.toLowerCase();
    const client = project.client.toLowerCase();
    
    if (title.includes('e-commerce') || title.includes('boutique') || title.includes('shop')) {
      return 'E-commerce / Retail';
    }
    if (title.includes('bank') || title.includes('finance') || title.includes('payment')) {
      return 'Finance / Banque';
    }
    if (title.includes('health') || title.includes('medical') || title.includes('santé')) {
      return 'Santé / Medical';
    }
    if (title.includes('education') || title.includes('learning') || title.includes('école')) {
      return 'Education / Formation';
    }
    if (title.includes('travel') || title.includes('transport') || title.includes('voyage')) {
      return 'Transport / Voyage';
    }
    if (title.includes('tech') || title.includes('software') || title.includes('app')) {
      return 'Tech / Software';
    }
    
    return 'Digital / Innovation';
  };

  return {
    title: adminProject.title,
    description: adminProject.description,
    sector: determineSector(adminProject),
    objectives: generateObjectives(adminProject),
    solutions: generateSolutions(adminProject),
    imageUrl: adminProject.imageUrl || adminProject.imagePreview || '/placeholder.svg',
    websiteUrl: adminProject.url
  };
};

// API Functions - Utilisation de l'API backend

// Récupérer tous les projets admin
export const getAllAdminProjects = async (): Promise<AdminProject[]> => {
  try {
    const response = await projectsApi.getAllProjects();
    if (response.success && response.data) {
      return response.data.projects.map(convertApiToAdminProject);
    }
    return getDefaultAdminProjects();
  } catch (error) {
    console.error('Erreur lors de la récupération des projets admin:', error);
    console.log('Utilisation des projets par défaut (API indisponible)');
    return getDefaultAdminProjects();
  }
};

// Récupérer les projets depuis l'API (publics seulement)
export const getProjectsFromStorage = async (): Promise<AdminProject[]> => {
  try {
    const response = await projectsApi.getPublicProjects();
    if (response.success && response.data) {
      return response.data.projects.map(convertApiToAdminProject);
    }
    return getDefaultAdminProjects().filter(p => p.status === 'TERMINE');
  } catch (error) {
    console.error('Erreur lors de la récupération des projets:', error);
    return getDefaultAdminProjects().filter(p => p.status === 'TERMINE');
  }
};


// Nouvelles fonctions pour l'API

// Créer un nouveau projet
export const createProject = async (project: Omit<AdminProject, 'id' | 'createdAt' | 'updatedAt'>): Promise<AdminProject | null> => {
  try {
    const apiProject = convertAdminToApiProject({
      ...project,
      id: '', // Sera ignoré par l'API
      createdAt: '',
      updatedAt: ''
    });
    const response = await projectsApi.createProject(apiProject);
    if (response.success && response.data) {
      return convertApiToAdminProject(response.data.project);
    }
    return null;
  } catch (error) {
    console.error('Erreur lors de la création du projet:', error);
    throw error;
  }
};

// Mettre à jour un projet
export const updateProject = async (id: string, project: Partial<AdminProject>): Promise<AdminProject | null> => {
  try {
    const apiProject = convertAdminToApiProject({
      id: id,
      title: project.title || '',
      description: project.description || '',
      technologies: project.technologies || [],
      client: project.client || '',
      duration: project.duration || '',
      status: project.status || 'EN_ATTENTE',
      date: project.date || '',
      ...project
    });
    const response = await projectsApi.updateProject(id, apiProject);
    if (response.success && response.data) {
      return convertApiToAdminProject(response.data.project);
    }
    return null;
  } catch (error) {
    console.error('Erreur lors de la mise à jour du projet:', error);
    throw error;
  }
};

// Supprimer un projet
export const deleteProject = async (id: string): Promise<boolean> => {
  try {
    const response = await projectsApi.deleteProject(id);
    return response.success;
  } catch (error) {
    console.error('Erreur lors de la suppression du projet:', error);
    throw error;
  }
};

// Changer le statut d'un projet
export const updateProjectStatus = async (id: string, status: AdminProject['status']): Promise<AdminProject | null> => {
  try {
    const response = await projectsApi.updateStatus(id, status);
    if (response.success && response.data) {
      return convertApiToAdminProject(response.data.project);
    }
    return null;
  } catch (error) {
    console.error('Erreur lors de la mise à jour du statut:', error);
    throw error;
  }
};

// Functions needed by ProjectsSection component

// Récupérer les projets au format client depuis l'API
export const getClientProjects = async (): Promise<ClientProject[]> => {
  try {
    const adminProjects = await getProjectsFromStorage();
    return adminProjects.map(convertAdminToClientProject);
  } catch (error) {
    console.error('Erreur lors de la récupération des projets clients:', error);
    return getDefaultProjects();
  }
};

// Récupérer les projets par défaut au format client
export const getDefaultProjects = (): ClientProject[] => {
  const defaultAdminProjects = getDefaultAdminProjects();
  return defaultAdminProjects
    .filter(project => project.status === 'TERMINE')
    .map(convertAdminToClientProject);
};

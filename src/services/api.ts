const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// Types pour TypeScript
export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
  details?: string;
}

export interface ProjectImage {
  id: string;
  filename: string;
  mimetype: string;
  size: number;
  imageUrl: string;
  createdAt: string;
  updatedAt: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  client: string;
  duration: string;
  status: 'EN_COURS' | 'TERMINE' | 'EN_ATTENTE';
  imageUrl?: Uint8Array | null; 
  url?: string;
  date: string;
  createdAt: string;
  updatedAt: string;
}

export interface ContactMessage {
  id?: string;
  name: string;
  email: string;
  company?: string;
  subject: string;
  message: string;
  status?: 'NOUVEAU' | 'LU' | 'TRAITE' | 'ARCHIVE';
  createdAt?: string;
  updatedAt?: string;
}

export interface User {
  email: string;
  name: string;
  role: string;
}

export interface LoginResponse {
  success: boolean;
  token: string;
  user: User;
  message: string;
}

// Utilitaire pour gérer les tokens
class TokenManager {
  private static readonly TOKEN_KEY = 'aria_auth_token';

  static getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  static setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  static removeToken(): void {
    localStorage.removeItem(this.TOKEN_KEY);
  }

  static getAuthHeaders(): Record<string, string> {
    const token = this.getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  }
}

// Utilitaire pour les requêtes fetch
class ApiClient {
  private static async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...TokenManager.getAuthHeaders(),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || errorData.message || `HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`API Error [${endpoint}]:`, error);

      // Si c'est une erreur de réseau, ajouter un message plus explicite
      if (error instanceof TypeError && error.message === 'Failed to fetch') {
        throw new Error(`Backend non disponible. Vérifiez que le serveur backend est démarré sur ${API_BASE_URL.replace('/api', '')}`);
      }

      throw error;
    }
  }

  static get<T>(endpoint: string, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET', ...options });
  }

  static post<T>(endpoint: string, data?: any, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
      ...options,
    });
  }

  static put<T>(endpoint: string, data?: any, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
      ...options,
    });
  }

  static delete<T>(endpoint: string, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE', ...options });
  }

  static async uploadFile(endpoint: string, file: File, fieldName = 'image'): Promise<any> {
    const formData = new FormData();
    formData.append(fieldName, file);

    const url = `${API_BASE_URL}${endpoint}`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        ...TokenManager.getAuthHeaders(),
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || errorData.message || `HTTP ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  }
}

// Services API

// Service Contact
export const contactApi = {
  async sendMessage(message: ContactMessage): Promise<ApiResponse> {
    return ApiClient.post('/contact', message);
  },

  async testEmailConfig(): Promise<ApiResponse> {
    return ApiClient.get('/contact/test');
  },

  // Routes admin pour la gestion des messages
  async getAllMessages(): Promise<ApiResponse<{ messages: ContactMessage[] }>> {
    return ApiClient.get('/contact/admin');
  },

  async getMessage(id: string): Promise<ApiResponse<{ message: ContactMessage }>> {
    return ApiClient.get(`/contact/admin/${id}`);
  },

  async updateMessageStatus(id: string, status: string): Promise<ApiResponse<{ message: ContactMessage }>> {
    return ApiClient.put(`/contact/admin/${id}/status`, { status });
  },

  async deleteMessage(id: string): Promise<ApiResponse> {
    return ApiClient.delete(`/contact/admin/${id}`);
  },

  async getStats(): Promise<ApiResponse<{ stats: { total: number; nouveau: number; traite: number; archive: number } }>> {
    return ApiClient.get('/contact/admin/stats');
  }
};

// Service Admin
export const adminApi = {
  async login(email: string, password: string): Promise<LoginResponse> {
    const response = await ApiClient.post<LoginResponse>('/admin/login', { email, password });
    if (response.success && response.token) {
      TokenManager.setToken(response.token);
    }
    return response;
  },

  async logout(): Promise<ApiResponse> {
    const response = await ApiClient.post<ApiResponse>('/admin/logout');
    TokenManager.removeToken();
    return response;
  },

  async verifyToken(): Promise<ApiResponse<User>> {
    return ApiClient.post('/admin/verify');
  },

  async refreshToken(): Promise<ApiResponse<{ token: string }>> {
    const response = await ApiClient.post<ApiResponse<{ token: string }>>('/admin/refresh');
    if (response.success && response.data?.token) {
      TokenManager.setToken(response.data.token);
    }
    return response;
  },

  async getProfile(): Promise<ApiResponse<User>> {
    return ApiClient.get('/admin/profile');
  },

  isAuthenticated(): boolean {
    return !!TokenManager.getToken();
  }
};

// Service Projets
export const projectsApi = {
  async getPublicProjects(): Promise<ApiResponse<{ projects: Project[] }>> {
    return ApiClient.get('/projects');
  },

  async getAllProjects(): Promise<ApiResponse<{ projects: Project[] }>> {
    return ApiClient.get('/projects/admin');
  },

  async getProject(id: string): Promise<ApiResponse<{ project: Project }>> {
    return ApiClient.get(`/projects/${id}`);
  },

  async createProject(project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<{ project: Project }>> {
    return ApiClient.post('/projects', project);
  },

  async updateProject(id: string, project: Partial<Project>): Promise<ApiResponse<{ project: Project }>> {
    return ApiClient.put(`/projects/${id}`, project);
  },

  async deleteProject(id: string): Promise<ApiResponse> {
    return ApiClient.delete(`/projects/${id}`);
  },

  async updateStatus(id: string, status: Project['status']): Promise<ApiResponse<{ project: Project }>> {
    return ApiClient.post(`/projects/${id}/status`, { status });
  }
};

// Service Upload
export const uploadApi = {
  async uploadImage(file: File): Promise<ApiResponse<{ imageUrl: string; filename: string }>> {
    return ApiClient.uploadFile('/upload/image', file, 'image');
  },

  async uploadImages(files: File[]): Promise<ApiResponse<{ images: Array<{ imageUrl: string; filename: string }> }>> {
    const formData = new FormData();
    files.forEach(file => formData.append('images', file));

    const url = `${API_BASE_URL}/upload/images`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        ...TokenManager.getAuthHeaders(),
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || errorData.message || `HTTP ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  },

  async deleteImage(filename: string): Promise<ApiResponse> {
    return ApiClient.delete(`/upload/image/${filename}`);
  },

  async getImages(): Promise<ApiResponse<{ images: Array<{ filename: string; imageUrl: string; size: number; createdAt: string }> }>> {
    return ApiClient.get('/upload/images');
  },

  async getStats(): Promise<ApiResponse<{ stats: { totalFiles: number; totalSize: number; totalSizeMB: number } }>> {
    return ApiClient.get('/upload/stats');
  }
};

// Service général
export const healthApi = {
  async checkHealth(): Promise<ApiResponse<{ status: string; timestamp: string; uptime: number }>> {
    return ApiClient.get('/health');
  }
};

// Export du TokenManager pour usage externe si nécessaire
export { TokenManager };

// Export par défaut
const api = {
  contact: contactApi,
  admin: adminApi,
  projects: projectsApi,
  upload: uploadApi,
  health: healthApi,
  TokenManager
};

export default api;

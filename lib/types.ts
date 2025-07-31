// Tipos para la aplicación VitalMente

export interface User {
  id: string;
  nombre: string;
  email: string;
  edad: number;
  peso: number;
  altura: number;
  genero: 'masculino' | 'femenino';
  actividad: string;
  objetivo: string;
  experiencia: string;
  condiciones: string[];
  preferencias: string[];
  created_at: string;
  updated_at: string;
}

export interface Supplement {
  id: string;
  name: string;
  description: string;
  price: number;
  original_price: number;
  image_url: string;
  category: string;
  ingredients: string[];
  benefits: string[];
  instructions: string;
  stock: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Recipe {
  id: string;
  title: string;
  description: string;
  pdf_url: string;
  image_url: string;
  category: string;
  difficulty: 'facil' | 'intermedio' | 'avanzado';
  prep_time: number;
  calories: number;
  macros: {
    protein: number;
    carbs: number;
    fat: number;
  };
  tags: string[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface MindfulnessResource {
  id: string;
  title: string;
  description: string;
  url: string;
  type: 'meditation' | 'music' | 'video';
  duration: number;
  image_url: string;
  category: string;
  tags: string[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface WorkoutLink {
  id: string;
  title: string;
  description: string;
  url: string;
  platform: 'youtube' | 'spotify';
  category: string;
  difficulty: 'principiante' | 'intermedio' | 'avanzado';
  duration: number;
  image_url: string;
  tags: string[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// Simulación de operaciones de base de datos
export const dbOperations = {
  // Funciones placeholder para futuras operaciones
  getUsers: async () => [],
  getSupplements: async () => [],
  getRecipes: async () => [],
  getMindfulnessResources: async () => [],
  getWorkoutLinks: async () => []
};
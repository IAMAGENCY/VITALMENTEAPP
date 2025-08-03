import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// ========================= INTERFACES =========================

export interface Usuario {
  id: string;
  email: string;
  nombre: string;
  apellidos?: string; // Opcional
  fecha_nacimiento?: string;
  genero?: 'masculino' | 'femenino' | 'otro';
  altura?: number;
  peso?: number;
  nivel_actividad?: 'sedentario' | 'ligero' | 'moderado' | 'activo' | 'muy_activo';
  objetivo?: 'perder_peso' | 'mantener_peso' | 'ganar_peso' | 'ganar_musculo';
  calorias_objetivo?: number;
  proteinas_objetivo?: number;
  carbohidratos_objetivo?: number;
  grasas_objetivo?: number;
  agua_objetivo?: number;
  subscription_status?: 'free' | 'premium' | 'pro';
  subscription_end_date?: string;
  onboarding_completed?: boolean;
  created_at?: string;
  updated_at?: string;
}

// 🔧 CORRIGIENDO INTERFAZ FOOD - Agregando propiedades de lib/types.ts
export interface Food {
  id?: string;
  nombre: string;
  name: string;
  calorias_por_100g: number;
  calories_per_100g: number; // ← AGREGADO para compatibilidad
  proteinas_por_100g: number;
  protein_per_100g: number; // ← AGREGADO para compatibilidad
  carbohidratos_por_100g: number;
  carbs_per_100g: number; // ← AGREGADO para compatibilidad
  grasas_por_100g: number;
  fat_per_100g: number; // ← AGREGADO para compatibilidad
  fibra_por_100g?: number;
  fiber_per_100g?: number; // ← AGREGADO para compatibilidad
  azucares_por_100g?: number;
  sugar_per_100g?: number; // ← AGREGADO para compatibilidad
  sodio_por_100g?: number;
  sodium_per_100g?: number; // ← AGREGADO para compatibilidad
  categoria: string;
  category: string; // ← AGREGADO para compatibilidad
  subcategoria?: string;
  image_url?: string; // ← AGREGADO para FoodBankManager
  is_custom?: boolean; // ← AGREGADO para FoodBankManager
  created_at?: string;
}

export interface Alimento {
  id?: string;
  nombre: string;
  calorias_por_100g: number;
  proteinas_por_100g: number;
  carbohidratos_por_100g: number;
  grasas_por_100g: number;
  fibra_por_100g?: number;
  azucares_por_100g?: number;
  sodio_por_100g?: number;
  categoria: string;
  subcategoria?: string;
  imagen_url?: string; // ← AGREGADO
  es_personalizado?: boolean; // ← AGREGADO
  created_at?: string;
}

export interface UserInsight {
  id: string;
  user_id: string;
  title: string;
  description: string;
  type: 'nutrition' | 'exercise' | 'health' | 'goal';
  priority: 'low' | 'medium' | 'high';
  is_viewed: boolean;
  viewed?: boolean; // Compatibilidad
  data?: any;
  created_at: string;
  updated_at?: string;
}

export interface UserMeal {
  id: string;
  user_id: string;
  food_id: string;
  tipo_comida: string;
  portion_grams: number;
  date: string;
  created_at: string;
  updated_at?: string;
}

export interface WaterIntake {
  id?: string;
  user_id: string;
  amount: number;
  date: string;
  total_amount?: number;
  created_at?: string;
  updated_at?: string;
}

export interface Workout {
  id?: string;
  name: string;
  nombre?: string;
  category: string;
  categoria?: string;
  description?: string;
  descripcion?: string;
  difficulty?: string;
  dificultad?: string;
  duration?: number;
  duracion?: number;
  exercises?: any[];
  ejercicios?: any[];
  muscle_groups?: string[];
  grupos_musculares?: string[];
  equipment?: string[];
  equipamiento?: string[];
  active?: boolean;
  activo?: boolean;
  created_at?: string;
  updated_at?: string;
}

// 🔧 CORRIGIENDO INTERFAZ MINDFULNESS RESOURCE - Cambio de 'type' a 'category'
export interface MindfulnessResource {
  id: string;
  title: string;
  description?: string;
  category: 'meditation' | 'relaxation' | 'breathing' | 'mindset'; // CAMBIADO: type → category
  type: 'youtube' | 'spotify'; // AGREGADO: type para plataforma
  content_url: string;
  url: string; // AGREGADO: url principal
  duration: number;
  difficulty: 'principiante' | 'intermedio' | 'avanzado';
  tags: string[];
  is_active: boolean;
  created_at: string;
  updated_at?: string;
}

// 🔧 AGREGANDO INTERFAZ WORKOUT LINK FALTANTE
export interface WorkoutLink {
  id: string;
  title: string;
  description?: string;
  url: string;
  platform: 'youtube' | 'spotify';
  category: string;
  difficulty: 'principiante' | 'intermedio' | 'avanzado';
  duration: number;
  image_url?: string;
  tags: string[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Supplement {
  id: string;
  created_at?: string;
  updated_at?: string;
  name: string;
  nombre?: string;
  brand: string;
  marca?: string;
  category: string;
  categoria?: string;
  description: string;
  descripcion?: string;
  benefits?: string[];
  beneficios?: string[];
  price: number;
  precio?: number;
  currency?: string;
  moneda?: string;
  image_url?: string;
  imagen_url?: string;
  rating?: number;
  calificacion?: number;
  reviews_count?: number;
  cantidad_resenas?: number;
  is_recommended?: boolean;
  es_recomendado?: boolean;
  dosage?: string;
  dosis?: string;
  ingredients?: string[];
  ingredientes?: string[];
  warnings?: string[];
  advertencias?: string[];
}

export interface SupplementRecommendation {
  id: string;
  created_at?: string;
  updated_at?: string;
  user_id: string;
  usuario_id?: string;
  supplement_id: string;
  suplemento_id?: string;
  recommended_dosage: string;
  dosis_recomendada?: string;
  frequency: string;
  frecuencia?: string;
  duration_weeks?: number;
  duracion_semanas?: number;
  reason?: string;
  razon?: string;
  priority?: number;
  prioridad?: number;
  is_active?: boolean;
  esta_activo?: boolean;
}

// ========================= DATABASE OPERATIONS =========================

export const dbOperations = {
  // ========== USUARIOS ==========
  getUsers: async () => {
    try {
      const { data, error } = await supabase.from('usuarios').select('*');
      return { data: data || [], error };
    } catch (error) {
      console.error('Error in getUsers:', error);
      return { data: [], error: error as any };
    }
  },

  getUserById: async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('usuarios')
        .select('*')
        .eq('id', userId)
        .single();
      return { data, error };
    } catch (error) {
      console.error('Error in getUserById:', error);
      return { data: null, error: error as any };
    }
  },

  getUserByEmail: async (email: string) => {
    try {
      const { data, error } = await supabase
        .from('usuarios')
        .select('*')
        .eq('email', email.toLowerCase().trim())
        .single();
      
      if (error) {
        console.error('Error in getUserByEmail:', error);
        return { data: null, error };
      }

      return { data, error: null };
    } catch (error) {
      console.error('Exception in getUserByEmail:', error);
      return { data: null, error: error as any };
    }
  },

  updateUserSubscription: async (userId: string, subscriptionData: any) => {
    try {
      const { data, error } = await supabase
        .from('usuarios')
        .update({
          ...subscriptionData,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);
      return { data, error };
    } catch (error) {
      console.error('Error in updateUserSubscription:', error);
      return { data: null, error: error as any };
    }
  },

  createUser: async (userData: Omit<Usuario, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('usuarios')
        .insert([{
          ...userData,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])
        .select()
        .single();
      return { data, error };
    } catch (error) {
      console.error('Error in createUser:', error);
      return { data: null, error: error as any };
    }
  },

  updateUser: async (userId: string, userData: Partial<Usuario>) => {
    try {
      const { data, error } = await supabase
        .from('usuarios')
        .update({
          ...userData,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId)
        .select()
        .single();
      return { data, error };
    } catch (error) {
      console.error('Error in updateUser:', error);
      return { data: null, error: error as any };
    }
  },

  // ========== FOODS ==========
  getFoods: async () => {
    try {
      const { data, error } = await supabase
        .from('foods')
        .select('*')
        .order('nombre');
      return { data: data || [], error };
    } catch (error) {
      console.error('Error in getFoods:', error);
      return { data: [], error: error as any };
    }
  },

  createFood: async (foodData: Omit<Food, 'id' | 'created_at'>) => {
    try {
      // Mapeo automático español ↔ inglés con compatibilidad completa
      const mappedData = {
        ...foodData,
        name: foodData.name || foodData.nombre,
        nombre: foodData.nombre || foodData.name,
        category: foodData.category || foodData.categoria,
        categoria: foodData.categoria || foodData.category,
        calories_per_100g: foodData.calories_per_100g || foodData.calorias_por_100g,
        calorias_por_100g: foodData.calorias_por_100g || foodData.calories_per_100g,
        protein_per_100g: foodData.protein_per_100g || foodData.proteinas_por_100g,
        proteinas_por_100g: foodData.proteinas_por_100g || foodData.protein_per_100g,
        carbs_per_100g: foodData.carbs_per_100g || foodData.carbohidratos_por_100g,
        carbohidratos_por_100g: foodData.carbohidratos_por_100g || foodData.carbs_per_100g,
        fat_per_100g: foodData.fat_per_100g || foodData.grasas_por_100g,
        grasas_por_100g: foodData.grasas_por_100g || foodData.fat_per_100g,
        fiber_per_100g: foodData.fiber_per_100g || foodData.fibra_por_100g,
        fibra_por_100g: foodData.fibra_por_100g || foodData.fiber_per_100g,
        sugar_per_100g: foodData.sugar_per_100g || foodData.azucares_por_100g,
        azucares_por_100g: foodData.azucares_por_100g || foodData.sugar_per_100g,
        sodium_per_100g: foodData.sodium_per_100g || foodData.sodio_por_100g,
        sodio_por_100g: foodData.sodio_por_100g || foodData.sodium_per_100g,
        created_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('foods')
        .insert([mappedData])
        .select()
        .single();
      return { data, error };
    } catch (error) {
      console.error('Error in createFood:', error);
      return { data: null, error: error as any };
    }
  },

  searchFoods: async (searchTerm: string) => {
    try {
      const { data, error } = await supabase
        .from('foods')
        .select('*')
        .or(`nombre.ilike.%${searchTerm}%,name.ilike.%${searchTerm}%`)
        .order('nombre')
        .limit(50);
      return { data: data || [], error };
    } catch (error) {
      console.error('Error in searchFoods:', error);
      return { data: [], error: error as any };
    }
  },

  getFoodsByCategory: async (categoria: string) => {
    try {
      const { data, error } = await supabase
        .from('foods')
        .select('*')
        .eq('categoria', categoria)
        .order('nombre');
      return { data: data || [], error };
    } catch (error) {
      console.error('Error in getFoodsByCategory:', error);
      return { data: [], error: error as any };
    }
  },

  loadInitialFoods: async () => {
    try {
      const { data, error } = await supabase
        .from('foods')
        .select('*')
        .order('nombre')
        .limit(100);
      return { data: data || [], error };
    } catch (error) {
      console.error('Error in loadInitialFoods:', error);
      return { data: [], error: error as any };
    }
  },

  getFoodById: async (foodId: string) => {
    try {
      const { data, error } = await supabase
        .from('foods')
        .select('*')
        .eq('id', foodId)
        .single();
      return { data, error };
    } catch (error) {
      console.error('Error in getFoodById:', error);
      return { data: null, error: error as any };
    }
  },

  updateFood: async (foodId: string, foodData: Partial<Food>) => {
    try {
      const { data, error } = await supabase
        .from('foods')
        .update(foodData)
        .eq('id', foodId)
        .select()
        .single();
      return { data, error };
    } catch (error) {
      console.error('Error in updateFood:', error);
      return { data: null, error: error as any };
    }
  },

  deleteFood: async (foodId: string) => {
    try {
      const { data, error } = await supabase
        .from('foods')
        .delete()
        .eq('id', foodId);
      return { data, error };
    } catch (error) {
      console.error('Error in deleteFood:', error);
      return { data: null, error: error as any };
    }
  },

  // ========== SUPPLEMENTS ==========
  getAllSupplements: async () => {
    try {
      const { data, error } = await supabase
        .from('supplements')
        .select('*')
        .order('name');
      return { data: data || [], error };
    } catch (error) {
      console.error('Error in getAllSupplements:', error);
      return { data: [], error: error as any };
    }
  },

  getSupplementById: async (id: string) => {
    try {
      const { data, error } = await supabase
        .from('supplements')
        .select('*')
        .eq('id', id)
        .single();
      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  },

  createSupplement: async (supplementData: Omit<Supplement, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('supplements')
        .insert([supplementData])
        .select()
        .single();
      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  },

  updateSupplement: async (id: string, supplementData: Partial<Supplement>) => {
    try {
      const { data, error } = await supabase
        .from('supplements')
        .update({
          ...supplementData,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();
      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  },

  deleteSupplement: async (id: string) => {
    try {
      const { data, error } = await supabase
        .from('supplements')
        .delete()
        .eq('id', id);
      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  },

  getUserSupplementRecommendations: async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('supplement_recommendations')
        .select('*, supplements(*)')
        .eq('user_id', userId)
        .eq('is_active', true)
        .order('priority', { ascending: false });
      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  },

  createSupplementRecommendation: async (recommendationData: Omit<SupplementRecommendation, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('supplement_recommendations')
        .insert([recommendationData])
        .select()
        .single();
      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  },

  markSupplementAsPurchased: async (recommendationId: string) => {
    try {
      const { data, error } = await supabase
        .from('supplement_recommendations')
        .update({
          is_active: false,
          updated_at: new Date().toISOString()
        })
        .eq('id', recommendationId)
        .select()
        .single();
      return { data, error };
    } catch (error) {
      console.error('Error in markSupplementAsPurchased:', error);
      return { data: null, error: error as any };
    }
  },

  // ========== WORKOUTS ==========
  getActiveWorkoutsByCategory: async (category: string) => {
    try {
      const { data, error } = await supabase
        .from('workouts')
        .select('*')
        .eq('category', category)
        .eq('active', true)
        .order('name', { ascending: true });

      if (error) {
        console.error('Error fetching workouts by category:', error);
        return { data: [], error };
      }

      return { data: data || [], error: null };
    } catch (error) {
      console.error('Error in getActiveWorkoutsByCategory:', error);
      return { data: [], error: error as any };
    }
  },

  getAllWorkouts: async () => {
    try {
      const { data, error } = await supabase
        .from('workouts')
        .select('*')
        .order('name', { ascending: true });
      return { data: data || [], error };
    } catch (error) {
      console.error('Error in getAllWorkouts:', error);
      return { data: [], error: error as any };
    }
  },

  getWorkoutById: async (workoutId: string) => {
    try {
      const { data, error } = await supabase
        .from('workouts')
        .select('*')
        .eq('id', workoutId)
        .single();
      return { data, error };
    } catch (error) {
      console.error('Error in getWorkoutById:', error);
      return { data: null, error: error as any };
    }
  },

  createWorkout: async (workoutData: Omit<Workout, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('workouts')
        .insert([{
          ...workoutData,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])
        .select()
        .single();
      return { data, error };
    } catch (error) {
      console.error('Error in createWorkout:', error);
      return { data: null, error: error as any };
    }
  },

  updateWorkout: async (workoutId: string, workoutData: Partial<Workout>) => {
    try {
      const { data, error } = await supabase
        .from('workouts')
        .update({
          ...workoutData,
          updated_at: new Date().toISOString()
        })
        .eq('id', workoutId)
        .select()
        .single();
      return { data, error };
    } catch (error) {
      console.error('Error in updateWorkout:', error);
      return { data: null, error: error as any };
    }
  },

  deleteWorkout: async (workoutId: string) => {
    try {
      const { data, error } = await supabase
        .from('workouts')
        .delete()
        .eq('id', workoutId);
      return { data, error };
    } catch (error) {
      console.error('Error in deleteWorkout:', error);
      return { data: null, error: error as any };
    }
  },

  // ========== WORKOUT LINKS ==========
  getAllWorkoutLinks: async () => {
    try {
      const { data, error } = await supabase
        .from('workout_links')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });
      return { data: data || [], error };
    } catch (error) {
      console.error('Error in getAllWorkoutLinks:', error);
      return { data: [], error: error as any };
    }
  },

  createWorkoutLink: async (linkData: Omit<WorkoutLink, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('workout_links')
        .insert([{
          ...linkData,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])
        .select()
        .single();
      return { data, error };
    } catch (error) {
      console.error('Error in createWorkoutLink:', error);
      return { data: null, error: error as any };
    }
  },

  updateWorkoutLink: async (id: string, linkData: Partial<WorkoutLink>) => {
    try {
      const { data, error } = await supabase
        .from('workout_links')
        .update({
          ...linkData,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();
      return { data, error };
    } catch (error) {
      console.error('Error in updateWorkoutLink:', error);
      return { data: null, error: error as any };
    }
  },

  deleteWorkoutLink: async (id: string) => {
    try {
      const { data, error } = await supabase
        .from('workout_links')
        .delete()
        .eq('id', id);
      return { data, error };
    } catch (error) {
      console.error('Error in deleteWorkoutLink:', error);
      return { data: null, error: error as any };
    }
  },

  // 🔧 MINDFULNESS RESOURCES - FUNCIONES CORREGIDAS
  getAllMindfulnessResources: async () => {
    try {
      const { data, error } = await supabase
        .from('mindfulness_resources')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching mindfulness resources:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error in getAllMindfulnessResources:', error);
      return [];
    }
  },

  createMindfulnessResource: async (resourceData: Omit<MindfulnessResource, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('mindfulness_resources')
        .insert([{
          ...resourceData,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])
        .select()
        .single();
      return { data, error };
    } catch (error) {
      console.error('Error in createMindfulnessResource:', error);
      return { data: null, error: error as any };
    }
  },

  updateMindfulnessResource: async (id: string, resourceData: Partial<MindfulnessResource>) => {
    try {
      const { data, error } = await supabase
        .from('mindfulness_resources')
        .update({
          ...resourceData,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();
      return { data, error };
    } catch (error) {
      console.error('Error in updateMindfulnessResource:', error);
      return { data: null, error: error as any };
    }
  },

  deleteMindfulnessResource: async (id: string) => {
    try {
      const { data, error } = await supabase
        .from('mindfulness_resources')
        .delete()
        .eq('id', id);
      return { data, error };
    } catch (error) {
      console.error('Error in deleteMindfulnessResource:', error);
      return { data: null, error: error as any };
    }
  },

  getMindfulnessResourcesByCategory: async (category: string) => {
    try {
      const { data, error } = await supabase
        .from('mindfulness_resources')
        .select('*')
        .eq('category', category)
        .eq('is_active', true)
        .order('created_at', { ascending: false });
      return { data: data || [], error };
    } catch (error) {
      console.error('Error in getMindfulnessResourcesByCategory:', error);
      return { data: [], error: error as any };
    }
  },

  // ========== USER MEALS ==========
  getUserMeals: async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('user_meals')
        .select(`
          *,
          foods (
            id,
            nombre,
            name,
            calorias_por_100g,
            proteinas_por_100g,
            carbohidratos_por_100g,
            grasas_por_100g,
            fibra_por_100g,
            azucares_por_100g,
            sodio_por_100g,
            categoria,
            subcategoria
          )
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      return { data: data || [], error };
    } catch (error) {
      console.error('Error in getUserMeals:', error);
      return { data: [], error: error as any };
    }
  },

  getUserMealsByDate: async (userId: string, date: string) => {
    try {
      const { data, error } = await supabase
        .from('user_meals')
        .select(`
          *,
          foods (
            id,
            nombre,
            name,
            calorias_por_100g,
            proteinas_por_100g,
            carbohidratos_por_100g,
            grasas_por_100g,
            fibra_por_100g,
            azucares_por_100g,
            sodio_por_100g,
            categoria,
            subcategoria
          )
        `)
        .eq('user_id', userId)
        .eq('date', date)
        .order('created_at', { ascending: false });

      return { data: data || [], error };
    } catch (error) {
      console.error('Error in getUserMealsByDate:', error);
      return { data: [], error: error as any };
    }
  },

  getUserMealsByDateAndType: async (userId: string, date: string, mealType: string) => {
    try {
      const { data, error } = await supabase
        .from('user_meals')
        .select(`
          *,
          foods (
            id,
            nombre,
            name,
            calorias_por_100g,
            proteinas_por_100g,
            carbohidratos_por_100g,
            grasas_por_100g,
            fibra_por_100g,
            azucares_por_100g,
            sodio_por_100g,
            categoria,
            subcategoria
          )
        `)
        .eq('user_id', userId)
        .eq('date', date)
        .eq('tipo_comida', mealType)
        .order('created_at', { ascending: false });

      return { data: data || [], error };
    } catch (error) {
      console.error('Error in getUserMealsByDateAndType:', error);
      return { data: [], error: error as any };
    }
  },

  createUserMeal: async (mealData: Omit<UserMeal, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('user_meals')
        .insert([{
          ...mealData,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])
        .select()
        .single();
      return { data, error };
    } catch (error) {
      console.error('Error in createUserMeal:', error);
      return { data: null, error: error as any };
    }
  },

  updateUserMeal: async (mealId: string, mealData: Partial<UserMeal>) => {
    try {
      const { data, error } = await supabase
        .from('user_meals')
        .update({
          ...mealData,
          updated_at: new Date().toISOString()
        })
        .eq('id', mealId)
        .select()
        .single();
      return { data, error };
    } catch (error) {
      console.error('Error in updateUserMeal:', error);
      return { data: null, error: error as any };
    }
  },

  deleteUserMeal: async (mealId: string) => {
    try {
      const { data, error } = await supabase
        .from('user_meals')
        .delete()
        .eq('id', mealId);
      return { data, error };
    } catch (error) {
      console.error('Error in deleteUserMeal:', error);
      return { data: null, error: error as any };
    }
  },

  // ========== WATER INTAKE ==========
  getUserWaterIntakeByDate: async (userId: string, date: string) => {
    try {
      const { data, error } = await supabase
        .from('water_intake')
        .select('*')
        .eq('user_id', userId)
        .eq('date', date)
        .order('created_at', { ascending: false });
      return { data: data || [], error };
    } catch (error) {
      console.error('Error in getUserWaterIntakeByDate:', error);
      return { data: [], error: error as any };
    }
  },

  createWaterIntake: async (waterData: Omit<WaterIntake, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('water_intake')
        .insert([{
          ...waterData,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])
        .select()
        .single();
      return { data, error };
    } catch (error) {
      console.error('Error in createWaterIntake:', error);
      return { data: null, error: error as any };
    }
  },

  updateWaterIntake: async (intakeId: string, waterData: Partial<WaterIntake>) => {
    try {
      const { data, error } = await supabase
        .from('water_intake')
        .update({
          ...waterData,
          updated_at: new Date().toISOString()
        })
        .eq('id', intakeId)
        .select()
        .single();
      return { data, error };
    } catch (error) {
      console.error('Error in updateWaterIntake:', error);
      return { data: null, error: error as any };
    }
  },

  deleteWaterIntake: async (intakeId: string) => {
    try {
      const { data, error } = await supabase
        .from('water_intake')
        .delete()
        .eq('id', intakeId);
      return { data, error };
    } catch (error) {
      console.error('Error in deleteWaterIntake:', error);
      return { data: null, error: error as any };
    }
  },

  getTotalWaterIntakeByDate: async (userId: string, date: string) => {
    try {
      const { data, error } = await supabase
        .from('water_intake')
        .select('amount')
        .eq('user_id', userId)
        .eq('date', date);

      if (error) {
        console.error('Error in getTotalWaterIntakeByDate:', error);
        return { total: 0, error };
      }

      const total = data?.reduce((sum, intake) => sum + intake.amount, 0) || 0;
      return { total, error: null };
    } catch (error) {
      console.error('Error in getTotalWaterIntakeByDate:', error);
      return { total: 0, error: error as any };
    }
  },

  // ========== USER INSIGHTS ==========
  getUserInsights: async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('user_insights')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      return { data: data || [], error };
    } catch (error) {
      console.error('Error in getUserInsights:', error);
      return { data: [], error: error as any };
    }
  },

  getUnviewedUserInsights: async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('user_insights')
        .select('*')
        .eq('user_id', userId)
        .eq('is_viewed', false)
        .order('priority', { ascending: false })
        .order('created_at', { ascending: false });
      return { data: data || [], error };
    } catch (error) {
      console.error('Error in getUnviewedUserInsights:', error);
      return { data: [], error: error as any };
    }
  },

  createUserInsight: async (insightData: Omit<UserInsight, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('user_insights')
        .insert([{
          ...insightData,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])
        .select()
        .single();
      return { data, error };
    } catch (error) {
      console.error('Error in createUserInsight:', error);
      return { data: null, error: error as any };
    }
  },

  markInsightAsViewed: async (insightId: string) => {
    try {
      const { data, error } = await supabase
        .from('user_insights')
        .update({
          is_viewed: true,
          viewed: true, // Compatibilidad
          updated_at: new Date().toISOString()
        })
        .eq('id', insightId)
        .select()
        .single();
      return { data, error };
    } catch (error) {
      console.error('Error in markInsightAsViewed:', error);
      return { data: null, error: error as any };
    }
  },

  deleteUserInsight: async (insightId: string) => {
    try {
      const { data, error } = await supabase
        .from('user_insights')
        .delete()
        .eq('id', insightId);
      return { data, error };
    } catch (error) {
      console.error('Error in deleteUserInsight:', error);
      return { data: null, error: error as any };
    }
  },

  // ========== ANALYTICS & REPORTS ==========
  getUserNutritionSummary: async (userId: string, startDate: string, endDate: string) => {
    try {
      const { data, error } = await supabase
        .from('user_meals')
        .select(`
          *,
          foods (
            calorias_por_100g,
            proteinas_por_100g,
            carbohidratos_por_100g,
            grasas_por_100g
          )
        `)
        .eq('user_id', userId)
        .gte('date', startDate)
        .lte('date', endDate);

      if (error) {
        console.error('Error in getUserNutritionSummary:', error);
        return { data: [], error };
      }

      return { data: data || [], error: null };
    } catch (error) {
      console.error('Error in getUserNutritionSummary:', error);
      return { data: [], error: error as any };
    }
  },

  getUserWeeklyProgress: async (userId: string, weekStart: string) => {
    try {
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekEnd.getDate() + 6);

      const { data, error } = await supabase
        .from('user_meals')
        .select(`
          date,
          portion_grams,
          foods (
            calorias_por_100g,
            proteinas_por_100g,
            carbohidratos_por_100g,
            grasas_por_100g
          )
        `)
        .eq('user_id', userId)
        .gte('date', weekStart)
        .lte('date', weekEnd.toISOString().split('T')[0]);

      return { data: data || [], error };
    } catch (error) {
      console.error('Error in getUserWeeklyProgress:', error);
      return { data: [], error: error as any };
    }
  },

  // ========== BATCH OPERATIONS ==========
  batchCreateFoods: async (foodsData: Omit<Food, 'id' | 'created_at'>[]) => {
    try {
      const mappedFoods = foodsData.map(food => ({
        ...food,
        name: food.name || food.nombre,
        nombre: food.nombre || food.name,
        category: food.category || food.categoria,
        categoria: food.categoria || food.category,
        calories_per_100g: food.calories_per_100g || food.calorias_por_100g,
        calorias_por_100g: food.calorias_por_100g || food.calories_per_100g,
        protein_per_100g: food.protein_per_100g || food.proteinas_por_100g,
        proteinas_por_100g: food.proteinas_por_100g || food.protein_per_100g,
        carbs_per_100g: food.carbs_per_100g || food.carbohidratos_por_100g,
        carbohidratos_por_100g: food.carbohidratos_por_100g || food.carbs_per_100g,
        fat_per_100g: food.fat_per_100g || food.grasas_por_100g,
        grasas_por_100g: food.grasas_por_100g || food.fat_per_100g,
        created_at: new Date().toISOString()
      }));

      const { data, error } = await supabase
        .from('foods')
        .insert(mappedFoods)
        .select();
      return { data: data || [], error };
    } catch (error) {
      console.error('Error in batchCreateFoods:', error);
      return { data: [], error: error as any };
    }
  },

  // ========== UTILITY FUNCTIONS ==========
  healthCheck: async () => {
    try {
      const { data, error } = await supabase
        .from('usuarios')
        .select('id')
        .limit(1);
      
      return { 
        status: error ? 'error' : 'healthy', 
        timestamp: new Date().toISOString(),
        error 
      };
    } catch (error) {
      console.error('Error in healthCheck:', error);
      return { 
        status: 'error', 
        timestamp: new Date().toISOString(),
        error: error as any 
      };
    }
  }
};

// ========================= INITIALIZE DATABASE =========================

// Función para inicializar la base de datos
export const initializeDatabase = async () => {
  try {
    console.log('Inicializando base de datos...');
    
    // Verificar conexión con la base de datos
    const { data, error } = await supabase
      .from('foods')
      .select('count')
      .limit(1);
    
    if (error) {
      console.error('Error checking database:', error);
      return false;
    }
    
    console.log('Base de datos inicializada correctamente');
    return true;
  } catch (error) {
    console.error('Error initializing database:', error);
    return false;
  }
};
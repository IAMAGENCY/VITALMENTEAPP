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

export interface Food {
  id?: string;
  nombre: string;
  name: string;
  calorias_por_100g: number;
  proteinas_por_100g: number;
  carbohidratos_por_100g: number;
  grasas_por_100g: number;
  fibra_por_100g?: number;
  azucares_por_100g?: number;
  sodio_por_100g?: number;
  categoria: string;
  subcategoria?: string;
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
  updated_at?: string; // ← AGREGADO COMO OPTIONAL
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
      // Mapeo automático español ↔ inglés
      const mappedData = {
        ...foodData,
        name: foodData.name || foodData.nombre,
        nombre: foodData.nombre || foodData.name,
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

  // ========== USER INSIGHTS ==========
  getUserInsights: async (userId: string, limit: number = 5) => {
    try {
      const { data, error } = await supabase
        .from('user_insights')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('Error fetching user insights:', error);
        return { data: null, error };
      }

      return { data: data || [], error: null };
    } catch (error) {
      console.error('Exception in getUserInsights:', error);
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
          viewed: true,
          updated_at: new Date().toISOString()
        })
        .eq('id', insightId);
      return { data, error };
    } catch (error) {
      console.error('Error in markInsightAsViewed:', error);
      return { data: null, error: error as any };
    }
  },

  getUnviewedInsights: async (userId: string) => {
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
      console.error('Error in getUnviewedInsights:', error);
      return { data: [], error: error as any };
    }
  },

  // ========== WATER INTAKE ==========
  getWaterIntake: async (userId: string, date: string) => {
    try {
      const { data, error } = await supabase
        .from('water_intake')
        .select('*, total_amount')
        .eq('user_id', userId)
        .eq('date', date)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching water intake:', error);
        return { data: null, error };
      }

      return { data: data || [], error: null };
    } catch (error) {
      console.error('Exception in getWaterIntake:', error);
      return { data: [], error: error as any };
    }
  },

  createWaterIntake: async (userId: string, amount: number, date: string) => {
    try {
      const { data, error } = await supabase
        .from('water_intake')
        .insert([{
          user_id: userId,
          amount: amount,
          date: date,
          created_at: new Date().toISOString()
        }])
        .select()
        .single();
      return { data, error };
    } catch (error) {
      console.error('Error in createWaterIntake:', error);
      return { data: null, error: error as any };
    }
  },

  // ========== FUNCIONES DE AGUA ADICIONALES ==========
  addWaterIntake: async (waterData: { user_id: string; amount_ml: number; date: string }) => {
    try {
      const { data, error } = await supabase
        .from('water_intake')
        .insert([{
          user_id: waterData.user_id,
          amount: waterData.amount_ml,
          date: waterData.date,
          created_at: new Date().toISOString()
        }])
        .select()
        .single();
      return { data, error };
    } catch (error) {
      console.error('Error in addWaterIntake:', error);
      return { data: null, error: error as any };
    }
  },

  removeWaterIntake: async (intakeId: string) => {
    try {
      const { data, error } = await supabase
        .from('water_intake')
        .delete()
        .eq('id', intakeId);
      return { data, error };
    } catch (error) {
      console.error('Error in removeWaterIntake:', error);
      return { data: null, error: error as any };
    }
  },

  getTodayWaterIntake: async (userId: string) => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const { data, error } = await supabase
        .from('water_intake')
        .select('*')
        .eq('user_id', userId)
        .eq('date', today)
        .order('created_at', { ascending: false });

      return { data: data || [], error };
    } catch (error) {
      console.error('Error in getTodayWaterIntake:', error);
      return { data: [], error: error as any };
    }
  },

  updateWaterIntakeAmount: async (intakeId: string, newAmount: number) => {
    try {
      const { data, error } = await supabase
        .from('water_intake')
        .update({ 
          amount: newAmount,
          updated_at: new Date().toISOString()
        })
        .eq('id', intakeId)
        .select()
        .single();
      return { data, error };
    } catch (error) {
      console.error('Error in updateWaterIntakeAmount:', error);
      return { data: null, error: error as any };
    }
  },

  updateWaterIntake: async (intakeId: string, amount: number) => {
    try {
      const { data, error } = await supabase
        .from('water_intake')
        .update({ 
          amount: amount,
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

  getDailyWaterTotal: async (userId: string, date: string) => {
    try {
      const { data, error } = await supabase
        .from('water_intake')
        .select('amount')
        .eq('user_id', userId)
        .eq('date', date);

      if (error) {
        console.error('Error getting daily water total:', error);
        return { total: 0, error };
      }

      const total = data?.reduce((sum, intake) => sum + (intake.amount || 0), 0) || 0;
      return { total, error: null };
    } catch (error) {
      console.error('Exception in getDailyWaterTotal:', error);
      return { total: 0, error: error as any };
    }
  },

  // ========== DELETE FUNCTIONS (FUNCIONES FALTANTES) ==========
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
  }
};

// ========================= SUBSCRIPTION OPERATIONS =========================

export const subscriptionOperations = {
  updateSubscription: async (userId: string, plan: string, endDate: string) => {
    try {
      const { data, error } = await supabase
        .from('usuarios')
        .update({
          subscription_status: plan,
          subscription_end_date: endDate,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);
      return { data, error };
    } catch (error) {
      console.error('Error in updateSubscription:', error);
      return { data: null, error: error as any };
    }
  },

  cancelSubscription: async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('usuarios')
        .update({
          subscription_status: 'free',
          subscription_end_date: null,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);
      return { data, error };
    } catch (error) {
      console.error('Error in cancelSubscription:', error);
      return { data: null, error: error as any };
    }
  },

  checkSubscriptionStatus: async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('usuarios')
        .select('subscription_status, subscription_end_date')
        .eq('id', userId)
        .single();
      return { data, error };
    } catch (error) {
      console.error('Error in checkSubscriptionStatus:', error);
      return { data: null, error: error as any };
    }
  },

  isSubscriptionActive: async (userId: string) => {
    try {
      const { data, error } = await subscriptionOperations.checkSubscriptionStatus(userId);
      
      if (error || !data) {
        return { active: false, plan: 'free' };
      }

      const now = new Date();
      const endDate = data.subscription_end_date ? new Date(data.subscription_end_date) : null;
      
      const isActive = data.subscription_status !== 'free' && 
                      (!endDate || endDate > now);

      return { 
        active: isActive, 
        plan: data.subscription_status || 'free',
        endDate: data.subscription_end_date 
      };
    } catch (error) {
      console.error('Error in isSubscriptionActive:', error);
      return { active: false, plan: 'free' };
    }
  }
};

// ========================= ALIMENTACIÓN OPERATIONS =========================

export const alimentacionOperations = {
  getAlimentos: async () => {
    try {
      const { data, error } = await supabase
        .from('alimentos')
        .select('*')
        .order('nombre');
      return { data: data || [], error };
    } catch (error) {
      console.error('Error in getAlimentos:', error);
      return { data: [], error: error as any };
    }
  },

  createAlimento: async (alimentoData: Omit<Alimento, 'id' | 'created_at'>) => {
    try {
      const { data, error } = await supabase
        .from('alimentos')
        .insert([{
          ...alimentoData,
          created_at: new Date().toISOString()
        }])
        .select()
        .single();
      return { data, error };
    } catch (error) {
      console.error('Error in createAlimento:', error);
      return { data: null, error: error as any };
    }
  },

  updateAlimento: async (id: string, alimentoData: Partial<Alimento>) => {
    try {
      const { data, error } = await supabase
        .from('alimentos')
        .update(alimentoData)
        .eq('id', id)
        .select()
        .single();
      return { data, error };
    } catch (error) {
      console.error('Error in updateAlimento:', error);
      return { data: null, error: error as any };
    }
  },

  deleteAlimento: async (id: string) => {
    try {
      const { data, error } = await supabase
        .from('alimentos')
        .delete()
        .eq('id', id);
      return { data, error };
    } catch (error) {
      console.error('Error in deleteAlimento:', error);
      return { data: null, error: error as any };
    }
  },

  searchAlimentos: async (searchTerm: string) => {
    try {
      const { data, error } = await supabase
        .from('alimentos')
        .select('*')
        .ilike('nombre', `%${searchTerm}%`)
        .order('nombre')
        .limit(50);
      return { data: data || [], error };
    } catch (error) {
      console.error('Error in searchAlimentos:', error);
      return { data: [], error: error as any };
    }
  }
};

// ========================= UTILITY FUNCTIONS =========================

export const initializeDatabase = async () => {
  try {
    // Verificar conexión con usuarios
    const { data, error } = await supabase
      .from('usuarios')
      .select('count', { count: 'exact' })
      .limit(1);
    
    if (error) {
      console.error('Error connecting to database:', error);
      return { success: false, error };
    }

    console.log('Database connected successfully');
    return { success: true, data };
  } catch (error) {
    console.error('Database initialization failed:', error);
    return { success: false, error };
  }
};

// Función helper para validar datos de usuario
export const validateUserData = (userData: Partial<Usuario>): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (!userData.email) {
    errors.push('Email es requerido');
  } else if (!/\S+@\S+\.\S+/.test(userData.email)) {
    errors.push('Email debe tener formato válido');
  }

  if (!userData.nombre || userData.nombre.trim().length < 2) {
    errors.push('Nombre debe tener al menos 2 caracteres');
  }

  if (userData.altura && (userData.altura < 100 || userData.altura > 250)) {
    errors.push('Altura debe estar entre 100 y 250 cm');
  }

  if (userData.peso && (userData.peso < 30 || userData.peso > 300)) {
    errors.push('Peso debe estar entre 30 y 300 kg');
  }

  return { valid: errors.length === 0, errors };
};

// Función helper para calcular macros
export const calculateMacros = (food: Food, gramos: number) => {
  const factor = gramos / 100;
  return {
    calorias: Math.round(food.calorias_por_100g * factor),
    proteinas: Math.round(food.proteinas_por_100g * factor * 10) / 10,
    carbohidratos: Math.round(food.carbohidratos_por_100g * factor * 10) / 10,
    grasas: Math.round(food.grasas_por_100g * factor * 10) / 10,
    fibra: food.fibra_por_100g ? Math.round(food.fibra_por_100g * factor * 10) / 10 : 0,
    azucares: food.azucares_por_100g ? Math.round(food.azucares_por_100g * factor * 10) / 10 : 0,
    sodio: food.sodio_por_100g ? Math.round(food.sodio_por_100g * factor * 10) / 10 : 0
  };
};
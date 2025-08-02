import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Interfaces
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

// Database Operations
export const dbOperations = {
  getUsers: async () => {
    const { data, error } = await supabase.from('usuarios').select('*');
    return { data, error };
  },

  getUserById: async (userId: string) => {
    const { data, error } = await supabase
      .from('usuarios')
      .select('*')
      .eq('id', userId)
      .single();
    return { data, error };
  },

  updateUserSubscription: async (userId: string, subscriptionData: any) => {
    const { data, error } = await supabase
      .from('usuarios')
      .update(subscriptionData)
      .eq('id', userId);
    return { data, error };
  },

  getFoods: async () => {
    const { data, error } = await supabase
      .from('foods')
      .select('*')
      .order('nombre');
    return { data, error };
  },

  getAllSupplements: async () => {
    const { data, error } = await supabase
      .from('supplements')
      .select('*')
      .order('name');
    return { data, error };
  },

  createFood: async (foodData: Omit<Food, 'id' | 'created_at'>) => {
    // Mapeo automático español ↔ inglés
    const mappedData = {
      ...foodData,
      // Si solo viene nombre en español, crear name en inglés (simplificado)
      name: foodData.name || foodData.nombre,
      // Si solo viene name en inglés, crear nombre en español (simplificado)  
      nombre: foodData.nombre || foodData.name
    };

    const { data, error } = await supabase
      .from('foods')
      .insert([mappedData])
      .select()
      .single();
    return { data, error };
  },

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

      return { data, error };
    } catch (error) {
      console.error('Error getting user meals:', error);
      return { data: null, error };
    }
  },

  markInsightAsViewed: async (insightId: string) => {
    const { data, error } = await supabase
      .from('user_insights')
      .update({ viewed: true })
      .eq('id', insightId);
    return { data, error };
  }
};

// Subscription Operations
export const subscriptionOperations = {
  updateSubscription: async (userId: string, plan: string, endDate: string) => {
    const { data, error } = await supabase
      .from('usuarios')
      .update({
        subscription_status: plan,
        subscription_end_date: endDate,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId);
    return { data, error };
  },

  cancelSubscription: async (userId: string) => {
    const { data, error } = await supabase
      .from('usuarios')
      .update({
        subscription_status: 'free',
        subscription_end_date: null,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId);
    return { data, error };
  },

  checkSubscriptionStatus: async (userId: string) => {
    const { data, error } = await supabase
      .from('usuarios')
      .select('subscription_status, subscription_end_date')
      .eq('id', userId)
      .single();
    return { data, error };
  }
};

// Alimentación Operations
export const alimentacionOperations = {
  getAlimentos: async () => {
    const { data, error } = await supabase
      .from('alimentos')
      .select('*')
      .order('nombre');
    return { data, error };
  },

  createAlimento: async (alimentoData: Omit<Alimento, 'id' | 'created_at'>) => {
    const { data, error } = await supabase
      .from('alimentos')
      .insert([alimentoData])
      .select()
      .single();
    return { data, error };
  },

  updateAlimento: async (id: string, alimentoData: Partial<Alimento>) => {
    const { data, error } = await supabase
      .from('alimentos')
      .update(alimentoData)
      .eq('id', id)
      .select()
      .single();
    return { data, error };
  },

  deleteAlimento: async (id: string) => {
    const { data, error } = await supabase
      .from('alimentos')
      .delete()
      .eq('id', id);
    return { data, error };
  }
};

// Initialize Database
export const initializeDatabase = async () => {
  try {
    // Verificar conexión
    const { data, error } = await supabase.from('usuarios').select('count', { count: 'exact' });
    
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

// 1. AGREGAR esta función al final del objeto dbOperations en lib/supabase.ts:

loadInitialFoods: async () => {
  try {
    const { data, error } = await supabase
      .from('foods')
      .select('*')
      .order('nombre')
      .limit(100); // Limitar para rendimiento inicial

    return { data, error };
  } catch (error) {
    console.error('Error loading initial foods:', error);
    return { data: null, error };
  }
},

// 2. CORREGIR en app/alimentacion/banco/BankManager.tsx línea 67:
// CAMBIAR:
filtered = filtered.filter(food => food.category === selectedCategory);

// POR:
filtered = filtered.filter(food => food.categoria === selectedCategory);
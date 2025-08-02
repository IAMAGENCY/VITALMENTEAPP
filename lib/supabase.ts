import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Interfaces de tipos
export interface Usuario {
  id: string;
  nombre: string;
  apellidos?: string; // Hacer opcional para compatibilidad
  email: string;
  telefono?: string;
  fecha_nacimiento?: string;
  genero?: 'masculino' | 'femenino' | 'otro';
  peso?: number;
  altura?: number;
  nivel_actividad?: 'sedentario' | 'ligero' | 'moderado' | 'intenso' | 'muy_intenso';
  objetivo?: 'perder_peso' | 'mantener_peso' | 'ganar_peso' | 'ganar_musculo';
  subscription_status?: 'free' | 'premium';
  // Campos adicionales que puede usar el registro
  edad?: number;
  actividad?: string;
  experiencia?: string;
  condiciones?: string[];
  preferencias?: string[];
  created_at?: string;
  updated_at?: string;
}

export interface AlimentoConsumo {
  id: string;
  usuario_id: string;
  alimento_id: string;
  cantidad: number;
  unidad: string;
  comida_tipo: 'desayuno' | 'almuerzo' | 'cena' | 'merienda';
  fecha: string;
  created_at?: string;
}

export interface Alimento {
  id: string;
  nombre: string;
  categoria: string;
  calorias_por_100g: number;
  proteinas_por_100g: number;
  carbohidratos_por_100g: number;
  grasas_por_100g: number;
  fibra_por_100g?: number;
  created_at?: string;
}

// Interface Food - MANTENIENDO LOS NOMBRES CORRECTOS _per_100g
export interface Food {
  id: string;
  name: string;                     // Nombre del alimento
  name_en?: string;                 // Nombre en inglés (opcional)
  category: string;                 // Categoría del alimento
  category_en?: string;             // Categoría en inglés (opcional)
  calories_per_100g: number;        // Calorías por 100g
  protein_per_100g: number;         // Proteínas por 100g ✅ CORRECTO
  carbs_per_100g: number;           // Carbohidratos por 100g ✅ CORRECTO
  fat_per_100g: number;             // Grasas por 100g ✅ CORRECTO
  fiber_per_100g?: number;          // Fibra por 100g ✅ CORRECTO
  sugar?: number;                   // Azúcares por 100g
  is_custom?: boolean;              // Alimento personalizado
  created_at?: string;              // Fecha de creación
}

export interface RegistroEjercicio {
  id: string;
  usuario_id: string;
  ejercicio: string;
  duracion_minutos: number;
  intensidad: 'baja' | 'media' | 'alta';
  calorias_quemadas?: number;
  fecha: string;
  created_at?: string;
}

export interface RegistroSalud {
  id: string;
  usuario_id: string;
  peso?: number;
  presion_sistolica?: number;
  presion_diastolica?: number;
  frecuencia_cardiaca?: number;
  nivel_estres?: number;
  calidad_sueno?: number;
  horas_sueno?: number;
  fecha: string;
  created_at?: string;
}

export interface Meta {
  id: string;
  usuario_id: string;
  tipo: 'peso' | 'calorias' | 'ejercicio' | 'agua';
  valor_objetivo: number;
  valor_actual?: number;
  unidad: string;
  fecha_limite?: string;
  completada?: boolean;
  created_at?: string;
}

export interface Plan {
  id: string;
  usuario_id: string;
  nombre: string;
  descripcion?: string;
  tipo: 'alimentacion' | 'ejercicio' | 'mixto';
  duracion_dias: number;
  activo: boolean;
  created_at?: string;
}

export interface Subscription {
  id: string;
  user_id: string;
  status: 'active' | 'cancelled' | 'expired';
  plan_type: 'premium';
  start_date: string;
  end_date?: string;
  cancelled_at?: string;
  created_at?: string;
}

export interface UserInsight {
  id: string;
  user_id: string;
  type: 'tip' | 'warning' | 'achievement' | 'recommendation';
  title: string;
  message: string;
  is_viewed: boolean;
  priority: 'low' | 'medium' | 'high';
  created_at: string;
}

// Operaciones de base de datos
export const dbOperations = {
  async getUsers() {
    const { data, error } = await supabase
      .from('usuarios')
      .select('*')
      .order('created_at', { ascending: false });
    
    return { data, error };
  },

  async getUserById(userId: string) {
    const { data, error } = await supabase
      .from('usuarios')
      .select('*')
      .eq('id', userId)
      .single();
    
    return { data, error };
  },

  async updateUserSubscription(userId: string, subscriptionStatus: 'free' | 'premium') {
    const { data, error } = await supabase
      .from('usuarios')
      .update({ 
        subscription_status: subscriptionStatus,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId)
      .select()
      .single();
    
    return { data, error };
  },

  async createUser(userData: Omit<Usuario, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('usuarios')
      .insert([{
        ...userData,
        apellidos: userData.apellidos || null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }])
      .select()
      .single();
    
    return { data, error };
  },

  async updateUser(userId: string, updates: Partial<Usuario>) {
    const { data, error } = await supabase
      .from('usuarios')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId)
      .select()
      .single();
    
    return { data, error };
  },

  async getFoods() {
    const { data, error } = await supabase
      .from('foods')
      .select('*')
      .order('name');
    
    return { data, error };
  },

  async createFood(foodData: Omit<Food, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('foods')
      .insert([{
        ...foodData,
        created_at: new Date().toISOString()
      }])
      .select()
      .single();

    return { data, error };
  },

  async getAllSupplements() {
    const { data, error } = await supabase
      .from('suplementos')
      .select('*')
      .order('nombre');
    
    return { data, error };
  },

  async getUserInsights(userId: string, limit: number = 10) {
    const { data, error } = await supabase
      .from('user_insights')
      .select('*')
      .eq('user_id', userId)
      .eq('is_viewed', false)
      .order('created_at', { ascending: false })
      .limit(limit);
    
    return { data, error };
  },

  async markInsightAsViewed(insightId: string) {
    try {
      const { data, error } = await supabase
        .from('user_insights')
        .update({ is_viewed: true, viewed_at: new Date().toISOString() })
        .eq('id', insightId);
      
      return { data, error };
    } catch (error) {
      console.error('Error marking insight as viewed:', error);
      return { data: null, error };
    }
  }
};

// Operaciones de alimentación
export const alimentacionOperations = {
  async getAlimentos() {
    const { data, error } = await supabase
      .from('alimentos')
      .select('*')
      .order('nombre');
    
    return { data, error };
  },

  async getAlimentoById(alimentoId: string) {
    const { data, error } = await supabase
      .from('alimentos')
      .select('*')
      .eq('id', alimentoId)
      .single();
    
    return { data, error };
  },

  async searchAlimentos(query: string) {
    const { data, error } = await supabase
      .from('alimentos')
      .select('*')
      .ilike('nombre', `%${query}%`)
      .order('nombre')
      .limit(20);
    
    return { data, error };
  },

  async getConsumosByUser(userId: string, fecha?: string) {
    let query = supabase
      .from('alimento_consumos')
      .select(`
        *,
        alimentos (
          nombre,
          calorias_por_100g,
          proteinas_por_100g,
          carbohidratos_por_100g,
          grasas_por_100g
        )
      `)
      .eq('usuario_id', userId);

    if (fecha) {
      query = query.eq('fecha', fecha);
    }

    const { data, error } = await query.order('created_at', { ascending: false });
    
    return { data, error };
  },

  async createConsumo(consumoData: Omit<AlimentoConsumo, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('alimento_consumos')
      .insert([{
        ...consumoData,
        created_at: new Date().toISOString()
      }])
      .select()
      .single();
    
    return { data, error };
  },

  async deleteConsumo(consumoId: string) {
    const { data, error } = await supabase
      .from('alimento_consumos')
      .delete()
      .eq('id', consumoId);
    
    return { data, error };
  }
};

// Operaciones de ejercicio
export const ejercicioOperations = {
  async getRegistrosByUser(userId: string, fecha?: string) {
    let query = supabase
      .from('registro_ejercicios')
      .select('*')
      .eq('usuario_id', userId);

    if (fecha) {
      query = query.eq('fecha', fecha);
    }

    const { data, error } = await query.order('created_at', { ascending: false });
    
    return { data, error };
  },

  async createRegistro(registroData: Omit<RegistroEjercicio, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('registro_ejercicios')
      .insert([{
        ...registroData,
        created_at: new Date().toISOString()
      }])
      .select()
      .single();
    
    return { data, error };
  },

  async deleteRegistro(registroId: string) {
    const { data, error } = await supabase
      .from('registro_ejercicios')
      .delete()
      .eq('id', registroId);
    
    return { data, error };
  }
};

// Operaciones de salud
export const saludOperations = {
  async getRegistrosByUser(userId: string, fecha?: string) {
    let query = supabase
      .from('registro_salud')
      .select('*')
      .eq('usuario_id', userId);

    if (fecha) {
      query = query.eq('fecha', fecha);
    }

    const { data, error } = await query.order('fecha', { ascending: false });
    
    return { data, error };
  },

  async createRegistro(registroData: Omit<RegistroSalud, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('registro_salud')
      .insert([{
        ...registroData,
        created_at: new Date().toISOString()
      }])
      .select()
      .single();
    
    return { data, error };
  },

  async updateRegistro(registroId: string, updates: Partial<RegistroSalud>) {
    const { data, error } = await supabase
      .from('registro_salud')
      .update(updates)
      .eq('id', registroId)
      .select()
      .single();
    
    return { data, error };
  }
};

// Operaciones de metas
export const metasOperations = {
  async getMetasByUser(userId: string) {
    const { data, error } = await supabase
      .from('metas')
      .select('*')
      .eq('usuario_id', userId)
      .order('created_at', { ascending: false });
    
    return { data, error };
  },

  async createMeta(metaData: Omit<Meta, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('metas')
      .insert([{
        ...metaData,
        created_at: new Date().toISOString()
      }])
      .select()
      .single();
    
    return { data, error };
  },

  async updateMeta(metaId: string, updates: Partial<Meta>) {
    const { data, error } = await supabase
      .from('metas')
      .update(updates)
      .eq('id', metaId)
      .select()
      .single();
    
    return { data, error };
  },

  async deleteMeta(metaId: string) {
    const { data, error } = await supabase
      .from('metas')
      .delete()
      .eq('id', metaId);
    
    return { data, error };
  }
};

// Operaciones de planes
export const planesOperations = {
  async getPlanesByUser(userId: string) {
    const { data, error } = await supabase
      .from('planes')
      .select('*')
      .eq('usuario_id', userId)
      .order('created_at', { ascending: false });
    
    return { data, error };
  },

  async createPlan(planData: Omit<Plan, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('planes')
      .insert([{
        ...planData,
        created_at: new Date().toISOString()
      }])
      .select()
      .single();
    
    return { data, error };
  },

  async updatePlan(planId: string, updates: Partial<Plan>) {
    const { data, error } = await supabase
      .from('planes')
      .update(updates)
      .eq('id', planId)
      .select()
      .single();
    
    return { data, error };
  },

  async deletePlan(planId: string) {
    const { data, error } = await supabase
      .from('planes')
      .delete()
      .eq('id', planId);
    
    return { data, error };
  }
};

// Operaciones de suscripción
export const subscriptionOperations = {
  async create(subscriptionData: Omit<Subscription, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('subscriptions')
      .insert([{
        ...subscriptionData,
        created_at: new Date().toISOString()
      }])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async getByUserId(userId: string) {
    const { data, error } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', userId)
      .single();
    
    if (error && error.code !== 'PGRST116') throw error;
    return data;
  },

  async update(id: string, updates: Partial<Subscription>) {
    const { data, error } = await supabase
      .from('subscriptions')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async cancel(id: string) {
    const { data, error } = await supabase
      .from('subscriptions')
      .update({ 
        status: 'cancelled', 
        cancelled_at: new Date().toISOString() 
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
};

// Función para cargar alimentos iniciales en la base de datos
export const loadInitialFoods = async () => {
  try {
    // Verificar si ya existen alimentos en la base de datos
    const { data: existingFoods, error: checkError } = await supabase
      .from('foods')
      .select('id')
      .limit(1);

    if (checkError) {
      console.error('Error checking existing foods:', checkError);
      return false;
    }

    // Si ya existen alimentos, no cargar más
    if (existingFoods && existingFoods.length > 0) {
      console.log('Foods already exist in database');
      return true;
    }

    // Lista de alimentos iniciales básicos - USANDO LOS NOMBRES CORRECTOS
    const initialFoods = [
      {
        name: 'Manzana',
        name_en: 'Apple',
        category: 'Frutas',
        category_en: 'Fruits',
        calories_per_100g: 52,
        protein_per_100g: 0.3,        // ✅ CORRECTO
        carbs_per_100g: 14,           // ✅ CORRECTO
        fat_per_100g: 0.2,            // ✅ CORRECTO
        fiber_per_100g: 2.4,          // ✅ CORRECTO
        sugar: 10.4
      },
      {
        name: 'Pollo (pechuga)',
        name_en: 'Chicken breast',
        category: 'Proteínas',
        category_en: 'Proteins',
        calories_per_100g: 165,
        protein_per_100g: 31,         // ✅ CORRECTO
        carbs_per_100g: 0,            // ✅ CORRECTO
        fat_per_100g: 3.6,            // ✅ CORRECTO
        fiber_per_100g: 0,            // ✅ CORRECTO
        sugar: 0
      },
      {
        name: 'Arroz blanco',
        name_en: 'White rice',
        category: 'Cereales',
        category_en: 'Grains',
        calories_per_100g: 130,
        protein_per_100g: 2.7,        // ✅ CORRECTO
        carbs_per_100g: 28,           // ✅ CORRECTO
        fat_per_100g: 0.3,            // ✅ CORRECTO
        fiber_per_100g: 0.4,          // ✅ CORRECTO
        sugar: 0.1
      },
      {
        name: 'Brócoli',
        name_en: 'Broccoli',
        category: 'Verduras',
        category_en: 'Vegetables',
        calories_per_100g: 34,
        protein_per_100g: 2.8,        // ✅ CORRECTO
        carbs_per_100g: 7,            // ✅ CORRECTO
        fat_per_100g: 0.4,            // ✅ CORRECTO
        fiber_per_100g: 2.6,          // ✅ CORRECTO
        sugar: 1.5
      },
      {
        name: 'Salmón',
        name_en: 'Salmon',
        category: 'Proteínas',
        category_en: 'Proteins',
        calories_per_100g: 208,
        protein_per_100g: 25,         // ✅ CORRECTO
        carbs_per_100g: 0,            // ✅ CORRECTO
        fat_per_100g: 12,             // ✅ CORRECTO
        fiber_per_100g: 0,            // ✅ CORRECTO
        sugar: 0
      },
      {
        name: 'Avena',
        name_en: 'Oats',
        category: 'Cereales',
        category_en: 'Grains',
        calories_per_100g: 389,
        protein_per_100g: 16.9,       // ✅ CORRECTO
        carbs_per_100g: 66.3,         // ✅ CORRECTO
        fat_per_100g: 6.9,            // ✅ CORRECTO
        fiber_per_100g: 10.6,         // ✅ CORRECTO
        sugar: 0.99
      },
      {
        name: 'Huevo',
        name_en: 'Egg',
        category: 'Proteínas',
        category_en: 'Proteins',
        calories_per_100g: 155,
        protein_per_100g: 13,         // ✅ CORRECTO
        carbs_per_100g: 1.1,          // ✅ CORRECTO
        fat_per_100g: 11,             // ✅ CORRECTO
        fiber_per_100g: 0,            // ✅ CORRECTO
        sugar: 1.1
      },
      {
        name: 'Plátano',
        name_en: 'Banana',
        category: 'Frutas',
        category_en: 'Fruits',
        calories_per_100g: 89,
        protein_per_100g: 1.1,        // ✅ CORRECTO
        carbs_per_100g: 22.8,         // ✅ CORRECTO
        fat_per_100g: 0.3,            // ✅ CORRECTO
        fiber_per_100g: 2.6,          // ✅ CORRECTO
        sugar: 12.2
      }
    ];

    // Insertar alimentos iniciales
    const { data, error } = await supabase
      .from('foods')
      .insert(initialFoods)
      .select();

    if (error) {
      console.error('Error loading initial foods:', error);
      return false;
    }

    console.log(`Successfully loaded ${data?.length || 0} initial foods`);
    return true;

  } catch (error) {
    console.error('Error in loadInitialFoods:', error);
    return false;
  }
};

// Funciones auxiliares
export const calcularCalorias = (alimento: Alimento, cantidad: number): number => {
  return Math.round((alimento.calorias_por_100g * cantidad) / 100);
};

export const calcularMacronutrientes = (alimento: Alimento, cantidad: number) => {
  const factor = cantidad / 100;
  return {
    calorias: Math.round(alimento.calorias_por_100g * factor),
    proteinas: Math.round(alimento.proteinas_por_100g * factor * 10) / 10,
    carbohidratos: Math.round(alimento.carbohidratos_por_100g * factor * 10) / 10,
    grasas: Math.round(alimento.grasas_por_100g * factor * 10) / 10,
    fibra: alimento.fibra_por_100g ? Math.round(alimento.fibra_por_100g * factor * 10) / 10 : 0
  };
};

export const calcularCaloriasPorEjercicio = (
  ejercicio: string, 
  duracionMinutos: number, 
  intensidad: 'baja' | 'media' | 'alta',
  pesoKg: number = 70
): number => {
  // MET (Metabolic Equivalent of Task) values aproximados
  const metValues: Record<string, Record<string, number>> = {
    'caminar': { baja: 3.0, media: 4.0, alta: 5.0 },
    'correr': { baja: 6.0, media: 8.0, alta: 11.0 },
    'nadar': { baja: 4.0, media: 6.0, alta: 8.0 },
    'ciclismo': { baja: 4.0, media: 8.0, alta: 12.0 },
    'pesas': { baja: 3.0, media: 5.0, alta: 6.0 },
    'yoga': { baja: 2.5, media: 3.0, alta: 4.0 },
    'aerobicos': { baja: 5.0, media: 7.0, alta: 9.0 }
  };

  const ejercicioKey = ejercicio.toLowerCase();
  const met = metValues[ejercicioKey]?.[intensidad] || 4.0; // Valor por defecto

  // Fórmula: Calorías = MET × peso (kg) × tiempo (horas)
  const calorias = met * pesoKg * (duracionMinutos / 60);
  
  return Math.round(calorias);
};

export default supabase;

// Función para inicializar la base de datos con datos de ejemplo
export const initializeDatabase = async () => {
  try {
    console.log('🚀 Inicializando base de datos...');

    // Verificar si ya existen datos
    const { data: existingUsers } = await supabase
      .from('usuarios')
      .select('id')
      .limit(1);

    if (existingUsers && existingUsers.length > 0) {
      console.log('✅ Base de datos ya inicializada');
      return { success: true, message: 'Base de datos ya contiene datos' };
    }

    // Insertar usuario de ejemplo
    const { data: userData, error: userError } = await supabase
      .from('usuarios')
      .insert([{
        nombre: 'Usuario',
        apellidos: 'Ejemplo',
        email: 'usuario@vitalmente.com',
        telefono: '1234567890',
        genero: 'masculino',
        peso: 70,
        altura: 175,
        nivel_actividad: 'moderado',
        objetivo: 'mantener_peso',
        subscription_status: 'free',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (userError) {
      console.error('❌ Error creando usuario:', userError);
      return { success: false, error: userError };
    }

    // Inicializar alimentos usando la función loadInitialFoods
    const foodsLoaded = await loadInitialFoods();
    
    if (!foodsLoaded) {
      console.log('⚠️ Warning: Could not load initial foods');
    }

    // Insertar alimentos de ejemplo en tabla alimentos (formato español)
    const alimentosEjemplo = [
      {
        nombre: 'Arroz blanco cocido',
        categoria: 'cereales',
        calorias_por_100g: 130,
        proteinas_por_100g: 2.7,
        carbohidratos_por_100g: 28,
        grasas_por_100g: 0.3,
        fibra_por_100g: 0.4
      },
      {
        nombre: 'Pollo pechuga sin piel',
        categoria: 'carnes',
        calorias_por_100g: 165,
        proteinas_por_100g: 31,
        carbohidratos_por_100g: 0,
        grasas_por_100g: 3.6,
        fibra_por_100g: 0
      },
      {
        nombre: 'Banana',
        categoria: 'frutas',
        calorias_por_100g: 89,
        proteinas_por_100g: 1.1,
        carbohidratos_por_100g: 23,
        grasas_por_100g: 0.3,
        fibra_por_100g: 2.6
      }
    ];

    const { error: alimentosError } = await supabase
      .from('alimentos')
      .insert(alimentosEjemplo);

    if (alimentosError) {
      console.error('❌ Error insertando alimentos:', alimentosError);
    }

    // Insertar suplementos de ejemplo (si la tabla existe)
    const suplementosEjemplo = [
      {
        nombre: 'Proteína Whey',
        categoria: 'proteinas',
        descripcion: 'Proteína de suero de leche',
        dosis_recomendada: '30g',
        created_at: new Date().toISOString()
      },
      {
        nombre: 'Creatina',
        categoria: 'rendimiento',
        descripcion: 'Monohidrato de creatina',
        dosis_recomendada: '5g',
        created_at: new Date().toISOString()
      }
    ];

    const { error: suplementosError } = await supabase
      .from('suplementos')
      .insert(suplementosEjemplo);

    if (suplementosError) {
      console.log('⚠️ Tabla suplementos no existe o error insertando:', suplementosError.message);
    }

    console.log('✅ Base de datos inicializada correctamente');
    
    return { 
      success: true, 
      message: 'Base de datos inicializada con datos de ejemplo',
      userData 
    };

  } catch (error) {
    console.error('❌ Error inicializando base de datos:', error);
    return { success: false, error };
  }
};
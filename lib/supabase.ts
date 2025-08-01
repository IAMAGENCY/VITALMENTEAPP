import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Interfaces de tipos
export interface Usuario {
  id: string;
  nombre: string;
  apellidos: string;
  email: string;
  telefono?: string;
  fecha_nacimiento?: string;
  genero?: 'masculino' | 'femenino' | 'otro';
  peso?: number;
  altura?: number;
  nivel_actividad?: 'sedentario' | 'ligero' | 'moderado' | 'intenso' | 'muy_intenso';
  objetivo?: 'perder_peso' | 'mantener_peso' | 'ganar_peso' | 'ganar_musculo';
  subscription_status?: 'free' | 'premium';
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

// Interface para banco de alimentos
export interface BancoAlimento {
  id?: string;
  nombre: string;
  categoria: string;
  calorias_por_100g: number;
  proteinas: number;
  carbohidratos: number;
  grasas: number;
  fibra?: number;
  vitaminas?: string;
  minerales?: string;
  beneficios?: string;
  created_at?: string;
}

// Alias para compatibilidad con código existente
export interface Food {
  id: string;
  name: string;                  // Mapea a 'nombre'
  category: string;              // Mapea a 'categoria'
  calories_per_100g: number;     // Mapea a 'calorias_por_100g'
  protein_per_100g: number;      // Mapea a 'proteinas_por_100g'
  carbs_per_100g: number;        // Mapea a 'carbohidratos_por_100g'
  fat_per_100g: number;          // Mapea a 'grasas_por_100g'
  fiber_per_100g?: number;       // Mapea a 'fibra_por_100g'
  is_custom?: boolean;           // Campo adicional para alimentos personalizados
  created_at?: string;
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
      .from('alimentos')
      .select('*')
      .order('nombre');
    
    // Mapear los datos del español al inglés para compatibilidad
    const mappedData = data?.map(item => ({
      id: item.id,
      name: item.nombre,
      category: item.categoria,
      calories_per_100g: item.calorias_por_100g,
      protein_per_100g: item.proteinas_por_100g,
      carbs_per_100g: item.carbohidratos_por_100g,
      fat_per_100g: item.grasas_por_100g,
      fiber_per_100g: item.fibra_por_100g,
      is_custom: item.is_custom || false,
      created_at: item.created_at
    }));
    
    return { data: mappedData, error };
  },

  async createFood(foodData: Omit<Food, 'id' | 'created_at'>) {
    // Mapear del inglés al español para la base de datos
    const mappedData = {
      nombre: foodData.name,
      categoria: foodData.category,
      calorias_por_100g: foodData.calories_per_100g,
      proteinas_por_100g: foodData.protein_per_100g,
      carbohidratos_por_100g: foodData.carbs_per_100g,
      grasas_por_100g: foodData.fat_per_100g,
      fibra_por_100g: foodData.fiber_per_100g || 0,
      is_custom: foodData.is_custom || true,
      created_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('alimentos')
      .insert([mappedData])
      .select()
      .single();

    // Mapear la respuesta de vuelta al inglés
    const mappedResponse = data ? {
      id: data.id,
      name: data.nombre,
      category: data.categoria,
      calories_per_100g: data.calorias_por_100g,
      protein_per_100g: data.proteinas_por_100g,
      carbs_per_100g: data.carbohidratos_por_100g,
      fat_per_100g: data.grasas_por_100g,
      fiber_per_100g: data.fibra_por_100g,
      is_custom: data.is_custom,
      created_at: data.created_at
    } : null;

    return { data: mappedResponse, error };
  },

  async getAllSupplements() {
    const { data, error } = await supabase
      .from('suplementos')
      .select('*')
      .order('nombre');
    
    return { data, error };
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

// Operaciones del banco de alimentos
export const bancoAlimentosOperations = {
  async getBancoAlimentos() {
    const { data, error } = await supabase
      .from('banco_alimentos')
      .select('*')
      .order('nombre');
    
    return { data, error };
  },

  async searchBancoAlimentos(query: string) {
    const { data, error } = await supabase
      .from('banco_alimentos')
      .select('*')
      .or(`nombre.ilike.%${query}%,categoria.ilike.%${query}%`)
      .order('nombre')
      .limit(20);
    
    return { data, error };
  },

  async getBancoAlimentosByCategory(categoria: string) {
    const { data, error } = await supabase
      .from('banco_alimentos')
      .select('*')
      .eq('categoria', categoria)
      .order('nombre');
    
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

    // Insertar alimentos de ejemplo
    const alimentosEjemplo = [
      {
        nombre: 'Aguacate',
        categoria: 'Frutas',
        calorias_por_100g: 160,
        proteinas: 2,
        carbohidratos: 9,
        grasas: 15,
        fibra: 7,
        vitaminas: 'K, E, C',
        minerales: 'Potasio, Folato',
        beneficios: 'Grasas saludables, rico en fibra'
      },
      {
        nombre: 'Espinacas',
        categoria: 'Verduras',
        calorias_por_100g: 23,
        proteinas: 2.9,
        carbohidratos: 3.6,
        grasas: 0.4,
        fibra: 2.2,
        vitaminas: 'A, C, K',
        minerales: 'Hierro, Calcio',
        beneficios: 'Alto en hierro y antioxidantes'
      },
      {
        nombre: 'Yogur Griego',
        categoria: 'Lácteos',
        calorias_por_100g: 59,
        proteinas: 10,
        carbohidratos: 3.6,
        grasas: 0.4,
        fibra: 0,
        vitaminas: 'B12, B2',
        minerales: 'Calcio, Probióticos',
        beneficios: 'Alto en proteína, probióticos para digestión'
      },
      {
        nombre: 'Almendras',
        categoria: 'Frutos Secos',
        calorias_por_100g: 579,
        proteinas: 21,
        carbohidratos: 22,
        grasas: 50,
        fibra: 12,
        vitaminas: 'E, B2',
        minerales: 'Magnesio, Calcio',
        beneficios: 'Grasas saludables, vitamina E'
      },
      {
        nombre: 'Lentejas',
        categoria: 'Legumbres',
        calorias_por_100g: 116,
        proteinas: 9,
        carbohidratos: 20,
        grasas: 0.4,
        fibra: 8,
        vitaminas: 'Folato, B1',
        minerales: 'Hierro, Potasio',
        beneficios: 'Alta en proteína vegetal y fibra'
      },
      {
        nombre: 'Batata',
        categoria: 'Verduras',
        calorias_por_100g: 86,
        proteinas: 1.6,
        carbohidratos: 20,
        grasas: 0.1,
        fibra: 3,
        vitaminas: 'A, C',
        minerales: 'Potasio, Manganeso',
        beneficios: 'Rica en betacarotenos y fibra'
      }
    ];

    // Insertar alimentos en el banco
    const { data, error } = await supabase
      .from('banco_alimentos')
      .insert(alimentosIniciales.map(alimento => ({
        ...alimento,
        created_at: new Date().toISOString()
      })))
      .select();

    if (error) {
      console.error('❌ Error insertando alimentos iniciales:', error);
      throw error;
    }

    console.log('✅ Alimentos iniciales cargados exitosamente:', data?.length);
    return { 
      success: true, 
      message: `${data?.length || 0} alimentos cargados al banco`,
      data 
    };

  } catch (error) {
    console.error('❌ Error en loadInitialFoods:', error);
    return { 
      success: false, 
      error,
      message: 'Error cargando alimentos iniciales'
    };
  }
}; 'Arroz blanco cocido',
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

// ⭐ FUNCIÓN FALTANTE: loadInitialFoods (Esta es la que necesitabas)
export const loadInitialFoods = async () => {
  try {
    console.log('🔄 Iniciando carga de alimentos al banco...');
    
    // Verificar si ya existen alimentos en el banco
    const { data: existingFoods, error: checkError } = await supabase
      .from('banco_alimentos')
      .select('id')
      .limit(1);

    if (checkError) {
      console.error('❌ Error verificando alimentos existentes:', checkError);
      throw checkError;
    }

    // Si ya hay alimentos, no cargar más
    if (existingFoods && existingFoods.length > 0) {
      console.log('✅ Ya existen alimentos en el banco, omitiendo carga inicial');
      return { success: true, message: 'Alimentos ya cargados previamente' };
    }

    // Datos de alimentos iniciales para el banco
    const alimentosIniciales: Omit<BancoAlimento, 'id' | 'created_at'>[] = [
      {
        nombre: 'Manzana',
        categoria: 'Frutas',
        calorias_por_100g: 52,
        proteinas: 0.3,
        carbohidratos: 14,
        grasas: 0.2,
        fibra: 2.4,
        vitaminas: 'C, A',
        minerales: 'Potasio',
        beneficios: 'Rica en antioxidantes, fibra y vitamina C'
      },
      {
        nombre: 'Pechuga de Pollo',
        categoria: 'Carnes',
        calorias_por_100g: 165,
        proteinas: 31,
        carbohidratos: 0,
        grasas: 3.6,
        fibra: 0,
        vitaminas: 'B3, B6',
        minerales: 'Fósforo, Selenio',
        beneficios: 'Excelente fuente de proteína magra'
      },
      {
        nombre: 'Arroz Integral',
        categoria: 'Cereales',
        calorias_por_100g: 111,
        proteinas: 2.6,
        carbohidratos: 23,
        grasas: 0.9,
        fibra: 1.8,
        vitaminas: 'B1, B3',
        minerales: 'Manganeso, Magnesio',
        beneficios: 'Carbohidrato complejo rico en fibra'
      },
      {
        nombre: 'Brócoli',
        categoria: 'Verduras',
        calorias_por_100g: 34,
        proteinas: 2.8,
        carbohidratos: 7,
        grasas: 0.4,
        fibra: 2.6,
        vitaminas: 'C, K, A',
        minerales: 'Hierro, Potasio',
        beneficios: 'Alto contenido de vitamina C y antioxidantes'
      },
      {
        nombre: 'Salmón',
        categoria: 'Pescados',
        calorias_por_100g: 208,
        proteinas: 20,
        carbohidratos: 0,
        grasas: 13,
        fibra: 0,
        vitaminas: 'D, B12',
        minerales: 'Omega-3, Selenio',
        beneficios: 'Rico en ácidos grasos omega-3'
      },
      {
        nombre: 'Quinoa',
        categoria: 'Cereales',
        calorias_por_100g: 120,
        proteinas: 4.4,
        carbohidratos: 22,
        grasas: 1.9,
        fibra: 2.8,
        vitaminas: 'B1, B2, E',
        minerales: 'Hierro, Magnesio',
        beneficios: 'Proteína completa, sin gluten'
      },
      {
        nombre:
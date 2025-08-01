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
  name: string;
  category: string;
  calories_per_100g: number;
  protein_per_100g: number;
  carbs_per_100g: number;
  fat_per_100g: number;
  fiber_per_100g?: number;
  is_custom?: boolean;
  created_at?: string;
}

// Interface para comidas de usuario
export interface UserMeal {
  id: string;
  user_id: string;
  food_id: string;
  meal_type: 'desayuno' | 'almuerzo' | 'cena' | 'snack';
  portion_grams: number;
  date: string;
  created_at?: string;
  foods?: Food;
}

// Interface para consumo de agua
export interface WaterIntake {
  id: string;
  user_id: string;
  amount_ml: number;
  date: string;
  created_at?: string;
}

// Interface para insights de usuario
export interface UserInsight {
  id: string;
  user_id: string;
  title: string;
  description: string;
  recommendation: string;
  confidence_score: number;
  type: string;
  is_viewed: boolean;
  created_at: string;
  updated_at?: string;
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

// Interfaces para entrenamientos
export interface Workout {
  id: string;
  nombre: string;
  descripcion?: string;
  categoria: 'tren_superior' | 'tren_inferior' | 'core' | 'cardio' | 'funcional';
  nivel: 'principiante' | 'intermedio' | 'avanzado';
  duracion_minutos: number;
  calorias_estimadas?: number;
  equipamiento?: string;
  activo: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface Exercise {
  id: string;
  nombre: string;
  descripcion?: string;
  grupo_muscular: string;
  equipamiento?: string;
  instrucciones?: string;
  imagen_url?: string;
  video_url?: string;
  created_at?: string;
}

export interface WorkoutExercise {
  id: string;
  workout_id: string;
  exercise_id: string;
  orden: number;
  series: number;
  repeticiones?: number;
  tiempo_segundos?: number;
  peso_kg?: number;
  descanso_segundos?: number;
  notas?: string;
  created_at?: string;
  exercises?: Exercise;
}

export interface UserWorkout {
  id: string;
  user_id: string;
  workout_id: string;
  fecha: string;
  duracion_minutos?: number;
  calorias_quemadas?: number;
  completado: boolean;
  notas?: string;
  created_at?: string;
  workouts?: Workout;
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
  },

  // FUNCIONES DE ENTRENAMIENTO - NUEVAS REQUERIDAS

  // Función principal para obtener entrenamientos activos por categoría
  async getActiveWorkoutsByCategory(categoria: string) {
    try {
      const { data, error } = await supabase
        .from('workouts')
        .select(`
          *,
          workout_exercises (
            *,
            exercises (
              id,
              nombre,
              descripcion,
              grupo_muscular,
              equipamiento,
              instrucciones
            )
          )
        `)
        .eq('categoria', categoria)
        .eq('activo', true)
        .order('created_at', { ascending: false });

      return { data: data || [], error };
    } catch (error) {
      console.error('Error getting active workouts by category:', error);
      return { data: [], error };
    }
  },

  // Función para obtener todos los entrenamientos
  async getAllWorkouts() {
    try {
      const { data, error } = await supabase
        .from('workouts')
        .select('*')
        .order('created_at', { ascending: false });

      return { data: data || [], error };
    } catch (error) {
      console.error('Error getting all workouts:', error);
      return { data: [], error };
    }
  },

  // Función para obtener ejercicios por grupo muscular
  async getExercisesByMuscleGroup(grupoMuscular: string) {
    try {
      const { data, error } = await supabase
        .from('exercises')
        .select('*')
        .eq('grupo_muscular', grupoMuscular)
        .order('nombre');

      return { data: data || [], error };
    } catch (error) {
      console.error('Error getting exercises by muscle group:', error);
      return { data: [], error };
    }
  },

  // Función para crear un entrenamiento de usuario
  async createUserWorkout(workoutData: Omit<UserWorkout, 'id' | 'created_at'>) {
    try {
      const { data, error } = await supabase
        .from('user_workouts')
        .insert([{
          ...workoutData,
          created_at: new Date().toISOString()
        }])
        .select()
        .single();

      return { data, error };
    } catch (error) {
      console.error('Error creating user workout:', error);
      return { data: null, error };
    }
  },

  // Función para obtener entrenamientos del usuario
  async getUserWorkouts(userId: string, fecha?: string) {
    try {
      let query = supabase
        .from('user_workouts')
        .select(`
          *,
          workouts (
            id,
            nombre,
            descripcion,
            categoria,
            nivel,
            duracion_minutos,
            calorias_estimadas
          )
        `)
        .eq('user_id', userId);

      if (fecha) {
        query = query.eq('fecha', fecha);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      return { data: data || [], error };
    } catch (error) {
      console.error('Error getting user workouts:', error);
      return { data: [], error };
    }
  },

  // Función para actualizar entrenamiento de usuario
  async updateUserWorkout(userWorkoutId: string, updates: Partial<UserWorkout>) {
    try {
      const { data, error } = await supabase
        .from('user_workouts')
        .update(updates)
        .eq('id', userWorkoutId)
        .select()
        .single();

      return { data, error };
    } catch (error) {
      console.error('Error updating user workout:', error);
      return { data: null, error };
    }
  },

  // FUNCIONES EXISTENTES - MEJORADAS

  // Función para obtener comidas del usuario
  async getUserMeals(userId: string, date?: string) {
    try {
      let query = supabase
        .from('user_meals')
        .select(`
          *,
          foods:alimentos(
            id,
            nombre,
            categoria,
            calorias_por_100g,
            proteinas_por_100g,
            carbohidratos_por_100g,
            grasas_por_100g,
            fibra_por_100g
          )
        `)
        .eq('user_id', userId);

      if (date) {
        query = query.eq('date', date);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      // Mapear datos para compatibilidad
      const mappedData = data?.map(meal => ({
        ...meal,
        foods: meal.foods ? {
          id: meal.foods.id,
          name: meal.foods.nombre,
          category: meal.foods.categoria,
          calories_per_100g: meal.foods.calorias_por_100g,
          protein_per_100g: meal.foods.proteinas_por_100g,
          carbs_per_100g: meal.foods.carbohidratos_por_100g,
          fat_per_100g: meal.foods.grasas_por_100g,
          fiber_per_100g: meal.foods.fibra_por_100g || 0
        } : null
      }));

      return { data: mappedData || [], error };
    } catch (error) {
      console.error('Error getting user meals:', error);
      return { data: [], error };
    }
  },

  // Función para crear una comida de usuario
  async createUserMeal(mealData: Omit<UserMeal, 'id' | 'created_at'>) {
    try {
      const { data, error } = await supabase
        .from('user_meals')
        .insert([{
          ...mealData,
          created_at: new Date().toISOString()
        }])
        .select()
        .single();

      return { data, error };
    } catch (error) {
      console.error('Error creating user meal:', error);
      return { data: null, error };
    }
  },

  // Función para eliminar una comida de usuario
  async deleteUserMeal(mealId: string) {
    try {
      const { data, error } = await supabase
        .from('user_meals')
        .delete()
        .eq('id', mealId);

      return { data, error };
    } catch (error) {
      console.error('Error deleting user meal:', error);
      return { data: null, error };
    }
  },

  // Función para obtener consumo de agua
  async getWaterIntake(userId: string, date: string) {
    try {
      const { data, error } = await supabase
        .from('water_intake')
        .select('*')
        .eq('user_id', userId)
        .eq('date', date);

      // Calcular total
      const total = data?.reduce((sum, intake) => sum + intake.amount_ml, 0) || 0;
      const result = [{ total_amount: total }];

      return { data: result, error };
    } catch (error) {
      console.error('Error getting water intake:', error);
      return { data: [{ total_amount: 0 }], error };
    }
  },

  // Función para agregar consumo de agua
  async addWaterIntake(waterData: Omit<WaterIntake, 'id' | 'created_at'>) {
    try {
      const { data, error } = await supabase
        .from('water_intake')
        .insert([{
          ...waterData,
          created_at: new Date().toISOString()
        }])
        .select()
        .single();

      return { data, error };
    } catch (error) {
      console.error('Error adding water intake:', error);
      return { data: null, error };
    }
  },

  // Función para obtener insights del usuario
  async getUserInsights(userId: string, limit: number = 5) {
    try {
      const { data, error } = await supabase
        .from('user_insights')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit);

      return { data: data || [], error };
    } catch (error) {
      console.error('Error getting user insights:', error);
      // Devolver array vacío si la tabla no existe aún
      return { data: [], error: null };
    }
  },

  // Función para marcar insight como visto
  async markInsightAsViewed(insightId: string) {
    try {
      const { data, error } = await supabase
        .from('user_insights')
        .update({ 
          is_viewed: true,
          updated_at: new Date().toISOString()
        })
        .eq('id', insightId)
        .select()
        .single();

      return { data, error };
    } catch (error) {
      console.error('Error marking insight as viewed:', error);
      return { data: null, error };
    }
  },

  // Función para crear insight
  async createUserInsight(insightData: Omit<UserInsight, 'id' | 'created_at'>) {
    try {
      const { data, error } = await supabase
        .from('user_insights')
        .insert([{
          ...insightData,
          created_at: new Date().toISOString()
        }])
        .select()
        .single();

      return { data, error };
    } catch (error) {
      console.error('Error creating user insight:', error);
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
    
    return { data: data || [], error };
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
    
    return { data: data || [], error };
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
    
    return { data: data || [], error };
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
    
    return { data: data || [], error };
  },

  async searchBancoAlimentos(query: string) {
    const { data, error } = await supabase
      .from('banco_alimentos')
      .select('*')
      .or(`nombre.ilike.%${query}%,categoria.ilike.%${query}%`)
      .order('nombre')
      .limit(20);
    
    return { data: data || [], error };
  },

  async getBancoAlimentosByCategory(categoria: string) {
    const { data, error } = await supabase
      .from('banco_alimentos')
      .select('*')
      .eq('categoria', categoria)
      .order('nombre');
    
    return { data: data || [], error };
  }
};

// Operaciones de ejercicio - MEJORADAS
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
    
    return { data: data || [], error };
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
  },

  // Nuevas funciones para entrenamientos estructurados
  async getWorkoutsByCategory(categoria: string) {
    const { data, error } = await supabase
      .from('workouts')
      .select('*')
      .eq('categoria', categoria)
      .eq('activo', true)
      .order('nivel', { ascending: true });
    
    return { data: data || [], error };
  },

  async getWorkoutDetails(workoutId: string) {
    const { data, error } = await supabase
      .from('workouts')
      .select(`
        *,
        workout_exercises (
          *,
          exercises (*)
        )
      `)
      .eq('id', workoutId)
      .single();
    
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
    
    return { data: data || [], error };
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
    
    return { data: data || [], error };
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
    
    return { data: data || [], error };
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
  const metValues: Record<string, Record<string, number>> = {
    'caminar': { baja: 3.0, media: 4.0, alta: 5.0 },
    'correr': { baja: 6.0, media: 8.0, alta: 11.0 },
    'nadar': { baja: 4.0, media: 6.0, alta: 8.0 },
    'ciclismo': { baja: 4.0, media: 8.0, alta: 12.0 },
    'pesas': { baja: 3.0, media: 5.0, alta: 6.0 },
    'yoga': { baja: 2.5, media: 3.0, alta: 4.0 },
    'aerobicos': { baja: 5.0, media: 7.0, alta: 9.0 },
    'tren_superior': { baja: 4.0, media: 6.0, alta: 8.0 },
    'tren_inferior': { baja: 5.0, media: 7.0, alta: 9.0 },
    'core': { baja: 3.0, media: 5.0, alta: 7.0 },
    'funcional': { baja: 4.0, media: 6.0, alta: 8.0 }
  };

  const ejercicioKey = ejercicio.toLowerCase().replace(/\s+/g, '_');
  const met = metValues[ejercicioKey]?.[intensidad] || 4.0;
  const calorias = met * pesoKg * (duracionMinutos / 60);
  
  return Math.round(calorias);
};

export default supabase;

// Función para inicializar la base de datos con datos de ejemplo
export const initializeDatabase = async () => {
  try {
    console.log('🚀 Inicializando base de datos...');

    const { data: existingUsers } = await supabase
      .from('usuarios')
      .select('id')
      .limit(1);

    if (existingUsers && existingUsers.length > 0) {
      console.log('✅ Base de datos ya inicializada');
      return { success: true, message: 'Base de datos ya contiene datos' };
    }

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

    // Inicializar datos de entrenamientos
    await initializeWorkoutData();

    // Inicializar alimentos
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

// Función para inicializar datos de entrenamientos
export const initializeWorkoutData = async () => {
  try {
    console.log('🏋️ Inicializando datos de entrenamientos...');

    // Verificar si ya existen entrenamientos
    const { data: existingWorkouts } = await supabase
      .from('workouts')
      .select('id')
      .limit(1);

    if (existingWorkouts && existingWorkouts.length > 0) {
      console.log('✅ Entrenamientos ya inicializados');
      return { success: true, message: 'Entrenamientos ya existen' };
    }

    // Crear ejercicios base
    const ejerciciosBase = [
      {
        nombre: 'Flexiones de pecho',
        descripcion: 'Ejercicio básico para pecho, hombros y tríceps',
        grupo_muscular: 'pecho',
        equipamiento: 'ninguno',
        instrucciones: 'Colócate en posición de plancha, baja el pecho hasta casi tocar el suelo y empuja hacia arriba',
        created_at: new Date().toISOString()
      },
      {
        nombre: 'Dominadas',
        descripcion: 'Ejercicio para espalda y bíceps',
        grupo_muscular: 'espalda',
        equipamiento: 'barra',
        instrucciones: 'Cuelga de una barra con las palmas hacia adelante, tira del cuerpo hacia arriba hasta que la barbilla pase la barra',
        created_at: new Date().toISOString()
      },
      {
        nombre: 'Sentadillas',
        descripcion: 'Ejercicio fundamental para piernas y glúteos',
        grupo_muscular: 'piernas',
        equipamiento: 'ninguno',
        instrucciones: 'De pie con pies al ancho de hombros, baja como si fueras a sentarte en una silla invisible',
        created_at: new Date().toISOString()
      },
      {
        nombre: 'Plancha',
        descripcion: 'Fortalecimiento del core',
        grupo_muscular: 'core',
        equipamiento: 'ninguno',
        instrucciones: 'Mantén el cuerpo recto apoyado en antebrazos y pies, contrae el abdomen',
        created_at: new Date().toISOString()
      }
    ];

    const { data: ejerciciosCreados, error: ejerciciosError } = await supabase
      .from('exercises')
      .insert(ejerciciosBase)
      .select();

    if (ejerciciosError) {
      console.error('❌ Error creando ejercicios:', ejerciciosError);
      return { success: false, error: ejerciciosError };
    }

    // Crear entrenamientos base
    const entrenamientosBase = [
      {
        nombre: 'Rutina Tren Superior Básica',
        descripcion: 'Entrenamiento completo para la parte superior del cuerpo',
        categoria: 'tren_superior',
        nivel: 'principiante',
        duracion_minutos: 30,
        calorias_estimadas: 200,
        equipamiento: 'mínimo',
        activo: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        nombre: 'Rutina Tren Superior Intermedia',
        descripcion: 'Entrenamiento avanzado para la parte superior',
        categoria: 'tren_superior',
        nivel: 'intermedio',
        duracion_minutos: 45,
        calorias_estimadas: 300,
        equipamiento: 'básico',
        activo: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        nombre: 'Rutina Tren Inferior Básica',
        descripcion: 'Fortalecimiento de piernas y glúteos',
        categoria: 'tren_inferior',
        nivel: 'principiante',
        duracion_minutos: 25,
        calorias_estimadas: 180,
        equipamiento: 'ninguno',
        activo: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        nombre: 'Core Explosivo',
        descripcion: 'Rutina intensa para fortalecer el núcleo',
        categoria: 'core',
        nivel: 'intermedio',
        duracion_minutos: 20,
        calorias_estimadas: 150,
        equipamiento: 'ninguno',
        activo: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ];

    const { data: entrenamientosCreados, error: entrenamientosError } = await supabase
      .from('workouts')
      .insert(entrenamientosBase)
      .select();

    if (entrenamientosError) {
      console.error('❌ Error creando entrenamientos:', entrenamientosError);
      return { success: false, error: entrenamientosError };
    }

    // Crear relaciones ejercicio-entrenamiento
    if (ejerciciosCreados && entrenamientosCreados) {
      const workoutExercises = [
        {
          workout_id: entrenamientosCreados[0].id, // Tren Superior Básica
          exercise_id: ejerciciosCreados[0].id, // Flexiones
          orden: 1,
          series: 3,
          repeticiones: 10,
          descanso_segundos: 60,
          created_at: new Date().toISOString()
        },
        {
          workout_id: entrenamientosCreados[0].id,
          exercise_id: ejerciciosCreados[1].id, // Dominadas
          orden: 2,
          series: 3,
          repeticiones: 5,
          descanso_segundos: 90,
          created_at: new Date().toISOString()
        }
      ];

      const { error: workoutExercisesError } = await supabase
        .from('workout_exercises')
        .insert(workoutExercises);

      if (workoutExercisesError) {
        console.log('⚠️ Error creando relaciones ejercicio-entrenamiento:', workoutExercisesError.message);
      }
    }

    console.log('✅ Datos de entrenamientos inicializados correctamente');
    return { 
      success: true, 
      message: 'Entrenamientos inicializados con éxito',
      data: { ejercicios: ejerciciosCreados, entrenamientos: entrenamientosCreados }
    };

  } catch (error) {
    console.error('❌ Error inicializando datos de entrenamientos:', error);
    return { success: false, error };
  }
};

// Función para cargar alimentos iniciales al banco de alimentos
export const loadInitialFoods = async () => {
  try {
    console.log('🔄 Iniciando carga de alimentos al banco...');
    
    const { data: existingFoods, error: checkError } = await supabase
      .from('banco_alimentos')
      .select('id')
      .limit(1);

    if (checkError) {
      console.error('❌ Error verificando alimentos existentes:', checkError);
      throw checkError;
    }

    if (existingFoods && existingFoods.length > 0) {
      console.log('✅ Ya existen alimentos en el banco, omitiendo carga inicial');
      return { success: true, message: 'Alimentos ya cargados previamente' };
    }

    const alimentosIniciales = [
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
        beneficios: 'Rica en antioxidantes, fibra y vitamina C',
        created_at: new Date().toISOString()
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
        beneficios: 'Excelente fuente de proteína magra',
        created_at: new Date().toISOString()
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
        beneficios: 'Carbohidrato complejo rico en fibra',
        created_at: new Date().toISOString()
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
        minerales: 'Hierro, Calcio',
        beneficios: 'Rico en antioxidantes y vitaminas',
        created_at: new Date().toISOString()
      },
      {
        nombre: 'Salmón',
        categoria: 'Pescados',
        calorias_por_100g: 208,
        proteinas: 25,
        carbohidratos: 0,
        grasas: 12,
        fibra: 0,
        vitaminas: 'D, B12',
        minerales: 'Omega-3, Selenio',
        beneficios: 'Excelente fuente de omega-3 y proteína',
        created_at: new Date().toISOString()
      }
    ];

    const { data, error } = await supabase
      .from('banco_alimentos')
      .insert(alimentosIniciales)
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
};
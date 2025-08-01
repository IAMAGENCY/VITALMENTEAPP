
import { createClient } from '@supabase/supabase-js';

// CONFIGURACIÓN EMPRESARIAL DE SUPABASE - PRODUCCIÓN
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://jkxyioiajkyakftdeazt.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpreHlpb2lhamt5YWtmdGRlYXp0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM4MDY3MTcsImV4cCI6MjA2OTM4MjcxN30.d7VtQ3RkoJhZD0j0K8o2Uv0H860sRfqUC1-mwaKrsTw';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// VERIFICACIÓN EMPRESARIAL DE CONEXIÓN
export const testSupabaseConnection = async () => {
  try {
    const { data: testData, error: testError } = await supabase
      .from('users')
      .select('id')
      .limit(1);

    if (testError) {
      console.error('Error conexion Supabase:', testError.message);
      return { success: false, error: testError.message };
    }

    const { data: foods, error: foodsError } = await supabase
      .from('foods')
      .select('id, name')
      .limit(5);

    if (foodsError) {
      console.error('Tablas no creadas:', foodsError.message);
      return { success: false, error: 'Ejecuta el script SQL empresarial' };
    }

    console.log('Supabase empresarial conectado correctamente');
    console.log('Base de datos empresarial inicializada:', foods?.length || 0, 'elementos');

    return {
      success: true,
      foodsCount: foods?.length || 0,
      message: 'Supabase empresarial configurado correctamente'
    };

  } catch (error: any) {
    console.error('Error de conexion empresarial:', error);
    return { success: false, error: error.message };
  }
};

// OPERACIONES DE BASE DE DATOS EMPRESARIAL
export const dbOperations = {
  // === USUARIOS EMPRESARIAL ===
  async getUsers() {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false });
    return { data, error };
  },

  async createUser(userData: any) {
    const { data, error } = await supabase
      .from('users')
      .insert([
        {
          ...userData,
          created_at: new Date().toISOString()
        }
      ])
      .select()
      .single();
    return { data, error };
  },

  async getUserById(id: string) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();
    return { data, error };
  },

  async getUserByEmail(email: string) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email.toLowerCase())
      .single();
    return { data, error };
  },

  async updateUser(id: string, userData: any) {
    const { data, error } = await supabase
      .from('users')
      .update(userData)
      .eq('id', id)
      .select()
      .single();
    return { data, error };
  },

  async updateUserSubscription(userId: string, subscriptionStatus: string) {
    const { data, error } = await supabase
      .from('users')
      .update({ 
        subscription_status: subscriptionStatus
      })
      .eq('id', userId)
      .select()
      .single();
    return { data, error };
  },

  // === ALIMENTOS EMPRESARIAL ===
  async getFoods() {
    const { data, error } = await supabase
      .from('foods')
      .select('*')
      .order('name');
    return { data, error };
  },

  async getAllFoods() {
    const { data, error } = await supabase
      .from('foods')
      .select('*')
      .order('name');
    return { data, error };
  },

  async getFoodsByCategory(category: string) {
    const { data, error } = await supabase
      .from('foods')
      .select('*')
      .eq('category', category)
      .order('name');
    return { data, error };
  },

  async createFood(foodData: any) {
    const { data, error } = await supabase
      .from('foods')
      .insert([
        {
          ...foodData,
          created_at: new Date().toISOString()
        }
      ])
      .select()
      .single();
    return { data, error };
  },

  async updateFood(id: string, foodData: any) {
    const { data, error } = await supabase
      .from('foods')
      .update(foodData)
      .eq('id', id)
      .select()
      .single();
    return { data, error };
  },

  async deleteFood(id: string) {
    const { error } = await supabase
      .from('foods')
      .delete()
      .eq('id', id);
    return { error };
  },

  // === COMIDAS DE USUARIO ===
  async getUserMeals(userId: string) {
    const { data, error } = await supabase
      .from('user_meals')
      .select(`
        *,
        foods (*)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    return { data, error };
  },

  async getUserMealsByDate(userId: string, date: string) {
    const { data, error } = await supabase
      .from('user_meals')
      .select(`
        *,
        foods (*)
      `)
      .eq('user_id', userId)
      .eq('date', date)
      .order('created_at', { ascending: false });
    return { data, error };
  },

  async getUserMealsByDateRange(userId: string, startDate: string, endDate: string) {
    const { data, error } = await supabase
      .from('user_meals')
      .select(`
        *,
        foods (*)
      `)
      .eq('user_id', userId)
      .gte('date', startDate)
      .lte('date', endDate)
      .order('date', { ascending: false });
    return { data, error };
  },

  async createUserMeal(mealData: any) {
    const { data, error } = await supabase
      .from('user_meals')
      .insert([
        {
          ...mealData,
          created_at: new Date().toISOString()
        }
      ])
      .select(`
        *,
        foods (*)
      `)
      .single();
    return { data, error };
  },

  async updateUserMeal(id: string, mealData: any) {
    const { data, error } = await supabase
      .from('user_meals')
      .update(mealData)
      .eq('id', id)
      .select(`
        *,
        foods (*)
      `)
      .single();
    return { data, error };
  },

  async deleteUserMeal(id: string) {
    const { error } = await supabase
      .from('user_meals')
      .delete()
      .eq('id', id);
    return { error };
  },

  // === INGESTA DE AGUA ===
  async getWaterIntake(userId: string, date: string) {
    const { data, error } = await supabase
      .from('water_intake')
      .select('*')
      .eq('user_id', userId)
      .eq('date', date)
      .order('created_at', { ascending: false });
    return { data, error };
  },

  async getWaterIntakeByDateRange(userId: string, startDate: string, endDate: string) {
    const { data, error } = await supabase
      .from('water_intake')
      .select('*')
      .eq('user_id', userId)
      .gte('date', startDate)
      .lte('date', endDate)
      .order('date', { ascending: false });
    return { data, error };
  },

  async addWaterIntake(intakeData: any) {
    const { data, error } = await supabase
      .from('water_intake')
      .insert([
        {
          ...intakeData,
          created_at: new Date().toISOString()
        }
      ])
      .select()
      .single();
    return { data, error };
  },

  // === SUPLEMENTOS EMPRESARIAL ===
  async getAllSupplements() {
    const { data, error } = await supabase
      .from('supplements')
      .select('*')
      .eq('is_active', true)
      .order('name');
    return { data: data || [], error };
  },

  async getActiveSupplements() {
    const { data, error } = await supabase
      .from('supplements')
      .select('*')
      .eq('is_active', true)
      .order('name');
    return { data, error };
  },

  async getSupplementsByCategory(category: string) {
    const { data, error } = await supabase
      .from('supplements')
      .select('*')
      .eq('category', category)
      .eq('is_active', true)
      .order('name');
    return { data, error };
  },

  async createSupplement(supplementData: any) {
    const { data, error } = await supabase
      .from('supplements')
      .insert([
        {
          ...supplementData,
          created_at: new Date().toISOString()
        }
      ])
      .select()
      .single();
    return { data, error };
  },

  async updateSupplement(id: string, supplementData: any) {
    const { data, error } = await supabase
      .from('supplements')
      .update(supplementData)
      .eq('id', id)
      .select()
      .single();
    return { data, error };
  },

  async deleteSupplement(id: string) {
    const { error } = await supabase
      .from('supplements')
      .delete()
      .eq('id', id);
    return { error };
  },

  // === ENTRENAMIENTOS EMPRESARIAL ===
  async getWorkoutLinks() {
    const { data, error } = await supabase
      .from('workout_links')
      .select('*')
      .order('created_at', { ascending: false });
    return { data, error };
  },

  async getActiveWorkoutsByCategory(category: string) {
    const { data, error } = await supabase
      .from('workout_links')
      .select('*')
      .eq('category', category)
      .eq('is_active', true)
      .order('created_at', { ascending: false });
    return { data, error };
  },

  async createWorkoutLink(workout: {
    title: string;
    description?: string;
    url: string;
    platform: 'youtube' | 'spotify';
    category: string;
    difficulty: 'principiante' | 'intermedio' | 'avanzado';
    duration: number;
    image_url?: string;
    tags: string[];
    is_active?: boolean;
  }) {
    const { data, error } = await supabase
      .from('workout_links')
      .insert([
        {
          ...workout,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ])
      .select()
      .single();
    return { data, error };
  },

  async updateWorkoutLink(id: string, workout: any) {
    const { data, error } = await supabase
      .from('workout_links')
      .update({
        ...workout,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();
    return { data, error };
  },

  async deleteWorkoutLink(id: string) {
    const { error } = await supabase
      .from('workout_links')
      .delete()
      .eq('id', id);
    return { error };
  },

  // === MINDFULNESS EMPRESARIAL ===
  async getMindfulnessResources() {
    const { data, error } = await supabase
      .from('mindfulness_resources')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false });
    return { data, error };
  },

  async getMindfulnessResourcesByCategory(category: string) {
    const { data, error } = await supabase
      .from('mindfulness_resources')
      .select('*')
      .eq('category', category)
      .eq('is_active', true)
      .order('created_at', { ascending: false });
    return { data, error };
  },

  async createMindfulnessResource(resourceData: any) {
    const { data, error } = await supabase
      .from('mindfulness_resources')
      .insert([
        {
          ...resourceData,
          created_at: new Date().toISOString()
        }
      ])
      .select()
      .single();
    return { data, error };
  },

  async updateMindfulnessResource(id: string, resourceData: any) {
    const { data, error } = await supabase
      .from('mindfulness_resources')
      .update(resourceData)
      .eq('id', id)
      .select()
      .single();
    return { data, error };
  },

  async deleteMindfulnessResource(id: string) {
    const { error } = await supabase
      .from('mindfulness_resources')
      .delete()
      .eq('id', id);
    return { error };
  },

  // === PLANES DE NUTRICIÓN EMPRESARIAL ===
  async getNutritionPlans() {
    const { data, error } = await supabase
      .from('nutrition_plans')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false });
    return { data, error };
  },

  async createNutritionPlan(planData: any) {
    const { data, error } = await supabase
      .from('nutrition_plans')
      .insert([
        {
          ...planData,
          created_at: new Date().toISOString()
        }
      ])
      .select()
      .single();
    return { data, error };
  },

  async updateNutritionPlan(id: string, planData: any) {
    const { data, error } = await supabase
      .from('nutrition_plans')
      .update(planData)
      .eq('id', id)
      .select()
      .single();
    return { data, error };
  },

  async deleteNutritionPlan(id: string) {
    const { error } = await supabase
      .from('nutrition_plans')
      .delete()
      .eq('id', id);
    return { error };
  },

  // === ACTIVIDADES DE USUARIO ===
  async getUserActivities(userId: string) {
    const { data, error } = await supabase
      .from('user_activities')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    return { data, error };
  },

  async getUserActivitiesByDateRange(userId: string, startDate: string, endDate: string) {
    const { data, error } = await supabase
      .from('user_activities')
      .select('*')
      .eq('user_id', userId)
      .gte('date', startDate)
      .lte('date', endDate)
      .order('date', { ascending: false });
    return { data, error };
  },

  async createUserActivity(activityData: any) {
    const { data, error } = await supabase
      .from('user_activities')
      .insert([
        {
          ...activityData,
          created_at: new Date().toISOString()
        }
      ])
      .select()
      .single();
    return { data, error };
  },

  async updateUserActivity(id: string, activityData: any) {
    const { data, error } = await supabase
      .from('user_activities')
      .update(activityData)
      .eq('id', id)
      .select()
      .single();
    return { data, error };
  },

  // === INSIGHTS DE USUARIO ===
  async getUserInsights(userId: string, limit?: number) {
    let query = supabase
      .from('user_insights')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (limit) {
      query = query.limit(limit);
    }

    const { data, error } = await query;
    return { data, error };
  },

  async addUserInsight(insight: any) {
    const { data, error } = await supabase
      .from('user_insights')
      .insert([
        {
          ...insight,
          created_at: new Date().toISOString()
        }
      ])
      .select()
      .single();
    return { data, error };
  },

  async markInsightAsViewed(id: string) {
    const { data, error } = await supabase
      .from('user_insights')
      .update({ is_viewed: true })
      .eq('id', id)
      .select()
      .single();
    return { data, error };
  },

  // === RECOMENDACIONES DE SUPLEMENTOS ===
  async getUserSupplementRecommendations(userId: string) {
    const { data, error } = await supabase
      .from('supplement_recommendations')
      .select(`
        *,
        supplements (*)
      `)
      .eq('user_id', userId)
      .eq('is_purchased', false)
      .order('created_at', { ascending: false });
    return { data, error };
  },

  async addSupplementRecommendation(recommendation: any) {
    const { data, error } = await supabase
      .from('supplement_recommendations')
      .insert([
        {
          ...recommendation,
          created_at: new Date().toISOString()
        }
      ])
      .select()
      .single();
    return { data, error };
  },

  async markSupplementAsPurchased(id: string) {
    const { data, error } = await supabase
      .from('supplement_recommendations')
      .update({ is_purchased: true })
      .eq('id', id)
      .select()
      .single();
    return { data, error };
  },

  // === FUNCIONES ADICIONALES PARA IA ===
  async getUserNutritionTrends(userId: string, days: number) {
    const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const { data, error } = await supabase
      .from('user_meals')
      .select(`
        *,
        foods (*)
      `)
      .eq('user_id', userId)
      .gte('date', startDate)
      .order('date', { ascending: false });
    return { data, error };
  },

  async getUserActivityStats(userId: string, days: number) {
    const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const { data, error } = await supabase
      .from('user_activities')
      .select('*')
      .eq('user_id', userId)
      .gte('date', startDate)
      .order('date', { ascending: false });
    return { data, error };
  },

  async getUserComplianceScore(userId: string, days: number) {
    // Calculamos score de cumplimiento basado en actividades completadas
    const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    const [mealsResult, activitiesResult] = await Promise.all([
      this.getUserMealsByDateRange(userId, startDate, new Date().toISOString().split('T')[0]),
      this.getUserActivitiesByDateRange(userId, startDate, new Date().toISOString().split('T')[0])
    ]);

    const totalMeals = mealsResult.data?.length || 0;
    const completedActivities = activitiesResult.data?.filter(a => a.completion_status === 'completed').length || 0;

    // Calculamos un score basado en comidas registradas y actividades completadas
    const expectedMeals = days * 3; // 3 comidas por día esperadas
    const expectedActivities = Math.ceil(days / 7) * 3; // ~3 actividades por semana

    const mealScore = Math.min(totalMeals / expectedMeals, 1) * 50;
    const activityScore = Math.min(completedActivities / expectedActivities, 1) * 50;

    const overallScore = Math.round(mealScore + activityScore);

    return { 
      overall_score: overallScore,
      meal_score: Math.round(mealScore * 2),
      activity_score: Math.round(activityScore * 2),
      days_analyzed: days
    };
  }
};

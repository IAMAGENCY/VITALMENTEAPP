
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://jkxyioiajkyakftdeazt.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpreHlpb2lhamt5YWtmdGRlYXp0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM4MDY3MTcsImV4cCI6MjA2OTM4MjcxN30.d7VtQ3RkoJhZD0j0K8o2Uv0H860sRfqUC1-mwaKrsTw';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// TEST DE CONEXIÓN - Usar para verificar que funciona
export const testSupabaseConnection = async () => {
  try {
    // Probar conexión básica
    const { data: testData, error: testError } = await supabase
      .from('users')
      .select('id')
      .limit(1);

    if (testError) {
      console.error('❌ Error conexión Supabase:', testError.message);
      return { success: false, error: testError.message };
    }

    // Probar que existen alimentos
    const { data: foods, error: foodsError } = await supabase
      .from('foods')
      .select('id, name')
      .limit(5);

    if (foodsError) {
      console.error('❌ Tablas no creadas:', foodsError.message);
      return { success: false, error: 'Ejecuta primero el script SQL' };
    }

    console.log('✅ Supabase conectado correctamente');
    console.log('📊 Alimentos disponibles:', foods?.length || 0);

    return {
      success: true,
      foodsCount: foods?.length || 0,
      message: 'Supabase configurado correctamente'
    };

  } catch (error) {
    console.error('💥 Error de conexión:', error);
    return { success: false, error: error.message };
  }
};

// Tipos para el sistema de tracking completo
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
  created_at: string;
}

export interface UserMeal {
  id: string;
  user_id: string;
  food_id: string;
  meal_type: 'desayuno' | 'almuerzo' | 'cena' | 'snack';
  portion_grams: number;
  date: string;
  created_at: string;
  foods?: Food;
}

export interface WaterIntake {
  id: string;
  user_id: string;
  amount_ml: number;
  date: string;
  created_at: string;
}

export interface UserProgress {
  id: string;
  user_id: string;
  weight_kg?: number;
  body_fat_percentage?: number;
  muscle_mass_kg?: number;
  measurements?: object;
  notes?: string;
  date: string;
  created_at: string;
}

export interface UserActivity {
  id: string;
  user_id: string;
  activity_type: string;
  resource_id?: string;
  resource_type?: string;
  duration_minutes?: number;
  completion_status: 'started' | 'completed' | 'paused';
  metadata?: object;
  date: string;
  created_at: string;
}

export interface UserGoal {
  id: string;
  user_id: string;
  goal_type: 'weight_loss' | 'weight_gain' | 'muscle_gain' | 'strength' | 'endurance' | 'wellness';
  target_value: number;
  current_value: number;
  target_date: string;
  is_active: boolean;
  created_at: string;
}

export interface UserInsight {
  id: string;
  user_id: string;
  insight_type: 'nutrition' | 'workout' | 'wellness' | 'supplement';
  title: string;
  description: string;
  recommendation: string;
  confidence_score: number;
  data_points: object;
  is_viewed: boolean;
  created_at: string;
}

export interface SupplementRecommendation {
  id: string;
  user_id: string;
  supplement_id: string;
  reason: string;
  confidence_score: number;
  based_on_data: object;
  is_purchased: boolean;
  created_at: string;
}

export const dbOperations = {
  // CORE USER FUNCTIONS
  async getUsers() {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false });
    return { data, error };
  },

  async getUserById(userId: string) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();
    return { data, error };
  },

  async createUser(userData: any) {
    const { data, error } = await supabase
      .from('users')
      .insert([userData])
      .select()
      .single();
    return { data, error };
  },

  async updateUser(userId: string, userData: any) {
    const { data, error } = await supabase
      .from('users')
      .update(userData)
      .eq('id', userId)
      .select()
      .single();
    return { data, error };
  },

  // FOOD BANK OPERATIONS
  async getFoods() {
    const { data, error } = await supabase
      .from('foods')
      .select('*')
      .order('name');
    return { data, error };
  },

  async createFood(foodData: any) {
    const { data, error } = await supabase
      .from('foods')
      .insert([foodData])
      .select()
      .single();
    return { data, error };
  },

  // USER MEALS TRACKING
  async addUserMeal(mealData: Omit<UserMeal, 'id' | 'created_at' | 'foods'>) {
    const { data, error } = await supabase
      .from('user_meals')
      .insert([
        {
          ...mealData,
          created_at: new Date().toISOString()
        }
      ])
      .select(`*, foods (*)`)
      .single();
    return { data, error };
  },

  async getUserMeals(userId: string, date: string) {
    const { data, error } = await supabase
      .from('user_meals')
      .select(`*, foods (*)`)
      .eq('user_id', userId)
      .eq('date', date)
      .order('created_at', { ascending: true });
    return { data, error };
  },

  async deleteUserMeal(mealId: string) {
    const { error } = await supabase
      .from('user_meals')
      .delete()
      .eq('id', mealId);
    return { error };
  },

  async getUserMealsByDateRange(userId: string, startDate: string, endDate: string) {
    const { data, error } = await supabase
      .from('user_meals')
      .select(`*, foods (*)`)
      .eq('user_id', userId)
      .gte('date', startDate)
      .lte('date', endDate)
      .order('date', { ascending: false });
    return { data, error };
  },

  // WATER INTAKE TRACKING
  async addWaterIntake(waterData: Omit<WaterIntake, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('water_intake')
      .insert([
        {
          ...waterData,
          created_at: new Date().toISOString()
        }
      ])
      .select()
      .single();
    return { data, error };
  },

  async getTotalWaterIntake(userId: string, date: string) {
    const { data, error } = await supabase
      .from('water_intake')
      .select('amount_ml')
      .eq('user_id', userId)
      .eq('date', date);

    const total = data?.reduce((sum, intake) => sum + intake.amount_ml, 0) || 0;
    return { total, error };
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

  // USER PROGRESS TRACKING
  async addUserProgress(progressData: Omit<UserProgress, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('user_progress')
      .insert([
        {
          ...progressData,
          created_at: new Date().toISOString()
        }
      ])
      .select()
      .single();
    return { data, error };
  },

  async getUserProgressByDateRange(userId: string, startDate: string, endDate: string) {
    const { data, error } = await supabase
      .from('user_progress')
      .select('*')
      .eq('user_id', userId)
      .gte('date', startDate)
      .lte('date', endDate)
      .order('date', { ascending: false });
    return { data, error };
  },

  async getLatestUserProgress(userId: string) {
    const { data, error } = await supabase
      .from('user_progress')
      .select('*')
      .eq('user_id', userId)
      .order('date', { ascending: false })
      .limit(1)
      .single();
    return { data, error };
  },

  // USER ACTIVITY TRACKING
  async trackUserActivity(activityData: Omit<UserActivity, 'id' | 'created_at'>) {
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

  async getUserActivitiesByDateRange(userId: string, startDate: string, endDate: string) {
    const { data, error } = await supabase
      .from('user_activities')
      .select('*')
      .eq('user_id', userId)
      .gte('date', startDate)
      .lte('date', endDate)
      .order('created_at', { ascending: false });
    return { data, error };
  },

  async getUserActivityStats(userId: string, days: number = 30) {
    const endDate = new Date().toISOString().split('T')[0];
    const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    const { data, error } = await supabase
      .from('user_activities')
      .select('activity_type, duration_minutes, completion_status')
      .eq('user_id', userId)
      .gte('date', startDate)
      .lte('date', endDate);

    return { data, error };
  },

  // USER GOALS MANAGEMENT
  async addUserGoal(goalData: Omit<UserGoal, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('user_goals')
      .insert([
        {
          ...goalData,
          created_at: new Date().toISOString()
        }
      ])
      .select()
      .single();
    return { data, error };
  },

  async getUserActiveGoals(userId: string) {
    const { data, error } = await supabase
      .from('user_goals')
      .select('*')
      .eq('user_id', userId)
      .eq('is_active', true)
      .order('created_at', { ascending: false });
    return { data, error };
  },

  async updateUserGoal(goalId: string, goalData: Partial<UserGoal>) {
    const { data, error } = await supabase
      .from('user_goals')
      .update(goalData)
      .eq('id', goalId)
      .select()
      .single();
    return { data, error };
  },

  // USER INSIGHTS SYSTEM
  async addUserInsight(insightData: Omit<UserInsight, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('user_insights')
      .insert([
        {
          ...insightData,
          created_at: new Date().toISOString()
        }
      ])
      .select()
      .single();
    return { data, error };
  },

  async getUserInsights(userId: string, limit: number = 10) {
    const { data, error } = await supabase
      .from('user_insights')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);
    return { data, error };
  },

  async markInsightAsViewed(insightId: string) {
    const { error } = await supabase
      .from('user_insights')
      .update({ is_viewed: true })
      .eq('id', insightId);
    return { error };
  },

  // SUPPLEMENT RECOMMENDATIONS
  async addSupplementRecommendation(recommendationData: Omit<SupplementRecommendation, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('supplement_recommendations')
      .insert([
        {
          ...recommendationData,
          created_at: new Date().toISOString()
        }
      ])
      .select()
      .single();
    return { data, error };
  },

  async getUserSupplementRecommendations(userId: string) {
    const { data, error } = await supabase
      .from('supplement_recommendations')
      .select(`*, supplements (*)`)
      .eq('user_id', userId)
      .eq('is_purchased', false)
      .order('confidence_score', { ascending: false });
    return { data, error };
  },

  async markSupplementAsPurchased(recommendationId: string) {
    const { error } = await supabase
      .from('supplement_recommendations')
      .update({ is_purchased: true })
      .eq('id', recommendationId);
    return { error };
  },

  // ANALYTICS FOR BUSINESS INSIGHTS
  async getUserNutritionTrends(userId: string, days: number = 30) {
    const endDate = new Date().toISOString().split('T')[0];
    const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    const { data, error } = await supabase
      .from('user_meals')
      .select(`date, portion_grams, foods (calories_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g)`)
      .eq('user_id', userId)
      .gte('date', startDate)
      .lte('date', endDate);

    return { data, error };
  },

  async getUserComplianceScore(userId: string, days: number = 7) {
    const endDate = new Date().toISOString().split('T')[0];
    const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    // Obtener actividades completadas vs planeadas
    const { data: activities } = await supabase
      .from('user_activities')
      .select('completion_status')
      .eq('user_id', userId)
      .gte('date', startDate)
      .lte('date', endDate);

    // Obtener días con registro de comidas
    const { data: meals } = await supabase
      .from('user_meals')
      .select('date')
      .eq('user_id', userId)
      .gte('date', startDate)
      .lte('date', endDate);

    const completedActivities = activities?.filter(a => a.completion_status === 'completed').length || 0;
    const totalActivities = activities?.length || 1;
    const daysWithMeals = new Set(meals?.map(m => m.date)).size;

    const activityScore = (completedActivities / totalActivities) * 100;
    const nutritionScore = (daysWithMeals / days) * 100;
    const overallScore = (activityScore + nutritionScore) / 2;

    return {
      overall_score: Math.round(overallScore),
      activity_score: Math.round(activityScore),
      nutrition_score: Math.round(nutritionScore),
      days_tracked: daysWithMeals
    };
  },

  // WORKOUT LINKS - EXISTING FUNCTIONS
  async getActiveWorkoutsByCategory(category: string) {
    const { data, error } = await supabase
      .from('workout_links')
      .select('*')
      .eq('category', category)
      .eq('is_active', true)
      .order('created_at', { ascending: false });
    return { data, error };
  },

  async getAllWorkoutLinks() {
    const { data, error } = await supabase
      .from('workout_links')
      .select('*')
      .order('created_at', { ascending: false });
    return { data, error };
  },

  async addWorkoutLink(workout: any) {
    const { data, error } = await supabase
      .from('workout_links')
      .insert([workout])
      .select()
      .single();
    return { data, error };
  },

  async updateWorkoutLink(id: string, workout: any) {
    const { data, error } = await supabase
      .from('workout_links')
      .update(workout)
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

  // MINDFULNESS RESOURCES - EXISTING FUNCTIONS
  async getActiveMindfulnessByCategory(category: string) {
    const { data, error } = await supabase
      .from('mindfulness_resources')
      .select('*')
      .eq('category', category)
      .eq('is_active', true)
      .order('created_at', { ascending: false });
    return { data, error };
  },

  async getAllMindfulnessResources() {
    const { data, error } = await supabase
      .from('mindfulness_resources')
      .select('*')
      .order('created_at', { ascending: false });
    return { data, error };
  },

  async addMindfulnessResource(resource: any) {
    const { data, error } = await supabase
      .from('mindfulness_resources')
      .insert([resource])
      .select()
      .single();
    return { data, error };
  },

  async updateMindfulnessResource(id: string, resource: any) {
    const { data, error } = await supabase
      .from('mindfulness_resources')
      .update(resource)
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

  // SUPPLEMENTS - EXISTING FUNCTIONS
  async getActiveSupplements() {
    const { data, error } = await supabase
      .from('supplements')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false });
    return { data, error };
  },

  async getAllSupplements() {
    const { data, error } = await supabase
      .from('supplements')
      .select('*')
      .order('created_at', { ascending: false });
    return { data, error };
  },

  async addSupplement(supplement: any) {
    const { data, error } = await supabase
      .from('supplements')
      .insert([supplement])
      .select()
      .single();
    return { data, error };
  },

  async updateSupplement(id: string, supplement: any) {
    const { data, error } = await supabase
      .from('supplements')
      .update(supplement)
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

  // NUTRITION PLANS - EXISTING FUNCTIONS
  async getActiveNutritionPlans() {
    const { data, error } = await supabase
      .from('nutrition_plans')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false });
    return { data, error };
  },

  async getAllNutritionPlans() {
    const { data, error } = await supabase
      .from('nutrition_plans')
      .select('*')
      .order('created_at', { ascending: false });
    return { data, error };
  },

  async addNutritionPlan(plan: any) {
    const { data, error } = await supabase
      .from('nutrition_plans')
      .insert([plan])
      .select()
      .single();
    return { data, error };
  },

  async updateNutritionPlan(id: string, plan: any) {
    const { data, error } = await supabase
      .from('nutrition_plans')
      .update(plan)
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
  }
};

// NUEVAS FUNCIONES PARA SISTEMA DE SUSCRIPCIONES
export const subscriptionOperations = {
  // Verificar si usuario tiene suscripción activa
  async checkPremiumAccess(userId: string): Promise<boolean> {
    const { data, error } = await supabase
      .from('users')
      .select('subscription_status, subscription_end_date')
      .eq('id', userId)
      .single();

    if (error || !data) return false;

    const now = new Date();
    const endDate = data.subscription_end_date ? new Date(data.subscription_end_date) : null;

    return data.subscription_status === 'premium' && endDate && endDate > now;
  },

  // Crear transacción de pago
  async createPaymentTransaction(transactionData: {
    user_id: string;
    wompi_transaction_id: string;
    amount: number;
    currency?: string;
    status: string;
    payment_method?: string;
    subscription_months?: number;
  }) {
    const { data, error } = await supabase
      .from('payment_transactions')
      .insert([
        {
          ...transactionData,
          created_at: new Date().toISOString()
        }
      ])
      .select()
      .single();
    return { data, error };
  },

  // Actualizar transacción de pago
  async updatePaymentTransaction(transactionId: string, updateData: any) {
    const { data, error } = await supabase
      .from('payment_transactions')
      .update({
        ...updateData,
        updated_at: new Date().toISOString()
      })
      .eq('wompi_transaction_id', transactionId)
      .select()
      .single();
    return { data, error };
  },

  // Activar suscripción premium
  async activatePremiumSubscription(userId: string, transactionId: string) {
    try {
      // Obtener datos actuales del usuario
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('subscription_end_date')
        .eq('id', userId)
        .single();

      if (userError) throw userError;

      // Calcular nueva fecha de vencimiento
      const now = new Date();
      const currentEndDate = userData?.subscription_end_date ? new Date(userData.subscription_end_date) : null;
      const newEndDate = new Date();

      if (currentEndDate && currentEndDate > now) {
        // Extender suscripción existente
        newEndDate.setTime(currentEndDate.getTime() + (30 * 24 * 60 * 60 * 1000));
      } else {
        // Nueva suscripción
        newEndDate.setTime(now.getTime() + (30 * 24 * 60 * 60 * 1000));
      }

      // Actualizar usuario
      const { error: updateError } = await supabase
        .from('users')
        .update({
          subscription_status: 'premium',
          subscription_end_date: newEndDate.toISOString(),
          last_payment_date: now.toISOString()
        })
        .eq('id', userId);

      if (updateError) throw updateError;

      // Crear historial de suscripción
      const { error: historyError } = await supabase
        .from('subscription_history')
        .insert([
          {
            user_id: userId,
            subscription_type: 'premium',
            start_date: currentEndDate && currentEndDate > now ? currentEndDate.toISOString() : now.toISOString(),
            end_date: newEndDate.toISOString(),
            price: 4500000, // $45,000 COP en centavos
            payment_transaction_id: transactionId,
            status: 'active'
          }
        ]);

      if (historyError) throw historyError;

      return { success: true, end_date: newEndDate };
    } catch (error) {
      console.error('Error activando suscripción premium:', error);
      return { success: false, error };
    }
  },

  // Obtener transacciones del usuario
  async getUserTransactions(userId: string) {
    const { data, error } = await supabase
      .from('payment_transactions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    return { data, error };
  },

  // Obtener historial de suscripciones
  async getUserSubscriptionHistory(userId: string) {
    const { data, error } = await supabase
      .from('subscription_history')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    return { data, error };
  },

  // Cancelar suscripción
  async cancelSubscription(userId: string) {
    const { error } = await supabase
      .from('users')
      .update({
        subscription_status: 'cancelled',
        payment_token: null
      })
      .eq('id', userId);

    // Marcar historial como cancelado
    await supabase
      .from('subscription_history')
      .update({ status: 'cancelled' })
      .eq('user_id', userId)
      .eq('status', 'active');

    return { error };
  },

  // Obtener contenido premium
  async getPremiumContent(contentType?: string) {
    let query = supabase
      .from('premium_content')
      .select('*');

    if (contentType) {
      query = query.eq('content_type', contentType);
    }

    const { data, error } = await query.order('created_at', { ascending: false });
    return { data, error };
  },

  // Guardar token de pago para renovación automática
  async savePaymentToken(userId: string, paymentToken: string, wompiCustomerId?: string) {
    const { error } = await supabase
      .from('users')
      .update({
        payment_token: paymentToken,
        wompi_customer_id: wompiCustomerId
      })
      .eq('id', userId);
    return { error };
  },

  // Obtener usuarios próximos a vencer para renovación
  async getUsersForRenewal(daysAhead: number = 3) {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + daysAhead);

    const { data, error } = await supabase
      .from('users')
      .select('id, nombre, email, subscription_end_date, payment_token')
      .eq('subscription_status', 'premium')
      .not('payment_token', 'is', null)
      .lte('subscription_end_date', futureDate.toISOString())
      .gt('subscription_end_date', new Date().toISOString());

    return { data, error };
  },

  // Obtener estadísticas de suscripciones (admin)
  async getSubscriptionStats() {
    try {
      // Total usuarios premium activos
      const { count: premiumUsers } = await supabase
        .from('users')
        .select('id', { count: 'exact' })
        .eq('subscription_status', 'premium')
        .gt('subscription_end_date', new Date().toISOString());

      // Usuarios expirados
      const { count: expiredUsers } = await supabase
        .from('users')
        .select('id', { count: 'exact' })
        .eq('subscription_status', 'expired');

      // Ingresos totales
      const { data: totalRevenue } = await supabase
        .from('payment_transactions')
        .select('amount')
        .eq('status', 'approved');

      // Ingresos del mes
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);

      const { data: monthlyRevenue } = await supabase
        .from('payment_transactions')
        .select('amount')
        .eq('status', 'approved')
        .gte('created_at', startOfMonth.toISOString());

      // Próximas renovaciones
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 3);

      const { count: pendingRenewals } = await supabase
        .from('users')
        .select('id', { count: 'exact' })
        .eq('subscription_status', 'premium')
        .lte('subscription_end_date', futureDate.toISOString())
        .gt('subscription_end_date', new Date().toISOString());

      const totalAmount = totalRevenue?.reduce((sum, t) => sum + (t.amount || 0), 0) || 0;
      const monthlyAmount = monthlyRevenue?.reduce((sum, t) => sum + (t.amount || 0), 0) || 0;

      return {
        total_premium_users: premiumUsers || 0,
        expired_users: expiredUsers || 0,
        total_revenue: totalAmount,
        monthly_revenue: monthlyAmount,
        pending_renewals: pendingRenewals || 0
      };
    } catch (error) {
      console.error('Error obteniendo estadísticas de suscripciones:', error);
      return {
        total_premium_users: 0,
        expired_users: 0,
        total_revenue: 0,
        monthly_revenue: 0,
        pending_renewals: 0
      };
    }
  }
};

// SISTEMA DE INICIALIZACIÓN DE DATOS
export const initializeDatabase = {
  async loadInitialFoods() {
    const foods = [
      // Frutas (20 items)
      { name: 'Manzana', category: 'Frutas', calories_per_100g: 52, protein_per_100g: 0.3, carbs_per_100g: 14, fat_per_100g: 0.2, fiber_per_100g: 2.4, is_custom: false },
      { name: 'Plátano', category: 'Frutas', calories_per_100g: 89, protein_per_100g: 1.1, carbs_per_100g: 23, fat_per_100g: 0.3, fiber_per_100g: 2.6, is_custom: false },
      { name: 'Naranja', category: 'Frutas', calories_per_100g: 47, protein_per_100g: 0.9, carbs_per_100g: 12, fat_per_100g: 0.1, fiber_per_100g: 2.4, is_custom: false },
      { name: 'Fresa', category: 'Frutas', calories_per_100g: 32, protein_per_100g: 0.7, carbs_per_100g: 8, fat_per_100g: 0.3, fiber_per_100g: 2.0, is_custom: false },
      { name: 'Uva', category: 'Frutas', calories_per_100g: 69, protein_per_100g: 0.7, carbs_per_100g: 18, fat_per_100g: 0.2, fiber_per_100g: 0.9, is_custom: false },
      { name: 'Piña', category: 'Frutas', calories_per_100g: 50, protein_per_100g: 0.5, carbs_per_100g: 13, fat_per_100g: 0.1, fiber_per_100g: 1.4, is_custom: false },
      { name: 'Mango', category: 'Frutas', calories_per_100g: 60, protein_per_100g: 0.8, carbs_per_100g: 15, fat_per_100g: 0.4, fiber_per_100g: 1.6, is_custom: false },
      { name: 'Pera', category: 'Frutas', calories_per_100g: 57, protein_per_100g: 0.4, carbs_per_100g: 15, fat_per_100g: 0.1, fiber_per_100g: 3.1, is_custom: false },
      { name: 'Durazno', category: 'Frutas', calories_per_100g: 39, protein_per_100g: 0.9, carbs_per_100g: 10, fat_per_100g: 0.3, fiber_per_100g: 1.5, is_custom: false },
      { name: 'Kiwi', category: 'Frutas', calories_per_100g: 61, protein_per_100g: 1.1, carbs_per_100g: 15, fat_per_100g: 0.5, fiber_per_100g: 3.0, is_custom: false },
      { name: 'Sandía', category: 'Frutas', calories_per_100g: 30, protein_per_100g: 0.6, carbs_per_100g: 8, fat_per_100g: 0.2, fiber_per_100g: 0.4, is_custom: false },
      { name: 'Melón', category: 'Frutas', calories_per_100g: 34, protein_per_100g: 0.8, carbs_per_100g: 8, fat_per_100g: 0.2, fiber_per_100g: 0.9, is_custom: false },
      { name: 'Cereza', category: 'Frutas', calories_per_100g: 63, protein_per_100g: 1.1, carbs_per_100g: 16, fat_per_100g: 0.2, fiber_per_100g: 2.1, is_custom: false },
      { name: 'Ciruela', category: 'Frutas', calories_per_100g: 46, protein_per_100g: 0.7, carbs_per_100g: 11, fat_per_100g: 0.3, fiber_per_100g: 1.4, is_custom: false },
      { name: 'Limón', category: 'Frutas', calories_per_100g: 29, protein_per_100g: 1.1, carbs_per_100g: 9, fat_per_100g: 0.3, fiber_per_100g: 2.8, is_custom: false },
      { name: 'Lima', category: 'Frutas', calories_per_100g: 30, protein_per_100g: 0.7, carbs_per_100g: 11, fat_per_100g: 0.2, fiber_per_100g: 2.8, is_custom: false },
      { name: 'Papaya', category: 'Frutas', calories_per_100g: 43, protein_per_100g: 0.5, carbs_per_100g: 11, fat_per_100g: 0.3, fiber_per_100g: 1.7, is_custom: false },
      { name: 'Guayaba', category: 'Frutas', calories_per_100g: 68, protein_per_100g: 2.6, carbs_per_100g: 14, fat_per_100g: 1.0, fiber_per_100g: 5.4, is_custom: false },
      { name: 'Maracuyá', category: 'Frutas', calories_per_100g: 97, protein_per_100g: 2.2, carbs_per_100g: 23, fat_per_100g: 0.7, fiber_per_100g: 10.4, is_custom: false },
      { name: 'Arándano', category: 'Frutas', calories_per_100g: 57, protein_per_100g: 0.7, carbs_per_100g: 14, fat_per_100g: 0.3, fiber_per_100g: 2.4, is_custom: false },

      // Verduras (20 items)
      { name: 'Brócoli', category: 'Verduras', calories_per_100g: 34, protein_per_100g: 2.8, carbs_per_100g: 7, fat_per_100g: 0.4, fiber_per_100g: 2.6, is_custom: false },
      { name: 'Espinaca', category: 'Verduras', calories_per_100g: 23, protein_per_100g: 2.9, carbs_per_100g: 3.6, fat_per_100g: 0.4, fiber_per_100g: 2.2, is_custom: false },
      { name: 'Zanahoria', category: 'Verduras', calories_per_100g: 41, protein_per_100g: 0.9, carbs_per_100g: 10, fat_per_100g: 0.2, fiber_per_100g: 2.8, is_custom: false },
      { name: 'Lechuga', category: 'Verduras', calories_per_100g: 15, protein_per_100g: 1.4, carbs_per_100g: 2.9, fat_per_100g: 0.2, fiber_per_100g: 1.3, is_custom: false },
      { name: 'Tomate', category: 'Verduras', calories_per_100g: 18, protein_per_100g: 0.9, carbs_per_100g: 3.9, fat_per_100g: 0.2, fiber_per_100g: 1.2, is_custom: false },
      { name: 'Pepino', category: 'Verduras', calories_per_100g: 16, protein_per_100g: 0.7, carbs_per_100g: 4, fat_per_100g: 0.1, fiber_per_100g: 0.5, is_custom: false },
      { name: 'Cebolla', category: 'Verduras', calories_per_100g: 40, protein_per_100g: 1.1, carbs_per_100g: 9, fat_per_100g: 0.1, fiber_per_100g: 1.7, is_custom: false },
      { name: 'Ajo', category: 'Verduras', calories_per_100g: 149, protein_per_100g: 6.4, carbs_per_100g: 33, fat_per_100g: 0.5, fiber_per_100g: 2.1, is_custom: false },
      { name: 'Apio', category: 'Verduras', calories_per_100g: 14, protein_per_100g: 0.7, carbs_per_100g: 3, fat_per_100g: 0.2, fiber_per_100g: 1.6, is_custom: false },
      { name: 'Coliflor', category: 'Verduras', calories_per_100g: 25, protein_per_100g: 1.9, carbs_per_100g: 5, fat_per_100g: 0.3, fiber_per_100g: 2.0, is_custom: false },
      { name: 'Calabacín', category: 'Verduras', calories_per_100g: 17, protein_per_100g: 1.2, carbs_per_100g: 3.1, fat_per_100g: 0.3, fiber_per_100g: 1.0, is_custom: false },
      { name: 'Berenjena', category: 'Verduras', calories_per_100g: 25, protein_per_100g: 1.0, carbs_per_100g: 6, fat_per_100g: 0.2, fiber_per_100g: 3.0, is_custom: false },
      { name: 'Pimiento Rojo', category: 'Verduras', calories_per_100g: 31, protein_per_100g: 1.0, carbs_per_100g: 7, fat_per_100g: 0.3, fiber_per_100g: 2.5, is_custom: false },
      { name: 'Repollo', category: 'Verduras', calories_per_100g: 25, protein_per_100g: 1.3, carbs_per_100g: 6, fat_per_100g: 0.1, fiber_per_100g: 2.5, is_custom: false },
      { name: 'Rúcula', category: 'Verduras', calories_per_100g: 25, protein_per_100g: 2.6, carbs_per_100g: 3.7, fat_per_100g: 0.7, fiber_per_100g: 1.6, is_custom: false },
      { name: 'Acelga', category: 'Verduras', calories_per_100g: 19, protein_per_100g: 1.8, carbs_per_100g: 3.7, fat_per_100g: 0.2, fiber_per_100g: 1.6, is_custom: false },
      { name: 'Rábano', category: 'Verduras', calories_per_100g: 16, protein_per_100g: 0.7, carbs_per_100g: 3.4, fat_per_100g: 0.1, fiber_per_100g: 1.6, is_custom: false },
      { name: 'Nabo', category: 'Verduras', calories_per_100g: 28, protein_per_100g: 0.9, carbs_per_100g: 6.4, fat_per_100g: 0.1, fiber_per_100g: 1.8, is_custom: false },
      { name: 'Espárrago', category: 'Verduras', calories_per_100g: 20, protein_per_100g: 2.2, carbs_per_100g: 3.9, fat_per_100g: 0.1, fiber_per_100g: 2.1, is_custom: false },
      { name: 'Alcachofa', category: 'Verduras', calories_per_100g: 47, protein_per_100g: 3.3, carbs_per_100g: 11, fat_per_100g: 0.2, fiber_per_100g: 5.4, is_custom: false },

      // Proteínas (20 items)
      { name: 'Pollo Pechuga', category: 'Proteínas', calories_per_100g: 165, protein_per_100g: 31, carbs_per_100g: 0, fat_per_100g: 3.6, fiber_per_100g: 0, is_custom: false },
      { name: 'Huevo Entero', category: 'Proteínas', calories_per_100g: 155, protein_per_100g: 13, carbs_per_100g: 1.1, fat_per_100g: 11, fiber_per_100g: 0, is_custom: false },
      { name: 'Atún en Agua', category: 'Proteínas', calories_per_100g: 184, protein_per_100g: 30, carbs_per_100g: 0, fat_per_100g: 6.3, fiber_per_100g: 0, is_custom: false },
      { name: 'Salmón', category: 'Proteínas', calories_per_100g: 208, protein_per_100g: 20, carbs_per_100g: 0, fat_per_100g: 13, fiber_per_100g: 0, is_custom: false },
      { name: 'Carne Res Magra', category: 'Proteínas', calories_per_100g: 250, protein_per_100g: 26, carbs_per_100g: 0, fat_per_100g: 15, fiber_per_100g: 0, is_custom: false },
      { name: 'Pavo Pechuga', category: 'Proteínas', calories_per_100g: 135, protein_per_100g: 30, carbs_per_100g: 0, fat_per_100g: 1, fiber_per_100g: 0, is_custom: false },
      { name: 'Cerdo Lomo', category: 'Proteínas', calories_per_100g: 143, protein_per_100g: 26, carbs_per_100g: 0, fat_per_100g: 3.5, fiber_per_100g: 0, is_custom: false },
      { name: 'Camarones', category: 'Proteínas', calories_per_100g: 99, protein_per_100g: 24, carbs_per_100g: 0.2, fat_per_100g: 0.3, fiber_per_100g: 0, is_custom: false },
      { name: 'Merluza', category: 'Proteínas', calories_per_100g: 90, protein_per_100g: 18, carbs_per_100g: 0, fat_per_100g: 2, fiber_per_100g: 0, is_custom: false },
      { name: 'Tilapia', category: 'Proteínas', calories_per_100g: 96, protein_per_100g: 20, carbs_per_100g: 0, fat_per_100g: 1.7, fiber_per_100g: 0, is_custom: false },
      { name: 'Sardina', category: 'Proteínas', calories_per_100g: 208, protein_per_100g: 25, carbs_per_100g: 0, fat_per_100g: 11, fiber_per_100g: 0, is_custom: false },
      { name: 'Bacalao', category: 'Proteínas', calories_per_100g: 82, protein_per_100g: 18, carbs_per_100g: 0, fat_per_100g: 0.7, fiber_per_100g: 0, is_custom: false },
      { name: 'Jamón Serrano', category: 'Proteínas', calories_per_100g: 375, protein_per_100g: 30, carbs_per_100g: 0.4, fat_per_100g: 28, fiber_per_100g: 0, is_custom: false },
      { name: 'Queso Cottage', category: 'Proteínas', calories_per_100g: 98, protein_per_100g: 11, carbs_per_100g: 3.4, fat_per_100g: 4.3, fiber_per_100g: 0, is_custom: false },
      { name: 'Yogur Griego', category: 'Proteínas', calories_per_100g: 59, protein_per_100g: 10, carbs_per_100g: 3.6, fat_per_100g: 0.4, fiber_per_100g: 0, is_custom: false },
      { name: 'Tofu', category: 'Proteínas', calories_per_100g: 76, protein_per_100g: 8, carbs_per_100g: 1.9, fat_per_100g: 4.8, fiber_per_100g: 0.3, is_custom: false },
      { name: 'Tempeh', category: 'Proteínas', calories_per_100g: 193, protein_per_100g: 19, carbs_per_100g: 7.6, fat_per_100g: 11, fiber_per_100g: 9, is_custom: false },
      { name: 'Seitan', category: 'Proteínas', calories_per_100g: 370, protein_per_100g: 75, carbs_per_100g: 14, fat_per_100g: 1.9, fiber_per_100g: 0.6, is_custom: false },
      { name: 'Clara de Huevo', category: 'Proteínas', calories_per_100g: 52, protein_per_100g: 11, carbs_per_100g: 0.7, fat_per_100g: 0.2, fiber_per_100g: 0, is_custom: false },
      { name: 'Proteína en Polvo', category: 'Proteínas', calories_per_100g: 410, protein_per_100g: 80, carbs_per_100g: 5, fat_per_100g: 8, fiber_per_100g: 0, is_custom: false },

      // Carbohidratos (20 items)
      { name: 'Arroz Integral', category: 'Carbohidratos', calories_per_100g: 123, protein_per_100g: 2.6, carbs_per_100g: 23, fat_per_100g: 0.9, fiber_per_100g: 1.8, is_custom: false },
      { name: 'Avena', category: 'Carbohidratos', calories_per_100g: 389, protein_per_100g: 17, carbs_per_100g: 66, fat_per_100g: 7, fiber_per_100g: 10.6, is_custom: false },
      { name: 'Papa', category: 'Carbohidratos', calories_per_100g: 77, protein_per_100g: 2, carbs_per_100g: 17, fat_per_100g: 0.1, fiber_per_100g: 2.1, is_custom: false },
      { name: 'Quinoa', category: 'Carbohidratos', calories_per_100g: 368, protein_per_100g: 14, carbs_per_100g: 64, fat_per_100g: 6, fiber_per_100g: 7, is_custom: false },
      { name: 'Batata', category: 'Carbohidratos', calories_per_100g: 86, protein_per_100g: 1.6, carbs_per_100g: 20, fat_per_100g: 0.1, fiber_per_100g: 3, is_custom: false },
      { name: 'Pan Integral', category: 'Carbohidratos', calories_per_100g: 247, protein_per_100g: 13, carbs_per_100g: 41, fat_per_100g: 4.2, fiber_per_100g: 7, is_custom: false },
      { name: 'Pasta Integral', category: 'Carbohidratos', calories_per_100g: 124, protein_per_100g: 5, carbs_per_100g: 23, fat_per_100g: 1.1, fiber_per_100g: 3.2, is_custom: false },
      { name: 'Arroz Blanco', category: 'Carbohidratos', calories_per_100g: 130, protein_per_100g: 2.7, carbs_per_100g: 28, fat_per_100g: 0.3, fiber_per_100g: 0.4, is_custom: false },
      { name: 'Yuca', category: 'Carbohidratos', calories_per_100g: 160, protein_per_100g: 1.4, carbs_per_100g: 38, fat_per_100g: 0.3, fiber_per_100g: 1.8, is_custom: false },
      { name: 'Plátano Verde', category: 'Carbohidratos', calories_per_100g: 89, protein_per_100g: 1.1, carbs_per_100g: 23, fat_per_100g: 0.3, fiber_per_100g: 2.6, is_custom: false },
      { name: 'Maíz', category: 'Carbohidratos', calories_per_100g: 86, protein_per_100g: 3.3, carbs_per_100g: 19, fat_per_100g: 1.4, fiber_per_100g: 2.7, is_custom: false },
      { name: 'Cebada', category: 'Carbohidratos', calories_per_100g: 354, protein_per_100g: 12, carbs_per_100g: 73, fat_per_100g: 2.3, fiber_per_100g: 17, is_custom: false },
      { name: 'Centeno', category: 'Carbohidratos', calories_per_100g: 338, protein_per_100g: 10, carbs_per_100g: 76, fat_per_100g: 1.6, fiber_per_100g: 15, is_custom: false },
      { name: 'Mijo', category: 'Carbohidratos', calories_per_100g: 378, protein_per_100g: 11, carbs_per_100g: 73, fat_per_100g: 4.2, fiber_per_100g: 8.5, is_custom: false },
      { name: 'Amaranto', category: 'Carbohidratos', calories_per_100g: 371, protein_per_100g: 14, carbs_per_100g: 65, fat_per_100g: 7, fiber_per_100g: 6.7, is_custom: false },
      { name: 'Bulgur', category: 'Carbohidratos', calories_per_100g: 342, protein_per_100g: 12, carbs_per_100g: 76, fat_per_100g: 1.3, fiber_per_100g: 18, is_custom: false },
      { name: 'Polenta', category: 'Carbohidratos', calories_per_100g: 70, protein_per_100g: 1.7, carbs_per_100g: 15, fat_per_100g: 0.6, fiber_per_100g: 1.4, is_custom: false },
      { name: 'Tapioca', category: 'Carbohidratos', calories_per_100g: 358, protein_per_100g: 0.2, carbs_per_100g: 88, fat_per_100g: 0.02, fiber_per_100g: 0.9, is_custom: false },
      { name: 'Ñame', category: 'Carbohidratos', calories_per_100g: 118, protein_per_100g: 1.5, carbs_per_100g: 28, fat_per_100g: 0.2, fiber_per_100g: 4.1, is_custom: false },
      { name: 'Malanga', category: 'Carbohidratos', calories_per_100g: 98, protein_per_100g: 1.5, carbs_per_100g: 23, fat_per_100g: 0.1, fiber_per_100g: 4.1, is_custom: false },

      // Grasas Saludables (10 items)
      { name: 'Aguacate', category: 'Grasas', calories_per_100g: 160, protein_per_100g: 2, carbs_per_100g: 9, fat_per_100g: 15, fiber_per_100g: 6.7, is_custom: false },
      { name: 'Almendras', category: 'Grasas', calories_per_100g: 579, protein_per_100g: 21, carbs_per_100g: 22, fat_per_100g: 50, fiber_per_100g: 12.5, is_custom: false },
      { name: 'Nueces', category: 'Grasas', calories_per_100g: 654, protein_per_100g: 15, carbs_per_100g: 14, fat_per_100g: 65, fiber_per_100g: 6.7, is_custom: false },
      { name: 'Aceite de Oliva', category: 'Grasas', calories_per_100g: 884, protein_per_100g: 0, carbs_per_100g: 0, fat_per_100g: 100, fiber_per_100g: 0, is_custom: false },
      { name: 'Semillas de Chía', category: 'Grasas', calories_per_100g: 486, protein_per_100g: 17, carbs_per_100g: 42, fat_per_100g: 31, fiber_per_100g: 34, is_custom: false },
      { name: 'Semillas de Linaza', category: 'Grasas', calories_per_100g: 534, protein_per_100g: 18, carbs_per_100g: 29, fat_per_100g: 42, fiber_per_100g: 27, is_custom: false },
      { name: 'Aceite de Coco', category: 'Grasas', calories_per_100g: 862, protein_per_100g: 0, carbs_per_100g: 0, fat_per_100g: 100, fiber_per_100g: 0, is_custom: false },
      { name: 'Mantequilla de Maní', category: 'Grasas', calories_per_100g: 588, protein_per_100g: 25, carbs_per_100g: 20, fat_per_100g: 50, fiber_per_100g: 6, is_custom: false },
      { name: 'Tahini', category: 'Grasas', calories_per_100g: 595, protein_per_100g: 18, carbs_per_100g: 21, fat_per_100g: 54, fiber_per_100g: 9.3, is_custom: false },
      { name: 'Aceite de Aguacate', category: 'Grasas', calories_per_100g: 884, protein_per_100g: 0, carbs_per_100g: 0, fat_per_100g: 100, fiber_per_100g: 0, is_custom: false },

      // Lácteos (10 items)
      { name: 'Leche Descremada', category: 'Lácteos', calories_per_100g: 42, protein_per_100g: 3.4, carbs_per_100g: 5, fat_per_100g: 0.1, fiber_per_100g: 0, is_custom: false },
      { name: 'Queso Mozzarella', category: 'Lácteos', calories_per_100g: 280, protein_per_100g: 28, carbs_per_100g: 2.2, fat_per_100g: 17, fiber_per_100g: 0, is_custom: false },
      { name: 'Yogur Natural', category: 'Lácteos', calories_per_100g: 61, protein_per_100g: 3.5, carbs_per_100g: 4.7, fat_per_100g: 3.3, fiber_per_100g: 0, is_custom: false },
      { name: 'Queso Ricotta', category: 'Lácteos', calories_per_100g: 174, protein_per_100g: 11, carbs_per_100g: 3, fat_per_100g: 13, fiber_per_100g: 0, is_custom: false },
      { name: 'Kéfir', category: 'Lácteos', calories_per_100g: 41, protein_per_100g: 3.3, carbs_per_100g: 4.5, fat_per_100g: 1, fiber_per_100g: 0, is_custom: false },
      { name: 'Queso Fresco', category: 'Lácteos', calories_per_100g: 159, protein_per_100g: 13, carbs_per_100g: 2.7, fat_per_100g: 10, fiber_per_100g: 0, is_custom: false },
      { name: 'Mantequilla', category: 'Lácteos', calories_per_100g: 717, protein_per_100g: 0.9, carbs_per_100g: 0.1, fat_per_100g: 81, fiber_per_100g: 0, is_custom: false },
      { name: 'Crema de Leche', category: 'Lácteos', calories_per_100g: 345, protein_per_100g: 2.1, carbs_per_100g: 2.8, fat_per_100g: 37, fiber_per_100g: 0, is_custom: false },
      { name: 'Leche de Almendra', category: 'Lácteos', calories_per_100g: 17, protein_per_100g: 0.6, carbs_per_100g: 1.5, fat_per_100g: 1.1, fiber_per_100g: 0.3, is_custom: false },
      { name: 'Queso Parmesano', category: 'Lácteos', calories_per_100g: 392, protein_per_100g: 36, carbs_per_100g: 0, fat_per_100g: 26, fiber_per_100g: 0, is_custom: false }
    ];

    // Insertar alimentos por lotes para optimizar performance
    const batchSize = 20;
    for (let i = 0; i < foods.length; i += batchSize) {
      const batch = foods.slice(i, i + batchSize).map(food => ({
        ...food,
        created_at: new Date().toISOString()
      }));

      await supabase
        .from('foods')
        .insert(batch);
    }

    console.log(`✅ Inicializados ${foods.length} alimentos en la base de datos`);
  }
};

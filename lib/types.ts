// Tipos para la aplicación VitalMente
export interface User {
  id: string;  nombre: string;
  email: string;
  edad: number;
  peso: number;  altura: number;
  genero: 'masculino' | 'femenino';  actividad: string;
  objetivo: string;
  experiencia: string;
  condiciones: string[];
  preferencias: string[];
  created_at: string;
  updated_at: string;
  subscription_status?: string;
  subscription_end_date?: string;
  payment_token?: string;
  last_payment_date?: string;
  wompi_customer_id?: string;}
// Interfaz para alimentos
- ESTA ERA LA QUE FALTABA
export interface Food {
  id: string;
  name: string;  category: string;
  calories_per_100g: number;  protein_per_100g: number;
  carbs_per_100g: number;  fat_per_100g: number;
  fiber_per_100g?: number;
  image_url?: string;
  is_custom?: boolean;
  created_at: string;
}export interface UserMeal {
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
  id: string;  user_id: string;  weight_kg?: number;  body_fat_percentage?: number;
  muscle_mass_kg?: number;
  measurements?: any;
  notes?: string;  date: string;
  created_at: string;
}export interface UserActivity {
  id: string;
  user_id: string;
  activity_type: string;
  resource_id?: string;
  resource_type?: string;
  duration_minutes?: number;
  completion_status: 'started' | 'completed' | 'paused';
  metadata?: any;  date: string;
  created_at: string;
}export interface UserGoal {
  id: string;
  user_id: string;
  goal_type: 'weight_loss' | 'weight_gain' | 'muscle_gain' | 'strength' | 'endurance' | 'wellness';
  target_value: number;
  current_value?: number;
  target_date: string;
  is_active: boolean;
  created_at: string;
}export interface UserInsight {  id: string;
  user_id: string;
  insight_type: 'nutrition' | 'workout' | 'wellness' | 'supplement';
  title: string;
  description: string;
  recommendation: string;  confidence_score: number;  data_points: any;  is_viewed: boolean;  created_at: string;}
export interface Supplement {  id: string;
  name: string;
  category: string;
  price: number;  stock: number;
  benefits: string[];
  ingredients: string[];
  description: string;  image_url?: string;  is_active: boolean;  created_at: string;}
export interface SupplementRecommendation {
  id: string;
  user_id: string;
  supplement_id: string;
  reason: string;
  confidence_score: number;
  based_on_data: any;
  is_purchased: boolean;
  created_at: string;
  supplements?: Supplement;
}
export interface WorkoutLink {
  id: string;
  title: string;  category: 'cardio' | 'funcional' | 'tren-superior' | 'tren-inferior';
  url: string;
  duration_minutes: number;
  difficulty: 'principiante' | 'intermedio' | 'avanzado';
  description?: string;
  is_active: boolean;
  created_at: string;
}
export interface MindfulnessResource {
  id: string;
  title: string;
  category: 'meditacion' | 'relajacion' | 'respiracion' | 'mentalidad';  url: string;
  duration_minutes: number;
  difficulty: 'principiante' | 'intermedio' | 'avanzado';
  description?: string;
  is_active: boolean;
  created_at: string;
}
export interface NutritionPlan {
  id: string;
  title: string;
  description?: string;  target_audience?: string;  pdf_url?: string;  duration_weeks?: number;  calories_per_day?: number;
  is_active: boolean;
  created_at: string;
}
export interface PremiumContent {
  id: string;
  content_type: string;
  title: string;  description?: string;
  content_data?: any;
  created_at: string;
}export interface PaymentTransaction {  id: string;
  user_id: string;
  wompi_transaction_id?: string;  amount: number;
  currency: string;
  status: string;
  payment_method?: string;
  subscription_months: number;
  created_at: string;
  updated_at: string;
}
export interface SubscriptionHistory {
  id: string;
  user_id: string;
  subscription_type: string;
  start_date: string;
  end_date: string;
  price: number;  payment_transaction_id?: string;
  status: string;  created_at: string;}
// Tipos para formularios y entrada de datos
export interface CreateFoodInput {
  name: string;
  category: string;
  calories_per_100g: number;
  protein_per_100g: number;  carbs_per_100g: number;
  fat_per_100g: number;
  fiber_per_100g?: number;
  is_custom?: boolean;
}
export interface CreateUserMealInput {
  user_id: string;
  food_id: string;
  meal_type: 'desayuno' | 'almuerzo' | 'cena' | 'snack';
  portion_grams: number;
  date: string;
}
export interface CreateWaterIntakeInput {
  user_id: string;
  amount_ml: number;
  date: string;
}
export interface CreatePaymentTransactionInput {  user_id: string;  wompi_transaction_id?: string;
  amount: number;
  currency: string;  status: string;
  payment_method?: string;
  subscription_months: number;
}export interface UpdatePaymentTransactionInput {
  status?: string;  wompi_transaction_id?: string;
  payment_method?: string;
}
// Tipos para respuestas de API
export interface DatabaseResponse<T> {  data: T | null;  error: any;
}export interface PaginatedResponse<T> {
  data: T[];  count: number;
  error: any;
}
// Tipos para configuraciones
export interface MacroTargets {
  calories: number;
  protein: number;
  carbs: number;  fat: number;
}export interface NutritionTargets extends MacroTargets {  fiber: number;
  water_ml: number;
}// Tipos para métricas y analytics
export interface DailyNutritionSummary {  date: string;
  total_calories: number;
  total_protein: number;
  total_carbs: number;
  total_fat: number;
  total_fiber: number;
  water_intake_ml: number;  meals_logged: number;}
export interface WeeklyProgressSummary {
  week_start: string;
  avg_calories: number;
  avg_protein: number;
  avg_carbs: number;
  avg_fat: number;
  workouts_completed: number;  compliance_score: number;}
// Tipos para IA y recomendaciones
export interface AIInsightData {
  user_id: string;
  analysis_period_days: number;  nutrition_data: any;  activity_data: any;  progress_data: any;}
export interface AIRecommendation {
  type: 'nutrition' | 'workout' | 'supplement' | 'lifestyle';
  priority: 'high' | 'medium' | 'low';
  title: string;
  description: string;  action_items: string[];  confidence_score: number;  based_on: string[];}
// Enums y constantes de tipos
export const MEAL_TYPES = {
  DESAYUNO: 'desayuno',
  ALMUERZO: 'almuerzo',  CENA: 'cena',
  SNACK: 'snack'
} as const;
export const FOOD_CATEGORIES = {
  FRUTAS: 'Frutas',  VERDURAS: 'Verduras',
  PROTEINAS: 'Proteínas',
  CARBOHIDRATOS: 'Carbohidratos',
  GRASAS: 'Grasas',
  LACTEOS: 'Lácteos',
  LEGUMBRES: 'Legumbres',
  CEREALES: 'Cereales',  SNACKS: 'Snacks',
  BEBIDAS: 'Bebidas',  CONDIMENTOS: 'Condimentos'
} as const;
export const WORKOUT_CATEGORIES = {
  CARDIO: 'cardio',
  FUNCIONAL: 'funcional',
  TREN_SUPERIOR: 'tren-superior',
  TREN_INFERIOR: 'tren-inferior'
} as const;
export const MINDFULNESS_CATEGORIES = {
  MEDITACION: 'meditacion',
  RELAJACION: 'relajacion',
  RESPIRACION: 'respiracion',
  MENTALIDAD: 'mentalidad'
} as const;export const DIFFICULTY_LEVELS = {
  PRINCIPIANTE: 'principiante',  INTERMEDIO: 'intermedio',
  AVANZADO: 'avanzado'} as const;
export const SUBSCRIPTION_STATUS = {
  FREE: 'free',
  PREMIUM: 'premium',
  EXPIRED: 'expired'} as const;
export const PAYMENT_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',  DECLINED: 'declined',  ERROR: 'error'} as const;
// Tipos de utilidad
export type MealType = keyof typeof MEAL_TYPES;
export type FoodCategory = typeof FOOD_CATEGORIES[keyof typeof FOOD_CATEGORIES];
export type WorkoutCategory = typeof WORKOUT_CATEGORIES[keyof typeof WORKOUT_CATEGORIES];
export type MindfulnessCategory = typeof MINDFULNESS_CATEGORIES[keyof typeof MINDFULNESS_CATEGORIES];
export type DifficultyLevel = typeof DIFFICULTY_LEVELS[keyof typeof DIFFICULTY_LEVELS];export type SubscriptionStatus = typeof SUBSCRIPTION_STATUS[keyof typeof SUBSCRIPTION_STATUS];
export type PaymentStatus = typeof PAYMENT_STATUS[keyof typeof PAYMENT_STATUS];

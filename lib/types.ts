// lib/types.ts - Versión corregida completa

// Tipos principales de usuario
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
  subscription_status?: 'free' | 'premium';
  created_at?: string;
  updated_at?: string;
}

// Alias para compatibilidad
export interface Usuario extends User {}

// 🔧 CORRIGIENDO INTERFAZ FOOD - Agregando propiedades faltantes
export interface Food {
  id: string;
  name: string;
  category: string;
  calories_per_100g: number;
  protein_per_100g: number;
  carbs_per_100g: number;
  fat_per_100g: number;
  fiber_per_100g?: number; // ← CAMBIO: opcional
  sugar_per_100g?: number; // ← CAMBIO: opcional  
  sodium_per_100g?: number; // ← CAMBIO: opcional
  image_url?: string; // ← AGREGADO: propiedad faltante
  is_custom?: boolean; // ← AGREGADO: propiedad faltante
  created_at?: string; // ← CAMBIO: opcional
}

// Interfaz para mapeo español (usada en FoodBankManager)
export interface Alimento {
  id: string;
  nombre: string;
  categoria: string;
  calorias_por_100g: number;
  proteina_por_100g: number;
  carbohidratos_por_100g: number;
  grasas_por_100g: number;
  fibra_por_100g?: number;
  azucar_por_100g?: number;
  sodio_por_100g?: number;
  imagen_url?: string;
  es_personalizado?: boolean;
  created_at?: string;
}

// Tipos de comidas del usuario
export interface UserMeal {
  id: string;
  user_id: string;
  food_id: string;
  quantity: number;
  meal_type: 'desayuno' | 'almuerzo' | 'cena' | 'snack';
  date: string;
  created_at: string;
  foods?: Food;
}

// Tipos de ingesta de agua
export interface WaterIntake {
  id: string;
  user_id: string;
  amount_ml: number;
  date: string;
  created_at: string;
}

// Tipos de suplementos
export interface Supplement {
  id: string;
  name: string;
  category: string;
  description: string;
  benefits: string[];
  dosage: string;
  price: number;
  image_url: string;
  is_active: boolean;
  created_at: string;
}

// Tipos de entrenamientos
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

// Tipos de recursos de mindfulness
export interface MindfulnessResource {
  id: string;
  title: string;
  description?: string;
  type: 'meditation' | 'breathing' | 'relaxation' | 'mindset';
  content_url: string;
  duration: number;
  difficulty: 'principiante' | 'intermedio' | 'avanzado';
  tags: string[];
  is_active: boolean;
  created_at: string;
}

// Tipos de planes de nutrición
export interface NutritionPlan {
  id: string;
  name: string;
  description: string;
  target_calories: number;
  target_protein: number;
  target_carbs: number;
  target_fat: number;
  plan_type: string;
  duration_days: number;
  meals_data: any;
  is_active: boolean;
  created_at: string;
}

// Tipos de actividades del usuario
export interface UserActivity {
  id: string;
  user_id: string;
  activity_type: string;
  activity_name: string;
  duration_minutes: number;
  calories_burned?: number;
  completion_status: 'completed' | 'in_progress' | 'skipped';
  date: string;
  notes?: string;
  created_at: string;
}

// Tipos de insights del usuario
export interface UserInsight {
  id: string;
  user_id: string;
  insight_type: string;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  is_viewed: boolean;
  created_at: string;
}

// Tipos de recomendaciones de suplementos
export interface SupplementRecommendation {
  id: string;
  user_id: string;
  supplement_id: string;
  reason: string;
  priority: 'high' | 'medium' | 'low';
  is_purchased: boolean;
  created_at: string;
  supplements?: Supplement;
}

// Tipos para pagos y suscripciones
export interface PaymentTransaction {
  id: string;
  user_id: string;
  wompi_transaction_id: string;
  amount: number;
  currency: string;
  status: 'pending' | 'approved' | 'declined' | 'error';
  payment_method: string;
  subscription_months: number;
  created_at: string;
}

// Tipos para análisis y estadísticas
export interface UserStats {
  total_meals: number;
  avg_calories: number;
  total_workouts: number;
  compliance_score: number;
  streak_days: number;
}

// Tipos para macros nutricionales
export interface MacroTargets {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber?: number;
}

// Tipos para respuestas de la base de datos
export interface DatabaseResponse<T> {
  data: T | null;
  error: any;
}

// Tipos para configuración de la aplicación
export interface AppConfig {
  supabaseUrl: string;
  supabaseKey: string;
  wompiPublicKey: string;
  environment: 'development' | 'production';
}

// Tipos para filtros y búsquedas
export interface FilterOptions {
  category?: string;
  dateRange?: {
    start: string;
    end: string;
  };
  status?: string;
  type?: string;
}

// Tipos para notificaciones
export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
  is_read: boolean;
  created_at: string;
}

// Tipos para el dashboard
export interface DashboardData {
  user: User;
  stats: UserStats;
  recentMeals: UserMeal[];
  recentActivities: UserActivity[];
  insights: UserInsight[];
  recommendations: SupplementRecommendation[];
}

// Tipos para validación de formularios
export interface FormValidation {
  isValid: boolean;
  errors: Record<string, string>;
}

// Tipos para archivos y media
export interface MediaFile {
  id: string;
  filename: string;
  url: string;
  type: string;
  size: number;
  created_at: string;
}

// Tipos específicos para Wompi
export interface WompiPaymentData {
  currency: string;
  amount_in_cents: number;
  reference: string;
  customer_email: string;
  customer_data?: {
    full_name?: string;
    phone_number?: string;
  };
  redirect_url?: string;
  payment_method?: {
    type: string;
    user_type?: string;
    user_legal_id_type?: string;
    user_legal_id?: string;
  };
}

export interface WompiTransaction {
  id: string;
  status: string;
  reference: string;
  amount_in_cents: number;
  currency: string;
  payment_method_type: string;
  created_at: string;
}

// 🔧 AGREGANDO TIPOS ADICIONALES PARA COMPATIBILIDAD

// Tipo para datos de formulario de alimentos
export interface FoodFormData {
  name: string;
  category: string;
  calories_per_100g: string;
  protein_per_100g: string;
  carbs_per_100g: string;
  fat_per_100g: string;
  fiber_per_100g: string;
  sugar_per_100g: string;
  sodium_per_100g: string;
  image_url: string;
  is_custom: boolean;
}

// Tipo para datos de usuario en registro
export interface UserRegistrationData {
  nombre: string;
  apellidos?: string; // ← OPCIONAL para evitar errores
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
}

// Tipo para respuestas de API
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
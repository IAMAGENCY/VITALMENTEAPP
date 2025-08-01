
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

// Tipos de alimentos
export interface Food {
  id: string;
  name: string;
  category: string;
  calories_per_100g: number;
  protein_per_100g: number;
  carbs_per_100g: number;
  fat_per_100g: number;
  fiber_per_100g: number;
  sugar_per_100g: number;
  sodium_per_100g: number;
  created_at: string;
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

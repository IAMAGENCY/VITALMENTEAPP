
-- VitalMente - Script completo de configuración de base de datos empresarial
-- Ejecutar este script completo en Supabase SQL Editor

-- 1. TABLA DE USUARIOS (Base empresarial)
CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nombre VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  edad INTEGER NOT NULL CHECK (edad > 0 AND edad <= 120),
  peso DECIMAL(5,2) NOT NULL CHECK (peso > 0),
  altura INTEGER NOT NULL CHECK (altura > 0),
  genero VARCHAR(20) NOT NULL CHECK (genero IN ('masculino', 'femenino')),
  actividad VARCHAR(50) NOT NULL CHECK (actividad IN ('sedentario', 'ligero', 'moderado', 'activo', 'muy_activo')),
  objetivo VARCHAR(50) NOT NULL CHECK (objetivo IN ('perder', 'mantener', 'ganar', 'definir', 'salud')),
  experiencia VARCHAR(50) NOT NULL CHECK (experiencia IN ('principiante', 'intermedio', 'avanzado')),
  condiciones TEXT[] DEFAULT '{}',
  preferencias TEXT[] DEFAULT '{}',
  subscription_status VARCHAR(20) DEFAULT 'free' CHECK (subscription_status IN ('free', 'premium', 'cancelled', 'expired')),
  subscription_end_date TIMESTAMP WITH TIME ZONE,
  last_payment_date TIMESTAMP WITH TIME ZONE,
  payment_token TEXT,
  wompi_customer_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. BANCO DE ALIMENTOS (Datos maestros empresariales)
CREATE TABLE IF NOT EXISTS foods (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL,
  calories_per_100g DECIMAL(8,2) NOT NULL CHECK (calories_per_100g >= 0),
  protein_per_100g DECIMAL(6,2) NOT NULL CHECK (protein_per_100g >= 0),
  carbs_per_100g DECIMAL(6,2) NOT NULL CHECK (carbs_per_100g >= 0),
  fat_per_100g DECIMAL(6,2) NOT NULL CHECK (fat_per_100g >= 0),
  fiber_per_100g DECIMAL(6,2) DEFAULT 0 CHECK (fiber_per_100g >= 0),
  is_custom BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. REGISTRO DE COMIDAS DE USUARIOS (Tracking empresarial)
CREATE TABLE IF NOT EXISTS user_meals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  food_id UUID NOT NULL REFERENCES foods(id) ON DELETE CASCADE,
  meal_type VARCHAR(20) NOT NULL CHECK (meal_type IN ('desayuno', 'almuerzo', 'cena', 'snack')),
  portion_grams DECIMAL(8,2) NOT NULL CHECK (portion_grams > 0),
  date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. CONSUMO DE AGUA (Hydratación empresarial)
CREATE TABLE IF NOT EXISTS water_intake (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  amount_ml INTEGER NOT NULL CHECK (amount_ml > 0),
  date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. PROGRESO DE USUARIOS (Métricas empresariales)
CREATE TABLE IF NOT EXISTS user_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  weight_kg DECIMAL(5,2) CHECK (weight_kg > 0),
  body_fat_percentage DECIMAL(4,2) CHECK (body_fat_percentage >= 0 AND body_fat_percentage <= 100),
  muscle_mass_kg DECIMAL(5,2) CHECK (muscle_mass_kg >= 0),
  measurements JSONB DEFAULT '{}',
  notes TEXT,
  date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. ACTIVIDADES DE USUARIOS (Tracking de actividad empresarial)
CREATE TABLE IF NOT EXISTS user_activities (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  activity_type VARCHAR(100) NOT NULL,
  resource_id UUID,
  resource_type VARCHAR(50),
  duration_minutes INTEGER CHECK (duration_minutes >= 0),
  completion_status VARCHAR(20) DEFAULT 'started' CHECK (completion_status IN ('started', 'completed', 'paused')),
  metadata JSONB DEFAULT '{}',
  date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. METAS DE USUARIOS (Sistema de objetivos empresariales)
CREATE TABLE IF NOT EXISTS user_goals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  goal_type VARCHAR(50) NOT NULL CHECK (goal_type IN ('weight_loss', 'weight_gain', 'muscle_gain', 'strength', 'endurance', 'wellness')),
  target_value DECIMAL(10,2) NOT NULL,
  current_value DECIMAL(10,2) DEFAULT 0,
  target_date DATE NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. INSIGHTS DE IA (Sistema de insights empresariales)
CREATE TABLE IF NOT EXISTS user_insights (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  insight_type VARCHAR(50) NOT NULL CHECK (insight_type IN ('nutrition', 'workout', 'wellness', 'supplement')),
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  recommendation TEXT NOT NULL,
  confidence_score DECIMAL(3,2) NOT NULL CHECK (confidence_score >= 0 AND confidence_score <= 1),
  data_points JSONB DEFAULT '{}',
  is_viewed BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 9. SUPLEMENTOS (E-commerce empresarial)
CREATE TABLE IF NOT EXISTS supplements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL,
  description TEXT,
  benefits TEXT[],
  price DECIMAL(10,2) NOT NULL CHECK (price >= 0),
  image_url TEXT,
  stock_quantity INTEGER DEFAULT 0 CHECK (stock_quantity >= 0),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 10. RECOMENDACIONES DE SUPLEMENTOS IA (Recomendaciones inteligentes)
CREATE TABLE IF NOT EXISTS supplement_recommendations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  supplement_id UUID NOT NULL REFERENCES supplements(id) ON DELETE CASCADE,
  reason TEXT NOT NULL,
  confidence_score DECIMAL(3,2) NOT NULL CHECK (confidence_score >= 0 AND confidence_score <= 1),
  based_on_data JSONB DEFAULT '{}',
  is_purchased BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 11. TRANSACCIONES DE PAGO (Sistema de pagos empresarial)
CREATE TABLE IF NOT EXISTS payment_transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  wompi_transaction_id VARCHAR(255) UNIQUE NOT NULL,
  amount INTEGER NOT NULL CHECK (amount > 0),
  currency VARCHAR(3) DEFAULT 'COP',
  status VARCHAR(50) NOT NULL CHECK (status IN ('pending', 'approved', 'declined', 'error')),
  payment_method VARCHAR(50),
  subscription_months INTEGER DEFAULT 1 CHECK (subscription_months > 0),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 12. HISTORIAL DE SUSCRIPCIONES (Control empresarial de suscripciones)
CREATE TABLE IF NOT EXISTS subscription_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  subscription_type VARCHAR(50) NOT NULL,
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE NOT NULL,
  price INTEGER NOT NULL CHECK (price > 0),
  payment_transaction_id VARCHAR(255),
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'expired')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 13. ENTRENAMIENTOS (Contenido empresarial)
CREATE TABLE IF NOT EXISTS workout_links (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(100) NOT NULL,
  difficulty_level VARCHAR(20) CHECK (difficulty_level IN ('principiante', 'intermedio', 'avanzado')),
  duration_minutes INTEGER CHECK (duration_minutes > 0),
  video_url TEXT,
  thumbnail_url TEXT,
  equipment_needed TEXT[],
  muscle_groups TEXT[],
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 14. RECURSOS DE MINDFULNESS (Contenido empresarial)
CREATE TABLE IF NOT EXISTS mindfulness_resources (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(100) NOT NULL,
  type VARCHAR(50) CHECK (type IN ('meditation', 'breathing', 'relaxation', 'therapy')),
  duration_minutes INTEGER CHECK (duration_minutes > 0),
  audio_url TEXT,
  video_url TEXT,
  thumbnail_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 15. PLANES DE NUTRICIÓN (Contenido empresarial)
CREATE TABLE IF NOT EXISTS nutrition_plans (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(100) NOT NULL,
  target_calories INTEGER CHECK (target_calories > 0),
  target_protein DECIMAL(6,2) CHECK (target_protein >= 0),
  target_carbs DECIMAL(6,2) CHECK (target_carbs >= 0),
  target_fat DECIMAL(6,2) CHECK (target_fat >= 0),
  plan_data JSONB NOT NULL,
  difficulty_level VARCHAR(20) CHECK (difficulty_level IN ('principiante', 'intermedio', 'avanzado')),
  duration_days INTEGER CHECK (duration_days > 0),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 16. CONTENIDO PREMIUM (Contenido empresarial exclusivo)
CREATE TABLE IF NOT EXISTS premium_content (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  content_type VARCHAR(50) NOT NULL CHECK (content_type IN ('guide', 'video', 'plan', 'analysis')),
  content_data JSONB DEFAULT '{}',
  file_url TEXT,
  thumbnail_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ÍNDICES PARA OPTIMIZACIÓN EMPRESARIAL
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_subscription ON users(subscription_status, subscription_end_date);
CREATE INDEX IF NOT EXISTS idx_user_meals_user_date ON user_meals(user_id, date);
CREATE INDEX IF NOT EXISTS idx_user_meals_food ON user_meals(food_id);
CREATE INDEX IF NOT EXISTS idx_water_intake_user_date ON water_intake(user_id, date);
CREATE INDEX IF NOT EXISTS idx_user_progress_user_date ON user_progress(user_id, date);
CREATE INDEX IF NOT EXISTS idx_user_activities_user_date ON user_activities(user_id, date);
CREATE INDEX IF NOT EXISTS idx_user_goals_user_active ON user_goals(user_id, is_active);
CREATE INDEX IF NOT EXISTS idx_user_insights_user_viewed ON user_insights(user_id, is_viewed);
CREATE INDEX IF NOT EXISTS idx_supplement_recommendations_user ON supplement_recommendations(user_id, is_purchased);
CREATE INDEX IF NOT EXISTS idx_payment_transactions_user ON payment_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_payment_transactions_status ON payment_transactions(status);
CREATE INDEX IF NOT EXISTS idx_subscription_history_user ON subscription_history(user_id);
CREATE INDEX IF NOT EXISTS idx_foods_category ON foods(category);
CREATE INDEX IF NOT EXISTS idx_supplements_active ON supplements(is_active);
CREATE INDEX IF NOT EXISTS idx_workout_links_category ON workout_links(category, is_active);
CREATE INDEX IF NOT EXISTS idx_mindfulness_resources_category ON mindfulness_resources(category, is_active);
CREATE INDEX IF NOT EXISTS idx_nutrition_plans_category ON nutrition_plans(category, is_active);

-- FUNCIONES DE TRIGGER PARA TIMESTAMPS AUTOMÁTICOS
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- TRIGGERS PARA ACTUALIZACIÓN AUTOMÁTICA
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_payment_transactions_updated_at BEFORE UPDATE ON payment_transactions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- POLÍTICAS RLS (Row Level Security) PARA SEGURIDAD EMPRESARIAL
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_meals ENABLE ROW LEVEL SECURITY;
ALTER TABLE water_intake ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_insights ENABLE ROW LEVEL SECURITY;
ALTER TABLE supplement_recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscription_history ENABLE ROW LEVEL SECURITY;

-- Políticas básicas (permitir todo para desarrollo - personalizar para producción)
CREATE POLICY "Allow all access to users" ON users FOR ALL USING (true);
CREATE POLICY "Allow all access to user_meals" ON user_meals FOR ALL USING (true);
CREATE POLICY "Allow all access to water_intake" ON water_intake FOR ALL USING (true);
CREATE POLICY "Allow all access to user_progress" ON user_progress FOR ALL USING (true);
CREATE POLICY "Allow all access to user_activities" ON user_activities FOR ALL USING (true);
CREATE POLICY "Allow all access to user_goals" ON user_goals FOR ALL USING (true);
CREATE POLICY "Allow all access to user_insights" ON user_insights FOR ALL USING (true);
CREATE POLICY "Allow all access to supplement_recommendations" ON supplement_recommendations FOR ALL USING (true);
CREATE POLICY "Allow all access to payment_transactions" ON payment_transactions FOR ALL USING (true);
CREATE POLICY "Allow all access to subscription_history" ON subscription_history FOR ALL USING (true);

-- DATOS INICIALES EMPRESARIALES

-- Insertar datos de alimentos empresariales
INSERT INTO foods (name, category, calories_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g, is_custom) VALUES
-- Frutas empresariales
('Manzana Premium', 'Frutas', 52, 0.3, 14, 0.2, 2.4, false),
('Plátano Orgánico', 'Frutas', 89, 1.1, 23, 0.3, 2.6, false),
('Naranja Valencia', 'Frutas', 47, 0.9, 12, 0.1, 2.4, false),
('Fresa Hidropónica', 'Frutas', 32, 0.7, 8, 0.3, 2.0, false),
('Aguacate Hass', 'Frutas', 160, 2, 9, 15, 6.7, false),

-- Proteínas empresariales
('Pollo Pechuga Orgánico', 'Proteínas', 165, 31, 0, 3.6, 0, false),
('Huevo Pasteurizado', 'Proteínas', 155, 13, 1.1, 11, 0, false),
('Atún Aleta Amarilla', 'Proteínas', 184, 30, 0, 6.3, 0, false),
('Salmón Atlántico', 'Proteínas', 208, 20, 0, 13, 0, false),
('Proteína Whey Premium', 'Proteínas', 410, 80, 5, 8, 0, false),

-- Carbohidratos empresariales
('Arroz Integral Premium', 'Carbohidratos', 123, 2.6, 23, 0.9, 1.8, false),
('Avena Steel Cut', 'Carbohidratos', 389, 17, 66, 7, 10.6, false),
('Quinoa Real', 'Carbohidratos', 368, 14, 64, 6, 7, false),
('Batata Orgánica', 'Carbohidratos', 86, 1.6, 20, 0.1, 3, false),
('Pan Ezequiel', 'Carbohidratos', 247, 13, 41, 4.2, 7, false),

-- Verduras empresariales
('Brócoli Orgánico', 'Verduras', 34, 2.8, 7, 0.4, 2.6, false),
('Espinaca Baby', 'Verduras', 23, 2.9, 3.6, 0.4, 2.2, false),
('Kale Orgánico', 'Verduras', 49, 4.3, 9, 0.9, 3.6, false),
('Zanahoria Premium', 'Verduras', 41, 0.9, 10, 0.2, 2.8, false),
('Tomate Cherry', 'Verduras', 18, 0.9, 3.9, 0.2, 1.2, false),

-- Grasas saludables empresariales
('Almendras Californianas', 'Grasas', 579, 21, 22, 50, 12.5, false),
('Nueces de Castilla', 'Grasas', 654, 15, 14, 65, 6.7, false),
('Aceite Oliva Extra Virgen', 'Grasas', 884, 0, 0, 100, 0, false),
('Semillas Chía Premium', 'Grasas', 486, 17, 42, 31, 34, false),
('Mantequilla Maní Orgánica', 'Grasas', 588, 25, 20, 50, 6, false);

-- Insertar suplementos empresariales
INSERT INTO supplements (name, category, description, benefits, price, stock_quantity, is_active) VALUES
('Proteína Whey Premium', 'Proteínas', 'Proteína de suero premium con 25g de proteína por porción', ARRAY['Construcción muscular', 'Recuperación rápida', 'Alto valor biológico'], 89900, 50, true),
('Creatina Monohidrato', 'Pre-Entreno', 'Creatina pura para incremento de fuerza y potencia', ARRAY['Mayor fuerza', 'Incremento de masa muscular', 'Mejora rendimiento'], 65000, 75, true),
('BCAA 2:1:1 Premium', 'Aminoácidos', 'Aminoácidos ramificados para anti-catabolismo', ARRAY['Previene catabolismo', 'Mejora recuperación', 'Reduce fatiga muscular'], 72000, 40, true),
('Omega 3 Ultra Pure', 'Vitaminas', 'Aceite de pescado ultra purificado EPA/DHA', ARRAY['Salud cardiovascular', 'Anti-inflamatorio', 'Función cerebral'], 58000, 60, true),
('Multivitamínico Completo', 'Vitaminas', 'Complejo vitamínico y mineral para salud general', ARRAY['Inmunidad', 'Energía', 'Antioxidante'], 45000, 100, true),
('Pre-Entreno Explosivo', 'Pre-Entreno', 'Fórmula pre-entreno con cafeína y citrulina', ARRAY['Energía instantánea', 'Mejor bombeo', 'Mayor concentración'], 78000, 30, true),
('Glutamina L-Premium', 'Aminoácidos', 'L-Glutamina para recuperación y sistema inmune', ARRAY['Recuperación muscular', 'Inmunidad', 'Síntesis proteica'], 55000, 45, true),
('Magnesio Quelado', 'Vitaminas', 'Magnesio altamente biodisponible para músculos', ARRAY['Relajación muscular', 'Mejor sueño', 'Función nerviosa'], 38000, 80, true);

-- Insertar algunos entrenamientos empresariales
INSERT INTO workout_links (title, description, category, difficulty_level, duration_minutes, video_url, equipment_needed, muscle_groups, is_active) VALUES
('Rutina Push Empresarial', 'Entrenamiento completo de empuje para ejecutivos', 'tren-superior', 'intermedio', 45, 'https://www.youtube.com/watch?v=example1', ARRAY['mancuernas', 'banco'], ARRAY['pecho', 'hombros', 'triceps'], true),
('HIIT Cardio Ejecutivo', 'Cardio intenso para profesionales ocupados', 'cardio', 'intermedio', 20, 'https://www.youtube.com/watch?v=example2', ARRAY['sin equipamiento'], ARRAY['cardiovascular'], true),
('Funcional Corporate', 'Ejercicios funcionales para oficinistas', 'funcional', 'principiante', 30, 'https://www.youtube.com/watch?v=example3', ARRAY['bandas elasticas'], ARRAY['core', 'stabilidad'], true);

-- Insertar recursos de mindfulness empresariales
INSERT INTO mindfulness_resources (title, description, category, type, duration_minutes, audio_url, is_active) VALUES
('Meditación Ejecutiva Matutina', 'Meditación de 10 minutos para comenzar el día', 'meditacion', 'meditation', 10, 'https://audio.example.com/meditation1.mp3', true),
('Respiración Anti-Estrés Laboral', 'Técnicas de respiración para reducir estrés en la oficina', 'respiracion', 'breathing', 5, 'https://audio.example.com/breathing1.mp3', true),
('Relajación Progressive Corporativa', 'Relajación muscular progresiva para ejecutivos', 'relajacion', 'relaxation', 15, 'https://audio.example.com/relaxation1.mp3', true);

-- USUARIO ADMIN POR DEFECTO (CAMBIAR CREDENCIALES EN PRODUCCIÓN)
INSERT INTO users (nombre, email, edad, peso, altura, genero, actividad, objetivo, experiencia, subscription_status) VALUES
('Administrador VitalMente', 'admin@vitalmente.com', 35, 75.0, 175, 'masculino', 'moderado', 'mantener', 'avanzado', 'premium');

-- CONFIGURACIÓN COMPLETADA
SELECT 'VitalMente Database Setup Completed Successfully! 🚀' as status;

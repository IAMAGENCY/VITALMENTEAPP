
-- =============================================
-- VITALEMENTE BUSINESS DATABASE SCHEMA
-- Para un modelo de negocio de $50M en 36 meses
-- =============================================

-- Tabla de usuarios (ya existente) - ACTUALIZADA CON TODAS LAS COLUMNAS
CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  nombre TEXT NOT NULL,
  edad INTEGER NOT NULL,
  genero TEXT NOT NULL,
  peso DECIMAL(5,2) NOT NULL,
  altura DECIMAL(5,2) NOT NULL,
  actividad TEXT NOT NULL,
  objetivo TEXT NOT NULL,
  experiencia TEXT NOT NULL,
  condiciones TEXT[],
  preferencias TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  subscription_status TEXT DEFAULT 'free',
  subscription_end_date TIMESTAMPTZ,
  payment_token TEXT,
  last_payment_date TIMESTAMPTZ,
  wompi_customer_id TEXT
);

-- AGREGAR COLUMNAS FALTANTES SI NO EXISTEN
ALTER TABLE users ADD COLUMN IF NOT EXISTS experiencia TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS condiciones TEXT[];
ALTER TABLE users ADD COLUMN IF NOT EXISTS preferencias TEXT[];
ALTER TABLE users ADD COLUMN IF NOT EXISTS subscription_status TEXT DEFAULT 'free';
ALTER TABLE users ADD COLUMN IF NOT EXISTS subscription_end_date TIMESTAMPTZ;
ALTER TABLE users ADD COLUMN IF NOT EXISTS payment_token TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS last_payment_date TIMESTAMPTZ;
ALTER TABLE users ADD COLUMN IF NOT EXISTS wompi_customer_id TEXT;

-- Tabla de alimentos (foods)
CREATE TABLE IF NOT EXISTS foods (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  calories_per_100g DECIMAL(8,2) NOT NULL,
  protein_per_100g DECIMAL(8,2) NOT NULL,
  carbs_per_100g DECIMAL(8,2) NOT NULL,
  fat_per_100g DECIMAL(8,2) NOT NULL,
  fiber_per_100g DECIMAL(8,2) DEFAULT 0,
  is_custom BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de comidas de usuarios
CREATE TABLE IF NOT EXISTS user_meals (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  food_id UUID REFERENCES foods(id) ON DELETE CASCADE,
  meal_type TEXT NOT NULL CHECK (meal_type IN ('desayuno', 'almuerzo', 'cena', 'snack')),
  portion_grams INTEGER NOT NULL,
  date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de consumo de agua
CREATE TABLE IF NOT EXISTS water_intake (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  amount_ml INTEGER NOT NULL,
  date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de progreso físico del usuario
CREATE TABLE IF NOT EXISTS user_progress (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  weight_kg DECIMAL(5,2),
  body_fat_percentage DECIMAL(5,2),
  muscle_mass_kg DECIMAL(5,2),
  measurements JSONB, 
  notes TEXT,
  date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de actividades del usuario (workouts, mindfulness, etc)
CREATE TABLE IF NOT EXISTS user_activities (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  activity_type TEXT NOT NULL, 
  resource_id UUID, 
  resource_type TEXT, 
  duration_minutes INTEGER,
  completion_status TEXT NOT NULL CHECK (completion_status IN ('started', 'completed', 'paused')),
  metadata JSONB, 
  date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de objetivos del usuario
CREATE TABLE IF NOT EXISTS user_goals (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  goal_type TEXT NOT NULL CHECK (goal_type IN ('weight_loss', 'weight_gain', 'muscle_gain', 'strength', 'endurance', 'wellness')),
  target_value DECIMAL(8,2) NOT NULL,
  current_value DECIMAL(8,2) DEFAULT 0,
  target_date DATE NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de insights personalizados para usuarios
CREATE TABLE IF NOT EXISTS user_insights (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  insight_type TEXT NOT NULL CHECK (insight_type IN ('nutrition', 'workout', 'wellness', 'supplement')),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  recommendation TEXT NOT NULL,
  confidence_score DECIMAL(3,2) NOT NULL, 
  data_points JSONB NOT NULL, 
  is_viewed BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de recomendaciones de suplementos inteligentes
CREATE TABLE IF NOT EXISTS supplement_recommendations (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  supplement_id UUID REFERENCES supplements(id),
  reason TEXT NOT NULL,
  confidence_score DECIMAL(3,2) NOT NULL,
  based_on_data JSONB NOT NULL, 
  is_purchased BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de entrenamientos
CREATE TABLE IF NOT EXISTS workout_links (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('cardio', 'funcional', 'tren-superior', 'tren-inferior')),
  url TEXT NOT NULL,
  duration_minutes INTEGER NOT NULL,
  difficulty TEXT NOT NULL CHECK (difficulty IN ('principiante', 'intermedio', 'avanzado')),
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de recursos de mindfulness
CREATE TABLE IF NOT EXISTS mindfulness_resources (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('meditacion', 'relajacion', 'respiracion', 'mentalidad')),
  url TEXT NOT NULL,
  duration_minutes INTEGER NOT NULL,
  difficulty TEXT NOT NULL CHECK (difficulty IN ('principiante', 'intermedio', 'avanzado')),
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de suplementos
CREATE TABLE IF NOT EXISTS supplements (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  stock INTEGER DEFAULT 0,
  benefits TEXT[],
  ingredients TEXT[],
  description TEXT,
  image_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de planes de nutrición
CREATE TABLE IF NOT EXISTS nutrition_plans (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  target_audience TEXT,
  pdf_url TEXT,
  duration_weeks INTEGER,
  calories_per_day INTEGER,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla para contenido premium
CREATE TABLE IF NOT EXISTS premium_content (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  content_type TEXT NOT NULL, 
  title TEXT NOT NULL,
  description TEXT,
  content_data JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Tabla para transacciones de pago
CREATE TABLE IF NOT EXISTS payment_transactions (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  user_id TEXT REFERENCES users(id) ON DELETE CASCADE,
  wompi_transaction_id TEXT UNIQUE,
  amount INTEGER NOT NULL, 
  currency TEXT DEFAULT 'COP',
  status TEXT NOT NULL, 
  payment_method TEXT,
  subscription_months INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Tabla para historial de suscripciones
CREATE TABLE IF NOT EXISTS subscription_history (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  user_id TEXT REFERENCES users(id) ON DELETE CASCADE,
  subscription_type TEXT NOT NULL, 
  start_date TIMESTAMPTZ NOT NULL,
  end_date TIMESTAMPTZ NOT NULL,
  price INTEGER NOT NULL, 
  payment_transaction_id TEXT REFERENCES payment_transactions(id),
  status TEXT DEFAULT 'active', 
  created_at TIMESTAMPTZ DEFAULT now()
);

-- =============================================
-- ÍNDICES PARA OPTIMIZAR PERFORMANCE
-- =============================================

-- Índices para consultas frecuentes
CREATE INDEX IF NOT EXISTS idx_user_meals_user_date ON user_meals(user_id, date);
CREATE INDEX IF NOT EXISTS idx_water_intake_user_date ON water_intake(user_id, date);
CREATE INDEX IF NOT EXISTS idx_user_activities_user_date ON user_activities(user_id, date);
CREATE INDEX IF NOT EXISTS idx_user_progress_user_date ON user_progress(user_id, date);
CREATE INDEX IF NOT EXISTS idx_user_insights_user_viewed ON user_insights(user_id, is_viewed);
CREATE INDEX IF NOT EXISTS idx_supplement_recommendations_user ON supplement_recommendations(user_id, is_purchased);

-- Índices para categorías de recursos
CREATE INDEX IF NOT EXISTS idx_workout_links_category_active ON workout_links(category, is_active);
CREATE INDEX IF NOT EXISTS idx_mindfulness_category_active ON mindfulness_resources(category, is_active);
CREATE INDEX IF NOT EXISTS idx_supplements_active ON supplements(is_active);
CREATE INDEX IF NOT EXISTS idx_nutrition_plans_active ON nutrition_plans(is_active);

-- Índices para búsquedas de alimentos
CREATE INDEX IF NOT EXISTS idx_foods_category ON foods(category);
CREATE INDEX IF NOT EXISTS idx_foods_name ON foods(name);

-- Índices para suscripciones y pagos
CREATE INDEX IF NOT EXISTS idx_users_subscription_status ON users(subscription_status);
CREATE INDEX IF NOT EXISTS idx_users_subscription_end_date ON users(subscription_end_date);
CREATE INDEX IF NOT EXISTS idx_payment_transactions_user_id ON payment_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_payment_transactions_status ON payment_transactions(status);
CREATE INDEX IF NOT EXISTS idx_subscription_history_user_id ON subscription_history(user_id);

-- =============================================
-- FUNCIONES PARA ANALYTICS DE NEGOCIO
-- =============================================

-- Función para calcular score de cumplimiento del usuario
CREATE OR REPLACE FUNCTION calculate_user_compliance_score(user_uuid UUID, days_back INTEGER DEFAULT 7)
RETURNS DECIMAL(5,2)
LANGUAGE plpgsql
AS $$
DECLARE
  activity_score DECIMAL(5,2);
  nutrition_score DECIMAL(5,2);
  overall_score DECIMAL(5,2);
  start_date DATE;
  end_date DATE;
BEGIN
  end_date := CURRENT_DATE;
  start_date := end_date - INTERVAL '1 day' * days_back;
  
  -- Calcular score de actividades (workouts completados)
  SELECT COALESCE(
    (COUNT(*) FILTER (WHERE completion_status = 'completed')::DECIMAL / NULLIF(COUNT(*)::DECIMAL, 0)) * 100,
    0
  ) INTO activity_score
  FROM user_activities
  WHERE user_id = user_uuid
    AND date BETWEEN start_date AND end_date;
  
  -- Calcular score de nutrición (días con registro de comidas)
  SELECT COALESCE(
    (COUNT(DISTINCT date)::DECIMAL / days_back::DECIMAL) * 100,
    0
  ) INTO nutrition_score
  FROM user_meals
  WHERE user_id = user_uuid
    AND date BETWEEN start_date AND end_date;
  
  -- Promedio ponderado
  overall_score := (activity_score * 0.6 + nutrition_score * 0.4);
  
  RETURN ROUND(overall_score, 2);
END;
$$;

-- Función para generar insights automáticos
CREATE OR REPLACE FUNCTION generate_user_insights(user_uuid UUID)
RETURNS VOID
LANGUAGE plpgsql
AS $$
DECLARE
  avg_calories DECIMAL(8,2);
  avg_protein DECIMAL(8,2);
  workout_frequency INTEGER;
  compliance_score DECIMAL(5,2);
BEGIN
  -- Calcular promedios nutricionales de los últimos 7 días
  SELECT 
    AVG((foods.calories_per_100g * user_meals.portion_grams) / 100),
    AVG((foods.protein_per_100g * user_meals.portion_grams) / 100)
  INTO avg_calories, avg_protein
  FROM user_meals
  JOIN foods ON user_meals.food_id = foods.id
  WHERE user_meals.user_id = user_uuid
    AND user_meals.date >= CURRENT_DATE - INTERVAL '7 days';
    
  -- Calcular frecuencia de entrenamientos
  SELECT COUNT(*)
  INTO workout_frequency
  FROM user_activities
  WHERE user_id = user_uuid
    AND activity_type = 'workout'
    AND completion_status = 'completed'
    AND date >= CURRENT_DATE - INTERVAL '7 days';
    
  -- Obtener score de cumplimiento
  SELECT calculate_user_compliance_score(user_uuid) INTO compliance_score;
  
  -- Generar insights basados en los datos
  IF avg_calories < 1200 THEN
    INSERT INTO user_insights (user_id, insight_type, title, description, recommendation, confidence_score, data_points)
    VALUES (
      user_uuid,
      'nutrition',
      'Calorías muy bajas detectadas',
      'Tu promedio de calorías diarias está por debajo de lo recomendado.',
      'Considera agregar más alimentos densos en nutrientes como frutos secos, aguacate o aceite de oliva.',
      0.85,
      jsonb_build_object('avg_calories', avg_calories, 'days_analyzed', 7)
    );
  END IF;
  
  IF avg_protein < 50 THEN
    INSERT INTO user_insights (user_id, insight_type, title, description, recommendation, confidence_score, data_points)
    VALUES (
      user_uuid,
      'nutrition',
      'Proteína insuficiente detectada',
      'Tu consumo promedio de proteína está por debajo del objetivo diario.',
      'Incrementa fuentes de proteína como pollo, pescado, huevos o proteína en polvo.',
      0.90,
      jsonb_build_object('avg_protein', avg_protein, 'target_protein', 80)
    );
  END IF;
  
  IF workout_frequency < 3 THEN
    INSERT INTO user_insights (user_id, insight_type, title, description, recommendation, confidence_score, data_points)
    VALUES (
      user_uuid,
      'workout',
      'Actividad física baja detectada',
      'Has completado menos entrenamientos de los recomendados esta semana.',
      'Intenta realizar al menos 3-4 entrenamientos por semana para mejores resultados.',
      0.80,
      jsonb_build_object('workouts_completed', workout_frequency, 'target_workouts', 4)
    );
  END IF;
  
  IF compliance_score > 80 THEN
    INSERT INTO user_insights (user_id, insight_type, title, description, recommendation, confidence_score, data_points)
    VALUES (
      user_uuid,
      'wellness',
      '¡Excelente progreso!',
      'Tienes un nivel de cumplimiento excepcional con tu plan.',
      'Mantén este ritmo y considera establecer objetivos más desafiantes.',
      0.95,
      jsonb_build_object('compliance_score', compliance_score, 'status', 'excellent')
    );
  END IF;
END;
$$;

-- Función para actualizar el estado de suscripción del usuario
CREATE OR REPLACE FUNCTION update_user_subscription(
  p_user_id TEXT,
  p_transaction_id TEXT,
  p_months INTEGER DEFAULT 1
) RETURNS BOOLEAN AS $$
DECLARE
  current_end_date TIMESTAMPTZ;
  new_end_date TIMESTAMPTZ;
BEGIN
  -- Obtener fecha actual de vencimiento
  SELECT subscription_end_date INTO current_end_date
  FROM users WHERE id = p_user_id;
  
  -- Calcular nueva fecha de vencimiento
  IF current_end_date IS NULL OR current_end_date < now() THEN
    new_end_date := now() + (p_months || ' months')::INTERVAL;
  ELSE
    new_end_date := current_end_date + (p_months || ' months')::INTERVAL;
  END IF;
  
  -- Actualizar usuario
  UPDATE users SET 
    subscription_status = 'premium',
    subscription_end_date = new_end_date,
    last_payment_date = now()
  WHERE id = p_user_id;
  
  -- Crear historial de suscripción
  INSERT INTO subscription_history (
    user_id,
    subscription_type,
    start_date,
    end_date,
    price,
    payment_transaction_id
  ) VALUES (
    p_user_id,
    'premium',
    COALESCE(current_end_date, now()),
    new_end_date,
    4500000, 
    p_transaction_id
  );
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Función para revisar suscripciones expiradas
CREATE OR REPLACE FUNCTION check_expired_subscriptions() RETURNS INTEGER AS $$
DECLARE
  expired_count INTEGER;
BEGIN
  -- Actualizar usuarios con suscripciones vencidas
  UPDATE users SET subscription_status = 'expired'
  WHERE subscription_status = 'premium' 
  AND subscription_end_date < now();
  
  GET DIAGNOSTICS expired_count = ROW_COUNT;
  
  -- Actualizar historial
  UPDATE subscription_history SET status = 'expired'
  WHERE end_date < now() AND status = 'active';
  
  RETURN expired_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Función para obtener estadísticas de suscripciones
CREATE OR REPLACE FUNCTION get_subscription_stats() RETURNS JSON AS $$
DECLARE
  result JSON;
BEGIN
  SELECT json_build_object(
    'total_premium_users', (
      SELECT COUNT(*) FROM users 
      WHERE subscription_status = 'premium' 
      AND subscription_end_date > now()
    ),
    'expired_users', (
      SELECT COUNT(*) FROM users 
      WHERE subscription_status = 'expired'
    ),
    'total_revenue', (
      SELECT COALESCE(SUM(amount), 0) FROM payment_transactions 
      WHERE status = 'approved'
    ),
    'monthly_revenue', (
      SELECT COALESCE(SUM(amount), 0) FROM payment_transactions 
      WHERE status = 'approved' 
      AND created_at >= date_trunc('month', now())
    ),
    'pending_renewals', (
      SELECT COUNT(*) FROM users 
      WHERE subscription_status = 'premium' 
      AND subscription_end_date BETWEEN now() AND now() + INTERVAL '3 days'
    )
  ) INTO result;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para auto-actualizar updated_at en transactions
CREATE OR REPLACE FUNCTION update_transaction_timestamp() RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_payment_transactions_timestamp
  BEFORE UPDATE ON payment_transactions
  FOR EACH ROW EXECUTE FUNCTION update_transaction_timestamp();

-- =============================================
-- TRIGGERS PARA AUTOMATIZACIÓN
-- =============================================

-- Trigger para generar insights automáticamente cuando se agregan comidas
CREATE OR REPLACE FUNCTION trigger_generate_insights()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  -- Solo generar insights una vez por día por usuario
  IF NOT EXISTS (
    SELECT 1 FROM user_insights
    WHERE user_id = NEW.user_id
      AND DATE(created_at) = CURRENT_DATE
      AND insight_type IN ('nutrition', 'workout')
  ) THEN
    PERFORM generate_user_insights(NEW.user_id);
  END IF;
  
  RETURN NEW;
END;
$$;

-- Aplicar trigger a la tabla user_meals
DROP TRIGGER IF EXISTS auto_generate_insights_meals ON user_meals;
CREATE TRIGGER auto_generate_insights_meals
  AFTER INSERT ON user_meals
  FOR EACH ROW
  EXECUTE FUNCTION trigger_generate_insights();

-- Aplicar trigger a la tabla user_activities
DROP TRIGGER IF EXISTS auto_generate_insights_activities ON user_activities;
CREATE TRIGGER auto_generate_insights_activities
  AFTER INSERT ON user_activities
  FOR EACH ROW
  EXECUTE FUNCTION trigger_generate_insights();

-- =============================================
-- POLÍTICAS RLS (ROW LEVEL SECURITY)
-- =============================================

-- Habilitar RLS en tablas de usuarios
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_meals ENABLE ROW LEVEL SECURITY;
ALTER TABLE water_intake ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_insights ENABLE ROW LEVEL SECURITY;
ALTER TABLE supplement_recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE premium_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscription_history ENABLE ROW LEVEL SECURITY;

-- Políticas para permitir acceso a todos los usuarios (temporal - en producción se debe configurar auth)
CREATE POLICY "Enable all access for users" ON users FOR ALL USING (true);
CREATE POLICY "Enable all access for user_meals" ON user_meals FOR ALL USING (true);
CREATE POLICY "Enable all access for water_intake" ON water_intake FOR ALL USING (true);
CREATE POLICY "Enable all access for user_progress" ON user_progress FOR ALL USING (true);
CREATE POLICY "Enable all access for user_activities" ON user_activities FOR ALL USING (true);
CREATE POLICY "Enable all access for user_goals" ON user_goals FOR ALL USING (true);
CREATE POLICY "Enable all access for user_insights" ON user_insights FOR ALL USING (true);
CREATE POLICY "Enable all access for supplement_recommendations" ON supplement_recommendations FOR ALL USING (true);
CREATE POLICY "Enable all access for premium_content" ON premium_content FOR ALL USING (true);
CREATE POLICY "Enable all access for payment_transactions" ON payment_transactions FOR ALL USING (true);
CREATE POLICY "Enable all access for subscription_history" ON subscription_history FOR ALL USING (true);

-- Política de acceso para contenido premium
CREATE POLICY "premium_content_access" ON premium_content
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM users 
    WHERE id = auth.uid()
    AND subscription_status = 'premium' 
    AND subscription_end_date > now()
  )
);

-- Política para ver propias transacciones
CREATE POLICY "user_transactions" ON payment_transactions
FOR SELECT USING (user_id = auth.uid()::text);

CREATE POLICY "user_subscription_history" ON subscription_history
FOR SELECT USING (user_id = auth.uid()::text);

-- Políticas públicas para recursos (sin restricciones)
CREATE POLICY "Public access for foods" ON foods FOR ALL USING (true);
CREATE POLICY "Public access for workout_links" ON workout_links FOR ALL USING (true);
CREATE POLICY "Public access for mindfulness_resources" ON mindfulness_resources FOR ALL USING (true);
CREATE POLICY "Public access for supplements" ON supplements FOR ALL USING (true);
CREATE POLICY "Public access for nutrition_plans" ON nutrition_plans FOR ALL USING (true);

-- =============================================
-- DATOS INICIALES PARA RECURSOS ADMINISTRABLES
-- =============================================

-- Insertar entrenamientos iniciales
INSERT INTO workout_links (title, category, url, duration_minutes, difficulty, description, is_active) VALUES
-- CARDIO (6 entrenamientos)
('HIIT Cardio Quema Grasa', 'cardio', 'https://www.youtube.com/watch?v=ml6cT4AZdqI', 20, 'intermedio', 'Entrenamiento HIIT intensivo para quemar grasa rápidamente', true),
('Cardio Danza Divertida', 'cardio', 'https://www.youtube.com/watch?v=gC_L9qAHVJ8', 30, 'principiante', 'Rutina de baile divertida para quemar calorías', true),
('Playlist Cardio Energética', 'cardio', 'https://open.spotify.com/playlist/37i9dQZF1DX76Wlfdnj7AP', 45, 'intermedio', 'Lista de reproducción perfecta para entrenar cardio', true),
('Cardio TABATA Extremo', 'cardio', 'https://www.youtube.com/watch?v=20Khp6QBcGM', 15, 'avanzado', 'Protocolo TABATA de alta intensidad', true),
('Cardio en Casa Sin Equipos', 'cardio', 'https://www.youtube.com/watch?v=UBMk30rjy0o', 25, 'principiante', 'Cardio efectivo desde casa sin necesidad de equipos', true),
('Cardio para Principiantes', 'cardio', 'https://www.youtube.com/watch?v=CB1EuITlz-8', 20, 'principiante', 'Introducción suave al entrenamiento cardiovascular', true),

-- FUNCIONAL (6 entrenamientos)
('Entrenamiento Funcional Completo', 'funcional', 'https://www.youtube.com/watch?v=ixkQaZXVQjs', 35, 'intermedio', 'Rutina funcional para todo el cuerpo', true),
('CrossFit WOD del Día', 'funcional', 'https://www.youtube.com/watch?v=mlE9OjswCBY', 40, 'avanzado', 'Workout of the Day estilo CrossFit', true),
('Funcional con Kettlebells', 'funcional', 'https://www.youtube.com/watch?v=cKx8xE8jJZs', 30, 'intermedio', 'Entrenamiento funcional utilizando pesas rusas', true),
('Playlist Funcional Motivacional', 'funcional', 'https://open.spotify.com/playlist/37i9dQZF1DX32NsLKyzScr', 60, 'intermedio', 'Música motivacional para entrenamientos funcionales', true),
('Funcional para Deportistas', 'funcional', 'https://www.youtube.com/watch?v=R216xJ15LJA', 45, 'avanzado', 'Entrenamiento específico para atletas', true),
('Movimientos Básicos Funcionales', 'funcional', 'https://www.youtube.com/watch?v=SyD5uQP4MoU', 25, 'principiante', 'Fundamentos del entrenamiento funcional', true),

-- TREN SUPERIOR (6 entrenamientos)
('Pecho y Tríceps Masa Muscular', 'tren-superior', 'https://www.youtube.com/watch?v=8iPEQQJayPg', 50, 'intermedio', 'Rutina intensa para desarrollo de pecho y tríceps', true),
('Espalda y Bíceps Definición', 'tren-superior', 'https://www.youtube.com/watch?v=eE7VdqJGuVw', 45, 'intermedio', 'Entrena espalda y bíceps para mayor definición', true),
('Hombros 3D - Desarrollo Completo', 'tren-superior', 'https://www.youtube.com/watch?v=q5zma-GQ3u0', 40, 'avanzado', 'Rutina completa para hombros voluminosos', true),
('Tren Superior en Casa', 'tren-superior', 'https://www.youtube.com/watch?v=IODxDxX7oi4', 35, 'principiante', 'Entrena tren superior desde casa sin equipos', true),
('Playlist Rock para Entrenar', 'tren-superior', 'https://open.spotify.com/playlist/37i9dQZF1DWWJOmJ7nRx0C', 60, 'intermedio', 'Rock potente para entrenamientos de fuerza', true),
('Upper Body para Principiantes', 'tren-superior', 'https://www.youtube.com/watch?v=ALIx8i-jRbI', 25, 'principiante', 'Introducción al entrenamiento de tren superior', true),

-- TREN INFERIOR (6 entrenamientos)
('Piernas y Glúteos Extremo', 'tren-inferior', 'https://www.youtube.com/watch?v=kGXVg2JtdLo', 55, 'avanzado', 'Rutina extrema para piernas y glúteos fuertes', true),
('Sentadillas Perfectas - Técnica', 'tren-inferior', 'https://www.youtube.com/watch?v=Dy28eq2PjcM', 20, 'principiante', 'Aprende la técnica perfecta de sentadillas', true),
('Cuádriceps y Femorales Balance', 'tren-inferior', 'https://www.youtube.com/watch?v=6A2V9Bu80J4', 40, 'intermedio', 'Equilibrio perfecto entre cuádriceps y femorales', true),
('Glúteo Perfecto en Casa', 'tren-inferior', 'https://www.youtube.com/watch?v=B296mZDhrP4', 30, 'principiante', 'Rutina específica para glúteos desde casa', true),
('Playlist Latina Motivacional', 'tren-inferior', 'https://open.spotify.com/playlist/37i9dQZF1DX10zKzsJ2jva', 50, 'intermedio', 'Ritmos latinos para entrenar con energía', true),
('Pantorrillas de Acero', 'tren-inferior', 'https://www.youtube.com/watch?v=gwLzBJYoWlI', 25, 'intermedio', 'Desarrollo específico de músculos de pantorrillas', true)

ON CONFLICT DO NOTHING;

-- Insertar recursos de mindfulness iniciales
INSERT INTO mindfulness_resources (title, category, url, duration_minutes, difficulty, description, is_active) VALUES
-- MEDITACIÓN (6 recursos)
('Meditación Guiada para Principiantes', 'meditacion', 'https://www.youtube.com/watch?v=ZToicYcHIOU', 10, 'principiante', 'Introducción suave a la práctica de meditación', true),
('Meditación Mindfulness Avanzada', 'meditacion', 'https://www.youtube.com/watch?v=6p_yaNFSYao', 25, 'avanzado', 'Práctica profunda de mindfulness y consciencia plena', true),
('Meditación Body Scan Completa', 'meditacion', 'https://www.youtube.com/watch?v=15q-N-_kkrU', 20, 'intermedio', 'Escaneo corporal para relajación profunda', true),
('Meditación Matutina Energizante', 'meditacion', 'https://www.youtube.com/watch?v=Jyy0ra2WcQQ', 15, 'principiante', 'Perfecta para comenzar el día con claridad mental', true),
('Meditación Zen Silenciosa', 'meditacion', 'https://www.youtube.com/watch?v=nOJTbWC-ULc', 30, 'avanzado', 'Práctica zen tradicional en silencio', true),
('Meditación para Dormir', 'meditacion', 'https://www.youtube.com/watch?v=1vx8iUvfyCY', 35, 'principiante', 'Meditación relajante para conciliar el sueño', true),

-- RELAJACIÓN (6 recursos)
('Relajación Profunda Muscular', 'relajacion', 'https://www.youtube.com/watch?v=1nJJ0DaJXzg', 15, 'principiante', 'Técnicas de relajación muscular progresiva', true),
('Música Relajante para Dormir', 'relajacion', 'https://open.spotify.com/playlist/37i9dQZF1DWZd79rJ6a7lp', 60, 'principiante', 'Playlist perfecta para relajarse y dormir', true),
('Sonidos de la Naturaleza', 'relajacion', 'https://open.spotify.com/playlist/37i9dQZF1DWUCfOWCgBk2v', 120, 'principiante', 'Sonidos naturales para relajación profunda', true),
('Relajación con Visualización', 'relajacion', 'https://www.youtube.com/watch?v=CcFWOyL7EzA', 18, 'intermedio', 'Técnicas de visualización para calmar la mente', true),
('Baño de Sonido Tibetano', 'relajacion', 'https://www.youtube.com/watch?v=b1s3YgxCcpM', 40, 'intermedio', 'Cuencos tibetanos para sanación y relajación', true),
('Relajación Autógena', 'relajacion', 'https://www.youtube.com/watch?v=dq7nRYpaCW8', 22, 'avanzado', 'Técnica de autorelajación profunda', true),

-- RESPIRACIÓN (6 recursos)
('Respiración 4-7-8 para Ansiedad', 'respiracion', 'https://www.youtube.com/watch?v=YRPh_GaiL8s', 8, 'principiante', 'Técnica simple para reducir ansiedad instantáneamente', true),
('Respiración Box para Focus', 'respiracion', 'https://www.youtube.com/watch?v=tEmt1Znux58', 12, 'intermedio', 'Respiración cuadrada para mejorar concentración', true),
('Pranayama Básico', 'respiracion', 'https://www.youtube.com/watch?v=nM-uyWXgMxo', 18, 'intermedio', 'Técnicas de respiración del yoga tradicional', true),
('Respiración de Fuego', 'respiracion', 'https://www.youtube.com/watch?v=FU1VWvl2gCg', 10, 'avanzado', 'Técnica energizante de respiración rápida', true),
('Método Wim Hof Básico', 'respiracion', 'https://www.youtube.com/watch?v=tybOi4hjZFQ', 15, 'avanzado', 'Técnica de respiración para resistencia al frío', true),
('Respiración para Dormir Mejor', 'respiracion', 'https://www.youtube.com/watch?v=B7uMqgBfTKE', 14, 'principiante', 'Técnicas respiratorias para mejor descanso', true),

-- MENTALIDAD (6 recursos)
('Afirmaciones Positivas Diarias', 'mentalidad', 'https://www.youtube.com/watch?v=gVJpGg7hSQo', 15, 'principiante', 'Programa tu mente para el éxito con afirmaciones', true),
('Meditación de Gratitud', 'mentalidad', 'https://www.youtube.com/watch?v=k8TwI0H8Ykg', 12, 'principiante', 'Cultiva la gratitud y abundancia mental', true),
('Mindfulness en Movimiento', 'mentalidad', 'https://www.youtube.com/watch?v=T32mChUyxD8', 20, 'intermedio', 'Práctica de consciencia plena en actividad', true),
('Visualización de Objetivos', 'mentalidad', 'https://www.youtube.com/watch?v=fgbL3_u2U6o', 16, 'intermedio', 'Técnica de visualización para lograr metas', true),
('Meditación Loving-Kindness', 'mentalidad', 'https://www.youtube.com/watch?v=sz7cpV7ERsM', 18, 'avanzado', 'Desarrolla compasión hacia ti y otros', true),
('Mentalidad de Abundancia', 'mentalidad', 'https://www.youtube.com/watch?v=woG5gn8LJ_4', 22, 'intermedio', 'Cambia patrones mentales limitantes', true)

ON CONFLICT DO NOTHING;

-- Insertar suplementos iniciales
INSERT INTO supplements (name, category, price, stock, benefits, ingredients, description, is_active) VALUES
('Proteína Whey Premium', 'Proteínas', 89900, 50, 
 ARRAY['Desarrollo muscular', 'Recuperación post-entreno', 'Saciedad prolongada'], 
 ARRAY['Whey Protein Concentrate', 'Whey Protein Isolate', 'Saborizante natural', 'Stevia'], 
 'Proteína de suero de alta calidad con perfil completo de aminoácidos esenciales. Ideal para desarrollo muscular y recuperación.', true),

 ('Multivitamínico Completo', 'Vitaminas', 45500, 75, 
 ARRAY['Energía diaria', 'Sistema inmune', 'Metabolismo optimizado'], 
 ARRAY['Vitamina A', 'Complejo B', 'Vitamina C', 'Vitamina D3', 'Zinc', 'Magnesio'], 
 'Fórmula completa de vitaminas y minerales esenciales para el bienestar diario y rendimiento óptimo.', true),

 ('Pre-Entreno Explosivo', 'Pre-Entreno', 67800, 40, 
 ARRAY['Energía explosiva', 'Focus mental', 'Resistencia aumentada'], 
 ARRAY['Cafeína', 'Beta-Alanina', 'Creatina', 'Taurina', 'L-Citrulina'], 
 'Fórmula pre-entreno diseñada para maximizar energía, focus y rendimiento durante el entrenamiento.', true),

 ('Omega 3 Premium', 'Grasas Saludables', 38900, 60, 
 ARRAY['Salud cardiovascular', 'Función cerebral', 'Reducción inflamación'], 
 ARRAY['EPA (Ácido Eicosapentaenoico)', 'DHA (Ácido Docosahexaenoico)', 'Vitamina E'], 
 'Ácidos grasos esenciales de alta concentración para salud cardiovascular y función cognitiva óptima.', true),

 ('Quemador de Grasa Natural', 'Pérdida de Peso', 72300, 35, 
 ARRAY['Termogénesis', 'Metabolismo acelerado', 'Control apetito'], 
 ARRAY['Extracto de té verde', 'Cafeína natural', 'L-Carnitina', 'Garcinia Cambogia'], 
 'Fórmula natural que acelera el metabolismo y ayuda en el proceso de pérdida de grasa corporal.', true),

 ('Creatina Monohidrato', 'Fuerza', 34900, 80, 
 ARRAY['Fuerza explosiva', 'Volumen muscular', 'Recuperación rápida'], 
 ARRAY['Creatina Monohidrato 100% pura'], 
 'Creatina pura micronizada para aumentar fuerza, potencia y volumen muscular de manera natural.', true),

 ('BCAA 2:1:1', 'Aminoácidos', 56700, 45, 
 ARRAY['Recuperación muscular', 'Prevención catabolismo', 'Energía intra-entreno'], 
 ARRAY['L-Leucina', 'L-Isoleucina', 'L-Valina', 'Electrolitos'], 
 'Aminoácidos de cadena ramificada en ratio óptimo para máxima recuperación y preservación muscular.', true),

 ('Colágeno Hidrolizado', 'Bienestar', 48900, 55, 
 ARRAY['Salud articular', 'Piel saludable', 'Fortalecimiento huesos'], 
 ARRAY['Péptidos de colágeno tipo I y III', 'Vitamina C', 'Biotina'], 
 'Colágeno de alta biodisponibilidad para mantener salud articular, piel radiante y huesos fuertes.', true)

ON CONFLICT DO NOTHING;

-- Insertar planes de nutrición iniciales
INSERT INTO nutrition_plans (title, description, target_audience, pdf_url, duration_weeks, calories_per_day, is_active) VALUES
('Plan Quema Grasa Acelerada', 'Programa nutricional diseñado para acelerar la pérdida de grasa corporal manteniendo masa muscular', 'Personas que buscan perder peso de forma efectiva', 'https://readdy.ai/api/search-image?query=Professional%20nutrition%20plan%20document%20for%20fat%20loss%20with%20meal%20plans%20and%20calorie%20counting%2C%20clean%20layout%2C%20healthy%20foods%2C%20fitness%20magazine%20style%2C%20high%20quality%20PDF%20design&width=400&height=600&seq=plan1&orientation=portrait', 8, 1400, true),

('Plan Ganancia Muscular', 'Protocolo nutricional alto en proteínas para maximizar el desarrollo de masa muscular magra', 'Atletas y personas enfocadas en ganar músculo', 'https://readdy.ai/api/search-image?query=Professional%20muscle%20building%20nutrition%20guide%20with%20high%20protein%20meal%20plans%2C%20supplement%20recommendations%2C%20bodybuilding%20nutrition%20PDF%20design%2C%20detailed%20macros&width=400&height=600&seq=plan2&orientation=portrait', 12, 2200, true),

('Plan Mediterráneo Saludable', 'Alimentación basada en la dieta mediterránea tradicional rica en grasas saludables y antioxidantes', 'Personas que buscan un estilo de vida saludable y longevidad', 'https://readdy.ai/api/search-image?query=Mediterranean%20diet%20plan%20document%20with%20olive%20oil%2C%20fish%2C%20vegetables%2C%20fruits%2C%20whole%20grains%2C%20elegant%20healthy%20lifestyle%20PDF%20design%2C%20nutritionist%20approved&width=400&height=600&seq=plan3&orientation=portrait', 16, 1800, true),

('Plan Deportista Elite', 'Nutrición especializada para atletas de alto rendimiento con periodización nutricional', 'Deportistas de élite y competidores', 'https://readdy.ai/api/search-image?query=Elite%20athlete%20nutrition%20plan%20with%20performance%20optimization%2C%20pre%20and%20post%20workout%20meals%2C%20sports%20nutrition%20guide%2C%20professional%20athletic%20PDF%20design&width=400&height=600&seq=plan4&orientation=portrait', 20, 2800, true),

('Plan Detox Natural', 'Programa de desintoxicación natural con alimentos depurativos y alcalinizantes', 'Personas que buscan depurar el organismo', 'https://readdy.ai/api/search-image?query=Natural%20detox%20nutrition%20plan%20with%20green%20smoothies%2C%20organic%20vegetables%2C%20cleansing%20foods%2C%20wellness%20program%20PDF%2C%20spa-like%20design%20aesthetic&width=400&height=600&seq=plan5&orientation=portrait', 4, 1300, true),

('Plan Mantenimiento Equilibrado', 'Plan balanceado para mantener peso ideal y hábitos saludables a largo plazo', 'Personas en mantenimiento de peso', 'https://readdy.ai/api/search-image?query=Balanced%20maintenance%20nutrition%20plan%20with%20variety%20of%20healthy%20foods%2C%20sustainable%20eating%20habits%2C%20wellness%20lifestyle%20PDF%2C%20professional%20nutritionist%20design&width=400&height=600&seq=plan6&orientation=portrait', 24, 1900, true)

ON CONFLICT DO NOTHING;

-- Insertar contenido premium
INSERT INTO premium_content (content_type, title, description, content_data) VALUES
('plan', 'Plan Quema Grasa IA Personalizado', 'Plan nutricional generado por IA basado en tu metabolismo', '{"calories": "variable", "duration": "12_weeks", "ai_generated": true}'),
('diagnostic', 'Diagnóstico Suplementación Avanzada', 'Análisis completo de déficits nutricionales con IA', '{"analysis_depth": "advanced", "supplement_recommendations": true}'),
('insight', 'Dashboard Métricas Avanzadas', 'Analytics profundo con predicciones de progreso', '{"metrics": ["body_composition", "metabolic_rate", "performance_prediction"]}'),
('pdf', 'Guía Completa Biohacking Nutricional', 'Manual premium de optimización metabólica', '{"pages": 87, "download_url": "premium/biohacking_guide.pdf"}')

ON CONFLICT DO NOTHING;

-- =============================================
-- CONFIGURACIÓN FINAL
-- =============================================

-- Actualizar timestamps
UPDATE users SET updated_at = NOW();
UPDATE workout_links SET created_at = NOW();
UPDATE mindfulness_resources SET created_at = NOW();
UPDATE supplements SET created_at = NOW();
UPDATE nutrition_plans SET created_at = NOW();

COMMIT;

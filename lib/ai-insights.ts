import { dbOperations } from './supabase';

export interface InsightResult {
  title: string;
  description: string;
  recommendation: string;
  confidence_score: number;
  type: 'nutrition' | 'hydration' | 'balance' | 'warning' | 'achievement';
}

export interface AnalysisResult {
  total_insights: number;
  insights: InsightResult[];
  status: 'success' | 'error';
  message?: string;
}

export class AIInsightsEngine {
  private static readonly CALORIE_GOALS = {
    sedentario: { masculino: 2000, femenino: 1600 },
    ligero: { masculino: 2200, femenino: 1800 },
    moderado: { masculino: 2400, femenino: 2000 },
    intenso: { masculino: 2600, femenino: 2200 },
    muy_intenso: { masculino: 2800, femenino: 2400 }
  };

  private static readonly MACRO_RATIOS = {
    protein: { min: 0.15, max: 0.35 },
    carbs: { min: 0.45, max: 0.65 },
    fat: { min: 0.20, max: 0.35 }
  };

  private static readonly WATER_GOAL = 2000; // ml por día

  static async generateAllInsights(userId: string): Promise<AnalysisResult> {
    try {
      const insights: InsightResult[] = [];
      
      // Obtener datos del usuario
      const { data: userData } = await dbOperations.getUserById(userId);
      const today = new Date().toISOString().split('T')[0];
      
      // Obtener datos de alimentación del día
      const { data: userMeals } = await dbOperations.getUserMeals(userId, today);
      
      // Obtener datos de hidratación
      const { data: waterData } = await dbOperations.getWaterIntake(userId, today);
      const waterIntake = waterData?.[0]?.total_amount || 0;

      // Calcular totales nutricionales del día
      const dailyTotals = this.calculateDailyTotals(userMeals || []);

      // Generar insights nutricionales
      const nutritionInsights = this.analyzeNutrition(dailyTotals, userData);
      insights.push(...nutritionInsights);

      // Generar insights de hidratación
      const hydrationInsights = this.analyzeHydration(waterIntake);
      insights.push(...hydrationInsights);

      // Generar insights de balance nutricional
      const balanceInsights = this.analyzeNutritionalBalance(dailyTotals);
      insights.push(...balanceInsights);

      // Generar insights de logros
      const achievementInsights = this.analyzeAchievements(dailyTotals, waterIntake, userData);
      insights.push(...achievementInsights);

      // Guardar insights en la base de datos
      const savedInsights = await this.saveInsights(userId, insights);

      return {
        total_insights: insights.length,
        insights: savedInsights,
        status: 'success'
      };

    } catch (error) {
      console.error('Error generating insights:', error);
      return {
        total_insights: 0,
        insights: [],
        status: 'error',
        message: 'Error generando análisis de IA'
      };
    }
  }

  private static calculateDailyTotals(meals: any[]) {
    return meals.reduce((totals, meal) => {
      if (meal.foods) {
        const factor = meal.portion_grams / 100;
        totals.calories += Math.round(meal.foods.calories_per_100g * factor);
        totals.protein += Math.round(meal.foods.protein_per_100g * factor * 10) / 10;
        totals.carbs += Math.round(meal.foods.carbs_per_100g * factor * 10) / 10;
        totals.fat += Math.round(meal.foods.fat_per_100g * factor * 10) / 10;
      }
      return totals;
    }, { calories: 0, protein: 0, carbs: 0, fat: 0 });
  }

  private static analyzeNutrition(dailyTotals: any, userData: any): InsightResult[] {
    const insights: InsightResult[] = [];
    
    if (!userData) return insights;

    const calorieGoal = this.getCalorieGoal(userData);
    const caloriePercentage = (dailyTotals.calories / calorieGoal) * 100;

    // Análisis de calorías
    if (caloriePercentage < 70) {
      insights.push({
        title: 'Ingesta calórica baja',
        description: `Has consumido ${dailyTotals.calories} calorías de ${calorieGoal} recomendadas (${Math.round(caloriePercentage)}%)`,
        recommendation: 'Considera agregar un snack saludable o aumentar las porciones en tu próxima comida',
        confidence_score: 0.9,
        type: 'warning'
      });
    } else if (caloriePercentage > 120) {
      insights.push({
        title: 'Ingesta calórica alta',
        description: `Has excedido tu meta calórica diaria en ${dailyTotals.calories - calorieGoal} calorías`,
        recommendation: 'Considera reducir las porciones o aumentar tu actividad física',
        confidence_score: 0.85,
        type: 'warning'
      });
    } else if (caloriePercentage >= 90 && caloriePercentage <= 110) {
      insights.push({
        title: 'Excelente control calórico',
        description: `Estás muy cerca de tu meta calórica diaria (${Math.round(caloriePercentage)}%)`,
        recommendation: 'Mantén este equilibrio para alcanzar tus objetivos',
        confidence_score: 0.95,
        type: 'achievement'
      });
    }

    return insights;
  }

  private static analyzeHydration(waterIntake: number): InsightResult[] {
    const insights: InsightResult[] = [];
    const hydrationPercentage = (waterIntake / this.WATER_GOAL) * 100;

    if (hydrationPercentage < 50) {
      insights.push({
        title: 'Hidratación insuficiente',
        description: `Solo has consumido ${waterIntake}ml de ${this.WATER_GOAL}ml recomendados`,
        recommendation: 'Bebe más agua durante el día. Intenta tomar un vaso cada hora',
        confidence_score: 0.9,
        type: 'warning'
      });
    } else if (hydrationPercentage >= 90) {
      insights.push({
        title: '¡Excelente hidratación!',
        description: `Has alcanzado ${Math.round(hydrationPercentage)}% de tu meta de hidratación`,
        recommendation: 'Mantén este buen hábito de hidratación',
        confidence_score: 0.95,
        type: 'achievement'
      });
    }

    return insights;
  }

  private static analyzeNutritionalBalance(dailyTotals: any): InsightResult[] {
    const insights: InsightResult[] = [];
    
    if (dailyTotals.calories === 0) return insights;

    const proteinRatio = (dailyTotals.protein * 4) / dailyTotals.calories;
    const carbsRatio = (dailyTotals.carbs * 4) / dailyTotals.calories;
    const fatRatio = (dailyTotals.fat * 9) / dailyTotals.calories;

    // Análisis de proteína
    if (proteinRatio < this.MACRO_RATIOS.protein.min) {
      insights.push({
        title: 'Proteína insuficiente',
        description: `Tu ingesta de proteína es baja (${Math.round(proteinRatio * 100)}% de calorías)`,
        recommendation: 'Incluye más fuentes de proteína como pollo, pescado, huevos o legumbres',
        confidence_score: 0.8,
        type: 'nutrition'
      });
    }

    // Análisis de carbohidratos
    if (carbsRatio > this.MACRO_RATIOS.carbs.max) {
      insights.push({
        title: 'Alto consumo de carbohidratos',
        description: `Los carbohidratos representan ${Math.round(carbsRatio * 100)}% de tus calorías`,
        recommendation: 'Considera reducir carbohidratos refinados y aumentar proteínas y grasas saludables',
        confidence_score: 0.75,
        type: 'balance'
      });
    }

    return insights;
  }

  private static analyzeAchievements(dailyTotals: any, waterIntake: number, userData: any): InsightResult[] {
    const insights: InsightResult[] = [];

    // Logro de balance general
    if (dailyTotals.calories > 500 && waterIntake > 1500) {
      const calorieGoal = this.getCalorieGoal(userData);
      const caloriePercentage = (dailyTotals.calories / calorieGoal) * 100;
      const hydrationPercentage = (waterIntake / this.WATER_GOAL) * 100;

      if (caloriePercentage >= 85 && caloriePercentage <= 115 && hydrationPercentage >= 80) {
        insights.push({
          title: '¡Día equilibrado!',
          description: 'Has mantenido un buen balance entre alimentación y hidratación',
          recommendation: 'Continúa con estos hábitos saludables para alcanzar tus metas',
          confidence_score: 0.9,
          type: 'achievement'
        });
      }
    }

    return insights;
  }

  private static getCalorieGoal(userData: any): number {
    const nivel = userData.nivel_actividad || 'moderado';
    const genero = userData.genero || 'masculino';
    
    return this.CALORIE_GOALS[nivel as keyof typeof this.CALORIE_GOALS]?.[genero as keyof typeof this.CALORIE_GOALS.moderado] || 2000;
  }

  private static async saveInsights(userId: string, insights: InsightResult[]): Promise<InsightResult[]> {
    const savedInsights: InsightResult[] = [];

    for (const insight of insights) {
      try {
        const { data } = await dbOperations.createUserInsight({
          user_id: userId,
          title: insight.title,
          description: insight.description,
          recommendation: insight.recommendation,
          confidence_score: insight.confidence_score,
          type: insight.type,
          is_viewed: false
        });

        if (data) {
          savedInsights.push({
            ...insight,
            id: data.id
          } as any);
        }
      } catch (error) {
        console.error('Error saving insight:', error);
        // Si falla el guardado, aún devolvemos el insight
        savedInsights.push(insight);
      }
    }

    return savedInsights;
  }

  // Método para generar insights basados en tendencias (futuro)
  static async generateTrendInsights(userId: string, days: number = 7): Promise<AnalysisResult> {
    // Implementación futura para análisis de tendencias
    return {
      total_insights: 0,
      insights: [],
      status: 'success',
      message: 'Análisis de tendencias no implementado aún'
    };
  }

  // Método para generar recomendaciones personalizadas
  static async generatePersonalizedRecommendations(userId: string): Promise<InsightResult[]> {
    const insights: InsightResult[] = [];
    
    try {
      const { data: userData } = await dbOperations.getUserById(userId);
      
      if (userData?.objetivo) {
        const objective = userData.objetivo;
        
        if (objective === 'perder_peso') {
          insights.push({
            title: 'Enfoque en pérdida de peso',
            description: 'Tu objetivo es perder peso de manera saludable',
            recommendation: 'Mantén un déficit calórico moderado (300-500 cal) y combina con ejercicio regular',
            confidence_score: 0.85,
            type: 'nutrition'
          });
        } else if (objective === 'ganar_musculo') {
          insights.push({
            title: 'Enfoque en ganancia muscular',
            description: 'Tu objetivo es ganar masa muscular',
            recommendation: 'Asegúrate de consumir 1.6-2.2g de proteína por kg de peso corporal',
            confidence_score: 0.85,
            type: 'nutrition'
          });
        }
      }
    } catch (error) {
      console.error('Error generating personalized recommendations:', error);
    }

    return insights;
  }
}
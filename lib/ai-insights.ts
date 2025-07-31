import { dbOperations } from './supabase';

// Sistema de IA para generar insights personalizados
export class AIInsightsEngine {
  
  // Generar insights nutricionales basados en patrones
  static async generateNutritionInsights(userId: string) {
    try {
      // Obtener datos nutricionales de los últimos 30 días
      const { data: nutritionData } = await dbOperations.getUserNutritionTrends(userId, 30);
      
      if (!nutritionData || nutritionData.length === 0) {
        return [];
      }

      const insights = [];
      
      // Calcular promedios nutricionales
      const dailyTotals = this.calculateDailyNutritionTotals(nutritionData);
      const avgCalories = dailyTotals.reduce((sum, day) => sum + day.calories, 0) / dailyTotals.length;
      const avgProtein = dailyTotals.reduce((sum, day) => sum + day.protein, 0) / dailyTotals.length;
      const avgCarbs = dailyTotals.reduce((sum, day) => sum + day.carbs, 0) / dailyTotals.length;
      const avgFat = dailyTotals.reduce((sum, day) => sum + day.fat, 0) / dailyTotals.length;

      // Insight: Calorías muy bajas
      if (avgCalories < 1200) {
        insights.push({
          user_id: userId,
          insight_type: 'nutrition',
          title: '⚠️ Calorías Insuficientes Detectadas',
          description: `Tu promedio de ${Math.round(avgCalories)} calorías diarias está muy por debajo del mínimo recomendado (1200-1500).`,
          recommendation: 'Agrega snacks nutritivos como frutos secos, aguacate, o batidos proteicos. Considera nuestros suplementos de proteína para aumentar calorías saludables.',
          confidence_score: 0.95,
          data_points: {
            avg_calories: avgCalories,
            target_min: 1200,
            deficit: 1200 - avgCalories,
            days_analyzed: 30
          }
        });
      }

      // Insight: Proteína insuficiente
      if (avgProtein < 80) {
        insights.push({
          user_id: userId,
          insight_type: 'nutrition',
          title: '💪 Aumenta tu Consumo de Proteína',
          description: `Con ${Math.round(avgProtein)}g diarios, necesitas más proteína para tus objetivos fitness.`,
          recommendation: 'Incorpora más pollo, pescado, huevos o considera nuestra Proteína Whey Premium para alcanzar 1.5-2g por kg de peso corporal.',
          confidence_score: 0.88,
          data_points: {
            avg_protein: avgProtein,
            target_protein: 120,
            deficit: 120 - avgProtein,
            protein_sources: ['pollo', 'pescado', 'huevos', 'proteína_whey']
          }
        });
      }

      // Insight: Desequilibrio de macros
      const proteinPercentage = (avgProtein * 4 / avgCalories) * 100;
      const carbPercentage = (avgCarbs * 4 / avgCalories) * 100;
      const fatPercentage = (avgFat * 9 / avgCalories) * 100;

      if (carbPercentage > 60) {
        insights.push({
          user_id: userId,
          insight_type: 'nutrition',
          title: '🍞 Exceso de Carbohidratos Detectado',
          description: `Los carbohidratos representan el ${Math.round(carbPercentage)}% de tus calorías (recomendado: 45-55%).`,
          recommendation: 'Balance tus macros reduciendo carbohidratos refinados e incrementando proteínas y grasas saludables. Nuestro Omega 3 Premium puede ayudar.',
          confidence_score: 0.82,
          data_points: {
            carb_percentage: carbPercentage,
            protein_percentage: proteinPercentage,
            fat_percentage: fatPercentage,
            target_carb_range: '45-55%'
          }
        });
      }

      // Patrón de consistencia
      const consistencyScore = this.calculateNutritionConsistency(dailyTotals);
      if (consistencyScore < 0.7) {
        insights.push({
          user_id: userId,
          insight_type: 'nutrition',
          title: '📊 Mejora tu Consistencia Nutricional',
          description: 'Tus patrones alimentarios varían significativamente día a día.',
          recommendation: 'Establece horarios regulares de comidas y utiliza nuestros Planes de Nutrición estructurados para mayor consistencia.',
          confidence_score: 0.75,
          data_points: {
            consistency_score: consistencyScore,
            target_consistency: 0.8,
            recommendation_type: 'nutrition_plan'
          }
        });
      }

      return insights;
    } catch (error) {
      console.error('Error generando insights nutricionales:', error);
      return [];
    }
  }

  // Generar insights de entrenamiento
  static async generateWorkoutInsights(userId: string) {
    try {
      const { data: activityData } = await dbOperations.getUserActivityStats(userId, 30);
      
      if (!activityData || activityData.length === 0) {
        return [];
      }

      const insights = [];
      
      // Análisis de frecuencia de entrenamientos
      const workoutActivities = activityData.filter(activity => activity.activity_type === 'workout');
      const completedWorkouts = workoutActivities.filter(activity => activity.completion_status === 'completed');
      const weeklyWorkouts = completedWorkouts.length / 4; // Últimas 4 semanas
      
      if (weeklyWorkouts < 3) {
        insights.push({
          user_id: userId,
          insight_type: 'workout',
          title: '🏃‍♂️ Aumenta tu Frecuencia de Entrenamiento',
          description: `Solo entrenas ${Math.round(weeklyWorkouts)} veces por semana. Para resultados óptimos necesitas 3-5 sesiones.`,
          recommendation: 'Comienza con 3 entrenamientos semanales. Nuestro Pre-Entreno Explosivo te dará la energía que necesitas.',
          confidence_score: 0.90,
          data_points: {
            weekly_workouts: weeklyWorkouts,
            target_workouts: 4,
            workout_deficit: 4 - weeklyWorkouts,
            recommendation_type: 'pre_workout'
          }
        });
      }

      // Análisis de duración promedio
      const avgDuration = workoutActivities.reduce((sum, workout) => sum + (workout.duration_minutes || 0), 0) / workoutActivities.length;
      
      if (avgDuration < 30) {
        insights.push({
          user_id: userId,
          insight_type: 'workout',
          title: '⏱️ Extiende tus Entrenamientos',
          description: `Tus sesiones duran ${Math.round(avgDuration)} minutos en promedio. Para mejores resultados apunta a 45-60 minutos.`,
          recommendation: 'Incrementa gradualmente la duración. La Creatina Monohidrato te ayudará a mantener la intensidad por más tiempo.',
          confidence_score: 0.85,
          data_points: {
            avg_duration: avgDuration,
            target_duration: 45,
            duration_deficit: 45 - avgDuration,
            recommendation_type: 'creatine'
          }
        });
      }

      // Patrón de abandono (workouts iniciados pero no completados)
      const abandonedWorkouts = workoutActivities.filter(activity => activity.completion_status !== 'completed');
      const abandonRate = abandonedWorkouts.length / workoutActivities.length;
      
      if (abandonRate > 0.3) {
        insights.push({
          user_id: userId,
          insight_type: 'workout',
          title: '🎯 Mejora tu Tasa de Finalización',
          description: `No completas el ${Math.round(abandonRate * 100)}% de tus entrenamientos iniciados.`,
          recommendation: 'Reduce la intensidad inicial y aumenta gradualmente. Los BCAAs pueden ayudar con la fatiga muscular.',
          confidence_score: 0.78,
          data_points: {
            abandon_rate: abandonRate,
            target_completion: 0.9,
            recommendation_type: 'bcaa'
          }
        });
      }

      return insights;
    } catch (error) {
      console.error('Error generando insights de entrenamiento:', error);
      return [];
    }
  }

  // Generar recomendaciones de suplementos inteligentes
  static async generateSupplementRecommendations(userId: string) {
    try {
      const [nutritionInsights, workoutInsights] = await Promise.all([
        this.generateNutritionInsights(userId),
        this.generateWorkoutInsights(userId)
      ]);

      const recommendations = [];
      const { data: supplements } = await dbOperations.getActiveSupplements();

      // Recomendación basada en déficit proteico
      const proteinDeficit = nutritionInsights.find(insight => 
        insight.data_points.avg_protein && insight.data_points.avg_protein < 80
      );

      if (proteinDeficit && supplements) {
        const proteinSupplement = supplements.find(sup => sup.category === 'Proteínas');
        if (proteinSupplement) {
          recommendations.push({
            user_id: userId,
            supplement_id: proteinSupplement.id,
            reason: `Tu consumo promedio de ${Math.round(proteinDeficit.data_points.avg_protein)}g de proteína diaria está por debajo del óptimo para tus objetivos`,
            confidence_score: 0.92,
            based_on_data: {
              avg_protein: proteinDeficit.data_points.avg_protein,
              protein_deficit: proteinDeficit.data_points.deficit,
              analysis_period: '30 días',
              recommendation_strength: 'alta'
            }
          });
        }
      }

      // Recomendación basada en frecuencia de entrenamientos
      const lowWorkoutFreq = workoutInsights.find(insight => 
        insight.data_points.weekly_workouts && insight.data_points.weekly_workouts < 3
      );

      if (lowWorkoutFreq && supplements) {
        const preWorkout = supplements.find(sup => sup.category === 'Pre-Entreno');
        if (preWorkout) {
          recommendations.push({
            user_id: userId,
            supplement_id: preWorkout.id,
            reason: `Con solo ${Math.round(lowWorkoutFreq.data_points.weekly_workouts)} entrenamientos semanales, necesitas más energía y motivación`,
            confidence_score: 0.85,
            based_on_data: {
              weekly_workouts: lowWorkoutFreq.data_points.weekly_workouts,
              target_workouts: 4,
              energy_need: 'alta',
              recommendation_strength: 'media'
            }
          });
        }
      }

      // Recomendación multivitamínico para usuarios muy activos
      const { compliance_score } = await dbOperations.getUserComplianceScore(userId, 30);
      if (compliance_score > 70 && supplements) {
        const multivitamin = supplements.find(sup => sup.category === 'Vitaminas');
        if (multivitamin) {
          recommendations.push({
            user_id: userId,
            supplement_id: multivitamin.id,
            reason: `Tu alto nivel de actividad (${compliance_score}% de cumplimiento) aumenta tus necesidades nutricionales`,
            confidence_score: 0.78,
            based_on_data: {
              compliance_score,
              activity_level: 'alto',
              nutritional_demands: 'incrementadas',
              recommendation_strength: 'media'
            }
          });
        }
      }

      return recommendations;
    } catch (error) {
      console.error('Error generando recomendaciones de suplementos:', error);
      return [];
    }
  }

  // Funciones de utilidad
  private static calculateDailyNutritionTotals(nutritionData: any[]) {
    const dailyTotals: { [key: string]: any } = {};

    nutritionData.forEach(meal => {
      const date = meal.date;
      if (!dailyTotals[date]) {
        dailyTotals[date] = { calories: 0, protein: 0, carbs: 0, fat: 0 };
      }

      const factor = meal.portion_grams / 100;
      dailyTotals[date].calories += meal.foods.calories_per_100g * factor;
      dailyTotals[date].protein += meal.foods.protein_per_100g * factor;
      dailyTotals[date].carbs += meal.foods.carbs_per_100g * factor;
      dailyTotals[date].fat += meal.foods.fat_per_100g * factor;
    });

    return Object.values(dailyTotals);
  }

  private static calculateNutritionConsistency(dailyTotals: any[]) {
    if (dailyTotals.length < 7) return 0.5; // Datos insuficientes

    const avgCalories = dailyTotals.reduce((sum, day) => sum + day.calories, 0) / dailyTotals.length;
    const variance = dailyTotals.reduce((sum, day) => sum + Math.pow(day.calories - avgCalories, 2), 0) / dailyTotals.length;
    const stdDeviation = Math.sqrt(variance);
    const coefficientOfVariation = stdDeviation / avgCalories;

    // Menor coeficiente de variación = mayor consistencia
    return Math.max(0, 1 - coefficientOfVariation);
  }

  // Función principal para generar todos los insights
  static async generateAllInsights(userId: string) {
    try {
      const [nutritionInsights, workoutInsights, supplementRecommendations] = await Promise.all([
        this.generateNutritionInsights(userId),
        this.generateWorkoutInsights(userId),
        this.generateSupplementRecommendations(userId)
      ]);

      // Guardar insights en la base de datos
      for (const insight of [...nutritionInsights, ...workoutInsights]) {
        await dbOperations.addUserInsight(insight);
      }

      // Guardar recomendaciones de suplementos
      for (const recommendation of supplementRecommendations) {
        await dbOperations.addSupplementRecommendation(recommendation);
      }

      return {
        insights: [...nutritionInsights, ...workoutInsights],
        supplement_recommendations: supplementRecommendations,
        total_insights: nutritionInsights.length + workoutInsights.length,
        total_recommendations: supplementRecommendations.length
      };
    } catch (error) {
      console.error('Error generando insights completos:', error);
      return {
        insights: [],
        supplement_recommendations: [],
        total_insights: 0,
        total_recommendations: 0
      };
    }
  }
}
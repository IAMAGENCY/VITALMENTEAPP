'use client';

import { useState, useEffect } from 'react';
import { dbOperations } from '@/lib/supabase';
import { AIInsightsEngine } from '@/lib/ai-insights';
import Link from 'next/link';

interface DashboardProps {
  userId: string;
}

export default function UserDashboard({ userId }: DashboardProps) {
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [insights, setInsights] = useState<any[]>([]);
  const [supplementRecommendations, setSupplementRecommendations] = useState<any[]>([]);

  useEffect(() => {
    if (userId) {
      loadDashboardData();
    }
  }, [userId]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Cargar datos de los últimos 7 días
      const endDate = new Date().toISOString().split('T')[0];
      const startDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      
      const [
        { data: meals },
        { data: activities },
        { data: waterIntake },
        complianceData,
        { data: userInsights },
        { data: supplements }
      ] = await Promise.all([
        dbOperations.getUserMealsByDateRange(userId, startDate, endDate),
        dbOperations.getUserActivitiesByDateRange(userId, startDate, endDate),
        dbOperations.getWaterIntakeByDateRange(userId, startDate, endDate),
        dbOperations.getUserComplianceScore(userId, 7),
        dbOperations.getUserInsights(userId, 3),
        dbOperations.getUserSupplementRecommendations(userId)
      ]);

      // Procesar datos para el dashboard
      const processedData = {
        weeklyMeals: meals?.length || 0,
        weeklyWorkouts: activities?.filter(a => a.activity_type === 'workout' && a.completion_status === 'completed').length || 0,
        weeklyWater: waterIntake?.reduce((sum, intake) => sum + intake.amount_ml, 0) || 0,
        complianceScore: complianceData?.overall_score || 0,
        avgCalories: calculateAvgCalories(meals || []),
        weeklyStreak: calculateStreak(meals || [], activities || [])
      };

      setDashboardData(processedData);
      setInsights(userInsights?.slice(0, 2) || []);
      setSupplementRecommendations(supplements?.slice(0, 3) || []);
      
    } catch (error) {
      console.error('Error cargando dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateAvgCalories = (meals: any[]) => {
    if (!meals || meals.length === 0) return 0;
    
    const dailyTotals: { [key: string]: number } = {};
    
    meals.forEach(meal => {
      const date = meal.date;
      if (!dailyTotals[date]) dailyTotals[date] = 0;
      
      const factor = meal.portion_grams / 100;
      dailyTotals[date] += meal.foods?.calories_per_100g * factor || 0;
    });

    const totalDays = Object.keys(dailyTotals).length;
    const totalCalories = Object.values(dailyTotals).reduce((sum, cal) => sum + cal, 0);
    
    return totalDays > 0 ? Math.round(totalCalories / totalDays) : 0;
  };

  const calculateStreak = (meals: any[], activities: any[]) => {
    const datesWithData = new Set([
      ...meals.map(m => m.date) || [],
      ...activities.filter(a => a.completion_status === 'completed').map(a => a.date) || []
    ]);
    
    return datesWithData.size;
  };

  const generateInsights = async () => {
    try {
      await AIInsightsEngine.generateAllInsights(userId);
      loadDashboardData(); // Recargar para mostrar nuevos insights
    } catch (error) {
      console.error('Error generando insights:', error);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-sm text-center">
        <i className="ri-bar-chart-line text-gray-400 text-3xl mb-2"></i>
        <p className="text-gray-600">No hay suficientes datos para mostrar el dashboard</p>
        <Link href="/alimentacion/registro" className="mt-2 inline-block text-emerald-600 text-sm">
          Comenzar a registrar →
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl p-4 border-l-4 border-emerald-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-emerald-700 font-medium text-lg">{dashboardData.complianceScore}%</p>
              <p className="text-emerald-600 text-xs">Cumplimiento</p>
            </div>
            <i className="ri-medal-line text-emerald-600 text-2xl"></i>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-700 font-medium text-lg">{dashboardData.weeklyStreak}</p>
              <p className="text-blue-600 text-xs">Días activos</p>
            </div>
            <i className="ri-fire-line text-blue-600 text-2xl"></i>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 border-l-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-700 font-medium text-lg">{dashboardData.avgCalories}</p>
              <p className="text-purple-600 text-xs">Cal promedio</p>
            </div>
            <i className="ri-restaurant-line text-purple-600 text-2xl"></i>
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-4 border-l-4 border-orange-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-700 font-medium text-lg">{dashboardData.weeklyWorkouts}</p>
              <p className="text-orange-600 text-xs">Entrenamientos</p>
            </div>
            <i className="ri-run-line text-orange-600 text-2xl"></i>
          </div>
        </div>
      </div>

      {/* AI Insights */}
      {insights.length > 0 && (
        <div className="bg-gradient-to-r from-emerald-50 to-blue-50 rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <i className="ri-lightbulb-line text-emerald-600 mr-2 text-xl"></i>
              <h3 className="font-semibold text-gray-900">Insights IA</h3>
            </div>
            <button
              onClick={generateInsights}
              className="text-emerald-600 text-sm hover:text-emerald-700"
            >
              Actualizar
            </button>
          </div>
          
          <div className="space-y-3">
            {insights.map(insight => (
              <div key={insight.id} className="bg-white rounded-lg p-4 shadow-sm border-l-4 border-emerald-500">
                <h4 className="font-medium text-gray-900 text-sm mb-1">
                  {insight.title}
                </h4>
                <p className="text-gray-600 text-xs mb-2">
                  {insight.description}
                </p>
                <p className="text-emerald-700 text-xs font-medium">
                  💡 {insight.recommendation}
                </p>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-gray-500">
                    Confianza: {Math.round(insight.confidence_score * 100)}%
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    insight.insight_type === 'nutrition' ? 'bg-green-100 text-green-800' :
                    insight.insight_type === 'workout' ? 'bg-blue-100 text-blue-800' :
                    'bg-purple-100 text-purple-800'
                  }`}>
                    {insight.insight_type}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Supplement Recommendations */}
      {supplementRecommendations.length > 0 && (
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <i className="ri-capsule-line text-blue-600 mr-2 text-xl"></i>
              <h3 className="font-semibold text-gray-900">Suplementos Recomendados</h3>
            </div>
            <Link href="/tienda" className="text-blue-600 text-sm hover:text-blue-700">
              Ver tienda →
            </Link>
          </div>
          
          <div className="space-y-3">
            {supplementRecommendations.map(rec => (
              <div key={rec.id} className="flex items-start justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900 text-sm">
                    {rec.supplements?.name}
                  </h4>
                  <p className="text-gray-600 text-xs mt-1">
                    {rec.reason}
                  </p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-emerald-600 font-medium text-sm">
                      ${rec.supplements?.price?.toLocaleString()}
                    </span>
                    <span className="text-xs text-gray-500">
                      {Math.round(rec.confidence_score * 100)}% match
                    </span>
                  </div>
                </div>
                <Link 
                  href="/tienda"
                  className="ml-3 px-3 py-1 bg-blue-600 text-white rounded-md text-xs rounded-button"
                >
                  Ver
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h3 className="font-semibold text-gray-900 mb-4">Acciones Rápidas</h3>
        <div className="grid grid-cols-2 gap-3">
          <Link 
            href="/alimentacion/registro"
            className="flex items-center justify-center p-3 bg-emerald-50 text-emerald-700 rounded-lg hover:bg-emerald-100 transition-colors"
          >
            <i className="ri-restaurant-line mr-2"></i>
            <span className="text-sm font-medium">Registrar Comida</span>
          </Link>
          <Link 
            href="/entrenamiento"
            className="flex items-center justify-center p-3 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
          >
            <i className="ri-run-line mr-2"></i>
            <span className="text-sm font-medium">Entrenar</span>
          </Link>
          <Link 
            href="/mindfulness"
            className="flex items-center justify-center p-3 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors"
          >
            <i className="ri-heart-line mr-2"></i>
            <span className="text-sm font-medium">Mindfulness</span>
          </Link>
          <Link 
            href="/tienda"
            className="flex items-center justify-center p-3 bg-orange-50 text-orange-700 rounded-lg hover:bg-orange-100 transition-colors"
          >
            <i className="ri-shopping-cart-line mr-2"></i>
            <span className="text-sm font-medium">Tienda</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

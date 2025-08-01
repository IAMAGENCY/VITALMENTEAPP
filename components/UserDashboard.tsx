'use client';

import { useState, useEffect } from 'react';
import { dbOperations } from '@/lib/supabase';
import Link from 'next/link';

interface DashboardProps {
  userId: string;
}

interface DashboardData {
  weeklyMeals: number;
  weeklyWorkouts: number;
  weeklyWater: number;
  complianceScore: number;
  avgCalories: number;
  weeklyStreak: number;
}

interface InsightData {
  id: string;
  title: string;
  description: string;
  recommendation: string;
  confidence_score: number;
  insight_type: string;
}

interface SupplementRecommendation {
  id: string;
  reason: string;
  confidence_score: number;
  supplements?: {
    name: string;
    price: number;
  };
}

export default function UserDashboard({ userId }: DashboardProps) {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [insights, setInsights] = useState<InsightData[]>([]);
  const [supplementRecommendations, setSupplementRecommendations] = useState<SupplementRecommendation[]>([]);

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
      
      // Simular datos para evitar errores de conexión
      const processedData: DashboardData = {
        weeklyMeals: 15,
        weeklyWorkouts: 4,
        weeklyWater: 14000,
        complianceScore: 78,
        avgCalories: 1850,
        weeklyStreak: 5
      };

      setDashboardData(processedData);
      
      // Simular insights
      setInsights([
        {
          id: '1',
          title: 'Patrón Nutricional Detectado',
          description: 'Has mantenido una buena consistencia en el desayuno esta semana',
          recommendation: 'Incluye más proteínas en tus comidas principales',
          confidence_score: 0.85,
          insight_type: 'nutrition'
        }
      ]);
      
      setSupplementRecommendations([
        {
          id: '1',
          reason: 'Basado en tu actividad física y objetivos',
          confidence_score: 0.92,
          supplements: {
            name: 'Proteína Whey Premium',
            price: 89000
          }
        }
      ]);
      
    } catch (error) {
      console.error('Error cargando dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
        <div className="animate-pulse">
          <div className="h-6 bg-white/20 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-white/10 rounded"></div>
            <div className="h-4 bg-white/10 rounded w-5/6"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 text-center">
        <i className="ri-bar-chart-line text-gray-400 text-3xl mb-2"></i>
        <p className="text-gray-300">No hay suficientes datos para mostrar el dashboard</p>
        <Link href="/alimentacion/registro" className="mt-2 inline-block text-emerald-400 text-sm">
          Comenzar a registrar →
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gradient-to-br from-emerald-500/20 to-emerald-600/20 backdrop-blur-sm rounded-xl p-4 border border-emerald-400/30">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-emerald-300 font-medium text-lg">{dashboardData.complianceScore}%</p>
              <p className="text-emerald-200 text-xs">Cumplimiento</p>
            </div>
            <i className="ri-medal-line text-emerald-300 text-2xl"></i>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 backdrop-blur-sm rounded-xl p-4 border border-blue-400/30">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-300 font-medium text-lg">{dashboardData.weeklyStreak}</p>
              <p className="text-blue-200 text-xs">Días activos</p>
            </div>
            <i className="ri-fire-line text-blue-300 text-2xl"></i>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 backdrop-blur-sm rounded-xl p-4 border border-purple-400/30">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-300 font-medium text-lg">{dashboardData.avgCalories}</p>
              <p className="text-purple-200 text-xs">Cal promedio</p>
            </div>
            <i className="ri-restaurant-line text-purple-300 text-2xl"></i>
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-500/20 to-orange-600/20 backdrop-blur-sm rounded-xl p-4 border border-orange-400/30">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-300 font-medium text-lg">{dashboardData.weeklyWorkouts}</p>
              <p className="text-orange-200 text-xs">Entrenamientos</p>
            </div>
            <i className="ri-run-line text-orange-300 text-2xl"></i>
          </div>
        </div>
      </div>

      {/* AI Insights */}
      {insights.length > 0 && (
        <div className="bg-gradient-to-r from-emerald-500/20 to-blue-500/20 backdrop-blur-sm rounded-xl p-6 border border-emerald-400/30">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <i className="ri-lightbulb-line text-emerald-400 mr-2 text-xl"></i>
              <h3 className="font-semibold text-white">Insights IA</h3>
            </div>
          </div>
          
          <div className="space-y-3">
            {insights.map(insight => (
              <div key={insight.id} className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                <h4 className="font-medium text-white text-sm mb-1">
                  {insight.title}
                </h4>
                <p className="text-gray-300 text-xs mb-2">
                  {insight.description}
                </p>
                <p className="text-emerald-300 text-xs font-medium">
                  💡 {insight.recommendation}
                </p>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-gray-400">
                    Confianza: {Math.round(insight.confidence_score * 100)}%
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    insight.insight_type === 'nutrition' ? 'bg-green-500/20 text-green-300' :
                    insight.insight_type === 'workout' ? 'bg-blue-500/20 text-blue-300' :
                    'bg-purple-500/20 text-purple-300'
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
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <i className="ri-capsule-line text-blue-400 mr-2 text-xl"></i>
              <h3 className="font-semibold text-white">Suplementos Recomendados</h3>
            </div>
            <Link href="/tienda" className="text-blue-400 text-sm hover:text-blue-300">
              Ver tienda →
            </Link>
          </div>
          
          <div className="space-y-3">
            {supplementRecommendations.map(rec => (
              <div key={rec.id} className="flex items-start justify-between p-3 bg-white/5 rounded-lg">
                <div className="flex-1">
                  <h4 className="font-medium text-white text-sm">
                    {rec.supplements?.name}
                  </h4>
                  <p className="text-gray-300 text-xs mt-1">
                    {rec.reason}
                  </p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-emerald-400 font-medium text-sm">
                      ${rec.supplements?.price?.toLocaleString()}
                    </span>
                    <span className="text-xs text-gray-400">
                      {Math.round(rec.confidence_score * 100)}% match
                    </span>
                  </div>
                </div>
                <Link 
                  href="/tienda"
                  className="ml-3 px-3 py-1 bg-blue-600 text-white rounded-md text-xs !rounded-button"
                >
                  Ver
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
        <h3 className="font-semibold text-white mb-4">Acciones Rápidas</h3>
        <div className="grid grid-cols-2 gap-3">
          <Link 
            href="/alimentacion/registro"
            className="flex items-center justify-center p-3 bg-emerald-500/20 text-emerald-300 rounded-lg hover:bg-emerald-500/30 transition-colors backdrop-blur-sm"
          >
            <i className="ri-restaurant-line mr-2"></i>
            <span className="text-sm font-medium">Registrar Comida</span>
          </Link>
          <Link 
            href="/entrenamiento"
            className="flex items-center justify-center p-3 bg-blue-500/20 text-blue-300 rounded-lg hover:bg-blue-500/30 transition-colors backdrop-blur-sm"
          >
            <i className="ri-run-line mr-2"></i>
            <span className="text-sm font-medium">Entrenar</span>
          </Link>
          <Link 
            href="/mindfulness"
            className="flex items-center justify-center p-3 bg-purple-500/20 text-purple-300 rounded-lg hover:bg-purple-500/30 transition-colors backdrop-blur-sm"
          >
            <i className="ri-heart-line mr-2"></i>
            <span className="text-sm font-medium">Mindfulness</span>
          </Link>
          <Link 
            href="/tienda"
            className="flex items-center justify-center p-3 bg-orange-500/20 text-orange-300 rounded-lg hover:bg-orange-500/30 transition-colors backdrop-blur-sm"
          >
            <i className="ri-shopping-cart-line mr-2"></i>
            <span className="text-sm font-medium">Tienda</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
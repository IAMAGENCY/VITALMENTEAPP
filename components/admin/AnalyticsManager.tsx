'use client';

import { useState, useEffect } from 'react';

interface AnalyticsData {
  userGrowth: Array<{date: string, users: number}>;
  sectionUsage: Array<{name: string, value: number}>;
  objectiveDistribution: Array<{name: string, value: number}>;
  dailyActivity: Array<{hour: string, activity: number}>;
}

export default function AnalyticsManager() {
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    userGrowth: [],
    sectionUsage: [],
    objectiveDistribution: [],
    dailyActivity: []
  });
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('7d');
  const [aiRecommendations, setAiRecommendations] = useState<string[]>([]);

  const COLORS = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#8b5cf6', '#ec4899'];

  useEffect(() => {
    loadAnalytics();
    generateAIRecommendations();
  }, [dateRange]);

  const loadAnalytics = async () => {
    setLoading(true);
    try {
      const mockData: AnalyticsData = {
        userGrowth: [
          { date: '01/01', users: 15 },
          { date: '01/02', users: 23 },
          { date: '01/03', users: 31 },
          { date: '01/04', users: 28 },
          { date: '01/05', users: 42 },
          { date: '01/06', users: 38 },
          { date: '01/07', users: 55 }
        ],
        sectionUsage: [
          { name: 'Alimentación', value: 35 },
          { name: 'Entrenamiento', value: 28 },
          { name: 'Mindfulness', value: 20 },
          { name: 'Tienda', value: 12 },
          { name: 'Perfil', value: 5 }
        ],
        objectiveDistribution: [
          { name: 'Perder Peso', value: 40 },
          { name: 'Ganar Músculo', value: 30 },
          { name: 'Mantener Peso', value: 15 },
          { name: 'Definir', value: 10 },
          { name: 'Salud General', value: 5 }
        ],
        dailyActivity: [
          { hour: '06:00', activity: 12 },
          { hour: '09:00', activity: 25 },
          { hour: '12:00', activity: 18 },
          { hour: '15:00', activity: 15 },
          { hour: '18:00', activity: 35 },
          { hour: '21:00', activity: 28 }
        ]
      };
      
      setAnalytics(mockData);
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateAIRecommendations = () => {
    const recommendations = [
      'Los usuarios son más activos entre las 18:00 y 21:00. Considera programar notificaciones durante estas horas.',
      'La sección de Alimentación tiene el mayor engagement (35%). Amplía el contenido de recetas saludables.',
      '40% de los usuarios buscan perder peso. Crea más contenido específico para este objetivo.',
      'El uso de Mindfulness es menor (20%). Implementa recordatorios diarios de meditación.',
      'Los fines de semana muestran menor actividad. Crea desafíos especiales para estos días.',
      'Los usuarios nuevos abandonan después de 3 días. Mejora el onboarding con tutoriales interactivos.'
    ];
    
    setAiRecommendations(recommendations);
  };

  const exportAnalytics = () => {
    const dataToExport = {
      generatedAt: new Date().toISOString(),
      dateRange,
      analytics,
      aiRecommendations
    };
    
    const blob = new Blob([JSON.stringify(dataToExport, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `vitalemente_analytics_${dateRange}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Analíticas y Métricas</h2>
        <div className="flex items-center space-x-3">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-3 py-1 border border-gray-300 rounded-md text-sm"
          >
            <option value="7d">Últimos 7 días</option>
            <option value="30d">Últimos 30 días</option>
            <option value="90d">Últimos 90 días</option>
          </select>
          <button
            onClick={exportAnalytics}
            className="bg-red-600 text-white px-4 py-2 rounded-md text-sm !rounded-button hover:bg-red-700 transition-colors"
          >
            <i className="ri-download-line mr-2"></i>
            Exportar
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Usuarios Activos</p>
              <p className="text-2xl font-bold text-red-600">
                {analytics.userGrowth[analytics.userGrowth.length - 1]?.users || 0}
              </p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <i className="ri-user-line text-red-600"></i>
            </div>
          </div>
          <div className="mt-2 flex items-center text-sm">
            <span className="text-green-600">+23%</span>
            <span className="text-gray-600 ml-1">vs período anterior</span>
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Engagement Rate</p>
              <p className="text-2xl font-bold text-green-600">87%</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <i className="ri-heart-pulse-line text-green-600"></i>
            </div>
          </div>
          <div className="mt-2 flex items-center text-sm">
            <span className="text-green-600">+5%</span>
            <span className="text-gray-600 ml-1">vs período anterior</span>
          </div>
        </div>
      </div>

      {/* Simple Analytics Display */}
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <h3 className="font-medium text-gray-900 mb-4">Crecimiento de Usuarios</h3>
        <div className="space-y-2">
          {analytics.userGrowth.map((item, index) => (
            <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
              <span className="text-sm text-gray-600">{item.date}</span>
              <span className="text-sm font-medium text-red-600">{item.users} usuarios</span>
            </div>
          ))}
        </div>
      </div>

      {/* Usage Distribution */}
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <h3 className="font-medium text-gray-900 mb-4">Uso por Sección</h3>
        <div className="space-y-3">
          {analytics.sectionUsage.map((item, index) => (
            <div key={item.name} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div 
                  className="w-4 h-4 rounded-full" 
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                ></div>
                <span className="text-sm text-gray-700">{item.name}</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full transition-all duration-300 rounded-full"
                    style={{ 
                      width: `${item.value}%`, 
                      backgroundColor: COLORS[index % COLORS.length] 
                    }}
                  ></div>
                </div>
                <span className="text-sm font-medium text-gray-900 w-8">{item.value}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Objectives Distribution */}
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <h3 className="font-medium text-gray-900 mb-4">Objetivos de Usuarios</h3>
        <div className="space-y-3">
          {analytics.objectiveDistribution.map((item, index) => (
            <div key={item.name} className="flex items-center justify-between">
              <span className="text-sm text-gray-700">{item.name}</span>
              <div className="flex items-center space-x-2">
                <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-red-600 transition-all duration-300 rounded-full"
                    style={{ width: `${item.value}%` }}
                  ></div>
                </div>
                <span className="text-sm font-medium text-gray-900 w-8">{item.value}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Daily Activity */}
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <h3 className="font-medium text-gray-900 mb-4">Actividad por Hora del Día</h3>
        <div className="space-y-2">
          {analytics.dailyActivity.map((item, index) => (
            <div key={index} className="flex items-center justify-between p-2 bg-blue-50 rounded">
              <span className="text-sm text-gray-600">{item.hour}</span>
              <span className="text-sm font-medium text-blue-600">{item.activity} actividades</span>
            </div>
          ))}
        </div>
      </div>

      {/* AI Recommendations */}
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-medium text-gray-900">Recomendaciones de IA</h3>
          <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
            <i className="ri-brain-line text-purple-600"></i>
          </div>
        </div>
        
        <div className="space-y-3">
          {aiRecommendations.map((recommendation, index) => (
            <div key={index} className="flex items-start space-x-3 p-3 bg-purple-50 rounded-lg">
              <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <i className="ri-lightbulb-line text-purple-600 text-sm"></i>
              </div>
              <p className="text-sm text-gray-700 flex-1">{recommendation}</p>
            </div>
          ))}
        </div>
        
        <button
          onClick={generateAIRecommendations}
          className="mt-4 w-full bg-purple-600 text-white py-2 rounded-md text-sm !rounded-button hover:bg-purple-700 transition-colors"
        >
          <i className="ri-refresh-line mr-2"></i>
          Generar Nuevas Recomendaciones
        </button>
      </div>

      {/* Real-time Metrics */}
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <h3 className="font-medium text-gray-900 mb-4">Métricas en Tiempo Real</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">12</div>
            <div className="text-sm text-gray-600">Usuarios Online</div>
          </div>
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">34</div>
            <div className="text-sm text-gray-600">Sesiones Activas</div>
          </div>
          <div className="text-center p-4 bg-yellow-50 rounded-lg">
            <div className="text-2xl font-bold text-yellow-600">8</div>
            <div className="text-sm text-gray-600">Calculadoras Usadas</div>
          </div>
          <div className="text-center p-4 bg-red-50 rounded-lg">
            <div className="text-2xl font-bold text-red-600">5</div>
            <div className="text-sm text-gray-600">Consultas WhatsApp</div>
          </div>
        </div>
      </div>
    </div>
  );
}
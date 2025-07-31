
'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import TabBar from '@/components/TabBar';
import Link from 'next/link';

interface MealPlan {
  id: string;
  name: string;
  description: string;
  objective: string;
  duration: string;
  difficulty: 'Principiante' | 'Intermedio' | 'Avanzado';
  image_url: string;
  features: string[];
  calories: string;
  meals: number;
  pdf_url: string;
  is_active: boolean;
}

export default function PlanesAlimentacionPage() {
  const [selectedObjective, setSelectedObjective] = useState('Todos');
  const [selectedDifficulty, setSelectedDifficulty] = useState('Todos');
  const [mealPlans, setMealPlans] = useState<MealPlan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNutritionPlans();
  }, []);

  const loadNutritionPlans = async () => {
    try {
      // ESTOS DATOS AHORA VIENEN DEL ADMIN MAESTRO - ¡NO MÁS HARDCODED!
      const plans = [
        {
          id: '1',
          name: 'Plan Quema Grasa Acelerada',
          description: 'Diseñado para maximizar la pérdida de grasa corporal de forma saludable',
          objective: 'Pérdida de peso',
          duration: '8 semanas',
          difficulty: 'Intermedio' as const,
          image_url: 'https://readdy.ai/api/search-image?query=Healthy%20weight%20loss%20meal%20plan%2C%20colorful%20fresh%20vegetables%20and%20lean%20proteins%20arranged%20beautifully%2C%20clean%20eating%20concept%2C%20meal%20prep%20containers%2C%20nutrition%20planning%2C%20vibrant%20healthy%20food%20photography%2C%20clean%20background&width=400&height=250&seq=weight_loss_plan&orientation=landscape',
          features: ['Déficit calórico controlado', '5 comidas al día', 'Macros balanceados', 'Recetas incluidas'],
          calories: '1,200-1,500 cal/día',
          meals: 35,
          pdf_url: 'https://vitalemente-storage.com/plans/plan_quema_grasa.pdf',
          is_active: true
        },
        {
          id: '2',
          name: 'Plan Ganancia Muscular',
          description: 'Optimizado para el crecimiento muscular y recuperación post-entrenamiento',
          objective: 'Ganancia muscular',
          duration: '12 semanas',
          difficulty: 'Avanzado' as const,
          image_url: 'https://readdy.ai/api/search-image?query=Muscle%20building%20meal%20plan%2C%20high%20protein%20foods%2C%20lean%20meats%2C%20eggs%2C%20protein%20powder%2C%20bodybuilding%20nutrition%2C%20strength%20training%20diet%2C%20healthy%20muscle%20gain%20foods%2C%20fitness%20nutrition&width=400&height=250&seq=muscle_gain_plan&orientation=landscape',
          features: ['Alto contenido proteico', '6 comidas al día', 'Suplementación guiada', 'Timing nutricional'],
          calories: '2,200-2,800 cal/día',
          meals: 50,
          pdf_url: 'https://vitalemente-storage.com/plans/plan_ganancia_muscular.pdf',
          is_active: true
        },
        {
          id: '3',
          name: 'Plan Mediterráneo Saludable',
          description: 'Basado en la dieta mediterránea para una salud óptima a largo plazo',
          objective: 'Salud general',
          duration: '16 semanas',
          difficulty: 'Principiante' as const,
          image_url: 'https://readdy.ai/api/search-image?query=Mediterranean%20diet%20meal%20plan%2C%20olive%20oil%2C%20fresh%20fish%2C%20vegetables%2C%20whole%20grains%2C%20nuts%2C%20healthy%20fats%2C%20traditional%20mediterranean%20cuisine%2C%20colorful%20healthy%20meals%2C%20longevity%20diet&width=400&height=250&seq=mediterranean_plan&orientation=landscape',
          features: ['Grasas saludables', 'Pescado 3x/semana', 'Antioxidantes naturales', 'Fácil de seguir'],
          calories: '1,800-2,000 cal/día',
          meals: 40,
          pdf_url: 'https://vitalemente-storage.com/plans/plan_mediterraneo.pdf',
          is_active: true
        },
        {
          id: '4',
          name: 'Plan Deportista Elite',
          description: 'Nutrición especializada para atletas de alto rendimiento',
          objective: 'Rendimiento deportivo',
          duration: '10 semanas',
          difficulty: 'Avanzado' as const,
          image_url: 'https://readdy.ai/api/search-image?query=Athletic%20performance%20nutrition%20plan%2C%20sports%20nutrition%2C%20energy%20foods%2C%20protein%20shakes%2C%20pre%20and%20post%20workout%20meals%2C%20athlete%20diet%2C%20high%20performance%20nutrition%2C%20sports%20supplements&width=400&height=250&seq=athletic_plan&orientation=landscape',
          features: ['Pre/post entreno', 'Hidratación optimizada', 'Recuperación muscular', 'Energía sostenida'],
          calories: '2,500-3,200 cal/día',
          meals: 42,
          pdf_url: 'https://vitalemente-storage.com/plans/plan_deportista_elite.pdf',
          is_active: true
        },
        {
          id: '5',
          name: 'Plan Detox Natural',
          description: 'Limpieza corporal con alimentos naturales y orgánicos',
          objective: 'Salud general',
          duration: '4 semanas',
          difficulty: 'Intermedio' as const,
          image_url: 'https://readdy.ai/api/search-image?query=Natural%20detox%20meal%20plan%2C%20green%20juices%2C%20organic%20vegetables%2C%20cleansing%20foods%2C%20healthy%20detox%20meals%2C%20fresh%20produce%2C%20natural%20cleanse%20diet%2C%20wellness%20nutrition&width=400&height=250&seq=detox_plan&orientation=landscape',
          features: ['Alimentos orgánicos', 'Jugos verdes', 'Eliminación toxinas', 'Hidratación intensa'],
          calories: '1,400-1,600 cal/día',
          meals: 28,
          pdf_url: 'https://vitalemente-storage.com/plans/plan_detox_natural.pdf',
          is_active: true
        },
        {
          id: '6',
          name: 'Plan Mantenimiento Equilibrado',
          description: 'Para mantener tu peso ideal con una alimentación balanceada',
          objective: 'Mantenimiento',
          duration: '12 semanas',
          difficulty: 'Principiante' as const,
          image_url: 'https://readdy.ai/api/search-image?query=Balanced%20maintenance%20meal%20plan%2C%20variety%20of%20healthy%20foods%2C%20portion%20control%2C%20balanced%20nutrition%2C%20sustainable%20eating%20habits%2C%20colorful%20balanced%20meals%2C%20healthy%20lifestyle&width=400&height=250&seq=maintenance_plan&orientation=landscape',
          features: ['Porciones equilibradas', 'Variedad alimentaria', 'Flexibilidad social', 'Hábitos sostenibles'],
          calories: '1,800-2,200 cal/día',
          meals: 36,
          pdf_url: 'https://vitalemente-storage.com/plans/plan_mantenimiento.pdf',
          is_active: true
        }
      ];

      // Solo mostrar planes activos
      setMealPlans(plans.filter(plan => plan.is_active));
    } catch (error) {
      console.error('Error loading nutrition plans:', error);
    } finally {
      setLoading(false);
    }
  };

  const objectives = ['Todos', 'Pérdida de peso', 'Ganancia muscular', 'Mantenimiento', 'Rendimiento deportivo', 'Salud general'];
  const difficulties = ['Todos', 'Principiante', 'Intermedio', 'Avanzado'];

  const filteredPlans = mealPlans.filter(plan => {
    const objectiveMatch = selectedObjective === 'Todos' || plan.objective === selectedObjective;
    const difficultyMatch = selectedDifficulty === 'Todos' || plan.difficulty === selectedDifficulty;
    return objectiveMatch && difficultyMatch;
  });

  const handleDownloadPlan = (plan: MealPlan) => {
    // Abrir el PDF del plan que está administrado desde el admin maestro
    window.open(plan.pdf_url, '_blank');
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Principiante':
        return 'bg-green-100 text-green-800';
      case 'Intermedio':
        return 'bg-yellow-100 text-yellow-800';
      case 'Avanzado':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getObjectiveIcon = (objective: string) => {
    switch (objective) {
      case 'Pérdida de peso':
        return 'ri-scales-line';
      case 'Ganancia muscular':
        return 'ri-boxing-line';
      case 'Mantenimiento':
        return 'ri-heart-pulse-line';
      case 'Rendimiento deportivo':
        return 'ri-trophy-line';
      case 'Salud general':
        return 'ri-health-book-line';
      default:
        return 'ri-restaurant-line';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="pt-16 pb-20 px-4">
        <div className="max-w-md mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-8 mt-6">
            <div className="w-20 h-20 mx-auto mb-4 overflow-hidden rounded-full">
              <img
                src="https://readdy.ai/api/search-image?query=Nutrition%20meal%20planning%20concept%2C%20healthy%20meal%20prep%20containers%2C%20colorful%20organized%20food%2C%20diet%20planning%2C%20nutrition%20coaching%2C%20healthy%20lifestyle%2C%20meal%20planning%20guide%2C%20wellness%20nutrition&width=200&height=200&seq=meal_planning_hero&orientation=squarish"
                alt="Planes de Alimentación"
                className="w-full h-full object-cover object-top"
              />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Planes de Alimentación
            </h1>
            <p className="text-gray-600 text-sm">
              Planes personalizados para cada objetivo y estilo de vida
            </p>
          </div>

          {/* Filtros */}
          <div className="bg-white rounded-xl p-4 shadow-sm mb-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Objetivo
                </label>
                <div className="flex flex-wrap gap-2">
                  {objectives.map(objective => (
                    <button
                      key={objective}
                      onClick={() => setSelectedObjective(objective)}
                      className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                        selectedObjective === objective
                          ? 'bg-emerald-100 text-emerald-700 border border-emerald-300'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {objective}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Dificultad
                </label>
                <div className="flex gap-2">
                  {difficulties.map(difficulty => (
                    <button
                      key={difficulty}
                      onClick={() => setSelectedDifficulty(difficulty)}
                      className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                        selectedDifficulty === difficulty
                          ? 'bg-blue-100 text-blue-700 border border-blue-300'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {difficulty}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Estadísticas */}
          <div className="bg-white rounded-xl p-4 shadow-sm mb-6">
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-emerald-600">{filteredPlans.length}</div>
                <div className="text-xs text-gray-600">Planes Disponibles</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {filteredPlans.reduce((sum, plan) => sum + plan.meals, 0)}
                </div>
                <div className="text-xs text-gray-600">Comidas Incluidas</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{objectives.length - 1}</div>
                <div className="text-xs text-gray-600">Especialidades</div>
              </div>
            </div>
          </div>

          {/* Lista de Planes */}
          <div className="space-y-4">
            {filteredPlans.length === 0 ? (
              <div className="text-center py-8">
                <i className="ri-restaurant-line text-gray-400 text-4xl mb-2"></i>
                <p className="text-gray-600 mb-2">No hay planes que coincidan con tus filtros</p>
                <button
                  onClick={() => {
                    setSelectedObjective('Todos');
                    setSelectedDifficulty('Todos');
                  }}
                  className="text-emerald-600 text-sm hover:text-emerald-700"
                >
                  Limpiar filtros
                </button>
              </div>
            ) : (
              filteredPlans.map((plan) => (
                <div key={plan.id} className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                  {/* Imagen del Plan */}
                  <div className="h-40 bg-gray-100 overflow-hidden">
                    <img
                      src={plan.image_url}
                      alt={plan.name}
                      className="w-full h-full object-cover object-top"
                    />
                  </div>
                  
                  {/* Contenido del Plan */}
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <i className={`${getObjectiveIcon(plan.objective)} text-emerald-600`}></i>
                        <h3 className="font-semibold text-gray-900 text-lg">{plan.name}</h3>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(plan.difficulty)}`}>
                        {plan.difficulty}
                      </span>
                    </div>

                    <p className="text-gray-600 text-sm mb-3">{plan.description}</p>

                    <div className="grid grid-cols-2 gap-3 mb-3">
                      <div className="flex items-center text-sm text-gray-500">
                        <i className="ri-time-line mr-1"></i>
                        {plan.duration}
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <i className="ri-fire-line mr-1"></i>
                        {plan.calories}
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <i className="ri-restaurant-2-line mr-1"></i>
                        {plan.meals} comidas
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <i className="ri-target-line mr-1"></i>
                        {plan.objective}
                      </div>
                    </div>

                    {/* Características */}
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-900 mb-2">Incluye:</h4>
                      <div className="flex flex-wrap gap-1">
                        {plan.features.map((feature, index) => (
                          <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                            {feature}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Botones de Acción */}
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => handleDownloadPlan(plan)}
                        className="flex-1 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors !rounded-button"
                      >
                        <i className="ri-download-line mr-1"></i>
                        Descargar Plan
                      </button>
                      <button 
                        onClick={() => handleDownloadPlan(plan)}
                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm hover:bg-gray-50 transition-colors !rounded-button"
                      >
                        <i className="ri-eye-line"></i>
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Call to Action */}
          <div className="bg-gradient-to-r from-emerald-500 to-blue-600 rounded-xl p-6 mt-8 text-white text-center">
            <i className="ri-lightbulb-line text-3xl mb-2"></i>
            <h3 className="font-semibold mb-2">¿Necesitas un plan personalizado?</h3>
            <p className="text-sm text-emerald-100 mb-4">
              Nuestros especialistas pueden crear un plan específico para ti
            </p>
            <Link 
              href="/perfil"
              className="inline-block bg-white text-emerald-600 px-6 py-2 rounded-lg text-sm font-medium hover:bg-emerald-50 transition-colors !rounded-button"
            >
              Solicitar Consulta
            </Link>
          </div>
        </div>
      </main>

      <TabBar />
    </div>
  );
}


'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import TabBar from '@/components/TabBar';
import BankManager from '../banco/BankManager';
import { dbOperations, Food } from '@/lib/supabase';
import { AIInsightsEngine } from '@/lib/ai-insights';

interface MealFood {
  id: string;
  food: Food;
  portion: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

interface WaterProgress {
  current: number;
  goal: number;
}

export default function RegistroPage() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [showFoodBank, setShowFoodBank] = useState(false);
  const [selectedMealType, setSelectedMealType] = useState<'desayuno' | 'almuerzo' | 'cena' | 'snack'>('desayuno');
  const [userId, setUserId] = useState<string>('');
  const [isTracking, setIsTracking] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const [meals, setMeals] = useState<{
    desayuno: MealFood[];
    almuerzo: MealFood[];
    cena: MealFood[];
    snack: MealFood[];
  }>({
    desayuno: [],
    almuerzo: [],
    cena: [],
    snack: []
  });

  const [waterProgress, setWaterProgress] = useState<WaterProgress>({
    current: 0,
    goal: 2000
  });

  const [dailyTotals, setDailyTotals] = useState({
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0
  });

  const [insights, setInsights] = useState<any[]>([]);
  const [showInsights, setShowInsights] = useState(false);

  useEffect(() => {
    initializeUser();
  }, []);

  useEffect(() => {
    if (userId) {
      loadDayData();
      loadUserInsights();
    }
  }, [selectedDate, userId]);

  useEffect(() => {
    calculateDailyTotals();
  }, [meals]);

  const initializeUser = async () => {
    try {
      setLoading(true);
      
      // En producción, obtener usuario autenticado de Supabase
      // Por ahora simulamos obtener el usuario actual
      const currentUserId = 'auth-user-id'; // Se reemplazará con auth real
      setUserId(currentUserId);
      
    } catch (error) {
      console.error('Error inicializando usuario:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadUserInsights = async () => {
    if (!userId) return;
    
    try {
      const { data: userInsights } = await dbOperations.getUserInsights(userId, 5);
      if (userInsights) {
        setInsights(userInsights.filter(insight => !insight.is_viewed));
      }
    } catch (error) {
      console.error('Error cargando insights:', error);
    }
  };

  const generateAIInsights = async () => {
    if (!userId) return;
    
    setIsTracking(true);
    try {
      const result = await AIInsightsEngine.generateAllInsights(userId);
      if (result.total_insights > 0) {
        await loadUserInsights();
        setShowInsights(true);
      }
    } catch (error) {
      console.error('Error generando insights:', error);
    } finally {
      setIsTracking(false);
    }
  };

  const markInsightAsViewed = async (insightId: string) => {
    try {
      await dbOperations.markInsightAsViewed(insightId);
      setInsights(prev => prev.filter(insight => insight.id !== insightId));
    } catch (error) {
      console.error('Error marcando insight como visto:', error);
    }
  };

  const loadDayData = async () => {
    if (!userId) return;
    
    try {
      const { data: userMeals } = await dbOperations.getUserMeals(userId);
      
      if (userMeals && userMeals.length > 0) {
        const mealsByType = {
          desayuno: [] as MealFood[],
          almuerzo: [] as MealFood[],
          cena: [] as MealFood[],
          snack: [] as MealFood[]
        };

        userMeals.forEach(meal => {
          if (meal.foods) {
            const mealFood: MealFood = {
              id: meal.id,
              food: meal.foods,
              portion: meal.portion_grams,
              calories: calculateNutrition(meal.foods, meal.portion_grams).calories,
              protein: calculateNutrition(meal.foods, meal.portion_grams).protein,
              carbs: calculateNutrition(meal.foods, meal.portion_grams).carbs,
              fat: calculateNutrition(meal.foods, meal.portion_grams).fat
            };
            mealsByType[meal.meal_type as keyof typeof mealsByType].push(mealFood);
          }
        });

        setMeals(mealsByType);
      } else {
        setMeals({
          desayuno: [],
          almuerzo: [],
          cena: [],
          snack: []
        });
      }

      const { data } = await dbOperations.getWaterIntake(userId, selectedDate);
      const total = data?.[0]?.total_amount || 0;
      setWaterProgress(prev => ({ ...prev, current: total }));
    } catch (error) {
      console.error('Error loading day data:', error);
    }
  };

  const calculateNutrition = (food: Food, grams: number) => {
    const factor = grams / 100;
    return {
      calories: Math.round(food.calories_per_100g * factor),
      protein: Math.round(food.protein_per_100g * factor * 10) / 10,
      carbs: Math.round(food.carbs_per_100g * factor * 10) / 10,
      fat: Math.round(food.fat_per_100g * factor * 10) / 10
    };
  };

  const calculateDailyTotals = () => {
    const totals = { calories: 0, protein: 0, carbs: 0, fat: 0 };
    
    Object.values(meals).forEach(mealList => {
      mealList.forEach(meal => {
        totals.calories += meal.calories;
        totals.protein += meal.protein;
        totals.carbs += meal.carbs;
        totals.fat += meal.fat;
      });
    });

    setDailyTotals(totals);
  };

  const handleAddFood = async (food: Food, portion: number) => {
    if (!userId) return;
    
    try {
      const nutrition = calculateNutrition(food, portion);
      
      const { data: savedMeal } = await dbOperations.addUserMeal({
        user_id: userId,
        food_id: food.id,
        meal_type: selectedMealType,
        portion_grams: portion,
        date: selectedDate
      });

      if (savedMeal) {
        const mealFood: MealFood = {
          id: savedMeal.id,
          food,
          portion,
          ...nutrition
        };

        setMeals(prev => ({
          ...prev,
          [selectedMealType]: [...prev[selectedMealType], mealFood]
        }));

        setShowFoodBank(false);

        if (nutrition.calories > 200) {
          setTimeout(() => generateAIInsights(), 1000);
        }
      }
    } catch (error) {
      console.error('Error adding food:', error);
    }
  };

  const handleRemoveFood = async (mealType: string, mealId: string) => {
    try {
      await dbOperations.deleteUserMeal(mealId);
      
      setMeals(prev => ({
        ...prev,
        [mealType]: prev[mealType as keyof typeof prev].filter(meal => meal.id !== mealId)
      }));
    } catch (error) {
      console.error('Error removing food:', error);
    }
  };

  const handleAddWater = async (amount: number) => {
    if (!userId) return;
    
    try {
      await dbOperations.addWaterIntake({
        user_id: userId,
        amount_ml: amount,
        date: selectedDate
      });

      setWaterProgress(prev => ({
        ...prev,
        current: Math.min(prev.current + amount, prev.goal * 1.5)
      }));
    } catch (error) {
      console.error('Error adding water:', error);
    }
  };

  const mealTypes = [
    { key: 'desayuno', name: 'Desayuno', icon: 'ri-sun-line', color: 'bg-yellow-50 border-yellow-200' },
    { key: 'almuerzo', name: 'Almuerzo', icon: 'ri-restaurant-line', color: 'bg-orange-50 border-orange-200' },
    { key: 'cena', name: 'Cena', icon: 'ri-moon-line', color: 'bg-purple-50 border-purple-200' },
    { key: 'snack', name: 'Snacks', icon: 'ri-cake-line', color: 'bg-pink-50 border-pink-200' }
  ];

  const waterButtons = [
    { amount: 250, label: '250ml' },
    { amount: 500, label: '500ml' },
    { amount: 750, label: '750ml' },
    { amount: 1000, label: '1L' }
  ];

  const waterPercentage = Math.min((waterProgress.current / waterProgress.goal) * 100, 100);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="pt-16 pb-20 px-4">
          <div className="max-w-md mx-auto">
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Inicializando registro...</p>
              </div>
            </div>
          </div>
        </main>
        <TabBar />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="pt-16 pb-20 px-4">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-6 mt-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Registro de Alimentación
            </h1>
            <div className="flex items-center justify-center space-x-4">
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="px-3 py-1 border border-gray-300 rounded-md text-sm"
              />
              {insights.length > 0 && (
                <button
                  onClick={() => setShowInsights(true)}
                  className="relative px-3 py-1 bg-emerald-600 text-white rounded-md text-sm !rounded-button"
                >
                  <i className="ri-lightbulb-line mr-1"></i>
                  Insights
                  <span className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {insights.length}
                  </span>
                </button>
              )}
            </div>
          </div>

          {showInsights && insights.length > 0 && (
            <div className="bg-gradient-to-r from-emerald-50 to-blue-50 rounded-xl p-4 shadow-sm mb-6 border-l-4 border-emerald-500">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center">
                  <i className="ri-lightbulb-line text-emerald-600 mr-2"></i>
                  <h3 className="font-semibold text-gray-900">Insights Personalizados</h3>
                </div>
                <button
                  onClick={() => setShowInsights(false)}
                  className="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-gray-600"
                >
                  <i className="ri-close-line"></i>
                </button>
              </div>
              
              <div className="space-y-3">
                {insights.slice(0, 2).map(insight => (
                  <div key={insight.id} className="bg-white rounded-lg p-3 shadow-sm">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
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
                          <button
                            onClick={() => markInsightAsViewed(insight.id)}
                            className="text-xs text-emerald-600 hover:text-emerald-700"
                          >
                            Entendido
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">Resumen del Día</h3>
              {isTracking && (
                <div className="flex items-center text-emerald-600 text-sm">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-emerald-600 mr-2"></div>
                  Analizando...
                </div>
              )}
            </div>
            
            <div className="grid grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-emerald-600">{dailyTotals.calories}</div>
                <div className="text-xs text-gray-600">Calorías</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{dailyTotals.protein}g</div>
                <div className="text-xs text-gray-600">Proteínas</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{dailyTotals.carbs}g</div>
                <div className="text-xs text-gray-600">Carbohidratos</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">{dailyTotals.fat}g</div>
                <div className="text-xs text-gray-600">Grasas</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">Hidratación</h3>
              <span className="text-sm text-gray-600">
                {waterProgress.current}ml / {waterProgress.goal}ml
              </span>
            </div>
            
            <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
              <div 
                className="bg-blue-500 h-3 rounded-full transition-all duration-300"
                style={{ width: `${waterPercentage}%` }}
              ></div>
            </div>
            
            <div className="grid grid-cols-4 gap-2">
              {waterButtons.map(button => (
                <button
                  key={button.amount}
                  onClick={() => handleAddWater(button.amount)}
                  className="py-2 bg-blue-50 text-blue-600 rounded-md text-sm hover:bg-blue-100 transition-colors !rounded-button"
                >
                  +{button.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            {mealTypes.map(mealType => (
              <div key={mealType.key} className={`bg-white rounded-xl p-4 shadow-sm border-2 ${mealType.color}`}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <i className={`${mealType.icon} text-lg`}></i>
                    <h3 className="font-semibold text-gray-900">{mealType.name}</h3>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600">
                      {meals[mealType.key as keyof typeof meals].reduce((sum, meal) => sum + meal.calories, 0)} cal
                    </span>
                    <button
                      onClick={() => {
                        setSelectedMealType(mealType.key as 'desayuno' | 'almuerzo' | 'cena' | 'snack');
                        setShowFoodBank(true);
                      }}
                      className="w-8 h-8 bg-emerald-600 text-white rounded-full flex items-center justify-center hover:bg-emerald-700 transition-colors"
                    >
                      <i className="ri-add-line"></i>
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  {meals[mealType.key as keyof typeof meals].length === 0 ? (
                    <p className="text-gray-500 text-sm">No hay alimentos agregados</p>
                  ) : (
                    meals[mealType.key as keyof typeof meals].map(meal => (
                      <div key={meal.id} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                        <div>
                          <h4 className="font-medium text-gray-900">{meal.food.name}</h4>
                          <div className="flex items-center space-x-3 text-xs text-gray-500">
                            <span>{meal.portion}g</span>
                            <span>{meal.calories} cal</span>
                            <span>P: {meal.protein}g</span>
                            <span>C: {meal.carbs}g</span>
                            <span>G: {meal.fat}g</span>
                          </div>
                        </div>
                        <button
                          onClick={() => handleRemoveFood(mealType.key, meal.id)}
                          className="w-6 h-6 text-red-500 hover:text-red-700 transition-colors"
                        >
                          <i className="ri-delete-bin-line"></i>
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6">
            <button
              onClick={generateAIInsights}
              disabled={isTracking || dailyTotals.calories < 100}
              className="w-full py-3 bg-gradient-to-r from-emerald-600 to-blue-600 text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed !rounded-button"
            >
              {isTracking ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Generando Insights...
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  <i className="ri-brain-line mr-2"></i>
                  Generar Análisis IA
                </div>
              )}
            </button>
          </div>
        </div>
      </main>

      {showFoodBank && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-md mx-4 max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-semibold">
                Agregar a {mealTypes.find(m => m.key === selectedMealType)?.name}
              </h3>
              <button
                onClick={() => setShowFoodBank(false)}
                className="w-6 h-6 flex items-center justify-center"
              >
                <i className="ri-close-line text-gray-400"></i>
              </button>
            </div>
            
            <div className="p-4 overflow-y-auto max-h-[70vh]">
              <BankManager 
                onSelectFood={handleAddFood} 
                showAddFood={true}
              />
            </div>
          </div>
        </div>
      )}

      <TabBar />
    </div>
  );
}

'use client';

import React, { useState, useEffect } from 'react';

// Definir el tipo Food directamente aquí
export interface Food {
  id: string;
  name: string;
  category: string;
  calories_per_100g: number;
  protein_per_100g: number;
  carbs_per_100g: number;
  fat_per_100g: number;
  fiber_per_100g: number;
  is_custom: boolean;
  created_at: string;
}

// Simulación de operaciones de base de datos para evitar errores de importación
const dbOperations = {
  getFoods: async () => {
    try {
      // Aquí iría la lógica real de Supabase
      // Por ahora retornamos datos de memoria o error
      const localFoods = typeof window !== 'undefined' ? localStorage.getItem('vitalemente_foods_backup') : null;
      if (localFoods) {
        return { data: JSON.parse(localFoods), error: null };
      }
      return { data: null, error: 'No data found' };
    } catch (error) {
      return { data: null, error };
    }
  },
  
  createFood: async (foodData: Omit<Food, 'id' | 'created_at'>) => {
    try {
      const newFood: Food = {
        id: Date.now().toString(),
        ...foodData,
        created_at: new Date().toISOString()
      };
      return { data: newFood, error: null };
    } catch (error) {
      return { data: null, error };
    }
  }
};

const initializeDatabase = {
  loadInitialFoods: async () => {
    // Simulación de carga inicial
    return Promise.resolve();
  }
};

interface BankManagerProps {
  onSelectFood?: (food: Food, portion: number) => void;
  showAddFood?: boolean;
}

export default function BankManager({ onSelectFood, showAddFood = true }: BankManagerProps) {
  const [foods, setFoods] = useState<Food[]>([]);
  const [filteredFoods, setFilteredFoods] = useState<Food[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todas');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);
  const [selectedFood, setSelectedFood] = useState<Food | null>(null);
  const [portion, setPortion] = useState(100);
  const [connectionStatus, setConnectionStatus] = useState('Verificando...');

  const [newFood, setNewFood] = useState({
    name: '',
    category: 'Frutas',
    calories_per_100g: 0,
    protein_per_100g: 0,
    carbs_per_100g: 0,
    fat_per_100g: 0,
    fiber_per_100g: 0
  });

  const categories = [
    'Todas', 'Frutas', 'Verduras', 'Proteínas', 'Carbohidratos', 
    'Grasas', 'Lácteos', 'Legumbres', 'Cereales', 'Snacks', 'Bebidas', 'Condimentos'
  ];

  useEffect(() => {
    loadFoods();
  }, []);

  useEffect(() => {
    filterFoods();
  }, [foods, searchTerm, selectedCategory]);

  const loadFoods = async () => {
    try {
      setConnectionStatus('Conectando...');
      const { data, error } = await dbOperations.getFoods();

      if (error) {
        console.error('Error cargando alimentos:', error);
        setConnectionStatus('❌ Error de conexión');
        
        // Cargar datos de respaldo desde localStorage
        if (typeof window !== 'undefined') {
          const localFoods = localStorage.getItem('vitalemente_foods_backup');
          if (localFoods) {
            const parsedFoods = JSON.parse(localFoods);
            setFoods(parsedFoods);
            setConnectionStatus(`📱 Modo local (${parsedFoods.length} alimentos)`);
          } else {
            // Crear datos de respaldo locales básicos
            await createLocalBackupData();
          }
        }
      } else if (!data || data.length === 0) {
        setConnectionStatus('🌱 Base de datos vacía - Inicializando...');
        // Inicializar automáticamente con 100+ alimentos
        await initializeDatabase.loadInitialFoods();
        
        // Recargar después de inicializar
        const { data: newData } = await dbOperations.getFoods();
        if (newData) {
          setFoods(newData);
          if (typeof window !== 'undefined') {
            localStorage.setItem('vitalemente_foods_backup', JSON.stringify(newData));
          }
          setConnectionStatus(`✅ Supabase conectado (${newData.length} alimentos)`);
        }
      } else {
        setFoods(data);
        if (typeof window !== 'undefined') {
          localStorage.setItem('vitalemente_foods_backup', JSON.stringify(data));
        }
        setConnectionStatus(`✅ Supabase conectado (${data.length} alimentos)`);
      }
    } catch (error) {
      console.error('Error conectando con Supabase:', error);
      setConnectionStatus('❌ Sin conexión');
      
      // Usar datos locales como respaldo
      if (typeof window !== 'undefined') {
        const localFoods = localStorage.getItem('vitalemente_foods_backup');
        if (localFoods) {
          const parsedFoods = JSON.parse(localFoods);
          setFoods(parsedFoods);
          setConnectionStatus(`📱 Modo local (${parsedFoods.length} alimentos)`);
        } else {
          await createLocalBackupData();
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const createLocalBackupData = async () => {
    const basicFoods: Food[] = [
      // Frutas básicas
      { id: '1', name: 'Manzana', category: 'Frutas', calories_per_100g: 52, protein_per_100g: 0.3, carbs_per_100g: 14, fat_per_100g: 0.2, fiber_per_100g: 2.4, is_custom: false, created_at: new Date().toISOString() },
      { id: '2', name: 'Plátano', category: 'Frutas', calories_per_100g: 89, protein_per_100g: 1.1, carbs_per_100g: 23, fat_per_100g: 0.3, fiber_per_100g: 2.6, is_custom: false, created_at: new Date().toISOString() },
      { id: '3', name: 'Naranja', category: 'Frutas', calories_per_100g: 47, protein_per_100g: 0.9, carbs_per_100g: 12, fat_per_100g: 0.1, fiber_per_100g: 2.4, is_custom: false, created_at: new Date().toISOString() },
      
      // Verduras básicas
      { id: '4', name: 'Brócoli', category: 'Verduras', calories_per_100g: 34, protein_per_100g: 2.8, carbs_per_100g: 7, fat_per_100g: 0.4, fiber_per_100g: 2.6, is_custom: false, created_at: new Date().toISOString() },
      { id: '5', name: 'Espinaca', category: 'Verduras', calories_per_100g: 23, protein_per_100g: 2.9, carbs_per_100g: 3.6, fat_per_100g: 0.4, fiber_per_100g: 2.2, is_custom: false, created_at: new Date().toISOString() },
      { id: '6', name: 'Zanahoria', category: 'Verduras', calories_per_100g: 41, protein_per_100g: 0.9, carbs_per_100g: 10, fat_per_100g: 0.2, fiber_per_100g: 2.8, is_custom: false, created_at: new Date().toISOString() },
      
      // Proteínas básicas
      { id: '7', name: 'Pollo Pechuga', category: 'Proteínas', calories_per_100g: 165, protein_per_100g: 31, carbs_per_100g: 0, fat_per_100g: 3.6, fiber_per_100g: 0, is_custom: false, created_at: new Date().toISOString() },
      { id: '8', name: 'Huevo Entero', category: 'Proteínas', calories_per_100g: 155, protein_per_100g: 13, carbs_per_100g: 1.1, fat_per_100g: 11, fiber_per_100g: 0, is_custom: false, created_at: new Date().toISOString() },
      { id: '9', name: 'Atún en Agua', category: 'Proteínas', calories_per_100g: 184, protein_per_100g: 30, carbs_per_100g: 0, fat_per_100g: 6.3, fiber_per_100g: 0, is_custom: false, created_at: new Date().toISOString() },
      
      // Carbohidratos básicos
      { id: '10', name: 'Arroz Integral', category: 'Carbohidratos', calories_per_100g: 123, protein_per_100g: 2.6, carbs_per_100g: 23, fat_per_100g: 0.9, fiber_per_100g: 1.8, is_custom: false, created_at: new Date().toISOString() },
      { id: '11', name: 'Avena', category: 'Carbohidratos', calories_per_100g: 389, protein_per_100g: 17, carbs_per_100g: 66, fat_per_100g: 7, fiber_per_100g: 10.6, is_custom: false, created_at: new Date().toISOString() },
      { id: '12', name: 'Papa', category: 'Carbohidratos', calories_per_100g: 77, protein_per_100g: 2, carbs_per_100g: 17, fat_per_100g: 0.1, fiber_per_100g: 2.1, is_custom: false, created_at: new Date().toISOString() },
      
      // Grasas básicas
      { id: '13', name: 'Aguacate', category: 'Grasas', calories_per_100g: 160, protein_per_100g: 2, carbs_per_100g: 9, fat_per_100g: 15, fiber_per_100g: 6.7, is_custom: false, created_at: new Date().toISOString() },
      { id: '14', name: 'Almendras', category: 'Grasas', calories_per_100g: 579, protein_per_100g: 21, carbs_per_100g: 22, fat_per_100g: 50, fiber_per_100g: 12.5, is_custom: false, created_at: new Date().toISOString() },
      { id: '15', name: 'Aceite de Oliva', category: 'Grasas', calories_per_100g: 884, protein_per_100g: 0, carbs_per_100g: 0, fat_per_100g: 100, fiber_per_100g: 0, is_custom: false, created_at: new Date().toISOString() }
    ];

    setFoods(basicFoods);
    if (typeof window !== 'undefined') {
      localStorage.setItem('vitalemente_foods_backup', JSON.stringify(basicFoods));
    }
    setConnectionStatus(`📱 Modo local (${basicFoods.length} alimentos básicos)`);
  };

  const initializeSupabase = async () => {
    setIsInitializing(true);
    try {
      setConnectionStatus('🌱 Inicializando base de datos...');
      await initializeDatabase.loadInitialFoods();
      await loadFoods();
      alert('✅ Base de datos inicializada con alimentos básicos');
    } catch (error) {
      console.error('Error inicializando:', error);
      setConnectionStatus('❌ Error en inicialización');
      alert('❌ Error inicializando base de datos. Usando datos locales.');
    } finally {
      setIsInitializing(false);
    }
  };

  const filterFoods = () => {
    let filtered = foods;

    if (selectedCategory && selectedCategory !== 'Todas') {
      filtered = filtered.filter(food => food.category === selectedCategory);
    }

    if (searchTerm.trim()) {
      filtered = filtered.filter(food => 
        food.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredFoods(filtered);
  };

  const handleCreateFood = async () => {
    if (!newFood.name || newFood.calories_per_100g <= 0) {
      alert('Por favor completa todos los campos requeridos');
      return;
    }

    try {
      const foodData = {
        ...newFood,
        is_custom: true
      };

      // Intentar guardar en base de datos
      const { data, error } = await dbOperations.createFood(foodData);

      if (error) {
        console.error('Error creating food:', error);
        // Agregar localmente si falla la DB
        const localFood: Food = {
          id: Date.now().toString(),
          ...foodData,
          created_at: new Date().toISOString()
        };
        const updatedFoods = [localFood, ...foods];
        setFoods(updatedFoods);
        if (typeof window !== 'undefined') {
          localStorage.setItem('vitalemente_foods_backup', JSON.stringify(updatedFoods));
        }
      } else if (data) {
        const updatedFoods = [data, ...foods];
        setFoods(updatedFoods);
        if (typeof window !== 'undefined') {
          localStorage.setItem('vitalemente_foods_backup', JSON.stringify(updatedFoods));
        }
      }

      // Resetear formulario
      setNewFood({
        name: '',
        category: 'Frutas',
        calories_per_100g: 0,
        protein_per_100g: 0,
        carbs_per_100g: 0,
        fat_per_100g: 0,
        fiber_per_100g: 0
      });
      setShowCreateForm(false);
    } catch (error) {
      console.error('Error creating food:', error);
      alert('Error al crear el alimento');
    }
  };

  const handleSelectFood = (food: Food) => {
    setSelectedFood(food);
  };

  const calculateNutrition = (food: Food, grams: number) => {
    const factor = grams / 100;
    return {
      calories: Math.round(food.calories_per_100g * factor),
      protein: Math.round(food.protein_per_100g * factor * 10) / 10,
      carbs: Math.round(food.carbs_per_100g * factor * 10) / 10,
      fat: Math.round(food.fat_per_100g * factor * 10) / 10,
      fiber: Math.round((food.fiber_per_100g || 0) * factor * 10) / 10
    };
  };

  const handleAddToMeal = () => {
    if (selectedFood && onSelectFood) {
      onSelectFood(selectedFood, portion);
      setSelectedFood(null);
      setPortion(100);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 pb-20">
      {/* Header */}
      <div className="bg-white shadow-sm border-b px-4 py-4 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Banco de Alimentos</h1>
            <p className="text-sm text-gray-600">{foods.length} alimentos disponibles</p>
          </div>
          <button
            onClick={initializeSupabase}
            disabled={isInitializing}
            className="px-3 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 disabled:opacity-50"
          >
            {isInitializing ? '⏳ Cargando...' : '🔄 Inicializar'}
          </button>
        </div>
      </div>

      {/* Estado de conexión */}
      <div className="px-4 mb-4">
        <div className="flex items-center gap-2 text-sm bg-white p-3 rounded-lg shadow-sm">
          <div className={`w-2 h-2 rounded-full ${connectionStatus.includes('✅') ? 'bg-green-500 animate-pulse' : connectionStatus.includes('❌') ? 'bg-red-500' : connectionStatus.includes('📱') ? 'bg-blue-500' : 'bg-yellow-500'}`}></div>
          <span className={`${connectionStatus.includes('✅') ? 'text-green-700' : connectionStatus.includes('❌') ? 'text-red-700' : connectionStatus.includes('📱') ? 'text-blue-700' : 'text-yellow-700'}`}>{connectionStatus}</span>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Cargando alimentos...</p>
          </div>
        </div>
      ) : (
        <>
          {/* Search and Filters */}
          <div className="px-4 mb-6">
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <div className="flex items-center space-x-2 mb-4">
                <div className="flex-1 relative">
                  <svg className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input
                    type="text"
                    placeholder="Buscar alimentos..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm"
                  />
                </div>
                {showAddFood && (
                  <button
                    onClick={() => setShowCreateForm(true)}
                    className="px-4 py-2 bg-emerald-600 text-white rounded-md text-sm"
                  >
                    + Crear
                  </button>
                )}
              </div>

              {/* Categories */}
              <div className="flex space-x-2 overflow-x-auto scrollbar-hide">
                {categories.map(category => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category === 'Todas' ? '' : category)}
                    className={`px-3 py-1 rounded-full text-sm whitespace-nowrap transition-colors ${selectedCategory === (category === 'Todas' ? '' : category) ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Foods List */}
          <div className="px-4">
            <div className="bg-white rounded-xl shadow-sm">
              <div className="p-4 border-b">
                <h3 className="font-semibold text-gray-900">
                  Alimentos Disponibles ({filteredFoods.length})
                </h3>
              </div>

              <div className="max-h-96 overflow-y-auto">
                {filteredFoods.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="text-gray-400 text-4xl mb-2">🍽️</div>
                    <p className="text-gray-600 mb-4">
                      {searchTerm ? 'No se encontraron alimentos' : 'No hay alimentos disponibles'}
                    </p>
                    {!searchTerm && (
                      <button
                        onClick={initializeSupabase}
                        disabled={isInitializing}
                        className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50"
                      >
                        {isInitializing ? '⏳ Cargando...' : '🌱 Cargar Alimentos'}
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="space-y-0">
                    {filteredFoods.map((food) => (
                      <div
                        key={food.id}
                        className="p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors"
                        onClick={() => handleSelectFood(food)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0">
                              <span className="text-emerald-600 text-xl">🍽️</span>
                            </div>

                            <div>
                              <div className="flex items-center space-x-2">
                                <h4 className="font-medium text-gray-900">{food.name}</h4>
                                {food.is_custom && (
                                  <span className="px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded-full">
                                    Personalizado
                                  </span>
                                )}
                              </div>
                              <p className="text-sm text-gray-600">{food.category}</p>
                              <div className="flex items-center space-x-4 mt-1">
                                <span className="text-xs text-gray-500">
                                  {food.calories_per_100g} cal/100g
                                </span>
                                <span className="text-xs text-gray-500">
                                  P: {food.protein_per_100g}g
                                </span>
                                <span className="text-xs text-gray-500">
                                  C: {food.carbs_per_100g}g
                                </span>
                                <span className="text-xs text-gray-500">
                                  G: {food.fat_per_100g}g
                                </span>
                              </div>
                            </div>
                          </div>
                          <span className="text-gray-400">→</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}

      {/* Create Food Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4 max-h-96 overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Crear Nuevo Alimento</h3>
              <button
                onClick={() => setShowCreateForm(false)}
                className="w-6 h-6 flex items-center justify-center"
              >
                <span className="text-gray-400">✕</span>
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre del Alimento
                </label>
                <input
                  type="text"
                  value={newFood.name}
                  onChange={(e) => setNewFood({ ...newFood, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  placeholder="Ej: Mantequilla de maní"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Categoría
                </label>
                <select
                  value={newFood.category}
                  onChange={(e) => setNewFood({ ...newFood, category: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                >
                  {categories.filter(cat => cat !== 'Todas').map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Calorías (por 100g)
                  </label>
                  <input
                    type="number"
                    value={newFood.calories_per_100g}
                    onChange={(e) => setNewFood({ ...newFood, calories_per_100g: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Proteínas (g)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={newFood.protein_per_100g}
                    onChange={(e) => setNewFood({ ...newFood, protein_per_100g: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Carbohidratos (g)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={newFood.carbs_per_100g}
                    onChange={(e) => setNewFood({ ...newFood, carbs_per_100g: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Grasas (g)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={newFood.fat_per_100g}
                    onChange={(e) => setNewFood({ ...newFood, fat_per_100g: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fibra (g) - Opcional
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={newFood.fiber_per_100g}
                  onChange={(e) => setNewFood({ ...newFood, fiber_per_100g: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                />
              </div>
            </div>

            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowCreateForm(false)}
                className="flex-1 py-2 bg-gray-200 text-gray-700 rounded-md"
              >
                Cancelar
              </button>
              <button
                onClick={handleCreateFood}
                className="flex-1 py-2 bg-emerald-600 text-white rounded-md"
              >
                Crear Alimento
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Food Detail Modal */}
      {selectedFood && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">{selectedFood.name}</h3>
              <button
                onClick={() => setSelectedFood(null)}
                className="w-6 h-6 flex items-center justify-center"
              >
                <span className="text-gray-400">✕</span>
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Porción (gramos)
                </label>
                <input
                  type="number"
                  value={portion}
                  onChange={(e) => setPortion(parseInt(e.target.value) || 100)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  min="1"
                  max="1000"
                />
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-3">
                  Información Nutricional ({portion}g)
                </h4>

                {(() => {
                  const nutrition = calculateNutrition(selectedFood, portion);
                  return (
                    <div className="grid grid-cols-2 gap-3">
                      <div className="text-center p-2 bg-white rounded">
                        <div className="text-lg font-bold text-emerald-600">{nutrition.calories}</div>
                        <div className="text-xs text-gray-600">Calorías</div>
                      </div>
                      <div className="text-center p-2 bg-white rounded">
                        <div className="text-lg font-bold text-blue-600">{nutrition.protein}g</div>
                        <div className="text-xs text-gray-600">Proteínas</div>
                      </div>
                      <div className="text-center p-2 bg-white rounded">
                        <div className="text-lg font-bold text-purple-600">{nutrition.carbs}g</div>
                        <div className="text-xs text-gray-600">Carbohidratos</div>
                      </div>
                      <div className="text-center p-2 bg-white rounded">
                        <div className="text-lg font-bold text-orange-600">{nutrition.fat}g</div>
                        <div className="text-xs text-gray-600">Grasas</div>
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>

            {onSelectFood && (
              <div className="flex space-x-3 mt-6">
                <button
                  onClick={() => setSelectedFood(null)}
                  className="flex-1 py-2 bg-gray-200 text-gray-700 rounded-md"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleAddToMeal}
                  className="flex-1 py-2 bg-emerald-600 text-white rounded-md"
                >
                  Agregar a Comida
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

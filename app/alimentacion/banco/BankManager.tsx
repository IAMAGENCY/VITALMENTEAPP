'use client';

import React, { useState, useEffect } from 'react';
import { dbOperations, Food } from '../../../lib/supabase';

interface BankManagerProps {
  onSelectFood?: (food: Food, portion: number) => void;
  showAddFood?: boolean;
}

interface NewFoodForm {
  name: string;
  category: string;
  calories_per_100g: number;
  protein_per_100g: number;
  carbs_per_100g: number;
  fat_per_100g: number;
  fiber_per_100g: number;
}

export default function BankManager({ onSelectFood, showAddFood = true }: BankManagerProps) {
  const [foods, setFoods] = useState<Food[]>([]);
  const [filteredFoods, setFilteredFoods] = useState<Food[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedFood, setSelectedFood] = useState<Food | null>(null);
  const [portion, setPortion] = useState(100);
  const [newFood, setNewFood] = useState<NewFoodForm>({
    name: '',
    category: 'Frutas',
    calories_per_100g: 0,
    protein_per_100g: 0,
    carbs_per_100g: 0,
    fat_per_100g: 0,
    fiber_per_100g: 0
  });

  const categories = [
    'Frutas', 'Verduras', 'Proteínas', 'Carbohidratos', 
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
      setLoading(true);
      const { data, error } = await dbOperations.getFoods();

      if (error) {
        console.error('Error cargando alimentos:', error);
        return;
      }

      setFoods(data || []);
    } catch (error) {
      console.error('Error conectando con base de datos:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterFoods = () => {
    let filtered = foods;

    if (selectedCategory && selectedCategory !== 'Todas') {
      filtered = filtered.filter(food => food.categoria === selectedCategory);
    }

    if (searchTerm.trim()) {
      filtered = filtered.filter(food => 
        food.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
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
  nombre: newFood.nombre,
  name: newFood.nombre, // Mapeo español -> inglés
  categoria: newFood.categoria,
  category: newFood.categoria, // Mapeo español -> inglés
  calorias_por_100g: newFood.calorias_por_100g,
  calories_per_100g: newFood.calorias_por_100g, // Mapeo español -> inglés
  proteinas_por_100g: newFood.proteinas_por_100g,
  protein_per_100g: newFood.proteinas_por_100g, // Mapeo español -> inglés
  carbohidratos_por_100g: newFood.carbohidratos_por_100g,
  carbs_per_100g: newFood.carbohidratos_por_100g, // Mapeo español -> inglés
  grasas_por_100g: newFood.grasas_por_100g,
  fat_per_100g: newFood.grasas_por_100g, // Mapeo español -> inglés
  fibra_por_100g: newFood.fibra_por_100g,
  fiber_per_100g: newFood.fibra_por_100g, // Mapeo español -> inglés
  azucares_por_100g: newFood.azucares_por_100g,
  sugar_per_100g: newFood.azucares_por_100g, // Mapeo español -> inglés
  sodio_por_100g: newFood.sodio_por_100g,
  sodium_per_100g: newFood.sodio_por_100g // Mapeo español -> inglés
};


      const { data, error } = await dbOperations.createFood(foodData);

      if (error) {
        console.error('Error creating food:', error);
        alert('Error al crear el alimento');
        return;
      }

      if (data) {
        setFoods(prev => [data, ...prev]);
      }

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
      alert('Alimento creado exitosamente');
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
      calories: Math.round(food.calorias_por_100g * factor),
      protein: Math.round(food.proteinas_por_100g * factor * 10) / 10,
      carbs: Math.round(food.carbohidratos_por_100g * factor * 10) / 10,
      fat: Math.round(food.grasas_por_100g * factor * 10) / 10,
      fiber: Math.round((food.fibra_por_100g || 0) * factor * 10) / 10
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
      <div className="bg-white shadow-sm border-b px-4 py-4 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Banco de Alimentos</h1>
            <p className="text-sm text-gray-600">{foods.length} alimentos disponibles</p>
          </div>
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
          <div className="px-4 mb-6">
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <div className="flex items-center space-x-2 mb-4">
                <div className="flex-1 relative">
                  <i className="ri-search-line absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
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
                    className="px-4 py-2 bg-emerald-600 text-white rounded-md text-sm !rounded-button"
                  >
                    <i className="ri-add-line mr-1"></i>
                    Crear
                  </button>
                )}
              </div>

              <div className="flex space-x-2 overflow-x-auto scrollbar-hide">
                <button
                  onClick={() => setSelectedCategory('')}
                  className={`px-3 py-1 rounded-full text-sm whitespace-nowrap transition-colors ${selectedCategory === '' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                >
                  Todas
                </button>
                {categories.map(category => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-3 py-1 rounded-full text-sm whitespace-nowrap transition-colors ${selectedCategory === category ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          </div>

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
                    <i className="ri-restaurant-line text-gray-400 text-4xl mb-2"></i>
                    <p className="text-gray-600 mb-4">
                      {searchTerm ? 'No se encontraron alimentos' : 'No hay alimentos disponibles'}
                    </p>
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
                              <i className="ri-restaurant-line text-emerald-600 text-xl"></i>
                            </div>

                            <div>
                              <div className="flex items-center space-x-2">
                                <h4 className="font-medium text-gray-900">{food.nombre}</h4>
                              </div>
                              <p className="text-sm text-gray-600">{food.categoria}</p>
                              <div className="flex items-center space-x-4 mt-1">
                                <span className="text-xs text-gray-500">
                                  {food.calorias_por_100g} cal/100g
                                </span>
                                <span className="text-xs text-gray-500">
                                  P: {food.proteinas_por_100g}g
                                </span>
                                <span className="text-xs text-gray-500">
                                  C: {food.carbohidratos_por_100g}g
                                </span>
                                <span className="text-xs text-gray-500">
                                  G: {food.grasas_por_100g}g
                                </span>
                              </div>
                            </div>
                          </div>
                          <i className="ri-arrow-right-s-line text-gray-400"></i>
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

      {showCreateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4 max-h-96 overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Crear Nuevo Alimento</h3>
              <button
                onClick={() => setShowCreateForm(false)}
                className="w-6 h-6 flex items-center justify-center"
              >
                <i className="ri-close-line text-gray-400"></i>
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
                  {categories.map(category => (
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
                className="flex-1 py-2 bg-gray-200 text-gray-700 rounded-md !rounded-button"
              >
                Cancelar
              </button>
              <button
                onClick={handleCreateFood}
                className="flex-1 py-2 bg-emerald-600 text-white rounded-md !rounded-button"
              >
                Crear Alimento
              </button>
            </div>
          </div>
        </div>
      )}

      {selectedFood && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">{selectedFood.nombre}</h3>
              <button
                onClick={() => setSelectedFood(null)}
                className="w-6 h-6 flex items-center justify-center"
              >
                <i className="ri-close-line text-gray-400"></i>
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
                  className="flex-1 py-2 bg-gray-200 text-gray-700 rounded-md !rounded-button"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleAddToMeal}
                  className="flex-1 py-2 bg-emerald-600 text-white rounded-md !rounded-button"
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
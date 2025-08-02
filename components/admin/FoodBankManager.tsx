'use client';

import { useState, useEffect } from 'react';
import { Food } from '@/lib/types';
import { v4 as uuidv4 } from 'uuid';

export default function FoodBankManager() {
  const [foods, setFoods] = useState<Food[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    category: 'Frutas',
    calories_per_100g: '',
    protein_per_100g: '',
    carbs_per_100g: '',
    fat_per_100g: '',
    fiber_per_100g: '',
    sugar_per_100g: '',
    sodium_per_100g: '',
    image_url: '',
    is_custom: false
  });

  const categories = [
    'Frutas', 'Verduras', 'Proteínas', 'Carbohidratos', 'Grasas', 'Lácteos', 'Legumbres', 'Bebidas', 'Snacks'
  ];

  useEffect(() => {
    loadFoods();
  }, []);

  const loadFoods = async () => {
    setLoading(true);
    try {
      // Mock data completamente compatible con Food type
      const mockFoods: Food[] = [
        {
          id: '1',
          name: 'Manzana',
          category: 'Frutas',
          calories_per_100g: 52,
          protein_per_100g: 0.3,
          carbs_per_100g: 14.0,
          fat_per_100g: 0.2,
          fiber_per_100g: 2.4,
          sugar_per_100g: 10.4,
          sodium_per_100g: 1,
          image_url: '',
          is_custom: false,
          created_at: new Date().toISOString()
        },
        {
          id: '2',
          name: 'Pollo Pechuga',
          category: 'Proteínas',
          calories_per_100g: 165,
          protein_per_100g: 31.0,
          carbs_per_100g: 0.0,
          fat_per_100g: 3.6,
          fiber_per_100g: 0.0,
          sugar_per_100g: 0.0,
          sodium_per_100g: 74,
          image_url: '',
          is_custom: false,
          created_at: new Date().toISOString()
        },
        {
          id: '3',
          name: 'Arroz Integral',
          category: 'Carbohidratos',
          calories_per_100g: 123,
          protein_per_100g: 2.6,
          carbs_per_100g: 23.0,
          fat_per_100g: 0.9,
          fiber_per_100g: 1.8,
          sugar_per_100g: 0.4,
          sodium_per_100g: 5,
          image_url: '',
          is_custom: false,
          created_at: new Date().toISOString()
        },
        {
          id: '4',
          name: 'Brócoli',
          category: 'Verduras',
          calories_per_100g: 34,
          protein_per_100g: 2.8,
          carbs_per_100g: 7.0,
          fat_per_100g: 0.4,
          fiber_per_100g: 2.6,
          sugar_per_100g: 1.5,
          sodium_per_100g: 33,
          image_url: '',
          is_custom: false,
          created_at: new Date().toISOString()
        },
        {
          id: '5',
          name: 'Aguacate',
          category: 'Grasas',
          calories_per_100g: 160,
          protein_per_100g: 2.0,
          carbs_per_100g: 9.0,
          fat_per_100g: 15.0,
          fiber_per_100g: 7.0,
          sugar_per_100g: 0.7,
          sodium_per_100g: 7,
          image_url: '',
          is_custom: false,
          created_at: new Date().toISOString()
        }
      ];

      setFoods(mockFoods);
    } catch (error) {
      console.error('Error loading foods:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const foodData: Omit<Food, 'id' | 'created_at'> = {
      name: formData.name,
      category: formData.category,
      calories_per_100g: parseInt(formData.calories_per_100g),
      protein_per_100g: parseFloat(formData.protein_per_100g),
      carbs_per_100g: parseFloat(formData.carbs_per_100g),
      fat_per_100g: parseFloat(formData.fat_per_100g),
      fiber_per_100g: parseFloat(formData.fiber_per_100g) || 0,
      sugar_per_100g: parseFloat(formData.sugar_per_100g) || 0,
      sodium_per_100g: parseFloat(formData.sodium_per_100g) || 0,
      image_url: formData.image_url,
      is_custom: formData.is_custom || false
    };

    try {
      if (editingId) {
        const updatedFoods = foods.map(f => 
          f.id === editingId ? { ...f, ...foodData } : f
        );
        setFoods(updatedFoods);
      } else {
        const newFood: Food = {
          id: uuidv4(),
          ...foodData,
          created_at: new Date().toISOString()
        };
        setFoods([newFood, ...foods]);
      }

      resetForm();
    } catch (error) {
      console.error('Error saving food:', error);
    }
  };

  const handleEdit = (food: Food) => {
    setFormData({
      name: food.name,
      category: food.category,
      calories_per_100g: food.calories_per_100g.toString(),
      protein_per_100g: food.protein_per_100g.toString(),
      carbs_per_100g: food.carbs_per_100g.toString(),
      fat_per_100g: food.fat_per_100g.toString(),
      fiber_per_100g: food.fiber_per_100g?.toString() || '0',
      sugar_per_100g: food.sugar_per_100g?.toString() || '0',
      sodium_per_100g: food.sodium_per_100g?.toString() || '0',
      image_url: food.image_url || '',
      is_custom: food.is_custom || false
    });
    setEditingId(food.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('¿Estás seguro de que quieres eliminar este alimento?')) {
      try {
        setFoods(foods.filter(f => f.id !== id));
      } catch (error) {
        console.error('Error deleting food:', error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      category: 'Frutas',
      calories_per_100g: '',
      protein_per_100g: '',
      carbs_per_100g: '',
      fat_per_100g: '',
      fiber_per_100g: '',
      sugar_per_100g: '',
      sodium_per_100g: '',
      image_url: '',
      is_custom: false
    });
    setEditingId(null);
    setShowForm(false);
  };

  const filteredFoods = foods.filter(food => {
    const matchesSearch = food.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === '' || food.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const exportFoods = () => {
    const csvContent = [
      ['Nombre', 'Categoría', 'Calorías/100g', 'Proteína/100g', 'Carbos/100g', 'Grasas/100g', 'Fibra/100g', 'Azúcar/100g', 'Sodio/100g'],
      ...filteredFoods.map(food => [
        food.name,
        food.category,
        food.calories_per_100g,
        food.protein_per_100g,
        food.carbs_per_100g,
        food.fat_per_100g,
        food.fiber_per_100g || 0,
        food.sugar_per_100g || 0,
        food.sodium_per_100g || 0
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'banco_alimentos_vitalemente.csv';
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
        <h2 className="text-lg font-semibold text-gray-900">Banco de Alimentos</h2>
        <button
          onClick={() => setShowForm(true)}
          className="bg-red-600 text-white px-4 py-2 rounded-md text-sm !rounded-button hover:bg-red-700 transition-colors"
        >
          <i className="ri-add-line mr-2"></i>
          Nuevo Alimento
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg p-4 shadow-sm">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Buscar Alimento
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
              placeholder="Nombre del alimento..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Filtrar por Categoría
            </label>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
            >
              <option value="">Todas las categorías</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="flex space-x-3">
          <button
            onClick={() => {setSearchTerm(''); setFilterCategory('');}}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md text-sm !rounded-button"
          >
            Limpiar Filtros
          </button>
          <button
            onClick={exportFoods}
            className="px-4 py-2 bg-green-600 text-white rounded-md text-sm !rounded-button"
          >
            <i className="ri-download-line mr-2"></i>
            Exportar CSV
          </button>
        </div>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4 max-h-96 overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">
                {editingId ? 'Editar Alimento' : 'Nuevo Alimento'}
              </h3>
              <button onClick={resetForm} className="w-6 h-6 flex items-center justify-center">
                <i className="ri-close-line text-gray-400"></i>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre del Alimento
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Categoría
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Calorías por 100g
                </label>
                <input
                  type="number"
                  value={formData.calories_per_100g}
                  onChange={(e) => setFormData({...formData, calories_per_100g: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Macronutrientes por 100g
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    step="0.1"
                    placeholder="Proteína (g)"
                    value={formData.protein_per_100g}
                    onChange={(e) => setFormData({...formData, protein_per_100g: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                    required
                  />
                  <input
                    type="number"
                    step="0.1"
                    placeholder="Carbos (g)"
                    value={formData.carbs_per_100g}
                    onChange={(e) => setFormData({...formData, carbs_per_100g: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                    required
                  />
                  <input
                    type="number"
                    step="0.1"
                    placeholder="Grasas (g)"
                    value={formData.fat_per_100g}
                    onChange={(e) => setFormData({...formData, fat_per_100g: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                    required
                  />
                  <input
                    type="number"
                    step="0.1"
                    placeholder="Fibra (g)"
                    value={formData.fiber_per_100g}
                    onChange={(e) => setFormData({...formData, fiber_per_100g: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Micronutrientes por 100g
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    step="0.1"
                    placeholder="Azúcar (g)"
                    value={formData.sugar_per_100g}
                    onChange={(e) => setFormData({...formData, sugar_per_100g: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  />
                  <input
                    type="number"
                    step="0.1"
                    placeholder="Sodio (mg)"
                    value={formData.sodium_per_100g}
                    onChange={(e) => setFormData({...formData, sodium_per_100g: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  URL de Imagen (opcional)
                </label>
                <input
                  type="url"
                  value={formData.image_url}
                  onChange={(e) => setFormData({...formData, image_url: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  placeholder="https://ejemplo.com/imagen.jpg"
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.is_custom}
                  onChange={(e) => setFormData({...formData, is_custom: e.target.checked})}
                  className="mr-2"
                />
                <label className="text-sm text-gray-700">Alimento Personalizado</label>
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 py-2 bg-gray-200 text-gray-700 rounded-md !rounded-button"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-red-600 text-white rounded-md !rounded-button"
                >
                  {editingId ? 'Actualizar' : 'Crear'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Foods List */}
      <div className="space-y-4">
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium text-gray-900">
              Alimentos ({filteredFoods.length})
            </h3>
          </div>

          {filteredFoods.length === 0 ? (
            <div className="text-center py-8">
              <i className="ri-restaurant-line text-gray-400 text-4xl mb-2"></i>
              <p className="text-gray-600">No hay alimentos que coincidan con los filtros</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredFoods.map((food) => (
                <div key={food.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <i className="ri-restaurant-line text-green-600"></i>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{food.name}</h4>
                      <p className="text-sm text-gray-600">{food.category}</p>
                      <div className="flex items-center space-x-4 mt-1 text-xs text-gray-500">
                        <span>{food.calories_per_100g} cal</span>
                        <span>P: {food.protein_per_100g}g</span>
                        <span>C: {food.carbs_per_100g}g</span>
                        <span>G: {food.fat_per_100g}g</span>
                        {food.fiber_per_100g && <span>F: {food.fiber_per_100g}g</span>}
                        {food.sugar_per_100g && <span>Az: {food.sugar_per_100g}g</span>}
                        {food.sodium_per_100g && <span>Na: {food.sodium_per_100g}mg</span>}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleEdit(food)}
                      className="w-8 h-8 flex items-center justify-center text-blue-600 hover:bg-blue-50 rounded"
                    >
                      <i className="ri-edit-line"></i>
                    </button>
                    <button
                      onClick={() => handleDelete(food.id)}
                      className="w-8 h-8 flex items-center justify-center text-red-600 hover:bg-red-50 rounded"
                    >
                      <i className="ri-delete-bin-line"></i>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
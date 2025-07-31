
'use client';

import { useState, useEffect } from 'react';
import { Recipe } from '@/lib/types';
import { v4 as uuidv4 } from 'uuid';
import { dbOperations } from '@/lib/supabase';

export default function RecipeManager() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'desayuno',
    difficulty: 'facil' as 'facil' | 'intermedio' | 'avanzado',
    prep_time: '',
    calories: '',
    protein: '',
    carbs: '',
    fat: '',
    tags: '',
    pdf_url: '',
    image_url: '',
    is_active: true
  });

  const categories = [
    { value: 'desayuno', label: 'Desayuno' },
    { value: 'almuerzo', label: 'Almuerzo' },
    { value: 'cena', label: 'Cena' },
    { value: 'snacks', label: 'Snacks' },
    { value: 'batidos', label: 'Batidos' },
    { value: 'postres', label: 'Postres Saludables' }
  ];

  useEffect(() => {
    loadRecipes();
  }, []);

  const loadRecipes = async () => {
    setLoading(true);
    try {
      const mockRecipes = [
        {
          id: '1',
          title: 'Batido Proteico de Frutas',
          description: 'Batido rico en proteínas y antioxidantes',
          pdf_url: 'https://example.com/recipe1.pdf',
          image_url: 'https://readdy.ai/api/search-image?query=Healthy%20protein%20smoothie%20with%20fruits%2C%20colorful%20drink%2C%20glass%20cup%2C%20fresh%20ingredients%2C%20healthy%20eating%2C%20clean%20background%2C%20food%20photography%2C%20vibrant%20colors%2C%20nutritious%20beverage&width=400&height=300&seq=protein_smoothie&orientation=landscape',
          category: 'batidos',
          difficulty: 'facil' as const,
          prep_time: 10,
          calories: 250,
          macros: {
            protein: 25,
            carbs: 30,
            fat: 8
          },
          tags: ['proteina', 'frutas', 'facil', 'rapido'],
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: '2',
          title: 'Ensalada de Quinoa y Vegetales',
          description: 'Ensalada completa rica en fibra y proteína vegetal',
          pdf_url: 'https://example.com/recipe2.pdf',
          image_url: 'https://readdy.ai/api/search-image?query=Healthy%20quinoa%20salad%20with%20colorful%20vegetables%2C%20fresh%20ingredients%2C%20bowl%2C%20clean%20eating%2C%20nutritious%20meal%2C%20food%20photography%2C%20vibrant%20colors%2C%20balanced%20nutrition&width=400&height=300&seq=quinoa_salad&orientation=landscape',
          category: 'almuerzo',
          difficulty: 'intermedio' as const,
          prep_time: 25,
          calories: 320,
          macros: {
            protein: 12,
            carbs: 45,
            fat: 10
          },
          tags: ['quinoa', 'vegetales', 'fibra', 'vegetariano'],
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ];

      setRecipes(mockRecipes);
    } catch (error) {
      console.error('Error loading recipes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const recipeData: Omit<Recipe, 'id' | 'created_at' | 'updated_at'> = {
      title: formData.title,
      description: formData.description,
      pdf_url: formData.pdf_url,
      image_url: formData.image_url,
      category: formData.category,
      difficulty: formData.difficulty,
      prep_time: parseInt(formData.prep_time),
      calories: parseInt(formData.calories),
      macros: {
        protein: parseInt(formData.protein),
        carbs: parseInt(formData.carbs),
        fat: parseInt(formData.fat)
      },
      tags: formData.tags.split(',').map(tag => tag.trim()),
      is_active: formData.is_active
    };

    try {
      if (editingId) {
        const updatedRecipes = recipes.map(r =>
          r.id === editingId ? { ...r, ...recipeData } : r
        );
        setRecipes(updatedRecipes);
      } else {
        const newRecipe: Recipe = {
          id: uuidv4(),
          ...recipeData,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        setRecipes([newRecipe, ...recipes]);
      }

      resetForm();
    } catch (error) {
      console.error('Error saving recipe:', error);
    }
  };

  const handleEdit = (recipe: Recipe) => {
    setFormData({
      title: recipe.title,
      description: recipe.description,
      category: recipe.category,
      difficulty: recipe.difficulty,
      prep_time: recipe.prep_time.toString(),
      calories: recipe.calories.toString(),
      protein: recipe.macros.protein.toString(),
      carbs: recipe.macros.carbs.toString(),
      fat: recipe.macros.fat.toString(),
      tags: recipe.tags.join(', '),
      pdf_url: recipe.pdf_url,
      image_url: recipe.image_url,
      is_active: recipe.is_active
    });
    setEditingId(recipe.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('¿Estás seguro de que quieres eliminar esta receta?')) {
      try {
        setRecipes(recipes.filter(r => r.id !== id));
      } catch (error) {
        console.error('Error deleting recipe:', error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      category: 'desayuno',
      difficulty: 'facil',
      prep_time: '',
      calories: '',
      protein: '',
      carbs: '',
      fat: '',
      tags: '',
      pdf_url: '',
      image_url: '',
      is_active: true
    });
    setEditingId(null);
    setShowForm(false);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      const fakeUrl = `https://vitalemente-storage.com/recipes/${Date.now()}_${file.name}`;
      setFormData({ ...formData, pdf_url: fakeUrl });
      console.log('Archivo PDF simulado subido:', fakeUrl);
    } else {
      alert('Por favor selecciona un archivo PDF válido');
    }
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
        <h2 className="text-lg font-semibold text-gray-900">Gestión de Recetas</h2>
        <button
          onClick={() => setShowForm(true)}
          className="bg-red-600 text-white px-4 py-2 rounded-md text-sm !rounded-button hover:bg-red-700 transition-colors"
        >
          <i className="ri-add-line mr-2"></i>
          Nueva Receta
        </button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4 max-h-96 overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">
                {editingId ? 'Editar Receta' : 'Nueva Receta'}
              </h3>
              <button onClick={resetForm} className="w-6 h-6 flex items-center justify-center">
                <i className="ri-close-line text-gray-400"></i>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Título de la Receta
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descripción
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  rows={3}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Categoría
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  >
                    {categories.map((cat) => (
                      <option key={cat.value} value={cat.value}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Dificultad
                  </label>
                  <select
                    value={formData.difficulty}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        difficulty: e.target.value as 'facil' | 'intermedio' | 'avanzado'
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  >
                    <option value="facil">Fácil</option>
                    <option value="intermedio">Intermedio</option>
                    <option value="avanzado">Avanzado</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tiempo (min)
                  </label>
                  <input
                    type="number"
                    value={formData.prep_time}
                    onChange={(e) => setFormData({ ...formData, prep_time: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Calorías
                  </label>
                  <input
                    type="number"
                    value={formData.calories}
                    onChange={(e) => setFormData({ ...formData, calories: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Macronutrientes
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <input
                    type="number"
                    placeholder="Proteína (g)"
                    value={formData.protein}
                    onChange={(e) => setFormData({ ...formData, protein: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                    required
                  />
                  <input
                    type="number"
                    placeholder="Carbos (g)"
                    value={formData.carbs}
                    onChange={(e) => setFormData({ ...formData, carbs: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                    required
                  />
                  <input
                    type="number"
                    placeholder="Grasas (g)"
                    value={formData.fat}
                    onChange={(e) => setFormData({ ...formData, fat: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tags (separados por comas)
                </label>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  placeholder="proteína, fácil, rápido"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Archivo PDF de la Receta
                </label>
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleFileUpload}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                />
                {formData.pdf_url && (
                  <p className="text-xs text-green-600 mt-1">PDF cargado correctamente</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  URL de Imagen
                </label>
                <input
                  type="url"
                  value={formData.image_url}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  placeholder="https://ejemplo.com/imagen.jpg"
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                  className="mr-2"
                />
                <label className="text-sm text-gray-700">Receta Activa</label>
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

      {/* Recipes List */}
      <div className="space-y-4">
        {recipes.length === 0 ? (
          <div className="text-center py-8">
            <i className="ri-book-line text-gray-400 text-4xl mb-2"></i>
            <p className="text-gray-600">No hay recetas registradas</p>
          </div>
        ) : (
          recipes.map((recipe) => (
            <div key={recipe.id} className="bg-white rounded-lg p-4 shadow-sm">
              <div className="flex items-start space-x-4">
                <div className="w-20 h-16 bg-gray-100 rounded-lg overflow-hidden">
                  <img
                    src={recipe.image_url}
                    alt={recipe.title}
                    className="w-full h-full object-cover object-top"
                  />
                </div>

                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-medium text-gray-900">{recipe.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">{recipe.description}</p>
                      <div className="flex items-center space-x-4 mt-2">
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                          {recipe.category}
                        </span>
                        <span className="text-xs text-gray-500">
                          {recipe.prep_time} min
                        </span>
                        <span className="text-xs text-gray-500">
                          {recipe.calories} cal
                        </span>
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${
                            recipe.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {recipe.is_active ? 'Activa' : 'Inactiva'}
                        </span>
                      </div>
                      <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                        <span>P: {recipe.macros.protein}g</span>
                        <span>C: {recipe.macros.carbs}g</span>
                        <span>G: {recipe.macros.fat}g</span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => window.open(recipe.pdf_url, '_blank')}
                        className="w-8 h-8 flex items-center justify-center text-green-600 hover:bg-green-50 rounded"
                      >
                        <i className="ri-file-pdf-line"></i>
                      </button>
                      <button
                        onClick={() => handleEdit(recipe)}
                        className="w-8 h-8 flex items-center justify-center text-blue-600 hover:bg-blue-50 rounded"
                      >
                        <i className="ri-edit-line"></i>
                      </button>
                      <button
                        onClick={() => handleDelete(recipe.id)}
                        className="w-8 h-8 flex items-center justify-center text-red-600 hover:bg-red-50 rounded"
                      >
                        <i className="ri-delete-bin-line"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

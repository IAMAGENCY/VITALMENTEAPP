
'use client';

import { useState, useEffect } from 'react';
import { dbOperations } from '../../lib/supabase';

interface Supplement {
  id: string;
  name: string;
  category: string;
  price: number;
  original_price?: number;
  description: string;
  benefits: string[];
  ingredients: string;
  instructions: string;
  stock: number;
  image_url: string;
  is_active: boolean;
  created_at: string;
}

export default function SupplementManager() {
  const [supplements, setSupplements] = useState<Supplement[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingSupplement, setEditingSupplement] = useState<Supplement | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const loadSupplements = async () => {
    setLoading(true);
    try {
      const data = await dbOperations.getAllSupplements();
      setSupplements(data || []);
    } catch (error) {
      console.error('Error loading supplements:', error);
    } finally {
      setLoading(false);
    }
  };

  const initializeData = async () => {
    const initialSupplements = [
      {
        name: 'Proteína Whey Premium',
        category: 'Proteínas',
        price: 89900,
        original_price: 119900,
        description: 'Proteína de suero de alta calidad con aminoácidos esenciales para el desarrollo muscular.',
        benefits: ['Desarrollo muscular', 'Recuperación post-entreno', 'Alto valor biológico', 'Fácil digestión'],
        ingredients: 'Concentrado de proteína de suero, saborizantes naturales, stevia, enzimas digestivas',
        instructions: 'Mezclar 30g (1 scoop) con 250ml de agua o leche. Consumir después del entrenamiento.',
        stock: 45,
        image_url: 'https://readdy.ai/api/search-image?query=Premium%20whey%20protein%20powder%20container%2C%20realistic%20product%20photography%2C%20clean%20white%20background%2C%20professional%20lighting%2C%20high%20detail%2C%20nutritional%20supplement%2C%20fitness%20product%2C%20modern%20packaging%20design%2C%20centered%20composition&width=300&height=300&seq=prot1&orientation=squarish',
        is_active: true
      },
      {
        name: 'Multivitamínico Completo',
        category: 'Vitaminas',
        price: 45500,
        description: 'Fórmula completa con 25 vitaminas y minerales esenciales para el bienestar general.',
        benefits: ['Energía natural', 'Sistema inmune', 'Función cerebral', 'Salud ósea'],
        ingredients: 'Vitamina A, C, D3, E, complejo B, calcio, magnesio, zinc, hierro, selenio',
        instructions: 'Tomar 1 cápsula al día con el desayuno.',
        stock: 67,
        image_url: 'https://readdy.ai/api/search-image?query=Multivitamin%20bottle%20with%20colorful%20pills%2C%20realistic%20product%20photography%2C%20clean%20white%20background%2C%20professional%20lighting%2C%20vitamin%20supplement%2C%20health%20product%2C%20modern%20bottle%20design%2C%20high%20detail%20quality&width=300&height=300&seq=multi1&orientation=squarish',
        is_active: true
      },
      {
        name: 'Pre-Entreno Explosivo',
        category: 'Pre-Entreno',
        price: 67800,
        original_price: 89900,
        description: 'Fórmula avanzada para maximizar energía, fuerza y resistencia durante el entrenamiento.',
        benefits: ['Energía explosiva', 'Mejor rendimiento', 'Mayor resistencia', 'Focus mental'],
        ingredients: 'Cafeína anhidra, beta-alanina, creatina, taurina, tirosina, citrulina malato',
        instructions: 'Mezclar 15g con 300ml de agua. Consumir 30 minutos antes del entrenamiento.',
        stock: 32,
        image_url: 'https://readdy.ai/api/search-image?query=Pre-workout%20supplement%20powder%20container%2C%20energetic%20orange%20powder%2C%20realistic%20product%20photography%2C%20clean%20white%20background%2C%20fitness%20supplement%2C%20modern%20packaging%2C%20professional%20lighting%2C%20high%20energy%20product&width=300&height=300&seq=pre1&orientation=squarish',
        is_active: true
      },
      {
        name: 'Omega 3 Premium',
        category: 'Ácidos Grasos',
        price: 38900,
        description: 'Aceite de pescado de alta pureza rico en EPA y DHA para salud cardiovascular.',
        benefits: ['Salud cardiovascular', 'Función cerebral', 'Antiinflamatorio', 'Salud articular'],
        ingredients: 'Aceite de pescado concentrado (EPA 300mg, DHA 200mg), vitamina E',
        instructions: 'Tomar 2 cápsulas al día con las comidas.',
        stock: 54,
        image_url: 'https://readdy.ai/api/search-image?query=Omega%203%20fish%20oil%20capsules%20bottle%2C%20golden%20soft%20gels%2C%20realistic%20product%20photography%2C%20clean%20white%20background%2C%20health%20supplement%2C%20modern%20bottle%20design%2C%20professional%20lighting%2C%20high%20quality&width=300&height=300&seq=omega1&orientation=squarish',
        is_active: true
      },
      {
        name: 'Quemador de Grasa Natural',
        category: 'Quemadores',
        price: 72300,
        description: 'Fórmula natural termogénica para acelerar el metabolismo y quemar grasa.',
        benefits: ['Acelera metabolismo', 'Quema grasa', 'Suprime apetito', 'Aumenta energía'],
        ingredients: 'Extracto de té verde, L-carnitina, garcinia cambogia, pimienta cayena, cromo',
        instructions: 'Tomar 1 cápsula en ayunas y 1 antes del almuerzo.',
        stock: 28,
        image_url: 'https://readdy.ai/api/search-image?query=Natural%20fat%20burner%20supplement%20bottle%2C%20green%20capsules%2C%20realistic%20product%20photography%2C%20clean%20white%20background%2C%20weight%20loss%20supplement%2C%20modern%20design%2C%20professional%20lighting%2C%20fitness%20product&width=300&height=300&seq=burn1&orientation=squarish',
        is_active: true
      },
      {
        name: 'Creatina Monohidrato',
        category: 'Rendimiento',
        price: 34900,
        description: 'Creatina pura de alta calidad para aumentar fuerza y potencia muscular.',
        benefits: ['Aumenta fuerza', 'Mayor potencia', 'Recuperación rápida', 'Volumen muscular'],
        ingredients: 'Creatina monohidrato micronizada 100% pura',
        instructions: 'Mezclar 5g con agua o jugo. Consumir después del entrenamiento.',
        stock: 73,
        image_url: 'https://readdy.ai/api/search-image?query=Creatine%20monohydrate%20powder%20container%2C%20white%20crystalline%20powder%2C%20realistic%20product%20photography%2C%20clean%20white%20background%2C%20fitness%20supplement%2C%20modern%20packaging%2C%20professional%20lighting%2C%20strength%20building&width=300&height=300&seq=creat1&orientation=squarish',
        is_active: true
      },
      {
        name: 'BCAA 2:1:1',
        category: 'Aminoácidos',
        price: 56700,
        description: 'Aminoácidos de cadena ramificada para prevenir catabolismo y acelerar recuperación.',
        benefits: ['Previene catabolismo', 'Acelera recuperación', 'Reduce fatiga', 'Preserva músculo'],
        ingredients: 'L-Leucina, L-Isoleucina, L-Valina en proporción 2:1:1, electrolitos',
        instructions: 'Mezclar 10g con 500ml de agua. Consumir durante el entrenamiento.',
        stock: 41,
        image_url: 'https://readdy.ai/api/search-image?query=BCAA%20amino%20acid%20powder%20container%2C%20colorful%20powder%20blend%2C%20realistic%20product%20photography%2C%20clean%20white%20background%2C%20recovery%20supplement%2C%20modern%20packaging%2C%20professional%20lighting%2C%20fitness%20nutrition&width=300&height=300&seq=bcaa1&orientation=squarish',
        is_active: true
      },
      {
        name: 'Colágeno Hidrolizado',
        category: 'Salud',
        price: 48900,
        description: 'Colágeno hidrolizado para salud articular, piel, cabello y uñas.',
        benefits: ['Salud articular', 'Piel saludable', 'Cabello fuerte', 'Uñas resistentes'],
        ingredients: 'Colágeno hidrolizado tipo I y III, vitamina C, ácido hialurónico',
        instructions: 'Disolver 15g en agua, jugo o smoothie. Consumir diariamente.',
        stock: 39,
        image_url: 'https://readdy.ai/api/search-image?query=Hydrolyzed%20collagen%20powder%20container%2C%20fine%20white%20powder%2C%20realistic%20product%20photography%2C%20clean%20white%20background%2C%20beauty%20supplement%2C%20anti-aging%20product%2C%20modern%20design%2C%20professional%20lighting&width=300&height=300&seq=col1&orientation=squarish',
        is_active: true
      }
    ];

    try {
      for (const supplement of initialSupplements) {
        await dbOperations.addSupplement(supplement);
      }
      await loadSupplements();
      alert('¡Base de datos inicializada con 8 suplementos!');
    } catch (error) {
      console.error('Error initializing supplements data:', error);
      alert('Error al inicializar los datos');
    }
  };

  useEffect(() => {
    loadSupplements();
  }, []);

  const handleSave = async (supplementData: Omit<Supplement, 'id' | 'created_at'>) => {
    try {
      if (editingSupplement) {
        await dbOperations.updateSupplement(editingSupplement.id, supplementData);
      } else {
        await dbOperations.addSupplement(supplementData);
      }
      
      setEditingSupplement(null);
      setShowAddForm(false);
      await loadSupplements();
    } catch (error) {
      console.error('Error saving supplement:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este suplemento?')) {
      try {
        await dbOperations.deleteSupplement(id);
        await loadSupplements();
      } catch (error) {
        console.error('Error deleting supplement:', error);
      }
    }
  };

  const categories = Array.from(new Set(supplements.map(s => s.category)));
  const filteredSupplements = selectedCategory === 'all' 
    ? supplements 
    : supplements.filter(s => s.category === selectedCategory);

  const exportToCSV = () => {
    const csvContent = [
      ['Nombre', 'Categoría', 'Precio', 'Stock', 'Estado', 'Descripción'],
      ...filteredSupplements.map(supplement => [
        supplement.name,
        supplement.category,
        supplement.price.toString(),
        supplement.stock.toString(),
        supplement.is_active ? 'Activo' : 'Inactivo',
        supplement.description
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'suplementos.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return <div className="flex items-center justify-center p-8">Cargando...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold text-gray-900">Suplementos</h2>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={initializeData}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Inicializar Base
          </button>
          <button
            onClick={() => setShowAddForm(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Agregar Suplemento
          </button>
          <button
            onClick={exportToCSV}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Exportar CSV
          </button>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1 rounded-full text-sm transition-colors ${
              selectedCategory === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Todos ({supplements.length})
          </button>
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-3 py-1 rounded-full text-sm transition-colors ${
                selectedCategory === category
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {category} ({supplements.filter(s => s.category === category).length})
            </button>
          ))}
        </div>
      </div>

      {/* Lista de suplementos */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Producto
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Categoría
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Precio
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stock
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredSupplements.map((supplement) => (
                <tr key={supplement.id}>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <img
                        className="h-16 w-16 rounded-lg object-cover mr-4"
                        src={supplement.image_url}
                        alt={supplement.name}
                      />
                      <div>
                        <div className="text-sm font-medium text-gray-900">{supplement.name}</div>
                        <div className="text-sm text-gray-500">{supplement.description}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {supplement.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      ${supplement.price.toLocaleString()}
                    </div>
                    {supplement.original_price && (
                      <div className="text-sm text-gray-500 line-through">
                        ${supplement.original_price.toLocaleString()}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`text-sm font-medium ${
                      supplement.stock < 10 ? 'text-red-600' : 'text-gray-900'
                    }`}>
                      {supplement.stock} unidades
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      supplement.is_active 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {supplement.is_active ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button
                      onClick={() => setEditingSupplement(supplement)}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(supplement.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de formulario */}
      {(showAddForm || editingSupplement) && (
        <SupplementForm
          supplement={editingSupplement}
          onSave={handleSave}
          onClose={() => {
            setShowAddForm(false);
            setEditingSupplement(null);
          }}
        />
      )}
    </div>
  );
}

function SupplementForm({ supplement, onSave, onClose }: any) {
  const [formData, setFormData] = useState({
    name: supplement?.name || '',
    category: supplement?.category || '',
    price: supplement?.price || 0,
    original_price: supplement?.original_price || 0,
    description: supplement?.description || '',
    benefits: supplement?.benefits || [],
    ingredients: supplement?.ingredients || '',
    instructions: supplement?.instructions || '',
    stock: supplement?.stock || 0,
    image_url: supplement?.image_url || '',
    is_active: supplement?.is_active ?? true
  });

  const [newBenefit, setNewBenefit] = useState('');

  const addBenefit = () => {
    if (newBenefit.trim()) {
      setFormData(prev => ({ 
        ...prev,
        benefits: [...prev.benefits, newBenefit.trim()]
      }));
      setNewBenefit('');
    }
  };

  const removeBenefit = (index: number) => {
    setFormData(prev => ({ 
      ...prev,
      benefits: prev.benefits.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <h3 className="text-lg font-semibold mb-4">
          {supplement ? 'Editar Suplemento' : 'Agregar Suplemento'}
        </h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
              <input
                type="text"
                value={formData.category}
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Precio ($)</label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData(prev => ({ ...prev, price: parseInt(e.target.value) || 0 }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Precio Original ($)</label>
              <input
                type="number"
                value={formData.original_price}
                onChange={(e) => setFormData(prev => ({ ...prev, original_price: parseInt(e.target.value) || 0 }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
              <input
                type="number"
                value={formData.stock}
                onChange={(e) => setFormData(prev => ({ ...prev, stock: parseInt(e.target.value) || 0 }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              rows={3}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">URL de Imagen</label>
            <input
              type="url"
              value={formData.image_url}
              onChange={(e) => setFormData(prev => ({ ...prev, image_url: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Beneficios</label>
            <div className="space-y-2">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newBenefit}
                  onChange={(e) => setNewBenefit(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Agregar beneficio"
                />
                <button
                  type="button"
                  onClick={addBenefit}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Agregar
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.benefits.map((benefit, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                  >
                    {benefit}
                    <button
                      type="button"
                      onClick={() => removeBenefit(index)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ingredientes</label>
            <textarea
              value={formData.ingredients}
              onChange={(e) => setFormData(prev => ({ ...prev, ingredients: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              rows={2}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Instrucciones de Uso</label>
            <textarea
              value={formData.instructions}
              onChange={(e) => setFormData(prev => ({ ...prev, instructions: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              rows={2}
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="is_active"
              checked={formData.is_active}
              onChange={(e) => setFormData(prev => ({ ...prev, is_active: e.target.checked }))}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="is_active" className="ml-2 block text-sm text-gray-700">
              Producto activo (visible en tienda)
            </label>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              {supplement ? 'Actualizar' : 'Agregar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

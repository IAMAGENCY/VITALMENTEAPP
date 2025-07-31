
'use client';

import { useState, useEffect } from 'react';
import { dbOperations } from '../../lib/supabase';

interface MindfulnessResource {
  id: string;
  title: string;
  category: 'meditation' | 'relaxation' | 'breathing' | 'mindset';
  duration: number;
  difficulty: 'principiante' | 'intermedio' | 'avanzado';
  url: string;
  type: 'youtube' | 'spotify';
  description: string;
  is_active: boolean;
  created_at: string;
}

const MINDFULNESS_CATEGORIES = [
  { id: 'meditation', name: 'Meditación' },
  { id: 'relaxation', name: 'Relajación' },
  { id: 'breathing', name: 'Respiración' },
  { id: 'mindset', name: 'Mentalidad' }
];

const DIFFICULTIES = [
  { id: 'principiante', name: 'Principiante' },
  { id: 'intermedio', name: 'Intermedio' },
  { id: 'avanzado', name: 'Avanzado' }
];

export default function MindfulnessManager() {
  const [resources, setResources] = useState<MindfulnessResource[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingResource, setEditingResource] = useState<MindfulnessResource | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const loadResources = async () => {
    setLoading(true);
    try {
      const data = await dbOperations.getAllMindfulnessResources();
      setResources(data || []);
    } catch (error) {
      console.error('Error loading mindfulness resources:', error);
    } finally {
      setLoading(false);
    }
  };

  const initializeData = async () => {
    const initialResources = [
      // MEDITACIÓN
      {
        title: 'Meditación Guiada para Principiantes',
        category: 'meditation',
        duration: 10,
        difficulty: 'principiante',
        url: 'https://www.youtube.com/watch?v=ZToicYcHIOU',
        type: 'youtube',
        description: 'Introducción suave a la meditación con técnicas básicas',
        is_active: true
      },
      {
        title: 'Meditación Mindfulness Avanzada',
        category: 'meditation',
        duration: 25,
        difficulty: 'avanzado',
        url: 'https://www.youtube.com/watch?v=6p_yaNFSYao',
        type: 'youtube',
        description: 'Práctica profunda de mindfulness para meditadores experimentados',
        is_active: true
      },
      {
        title: 'Meditación Body Scan Completa',
        category: 'meditation',
        duration: 20,
        difficulty: 'intermedio',
        url: 'https://www.youtube.com/watch?v=15q-N-_kkrU',
        type: 'youtube',
        description: 'Escaneo corporal completo para relajación y conciencia',
        is_active: true
      },
      {
        title: 'Meditación para Dormir Profundo',
        category: 'meditation',
        duration: 30,
        difficulty: 'principiante',
        url: 'https://www.youtube.com/watch?v=aXItOY0sLRY',
        type: 'youtube',
        description: 'Meditación relajante para conciliar el sueño',
        is_active: true
      },
      {
        title: 'Meditación Vipassana Tradicional',
        category: 'meditation',
        duration: 45,
        difficulty: 'avanzado',
        url: 'https://www.youtube.com/watch?v=jPpUNAFHgxM',
        type: 'youtube',
        description: 'Práctica tradicional de meditación Vipassana',
        is_active: true
      },
      {
        title: 'Meditación de Amor y Compasión',
        category: 'meditation',
        duration: 18,
        difficulty: 'intermedio',
        url: 'https://www.youtube.com/watch?v=26UBqhJ4oPE',
        type: 'youtube',
        description: 'Cultivo de amor bondadoso y compasión universal',
        is_active: true
      },

      // RELAJACIÓN
      {
        title: 'Relajación Profunda Muscular',
        category: 'relaxation',
        duration: 15,
        difficulty: 'principiante',
        url: 'https://www.youtube.com/watch?v=1nePCqyJVzw',
        type: 'youtube',
        description: 'Técnica de relajación muscular progresiva',
        is_active: true
      },
      {
        title: 'Música Relajante para Dormir',
        category: 'relaxation',
        duration: 60,
        difficulty: 'principiante',
        url: 'https://open.spotify.com/playlist/37i9dQZF1DX3Ogo9pFvBkY',
        type: 'spotify',
        description: 'Playlist de música suave para un descanso reparador',
        is_active: true
      },
      {
        title: 'Sonidos de la Naturaleza',
        category: 'relaxation',
        duration: 120,
        difficulty: 'principiante',
        url: 'https://open.spotify.com/playlist/37i9dQZF1DX8ymr6UES7vc',
        type: 'spotify',
        description: 'Sonidos naturales para relajación profunda',
        is_active: true
      },
      {
        title: 'Relajación con Cuencos Tibetanos',
        category: 'relaxation',
        duration: 25,
        difficulty: 'intermedio',
        url: 'https://www.youtube.com/watch?v=eOL2q8leiLw',
        type: 'youtube',
        description: 'Relajación profunda con sonidos de cuencos tibetanos',
        is_active: true
      },
      {
        title: 'Técnica de Jacobson Completa',
        category: 'relaxation',
        duration: 35,
        difficulty: 'intermedio',
        url: 'https://www.youtube.com/watch?v=1ZYbU82GVz4',
        type: 'youtube',
        description: 'Relajación muscular progresiva según método Jacobson',
        is_active: true
      },
      {
        title: 'Playlist Zen Instrumental',
        category: 'relaxation',
        duration: 90,
        difficulty: 'principiante',
        url: 'https://open.spotify.com/playlist/37i9dQZF1DWZqd5JICZI0u',
        type: 'spotify',
        description: 'Música instrumental zen para meditación y relajación',
        is_active: true
      },

      // RESPIRACIÓN
      {
        title: 'Respiración 4-7-8 para Ansiedad',
        category: 'breathing',
        duration: 8,
        difficulty: 'principiante',
        url: 'https://www.youtube.com/watch?v=YRPh_GaiL8s',
        type: 'youtube',
        description: 'Técnica de respiración para reducir la ansiedad',
        is_active: true
      },
      {
        title: 'Respiración Box para Focus',
        category: 'breathing',
        duration: 12,
        difficulty: 'intermedio',
        url: 'https://www.youtube.com/watch?v=tEmt1Znux58',
        type: 'youtube',
        description: 'Respiración cuadrada para mejorar la concentración',
        is_active: true
      },
      {
        title: 'Pranayama Básico',
        category: 'breathing',
        duration: 18,
        difficulty: 'intermedio',
        url: 'https://www.youtube.com/watch?v=aNzAHkYDQoY',
        type: 'youtube',
        description: 'Técnicas básicas de pranayama para principiantes',
        is_active: true
      },
      {
        title: 'Respiración Wim Hof',
        category: 'breathing',
        duration: 15,
        difficulty: 'avanzado',
        url: 'https://www.youtube.com/watch?v=tybOi4hjZFQ',
        type: 'youtube',
        description: 'Método de respiración Wim Hof para energía y salud',
        is_active: true
      },
      {
        title: 'Respiración Holotrópica',
        category: 'breathing',
        duration: 30,
        difficulty: 'avanzado',
        url: 'https://www.youtube.com/watch?v=7w0b1SURupE',
        type: 'youtube',
        description: 'Técnica avanzada de respiración holotrópica',
        is_active: true
      },
      {
        title: 'Respiración para Dormir',
        category: 'breathing',
        duration: 10,
        difficulty: 'principiante',
        url: 'https://www.youtube.com/watch?v=DbDoBzGY3vo',
        type: 'youtube',
        description: 'Respiración relajante para conciliar el sueño',
        is_active: true
      },

      // MENTALIDAD
      {
        title: 'Afirmaciones Positivas Diarias',
        category: 'mindset',
        duration: 15,
        difficulty: 'principiante',
        url: 'https://www.youtube.com/watch?v=IdTMDpizis8',
        type: 'youtube',
        description: 'Afirmaciones poderosas para reprogramar la mente',
        is_active: true
      },
      {
        title: 'Meditación de Gratitud',
        category: 'mindset',
        duration: 12,
        difficulty: 'principiante',
        url: 'https://www.youtube.com/watch?v=6pLuUbBmXWo',
        type: 'youtube',
        description: 'Práctica de gratitud para transformar la perspectiva',
        is_active: true
      },
      {
        title: 'Mindfulness en Movimiento',
        category: 'mindset',
        duration: 20,
        difficulty: 'intermedio',
        url: 'https://www.youtube.com/watch?v=HmQkKS9N-xU',
        type: 'youtube',
        description: 'Práctica de mindfulness durante actividades cotidianas',
        is_active: true
      },
      {
        title: 'Visualización Creativa',
        category: 'mindset',
        duration: 22,
        difficulty: 'intermedio',
        url: 'https://www.youtube.com/watch?v=3vyZZTOWw-o',
        type: 'youtube',
        description: 'Técnicas de visualización para manifestar objetivos',
        is_active: true
      },
      {
        title: 'Reprogramación Mental',
        category: 'mindset',
        duration: 25,
        difficulty: 'avanzado',
        url: 'https://www.youtube.com/watch?v=lw3IPD0lBbU',
        type: 'youtube',
        description: 'Técnicas avanzadas para reprogramar patrones mentales',
        is_active: true
      },
      {
        title: 'Mindset de Abundancia',
        category: 'mindset',
        duration: 18,
        difficulty: 'intermedio',
        url: 'https://www.youtube.com/watch?v=fVWp_0q8oRA',
        type: 'youtube',
        description: 'Desarrollo de mentalidad de abundancia y prosperidad',
        is_active: true
      }
    ];

    try {
      for (const resource of initialResources) {
        await dbOperations.addMindfulnessResource(resource);
      }
      await loadResources();
      alert('¡Base de datos inicializada con 24 recursos de mindfulness!');
    } catch (error) {
      console.error('Error initializing mindfulness data:', error);
      alert('Error al inicializar los datos');
    }
  };

  useEffect(() => {
    loadResources();
  }, []);

  const handleSave = async (resourceData: Omit<MindfulnessResource, 'id' | 'created_at'>) => {
    try {
      if (editingResource) {
        await dbOperations.updateMindfulnessResource(editingResource.id, resourceData);
      } else {
        await dbOperations.addMindfulnessResource(resourceData);
      }
      
      setEditingResource(null);
      setShowAddForm(false);
      await loadResources();
    } catch (error) {
      console.error('Error saving mindfulness resource:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este recurso?')) {
      try {
        await dbOperations.deleteMindfulnessResource(id);
        await loadResources();
      } catch (error) {
        console.error('Error deleting mindfulness resource:', error);
      }
    }
  };

  const filteredResources = selectedCategory === 'all' 
    ? resources 
    : resources.filter(resource => resource.category === selectedCategory);

  const exportToCSV = () => {
    const csvContent = [
      ['Título', 'Categoría', 'Duración', 'Dificultad', 'URL', 'Tipo', 'Estado', 'Descripción'],
      ...filteredResources.map(resource => [
        resource.title,
        resource.category,
        resource.duration.toString(),
        resource.difficulty,
        resource.url,
        resource.type,
        resource.is_active ? 'Activo' : 'Inactivo',
        resource.description
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'recursos-mindfulness.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return <div className="flex items-center justify-center p-8">Cargando...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold text-gray-900">Recursos Mindfulness</h2>
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
            Agregar Recurso
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
            Todos ({resources.length})
          </button>
          {MINDFULNESS_CATEGORIES.map(category => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-3 py-1 rounded-full text-sm transition-colors ${
                selectedCategory === category.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {category.name} ({resources.filter(r => r.category === category.id).length})
            </button>
          ))}
        </div>
      </div>

      {/* Lista de recursos */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Recurso
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Categoría
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Duración
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tipo
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
              {filteredResources.map((resource) => (
                <tr key={resource.id}>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <div className="text-sm font-medium text-gray-900">{resource.title}</div>
                      <div className="text-sm text-gray-500">{resource.description}</div>
                      <div className="text-xs text-blue-600 mt-1 break-all">{resource.url}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                      {MINDFULNESS_CATEGORIES.find(c => c.id === resource.category)?.name}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {resource.duration} min
                    <div className="text-xs text-gray-500 capitalize">{resource.difficulty}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      resource.type === 'youtube' 
                        ? 'bg-red-100 text-red-800' 
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {resource.type === 'youtube' ? 'YouTube' : 'Spotify'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      resource.is_active 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {resource.is_active ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button
                      onClick={() => setEditingResource(resource)}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(resource.id)}
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
      {(showAddForm || editingResource) && (
        <ResourceForm
          resource={editingResource}
          onSave={handleSave}
          onClose={() => {
            setShowAddForm(false);
            setEditingResource(null);
          }}
        />
      )}
    </div>
  );
}

interface ResourceFormProps {
  resource: MindfulnessResource | null;
  onSave: (data: Omit<MindfulnessResource, 'id' | 'created_at'>) => void;
  onClose: () => void;
}

function ResourceForm({ resource, onSave, onClose }: ResourceFormProps) {
  const [formData, setFormData] = useState({
    title: resource?.title || '',
    category: resource?.category || 'meditation' as const,
    duration: resource?.duration || 10,
    difficulty: resource?.difficulty || 'principiante' as const,
    url: resource?.url || '',
    type: resource?.type || 'youtube' as const,
    description: resource?.description || '',
    is_active: resource?.is_active ?? true
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h3 className="text-lg font-semibold mb-4">
          {resource ? 'Editar Recurso' : 'Agregar Recurso'}
        </h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Título</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value as any }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {MINDFULNESS_CATEGORIES.map(category => (
                  <option key={category.id} value={category.id}>{category.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Dificultad</label>
              <select
                value={formData.difficulty}
                onChange={(e) => setFormData(prev => ({ ...prev, difficulty: e.target.value as any }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {DIFFICULTIES.map(difficulty => (
                  <option key={difficulty.id} value={difficulty.id}>{difficulty.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Duración (minutos)</label>
              <input
                type="number"
                value={formData.duration}
                onChange={(e) => setFormData(prev => ({ ...prev, duration: parseInt(e.target.value) || 0 }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                min="1"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as any }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="youtube">YouTube</option>
                <option value="spotify">Spotify</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">URL</label>
            <input
              type="url"
              value={formData.url}
              onChange={(e) => setFormData(prev => ({ ...prev, url: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="https://..."
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              rows={3}
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
              Recurso activo (visible para usuarios)
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
              {resource ? 'Actualizar' : 'Agregar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

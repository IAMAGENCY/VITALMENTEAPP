'use client';

import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

interface ContentItem {
  id: string;
  title: string;
  content: string;
  type: 'tip' | 'advice' | 'calculator_setting' | 'notification';
  category: string;
  section: 'alimentacion' | 'entrenamiento' | 'mindfulness' | 'general';
  priority: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export default function ContentManager() {
  const [contents, setContents] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedSection, setSelectedSection] = useState('alimentacion');
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    type: 'tip' as 'tip' | 'advice' | 'calculator_setting' | 'notification',
    category: '',
    section: 'alimentacion' as 'alimentacion' | 'entrenamiento' | 'mindfulness' | 'general',
    priority: '1',
    is_active: true
  });

  const sections = [
    { value: 'alimentacion', label: 'Alimentación', icon: 'ri-restaurant-line' },
    { value: 'entrenamiento', label: 'Entrenamiento', icon: 'ri-run-line' },
    { value: 'mindfulness', label: 'Mindfulness', icon: 'ri-heart-line' },
    { value: 'general', label: 'General', icon: 'ri-settings-line' }
  ];

  const contentTypes = [
    { value: 'tip', label: 'Consejo/Tip' },
    { value: 'advice', label: 'Recomendación' },
    { value: 'calculator_setting', label: 'Configuración Calculadora' },
    { value: 'notification', label: 'Notificación' }
  ];

  const categoriesBySection = {
    alimentacion: ['Consejos Nutricionales', 'Calculadora de Macros', 'Hidratación', 'Suplementos'],
    entrenamiento: ['Consejos de Entrenamiento', 'Rutinas', 'Recuperación', 'Motivación'],
    mindfulness: ['Meditación', 'Respiración', 'Relajación', 'Mentalidad Positiva'],
    general: ['Onboarding', 'Configuración', 'Notificaciones Push', 'Mensajes Sistema']
  };

  useEffect(() => {
    loadContents();
  }, []);

  const loadContents = async () => {
    setLoading(true);
    try {
      const mockContents = [
        {
          id: '1',
          title: 'Importancia de la Hidratación',
          content: 'Beber suficiente agua es fundamental para el metabolismo y la pérdida de peso. Recomendamos al menos 8 vasos al día.',
          type: 'tip' as const,
          category: 'Hidratación',
          section: 'alimentacion' as const,
          priority: 1,
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: '2',
          title: 'Factor de Actividad Moderado',
          content: '1.55 - Para personas que realizan ejercicio moderado 3-5 días por semana',
          type: 'calculator_setting' as const,
          category: 'Calculadora de Macros',
          section: 'alimentacion' as const,
          priority: 2,
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: '3',
          title: 'Técnica de Respiración 4-7-8',
          content: 'Inhala durante 4 segundos, mantén 7 segundos, exhala durante 8 segundos. Ideal para relajación.',
          type: 'advice' as const,
          category: 'Respiración',
          section: 'mindfulness' as const,
          priority: 1,
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: '4',
          title: 'Recordatorio de Entrenamiento',
          content: '¡Es hora de moverte! Recuerda que la constancia es clave para lograr tus objetivos.',
          type: 'notification' as const,
          category: 'Motivación',
          section: 'entrenamiento' as const,
          priority: 3,
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ];

      setContents(mockContents);
    } catch (error) {
      console.error('Error loading contents:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const contentData: Omit<ContentItem, 'id' | 'created_at' | 'updated_at'> = {
      title: formData.title,
      content: formData.content,
      type: formData.type,
      category: formData.category,
      section: formData.section,
      priority: parseInt(formData.priority),
      is_active: formData.is_active
    };

    try {
      if (editingId) {
        const updatedContents = contents.map(c => 
          c.id === editingId ? { ...c, ...contentData } : c
        );
        setContents(updatedContents);
      } else {
        const newContent: ContentItem = {
          id: uuidv4(),
          ...contentData,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        setContents([newContent, ...contents]);
      }

      resetForm();
    } catch (error) {
      console.error('Error saving content:', error);
    }
  };

  const handleEdit = (content: ContentItem) => {
    setFormData({
      title: content.title,
      content: content.content,
      type: content.type,
      category: content.category,
      section: content.section,
      priority: content.priority.toString(),
      is_active: content.is_active
    });
    setEditingId(content.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('¿Estás seguro de que quieres eliminar este contenido?')) {
      try {
        setContents(contents.filter(c => c.id !== id));
      } catch (error) {
        console.error('Error deleting content:', error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      content: '',
      type: 'tip',
      category: '',
      section: 'alimentacion',
      priority: '1',
      is_active: true
    });
    setEditingId(null);
    setShowForm(false);
  };

  const filteredContents = contents.filter(content => content.section === selectedSection);

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
        <h2 className="text-lg font-semibold text-gray-900">Gestión de Contenidos</h2>
        <button
          onClick={() => setShowForm(true)}
          className="bg-red-600 text-white px-4 py-2 rounded-md text-sm !rounded-button hover:bg-red-700 transition-colors"
        >
          <i className="ri-add-line mr-2"></i>
          Nuevo Contenido
        </button>
      </div>

      {/* Section Filter */}
      <div className="bg-white rounded-lg p-4 shadow-sm">
        <h3 className="font-medium text-gray-900 mb-4">Filtrar por Sección</h3>
        <div className="grid grid-cols-2 gap-3">
          {sections.map(section => (
            <button
              key={section.value}
              onClick={() => setSelectedSection(section.value as any)}
              className={`flex items-center justify-center p-3 rounded-lg transition-colors ${
                selectedSection === section.value
                  ? 'bg-red-100 text-red-700'
                  : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
              }`}
            >
              <i className={`${section.icon} mr-2`}></i>
              <span className="text-sm font-medium">{section.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4 max-h-96 overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">
                {editingId ? 'Editar Contenido' : 'Nuevo Contenido'}
              </h3>
              <button onClick={resetForm} className="w-6 h-6 flex items-center justify-center">
                <i className="ri-close-line text-gray-400"></i>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Título
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Contenido
                </label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({...formData, content: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  rows={4}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Sección
                  </label>
                  <select
                    value={formData.section}
                    onChange={(e) => setFormData({...formData, section: e.target.value as any, category: ''})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  >
                    {sections.map(section => (
                      <option key={section.value} value={section.value}>{section.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tipo
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({...formData, type: e.target.value as any})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  >
                    {contentTypes.map(type => (
                      <option key={type.value} value={type.value}>{type.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Categoría
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  required
                >
                  <option value="">Selecciona una categoría</option>
                  {categoriesBySection[formData.section].map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Prioridad (1 = más importante)
                </label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={formData.priority}
                  onChange={(e) => setFormData({...formData, priority: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  required
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({...formData, is_active: e.target.checked})}
                  className="mr-2"
                />
                <label className="text-sm text-gray-700">Contenido Activo</label>
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

      {/* Contents List */}
      <div className="space-y-4">
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium text-gray-900">
              {sections.find(s => s.value === selectedSection)?.label} ({filteredContents.length})
            </h3>
          </div>

          {filteredContents.length === 0 ? (
            <div className="text-center py-8">
              <i className="ri-article-line text-gray-400 text-4xl mb-2"></i>
              <p className="text-gray-600">No hay contenidos para esta sección</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredContents
                .sort((a, b) => a.priority - b.priority)
                .map((content) => (
                  <div key={content.id} className="flex items-start justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-medium text-gray-900">{content.title}</h4>
                          <p className="text-sm text-gray-600 mt-1">{content.content}</p>
                          <div className="flex items-center space-x-4 mt-2">
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              content.type === 'tip' ? 'bg-blue-100 text-blue-800' :
                              content.type === 'advice' ? 'bg-green-100 text-green-800' :
                              content.type === 'calculator_setting' ? 'bg-purple-100 text-purple-800' :
                              'bg-yellow-100 text-yellow-800'
                            }`}>
                              {contentTypes.find(t => t.value === content.type)?.label}
                            </span>
                            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                              {content.category}
                            </span>
                            <span className="text-xs text-gray-500">
                              Prioridad: {content.priority}
                            </span>
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              content.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {content.is_active ? 'Activo' : 'Inactivo'}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleEdit(content)}
                            className="w-8 h-8 flex items-center justify-center text-blue-600 hover:bg-blue-50 rounded"
                          >
                            <i className="ri-edit-line"></i>
                          </button>
                          <button
                            onClick={() => handleDelete(content.id)}
                            className="w-8 h-8 flex items-center justify-center text-red-600 hover:bg-red-50 rounded"
                          >
                            <i className="ri-delete-bin-line"></i>
                          </button>
                        </div>
                      </div>
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
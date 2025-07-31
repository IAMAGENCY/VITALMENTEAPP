
'use client';

import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

interface NutritionPlan {
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
  created_at: string;
  updated_at: string;
}

export default function NutritionPlansManager() {
  const [plans, setPlans] = useState<NutritionPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    objective: 'Pérdida de peso',
    duration: '',
    difficulty: 'Principiante' as 'Principiante' | 'Intermedio' | 'Avanzado',
    image_url: '',
    features: '',
    calories: '',
    meals: '',
    pdf_url: '',
    is_active: true
  });

  const objectives = [
    'Pérdida de peso',
    'Ganancia muscular', 
    'Mantenimiento',
    'Rendimiento deportivo',
    'Salud general'
  ];

  useEffect(() => {
    loadPlans();
  }, []);

  const loadPlans = async () => {
    setLoading(true);
    try {
      // TODOS LOS PLANES DE ALIMENTACIÓN QUE VEÍA EL USUARIO - ¡RESTAURADOS!
      const allPlans = [
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
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
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
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
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
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
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
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
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
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
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
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ];

      setPlans(allPlans);
    } catch (error) {
      console.error('Error loading nutrition plans:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const planData: Omit<NutritionPlan, 'id' | 'created_at' | 'updated_at'> = {
      name: formData.name,
      description: formData.description,
      objective: formData.objective,
      duration: formData.duration,
      difficulty: formData.difficulty,
      image_url: formData.image_url,
      features: formData.features.split(',').map(f => f.trim()),
      calories: formData.calories,
      meals: parseInt(formData.meals),
      pdf_url: formData.pdf_url,
      is_active: formData.is_active
    };

    try {
      if (editingId) {
        const updatedPlans = plans.map(p => 
          p.id === editingId ? { ...p, ...planData, updated_at: new Date().toISOString() } : p
        );
        setPlans(updatedPlans);
      } else {
        const newPlan: NutritionPlan = {
          id: uuidv4(),
          ...planData,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        setPlans([newPlan, ...plans]);
      }

      resetForm();
    } catch (error) {
      console.error('Error saving nutrition plan:', error);
    }
  };

  const handleEdit = (plan: NutritionPlan) => {
    setFormData({
      name: plan.name,
      description: plan.description,
      objective: plan.objective,
      duration: plan.duration,
      difficulty: plan.difficulty,
      image_url: plan.image_url,
      features: plan.features.join(', '),
      calories: plan.calories,
      meals: plan.meals.toString(),
      pdf_url: plan.pdf_url,
      is_active: plan.is_active
    });
    setEditingId(plan.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('¿Estás seguro de que quieres eliminar este plan nutricional?')) {
      try {
        setPlans(plans.filter(p => p.id !== id));
      } catch (error) {
        console.error('Error deleting nutrition plan:', error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      objective: 'Pérdida de peso',
      duration: '',
      difficulty: 'Principiante',
      image_url: '',
      features: '',
      calories: '',
      meals: '',
      pdf_url: '',
      is_active: true
    });
    setEditingId(null);
    setShowForm(false);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      const fakeUrl = `https://vitalemente-storage.com/plans/${Date.now()}_${file.name}`;
      setFormData({ ...formData, pdf_url: fakeUrl });
      console.log('Archivo PDF simulado subido:', fakeUrl);
    } else {
      alert('Por favor selecciona un archivo PDF válido');
    }
  };

  const exportPlans = () => {
    const csvContent = [
      ['Nombre', 'Descripción', 'Objetivo', 'Duración', 'Dificultad', 'Calorías', 'Comidas', 'Estado'],
      ...plans.map(plan => [
        plan.name,
        plan.description,
        plan.objective,
        plan.duration,
        plan.difficulty,
        plan.calories,
        plan.meals,
        plan.is_active ? 'Activo' : 'Inactivo'
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'planes_nutricionales_vitalemente.csv';
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
        <h2 className="text-lg font-semibold text-gray-900">Gestión de Planes Nutricionales</h2>
        <button
          onClick={() => setShowForm(true)}
          className="bg-red-600 text-white px-4 py-2 rounded-md text-sm !rounded-button hover:bg-red-700 transition-colors"
        >
          <i className="ri-add-line mr-2"></i>
          Nuevo Plan
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg p-4 shadow-sm">
        <div className="flex justify-between items-center">
          <h3 className="font-medium text-gray-900">Planes Disponibles ({plans.length})</h3>
          <button
            onClick={exportPlans}
            className="bg-green-600 text-white px-4 py-2 rounded-md text-sm !rounded-button hover:bg-green-700 transition-colors"
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
                {editingId ? 'Editar Plan Nutricional' : 'Nuevo Plan Nutricional'}
              </h3>
              <button onClick={resetForm} className="w-6 h-6 flex items-center justify-center">
                <i className="ri-close-line text-gray-400"></i>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre del Plan
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
                  Descripción
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  rows={3}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Objetivo
                  </label>
                  <select
                    value={formData.objective}
                    onChange={(e) => setFormData({...formData, objective: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  >
                    {objectives.map(obj => (
                      <option key={obj} value={obj}>{obj}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Dificultad
                  </label>
                  <select
                    value={formData.difficulty}
                    onChange={(e) => setFormData({...formData, difficulty: e.target.value as 'Principiante' | 'Intermedio' | 'Avanzado'})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  >
                    <option value="Principiante">Principiante</option>
                    <option value="Intermedio">Intermedio</option>
                    <option value="Avanzado">Avanzado</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Duración
                  </label>
                  <input
                    type="text"
                    value={formData.duration}
                    onChange={(e) => setFormData({...formData, duration: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                    placeholder="8 semanas"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Número de Comidas
                  </label>
                  <input
                    type="number"
                    value={formData.meals}
                    onChange={(e) => setFormData({...formData, meals: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Calorías por Día
                </label>
                <input
                  type="text"
                  value={formData.calories}
                  onChange={(e) => setFormData({...formData, calories: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  placeholder="1,200-1,500 cal/día"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Características (separadas por comas)
                </label>
                <input
                  type="text"
                  value={formData.features}
                  onChange={(e) => setFormData({...formData, features: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  placeholder="Déficit calórico, 5 comidas al día, Macros balanceados"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  URL de Imagen
                </label>
                <input
                  type="url"
                  value={formData.image_url}
                  onChange={(e) => setFormData({...formData, image_url: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  placeholder="https://ejemplo.com/imagen.jpg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Archivo PDF del Plan
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

              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({...formData, is_active: e.target.checked})}
                  className="mr-2"
                />
                <label className="text-sm text-gray-700">Plan Activo</label>
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

      {/* Plans List */}
      <div className="space-y-4">
        {plans.length === 0 ? (
          <div className="text-center py-8">
            <i className="ri-file-list-line text-gray-400 text-4xl mb-2"></i>
            <p className="text-gray-600">No hay planes nutricionales registrados</p>
          </div>
        ) : (
          plans.map((plan) => (
            <div key={plan.id} className="bg-white rounded-lg p-4 shadow-sm">
              <div className="flex items-start space-x-4">
                <div className="w-20 h-16 bg-gray-100 rounded-lg overflow-hidden">
                  <img
                    src={plan.image_url}
                    alt={plan.name}
                    className="w-full h-full object-cover object-top"
                  />
                </div>

                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-medium text-gray-900">{plan.name}</h3>
                      <p className="text-sm text-gray-600 mt-1">{plan.description}</p>
                      <div className="flex items-center space-x-4 mt-2">
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                          {plan.objective}
                        </span>
                        <span className="text-xs text-gray-500">
                          {plan.duration}
                        </span>
                        <span className="text-xs text-gray-500">
                          {plan.calories}
                        </span>
                        <span className={`text-xs px-2 py-1 rounded-full ${plan.difficulty === 'Principiante' ? 'bg-green-100 text-green-800' : plan.difficulty === 'Intermedio' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
                          {plan.difficulty}
                        </span>
                        <span className={`text-xs px-2 py-1 rounded-full ${plan.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {plan.is_active ? 'Activo' : 'Inactivo'}
                        </span>
                      </div>
                      <div className="mt-2">
                        <p className="text-xs text-gray-500">{plan.meals} comidas incluidas</p>
                        <p className="text-xs text-gray-500">{plan.features.join(' • ')}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => window.open(plan.pdf_url, '_blank')}
                        className="w-8 h-8 flex items-center justify-center text-green-600 hover:bg-green-50 rounded"
                      >
                        <i className="ri-file-pdf-line"></i>
                      </button>
                      <button
                        onClick={() => handleEdit(plan)}
                        className="w-8 h-8 flex items-center justify-center text-blue-600 hover:bg-blue-50 rounded"
                      >
                        <i className="ri-edit-line"></i>
                      </button>
                      <button
                        onClick={() => handleDelete(plan.id)}
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

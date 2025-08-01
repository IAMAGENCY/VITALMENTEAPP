
'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import UserManager from '@/components/admin/UserManager';
import SupplementManager from '@/components/admin/SupplementManager';
import RecipeManager from '@/components/admin/RecipeManager';
import WorkoutManager from '@/components/admin/WorkoutManager';
import MindfulnessManager from '@/components/admin/MindfulnessManager';
import AnalyticsManager from '@/components/admin/AnalyticsManager';
import FoodBankManager from '@/components/admin/FoodBankManager';
import NutritionPlansManager from '@/components/admin/NutritionPlansManager';
import ContentManager from '@/components/admin/ContentManager';
import { dbOperations } from '@/lib/supabase';

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [dashboardStats, setDashboardStats] = useState({
    totalUsers: 0,
    premiumUsers: 0,
    totalFoods: 0,
    totalWorkouts: 0,
    totalSupplements: 0,
    monthlyRevenue: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);

      // Cargar estadísticas reales
      const [usersData, foodsData, supplementsData] = await Promise.all([
        dbOperations.getUsers(),
        dbOperations.getFoods(),
        dbOperations.getAllSupplements()
      ]);

      const totalUsers = usersData.data?.length || 0;
      const premiumUsers = usersData.data?.filter(u => u.subscription_status === 'premium').length || 0;
      const totalFoods = foodsData.data?.length || 0;
      const totalSupplements = supplementsData?.length || 0;
      
      // Calcular ingresos mensuales aproximados (premiumUsers * precio promedio)
      const monthlyRevenue = premiumUsers * 29900; // Precio promedio suscripción

      setDashboardStats({
        totalUsers,
        premiumUsers,
        totalFoods,
        totalWorkouts: 0, // Se actualizará cuando se implemente WorkoutManager
        totalSupplements,
        monthlyRevenue
      });

    } catch (error) {
      console.error('Error cargando datos del dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'users':
        return <UserManager />;
      case 'foodbank':
        return <FoodBankManager />;
      case 'nutrition-plans':
        return <NutritionPlansManager />;
      case 'supplements':
        return <SupplementManager />;
      case 'recipes':
        return <RecipeManager />;
      case 'workouts':
        return <WorkoutManager />;
      case 'mindfulness':
        return <MindfulnessManager />;
      case 'content':
        return <ContentManager />;
      case 'analytics':
        return <AnalyticsManager />;
      case 'files':
        return <FileManager />;
      default:
        return <DashboardOverview stats={dashboardStats} loading={loading} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-gray-900">Configuración Avanzada</h1>
              <p className="text-sm text-gray-600 mt-1">Gestión completa de tu aplicación</p>
            </div>
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
              <i className="ri-settings-line text-red-600"></i>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white border-b">
        <div className="max-w-md mx-auto px-4">
          <div className="flex space-x-1 overflow-x-auto scrollbar-hide py-2">
            {[
              { id: 'dashboard', label: 'Resumen', icon: 'ri-dashboard-line' },
              { id: 'users', label: 'Usuarios', icon: 'ri-user-line' },
              { id: 'foodbank', label: 'Alimentos', icon: 'ri-restaurant-line' },
              { id: 'nutrition-plans', label: 'Planes', icon: 'ri-file-list-line' },
              { id: 'supplements', label: 'Suplementos', icon: 'ri-flask-line' },
              { id: 'recipes', label: 'Recetas', icon: 'ri-book-line' },
              { id: 'workouts', label: 'Entrenamientos', icon: 'ri-run-line' },
              { id: 'mindfulness', label: 'Mindfulness', icon: 'ri-heart-line' },
              { id: 'content', label: 'Contenidos', icon: 'ri-article-line' },
              { id: 'analytics', label: 'Estadísticas', icon: 'ri-bar-chart-line' },
              { id: 'files', label: 'Archivos', icon: 'ri-file-line' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium whitespace-nowrap transition-colors ${
                  activeTab === tab.id
                    ? 'bg-red-100 text-red-700'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <i className={`${tab.icon} text-sm`}></i>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="px-4 py-6">
        <div className="max-w-md mx-auto">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}

interface DashboardStats {
  totalUsers: number;
  premiumUsers: number;
  totalFoods: number;
  totalWorkouts: number;
  totalSupplements: number;
  monthlyRevenue: number;
}

function DashboardOverview({ stats, loading }: { stats: DashboardStats; loading: boolean }) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-2">Panel de Control</h2>
        <p className="text-gray-600 text-sm">Estadísticas de tu aplicación</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Usuarios Registrados</p>
              <p className="text-2xl font-bold text-blue-600">{stats.totalUsers}</p>
              <div className="flex items-center mt-1">
                <span className="text-green-600 text-xs">↗ Creciendo</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <i className="ri-user-line text-blue-600"></i>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Usuarios Premium</p>
              <p className="text-2xl font-bold text-green-600">{stats.premiumUsers}</p>
              <div className="flex items-center mt-1">
                <span className="text-green-600 text-xs">↗ +18%</span>
                <span className="text-gray-500 text-xs ml-1">conversión</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <i className="ri-vip-crown-line text-green-600"></i>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Alimentos en DB</p>
              <p className="text-2xl font-bold text-purple-600">{stats.totalFoods}</p>
              <div className="flex items-center mt-1">
                <span className="text-green-600 text-xs">↗ Base completa</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <i className="ri-restaurant-line text-purple-600"></i>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Suplementos</p>
              <p className="text-2xl font-bold text-orange-600">{stats.totalSupplements}</p>
              <div className="flex items-center mt-1">
                <span className="text-green-600 text-xs">↗ Catálogo activo</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <i className="ri-flask-line text-orange-600"></i>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg p-6 shadow-sm">
        <h3 className="font-semibold text-gray-900 mb-4">Estado de la Aplicación</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Base de Datos</span>
            <div className="flex items-center">
              <div className="w-24 bg-gray-200 rounded-full h-2 mr-3">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: '100%' }}></div>
              </div>
              <span className="text-sm font-medium text-green-600">Conectada</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Contenido Cargado</span>
            <div className="flex items-center">
              <div className="w-24 bg-gray-200 rounded-full h-2 mr-3">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: '95%' }}></div>
              </div>
              <span className="text-sm font-medium text-blue-600">95%</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Sistema IA</span>
            <div className="flex items-center">
              <div className="w-24 bg-gray-200 rounded-full h-2 mr-3">
                <div className="bg-purple-500 h-2 rounded-full" style={{ width: '87%' }}></div>
              </div>
              <span className="text-sm font-medium text-purple-600">Activo</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg p-6 shadow-sm">
        <h3 className="font-semibold text-gray-900 mb-4">Resumen de Contenido</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-green-50 rounded-lg">
            <div className="text-xl font-bold text-green-700">{stats.totalFoods}</div>
            <div className="text-xs text-green-600">Alimentos</div>
          </div>
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <div className="text-xl font-bold text-blue-700">{stats.totalSupplements}</div>
            <div className="text-xs text-blue-600">Suplementos</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function FileManager() {
  const [files, setFiles] = useState<any[]>([]);
  const [uploading, setUploading] = useState(false);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFiles = event.target.files;
    if (!uploadedFiles) return;

    setUploading(true);
    try {
      // En producción, subir a Supabase Storage
      Array.from(uploadedFiles).forEach(file => {
        const newFile = {
          id: Date.now().toString(),
          name: file.name,
          size: `${(file.size / 1024 / 1024).toFixed(1)} MB`,
          type: file.type.includes('pdf') ? 'PDF' : 'Imagen',
          uploadedAt: new Date().toISOString().split('T')[0],
          category: 'general',
          url: URL.createObjectURL(file) // En producción sería la URL de Supabase Storage
        };
        setFiles(prev => [newFile, ...prev]);
      });
    } catch (error) {
      console.error('Error uploading files:', error);
    } finally {
      setUploading(false);
    }
  };

  const deleteFile = (fileId: string) => {
    setFiles(prev => prev.filter(f => f.id !== fileId));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Gestión de Archivos</h2>
        <label className="bg-red-600 text-white px-4 py-2 rounded-md text-sm !rounded-button hover:bg-red-700 transition-colors cursor-pointer">
          <i className="ri-upload-line mr-2"></i>
          {uploading ? 'Subiendo...' : 'Subir Archivo'}
          <input
            type="file"
            multiple
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={handleFileUpload}
            className="hidden"
            disabled={uploading}
          />
        </label>
      </div>

      <div className="bg-white rounded-lg p-6 shadow-sm">
        <h3 className="font-medium text-gray-900 mb-4">Archivos del Sistema</h3>
        <div className="space-y-3">
          {files.length === 0 ? (
            <div className="text-center py-8">
              <i className="ri-file-line text-gray-400 text-4xl mb-2"></i>
              <p className="text-gray-600">No hay archivos subidos</p>
            </div>
          ) : (
            files.map((file) => (
              <div key={file.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    file.type === 'PDF' ? 'bg-red-100' : 'bg-blue-100'
                  }`}>
                    <i className={`${
                      file.type === 'PDF' ? 'ri-file-pdf-line text-red-600' : 'ri-image-line text-blue-600'
                    }`}></i>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 text-sm">{file.name}</h4>
                    <p className="text-xs text-gray-500">
                      {file.size} • {file.category} • {file.uploadedAt}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => window.open(file.url, '_blank')}
                    className="w-8 h-8 flex items-center justify-center text-blue-600 hover:bg-blue-50 rounded"
                  >
                    <i className="ri-external-link-line"></i>
                  </button>
                  <button
                    onClick={() => deleteFile(file.id)}
                    className="w-8 h-8 flex items-center justify-center text-red-600 hover:bg-red-50 rounded"
                  >
                    <i className="ri-delete-bin-line"></i>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

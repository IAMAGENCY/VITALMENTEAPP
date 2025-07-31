
'use client';

import { useState } from 'react';
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

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState('dashboard');

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
        return <DashboardOverview />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-gray-900">Panel Maestro VitalMente</h1>
              <p className="text-sm text-gray-600 mt-1">Administración completa del sistema</p>
            </div>
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
              <i className="ri-admin-line text-red-600"></i>
            </div>
          </div>
        </div>
      </div>

      {/* Admin Tabs */}
      <div className="bg-white border-b">
        <div className="max-w-md mx-auto px-4">
          <div className="flex space-x-1 overflow-x-auto scrollbar-hide py-2">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: 'ri-dashboard-line' },
              { id: 'users', label: 'Usuarios', icon: 'ri-user-line' },
              { id: 'foodbank', label: 'Banco Alimentos', icon: 'ri-restaurant-line' },
              { id: 'nutrition-plans', label: 'Planes Nutrición', icon: 'ri-file-list-line' },
              { id: 'supplements', label: 'Suplementos', icon: 'ri-flask-line' },
              { id: 'recipes', label: 'Recetas', icon: 'ri-book-line' },
              { id: 'workouts', label: 'Entrenamientos', icon: 'ri-run-line' },
              { id: 'mindfulness', label: 'Mindfulness', icon: 'ri-heart-line' },
              { id: 'content', label: 'Contenidos', icon: 'ri-article-line' },
              { id: 'analytics', label: 'Analíticas', icon: 'ri-bar-chart-line' },
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

      {/* Content */}
      <div className="px-4 py-6">
        <div className="max-w-md mx-auto">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}

// Dashboard Overview Component
function DashboardOverview() {
  const quickStats = [
    { label: 'Total Usuarios', value: '127', change: '+15%', color: 'text-blue-600', bg: 'bg-blue-100' },
    { label: 'Alimentos en Banco', value: '45', change: '+8', color: 'text-green-600', bg: 'bg-green-100' },
    { label: 'Enlaces Entrenamientos', value: '67', change: '+12', color: 'text-purple-600', bg: 'bg-purple-100' },
    { label: 'Recursos Mindfulness', value: '34', change: '+5', color: 'text-orange-600', bg: 'bg-orange-100' }
  ];

  const recentActivity = [
    { action: 'Nuevo alimento agregado al banco', user: 'Admin', time: '5 min', icon: 'ri-restaurant-line' },
    { action: 'Plan nutricional actualizado', user: 'Sistema', time: '15 min', icon: 'ri-file-list-line' },
    { action: 'Enlace de entrenamiento añadido', user: 'Admin', time: '1h', icon: 'ri-run-line' },
    { action: 'Recurso mindfulness publicado', user: 'Admin', time: '2h', icon: 'ri-heart-line' }
  ];

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-2">Dashboard Principal</h2>
        <p className="text-gray-600 text-sm">Administración Total VitalMente</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-4">
        {quickStats.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{stat.label}</p>
                <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                <div className="flex items-center mt-1">
                  <span className="text-green-600 text-xs">{stat.change}</span>
                  <span className="text-gray-500 text-xs ml-1">este mes</span>
                </div>
              </div>
              <div className={`w-12 h-12 ${stat.bg} rounded-lg flex items-center justify-center`}>
                <i className={`ri-line-chart-line ${stat.color}`}></i>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <h3 className="font-semibold text-gray-900 mb-4">Acciones Rápidas</h3>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => setActiveTab('foodbank')}
            className="flex items-center justify-center p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
          >
            <i className="ri-restaurant-line text-green-600 mr-2"></i>
            <span className="text-sm font-medium text-green-600">Gestionar Alimentos</span>
          </button>
          <button
            onClick={() => setActiveTab('workouts')}
            className="flex items-center justify-center p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
          >
            <i className="ri-run-line text-blue-600 mr-2"></i>
            <span className="text-sm font-medium text-blue-600">Entrenamientos</span>
          </button>
          <button
            onClick={() => setActiveTab('mindfulness')}
            className="flex items-center justify-center p-3 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
          >
            <i className="ri-heart-line text-purple-600 mr-2"></i>
            <span className="text-sm font-medium text-purple-600">Mindfulness</span>
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className="flex items-center justify-center p-3 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
          >
            <i className="ri-bar-chart-line text-red-600 mr-2"></i>
            <span className="text-sm font-medium text-red-600">Ver Analíticas</span>
          </button>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <h3 className="font-semibold text-gray-900 mb-4">Actividad Reciente</h3>
        <div className="space-y-3">
          {recentActivity.map((activity, index) => (
            <div key={index} className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg">
              <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                <i className={`${activity.icon} text-gray-600 text-sm`}></i>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                <p className="text-xs text-gray-500">por {activity.user}</p>
              </div>
              <span className="text-xs text-gray-400">{activity.time}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Content Status Overview */}
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <h3 className="font-semibold text-gray-900 mb-4">Estado del Contenido</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Banco de Alimentos</span>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
              <span className="text-sm text-green-600">45 alimentos activos</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Enlaces de Entrenamiento</span>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
              <span className="text-sm text-green-600">67 enlaces activos</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Recursos Mindfulness</span>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
              <span className="text-sm text-green-600">34 recursos activos</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Planes Nutricionales</span>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></div>
              <span className="text-sm text-yellow-600">12 planes pendientes</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// File Manager Component
function FileManager() {
  const [files, setFiles] = useState([
    { name: 'receta_batido_proteico.pdf', size: '2.3 MB', type: 'PDF', uploadedAt: '2024-01-15', category: 'recetas' },
    { name: 'guia_suplementos.pdf', size: '1.8 MB', type: 'PDF', uploadedAt: '2024-01-14', category: 'suplementos' },
    { name: 'miniatura_entrenamiento.jpg', size: '456 KB', type: 'Imagen', uploadedAt: '2024-01-13', category: 'entrenamientos' }
  ]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFiles = event.target.files;
    if (uploadedFiles) {
      Array.from(uploadedFiles).forEach(file => {
        const newFile = {
          name: file.name,
          size: `${(file.size / 1024 / 1024).toFixed(1)} MB`,
          type: file.type.includes('pdf') ? 'PDF' : 'Imagen',
          uploadedAt: new Date().toISOString().split('T')[0],
          category: 'general'
        };
        setFiles(prev => [newFile, ...prev]);
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Gestión de Archivos</h2>
        <label className="bg-red-600 text-white px-4 py-2 rounded-md text-sm !rounded-button hover:bg-red-700 transition-colors cursor-pointer">
          <i className="ri-upload-line mr-2"></i>
          Subir Archivo
          <input
            type="file"
            multiple
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={handleFileUpload}
            className="hidden"
          />
        </label>
      </div>

      <div className="bg-white rounded-lg p-6 shadow-sm">
        <h3 className="font-medium text-gray-900 mb-4">Archivos Recientes</h3>
        <div className="space-y-3">
          {files.length === 0 ? (
            <div className="text-center py-8">
              <i className="ri-file-line text-gray-400 text-4xl mb-2"></i>
              <p className="text-gray-600">No hay archivos subidos</p>
            </div>
          ) : (
            files.map((file, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
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
                  <button className="w-8 h-8 flex items-center justify-center text-blue-600 hover:bg-blue-50 rounded">
                    <i className="ri-download-line"></i>
                  </button>
                  <button className="w-8 h-8 flex items-center justify-center text-red-600 hover:bg-red-50 rounded">
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

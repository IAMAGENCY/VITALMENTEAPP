'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import TabBar from '@/components/TabBar';

interface AdminLayoutProps {
  children: React.ReactNode;
  title: string;
  description?: string;
}

export default function AdminLayout({ children, title, description }: AdminLayoutProps) {
  const [activeTab, setActiveTab] = useState('dashboard');

  const adminTabs = [
    { id: 'dashboard', label: 'Dashboard', icon: 'ri-dashboard-line' },
    { id: 'users', label: 'Usuarios', icon: 'ri-user-line' },
    { id: 'supplements', label: 'Suplementos', icon: 'ri-flask-line' },
    { id: 'recipes', label: 'Recetas', icon: 'ri-book-line' },
    { id: 'workouts', label: 'Entrenamientos', icon: 'ri-run-line' },
    { id: 'mindfulness', label: 'Mindfulness', icon: 'ri-heart-line' },
    { id: 'analytics', label: 'Analíticas', icon: 'ri-bar-chart-line' },
    { id: 'files', label: 'Archivos', icon: 'ri-file-line' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="pt-16 pb-20">
        {/* Admin Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-md mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-xl font-bold text-gray-900">{title}</h1>
                {description && (
                  <p className="text-sm text-gray-600 mt-1">{description}</p>
                )}
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
              {adminTabs.map((tab) => (
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
            {children}
          </div>
        </div>
      </main>

      <TabBar />
    </div>
  );
}
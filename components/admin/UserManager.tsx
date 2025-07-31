
'use client';

import { useState, useEffect } from 'react';
import { User } from '@/lib/types';

export default function UserManager() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [filters, setFilters] = useState({
    objetivo: '',
    genero: '',
    actividad: '',
    edad_min: '',
    edad_max: ''
  });

  const [analytics, setAnalytics] = useState({
    totalUsers: 0,
    activeUsers: 0,
    averageAge: 0,
    genderDistribution: {} as Record<string, number>,
    objectiveDistribution: {} as Record<string, number>,
    activityDistribution: {} as Record<string, number>
  });

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const mockUsers = [
        {
          id: '1',
          nombre: 'Juan Pérez',
          email: 'juan@example.com',
          edad: 28,
          peso: 75,
          altura: 175,
          genero: 'masculino' as const,
          actividad: 'moderado',
          objetivo: 'ganar',
          experiencia: 'intermedio',
          condiciones: ['Ninguna'],
          preferencias: ['Fuerza', 'Cardio'],
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: '2',
          nombre: 'María García',
          email: 'maria@example.com',
          edad: 32,
          peso: 62,
          altura: 165,
          genero: 'femenino' as const,
          actividad: 'activo',
          objetivo: 'perder',
          experiencia: 'principiante',
          condiciones: ['Vegetariano'],
          preferencias: ['Yoga', 'Cardio'],
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ];

      setUsers(mockUsers);
      calculateAnalytics(mockUsers);
    } catch (error) {
      console.error('Error loading users:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateAnalytics = (userList: User[]) => {
    const totalUsers = userList.length;
    const activeUsers = userList.length; 
    const averageAge = userList.reduce((sum, user) => sum + user.edad, 0) / totalUsers;

    const genderDistribution = userList.reduce((acc, user) => {
      acc[user.genero] = (acc[user.genero] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const objectiveDistribution = userList.reduce((acc, user) => {
      acc[user.objetivo] = (acc[user.objetivo] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const activityDistribution = userList.reduce((acc, user) => {
      acc[user.actividad] = (acc[user.actividad] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    setAnalytics({
      totalUsers,
      activeUsers,
      averageAge: Math.round(averageAge),
      genderDistribution,
      objectiveDistribution,
      activityDistribution
    });
  };

  const filteredUsers = users.filter(user => {
    if (filters.objetivo && user.objetivo !== filters.objetivo) return false;
    if (filters.genero && user.genero !== filters.genero) return false;
    if (filters.actividad && user.actividad !== filters.actividad) return false;
    if (filters.edad_min && user.edad < parseInt(filters.edad_min)) return false;
    if (filters.edad_max && user.edad > parseInt(filters.edad_max)) return false;
    return true;
  });

  const exportUsers = () => {
    const csvContent = [
      ['Nombre', 'Email', 'Edad', 'Peso', 'Altura', 'Género', 'Actividad', 'Objetivo', 'Experiencia', 'Condiciones', 'Preferencias'],
      ...filteredUsers.map(user => [
        user.nombre,
        user.email,
        user.edad,
        user.peso,
        user.altura,
        user.genero,
        user.actividad,
        user.objetivo,
        user.experiencia,
        user.condiciones.join('; '),
        user.preferencias.join('; ')
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'usuarios_vitalemente.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleUserClick = (user: User) => {
    setSelectedUser(user);
    setShowUserModal(true);
  };

  const calculateIMC = (peso: number, altura: number) => {
    const alturaMetros = altura / 100;
    return (peso / (alturaMetros * alturaMetros)).toFixed(1);
  };

  const getIMCCategory = (imc: number) => {
    if (imc < 18.5) return { category: 'Bajo peso', color: 'text-blue-600' };
    if (imc < 25) return { category: 'Normal', color: 'text-green-600' };
    if (imc < 30) return { category: 'Sobrepeso', color: 'text-yellow-600' };
    return { category: 'Obesidad', color: 'text-red-600' };
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
      {/* Analytics Cards */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">{analytics.totalUsers}</div>
            <div className="text-sm text-gray-600">Total Usuarios</div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{analytics.averageAge}</div>
            <div className="text-sm text-gray-600">Edad Promedio</div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg p-4 shadow-sm">
        <h3 className="font-medium text-gray-900 mb-4">Filtros</h3>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Objetivo
            </label>
            <select
              value={filters.objetivo}
              onChange={(e) => setFilters({ ...filters, objetivo: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
            >
              <option value="">Todos</option>
              <option value="perder">Perder peso</option>
              <option value="mantener">Mantener peso</option>
              <option value="ganar">Ganar músculo</option>
              <option value="definir">Definir cuerpo</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Género
            </label>
            <select
              value={filters.genero}
              onChange={(e) => setFilters({ ...filters, genero: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
            >
              <option value="">Todos</option>
              <option value="masculino">Masculino</option>
              <option value="femenino">Femenino</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Actividad
            </label>
            <select
              value={filters.actividad}
              onChange={(e) => setFilters({ ...filters, actividad: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
            >
              <option value="">Todos</option>
              <option value="sedentario">Sedentario</option>
              <option value="ligero">Ligero</option>
              <option value="moderado">Moderado</option>
              <option value="activo">Activo</option>
              <option value="muy_activo">Muy Activo</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Edad
            </label>
            <div className="flex space-x-2">
              <input
                type="number"
                placeholder="Min"
                value={filters.edad_min}
                onChange={(e) => setFilters({ ...filters, edad_min: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
              />
              <input
                type="number"
                placeholder="Max"
                value={filters.edad_max}
                onChange={(e) => setFilters({ ...filters, edad_max: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
              />
            </div>
          </div>
        </div>

        <div className="mt-4 flex space-x-3">
          <button
            onClick={() => setFilters({ objetivo: '', genero: '', actividad: '', edad_min: '', edad_max: '' })}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md text-sm !rounded-button"
          >
            Limpiar Filtros
          </button>
          <button
            onClick={exportUsers}
            className="px-4 py-2 bg-red-600 text-white rounded-md text-sm !rounded-button"
          >
            <i className="ri-download-line mr-2"></i>
            Exportar CSV
          </button>
        </div>
      </div>

      {/* Users List */}
      <div className="bg-white rounded-lg p-4 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-medium text-gray-900">
            Usuarios ({filteredUsers.length})
          </h3>
        </div>

        <div className="space-y-3">
          {filteredUsers.length === 0 ? (
            <div className="text-center py-8">
              <i className="ri-user-line text-gray-400 text-4xl mb-2"></i>
              <p className="text-gray-600">No hay usuarios que coincidan con los filtros</p>
            </div>
          ) : (
            filteredUsers.map((user) => (
              <div
                key={user.id}
                className="p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={() => handleUserClick(user)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">{user.nombre}</h4>
                    <p className="text-sm text-gray-600">{user.email}</p>
                    <div className="flex items-center space-x-4 mt-1">
                      <span className="text-xs text-gray-500">
                        {user.edad} años • {user.genero}
                      </span>
                      <span className="text-xs text-gray-500 capitalize">
                        {user.objetivo}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-red-600">
                      IMC: {calculateIMC(user.peso, user.altura)}
                    </div>
                    <i className="ri-arrow-right-s-line text-gray-400"></i>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* User Detail Modal */}
      {showUserModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4 max-h-96 overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Perfil de {selectedUser.nombre}</h3>
              <button
                onClick={() => setShowUserModal(false)}
                className="w-6 h-6 flex items-center justify-center"
              >
                <i className="ri-close-line text-gray-400"></i>
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Email</label>
                  <p className="text-sm text-gray-900">{selectedUser.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Edad</label>
                  <p className="text-sm text-gray-900">{selectedUser.edad} años</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Peso</label>
                  <p className="text-sm text-gray-900">{selectedUser.peso} kg</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Altura</label>
                  <p className="text-sm text-gray-900">{selectedUser.altura} cm</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Género</label>
                  <p className="text-sm text-gray-900 capitalize">{selectedUser.genero}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Actividad</label>
                  <p className="text-sm text-gray-900 capitalize">{selectedUser.actividad}</p>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">IMC</label>
                <div className="flex items-center space-x-2 mt-1">
                  <span className="text-sm text-gray-900">
                    {calculateIMC(selectedUser.peso, selectedUser.altura)}
                  </span>
                  <span className={`text-sm ${getIMCCategory(parseFloat(calculateIMC(selectedUser.peso, selectedUser.altura))).color}`}>
                    ({getIMCCategory(parseFloat(calculateIMC(selectedUser.peso, selectedUser.altura))).category})
                  </span>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">Objetivo</label>
                <p className="text-sm text-gray-900 capitalize">{selectedUser.objetivo}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">Experiencia</label>
                <p className="text-sm text-gray-900 capitalize">{selectedUser.experiencia}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">Condiciones</label>
                <p className="text-sm text-gray-900">{selectedUser.condiciones.join(', ')}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">Preferencias</label>
                <p className="text-sm text-gray-900">{selectedUser.preferencias.join(', ')}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

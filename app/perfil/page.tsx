'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import TabBar from '@/components/TabBar';
import Link from 'next/link';
import { dbOperations } from '@/lib/supabase';

export default function PerfilPage() {
  const [userData, setUserData] = useState<any>(null);
  const [macros, setMacros] = useState<{
    calorias: number;
    proteinas: number;
    carbohidratos: number;
    grasas: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [connectionStatus, setConnectionStatus] = useState('Cargando...');
  const [checkingConnection, setCheckingConnection] = useState(true);

  useEffect(() => {
    loadUserData();

    // Mostrar mensaje de éxito si existe
    const successMessage = localStorage.getItem('vitalMenteMessage');
    if (successMessage) {
      setMessage(successMessage);
      localStorage.removeItem('vitalMenteMessage');
      setTimeout(() => setMessage(''), 3000);
    }
  }, []);

  const testConnection = async () => {
    setCheckingConnection(true);
    try {
      setConnectionStatus('🔍 Verificando Supabase...');
      const { data, error } = await dbOperations.getUsers();

      if (error) {
        setConnectionStatus('❌ Error de conexión');
        console.error('💥 Error de conexión:', error);
        return false;
      } else {
        setConnectionStatus('✅ Conectado a Supabase');
        console.log('✅ Conexión exitosa con Supabase');
        return true;
      }
    } catch (error) {
      setConnectionStatus('❌ Sin conexión');
      console.error('💥 Error verificando conexión:', error);
      return false;
    } finally {
      setCheckingConnection(false);
    }
  };

  const loadUserData = async () => {
    try {
      // Primero verificar conexión
      const isConnected = await testConnection();

      if (isConnected) {
        // MÉTODO 1: Buscar por ID guardado
        const userId = localStorage.getItem('vitalMenteUserId');

        if (userId && !userId.startsWith('local-')) {
          console.log('🔍 Buscando usuario por ID:', userId);

          const { data: supabaseUser, error } = await dbOperations.getUserById(userId);

          if (!error && supabaseUser) {
            console.log('✅ Usuario encontrado en Supabase por ID:', supabaseUser);
            setUserData(supabaseUser);
            calculateMacros(supabaseUser);
            localStorage.setItem('vitalMenteUser', JSON.stringify(supabaseUser));
            setLoading(false);
            return;
          } else {
            console.log('❌ Usuario no encontrado por ID:', error);
            // Limpiar ID inválido
            localStorage.removeItem('vitalMenteUserId');
          }
        }

        // MÉTODO 2: Buscar por email desde datos locales
        const localUser = localStorage.getItem('vitalMenteUser');
        if (localUser) {
          const user = JSON.parse(localUser);
          console.log('📧 Buscando usuario por email:', user.email);

          setConnectionStatus('🔄 Sincronizando con Supabase...');

          const { data: users, error } = await dbOperations.getUsers();
          if (!error && users) {
            const existingUser = users.find(u => u.email === user.email);
            if (existingUser) {
              console.log('🔄 Usuario encontrado por email:', existingUser);
              setConnectionStatus('✅ Sincronizado con Supabase');
              setUserData(existingUser);
              calculateMacros(existingUser);
              localStorage.setItem('vitalMenteUserId', existingUser.id);
              localStorage.setItem('vitalMenteUser', JSON.stringify(existingUser));
              setLoading(false);
              return;
            }
          }
        }

        // MÉTODO 3: Si no hay datos locales, mostrar formulario de login
        console.log('❌ No se encontró usuario registrado');
        setConnectionStatus('❌ Usuario no encontrado');
      } else {
        // Sin conexión - usar datos locales si existen
        const localUser = localStorage.getItem('vitalMenteUser');
        if (localUser) {
          const user = JSON.parse(localUser);
          console.log('📱 Usando datos locales sin conexión');
          setConnectionStatus('📱 Modo offline');
          setUserData(user);
          calculateMacros(user);
        } else {
          console.log('❌ No hay datos locales disponibles');
          setConnectionStatus('❌ Sin datos');
        }
      }

      setLoading(false);
    } catch (error) {
      console.error('💥 Error completo cargando datos:', error);
      setConnectionStatus('❌ Error de conexión');

      // Fallback final a datos locales
      const localUser = localStorage.getItem('vitalMenteUser');
      if (localUser) {
        const user = JSON.parse(localUser);
        setUserData(user);
        calculateMacros(user);
        setConnectionStatus('📱 Modo offline');
      }

      setLoading(false);
    }
  };

  const calculateMacros = (user: any) => {
    const peso = parseFloat(user.peso);
    const altura = parseFloat(user.altura);
    const edad = parseInt(user.edad);

    let tmb;
    if (user.genero === 'masculino') {
      tmb = 88.362 + (13.397 * peso) + (4.799 * altura) - (5.677 * edad);
    } else {
      tmb = 447.593 + (9.247 * peso) + (3.098 * altura) - (4.330 * edad);
    }

    const factoresActividad = {
      sedentario: 1.2,
      ligero: 1.375,
      moderado: 1.55,
      activo: 1.725,
      muy_activo: 1.9
    };

    const calorias = tmb * factoresActividad[user.actividad as keyof typeof factoresActividad];

    let caloriasObjetivo = calorias;
    if (user.objetivo === 'perder') {
      caloriasObjetivo = calorias * 0.8;
    } else if (user.objetivo === 'ganar') {
      caloriasObjetivo = calorias * 1.2;
    }

    const proteinas = peso * 2.2;
    const grasas = caloriasObjetivo * 0.25 / 9;
    const carbohidratos = (caloriasObjetivo - (proteinas * 4) - (grasas * 9)) / 4;

    setMacros({
      calorias: Math.round(caloriasObjetivo),
      proteinas: Math.round(proteinas),
      carbohidratos: Math.round(carbohidratos),
      grasas: Math.round(grasas)
    });
  };

  const getIMC = () => {
    if (!userData) return null;
    const peso = parseFloat(userData.peso);
    const altura = parseFloat(userData.altura) / 100;
    const imc = peso / (altura * altura);
    return imc.toFixed(1);
  };

  const getIMCCategory = (imc: number) => {
    if (imc < 18.5) return { text: 'Bajo peso', color: 'text-blue-600' };
    if (imc < 25) return { text: 'Normal', color: 'text-green-600' };
    if (imc < 30) return { text: 'Sobrepeso', color: 'text-yellow-600' };
    return { text: 'Obesidad', color: 'text-red-600' };
  };

  const handleLogout = async () => {
    if (confirm('¿Estás seguro de que quieres cerrar sesión?')) {
      try {
        localStorage.removeItem('vitalMenteUser');
        localStorage.removeItem('vitalMenteUserId');
        localStorage.removeItem('vitalMenteMessage');
        setUserData(null);
        setMacros(null);
        setConnectionStatus('Sesión cerrada');
        console.log('👋 Sesión cerrada exitosamente');
      } catch (error) {
        console.error('Error cerrando sesión:', error);
      }
    }
  };

  const handleRefreshConnection = () => {
    loadUserData();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="pt-16 pb-20 px-4">
          <div className="max-w-md mx-auto">
            {/* Estado de carga */}
            <div className="text-center mt-12 mb-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Cargando perfil...</p>
              <div className="flex items-center justify-center gap-2 mt-2">
                <div className={`w-2 h-2 rounded-full ${connectionStatus.includes('✅') ? 'bg-green-500' : connectionStatus.includes('❌') ? 'bg-red-500' : 'bg-blue-500 animate-pulse'}`}></div>
                <span className="text-sm text-gray-500">{connectionStatus}</span>
              </div>
            </div>
          </div>
        </main>
        <TabBar />
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="pt-16 pb-20 px-4">
          <div className="max-w-md mx-auto text-center mt-12">
            {/* Estado de conexión */}
            <div className="mt-4 mb-6">
              <div className={`flex items-center justify-center gap-2 text-sm p-3 rounded-lg border ${connectionStatus.includes('✅') ? 'bg-green-50 border-green-200' : connectionStatus.includes('❌') ? 'bg-red-50 border-red-200' : connectionStatus.includes('📱') ? 'bg-blue-50 border-blue-200' : 'bg-gray-50 border-gray-200'}`}>
                <div className={`w-2 h-2 rounded-full ${connectionStatus.includes('✅') ? 'bg-green-500' : connectionStatus.includes('❌') ? 'bg-red-500' : connectionStatus.includes('📱') ? 'bg-blue-500' : 'bg-gray-500'}`}></div>
                <span className={`${connectionStatus.includes('✅') ? 'text-green-700' : connectionStatus.includes('❌') ? 'text-red-700' : connectionStatus.includes('📱') ? 'text-blue-700' : 'text-gray-700'}`}>{connectionStatus}</span>
                <button
                  onClick={handleRefreshConnection}
                  disabled={checkingConnection}
                  className="w-4 h-4 flex items-center justify-center ml-2"
                >
                  <i className={`ri-refresh-line text-xs ${checkingConnection ? 'animate-spin' : ''}`}></i>
                </button>
              </div>
            </div>

            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="ri-user-line text-gray-400 text-2xl"></i>
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Completa tu perfil
            </h2>
            <p className="text-gray-600 mb-6">
              Necesitas registrarte para personalizar tu experiencia
            </p>
            <Link href="/registro" className="bg-emerald-600 text-white px-6 py-3 rounded-md !rounded-button">
              Crear Perfil
            </Link>

            {/* Sistema de login para usuarios existentes */}
            <div className="mt-8 p-6 bg-white rounded-xl shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-4">¿Ya tienes una cuenta?</h3>
              <LoginForm onLoginSuccess={loadUserData} />
            </div>
          </div>
        </main>
        <TabBar />
      </div>
    );
  }

  const imc = getIMC();
  const imcCategory = imc ? getIMCCategory(parseFloat(imc)) : { text: 'N/A', color: 'text-gray-600' };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="pt-16 pb-20 px-4">
        <div className="max-w-md mx-auto">
          {/* Estado de conexión */}
          <div className="mt-4 mb-4">
            <div className={`flex items-center gap-2 text-sm p-3 rounded-lg ${connectionStatus.includes('✅') ? 'bg-green-50 border-green-200' : connectionStatus.includes('❌') ? 'bg-red-50 border-red-200' : connectionStatus.includes('📱') ? 'bg-blue-50 border-blue-200' : 'bg-gray-50 border-gray-200'} border`}>
              <div className={`w-2 h-2 rounded-full ${connectionStatus.includes('✅') ? 'bg-green-500' : connectionStatus.includes('❌') ? 'bg-red-500' : connectionStatus.includes('📱') ? 'bg-blue-500' : 'bg-gray-500'}`}></div>
              <span className={`${connectionStatus.includes('✅') ? 'text-green-700' : connectionStatus.includes('❌') ? 'text-red-700' : connectionStatus.includes('📱') ? 'text-blue-700' : 'text-gray-700'}`}>{connectionStatus}</span>
              <button
                onClick={handleRefreshConnection}
                disabled={checkingConnection}
                className="w-4 h-4 flex items-center justify-center ml-2"
              >
                <i className={`ri-refresh-line text-xs ${checkingConnection ? 'animate-spin' : ''}`}></i>
              </button>
            </div>
          </div>

          {/* Mensaje de éxito */}
          {message && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 mb-6">
              <div className="flex">
                <i className="ri-check-line text-emerald-600 mr-2"></i>
                <p className="text-emerald-700 text-sm">{message}</p>
              </div>
            </div>
          )}

          <div className="text-center mb-6">
            <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <i className="ri-user-line text-emerald-600 text-2xl"></i>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">
              {userData.nombre}
            </h1>
            <p className="text-gray-600 text-sm">
              {userData.edad} años • {userData.genero}
            </p>
            {userData.id && (
              <p className="text-gray-400 text-xs mt-1">
                ID: {userData.id.slice(0, 8)}...
              </p>
            )}
            {userData.email && (
              <p className="text-gray-500 text-xs mt-1">
                {userData.email}
              </p>
            )}
          </div>

          {/* Datos Físicos */}
          <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
            <h3 className="font-semibold text-gray-900 mb-4">Datos Físicos</h3>

            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">{userData.peso}</div>
                <div className="text-xs text-gray-600">kg</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">{userData.altura}</div>
                <div className="text-xs text-gray-600">cm</div>
              </div>
              <div className="text-center">
                <div className={`text-2xl font-bold ${imcCategory.color}`}>{imc}</div>
                <div className="text-xs text-gray-600">IMC</div>
              </div>
            </div>

            <div className="text-center">
              <span className={`text-sm font-medium ${imcCategory.color}`}>
                {imcCategory.text}
              </span>
            </div>
          </div>

          {/* Objetivos */}
          <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
            <h3 className="font-semibold text-gray-900 mb-4">Objetivos</h3>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Objetivo Principal</span>
                <span className="text-sm font-medium text-gray-900 capitalize">
                  {userData.objetivo.replace('_', ' ')}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Nivel de Actividad</span>
                <span className="text-sm font-medium text-gray-900 capitalize">
                  {userData.actividad.replace('_', ' ')}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Experiencia</span>
                <span className="text-sm font-medium text-gray-900 capitalize">
                  {userData.experiencia}
                </span>
              </div>
            </div>
          </div>

          {/* Macros Personalizados */}
          {macros && (
            <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
              <h3 className="font-semibold text-gray-900 mb-4">Tus Macros Diarios</h3>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="text-center p-4 bg-emerald-50 rounded-lg">
                  <div className="text-2xl font-bold text-emerald-600">
                    {macros.calorias}
                  </div>
                  <div className="text-sm text-gray-600">Calorías</div>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    {macros.proteinas}g
                  </div>
                  <div className="text-sm text-gray-600">Proteínas</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">
                    {macros.carbohidratos}g
                  </div>
                  <div className="text-sm text-gray-600">Carbohidratos</div>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">
                    {macros.grasas}g
                  </div>
                  <div className="text-sm text-gray-600">Grasas</div>
                </div>
              </div>
            </div>
          )}

          {/* Condiciones y Preferencias */}
          {(userData.condiciones?.length > 0 || userData.preferencias?.length > 0) && (
            <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
              <h3 className="font-semibold text-gray-900 mb-4">Preferencias</h3>

              {userData.condiciones?.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Condiciones Especiales</h4>
                  <div className="flex flex-wrap gap-2">
                    {userData.preferencias.map((preference: string) => (
                      <span key={preference} className="px-2 py-1 bg-emerald-100 text-emerald-800 text-xs rounded-full">
                        {preference}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {userData.preferencias?.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Preferencias de Entrenamiento</h4>
                  <div className="flex flex-wrap gap-2">
                    {userData.preferencias.map(preference => (
                      <span key={preference} className="px-2 py-1 bg-emerald-100 text-emerald-800 text-xs rounded-full">
                        {preference}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Acciones */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-4">Acciones</h3>

            <div className="space-y-3">
              <Link href="/registro" className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="flex items-center">
                  <i className="ri-edit-line text-gray-600 mr-3"></i>
                  <span className="text-sm font-medium text-gray-900">
                    Editar Perfil
                  </span>
                </div>
                <i className="ri-arrow-right-s-line text-gray-400"></i>
              </Link>

              <button
                onClick={handleLogout}
                className="flex items-center justify-between p-3 bg-red-50 rounded-lg hover:bg-red-100 transition-colors w-full"
              >
                <div className="flex items-center">
                  <i className="ri-logout-box-line text-red-600 mr-3"></i>
                  <span className="text-sm font-medium text-red-600">
                    Cerrar Sesión
                  </span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </main>

      <TabBar />
    </div>
  );
}

// Componente de login para usuarios existentes
function LoginForm({ onLoginSuccess }: { onLoginSuccess: () => void }) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      setError('Ingresa tu email');
      return;
    }

    setLoading(true);
    setError('');

    try {
      console.log('🔍 Buscando usuario por email:', email);
      const { data: users, error } = await dbOperations.getUsers();

      if (error) {
        setError('Error de conexión con la base de datos');
        return;
      }

      const user = users?.find(u => u.email.toLowerCase() === email.toLowerCase().trim());

      if (user) {
        console.log('✅ Usuario encontrado:', user);
        localStorage.setItem('vitalMenteUser', JSON.stringify(user));
        localStorage.setItem('vitalMenteUserId', user.id);
        localStorage.setItem('vitalMenteMessage', 'Bienvenido de nuevo!');
        onLoginSuccess();
      } else {
        setError('No se encontró una cuenta con este email');
      }
    } catch (error) {
      console.error('💥 Error en login:', error);
      setError('Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleLogin} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Email registrado
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setError('');
          }}
          placeholder="tu@email.com"
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
          disabled={loading}
        />
        {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
      </div>

      <button
        type="submit"
        disabled={loading || !email.trim()}
        className="w-full bg-emerald-600 text-white py-2 px-4 rounded-md !rounded-button disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? (
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            Buscando...
          </div>
        ) : (
          'Iniciar Sesión'
        )}
      </button>
    </form>
  );
}

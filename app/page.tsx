
'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import TabBar from '@/components/TabBar';
import UserDashboard from '@/components/UserDashboard';
import Link from 'next/link';

export default function HomePage() {
  const [userData, setUserData] = useState<any>(null);
  const [userId, setUserId] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = () => {
    try {
      const savedUser = localStorage.getItem('vitalMenteUser');
      const savedUserId = localStorage.getItem('vitalMenteUserId');

      if (savedUser) {
        const user = JSON.parse(savedUser);
        setUserData(user);
      }

      if (savedUserId && !savedUserId.startsWith('local-')) {
        setUserId(savedUserId);
      } else if (savedUser) {
        // Crear ID temporal para demo
        const demoId = 'user-demo-' + Date.now();
        setUserId(demoId);
      }
    } catch (error) {
      console.error('Error cargando datos del usuario:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="pt-16 pb-20 px-4">
          <div className="max-w-md mx-auto">
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Cargando...</p>
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
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-blue-50">
        <Header />
        
        <main className="pt-16 pb-20 px-4">
          <div className="max-w-md mx-auto">
            {/* Hero Section */}
            <div className="text-center mt-8 mb-12">
              <div className="w-24 h-24 bg-gradient-to-br from-emerald-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <i className="ri-heart-pulse-line text-white text-4xl"></i>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4" style={{ fontFamily: 'Pacifico, serif' }}>
                logo
              </h1>
              <p className="text-gray-600 text-lg mb-8">
                Tu compañero inteligente para una vida más saludable
              </p>
              
              <div className="space-y-4">
                <Link 
                  href="/registro"
                  className="w-full py-4 bg-gradient-to-r from-emerald-600 to-blue-600 text-white rounded-xl font-medium text-lg shadow-lg hover:shadow-xl transition-all !rounded-button flex items-center justify-center"
                >
                  <i className="ri-user-add-line mr-3 text-xl"></i>
                  Crear tu Perfil
                </Link>
                
                <button className="w-full py-3 bg-white text-gray-700 border border-gray-300 rounded-xl font-medium hover:bg-gray-50 transition-colors !rounded-button">
                  Explorar como invitado
                </button>
              </div>
            </div>

            {/* Features */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-white rounded-xl p-6 shadow-sm text-center">
                <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <i className="ri-restaurant-line text-emerald-600 text-xl"></i>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Nutrición</h3>
                <p className="text-gray-600 text-sm">
                  Tracking inteligente y planes personalizados
                </p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <i className="ri-run-line text-blue-600 text-xl"></i>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Entrenamiento</h3>
                <p className="text-gray-600 text-sm">
                  Rutinas adaptadas a tu nivel
                </p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <i className="ri-heart-line text-purple-600 text-xl"></i>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Mindfulness</h3>
                <p className="text-gray-600 text-sm">
                  Bienestar mental y relajación
                </p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm text-center">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <i className="ri-lightbulb-line text-orange-600 text-xl"></i>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">AI Insights</h3>
                <p className="text-gray-600 text-sm">
                  Análisis inteligente personalizado
                </p>
              </div>
            </div>

            {/* Value Proposition */}
            <div className="bg-gradient-to-r from-emerald-500 to-blue-500 rounded-xl p-6 text-white text-center">
              <h3 className="text-xl font-bold mb-2">
                ¿Por qué logo?
              </h3>
              <ul className="text-sm space-y-1 text-emerald-50">
                <li>✨ Tracking automático con IA</li>
                <li>📊 Insights personalizados diarios</li>
                <li>🎯 Recomendaciones inteligentes</li>
                <li>📈 Seguimiento de progreso real</li>
                <li>💊 Suplementación optimizada</li>
              </ul>
            </div>
          </div>
        </main>

        <TabBar />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="pt-16 pb-20">
        <div className="max-w-md mx-auto">
          {/* Bienvenida */}
          <div className="bg-white px-4 py-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  Hola, {userData.nombre} 👋
                </h1>
                <p className="text-gray-600 text-sm mt-1">
                  Tu progreso de hoy te está esperando
                </p>
              </div>
              <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                <i className="ri-user-smile-line text-emerald-600 text-xl"></i>
              </div>
            </div>
          </div>

          {/* Navegación Principal */}
          <div className="px-4 py-6">
            <div className="grid grid-cols-2 gap-4">
              <Link href="/alimentacion" className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="text-center">
                  <img 
                    src="https://readdy.ai/api/search-image?query=Fresh%20fruits%20and%20vegetables%20in%20a%20bowl%2C%20healthy%20nutrition%2C%20colorful%20fresh%20produce%2C%20clean%20eating%20concept%2C%20nutritional%20foods%2C%20vibrant%20healthy%20eating%2C%20organic%20food%20selection&width=80&height=80&seq=nutrition_icon&orientation=squarish"
                    alt="Alimentación"
                    className="w-16 h-16 mx-auto mb-3 rounded-lg object-cover"
                  />
                  <h3 className="font-semibold text-gray-900 text-sm mb-1">Alimentación</h3>
                  <p className="text-gray-600 text-xs mb-3">Consciente</p>
                  <p className="text-gray-500 text-xs leading-relaxed">
                    Calculadora de macros
                  </p>
                </div>
              </Link>

              <Link href="/entrenamiento" className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="text-center">
                  <img 
                    src="https://readdy.ai/api/search-image?query=Fitness%20workout%20equipment%20dumbbells%2C%20exercise%20training%2C%20gym%20equipment%2C%20strength%20training%2C%20fitness%20motivation%2C%20workout%20gear%2C%20athletic%20training%20tools&width=80&height=80&seq=workout_icon&orientation=squarish"
                    alt="Entrenamiento"
                    className="w-16 h-16 mx-auto mb-3 rounded-lg object-cover"
                  />
                  <h3 className="font-semibold text-gray-900 text-sm mb-1">Entrenamiento</h3>
                  <p className="text-gray-600 text-xs mb-3">por Objetivos</p>
                  <p className="text-gray-500 text-xs leading-relaxed">
                    Rutinas específicas para cada grupo muscular
                  </p>
                </div>
              </Link>

              <Link href="/mindfulness" className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="text-center">
                  <img 
                    src="https://readdy.ai/api/search-image?query=Meditation%20and%20mindfulness%2C%20peaceful%20zen%20setting%2C%20lotus%20flower%2C%20calm%20peaceful%20atmosphere%2C%20mental%20wellness%2C%20spiritual%20balance%2C%20relaxation%20concept&width=80&height=80&seq=mindfulness_icon&orientation=squarish"
                    alt="Mindfulness"
                    className="w-16 h-16 mx-auto mb-3 rounded-lg object-cover"
                  />
                  <h3 className="font-semibold text-gray-900 text-sm mb-1">Mindfulness</h3>
                  <p className="text-gray-600 text-xs mb-3">Meditación y bienestar mental</p>
                </div>
              </Link>

              <Link href="/tienda" className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="text-center">
                  <img 
                    src="https://readdy.ai/api/search-image?query=Health%20supplements%20bottles%20and%20pills%2C%20nutritional%20supplements%2C%20vitamins%20and%20minerals%2C%20wellness%20products%2C%20health%20store%20products%2C%20supplement%20nutrition&width=80&height=80&seq=supplements_icon&orientation=squarish"
                    alt="Tienda"
                    className="w-16 h-16 mx-auto mb-3 rounded-lg object-cover"
                  />
                  <h3 className="font-semibold text-gray-900 text-sm mb-1">Tienda de</h3>
                  <p className="text-gray-600 text-xs mb-3">Suplementos</p>
                  <p className="text-gray-500 text-xs leading-relaxed">
                    Suplementos naturales
                  </p>
                </div>
              </Link>
            </div>
          </div>

          {/* Acciones Rápidas */}
          <div className="px-4">
            <h2 className="font-semibold text-gray-900 mb-4">Acciones Rápidas</h2>
            <div className="space-y-3">
              <Link href="/alimentacion/registro" className="flex items-center justify-between bg-white p-4 rounded-lg shadow-sm">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                    <i className="ri-restaurant-line text-green-600"></i>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 text-sm">Registrar Comida</h4>
                    <p className="text-gray-500 text-xs">Añade tu última comida</p>
                  </div>
                </div>
                <i className="ri-arrow-right-s-line text-gray-400"></i>
              </Link>

              <Link href="/alimentacion/calculadora" className="flex items-center justify-between bg-white p-4 rounded-lg shadow-sm">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                    <i className="ri-calculator-line text-blue-600"></i>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 text-sm">Calcular Macros</h4>
                    <p className="text-gray-500 text-xs">Calcula tus macronutrientes</p>
                  </div>
                </div>
                <i className="ri-arrow-right-s-line text-gray-400"></i>
              </Link>

              <Link href="/perfil" className="flex items-center justify-between bg-white p-4 rounded-lg shadow-sm">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                    <i className="ri-user-settings-line text-purple-600"></i>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 text-sm">Ver Perfil</h4>
                    <p className="text-gray-500 text-xs">Revisa tu progreso</p>
                  </div>
                </div>
                <i className="ri-arrow-right-s-line text-gray-400"></i>
              </Link>
            </div>
          </div>

          {/* User Dashboard - Solo si hay userId */}
          {userId && (
            <div className="px-4 mt-6">
              <UserDashboard userId={userId} />
            </div>
          )}
        </div>
      </main>

      <TabBar />
    </div>
  );
}

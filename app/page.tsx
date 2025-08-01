
'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { User } from '@/lib/types';
import Header from '@/components/Header';
import TabBar from '@/components/TabBar';
import UserDashboard from '@/components/UserDashboard';
import Link from 'next/link';

export default function HomePage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [connectionError, setConnectionError] = useState(false);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    setLoading(true);
    setConnectionError(false);
    
    try {
      const { data: users, error } = await supabase
        .from('users')
        .select('*')
        .limit(1);

      if (error) {
        console.error('Error loading user:', error);
        setConnectionError(true);
      } else if (users && users.length > 0) {
        setUser(users[0]);
      }
    } catch (error) {
      console.error('Database connection error:', error);
      setConnectionError(true);
    } finally {
      setLoading(false);
    }
  };

  const retryConnection = () => {
    loadUser();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-black">
        <Header />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-400 mx-auto mb-4"></div>
            <p className="text-slate-300">Cargando VitalMente...</p>
          </div>
        </div>
      </div>
    );
  }

  if (connectionError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-black">
        <Header />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center p-8">
            <i className="ri-wifi-off-line text-amber-400 text-6xl mb-4"></i>
            <h2 className="text-xl font-bold text-white mb-2">Error de Conexión</h2>
            <p className="text-slate-300 mb-6">No se pudo conectar con la base de datos</p>
            <button
              onClick={retryConnection}
              className="bg-gradient-to-r from-amber-600 to-orange-600 text-white px-6 py-3 rounded-lg font-medium !rounded-button hover:from-amber-700 hover:to-orange-700 transition-all shadow-lg"
            >
              <i className="ri-refresh-line mr-2"></i>
              Intentar de Nuevo
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-black">
        <Header />
        <UserDashboard />
        <TabBar />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-black">
      <Header />
      
      <main className="pt-16 pb-20">
        <div className="max-w-md mx-auto px-4 py-8">
          {/* Hero Section */}
          <div className="text-center mb-8">
            <div className="w-24 h-24 bg-gradient-to-br from-amber-500 via-orange-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-amber-500/20">
              <i className="ri-heart-pulse-line text-white text-4xl"></i>
            </div>
            
            <h1 className="text-3xl font-bold text-white mb-3">
              Bienvenido a <span className="text-transparent bg-gradient-to-r from-amber-400 via-orange-400 to-red-400 bg-clip-text">VitalMente</span>
            </h1>
            
            <p className="text-slate-300 text-lg leading-relaxed">
              Tu <strong className="text-amber-400">Asistente Integral de Bienestar</strong> que combina alimentación consciente, 
              entrenamiento personalizado y mindfulness en una experiencia única.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm p-6 rounded-xl shadow-xl border border-slate-700">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center mb-3 shadow-lg shadow-emerald-500/20">
                <img 
                  src="https://readdy.ai/api/search-image?query=icon%2C%20healthy%20food%20bowl%20with%20vegetables%2C%20luxury%20professional%20design%2C%20dark%20background%2C%20golden%20accents%2C%20premium%20quality%2C%20the%20icon%20should%20take%20up%2070%25%20of%20the%20frame%2C%20isolated%20on%20dark%20background%2C%20centered%20composition%2C%20sophisticated%20aesthetic&width=100&height=100&seq=food_luxury&orientation=squarish"
                  alt="Alimentación"
                  className="w-8 h-8 object-cover rounded"
                />
              </div>
              <h3 className="font-semibold text-white mb-2">Nutrición Inteligente</h3>
              <p className="text-sm text-slate-400">Seguimiento inteligente de patrones alimentarios</p>
            </div>

            <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm p-6 rounded-xl shadow-xl border border-slate-700">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center mb-3 shadow-lg shadow-blue-500/20">
                <img 
                  src="https://readdy.ai/api/search-image?query=icon%2C%20fitness%20dumbbell%2C%20luxury%20professional%20design%2C%20dark%20background%2C%20golden%20accents%2C%20premium%20quality%2C%20the%20icon%20should%20take%20up%2070%25%20of%20the%20frame%2C%20isolated%20on%20dark%20background%2C%20centered%20composition%2C%20sophisticated%20aesthetic&width=100&height=100&seq=fit_luxury&orientation=squarish"
                  alt="Entrenamiento"
                  className="w-8 h-8 object-cover rounded"
                />
              </div>
              <h3 className="font-semibold text-white mb-2">Entreno Adaptativo</h3>
              <p className="text-sm text-slate-400">Planes adaptativos con herramientas inteligentes</p>
            </div>

            <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm p-6 rounded-xl shadow-xl border border-slate-700">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-violet-600 rounded-lg flex items-center justify-center mb-3 shadow-lg shadow-purple-500/20">
                <img 
                  src="https://readdy.ai/api/search-image?query=icon%2C%20meditation%20lotus%20pose%2C%20luxury%20professional%20design%2C%20dark%20background%2C%20golden%20accents%2C%20premium%20quality%2C%20the%20icon%20should%20take%20up%2070%25%20of%20the%20frame%2C%20isolated%20on%20dark%20background%2C%20centered%20composition%2C%20sophisticated%20aesthetic&width=100&height=100&seq=med_luxury&orientation=squarish"
                  alt="Mindfulness"
                  className="w-8 h-8 object-cover rounded"
                />
              </div>
              <h3 className="font-semibold text-white mb-2">Bienestar Mental</h3>
              <p className="text-sm text-slate-400">Meditación y técnicas de relajación</p>
            </div>

            <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm p-6 rounded-xl shadow-xl border border-slate-700">
              <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg flex items-center justify-center mb-3 shadow-lg shadow-amber-500/20">
                <img 
                  src="https://readdy.ai/api/search-image?query=icon%2C%20supplement%20bottle%20with%20capsules%2C%20luxury%20professional%20design%2C%20dark%20background%2C%20golden%20accents%2C%20premium%20quality%2C%20the%20icon%20should%20take%20up%2070%25%20of%20the%20frame%2C%20isolated%20on%20dark%20background%2C%20centered%20composition%2C%20sophisticated%20aesthetic&width=100&height=100&seq=supp_luxury&orientation=squarish"
                  alt="Suplementos"
                  className="w-8 h-8 object-cover rounded"
                />
              </div>
              <h3 className="font-semibold text-white mb-2">Suplementación</h3>
              <p className="text-sm text-slate-400">Recomendaciones basadas en tus necesidades</p>
            </div>
          </div>

          {/* AI Assistant Card */}
          <div className="bg-gradient-to-r from-amber-600/20 via-orange-600/20 to-red-600/20 backdrop-blur-sm p-6 rounded-xl border border-amber-500/30 mb-8 shadow-xl">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full flex items-center justify-center shadow-lg shadow-amber-500/30">
                <i className="ri-brain-line text-white text-xl"></i>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-white mb-1">Sistema de Bienestar Activo</h3>
                <p className="text-sm text-slate-300">
                  Herramientas inteligentes que analizan tus patrones y se adaptan a tu progreso para optimizar tu bienestar integral.
                </p>
              </div>
            </div>
          </div>

          {/* CTA Button */}
          <div className="space-y-4">
            <Link 
              href="/registro"
              className="w-full bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 text-white py-4 rounded-xl font-semibold text-lg !rounded-button hover:from-amber-700 hover:via-orange-700 hover:to-red-700 transition-all duration-300 transform hover:scale-[1.02] shadow-2xl shadow-amber-500/25 flex items-center justify-center"
            >
              <i className="ri-user-add-line mr-3 text-xl"></i>
              Comenzar mi Transformación
            </Link>

            <div className="text-center">
              <span className="text-sm text-slate-400">
                ¿Ya tienes cuenta?{' '}
                <Link href="/perfil" className="text-amber-400 font-medium hover:text-amber-300">
                  Acceder aquí
                </Link>
              </span>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-12 text-center">
            <div className="grid grid-cols-3 gap-6">
              <div className="bg-gradient-to-b from-slate-800/50 to-slate-900/50 p-4 rounded-xl backdrop-blur-sm border border-slate-700">
                <div className="text-2xl font-bold text-amber-400">500+</div>
                <div className="text-xs text-slate-400">Usuarios Activos</div>
              </div>
              <div className="bg-gradient-to-b from-slate-800/50 to-slate-900/50 p-4 rounded-xl backdrop-blur-sm border border-slate-700">
                <div className="text-2xl font-bold text-emerald-400">95%</div>
                <div className="text-xs text-slate-400">Satisfacción</div>
              </div>
              <div className="bg-gradient-to-b from-slate-800/50 to-slate-900/50 p-4 rounded-xl backdrop-blur-sm border border-slate-700">
                <div className="text-2xl font-bold text-purple-400">24/7</div>
                <div className="text-xs text-slate-400">Soporte IA</div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <TabBar />
    </div>
  );
}
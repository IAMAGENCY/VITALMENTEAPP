'use client';

import Header from '@/components/Header';
import TabBar from '@/components/TabBar';
import Link from 'next/link';

export default function EntrenamientoPage() {
  const categories = [
    {
      title: 'Tren Superior',
      description: 'Pecho, espalda, brazos y hombros',
      icon: 'ri-flashlight-line',
      color: 'bg-blue-500',
      href: '/entrenamiento/tren-superior',
      image: 'https://readdy.ai/api/search-image?query=icon%2C%203D%20cartoon%20style%2C%20upper%20body%20workout%20dumbbells%20and%20barbells%2C%20vibrant%20colors%20with%20soft%20gradients%2C%20minimalist%20design%2C%20smooth%20rounded%20shapes%2C%20subtle%20shading%2C%20no%20outlines%2C%20centered%20composition%2C%20isolated%20on%20white%20background%2C%20playful%20and%20friendly%20aesthetic%2C%20isometric%20perspective%2C%20high%20detail%20quality%2C%20clean%20and%20modern%20look%2C%20single%20object%20focus%2C%20the%20icon%20should%20take%20up%2070%25%20of%20the%20frame&width=200&height=200&seq=upper_body&orientation=squarish'
    },
    {
      title: 'Tren Inferior',
      description: 'Piernas, glúteos y pantorrillas',
      icon: 'ri-run-line',
      color: 'bg-green-500',
      href: '/entrenamiento/tren-inferior',
      image: 'https://readdy.ai/api/search-image?query=icon%2C%203D%20cartoon%20style%2C%20leg%20workout%20squat%20position%2C%20vibrant%20colors%20with%20soft%20gradients%2C%20minimalist%20design%2C%20smooth%20rounded%20shapes%2C%20subtle%20shading%2C%20no%20outlines%2C%20centered%20composition%2C%20isolated%20on%20white%20background%2C%20playful%20and%20friendly%20aesthetic%2C%20isometric%20perspective%2C%20high%20detail%20quality%2C%20clean%20and%20modern%20look%2C%20single%20object%20focus%2C%20the%20icon%20should%20take%20up%2070%25%20of%20the%20frame&width=200&height=200&seq=lower_body&orientation=squarish'
    },
    {
      title: 'Cardio',
      description: 'Ejercicios cardiovasculares',
      icon: 'ri-heart-pulse-line',
      color: 'bg-red-500',
      href: '/entrenamiento/cardio',
      image: 'https://readdy.ai/api/search-image?query=icon%2C%203D%20cartoon%20style%2C%20cardio%20heart%20with%20pulse%20wave%2C%20vibrant%20colors%20with%20soft%20gradients%2C%20minimalist%20design%2C%20smooth%20rounded%20shapes%2C%20subtle%20shading%2C%20no%20outlines%2C%20centered%20composition%2C%20isolated%20on%20white%20background%2C%20playful%20and%20friendly%20aesthetic%2C%20isometric%20perspective%2C%20high%20detail%20quality%2C%20clean%20and%20modern%20look%2C%20single%20object%20focus%2C%20the%20icon%20should%20take%20up%2070%25%20of%20the%20frame&width=200&height=200&seq=cardio&orientation=squarish'
    },
    {
      title: 'Funcional',
      description: 'Movimientos funcionales',
      icon: 'ri-battery-charge-line',
      color: 'bg-purple-500',
      href: '/entrenamiento/funcional',
      image: 'https://readdy.ai/api/search-image?query=icon%2C%203D%20cartoon%20style%2C%20functional%20training%20kettlebell%2C%20vibrant%20colors%20with%20soft%20gradients%2C%20minimalist%20design%2C%20smooth%20rounded%20shapes%2C%20subtle%20shading%2C%20no%20outlines%2C%20centered%20composition%2C%20isolated%20on%20white%20background%2C%20playful%20and%20friendly%20aesthetic%2C%20isometric%20perspective%2C%20high%20detail%20quality%2C%20clean%20and%20modern%20look%2C%20single%20object%20focus%2C%20the%20icon%20should%20take%20up%2070%25%20of%20the%20frame&width=200&height=200&seq=functional&orientation=squarish'
    }
  ];

  const quickWorkouts = [
    {
      title: 'Rutina Rápida 15 min',
      type: 'Cuerpo completo',
      duration: '15 min',
      difficulty: 'Principiante',
      youtubeId: 'dQw4w9WgXcQ'
    },
    {
      title: 'HIIT Intenso',
      type: 'Cardio',
      duration: '20 min',
      difficulty: 'Intermedio',
      youtubeId: 'dQw4w9WgXcQ'
    },
    {
      title: 'Fuerza Total',
      type: 'Fuerza',
      duration: '30 min',
      difficulty: 'Avanzado',
      youtubeId: 'dQw4w9WgXcQ'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="pt-16 pb-20 px-4">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8 mt-6">
            <div className="w-20 h-20 mx-auto mb-4 overflow-hidden rounded-full">
              <img
                src="https://readdy.ai/api/search-image?query=Fitness%20gym%20equipment%20and%20dumbbells%20arranged%20beautifully%2C%20vibrant%20colors%2C%20clean%20white%20background%2C%20workout%20photography%2C%20natural%20lighting%2C%20high%20quality%20realistic%20photo%2C%20exercise%20equipment%2C%20wellness%20concept%2C%20active%20lifestyle&width=200&height=200&seq=fitness_hero&orientation=squarish"
                alt="Entrenamiento"
                className="w-full h-full object-cover object-top"
              />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Entrenamiento por Objetivos
            </h1>
            <p className="text-gray-600 text-sm">
              Rutinas personalizadas para alcanzar tus metas
            </p>
          </div>

          {/* Categorías Principales */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            {categories.map((category, index) => (
              <Link
                key={index}
                href={category.href}
                className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="w-full h-24 mb-3 overflow-hidden rounded-lg">
                  <img
                    src={category.image}
                    alt={category.title}
                    className="w-full h-full object-cover object-top"
                  />
                </div>
                <h3 className="font-semibold text-gray-900 text-sm mb-1">
                  {category.title}
                </h3>
                <p className="text-xs text-gray-500 leading-tight">
                  {category.description}
                </p>
              </Link>
            ))}
          </div>

          {/* Rutinas Rápidas */}
          <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
            <h3 className="font-semibold text-gray-900 mb-4">Rutinas Rápidas</h3>
            
            <div className="space-y-3">
              {quickWorkouts.map((workout, index) => (
                <div
                  key={index}
                  className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                  onClick={() => window.open(`https://youtube.com/watch?v=${workout.youtubeId}`, '_blank')}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-900 text-sm">{workout.title}</h4>
                    <i className="ri-play-circle-line text-red-500 text-lg"></i>
                  </div>
                  <div className="flex items-center text-xs text-gray-600 space-x-4">
                    <span>{workout.type}</span>
                    <span>{workout.duration}</span>
                    <span className="px-2 py-1 bg-emerald-100 text-emerald-800 rounded-full">
                      {workout.difficulty}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Música para Entrenar */}
          <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
            <h3 className="font-semibold text-gray-900 mb-4">Música para Entrenar</h3>
            
            <div className="space-y-3">
              <div 
                className="flex items-center justify-between p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors cursor-pointer"
                onClick={() => window.open('https://open.spotify.com/playlist/37i9dQZF1DX76Wlfdnj7AP', '_blank')}
              >
                <div className="flex items-center">
                  <div className="w-8 h-8 flex items-center justify-center bg-green-600 rounded-full mr-3">
                    <i className="ri-music-line text-white text-sm"></i>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-900">Workout Mix</span>
                    <p className="text-xs text-gray-600">Música energética para entrenar</p>
                  </div>
                </div>
                <i className="ri-spotify-line text-green-600 text-lg"></i>
              </div>
              
              <div 
                className="flex items-center justify-between p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors cursor-pointer"
                onClick={() => window.open('https://open.spotify.com/playlist/37i9dQZF1DX0XUsuxWHRQd', '_blank')}
              >
                <div className="flex items-center">
                  <div className="w-8 h-8 flex items-center justify-center bg-green-600 rounded-full mr-3">
                    <i className="ri-music-line text-white text-sm"></i>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-900">Cardio Hits</span>
                    <p className="text-xs text-gray-600">Ritmo perfecto para cardio</p>
                  </div>
                </div>
                <i className="ri-spotify-line text-green-600 text-lg"></i>
              </div>
            </div>
          </div>

          {/* Consejos */}
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-4 text-white">
            <h3 className="font-semibold mb-2">Consejo del Día</h3>
            <p className="text-sm opacity-90">
              La constancia es clave. Es mejor entrenar 20 minutos todos los días 
              que 2 horas una vez a la semana.
            </p>
          </div>
        </div>
      </main>

      <TabBar />
    </div>
  );
}
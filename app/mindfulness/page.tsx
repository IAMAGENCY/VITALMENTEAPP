
'use client';

import Header from '@/components/Header';
import TabBar from '@/components/TabBar';
import Link from 'next/link';

export default function MindfulnessPage() {
  const categories = [
    {
      title: 'Meditación Guiada',
      description: 'Sesiones de meditación paso a paso',
      icon: 'ri-moon-line',
      color: 'bg-indigo-500',
      href: '/mindfulness/meditacion',
      image: 'https://readdy.ai/api/search-image?query=icon%2C%203D%20cartoon%20style%2C%20meditation%20lotus%20position%20peaceful%2C%20vibrant%20colors%20with%20soft%20gradients%2C%20minimalist%20design%2C%20smooth%20rounded%20shapes%2C%20subtle%20shading%2C%20no%20outlines%2C%20centered%20composition%2C%20isolated%20on%20white%20background%2C%20playful%20and%20friendly%20aesthetic%2C%20isometric%20perspective%2C%20high%20detail%20quality%2C%20clean%20and%20modern%20look%2C%20single%20object%20focus%2C%20the%20icon%20should%20take%20up%2070%25%20of%20the%20frame&width=200&height=200&seq=meditation&orientation=squarish'
    },
    {
      title: 'Respiración',
      description: 'Técnicas de respiración consciente',
      icon: 'ri-lung-line',
      color: 'bg-teal-500',
      href: '/mindfulness/respiracion',
      image: 'https://readdy.ai/api/search-image?query=icon%2C%203D%20cartoon%20style%2C%20breathing%20exercise%20lungs%20with%20air%20flow%2C%20vibrant%20colors%20with%20soft%20gradients%2C%20minimalist%20design%2C%20smooth%20rounded%20shapes%2C%20subtle%20shading%2C%20no%20outlines%2C%20centered%20composition%2C%20isolated%20on%20white%20background%2C%20playful%20and%20friendly%20aesthetic%2C%20isometric%20perspective%2C%20high%20detail%20quality%2C%20clean%20and%20modern%20look%2C%20single%20object%20focus%2C%20the%20icon%20should%20take%20up%2070%25%20of%20the%20frame&width=200&height=200&seq=breathing&orientation=squarish'
    },
    {
      title: 'Relajación',
      description: 'Ejercicios de relajación profunda',
      icon: 'ri-leaf-line',
      color: 'bg-green-500',
      href: '/mindfulness/relajacion',
      image: 'https://readdy.ai/api/search-image?query=icon%2C%203D%20cartoon%20style%2C%20relaxation%20spa%20stones%20zen%20garden%2C%20vibrant%20colors%20with%20soft%20gradients%2C%20minimalist%20design%2C%20smooth%20rounded%20shapes%2C%20subtle%20shading%2C%20no%20outlines%2C%20centered%20composition%2C%20isolated%20on%20white%20background%2C%20playful%20and%20friendly%20aesthetic%2C%20isometric%20perspective%2C%20high%20detail%20quality%2C%20clean%20and%20modern%20look%2C%20single%20object%20focus%2C%20the%20icon%20should%20take%20up%2070%25%20of%20the%20frame&width=200&height=200&seq=relaxation&orientation=squarish'
    },
    {
      title: 'Mentalidad Positiva',
      description: 'Desarrollo de pensamientos positivos',
      icon: 'ri-sun-line',
      color: 'bg-yellow-500',
      href: '/mindfulness/mentalidad',
      image: 'https://readdy.ai/api/search-image?query=icon%2C%203D%20cartoon%20style%2C%20positive%20mindset%20sun%20with%20smile%2C%20vibrant%20colors%20with%20soft%20gradients%2C%20minimalist%20design%2C%20smooth%20rounded%20shapes%2C%20subtle%20shading%2C%20no%20outlines%2C%20centered%20composition%2C%20isolated%20on%20white%20background%2C%20playful%20and%20friendly%20aesthetic%2C%20isometric%20perspective%2C%20high%20detail%20quality%2C%20clean%20and%20modern%20look%2C%20single%20object%20focus%2C%20the%20icon%20should%20take%20up%2070%25%20of%20the%20frame&width=200&height=200&seq=positive&orientation=squarish'
    }
  ];

  const quickSessions = [
    {
      title: 'Meditación 5 min',
      type: 'Principiante',
      duration: '5 min',
      description: 'Perfecta para empezar',
      youtubeId: 'dQw4w9WgXcQ'
    },
    {
      title: 'Respiración Profunda',
      type: 'Relajación',
      duration: '10 min',
      description: 'Reduce el estrés',
      youtubeId: 'dQw4w9WgXcQ'
    },
    {
      title: 'Mindfulness Completo',
      type: 'Avanzado',
      duration: '20 min',
      description: 'Conciencia plena',
      youtubeId: 'dQw4w9WgXcQ'
    }
  ];

  const spotifyPlaylists = [
    {
      title: 'Meditación Profunda',
      description: 'Sonidos relajantes para meditar',
      spotifyId: '37i9dQZF1DWZqd5JICZI0u'
    },
    {
      title: 'Sonidos de la Naturaleza',
      description: 'Ambiente natural para relajarse',
      spotifyId: '37i9dQZF1DX4PP3DA4J0N8'
    },
    {
      title: 'Música Zen',
      description: 'Melodías tranquilas y armoniosas',
      spotifyId: '37i9dQZF1DX3Ogo9pFvBkY'
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
                src="https://readdy.ai/api/search-image?query=Peaceful%20zen%20meditation%20garden%20with%20lotus%20flowers%2C%20smooth%20stones%2C%20candles%2C%20serene%20water%20features%2C%20soft%20natural%20lighting%2C%20clean%20white%20background%2C%20mindfulness%20photography%2C%20natural%20zen%20elements%2C%20high%20quality%20realistic%20photo%2C%20wellness%20spa%20concept%2C%20spiritual%20harmony%2C%20tranquil%20meditation%20space&width=200&height=200&seq=mindfulness_hero_new&orientation=squarish"
                alt="Mindfulness"
                className="w-full h-full object-cover object-top"
              />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Mindfulness
            </h1>
            <p className="text-gray-600 text-sm">
              Encuentra la paz interior y equilibrio mental
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

          {/* Sesiones Rápidas */}
          <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
            <h3 className="font-semibold text-gray-900 mb-4">Sesiones Rápidas</h3>
            
            <div className="space-y-3">
              {quickSessions.map((session, index) => (
                <div
                  key={index}
                  className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                  onClick={() => window.open(`https://youtube.com/watch?v=${session.youtubeId}`, '_blank')}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-900 text-sm">{session.title}</h4>
                    <i className="ri-play-circle-line text-red-500 text-lg"></i>
                  </div>
                  <div className="flex items-center text-xs text-gray-600 space-x-4">
                    <span>{session.type}</span>
                    <span>{session.duration}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{session.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Música Relajante */}
          <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
            <h3 className="font-semibold text-gray-900 mb-4">Música Relajante</h3>
            
            <div className="space-y-3">
              {spotifyPlaylists.map((playlist, index) => (
                <div 
                  key={index}
                  className="flex items-center justify-between p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors cursor-pointer"
                  onClick={() => window.open(`https://open.spotify.com/playlist/${playlist.spotifyId}`, '_blank')}
                >
                  <div className="flex items-center">
                    <div className="w-8 h-8 flex items-center justify-center bg-green-600 rounded-full mr-3">
                      <i className="ri-music-line text-white text-sm"></i>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-900">{playlist.title}</span>
                      <p className="text-xs text-gray-600">{playlist.description}</p>
                    </div>
                  </div>
                  <i className="ri-spotify-line text-green-600 text-lg"></i>
                </div>
              ))}
            </div>
          </div>

          {/* Ejercicio de Respiración Rápido */}
          <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
            <h3 className="font-semibold text-gray-900 mb-4">Ejercicio de Respiración</h3>
            
            <div className="text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="ri-lungs-line text-blue-600 text-3xl"></i>
              </div>
              
              <h4 className="font-medium text-gray-900 mb-2">Respiración 4-7-8</h4>
              <p className="text-sm text-gray-600 mb-4">
                Inhala 4 segundos, mantén 7 segundos, exhala 8 segundos
              </p>
              
              <button className="bg-blue-600 text-white px-6 py-2 rounded-md text-sm !rounded-button">
                Comenzar Ejercicio
              </button>
            </div>
          </div>

          {/* Reflexión Diaria */}
          <div className="bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl p-4 text-white">
            <h3 className="font-semibold mb-2">Reflexión del Día</h3>
            <p className="text-sm opacity-90">
              La mente es como el agua: cuando está agitada, es difícil ver. 
              Cuando está calmada, todo se vuelve claro.
            </p>
          </div>
        </div>
      </main>

      <TabBar />
    </div>
  );
}

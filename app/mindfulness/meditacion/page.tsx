
'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import TabBar from '@/components/TabBar';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

interface MindfulnessResource {
  id: string;
  title: string;
  description: string;
  url: string;
  type: 'meditation' | 'music' | 'video';
  duration: number;
  image_url: string;
  category: string;
  tags: string[];
  is_active: boolean;
}

export default function MeditacionPage() {
  const [resources, setResources] = useState<MindfulnessResource[]>([]);
  const [selectedDuration, setSelectedDuration] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadResources();
  }, []);

  const loadResources = async () => {
    try {
      const { data, error } = await supabase
        .from('mindfulness_resources')
        .select('*')
        .eq('category', 'meditation')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setResources(data || []);
    } catch (error) {
      console.error('Error loading meditation resources:', error);
      setResources([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredResources = resources.filter(resource => {
    if (selectedDuration === 'all') return true;
    if (selectedDuration === 'short') return resource.duration <= 15;
    if (selectedDuration === 'medium') return resource.duration > 15 && resource.duration <= 30;
    if (selectedDuration === 'long') return resource.duration > 30;
    return true;
  });

  const handleResourceClick = (resource: MindfulnessResource) => {
    window.open(resource.url, '_blank');
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'meditation': return 'ri-meditation-line';
      case 'music': return 'ri-music-line';
      case 'video': return 'ri-play-circle-line';
      default: return 'ri-play-line';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'meditation': return 'text-purple-600';
      case 'music': return 'text-green-600';
      case 'video': return 'text-blue-600';
      default: return 'text-gray-600';
    }
  };

  const getPlatformIcon = (url: string) => {
    if (url.includes('youtube.com') || url.includes('youtu.be')) return 'ri-youtube-line';
    if (url.includes('spotify.com')) return 'ri-spotify-line';
    return 'ri-link';
  };

  const getPlatformColor = (url: string) => {
    if (url.includes('youtube.com') || url.includes('youtu.be')) return 'text-red-600';
    if (url.includes('spotify.com')) return 'text-green-600';
    return 'text-gray-600';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="pt-16 pb-20 px-4">
        <div className="max-w-md mx-auto">
          {/* Header */}
          <div className="flex items-center mb-6 mt-4">
            <Link href="/mindfulness" className="mr-3">
              <div className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded-full">
                <i className="ri-arrow-left-line text-gray-600"></i>
              </div>
            </Link>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Guided Meditation</h1>
              <p className="text-sm text-gray-600">Step-by-step meditation sessions</p>
            </div>
          </div>

          {/* Hero Image */}
          <div className="w-full h-32 mb-6 rounded-xl overflow-hidden">
            <img
              src="https://readdy.ai/api/search-image?query=Peaceful%20meditation%20garden%20zen%20stones%2C%20serene%20meditation%20environment%2C%20mindfulness%20practice%20space%2C%20tranquil%20nature%20setting%2C%20spiritual%20meditation%2C%20inner%20peace%20sanctuary%2C%20contemplative%20atmosphere&width=400&height=200&seq=meditation_hero&orientation=landscape"
              alt="Guided Meditation"
              className="w-full h-full object-cover object-top"
            />
          </div>

          {/* Duration Filter */}
          <div className="flex space-x-2 mb-6 overflow-x-auto">
            {[
              { key: 'all', label: 'All' },
              { key: 'short', label: '≤15 min' },
              { key: 'medium', label: '15-30 min' },
              { key: 'long', label: '>30 min' }
            ].map((filter) => (
              <button
                key={filter.key}
                onClick={() => setSelectedDuration(filter.key)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                  selectedDuration === filter.key
                    ? 'bg-red-600 text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-100'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>

          {/* Resources List */}
          <div className="space-y-4">
            {filteredResources.length === 0 ? (
              <div className="text-center py-8">
                <i className="ri-search-line text-gray-400 text-4xl mb-2"></i>
                <p className="text-gray-600">No resources found for this duration</p>
              </div>
            ) : (
              filteredResources.map((resource) => (
                <div
                  key={resource.id}
                  className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => handleResourceClick(resource)}
                >
                  <div className="flex items-start space-x-4">
                    <div className="w-20 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={resource.image_url}
                        alt={resource.title}
                        className="w-full h-full object-cover object-top"
                      />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-gray-900 text-sm">
                          {resource.title}
                        </h3>
                        <div className="flex items-center space-x-2">
                          <i className={`${getTypeIcon(resource.type)} ${getTypeColor(resource.type)} text-lg`}></i>
                          <i className={`${getPlatformIcon(resource.url)} ${getPlatformColor(resource.url)} text-lg`}></i>
                        </div>
                      </div>
                      
                      <p className="text-xs text-gray-600 mb-3 leading-relaxed">
                        {resource.description}
                      </p>
                      
                      <div className="flex items-center space-x-3">
                        <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full">
                          {resource.duration} min
                        </span>
                        <div className="flex items-center space-x-1">
                          {resource.tags.slice(0, 2).map((tag, index) => (
                            <span key={index} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Quick Meditation Timer */}
          <div className="bg-white rounded-xl p-6 shadow-sm mt-6">
            <h3 className="font-semibold text-gray-900 mb-4">Temporizador de Meditación Rápida</h3>
            
            <div className="text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-purple-100 to-purple-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="ri-timer-line text-purple-600 text-3xl"></i>
              </div>
              
              <p className="text-sm text-gray-600 mb-4">
                Configura un temporizador para tu propia práctica de meditación
              </p>
              
              <div className="flex justify-center space-x-2 mb-4">
                {[5, 10, 15, 20].map((minutes) => (
                  <button
                    key={minutes}
                    onClick={() => {
                      const duration = minutes * 60 * 1000;
                      const startTime = Date.now();
                      
                      const timer = setInterval(() => {
                        const elapsed = Date.now() - startTime;
                        const remaining = Math.max(0, duration - elapsed);
                        
                        if (remaining === 0) {
                          clearInterval(timer);
                          alert(`¡Sesión de meditación de ${minutes} minutos completada! Has cultivado paz interior.`);
                        }
                      }, 1000);
                      
                      alert(`Meditación de ${minutes} minutos iniciada. Respira profundamente y enfócate en el momento presente.`);
                    }}
                    className="bg-purple-100 text-purple-800 px-3 py-2 rounded-md text-sm !rounded-button hover:bg-purple-200 transition-colors"
                  >
                    {minutes}m
                  </button>
                ))}
              </div>
              
              <button 
                onClick={() => {
                  const customTime = prompt('¿Cuántos minutos quieres meditar?', '10');
                  if (customTime && !isNaN(parseInt(customTime))) {
                    const minutes = parseInt(customTime);
                    const duration = minutes * 60 * 1000;
                    const startTime = Date.now();
                    
                    const timer = setInterval(() => {
                      const elapsed = Date.now() - startTime;
                      const remaining = Math.max(0, duration - elapsed);
                      
                      if (remaining === 0) {
                        clearInterval(timer);
                        alert(`¡Sesión de meditación de ${minutes} minutos completada!`);
                      }
                    }, 1000);
                    
                    alert(`Meditación personalizada de ${minutes} minutos iniciada.`);
                  }
                }}
                className="bg-purple-600 text-white px-6 py-2 rounded-md text-sm !rounded-button hover:bg-purple-700 transition-colors"
              >
                Iniciar Temporizador
              </button>
            </div>
          </div>

          {/* Benefits */}
          <div className="bg-gradient-to-r from-purple-500 to-indigo-600 rounded-xl p-4 text-white mt-6">
            <h3 className="font-semibold mb-2">🧘 Meditation Benefits</h3>
            <ul className="text-sm opacity-90 space-y-1">
              <li>• Reduces stress and anxiety levels</li>
              <li>• Improves focus and concentration</li>
              <li>• Enhances emotional regulation</li>
              <li>• Promotes better sleep quality</li>
            </ul>
          </div>
        </div>
      </main>
      
      <TabBar />
    </div>
  );
}

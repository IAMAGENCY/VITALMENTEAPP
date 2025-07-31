
'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import TabBar from '@/components/TabBar';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

interface RelaxationResource {
  id: string;
  title: string;
  description: string;
  url: string;
  type: 'audio' | 'video' | 'music';
  duration: number;
  image_url: string;
  category: string;
  tags: string[];
  technique: string;
  is_active: boolean;
}

export default function RelajacionPage() {
  const [resources, setResources] = useState<RelaxationResource[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadResources();
  }, []);

  const loadResources = async () => {
    try {
      const { data, error } = await supabase
        .from('mindfulness_resources')
        .select('*')
        .eq('category', 'relaxation')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setResources(data || []);
    } catch (error) {
      console.error('Error loading relaxation resources:', error);
      setResources([]);
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    { key: 'all', label: 'All' },
    { key: 'body', label: 'Body' },
    { key: 'mental', label: 'Mental' },
    { key: 'sleep', label: 'Sleep' },
    { key: 'audio_therapy', label: 'Audio Therapy' }
  ];

  const filteredResources = resources.filter(resource => {
    if (selectedCategory === 'all') return true;
    return resource.tags.includes(selectedCategory);
  });

  const handleResourceClick = (resource: RelaxationResource) => {
    window.open(resource.url, '_blank');
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'audio': return 'ri-headphone-line';
      case 'music': return 'ri-music-line';
      case 'video': return 'ri-play-circle-line';
      default: return 'ri-play-line';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'audio': return 'text-blue-600';
      case 'music': return 'text-green-600';
      case 'video': return 'text-red-600';
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
              <h1 className="text-xl font-bold text-gray-900">Deep Relaxation</h1>
              <p className="text-sm text-gray-600">Profound relaxation exercises</p>
            </div>
          </div>

          {/* Hero Image */}
          <div className="w-full h-32 mb-6 rounded-xl overflow-hidden">
            <img
              src="https://readdy.ai/api/search-image?query=Deep%20relaxation%20spa%20zen%20environment%2C%20peaceful%20relaxation%20sanctuary%2C%20tranquil%20wellness%20space%2C%20serene%20spa%20setting%2C%20meditation%20relaxation%20room%2C%20calming%20therapeutic%20environment&width=400&height=200&seq=relaxation_hero&orientation=landscape"
              alt="Deep Relaxation"
              className="w-full h-full object-cover object-top"
            />
          </div>

          {/* Category Filter */}
          <div className="flex space-x-2 mb-6 overflow-x-auto">
            {categories.map((category) => (
              <button
                key={category.key}
                onClick={() => setSelectedCategory(category.key)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                  selectedCategory === category.key
                    ? 'bg-red-600 text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-100'
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>

          {/* Resources List */}
          <div className="space-y-4">
            {filteredResources.length === 0 ? (
              <div className="text-center py-8">
                <i className="ri-search-line text-gray-400 text-4xl mb-2"></i>
                <p className="text-gray-600">No resources found for this category</p>
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

                      <p className="text-xs text-gray-600 mb-2 leading-relaxed">
                        {resource.description}
                      </p>

                      <div className="mb-3">
                        <span className="text-xs bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full">
                          {resource.technique}
                        </span>
                      </div>

                      <div className="flex items-center space-x-3">
                        <span className="text-xs text-gray-500">
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

          {/* Quick Relaxation Tool */}
          <div className="bg-white rounded-xl p-6 shadow-sm mt-6">
            <h3 className="font-semibold text-gray-900 mb-4">Relajación Rápida 5 Minutos</h3>

            <div className="text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="ri-leaf-line text-green-600 text-3xl"></i>
              </div>

              <p className="text-sm text-gray-600 mb-4">
                Toma un descanso rápido de relajación para reiniciar tu mente y cuerpo
              </p>

              <div className="space-y-2 mb-4 text-xs text-left text-gray-600">
                <p>• Cierra los ojos y respira profundo tres veces</p>
                <p>• Relaja tus hombros y suaviza tu rostro</p>
                <p>• Escanea tu cuerpo de la cabeza a los pies</p>
                <p>• Libera cualquier tensión que encuentres</p>
              </div>

              <button
                onClick={() => {
                  // Iniciar sesión de relajación de 5 minutos
                  const startTime = Date.now();
                  const duration = 5 * 60 * 1000; // 5 minutos en ms

                  const timer = setInterval(() => {
                    const elapsed = Date.now() - startTime;
                    const remaining = Math.max(0, duration - elapsed);

                    if (remaining === 0) {
                      clearInterval(timer);
                      alert('¡Sesión de relajación completada! Te sientes más tranquilo y renovado.');
                    }
                  }, 1000);

                  alert('Sesión de relajación iniciada. Encuentra una posición cómoda y sigue las instrucciones.');
                }}
                className="bg-green-600 text-white px-6 py-2 rounded-md text-sm !rounded-button hover:bg-green-700 transition-colors"
              >
                Iniciar Sesión de 5 Min
              </button>
            </div>
          </div>

          {/* Benefits */}
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl p-4 text-white mt-6">
            <h3 className="font-semibold mb-2">🌿 Relaxation Benefits</h3>
            <ul className="text-sm opacity-90 space-y-1">
              <li>• Lowers blood pressure and heart rate</li>
              <li>• Reduces muscle tension and pain</li>
              <li>• Improves immune system function</li>
              <li>• Enhances mood and mental clarity</li>
            </ul>
          </div>
        </div>
      </main>

      <TabBar />
    </div>
  );
}


'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import TabBar from '@/components/TabBar';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

interface WorkoutLink {
  id: string;
  title: string;
  description: string;
  url: string;
  platform: 'youtube' | 'spotify';
  difficulty: 'principiante' | 'intermedio' | 'avanzado';
  duration: number;
  image_url: string;
  tags: string[];
  is_active: boolean;
}

export default function TrenSuperiorPage() {
  const [workouts, setWorkouts] = useState<WorkoutLink[]>([]);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('todos');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadWorkouts();
  }, []);

  const loadWorkouts = async () => {
    try {
      const { data, error } = await supabase
        .from('workout_links')
        .select('*')
        .eq('category', 'tren_superior')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setWorkouts(data || []);
    } catch (error) {
      console.error('Error loading upper body workouts:', error);
      setWorkouts([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredWorkouts = workouts.filter(workout => {
    if (selectedDifficulty === 'todos') return true;
    return workout.difficulty === selectedDifficulty;
  });

  const handleWorkoutClick = (workout: WorkoutLink) => {
    window.open(workout.url, '_blank');
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'principiante': return 'bg-green-100 text-green-800';
      case 'intermedio': return 'bg-yellow-100 text-yellow-800';
      case 'avanzado': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPlatformIcon = (platform: string) => {
    return platform === 'youtube' ? 'ri-youtube-line' : 'ri-spotify-line';
  };

  const getPlatformColor = (platform: string) => {
    return platform === 'youtube' ? 'text-red-600' : 'text-green-600';
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
            <Link href="/entrenamiento" className="mr-3">
              <div className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded-full">
                <i className="ri-arrow-left-line text-gray-600"></i>
              </div>
            </Link>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Tren Superior</h1>
              <p className="text-sm text-gray-600">Pecho, espalda, brazos y hombros</p>
            </div>
          </div>

          {/* Hero Image */}
          <div className="w-full h-32 mb-6 rounded-xl overflow-hidden">
            <img
              src="https://readdy.ai/api/search-image?query=Upper%20body%20workout%20gym%20equipment%20dumbbells%20barbells%2C%20professional%20fitness%20photography%2C%20clean%20modern%20gym%2C%20strength%20training%20setup%2C%20muscle%20building%20equipment%2C%20fitness%20inspiration&width=400&height=200&seq=upper_body_hero&orientation=landscape"
              alt="Tren Superior"
              className="w-full h-full object-cover object-top"
            />
          </div>

          {/* Difficulty Filter */}
          <div className="flex space-x-2 mb-6 overflow-x-auto">
            {['todos', 'principiante', 'intermedio', 'avanzado'].map((level) => (
              <button
                key={level}
                onClick={() => setSelectedDifficulty(level)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                  selectedDifficulty === level
                    ? 'bg-red-600 text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-100'
                }`}
              >
                {level === 'todos' ? 'Todos' : level.charAt(0).toUpperCase() + level.slice(1)}
              </button>
            ))}
          </div>

          {/* Workouts List */}
          <div className="space-y-4">
            {filteredWorkouts.length === 0 ? (
              <div className="text-center py-8">
                <i className="ri-search-line text-gray-400 text-4xl mb-2"></i>
                <p className="text-gray-600">No hay entrenamientos para este nivel</p>
              </div>
            ) : (
              filteredWorkouts.map((workout) => (
                <div
                  key={workout.id}
                  className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => handleWorkoutClick(workout)}
                >
                  <div className="flex items-start space-x-4">
                    <div className="w-20 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={workout.image_url}
                        alt={workout.title}
                        className="w-full h-full object-cover object-top"
                      />
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-gray-900 text-sm">
                          {workout.title}
                        </h3>
                        <div className="flex items-center space-x-2">
                          <i className={`${getPlatformIcon(workout.platform)} ${getPlatformColor(workout.platform)} text-lg`}></i>
                        </div>
                      </div>

                      <p className="text-xs text-gray-600 mb-3 leading-relaxed">
                        {workout.description}
                      </p>

                      <div className="flex items-center space-x-3">
                        <span className={`text-xs px-2 py-1 rounded-full ${getDifficultyColor(workout.difficulty)}`}>
                          {workout.difficulty}
                        </span>
                        <span className="text-xs text-gray-500">
                          {workout.duration} min
                        </span>
                        <div className="flex items-center space-x-1">
                          {workout.tags.slice(0, 2).map((tag, index) => (
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

          {/* Quick Tips */}
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-4 text-white mt-6">
            <h3 className="font-semibold mb-2">💪 Consejos para Tren Superior</h3>
            <ul className="text-sm opacity-90 space-y-1">
              <li>• Calienta siempre antes de entrenar</li>
              <li>• Enfócate en la técnica antes que en el peso</li>
              <li>• Descansa 48-72 horas entre sesiones</li>
              <li>• Hidrátate durante el entrenamiento</li>
            </ul>
          </div>
        </div>
      </main>

      <TabBar />
    </div>
  );
}

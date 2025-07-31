
'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import TabBar from '@/components/TabBar';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

interface BreathingExercise {
  id: string;
  name: string;
  description: string;
  technique: string;
  duration: number;
  instructions: string[];
  benefits: string[];
  level: 'beginner' | 'intermediate' | 'advanced';
  is_active: boolean;
}

export default function RespiracionPage() {
  const [exercises, setExercises] = useState<BreathingExercise[]>([]);
  const [activeExercise, setActiveExercise] = useState<BreathingExercise | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentPhase, setCurrentPhase] = useState('inhale');
  const [countdown, setCountdown] = useState(4);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadExercises();
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isPlaying && activeExercise) {
      interval = setInterval(() => {
        setCountdown(prev => {
          if (prev === 1) {
            // Switch phases based on exercise type
            if (activeExercise.technique === '4-7-8') {
              if (currentPhase === 'inhale') {
                setCurrentPhase('hold');
                return 7;
              } else if (currentPhase === 'hold') {
                setCurrentPhase('exhale');
                return 8;
              } else {
                setCurrentPhase('inhale');
                return 4;
              }
            } else { // Box breathing (4-4-4-4)
              if (currentPhase === 'inhale') {
                setCurrentPhase('hold');
                return 4;
              } else if (currentPhase === 'hold') {
                setCurrentPhase('exhale');
                return 4;
              } else if (currentPhase === 'exhale') {
                setCurrentPhase('pause');
                return 4;
              } else {
                setCurrentPhase('inhale');
                return 4;
              }
            }
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isPlaying, currentPhase, activeExercise]);

  const loadExercises = async () => {
    try {
      const { data, error } = await supabase
        .from('mindfulness_resources')
        .select('*')
        .eq('category', 'breathing')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Transform data to match BreathingExercise interface
      const transformedData = (data || []).map(item => ({
        id: item.id,
        name: item.title,
        description: item.description,
        technique: item.type || 'box',
        duration: item.duration,
        instructions: item.tags || [],
        benefits: item.tags || [],
        level: 'beginner' as const,
        is_active: item.is_active
      }));

      setExercises(transformedData);
    } catch (error) {
      console.error('Error loading breathing exercises:', error);
      setExercises([]);
    } finally {
      setLoading(false);
    }
  };

  const startExercise = (exercise: BreathingExercise) => {
    setActiveExercise(exercise);
    setIsPlaying(true);
    setCurrentPhase('inhale');
    setCountdown(4);
  };

  const stopExercise = () => {
    setIsPlaying(false);
    setActiveExercise(null);
    setCurrentPhase('inhale');
    setCountdown(4);
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPhaseText = (phase: string) => {
    switch (phase) {
      case 'inhale': return 'Breathe In';
      case 'hold': return 'Hold';
      case 'exhale': return 'Breathe Out';
      case 'pause': return 'Pause';
      default: return 'Breathe';
    }
  };

  const getPhaseColor = (phase: string) => {
    switch (phase) {
      case 'inhale': return 'from-blue-400 to-blue-600';
      case 'hold': return 'from-yellow-400 to-yellow-600';
      case 'exhale': return 'from-green-400 to-green-600';
      case 'pause': return 'from-purple-400 to-purple-600';
      default: return 'from-gray-400 to-gray-600';
    }
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
              <h1 className="text-xl font-bold text-gray-900">Breathing Exercises</h1>
              <p className="text-sm text-gray-600">Conscious breathing techniques</p>
            </div>
          </div>

          {/* Active Exercise Widget */}
          {activeExercise && (
            <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
              <div className="text-center">
                <h3 className="font-semibold text-gray-900 mb-4">{activeExercise.name}</h3>
                
                <div className={`w-32 h-32 bg-gradient-to-br ${getPhaseColor(currentPhase)} rounded-full flex items-center justify-center mx-auto mb-4 transition-all duration-1000`}>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-white">{countdown}</div>
                    <div className="text-sm text-white opacity-90">{getPhaseText(currentPhase)}</div>
                  </div>
                </div>
                
                <div className="flex justify-center space-x-3">
                  {isPlaying ? (
                    <button
                      onClick={stopExercise}
                      className="bg-red-600 text-white px-6 py-2 rounded-md text-sm !rounded-button"
                    >
                      <i className="ri-stop-line mr-2"></i>
                      Stop
                    </button>
                  ) : (
                    <button
                      onClick={() => startExercise(activeExercise)}
                      className="bg-blue-600 text-white px-6 py-2 rounded-md text-sm !rounded-button"
                    >
                      <i className="ri-play-line mr-2"></i>
                      Resume
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Breathing Exercises List */}
          <div className="space-y-4">
            {exercises.map((exercise) => (
              <div key={exercise.id} className="bg-white rounded-xl p-4 shadow-sm">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-gray-900 text-sm mb-1">
                      {exercise.name}
                    </h3>
                    <p className="text-xs text-gray-600 leading-relaxed">
                      {exercise.description}
                    </p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${getLevelColor(exercise.level)}`}>
                    {exercise.level}
                  </span>
                </div>
                
                <div className="mb-4">
                  <h4 className="text-xs font-medium text-gray-700 mb-2">Instructions:</h4>
                  <div className="space-y-1">
                    {exercise.instructions.slice(0, 3).map((instruction, index) => (
                      <div key={index} className="text-xs text-gray-600 flex items-start">
                        <span className="text-blue-500 mr-2">•</span>
                        {instruction}
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <i className="ri-time-line text-gray-400 text-sm"></i>
                    <span className="text-xs text-gray-600">{exercise.duration} min</span>
                  </div>
                  
                  <button
                    onClick={() => startExercise(exercise)}
                    disabled={isPlaying && activeExercise?.id === exercise.id}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm !rounded-button hover:bg-blue-700 transition-colors disabled:opacity-50"
                  >
                    <i className="ri-play-line mr-1"></i>
                    {activeExercise?.id === exercise.id ? 'Active' : 'Start'}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Benefits */}
          <div className="bg-gradient-to-r from-teal-500 to-blue-600 rounded-xl p-4 text-white mt-6">
            <h3 className="font-semibold mb-2">🫁 Breathing Benefits</h3>
            <ul className="text-sm opacity-90 space-y-1">
              <li>• Activates the relaxation response</li>
              <li>• Reduces stress hormone levels</li>
              <li>• Improves oxygen efficiency</li>
              <li>• Enhances mental clarity and focus</li>
            </ul>
          </div>
        </div>
      </main>

      <TabBar />
    </div>
  );
}

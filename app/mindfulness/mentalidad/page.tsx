
'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import TabBar from '@/components/TabBar';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

interface MindsetResource {
  id: string;
  title: string;
  description: string;
  url: string;
  type: 'video' | 'audio' | 'article';
  duration: number;
  image_url: string;
  category: string;
  tags: string[];
  level: 'beginner' | 'intermediate' | 'advanced';
  is_active: boolean;
}

interface DailyAffirmation {
  id: string;
  text: string;
  category: string;
  author?: string;
}

export default function MentalidadPage() {
  const [resources, setResources] = useState<MindsetResource[]>([]);
  const [dailyAffirmation, setDailyAffirmation] = useState<DailyAffirmation | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadResources();
    loadDailyAffirmation();
  }, []);

  const loadResources = async () => {
    try {
      const { data, error } = await supabase
        .from('mindfulness_resources')
        .select('*')
        .eq('category', 'mindset')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Transform data to match MindsetResource interface
      const transformedData = (data || []).map(item => ({
        id: item.id,
        title: item.title,
        description: item.description,
        url: item.url,
        type: item.type || 'video',
        duration: item.duration,
        image_url: item.image_url,
        category: item.technique || 'general',
        tags: item.tags || [],
        level: 'beginner' as const,
        is_active: item.is_active
      }));

      setResources(transformedData);
    } catch (error) {
      console.error('Error loading mindset resources:', error);
      setResources([]);
    } finally {
      setLoading(false);
    }
  };

  const loadDailyAffirmation = async () => {
    const affirmations: DailyAffirmation[] = [
      { id: '1', text: 'I am capable of achieving my goals through consistent effort and positive thinking.', category: 'achievement' },
      { id: '2', text: 'Every challenge I face is an opportunity for growth and learning.', category: 'growth' },
      { id: '3', text: 'I choose to focus on what I can control and release what I cannot.', category: 'control' },
      { id: '4', text: 'My thoughts create my reality, and I choose thoughts that serve my highest good.', category: 'mindset' },
      { id: '5', text: 'I am worthy of love, success, and happiness exactly as I am today.', category: 'self_worth' },
      { id: '6', text: 'I embrace change as a natural part of life and trust in my ability to adapt.', category: 'adaptability' },
      { id: '7', text: 'I am grateful for this moment and all the possibilities it holds.', category: 'gratitude' }
    ];

    const randomAffirmation = affirmations[Math.floor(Math.random() * affirmations.length)];
    setDailyAffirmation(randomAffirmation);
  };

  const categories = [
    { key: 'all', label: 'All' },
    { key: 'growth', label: 'Growth' },
    { key: 'self_talk', label: 'Self-Talk' },
    { key: 'resilience', label: 'Resilience' },
    { key: 'gratitude', label: 'Gratitude' },
    { key: 'confidence', label: 'Confidence' },
    { key: 'mindfulness', label: 'Mindful Living' }
  ];

  const filteredResources = resources.filter(resource => {
    if (selectedCategory === 'all') return true;
    return resource.category === selectedCategory;
  });

  const handleResourceClick = (resource: MindsetResource) => {
    window.open(resource.url, '_blank');
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video': return 'ri-play-circle-line';
      case 'audio': return 'ri-headphone-line';
      case 'article': return 'ri-article-line';
      default: return 'ri-play-line';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'video': return 'text-red-600';
      case 'audio': return 'text-blue-600';
      case 'article': return 'text-green-600';
      default: return 'text-gray-600';
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
              <h1 className="text-xl font-bold text-gray-900">Positive Mindset</h1>
              <p className="text-sm text-gray-600">Develop positive thinking patterns</p>
            </div>
          </div>

          {/* Daily Affirmation */}
          {dailyAffirmation && (
            <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl p-4 text-white mb-6">
              <h3 className="font-semibold mb-2 flex items-center">
                <i className="ri-sun-line mr-2"></i>
                Daily Affirmation
              </h3>
              <p className="text-sm leading-relaxed italic">
                "{dailyAffirmation.text}"
              </p>
              <button
                onClick={loadDailyAffirmation}
                className="mt-3 bg-white/20 text-white px-3 py-1 rounded-md text-xs !rounded-button hover:bg-white/30 transition-colors"
              >
                <i className="ri-refresh-line mr-1"></i>
                New Affirmation
              </button>
            </div>
          )}

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
                        </div>
                      </div>

                      <p className="text-xs text-gray-600 mb-3 leading-relaxed">
                        {resource.description}
                      </p>

                      <div className="flex items-center space-x-3">
                        <span className={`text-xs px-2 py-1 rounded-full ${getLevelColor(resource.level)}`}>
                          {resource.level}
                        </span>
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

          {/* Quick Mindset Exercise */}
          <div className="bg-white rounded-xl p-6 shadow-sm mt-6">
            <h3 className="font-semibold text-gray-900 mb-4">Ejercicio de Gratitud 3-2-1</h3>

            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-700 mb-2">Toma un momento para reflexionar:</p>
                <div className="space-y-2 text-xs text-gray-600">
                  <p><strong>3 cosas</strong> por las que estás agradecido hoy</p>
                  <p><strong>2 personas</strong> que tuvieron un impacto positivo en ti</p>
                  <p><strong>1 fortaleza personal</strong> que usaste recientemente</p>
                </div>
              </div>

              <button
                onClick={() => {
                  const gratitudes = [];

                  for (let i = 1; i <= 3; i++) {
                    const item = prompt(`Cosa ${i} por la que estás agradecido:`);
                    if (item) gratitudes.push(item);
                  }

                  const people = [];
                  for (let i = 1; i <= 2; i++) {
                    const person = prompt(`Persona ${i} que te impactó positivamente:`);
                    if (person) people.push(person);
                  }

                  const strength = prompt('Una fortaleza personal que usaste:');

                  let message = '🙏 Tu práctica de gratitud de hoy:\n\n';

                  if (gratitudes.length > 0) {
                    message += '✨ Agradecido por:\n';
                    gratitudes.forEach((item, i) => message += `${i + 1}. ${item}\n`);
                    message += '\n';
                  }

                  if (people.length > 0) {
                    message += '👥 Personas importantes:\n';
                    people.forEach((person, i) => message += `${i + 1}. ${person}\n`);
                    message += '\n';
                  }

                  if (strength) {
                    message += `💪 Tu fortaleza: ${strength}\n\n`;
                  }

                  message += '¡Excelente práctica de gratitud! Estos momentos de reflexión cultivan una mentalidad positiva.';

                  alert(message);
                }}
                className="w-full bg-orange-600 text-white py-2 rounded-md text-sm !rounded-button hover:bg-orange-700 transition-colors"
              >
                Iniciar Diario de Gratitud
              </button>
            </div>
          </div>

          {/* Benefits */}
          <div className="bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl p-4 text-white mt-6">
            <h3 className="font-semibold mb-2">🧠 Positive Mindset Benefits</h3>
            <ul className="text-sm opacity-90 space-y-1">
              <li>• Increases resilience to stress and setbacks</li>
              <li>• Improves problem-solving abilities</li>
              <li>• Enhances relationships and social connections</li>
              <li>• Boosts overall life satisfaction and happiness</li>
            </ul>
          </div>
        </div>
      </main>

      <TabBar />
    </div>
  );
}

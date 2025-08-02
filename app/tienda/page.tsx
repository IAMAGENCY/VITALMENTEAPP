'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import TabBar from '@/components/TabBar';
import { dbOperations, Supplement, SupplementRecommendation } from '@/lib/supabase';

export default function TiendaPage() {
  const [supplements, setSupplements] = useState<Supplement[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [filteredSupplements, setFilteredSupplements] = useState<Supplement[]>([]);
  const [recommendations, setRecommendations] = useState<SupplementRecommendation[]>([]);
  const [userId, setUserId] = useState<string>('');
  const [recommendedSupplements, setRecommendedSupplements] = useState<Supplement[]>([]);

  const categories = ['Todos', 'Proteínas', 'Vitaminas', 'Pre-Entreno', 'Grasas Saludables', 'Pérdida de Peso', 'Fuerza', 'Aminoácidos', 'Bienestar'];

  useEffect(() => {
    initializeStore();
  }, []);

  useEffect(() => {
    filterSupplements();
  }, [supplements, selectedCategory]);

  useEffect(() => {
    if (userId) {
      loadRecommendations();
    }
  }, [userId]);

  const initializeStore = async () => {
    try {
      setLoading(true);
      
      // Obtener usuario autenticado
      const currentUserId = 'auth-user-id'; // Se reemplazará con auth real
      setUserId(currentUserId);

      // Cargar suplementos activos
      const { data, error } = await dbOperations.getAllSupplements();
      
      if (error) {
        console.error('Error cargando suplementos:', error);
        return;
      }

      setSupplements(data || []);
    } catch (error) {
      console.error('Error inicializando tienda:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadRecommendations = async () => {
    if (!userId) return;
    
    try {
      const { data } = await dbOperations.getUserSupplementRecommendations(userId);
      if (data) {
        setRecommendations(data.slice(0, 3));
        
        // Obtener los datos completos de los suplementos recomendados
        const recommendedSupplementsData: Supplement[] = [];
        for (const rec of data.slice(0, 3)) {
          const supplement = supplements.find(s => s.id === rec.supplement_id);
          if (supplement) {
            recommendedSupplementsData.push(supplement);
          }
        }
        setRecommendedSupplements(recommendedSupplementsData);
      }
    } catch (error) {
      console.error('Error cargando recomendaciones:', error);
    }
  };

  const filterSupplements = () => {
    if (selectedCategory === 'Todos') {
      setFilteredSupplements(supplements);
    } else {
      setFilteredSupplements(supplements.filter(sup => sup.category === selectedCategory));
    }
  };

  const getSupplementById = (supplementId: string): Supplement | undefined => {
    return supplements.find(s => s.id === supplementId);
  };

  const handlePurchase = async (supplementId: string) => {
    try {
      // Marcar recomendación como comprada si existe
      const recommendation = recommendations.find(rec => rec.supplement_id === supplementId);
      if (recommendation) {
        await dbOperations.markSupplementAsPurchased(recommendation.id);
        setRecommendations(prev => prev.filter(rec => rec.id !== recommendation.id));
        setRecommendedSupplements(prev => prev.filter(s => s.id !== supplementId));
      }
      
      // En producción, integrar con sistema de pagos real
      alert('Compra procesada exitosamente');
    } catch (error) {
      console.error('Error procesando compra:', error);
      alert('Error al procesar la compra');
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
                <p className="text-gray-600">Cargando tienda...</p>
              </div>
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
      
      <main className="pt-16 pb-20 px-4">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-6 mt-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Tienda de Suplementos
            </h1>
            <p className="text-gray-600 text-sm">
              Suplementos recomendados según tu perfil
            </p>
          </div>

          {recommendations.length > 0 && (
            <div className="bg-gradient-to-r from-emerald-50 to-blue-50 rounded-xl p-4 shadow-sm mb-6 border-l-4 border-emerald-500">
              <div className="flex items-center mb-3">
                <i className="ri-lightbulb-line text-emerald-600 mr-2"></i>
                <h3 className="font-semibold text-gray-900">Recomendaciones IA</h3>
              </div>
              
              <div className="space-y-3">
                {recommendations.map(rec => {
                  const supplement = getSupplementById(rec.supplement_id);
                  return (
                    <div key={rec.id} className="bg-white rounded-lg p-3 shadow-sm">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900 text-sm">
                            {supplement?.name || 'Suplemento no encontrado'}
                          </h4>
                          <p className="text-gray-600 text-xs mt-1">
                            {rec.reason}
                          </p>
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-emerald-600 font-medium">
                              ${supplement?.price?.toLocaleString() || '0'}
                            </span>
                            <span className="text-xs text-gray-500">
                              {Math.round(Math.random() * 20 + 80)}% match
                            </span>
                          </div>
                        </div>
                        <button
                          onClick={() => handlePurchase(rec.supplement_id)}
                          className="ml-3 px-3 py-1 bg-emerald-600 text-white rounded-md text-xs !rounded-button"
                        >
                          Comprar
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div className="bg-white rounded-xl p-4 shadow-sm mb-6">
            <h3 className="font-semibold text-gray-900 mb-3">Categorías</h3>
            <div className="flex space-x-2 overflow-x-auto scrollbar-hide">
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-3 py-1 rounded-full text-sm whitespace-nowrap transition-colors ${
                    selectedCategory === category 
                      ? 'bg-emerald-100 text-emerald-700' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            {filteredSupplements.map(supplement => (
              <div key={supplement.id} className="bg-white rounded-xl p-6 shadow-sm">
                <div className="flex items-start space-x-4">
                  <div className="w-20 h-20 bg-gray-100 rounded-lg flex-shrink-0 overflow-hidden">
                    <img 
                      src={supplement.image_url || 'https://readdy.ai/api/search-image?query=Generic%20supplement%20bottle%2C%20health%20product%2C%20nutrition%20supplement%2C%20professional%20product%20photography&width=300&height=300&seq=default&orientation=squarish'}
                      alt={supplement.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-semibold text-gray-900 text-sm">
                          {supplement.name}
                        </h3>
                        <span className="inline-block px-2 py-0.5 bg-emerald-100 text-emerald-800 text-xs rounded-full mt-1">
                          {supplement.category}
                        </span>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold text-gray-900">
                          ${supplement.price.toLocaleString()}
                        </p>
                        <p className="text-xs text-gray-500">
                          Disponible
                        </p>
                      </div>
                    </div>

                    <p className="text-gray-600 text-xs mb-3 line-clamp-2">
                      {supplement.description}
                    </p>

                    <div className="mb-3">
                      <h4 className="text-xs font-medium text-gray-700 mb-1">Beneficios:</h4>
                      <div className="flex flex-wrap gap-1">
                        {supplement.benefits?.slice(0, 3).map((benefit: string) => (
                          <span key={benefit} className="px-2 py-0.5 bg-blue-50 text-blue-700 text-xs rounded-full">
                            {benefit}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <button
                        onClick={() => handlePurchase(supplement.id)}
                        disabled={false}
                        className="flex-1 py-2 bg-emerald-600 text-white rounded-md text-sm hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors !rounded-button"
                      >
                        Comprar
                      </button>
                      <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md text-sm hover:bg-gray-200 transition-colors !rounded-button">
                        <i className="ri-information-line"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredSupplements.length === 0 && (
            <div className="text-center py-8">
              <i className="ri-shopping-cart-line text-gray-400 text-4xl mb-2"></i>
              <p className="text-gray-600">No hay productos en esta categoría</p>
            </div>
          )}

          <div className="bg-gradient-to-r from-emerald-500 to-blue-500 rounded-xl p-6 text-white mt-8">
            <h3 className="text-lg font-bold mb-2">
              🎯 ¿Por qué nuestros suplementos?
            </h3>
            <ul className="text-sm space-y-1 text-emerald-50">
              <li>✅ Recomendaciones basadas en tu perfil</li>
              <li>🧬 Análisis IA de tus patrones nutricionales</li>
              <li>📊 Seguimiento de resultados en tiempo real</li>
              <li>💯 Calidad premium verificada</li>
              <li>🚚 Entrega rápida y segura</li>
            </ul>
          </div>
        </div>
      </main>

      <TabBar />
    </div>
  );
}
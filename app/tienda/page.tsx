
'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import TabBar from '@/components/TabBar';
import { dbOperations } from '@/lib/supabase';
import Link from 'next/link';

export default function TiendaPage() {
  const [supplements, setSupplements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [filteredSupplements, setFilteredSupplements] = useState<any[]>([]);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [userId, setUserId] = useState('');

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
      // Obtener usuario actual
      const savedUserId = localStorage.getItem('vitalMenteUserId');
      if (savedUserId && !savedUserId.startsWith('local-')) {
        setUserId(savedUserId);
      }

      // Cargar suplementos activos
      const { data, error } = await dbOperations.getActiveSupplements();
      
      if (error) {
        console.error('Error cargando suplementos:', error);
        // Usar datos de respaldo
        setSupplements(getBackupSupplements());
      } else if (!data || data.length === 0) {
        console.log('No hay suplementos, usando datos de respaldo');
        setSupplements(getBackupSupplements());
      } else {
        setSupplements(data);
      }
    } catch (error) {
      console.error('Error inicializando tienda:', error);
      setSupplements(getBackupSupplements());
    } finally {
      setLoading(false);
    }
  };

  const loadRecommendations = async () => {
    try {
      const { data } = await dbOperations.getUserSupplementRecommendations(userId);
      if (data) {
        setRecommendations(data.slice(0, 3)); // Top 3 recomendaciones
      }
    } catch (error) {
      console.error('Error cargando recomendaciones:', error);
    }
  };

  const getBackupSupplements = () => {
    return [
      {
        id: '1',
        name: 'Proteína Whey Premium',
        category: 'Proteínas',
        price: 89900,
        stock: 50,
        benefits: ['Desarrollo muscular', 'Recuperación post-entreno', 'Saciedad prolongada'],
        ingredients: ['Whey Protein Concentrate', 'Whey Protein Isolate', 'Saborizante natural', 'Stevia'],
        description: 'Proteína de suero de alta calidad con perfil completo de aminoácidos esenciales.',
        image_url: 'https://readdy.ai/api/search-image?query=Premium%20whey%20protein%20powder%20container%2C%20professional%20supplement%20photography%2C%20high%20quality%20protein%20shake%20powder%2C%20fitness%20nutrition%20product%2C%20clean%20white%20background&width=300&height=300&seq=whey1&orientation=squarish',
        is_active: true
      },
      {
        id: '2',
        name: 'Multivitamínico Completo',
        category: 'Vitaminas',
        price: 45500,
        stock: 75,
        benefits: ['Energía diaria', 'Sistema inmune', 'Metabolismo optimizado'],
        ingredients: ['Vitamina A', 'Complejo B', 'Vitamina C', 'Vitamina D3', 'Zinc', 'Magnesio'],
        description: 'Fórmula completa de vitaminas y minerales esenciales para el bienestar diario.',
        image_url: 'https://readdy.ai/api/search-image?query=Multivitamin%20supplement%20bottle%20with%20colorful%20pills%2C%20complete%20daily%20vitamin%20formula%2C%20health%20and%20wellness%20product%2C%20professional%20supplement%20photography&width=300&height=300&seq=multi1&orientation=squarish',
        is_active: true
      },
      {
        id: '3',
        name: 'Pre-Entreno Explosivo',
        category: 'Pre-Entreno',
        price: 67800,
        stock: 40,
        benefits: ['Energía explosiva', 'Focus mental', 'Resistencia aumentada'],
        ingredients: ['Cafeína', 'Beta-Alanina', 'Creatina', 'Taurina', 'L-Citrulina'],
        description: 'Fórmula pre-entreno diseñada para maximizar energía y rendimiento durante el entrenamiento.',
        image_url: 'https://readdy.ai/api/search-image?query=Pre%20workout%20supplement%20powder%20container%2C%20energy%20boost%20fitness%20supplement%2C%20high%20intensity%20training%20nutrition%2C%20dynamic%20colorful%20design&width=300&height=300&seq=prework1&orientation=squarish',
        is_active: true
      },
      {
        id: '4',
        name: 'Omega 3 Premium',
        category: 'Grasas Saludables',
        price: 38900,
        stock: 60,
        benefits: ['Salud cardiovascular', 'Función cerebral', 'Reducción inflamación'],
        ingredients: ['EPA', 'DHA', 'Vitamina E'],
        description: 'Ácidos grasos esenciales de alta concentración para salud cardiovascular y cognitiva.',
        image_url: 'https://readdy.ai/api/search-image?query=Omega%203%20fish%20oil%20capsules%20bottle%2C%20premium%20EPA%20DHA%20supplement%2C%20heart%20health%20nutrition%20product%2C%20clean%20professional%20packaging&width=300&height=300&seq=omega1&orientation=squarish',
        is_active: true
      },
      {
        id: '5',
        name: 'Quemador de Grasa Natural',
        category: 'Pérdida de Peso',
        price: 72300,
        stock: 35,
        benefits: ['Termogénesis', 'Metabolismo acelerado', 'Control apetito'],
        ingredients: ['Extracto de té verde', 'Cafeína natural', 'L-Carnitina', 'Garcinia Cambogia'],
        description: 'Fórmula natural que acelera el metabolismo y ayuda en el proceso de pérdida de grasa.',
        image_url: 'https://readdy.ai/api/search-image?query=Natural%20fat%20burner%20supplement%20bottle%2C%20weight%20loss%20pills%2C%20thermogenic%20formula%2C%20fitness%20supplement%20for%20fat%20burning&width=300&height=300&seq=fatburn1&orientation=squarish',
        is_active: true
      },
      {
        id: '6',
        name: 'Creatina Monohidrato',
        category: 'Fuerza',
        price: 34900,
        stock: 80,
        benefits: ['Fuerza explosiva', 'Volumen muscular', 'Recuperación rápida'],
        ingredients: ['Creatina Monohidrato 100% pura'],
        description: 'Creatina pura micronizada para aumentar fuerza, potencia y volumen muscular.',
        image_url: 'https://readdy.ai/api/search-image?query=Pure%20creatine%20monohydrate%20powder%20container%2C%20strength%20building%20supplement%2C%20muscle%20power%20enhancer%2C%20professional%20sports%20nutrition&width=300&height=300&seq=creatine1&orientation=squarish',
        is_active: true
      },
      {
        id: '7',
        name: 'BCAA 2:1:1',
        category: 'Aminoácidos',
        price: 56700,
        stock: 45,
        benefits: ['Recuperación muscular', 'Prevención catabolismo', 'Energía intra-entreno'],
        ingredients: ['L-Leucina', 'L-Isoleucina', 'L-Valina', 'Electrolitos'],
        description: 'Aminoácidos de cadena ramificada en ratio óptimo para máxima recuperación.',
        image_url: 'https://readdy.ai/api/search-image?query=BCAA%20amino%20acid%20supplement%20powder%2C%20branched%20chain%20amino%20acids%2C%20muscle%20recovery%20drink%20mix%2C%20colorful%20fitness%20supplement&width=300&height=300&seq=bcaa1&orientation=squarish',
        is_active: true
      },
      {
        id: '8',
        name: 'Colágeno Hidrolizado',
        category: 'Bienestar',
        price: 48900,
        stock: 55,
        benefits: ['Salud articular', 'Piel saludable', 'Fortalecimiento huesos'],
        ingredients: ['Péptidos de colágeno tipo I y III', 'Vitamina C', 'Biotina'],
        description: 'Colágeno de alta biodisponibilidad para mantener salud articular y piel radiante.',
        image_url: 'https://readdy.ai/api/search-image?query=Hydrolyzed%20collagen%20powder%20container%2C%20anti-aging%20supplement%2C%20joint%20health%20product%2C%20beauty%20and%20wellness%20nutrition&width=300&height=300&seq=collagen1&orientation=squarish',
        is_active: true
      }
    ];
  };

  const filterSupplements = () => {
    if (selectedCategory === 'Todos') {
      setFilteredSupplements(supplements);
    } else {
      setFilteredSupplements(supplements.filter(sup => sup.category === selectedCategory));
    }
  };

  const handlePurchase = async (supplementId: string) => {
    // Simular compra y marcar recomendación como comprada si existe
    try {
      const recommendation = recommendations.find(rec => rec.supplement_id === supplementId);
      if (recommendation) {
        await dbOperations.markSupplementAsPurchased(recommendation.id);
        setRecommendations(prev => prev.filter(rec => rec.id !== recommendation.id));
      }
      
      // Mostrar mensaje de éxito
      alert('¡Compra simulada exitosa! En la app real, esto se integraría con pasarelas de pago.');
    } catch (error) {
      console.error('Error procesando compra:', error);
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

          {/* AI Recommendations */}
          {recommendations.length > 0 && (
            <div className="bg-gradient-to-r from-emerald-50 to-blue-50 rounded-xl p-4 shadow-sm mb-6 border-l-4 border-emerald-500">
              <div className="flex items-center mb-3">
                <i className="ri-lightbulb-line text-emerald-600 mr-2"></i>
                <h3 className="font-semibold text-gray-900">Recomendaciones IA</h3>
              </div>
              
              <div className="space-y-3">
                {recommendations.map(rec => (
                  <div key={rec.id} className="bg-white rounded-lg p-3 shadow-sm">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 text-sm">
                          {rec.supplements?.name}
                        </h4>
                        <p className="text-gray-600 text-xs mt-1">
                          {rec.reason}
                        </p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-emerald-600 font-medium">
                            ${rec.supplements?.price?.toLocaleString()}
                          </span>
                          <span className="text-xs text-gray-500">
                            {Math.round(rec.confidence_score * 100)}% match
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
                ))}
              </div>
            </div>
          )}

          {/* Category Filter */}
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

          {/* Products Grid */}
          <div className="space-y-4">
            {filteredSupplements.map(supplement => (
              <div key={supplement.id} className="bg-white rounded-xl p-6 shadow-sm">
                <div className="flex items-start space-x-4">
                  {/* Product Image */}
                  <div className="w-20 h-20 bg-gray-100 rounded-lg flex-shrink-0 overflow-hidden">
                    <img 
                      src={supplement.image_url}
                      alt={supplement.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = 'https://readdy.ai/api/search-image?query=Generic%20supplement%20bottle%2C%20health%20product%2C%20nutrition%20supplement%2C%20professional%20product%20photography&width=300&height=300&seq=default&orientation=squarish';
                      }}
                    />
                  </div>

                  {/* Product Info */}
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
                          Stock: {supplement.stock}
                        </p>
                      </div>
                    </div>

                    <p className="text-gray-600 text-xs mb-3 line-clamp-2">
                      {supplement.description}
                    </p>

                    {/* Benefits */}
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

                    {/* Action Buttons */}
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handlePurchase(supplement.id)}
                        disabled={supplement.stock === 0}
                        className="flex-1 py-2 bg-emerald-600 text-white rounded-md text-sm hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors !rounded-button"
                      >
                        {supplement.stock === 0 ? 'Agotado' : 'Comprar'}
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

          {/* Empty State */}
          {filteredSupplements.length === 0 && (
            <div className="text-center py-8">
              <i className="ri-shopping-cart-line text-gray-400 text-4xl mb-2"></i>
              <p className="text-gray-600">No hay productos en esta categoría</p>
            </div>
          )}

          {/* Business Value Proposition */}
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

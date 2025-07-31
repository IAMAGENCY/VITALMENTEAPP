'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import Header from '@/components/Header';
import TabBar from '@/components/TabBar';
import Link from 'next/link';

function ConfirmacionContent() {
  const searchParams = useSearchParams();
  const success = searchParams.get('success');
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    if (success === 'true') {
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            window.location.href = '/';
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [success]);

  if (success === 'true') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
        <Header />
        
        <main className="pt-16 pb-20 px-4">
          <div className="max-w-md mx-auto">
            <div className="text-center py-12">
              {/* Success Animation */}
              <div className="relative mb-8">
                <div className="w-32 h-32 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto animate-pulse">
                  <i className="ri-check-line text-white text-6xl"></i>
                </div>
                <div className="absolute -top-2 -right-2 w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center animate-bounce">
                  <i className="ri-vip-crown-fill text-white text-2xl"></i>
                </div>
              </div>

              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                ¡Bienvenido a Premium! 🎉
              </h1>
              <p className="text-gray-600 text-lg mb-8">
                Tu suscripción ha sido activada exitosamente
              </p>

              {/* Premium Features Unlocked */}
              <div className="bg-white rounded-xl shadow-lg p-6 mb-8 text-left">
                <h3 className="font-bold text-gray-900 mb-4 text-center">Ya tienes acceso a:</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center p-3 bg-blue-50 rounded-lg">
                    <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center mr-4">
                      <i className="ri-brain-line text-white"></i>
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">Análisis IA Personalizado</div>
                      <div className="text-gray-600 text-sm">Diagnósticos automáticos activados</div>
                    </div>
                    <i className="ri-check-line text-green-600 ml-auto"></i>
                  </div>

                  <div className="flex items-center p-3 bg-green-50 rounded-lg">
                    <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center mr-4">
                      <i className="ri-file-list-3-line text-white"></i>
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">Planes Nutricionales IA</div>
                      <div className="text-gray-600 text-sm">Generación automática disponible</div>
                    </div>
                    <i className="ri-check-line text-green-600 ml-auto"></i>
                  </div>

                  <div className="flex items-center p-3 bg-purple-50 rounded-lg">
                    <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center mr-4">
                      <i className="ri-flask-line text-white"></i>
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">Suplementación Inteligente</div>
                      <div className="text-gray-600 text-sm">Recomendaciones personalizadas</div>
                    </div>
                    <i className="ri-check-line text-green-600 ml-auto"></i>
                  </div>

                  <div className="flex items-center p-3 bg-red-50 rounded-lg">
                    <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center mr-4">
                      <i className="ri-bar-chart-2-line text-white"></i>
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">Dashboard Avanzado</div>
                      <div className="text-gray-600 text-sm">Métricas profundas habilitadas</div>
                    </div>
                    <i className="ri-check-line text-green-600 ml-auto"></i>
                  </div>
                </div>
              </div>

              {/* Next Steps */}
              <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-6 mb-8">
                <h3 className="font-bold text-gray-900 mb-4">Primeros pasos recomendados:</h3>
                <div className="space-y-3 text-left">
                  <div className="flex items-center">
                    <div className="w-6 h-6 bg-amber-500 text-white rounded-full flex items-center justify-center text-xs font-bold mr-3">1</div>
                    <span className="text-gray-700">Registra tu comida para activar el análisis IA</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-6 h-6 bg-amber-500 text-white rounded-full flex items-center justify-center text-xs font-bold mr-3">2</div>
                    <span className="text-gray-700">Genera tu primer plan nutricional personalizado</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-6 h-6 bg-amber-500 text-white rounded-full flex items-center justify-center text-xs font-bold mr-3">3</div>
                    <span className="text-gray-700">Revisa las recomendaciones de suplementos IA</span>
                  </div>
                </div>
              </div>

              {/* Payment Info */}
              <div className="bg-gray-100 rounded-xl p-4 mb-6">
                <div className="flex items-center justify-center mb-2">
                  <i className="ri-calendar-line text-gray-600 mr-2"></i>
                  <span className="text-gray-700 text-sm font-medium">
                    Próxima facturación: {new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('es-CO')}
                  </span>
                </div>
                <div className="flex items-center justify-center">
                  <i className="ri-bank-card-line text-gray-600 mr-2"></i>
                  <span className="text-gray-600 text-sm">$45,000 COP • Renovación automática</span>
                </div>
              </div>

              {/* Auto Redirect */}
              <div className="text-center">
                <p className="text-gray-600 mb-4">
                  Redirigiendo al inicio en {countdown} segundos...
                </p>
                
                <div className="space-y-3">
                  <Link
                    href="/"
                    className="w-full py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg font-bold text-lg !rounded-button hover:from-green-700 hover:to-emerald-700 transition-all shadow-lg flex items-center justify-center"
                  >
                    <i className="ri-home-line mr-3"></i>
                    Ir al Dashboard Premium
                  </Link>
                  
                  <Link
                    href="/alimentacion/planes"
                    className="w-full py-3 bg-white text-green-600 border-2 border-green-600 rounded-lg font-medium !rounded-button hover:bg-green-50 transition-colors flex items-center justify-center"
                  >
                    <i className="ri-file-list-3-line mr-3"></i>
                    Generar Plan Nutricional IA
                  </Link>
                </div>
              </div>

              {/* Support */}
              <div className="mt-8 text-center">
                <p className="text-gray-500 text-sm mb-2">¿Necesitas ayuda?</p>
                <Link href="/soporte" className="text-blue-600 text-sm underline">
                  Contacta Soporte Premium
                </Link>
              </div>
            </div>
          </div>
        </main>

        <TabBar />
      </div>
    );
  }

  // Error state
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-100">
      <Header />
      
      <main className="pt-16 pb-20 px-4">
        <div className="max-w-md mx-auto">
          <div className="text-center py-12">
            <div className="w-32 h-32 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-8">
              <i className="ri-close-line text-white text-6xl"></i>
            </div>

            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Error en el Pago
            </h1>
            <p className="text-gray-600 text-lg mb-8">
              No pudimos procesar tu pago. Por favor intenta nuevamente.
            </p>

            <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
              <h3 className="font-bold text-gray-900 mb-4">Posibles causas:</h3>
              <div className="text-left space-y-2 text-sm text-gray-600">
                <div className="flex items-center">
                  <i className="ri-error-warning-line text-orange-600 mr-2"></i>
                  <span>Fondos insuficientes en la tarjeta</span>
                </div>
                <div className="flex items-center">
                  <i className="ri-error-warning-line text-orange-600 mr-2"></i>
                  <span>Datos de pago incorrectos</span>
                </div>
                <div className="flex items-center">
                  <i className="ri-error-warning-line text-orange-600 mr-2"></i>
                  <span>Problemas temporales del banco</span>
                </div>
                <div className="flex items-center">
                  <i className="ri-error-warning-line text-orange-600 mr-2"></i>
                  <span>Transacción bloqueada por seguridad</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <Link
                href="/suscripcion"
                className="w-full py-4 bg-gradient-to-r from-red-600 to-orange-600 text-white rounded-lg font-bold text-lg !rounded-button hover:from-red-700 hover:to-orange-700 transition-all shadow-lg flex items-center justify-center"
              >
                <i className="ri-refresh-line mr-3"></i>
                Intentar Nuevamente
              </Link>
              
              <Link
                href="/"
                className="w-full py-3 bg-white text-gray-600 border border-gray-300 rounded-lg font-medium !rounded-button hover:bg-gray-50 transition-colors flex items-center justify-center"
              >
                <i className="ri-home-line mr-3"></i>
                Volver al Inicio
              </Link>
            </div>

            <div className="mt-8 text-center">
              <p className="text-gray-500 text-sm mb-2">¿Necesitas ayuda con el pago?</p>
              <a href="mailto:soporte@vitalmente.com" className="text-blue-600 text-sm underline">
                soporte@vitalmente.com
              </a>
            </div>
          </div>
        </div>
      </main>

      <TabBar />
    </div>
  );
}

export default function ConfirmacionPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="pt-16 pb-20 px-4">
          <div className="max-w-md mx-auto">
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Procesando...</p>
              </div>
            </div>
          </div>
        </main>
        <TabBar />
      </div>
    }>
      <ConfirmacionContent />
    </Suspense>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { subscriptionOperations } from '@/lib/supabase';
import { wompiService, WompiUtils, WOMPI_CONFIG, WompiPaymentData } from '@/lib/wompi';
import Header from '@/components/Header';
import TabBar from '@/components/TabBar';
import Link from 'next/link';

export default function SuscripcionPage() {
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [subscriptionStatus, setSubscriptionStatus] = useState<any>(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<'PSE' | 'CARD' | 'NEQUI'>('CARD');
  const [connectionStatus, setConnectionStatus] = useState<string | null>(null);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const savedUser = localStorage.getItem('vitalMenteUser');
      const savedUserId = localStorage.getItem('vitalMenteUserId');

      if (savedUser && savedUserId) {
        const user = JSON.parse(savedUser);
        setUserData({ ...user, id: savedUserId });

        // Verificar estado de suscripción actual
        const hasAccess = await subscriptionOperations.checkPremiumAccess(savedUserId);

        if (hasAccess) {
          // Obtener detalles de suscripción
          const { data: userDetails } = await subscriptionOperations.getUserSubscriptionHistory(savedUserId);
          setSubscriptionStatus({
            isPremium: true,
            history: userDetails
          });
        }
      }
    } catch (error) {
      console.error('Error cargando datos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async (paymentMethod: 'PSE' | 'CARD' | 'NEQUI') => {
    if (!userData?.id) {
      alert('Por favor inicia sesión para continuar');
      return;
    }

    setPaymentLoading(true);

    try {
      // PRIMERO: Verificar que el usuario existe en la base de datos
      setConnectionStatus('🔍 Verificando usuario...');
      const { data: userExists } = await subscriptionOperations.checkPremiumAccess(userData.id);

      // SEGUNDO: Crear configuración de pago
      setConnectionStatus('💳 Preparando pago...');
      const paymentConfig: WompiPaymentData = wompiService.createSubscriptionCheckout(
        userData.id,
        userData.email || 'usuario@vitalmente.com',
        userData.nombre || 'Usuario VitalMente'
      );

      // Agregar método de pago específico
      paymentConfig.payment_method = {
        type: paymentMethod,
        ...(paymentMethod === 'PSE' ? {
          user_type: '0',
          user_legal_id_type: 'CC',
          user_legal_id: '1234567890'
        } : {})
      };

      // TERCERO: Registrar transacción pendiente en la base de datos
      setConnectionStatus('📝 Registrando transacción...');
      const { data: transaction, error: transactionError } = await subscriptionOperations.createPaymentTransaction({
        user_id: userData.id,
        wompi_transaction_id: `pending_${Date.now()}`,
        amount: WOMPI_CONFIG.MONTHLY_PRICE,
        currency: 'COP',
        status: 'pending',
        payment_method: paymentMethod,
        subscription_months: 1
      });

      if (transactionError) {
        throw new Error(`Error registrando transacción: ${transactionError.message}`);
      }

      setConnectionStatus('🚀 Iniciando proceso de pago...');

      // CUARTO: Inicializar checkout de Wompi
      WompiUtils.initCheckout(
        paymentConfig,
        async (transaction) => {
          // Pago exitoso
          console.log('✅ Pago exitoso:', transaction);
          setConnectionStatus('✅ Pago aprobado, activando suscripción...');

          try {
            // Actualizar transacción
            await subscriptionOperations.updatePaymentTransaction(transaction.id, {
              status: 'approved',
              wompi_transaction_id: transaction.id
            });

            // Activar suscripción
            const result = await subscriptionOperations.activatePremiumSubscription(userData.id, transaction.id);

            if (result.success) {
              setConnectionStatus('🎉 ¡Suscripción activada!');
              // Redirigir a confirmación
              setTimeout(() => {
                window.location.href = '/suscripcion/confirmacion?success=true';
              }, 1000);
            } else {
              throw new Error('Error activando suscripción');
            }

          } catch (error) {
            console.error('❌ Error post-pago:', error);
            alert('Pago procesado pero error activando suscripción. Contacta soporte.');
            setPaymentLoading(false);
          }
        },
        (error) => {
          // Error en el pago
          console.error('❌ Error en el pago:', error);
          setConnectionStatus('❌ Error en el pago');
          alert('Error procesando el pago. Por favor intenta nuevamente.');
          setPaymentLoading(false);
        }
      );

    } catch (error) {
      console.error('❌ Error iniciando pago:', error);
      setConnectionStatus(`❌ Error: ${error.message}`);
      alert(`Error: ${error.message}`);
      setPaymentLoading(false);
    }
  };

  const cancelSubscription = async () => {
    if (!userData?.id) return;

    if (confirm('¿Estás seguro de que quieres cancelar tu suscripción? Perderás acceso a todas las funciones premium.')) {
      try {
        await subscriptionOperations.cancelSubscription(userData.id);
        alert('Suscripción cancelada exitosamente');
        await loadUserData();
      } catch (error) {
        console.error('Error cancelando suscripción:', error);
        alert('Error cancelando la suscripción');
      }
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
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Cargando...</p>
              </div>
            </div>
          </div>
        </main>
        <TabBar />
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="pt-16 pb-20 px-4">
          <div className="max-w-md mx-auto">
            <div className="text-center py-20">
              <i className="ri-user-line text-gray-400 text-6xl mb-4"></i>
              <h2 className="text-xl font-bold text-gray-900 mb-4">Inicia sesión requerida</h2>
              <p className="text-gray-600 mb-8">Necesitas tener una cuenta para suscribirte al plan premium</p>
              <Link href="/registro" className="bg-red-600 text-white px-6 py-3 rounded-lg font-medium !rounded-button">
                Crear Cuenta
              </Link>
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
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-amber-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="ri-vip-crown-line text-white text-3xl"></i>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">VitalMente Premium</h1>
            <p className="text-gray-600">Desbloquea todo el potencial de la IA para tu salud</p>
          </div>

          {/* Current Status */}
          {subscriptionStatus?.isPremium ? (
            <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl p-6 mb-8">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <i className="ri-vip-crown-fill text-2xl mr-3"></i>
                  <div>
                    <h3 className="font-bold text-lg">Premium Activo</h3>
                    <p className="text-green-100 text-sm">Disfruta de todas las funciones</p>
                  </div>
                </div>
                <i className="ri-check-double-line text-3xl opacity-80"></i>
              </div>

              <div className="bg-white/20 rounded-lg p-3 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <span>Próxima renovación:</span>
                  <span className="font-medium">15 Feb 2024</span>
                </div>
              </div>

              <button
                onClick={cancelSubscription}
                className="w-full py-2 bg-white/20 text-white border border-white/30 rounded-lg font-medium !rounded-button hover:bg-white/30 transition-colors"
              >
                Cancelar Suscripción
              </button>
            </div>
          ) : (
            <>
              {/* Pricing Card */}
              <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
                <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white p-6 text-center">
                  <div className="text-4xl font-bold mb-2">$45,000</div>
                  <div className="text-amber-100">COP / mes</div>
                  <div className="text-xs text-amber-200 mt-1">Renovación automática • Cancela cuando quieras</div>
                </div>

                <div className="p-6">
                  <h3 className="font-bold text-gray-900 mb-4 text-center">Incluye todo lo que necesitas:</h3>

                  <div className="space-y-3 mb-6">
                    <div className="flex items-start">
                      <i className="ri-brain-line text-blue-600 mt-1 mr-3"></i>
                      <div>
                        <div className="font-medium text-gray-900">Análisis IA Personalizado</div>
                        <div className="text-gray-600 text-sm">Diagnósticos automáticos basados en tus patrones</div>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <i className="ri-file-list-3-line text-green-600 mt-1 mr-3"></i>
                      <div>
                        <div className="font-medium text-gray-900">Planes Nutricionales IA</div>
                        <div className="text-gray-600 text-sm">Generados específicamente para tu metabolismo</div>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <i className="ri-flask-line text-purple-600 mt-1 mr-3"></i>
                      <div>
                        <div className="font-medium text-gray-900">Suplementación Inteligente</div>
                        <div className="text-gray-600 text-sm">Recomendaciones basadas en déficits nutricionales</div>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <i className="ri-bar-chart-2-line text-red-600 mt-1 mr-3"></i>
                      <div>
                        <div className="font-medium text-gray-900">Dashboard Avanzado</div>
                        <div className="text-gray-600 text-sm">Métricas profundas y predicciones de progreso</div>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <i className="ri-download-2-line text-indigo-600 mt-1 mr-3"></i>
                      <div>
                        <div className="font-medium text-gray-900">Contenido Descargable</div>
                        <div className="text-gray-600 text-sm">Guías PDF especializadas y manuales completos</div>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <i className="ri-headphone-line text-orange-600 mt-1 mr-3"></i>
                      <div>
                        <div className="font-medium text-gray-900">Soporte Prioritario</div>
                        <div className="text-gray-600 text-sm">Acceso directo al equipo de especialistas</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Methods */}
              <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                <h3 className="font-bold text-gray-900 mb-4">Métodos de Pago</h3>

                <div className="space-y-3 mb-6">
                  <button
                    onClick={() => setSelectedPaymentMethod('CARD')}
                    className={`w-full p-4 border-2 rounded-lg flex items-center justify-between transition-colors !rounded-button ${
                      selectedPaymentMethod === 'CARD'
                        ? 'border-red-500 bg-red-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center">
                      <i className="ri-bank-card-line text-xl mr-3"></i>
                      <div className="text-left">
                        <div className="font-medium text-gray-900">Tarjeta de Crédito/Débito</div>
                        <div className="text-gray-600 text-sm">Visa, MasterCard, American Express</div>
                      </div>
                    </div>
                    {selectedPaymentMethod === 'CARD' && (
                      <i className="ri-check-line text-red-600"></i>
                    )}
                  </button>

                  <button
                    onClick={() => setSelectedPaymentMethod('PSE')}
                    className={`w-full p-4 border-2 rounded-lg flex items-center justify-between transition-colors !rounded-button ${
                      selectedPaymentMethod === 'PSE'
                        ? 'border-red-500 bg-red-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center">
                      <i className="ri-bank-line text-xl mr-3"></i>
                      <div className="text-left">
                        <div className="font-medium text-gray-900">PSE</div>
                        <div className="text-gray-600 text-sm">Pago Seguro en Línea</div>
                      </div>
                    </div>
                    {selectedPaymentMethod === 'PSE' && (
                      <i className="ri-check-line text-red-600"></i>
                    )}
                  </button>

                  <button
                    onClick={() => setSelectedPaymentMethod('NEQUI')}
                    className={`w-full p-4 border-2 rounded-lg flex items-center justify-between transition-colors !rounded-button ${
                      selectedPaymentMethod === 'NEQUI'
                        ? 'border-red-500 bg-red-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center">
                      <i className="ri-smartphone-line text-xl mr-3"></i>
                      <div className="text-left">
                        <div className="font-medium text-gray-900">Nequi</div>
                        <div className="text-gray-600 text-sm">Pago con tu celular</div>
                      </div>
                    </div>
                    {selectedPaymentMethod === 'NEQUI' && (
                      <i className="ri-check-line text-red-600"></i>
                    )}
                  </button>
                </div>
              </div>

              {/* Payment Button */}
              <button
                onClick={() => handlePayment(selectedPaymentMethod)}
                disabled={paymentLoading}
                className="w-full py-4 bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-lg font-bold text-lg !rounded-button hover:from-amber-700 hover:to-orange-700 transition-all shadow-lg disabled:opacity-50"
              >
                {paymentLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                    Procesando...
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <i className="ri-vip-crown-line mr-3"></i>
                    Suscribirse por $45,000/mes
                  </div>
                )}
              </button>

              {/* Security Info */}
              <div className="text-center mt-6">
                <div className="flex items-center justify-center text-sm text-gray-500 mb-2">
                  <i className="ri-shield-check-line text-green-600 mr-2"></i>
                  <span>Pago 100% seguro con encriptación SSL</span>
                </div>
                <div className="flex items-center justify-center text-sm text-gray-500">
                  <i className="ri-refresh-line text-blue-600 mr-2"></i>
                  <span>Renovación automática • Cancela cuando quieras</span>
                </div>
              </div>

              {/* Terms */}
              <div className="bg-gray-100 rounded-lg p-4 mt-6">
                <p className="text-xs text-gray-600 text-center">
                  Al suscribirte aceptas nuestros{' '}
                  <Link href="/terminos" className="text-red-600 underline">
                    Términos de Servicio
                  </Link>
                  {' '}y{' '}
                  <Link href="/privacidad" className="text-red-600 underline">
                    Política de Privacidad
                  </Link>
                  . Tu suscripción se renovará automáticamente cada mes por $45,000 COP hasta que la canceles.
                </p>
              </div>
            </>
          )}

          {/* FAQ */}
          <div className="bg-white rounded-xl shadow-sm p-6 mt-8">
            <h3 className="font-bold text-gray-900 mb-4">Preguntas Frecuentes</h3>

            <div className="space-y-4">
              <details className="group">
                <summary className="cursor-pointer font-medium text-gray-900 flex items-center justify-between">
                  ¿Puedo cancelar en cualquier momento?
                  <i className="ri-arrow-down-s-line group-open:rotate-180 transition-transform"></i>
                </summary>
                <p className="text-gray-600 text-sm mt-2">
                  Sí, puedes cancelar tu suscripción en cualquier momento desde tu perfil. No hay permanencia mínima.
                </p>
              </details>

              <details className="group">
                <summary className="cursor-pointer font-medium text-gray-900 flex items-center justify-between">
                  ¿La IA realmente personaliza las recomendaciones?
                  <i className="ri-arrow-down-s-line group-open:rotate-180 transition-transform"></i>
                </summary>
                <p className="text-gray-600 text-sm mt-2">
                  Absolutamente. Nuestra IA analiza tus patrones alimentarios, entrenamientos y progreso para generar recomendaciones específicas para ti.
                </p>
              </details>

              <details className="group">
                <summary className="cursor-pointer font-medium text-gray-900 flex items-center justify-between">
                  ¿Qué incluye el soporte prioritario?
                  <i className="ri-arrow-down-s-line group-open:rotate-180 transition-transform"></i>
                </summary>
                <p className="text-gray-600 text-sm mt-2">
                  Acceso directo a nuestro equipo de nutricionistas y entrenadores para consultas personalizadas y ajustes en tiempo real.
                </p>
              </details>
            </div>
          </div>

          {/* Estado de conexión mejorado */}
          {(loading || paymentLoading) && connectionStatus && (
            <div
              className={`flex items-center gap-2 text-sm p-3 rounded-lg mb-4 border ${
                connectionStatus.includes('✅') || connectionStatus.includes('🎉')
                  ? 'bg-green-50 border-green-200'
                  : connectionStatus.includes('❌')
                  ? 'bg-red-50 border-red-200'
                  : 'bg-blue-50 border-blue-200'
              }`}
            >
              <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              <span
                className={`${connectionStatus.includes('✅') || connectionStatus.includes('🎉')
                  ? 'text-green-700'
                  : connectionStatus.includes('❌')
                  ? 'text-red-700'
                  : 'text-blue-700'}`}
              >
                {connectionStatus}
              </span>
            </div>
          )}
        </div>
      </main>

      <TabBar />
    </div>
  );
}

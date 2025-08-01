'use client';

import { useState } from 'react';
import Link from 'next/link';

interface PremiumGateProps {
  feature?: string;
  onClose?: () => void;
}

export default function PremiumGate({ 
  feature = 'general',
  onClose 
}: PremiumGateProps) {

  const getContentMessage = () => {
    switch (feature) {
      case 'nutrition-plans':
        return {
          icon: 'ri-file-list-3-line',
          title: 'Planes Nutricionales Personalizados',
          description: 'Accede a planes generados por IA específicos para tu metabolismo y objetivos',
          features: ['Planes generados por IA', 'Análisis metabólico profundo', 'Ajustes automáticos', 'Seguimiento personalizado']
        };
      case 'supplements':
        return {
          icon: 'ri-microscope-line',
          title: 'Diagnósticos de Suplementación Avanzada',
          description: 'Análisis completo de déficits nutricionales con recomendaciones precisas',
          features: ['Análisis de déficits', 'Recomendaciones IA', 'Timing óptimo', 'Interacciones seguras']
        };
      case 'ai-analysis':
        return {
          icon: 'ri-bar-chart-2-line',
          title: 'Dashboard de Métricas Avanzadas',
          description: 'Analytics profundo con predicciones de progreso y optimizaciones',
          features: ['Métricas avanzadas', 'Predicciones IA', 'Tendencias personales', 'Alertas inteligentes']
        };
      default:
        return {
          icon: 'ri-vip-crown-line',
          title: 'Contenido Premium',
          description: 'Desbloquea funciones avanzadas con tu suscripción premium',
          features: ['Funciones avanzadas', 'Contenido exclusivo', 'Soporte prioritario', 'Actualizaciones premium']
        };
    }
  };

  const content = getContentMessage();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="relative bg-gradient-to-r from-amber-500 to-orange-500 text-white p-6 rounded-t-xl">
          {onClose && (
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center text-white/80 hover:text-white hover:bg-white/20 rounded-full transition-colors"
            >
              <i className="ri-close-line"></i>
            </button>
          )}
          
          <div className="text-center">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className={`${content.icon} text-3xl`}></i>
            </div>
            <h2 className="text-xl font-bold mb-2">¡Desbloquea Premium!</h2>
            <p className="text-amber-100 text-sm">
              Accede a funciones avanzadas con IA
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="mb-6">
            <h3 className="font-bold text-gray-900 mb-2">{content.title}</h3>
            <p className="text-gray-600 text-sm mb-4">{content.description}</p>
            
            <div className="space-y-2">
              {content.features.map((feature, index) => (
                <div key={index} className="flex items-center">
                  <i className="ri-check-line text-green-600 mr-3"></i>
                  <span className="text-gray-700 text-sm">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Pricing */}
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg p-4 mb-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900">$45,000</div>
              <div className="text-gray-600 text-sm">COP / mes</div>
              <div className="text-xs text-gray-500 mt-1">Renovación automática</div>
            </div>
          </div>

          {/* Premium Benefits */}
          <div className="mb-6">
            <h4 className="font-semibold text-gray-900 mb-3">Con Premium obtienes:</h4>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="flex items-center">
                <i className="ri-brain-line text-blue-600 mr-2"></i>
                <span className="text-gray-700">Análisis IA</span>
              </div>
              <div className="flex items-center">
                <i className="ri-file-list-3-line text-green-600 mr-2"></i>
                <span className="text-gray-700">Planes personalizados</span>
              </div>
              <div className="flex items-center">
                <i className="ri-bar-chart-2-line text-purple-600 mr-2"></i>
                <span className="text-gray-700">Métricas avanzadas</span>
              </div>
              <div className="flex items-center">
                <i className="ri-download-2-line text-orange-600 mr-2"></i>
                <span className="text-gray-700">Contenido descargable</span>
              </div>
              <div className="flex items-center">
                <i className="ri-flask-line text-red-600 mr-2"></i>
                <span className="text-gray-700">Suplementación IA</span>
              </div>
              <div className="flex items-center">
                <i className="ri-headphone-line text-indigo-600 mr-2"></i>
                <span className="text-gray-700">Soporte prioritario</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Link
              href="/suscripcion"
              className="w-full py-4 bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-lg font-semibold text-center block !rounded-button hover:from-amber-700 hover:to-orange-700 transition-all shadow-lg"
            >
              <i className="ri-vip-crown-line mr-2"></i>
              Suscribirse por $45,000/mes
            </Link>
            
            {onClose && (
              <button
                onClick={onClose}
                className="w-full py-3 bg-gray-100 text-gray-700 rounded-lg font-medium !rounded-button hover:bg-gray-200 transition-colors"
              >
                Continuar como usuario gratuito
              </button>
            )}
          </div>

          {/* Security Badge */}
          <div className="mt-4 text-center">
            <div className="flex items-center justify-center text-xs text-gray-500">
              <i className="ri-shield-check-line text-green-600 mr-1"></i>
              <span>Pago seguro con Wompi • Cancela cuando quieras</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
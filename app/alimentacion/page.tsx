
'use client';

import Header from '@/components/Header';
import TabBar from '@/components/TabBar';
import Link from 'next/link';

export default function AlimentacionPage() {
  const options = [
    {
      title: 'Calculadora de Macros',
      description: 'Calcula tus macronutrientes según tus objetivos',
      href: '/alimentacion/calculadora',
      icon: 'ri-calculator-line',
      color: 'bg-emerald-500'
    },
    {
      title: 'Banco de Alimentos',
      description: 'Explora 100+ alimentos y crea los tuyos',
      href: '/alimentacion/banco',
      icon: 'ri-database-line',
      color: 'bg-blue-500'
    },
    {
      title: 'Registro de Comidas',
      description: 'Lleva seguimiento completo de tu alimentación',
      href: '/alimentacion/registro',
      icon: 'ri-edit-box-line',
      color: 'bg-orange-500'
    },
    {
      title: 'Planes de Alimentación',
      description: 'Planes personalizados para tus metas',
      href: '/alimentacion/planes',
      icon: 'ri-file-list-line',
      color: 'bg-purple-500'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="pt-16 pb-20 px-4">
        <div className="max-w-md mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-8 mt-6">
            <div className="w-20 h-20 mx-auto mb-4 overflow-hidden rounded-full">
              <img
                src="https://readdy.ai/api/search-image?query=Fresh%20healthy%20colorful%20meal%20prep%20bowls%20with%20vegetables%2C%20proteins%2C%20grains%20beautifully%20arranged%2C%20vibrant%20colors%2C%20clean%20white%20background%2C%20nutritious%20food%20photography%2C%20natural%20lighting%2C%20high%20quality%20realistic%20photo%2C%20colorful%20organic%20produce%2C%20wellness%20nutrition%20concept%2C%20clean%20eating%20lifestyle%2C%20meal%20planning%20aesthetics&width=200&height=200&seq=nutrition_hero_new&orientation=squarish"
                alt="Alimentación Consciente"
                className="w-full h-full object-cover object-top"
              />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Alimentación Consciente
            </h1>
            <p className="text-gray-600 text-sm">
              Nutre tu cuerpo con inteligencia y propósito
            </p>
          </div>

          {/* Main Options */}
          <div className="space-y-4 mb-8">
            {options.map((option, index) => (
              <Link
                key={index}
                href={option.href}
                className="block bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-center">
                  <div className={`w-12 h-12 flex items-center justify-center ${option.color} rounded-lg mr-4`}>
                    <i className={`${option.icon} text-white text-lg`}></i>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">
                      {option.title}
                    </h3>
                    <p className="text-xs text-gray-500">
                      {option.description}
                    </p>
                  </div>
                  <i className="ri-arrow-right-s-line text-gray-400"></i>
                </div>
              </Link>
            ))}
          </div>

          {/* Tips Section */}
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-3">Consejos Nutricionales</h3>
            <div className="space-y-3">
              <div className="flex items-start">
                <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2 mr-3"></div>
                <p className="text-sm text-gray-600">
                  Mantén un equilibrio entre carbohidratos, proteínas y grasas saludables
                </p>
              </div>
              <div className="flex items-start">
                <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2 mr-3"></div>
                <p className="text-sm text-gray-600">
                  Hidrátate adecuadamente: al menos 8 vasos de agua al día
                </p>
              </div>
              <div className="flex items-start">
                <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2 mr-3"></div>
                <p className="text-sm text-gray-600">
                  Come con consciencia: mastica lentamente y disfruta cada bocado
                </p>
              </div>
              <div className="flex items-start">
                <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2 mr-3"></div>
                <p className="text-sm text-gray-600">
                  Registra tus comidas para identificar patrones y mejorar hábitos
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <TabBar />
    </div>
  );
}

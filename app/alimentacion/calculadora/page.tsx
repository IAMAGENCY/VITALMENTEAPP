
'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import TabBar from '@/components/TabBar';
import { dbOperations } from '@/lib/supabase';

export default function CalculadoraMacrosPage() {
  const [formData, setFormData] = useState({
    peso: '',
    altura: '',
    edad: '',
    genero: 'masculino',
    actividad: 'sedentario',
    objetivo: 'mantener'
  });

  const [resultado, setResultado] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState('Verificando conexión...');

  useEffect(() => {
    checkConnection();
  }, []);

  const checkConnection = async () => {
    try {
      setConnectionStatus('🔍 Verificando Supabase...');
      
      // Probar conexión con una consulta simple
      const { data, error } = await dbOperations.getUsers();
      
      if (!error) {
        setConnectionStatus('✅ Conectado a Supabase');
        console.log('✅ Conexión Supabase OK - Usuarios encontrados:', data?.length || 0);
      } else {
        setConnectionStatus('❌ Error de conexión');
        console.error('❌ Error conectando a Supabase:', error);
      }
    } catch (error) {
      setConnectionStatus('❌ Sin conexión a base de datos');
      console.error('💥 Error de conexión:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const calcularMacros = () => {
    const peso = parseFloat(formData.peso);
    const altura = parseFloat(formData.altura);
    const edad = parseInt(formData.edad);

    if (!peso || !altura || !edad) {
      alert('Por favor completa todos los campos');
      return;
    }

    // Cálculo TMB (Tasa Metabólica Basal)
    let tmb;
    if (formData.genero === 'masculino') {
      tmb = 88.362 + (13.397 * peso) + (4.799 * altura) - (5.677 * edad);
    } else {
      tmb = 447.593 + (9.247 * peso) + (3.098 * altura) - (4.330 * edad);
    }

    // Factor de actividad
    const factoresActividad = {
      sedentario: 1.2,
      ligero: 1.375,
      moderado: 1.55,
      activo: 1.725,
      muy_activo: 1.9
    };

    const calorias = tmb * factoresActividad[formData.actividad];

    // Ajuste por objetivo
    let caloriasObjetivo = calorias;
    if (formData.objetivo === 'perder') {
      caloriasObjetivo = calorias * 0.8;
    } else if (formData.objetivo === 'ganar') {
      caloriasObjetivo = calorias * 1.2;
    }

    // Distribución de macros
    const proteinas = peso * 2.2; // 2.2g por kg
    const grasas = caloriasObjetivo * 0.25 / 9; // 25% de calorías
    const carbohidratos = (caloriasObjetivo - (proteinas * 4) - (grasas * 9)) / 4;

    setResultado({
      calorias: Math.round(caloriasObjetivo),
      proteinas: Math.round(proteinas),
      carbohidratos: Math.round(carbohidratos),
      grasas: Math.round(grasas)
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="pt-16 pb-20 px-4">
        <div className="max-w-md mx-auto">
          {/* Header */}
          <div className="text-center mb-6 mt-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Calculadora de Macros
            </h1>
            <p className="text-gray-600 text-sm">
              Calcula tus necesidades nutricionales personalizadas
            </p>
          </div>

          {/* Estado de conexión */}
          <div className="mb-6">
            <div className={`flex items-center gap-2 text-sm p-3 rounded-lg ${connectionStatus.includes('✅') ? 'bg-green-50 border-green-200' : connectionStatus.includes('❌') ? 'bg-red-50 border-red-200' : 'bg-blue-50 border-blue-200'} border`}>
              <div className={`w-2 h-2 rounded-full ${connectionStatus.includes('✅') ? 'bg-green-500' : connectionStatus.includes('❌') ? 'bg-red-500' : 'bg-blue-500 animate-pulse'}`}></div>
              <span className={`${connectionStatus.includes('✅') ? 'text-green-700' : connectionStatus.includes('❌') ? 'text-red-700' : 'text-blue-700'}`}>{connectionStatus}</span>
              <button
                onClick={checkConnection}
                className="ml-auto w-4 h-4 flex items-center justify-center text-gray-400 hover:text-gray-600"
              >
                <i className="ri-refresh-line text-xs"></i>
              </button>
            </div>
          </div>

          {/* Formulario */}
          <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Peso (kg)
                </label>
                <input
                  type="number"
                  name="peso"
                  value={formData.peso}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  placeholder="Ej: 70"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Altura (cm)
                </label>
                <input
                  type="number"
                  name="altura"
                  value={formData.altura}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  placeholder="Ej: 175"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Edad
                </label>
                <input
                  type="number"
                  name="edad"
                  value={formData.edad}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  placeholder="Ej: 30"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Género
                </label>
                <div className="flex space-x-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="genero"
                      value="masculino"
                      checked={formData.genero === 'masculino'}
                      onChange={handleInputChange}
                      className="mr-2"
                    />
                    <span className="text-sm">Masculino</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="genero"
                      value="femenino"
                      checked={formData.genero === 'femenino'}
                      onChange={handleInputChange}
                      className="mr-2"
                    />
                    <span className="text-sm">Femenino</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nivel de Actividad
                </label>
                <select
                  name="actividad"
                  value={formData.actividad}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                >
                  <option value="sedentario">Sedentario (poco o nada)</option>
                  <option value="ligero">Ligero (1-3 días/semana)</option>
                  <option value="moderado">Moderado (3-5 días/semana)</option>
                  <option value="activo">Activo (6-7 días/semana)</option>
                  <option value="muy_activo">Muy Activo (2 veces/día)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Objetivo
                </label>
                <select
                  name="objetivo"
                  value={formData.objetivo}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                >
                  <option value="perder">Perder peso</option>
                  <option value="mantener">Mantener peso</option>
                  <option value="ganar">Ganar peso/músculo</option>
                </select>
              </div>
            </div>

            <button
              onClick={calcularMacros}
              className="w-full bg-emerald-600 text-white py-3 rounded-md font-medium mt-6 !rounded-button"
            >
              Calcular Macros
            </button>
          </div>

          {/* Resultados */}
          {resultado && (
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-4">Tus Macros Personalizados</h3>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="text-center p-4 bg-emerald-50 rounded-lg">
                  <div className="text-2xl font-bold text-emerald-600">
                    {resultado.calorias}
                  </div>
                  <div className="text-sm text-gray-600">Calorías/día</div>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    {resultado.proteinas}g
                  </div>
                  <div className="text-sm text-gray-600">Proteínas</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">
                    {resultado.carbohidratos}g
                  </div>
                  <div className="text-sm text-gray-600">Carbohidratos</div>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">
                    {resultado.grasas}g
                  </div>
                  <div className="text-sm text-gray-600">Grasas</div>
                </div>
              </div>

              <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-600 text-center">
                  Estos valores son una guía general. Consulta con un profesional 
                  para un plan personalizado.
                </p>
              </div>
            </div>
          )}
        </div>
      </main>

      <TabBar />
    </div>
  );
}

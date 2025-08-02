'use client';

import React, { useState, useEffect } from 'react';
import { supabase, dbOperations, initializeDatabase } from '../../lib/supabase';

export default function TestSupabase() {
  const [status, setStatus] = useState('⏳ Probando conexión...');
  const [foods, setFoods] = useState<any[]>([]);
  const [testResults, setTestResults] = useState<string[]>([]);

  useEffect(() => {
    testConnection();
  }, []);

  const addResult = (message: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const testConnection = async () => {
    try {
      // Test 1: Conexión básica
      addResult('🔗 Probando conexión a Supabase...');
      const { data, error } = await supabase.from('foods').select('count').single();
      
      if (error) {
        addResult(`❌ Error de conexión: ${error.message}`);
        setStatus('❌ Error de conexión');
        return;
      }

      addResult('✅ Conexión exitosa a Supabase');
      setStatus('✅ Conectado a Supabase');

      // Test 2: Verificar tablas
      addResult('📋 Verificando tabla foods...');
      const { data: foodsData, error: foodsError } = await dbOperations.getFoods();
      
      if (foodsError) {
        addResult(`❌ Error cargando alimentos: ${foodsError.message}`);
      } else {
        addResult(`✅ Tabla foods encontrada con ${foodsData?.length || 0} registros`);
        setFoods(foodsData || []);
      }

      // Test 3: Inicializar datos si están vacíos
      if (!foodsData || foodsData.length === 0) {
        addResult('🌱 Inicializando banco de alimentos...');
        await initializeDatabase();
        
        const { data: newFoods } = await dbOperations.getFoods();
        addResult(`✅ Banco inicializado con ${newFoods?.length || 0} alimentos`);
        setFoods(newFoods || []);
      }

    } catch (error) {
      addResult(`💥 Error inesperado: ${error}`);
      setStatus('💥 Error inesperado');
    }
  };

  const testCreateFood = async () => {
    try {
      addResult('🧪 Probando crear alimento personalizado...');
      
      // CORREGIDO: Objeto con TODAS las propiedades necesarias (inglés y español)
      const newFood = {
        // Propiedades en inglés (para compatibilidad)
        name: "Manzana Test",
        category: "Frutas",
        calories_per_100g: 52,
        protein_per_100g: 0.3,
        carbs_per_100g: 14,
        fat_per_100g: 0.2,
        fiber_per_100g: 2.4,
        is_custom: true,
        
        // Propiedades en español (según interfaz Food)
        nombre: "Manzana Test",
        categoria: "Frutas", 
        calorias_por_100g: 52,
        proteinas_por_100g: 0.3,
        carbohidratos_por_100g: 14,
        grasas_por_100g: 0.2,
        fibra_por_100g: 2.4,
        es_personalizado: true
      };

      const { data, error } = await dbOperations.createFood(newFood);
      
      if (error) {
        addResult(`❌ Error creando alimento: ${error.message}`);
      } else {
        // CORREGIDO: Usar nombre en español o fallback a inglés
        const foodName = data?.nombre || data?.name || 'Alimento creado';
        addResult(`✅ Alimento creado exitosamente: ${foodName}`);
        // Recargar lista
        const { data: updatedFoods } = await dbOperations.getFoods();
        setFoods(updatedFoods || []);
      }
    } catch (error) {
      addResult(`💥 Error en prueba de creación: ${error}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            🧪 Prueba de Conexión Supabase
          </h1>
          
          <div className="mb-4">
            <div className="text-lg font-semibold mb-2">Estado:</div>
            <div className="text-xl">{status}</div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="text-sm font-semibold text-blue-800 mb-2">URL Supabase:</div>
              <div className="text-xs text-blue-600 break-all">
                https://jkxyioiajkyakftdeazt.supabase.co
              </div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="text-sm font-semibold text-green-800 mb-2">Alimentos en DB:</div>
              <div className="text-xl font-bold text-green-600">{foods.length}</div>
            </div>
          </div>

          <div className="flex gap-4 mb-6">
            <button
              onClick={testConnection}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              🔄 Reconectar
            </button>
            <button
              onClick={testCreateFood}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              🧪 Probar Crear Alimento
            </button>
          </div>
        </div>

        {/* Log de resultados */}
        <div className="bg-black text-green-400 p-4 rounded-lg font-mono text-sm max-h-96 overflow-y-auto">
          <div className="mb-2 font-bold">📋 Log de Pruebas:</div>
          {testResults.map((result, index) => (
            <div key={index} className="mb-1">{result}</div>
          ))}
        </div>

        {/* Muestra de alimentos */}
        {foods.length > 0 && (
          <div className="bg-white rounded-lg shadow-lg p-6 mt-6">
            <h2 className="text-xl font-bold mb-4">🍎 Primeros 10 Alimentos en DB:</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {foods.slice(0, 10).map((food) => (
                <div key={food.id} className="bg-gray-50 p-3 rounded-lg">
                  {/* CORREGIDO: Usar propiedades con fallback */}
                  <div className="font-semibold text-gray-900">
                    {food.nombre || food.name || 'Sin nombre'}
                  </div>
                  <div className="text-sm text-gray-600">
                    {food.categoria || food.category || 'Sin categoría'} • {' '}
                    {food.calorias_por_100g || food.calories_per_100g || 0} cal/100g
                    {(food.es_personalizado || food.is_custom) && (
                      <span className="ml-2 text-blue-600">👤 Personalizado</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
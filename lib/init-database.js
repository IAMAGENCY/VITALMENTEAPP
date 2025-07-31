// SCRIPT PARA INICIALIZAR LA BASE DE DATOS CON DATOS INICIALES
// Ejecutar en la consola del navegador o como script de Node.js

import { initializeDatabase } from './supabase.js';

async function initVitalMenteDatabase() {
  try {
    console.log('🚀 Inicializando base de datos VitalMente...');
    
    // Cargar alimentos iniciales
    const { data: foods, error: foodsError } = await initializeDatabase.loadInitialFoods();
    
    if (foodsError) {
      console.error('❌ Error cargando alimentos:', foodsError);
    } else {
      console.log('✅ Alimentos cargados exitosamente:', foods?.length || 0);
    }
    
    // Crear buckets de almacenamiento
    await initializeDatabase.createStorageBuckets();
    
    console.log('🎉 Base de datos inicializada completamente!');
    
  } catch (error) {
    console.error('💥 Error inicializando base de datos:', error);
  }
}

// Ejecutar inicialización
initVitalMenteDatabase();
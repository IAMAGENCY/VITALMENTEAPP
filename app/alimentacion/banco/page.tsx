'use client';
import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import TabBar from '@/components/TabBar';
import BankManager from './BankManager';
import { dbOperations, initializeDatabase, loadInitialFoods } from '@/lib/supabase';

export default function BancoPage() {
  const [isInitialized, setIsInitialized] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      setLoading(true);
      
      // Verificar si ya hay alimentos cargados
      const { data: foods, error } = await dbOperations.getFoods();
      
      if (!error && foods && foods.length > 0) {
        console.log('✅ Alimentos ya cargados:', foods.length);
        setIsInitialized(true);
      } else {
        console.log('🔄 Cargando banco de alimentos inicial...');
        // Cargar alimentos iniciales - LÍNEA CORREGIDA
        await loadInitialFoods();
        setIsInitialized(true);
      }
    } catch (error) {
      console.error('❌ Error inicializando app:', error);
      setIsInitialized(true); // Continuar aunque haya error
    } finally {
      setLoading(false);
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
                <p className="text-gray-600">Cargando banco de alimentos...</p>
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
              Banco de Alimentos
            </h1>
            <p className="text-gray-600 text-sm">
              Explora y crea alimentos personalizados
            </p>
          </div>
          <BankManager showAddFood={true} />
        </div>
      </main>
      <TabBar />
    </div>
  );
}
'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import TabBar from '@/components/TabBar';
import { useRouter } from 'next/navigation';
import { dbOperations } from '@/lib/supabase';

export default function RegistroPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('');
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    edad: '',
    peso: '',
    altura: '',
    genero: 'masculino' as 'masculino' | 'femenino',
    actividad: 'sedentario',
    objetivo: 'mantener_peso', // CORREGIDO: Usar valor correcto desde el inicio
    experiencia: 'principiante',
    condiciones: [] as string[],
    preferencias: [] as string[]
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;

    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({
        ...prev,
        [name]: checked 
          ? [...prev[name as keyof typeof prev] as string[], value]
          : (prev[name as keyof typeof prev] as string[]).filter(item => item !== value)
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateStep = (stepNumber: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (stepNumber === 1) {
      if (!formData.nombre.trim()) newErrors.nombre = 'El nombre es requerido';
      if (!formData.email.trim()) newErrors.email = 'El email es requerido';
      if (!formData.edad || parseInt(formData.edad) < 1) newErrors.edad = 'La edad es requerida';
    }

    if (stepNumber === 2) {
      if (!formData.peso || parseFloat(formData.peso) <= 0) newErrors.peso = 'El peso es requerido';
      if (!formData.altura || parseInt(formData.altura) <= 0) newErrors.altura = 'La altura es requerida';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(step)) {
      setStep(step + 1);
    }
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  const handleSubmit = async () => {
    if (!validateStep(step)) return;

    setLoading(true);

    try {
      setConnectionStatus('⏳ Guardando en Supabase...');

      // VERIFICAR CONEXIÓN PRIMERO
      const { data: testConnection } = await dbOperations.getUsers();
      if (testConnection === null) {
        throw new Error('No se puede conectar a Supabase');
      }

      // Preparar datos para Supabase - CORREGIDO: objetivo ya viene con el valor correcto
      const userData = {
         nombre: formData.nombre.trim(),
         email: formData.email.trim().toLowerCase(),
         edad: parseInt(formData.edad),
         peso: parseFloat(formData.peso),
         altura: parseInt(formData.altura),
         genero: formData.genero as 'masculino' | 'femenino' | 'otro',
         nivel_actividad: formData.actividad as 'sedentario' | 'ligero' | 'moderado' | 'activo' | 'muy_activo',
         objetivo: formData.objetivo as 'perder_peso' | 'mantener_peso' | 'ganar_peso' | 'ganar_musculo',
         experiencia: formData.experiencia,
         condiciones: formData.condiciones || [],
         preferencias: formData.preferencias || [],
         subscription_status: 'free' as 'free' | 'premium' | 'pro'
       };
      console.log('🔍 Datos a enviar a Supabase:', userData);

      // Verificar si el usuario ya existe por email
      const { data: existingUser } = await dbOperations.getUserByEmail(userData.email);

      let finalUser;

      if (existingUser) {
        setConnectionStatus('🔄 Usuario encontrado - Actualizando datos...');
        console.log('🔄 Actualizando usuario existente ID:', existingUser.id);

        // Actualizar usuario existente
        const { data: updatedUser, error } = await dbOperations.updateUser(existingUser.id, userData);

        if (error) {
          console.error('❌ Error actualizando usuario:', error);
          throw new Error(`Error actualizando: ${error.message}`);
        }

        finalUser = updatedUser;
        console.log('✅ Usuario actualizado:', finalUser);
        setConnectionStatus('✅ Perfil actualizado exitosamente');

      } else {
        setConnectionStatus('➕ Creando nuevo usuario...');
        console.log('➕ Creando nuevo usuario...');

        // Crear nuevo usuario
        const { data: newUser, error } = await dbOperations.createUser(userData);

        if (error) {
          console.error('❌ Error creando usuario:', error);

          // MOSTRAR ERROR ESPECÍFICO AL USUARIO
          if (error.message.includes('duplicate key')) {
            throw new Error('Este email ya está registrado');
          } else if (error.message.includes('violates check constraint')) {
            throw new Error('Datos inválidos en el formulario');
          } else {
            throw new Error(`Error de base de datos: ${error.message}`);
          }
        }

        finalUser = newUser;
        console.log('✅ Usuario creado exitosamente:', finalUser);
        setConnectionStatus('✅ Usuario creado exitosamente');
      }

      // Esperar un momento y navegar al perfil
      setTimeout(() => {
        router.push('/perfil');
      }, 1500);

    } catch (error: any) {
      console.error('💥 ERROR COMPLETO:', error);

      // MOSTRAR ERROR ESPECÍFICO AL USUARIO
      setConnectionStatus(`❌ Error: ${error.message}`);

      // Mantener el error visible por más tiempo
      setTimeout(() => {
        setConnectionStatus('');
      }, 5000);

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="pt-20 pb-20 px-4">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8 mt-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Crea tu Perfil
            </h1>
            <p className="text-gray-600 text-sm">
              Personaliza tu experiencia en VitalMente
            </p>
          </div>

          {/* Estado de conexión */}
          {loading && connectionStatus && (
            <div className={`flex items-center gap-2 text-sm p-3 rounded-lg mb-4 border ${connectionStatus.includes('✅') ? 'bg-green-50 border-green-200' : connectionStatus.includes('❌') ? 'bg-red-50 border-red-200' : 'bg-blue-50 border-blue-200'}`}>
              <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              <span className={`${connectionStatus.includes('✅') ? 'text-green-700' : connectionStatus.includes('❌') ? 'text-red-700' : 'text-blue-700'}`}>{connectionStatus}</span>
            </div>
          )}

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600">Paso {step} de 3</span>
              <span className="text-sm text-gray-600">{Math.round((step/3)*100)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-emerald-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(step/3)*100}%` }}
              ></div>
            </div>
          </div>

          {/* Step 1: Información Personal */}
          {step === 1 && (
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-4">Información Personal</h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre Completo
                  </label>
                  <input
                    type="text"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-md text-sm ${errors.nombre ? 'border-red-300' : 'border-gray-300'}`}
                    placeholder="Tu nombre completo"
                  />
                  {errors.nombre && <p className="text-red-500 text-xs mt-1">{errors.nombre}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-md text-sm ${errors.email ? 'border-red-300' : 'border-gray-300'}`}
                    placeholder="tu@email.com"
                  />
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
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
                    min="1"
                    max="120"
                    className={`w-full px-3 py-2 border rounded-md text-sm ${errors.edad ? 'border-red-300' : 'border-gray-300'}`}
                    placeholder="Ej: 30"
                  />
                  {errors.edad && <p className="text-red-500 text-xs mt-1">{errors.edad}</p>}
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
              </div>
            </div>
          )}

          {/* Step 2: Datos Físicos */}
          {step === 2 && (
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-4">Datos Físicos</h3>

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
                    min="20"
                    max="300"
                    step="0.1"
                    className={`w-full px-3 py-2 border rounded-md text-sm ${errors.peso ? 'border-red-300' : 'border-gray-300'}`}
                    placeholder="Ej: 70.5"
                  />
                  {errors.peso && <p className="text-red-500 text-xs mt-1">{errors.peso}</p>}
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
                    min="100"
                    max="250"
                    className={`w-full px-3 py-2 border rounded-md text-sm ${errors.altura ? 'border-red-300' : 'border-gray-300'}`}
                    placeholder="Ej: 175"
                  />
                  {errors.altura && <p className="text-red-500 text-xs mt-1">{errors.altura}</p>}
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
                    Experiencia en Entrenamiento
                  </label>
                  <select
                    name="experiencia"
                    value={formData.experiencia}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  >
                    <option value="principiante">Principiante</option>
                    <option value="intermedio">Intermedio</option>
                    <option value="avanzado">Avanzado</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Objetivos y Preferencias */}
          {step === 3 && (
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-4">Objetivos y Preferencias</h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Objetivo Principal
                  </label>
                  <select
                    name="objetivo"
                    value={formData.objetivo}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  >
                    {/* CORREGIDO: Usar los valores exactos que espera la base de datos */}
                    <option value="perder_peso">Perder peso</option>
                    <option value="mantener_peso">Mantener peso</option>
                    <option value="ganar_peso">Ganar peso</option>
                    <option value="ganar_musculo">Ganar músculo</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Condiciones Especiales (opcional)
                  </label>
                  <div className="space-y-2">
                    {['Diabetes', 'Hipertensión', 'Vegetariano', 'Vegano', 'Intolerancias'].map(condition => (
                      <label key={condition} className="flex items-center">
                        <input
                          type="checkbox"
                          name="condiciones"
                          value={condition}
                          checked={formData.condiciones.includes(condition)}
                          onChange={handleInputChange}
                          className="mr-2"
                        />
                        <span className="text-sm">{condition}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Preferencias de Entrenamiento
                  </label>
                  <div className="space-y-2">
                    {['Fuerza', 'Cardio', 'Flexibilidad', 'Funcional', 'Yoga'].map(preference => (
                      <label key={preference} className="flex items-center">
                        <input
                          type="checkbox"
                          name="preferencias"
                          value={preference}
                          checked={formData.preferencias.includes(preference)}
                          onChange={handleInputChange}
                          className="mr-2"
                        />
                        <span className="text-sm">{preference}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-6">
            {step > 1 && (
              <button
                onClick={prevStep}
                disabled={loading}
                className="px-6 py-2 bg-gray-200 text-gray-700 rounded-md !rounded-button disabled:opacity-50"
              >
                Anterior
              </button>
            )}

            {step < 3 ? (
              <button
                onClick={nextStep}
                disabled={loading}
                className="px-6 py-2 bg-emerald-600 text-white rounded-md !rounded-button ml-auto disabled:opacity-50"
              >
                Siguiente
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="px-6 py-2 bg-emerald-600 text-white rounded-md !rounded-button ml-auto disabled:opacity-50 flex items-center"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Guardando...
                  </>
                ) : (
                  'Completar Registro'
                )}
              </button>
            )}
          </div>
        </div>
      </main>

      <TabBar />
    </div>
  );
}
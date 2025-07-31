
'use client';

import { useState, useEffect } from 'react';
import { dbOperations } from '@/lib/supabase';
import { WorkoutLink } from '@/lib/types';

export default function WorkoutManager() {
  const [workouts, setWorkouts] = useState<WorkoutLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [connectionStatus, setConnectionStatus] = useState('Verificando...');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    url: '',
    platform: 'youtube' as 'youtube' | 'spotify',
    category: 'tren_superior',
    difficulty: 'principiante' as 'principiante' | 'intermedio' | 'avanzado',
    duration: '',
    image_url: '',
    tags: '',
    is_active: true
  });

  const categories = [
    { value: 'tren_superior', label: 'Tren Superior' },
    { value: 'tren_inferior', label: 'Tren Inferior' },
    { value: 'cardio', label: 'Cardio' },
    { value: 'funcional', label: 'Funcional' },
    { value: 'pierna', label: 'Pierna' },
    { value: 'gluteo', label: 'Glúteo' },
    { value: 'brazo', label: 'Brazo' },
    { value: 'flexibilidad', label: 'Flexibilidad' }
  ];

  useEffect(() => {
    loadWorkouts();
  }, []);

  const loadWorkouts = async () => {
    setLoading(true);
    try {
      setConnectionStatus(' Conectando a Supabase...');
      const { data, error } = await dbOperations.getWorkoutLinks();

      if (error) {
        console.error('Error loading workouts:', error);
        setConnectionStatus(' Error de conexión - Usando datos locales');
        loadLocalWorkouts();
      } else if (!data || data.length === 0) {
        setConnectionStatus(' Base de datos vacía - Inicializando...');
        await initializeWorkouts();
      } else {
        setWorkouts(data);
        setConnectionStatus(` Supabase conectado (${data.length} entrenamientos)`);
      }
    } catch (error) {
      console.error('Error connecting to Supabase:', error);
      setConnectionStatus(' Sin conexión - Modo local');
      loadLocalWorkouts();
    } finally {
      setLoading(false);
    }
  };

  const initializeWorkouts = async () => {
    const initialWorkouts = [
      // CARDIO WORKOUTS
      {
        title: 'HIIT Cardio Quema Grasa - 20 Minutos',
        description: 'Entrenamiento de alta intensidad para quemar grasa rápidamente',
        url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        platform: 'youtube' as const,
        category: 'cardio',
        difficulty: 'intermedio' as const,
        duration: 20,
        image_url: 'https://readdy.ai/api/search-image?query=HIIT%20cardio%20workout%2C%20high%20intensity%20interval%20training%2C%20fat%20burning%20exercise%2C%20fitness%20cardio%20training%2C%20energetic%20workout%20session%2C%20gym%20cardio%20equipment&width=400&height=300&seq=hiit_cardio1&orientation=landscape',
        tags: ['hiit', 'quemar_grasa', 'alta_intensidad', 'cardio'],
        is_active: true
      },
      {
        title: 'Cardio Danza Divertida - 30 Minutos',
        description: 'Baila y quema calorías con esta rutina de cardio danza',
        url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        platform: 'youtube' as const,
        category: 'cardio',
        difficulty: 'principiante' as const,
        duration: 30,
        image_url: 'https://readdy.ai/api/search-image?query=Dance%20cardio%20workout%2C%20fun%20fitness%20dancing%2C%20zumba%20style%20exercise%2C%20energetic%20dance%20fitness%2C%20group%20fitness%20class%2C%20cardio%20dance%20session&width=400&height=300&seq=dance_cardio1&orientation=landscape',
        tags: ['danza', 'divertido', 'principiante', 'baile'],
        is_active: true
      },
      {
        title: 'Playlist Cardio Energética',
        description: 'Música motivacional perfecta para entrenamientos de cardio',
        url: 'https://open.spotify.com/playlist/37i9dQZF1DX76Wlfdnj7AP',
        platform: 'spotify' as const,
        category: 'cardio',
        difficulty: 'principiante' as const,
        duration: 45,
        image_url: 'https://readdy.ai/api/search-image?query=Energetic%20cardio%20music%2C%20workout%20playlist%2C%20motivational%20fitness%20music%2C%20gym%20music%2C%20upbeat%20training%20songs%2C%20exercise%20motivation&width=400&height=300&seq=cardio_music1&orientation=landscape',
        tags: ['musica', 'motivacion', 'energia', 'playlist'],
        is_active: true
      },
      {
        title: 'Cardio TABATA - 15 Minutos',
        description: 'Protocolo TABATA para máxima quema de grasa en poco tiempo',
        url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        platform: 'youtube' as const,
        category: 'cardio',
        difficulty: 'avanzado' as const,
        duration: 15,
        image_url: 'https://readdy.ai/api/search-image?query=TABATA%20cardio%20workout%2C%20intense%20interval%20training%2C%20advanced%20fitness%2C%20high%20intensity%20exercise%2C%20fat%20burning%20TABATA%2C%20professional%20workout&width=400&height=300&seq=tabata_cardio1&orientation=landscape',
        tags: ['tabata', 'intenso', 'avanzado', 'corto'],
        is_active: true
      },
      {
        title: 'Cardio en Casa Sin Equipos',
        description: 'Rutina de cardio completa que puedes hacer en casa sin equipos',
        url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        platform: 'youtube' as const,
        category: 'cardio',
        difficulty: 'intermedio' as const,
        duration: 25,
        image_url: 'https://readdy.ai/api/search-image?query=Home%20cardio%20workout%2C%20no%20equipment%20exercise%2C%20bodyweight%20cardio%2C%20at%20home%20fitness%2C%20indoor%20workout%20routine%2C%20home%20gym%20setup&width=400&height=300&seq=home_cardio1&orientation=landscape',
        tags: ['casa', 'sin_equipos', 'bodyweight', 'practico'],
        is_active: true
      },
      {
        title: 'Cardio para Principiantes',
        description: 'Rutina suave de cardio perfecta para empezar tu journey fitness',
        url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        platform: 'youtube' as const,
        category: 'cardio',
        difficulty: 'principiante' as const,
        duration: 20,
        image_url: 'https://readdy.ai/api/search-image?query=Beginner%20cardio%20workout%2C%20gentle%20fitness%20exercise%2C%20starter%20workout%20routine%2C%20easy%20cardio%20training%2C%20fitness%20for%20beginners%2C%20low%20impact%20exercise&width=400&height=300&seq=beginner_cardio1&orientation=landscape',
        tags: ['principiante', 'suave', 'inicio', 'facil'],
        is_active: true
      },

      // FUNCIONAL WORKOUTS
      {
        title: 'Entrenamiento Funcional Completo',
        description: 'Movimientos funcionales para mejorar tu fuerza y movilidad',
        url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        platform: 'youtube' as const,
        category: 'funcional',
        difficulty: 'intermedio' as const,
        duration: 35,
        image_url: 'https://readdy.ai/api/search-image?query=Functional%20training%20workout%2C%20compound%20movements%2C%20kettlebell%20exercise%2C%20functional%20fitness%2C%20mobility%20training%2C%20strength%20and%20conditioning&width=400&height=300&seq=functional_complete1&orientation=landscape',
        tags: ['funcional', 'movilidad', 'fuerza', 'completo'],
        is_active: true
      },
      {
        title: 'CrossFit WOD del Día',
        description: 'Workout of the Day estilo CrossFit para atletas avanzados',
        url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        platform: 'youtube' as const,
        category: 'funcional',
        difficulty: 'avanzado' as const,
        duration: 40,
        image_url: 'https://readdy.ai/api/search-image?query=CrossFit%20WOD%20workout%2C%20functional%20fitness%20training%2C%20high%20intensity%20functional%20movement%2C%20crossfit%20gym%2C%20athletic%20training%2C%20competitive%20fitness&width=400&height=300&seq=crossfit_wod1&orientation=landscape',
        tags: ['crossfit', 'wod', 'atletico', 'competitivo'],
        is_active: true
      },
      {
        title: 'Funcional con Kettlebells',
        description: 'Rutina funcional usando kettlebells para fuerza total',
        url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        platform: 'youtube' as const,
        category: 'funcional',
        difficulty: 'intermedio' as const,
        duration: 30,
        image_url: 'https://readdy.ai/api/search-image?query=Kettlebell%20functional%20workout%2C%20kettlebell%20training%2C%20functional%20strength%20exercise%2C%20compound%20kettlebell%20movements%2C%20full%20body%20workout&width=400&height=300&seq=kettlebell_func1&orientation=landscape',
        tags: ['kettlebell', 'fuerza', 'funcional', 'total'],
        is_active: true
      },
      {
        title: 'Playlist Funcional Motivacional',
        description: 'Música perfecta para entrenamientos funcionales intensos',
        url: 'https://open.spotify.com/playlist/37i9dQZF1DX76Wlfdnj7AP',
        platform: 'spotify' as const,
        category: 'funcional',
        difficulty: 'principiante' as const,
        duration: 50,
        image_url: 'https://readdy.ai/api/search-image?query=Functional%20training%20music%2C%20workout%20motivation%20playlist%2C%20gym%20music%2C%20intense%20training%20songs%2C%20functional%20fitness%20motivation&width=400&height=300&seq=functional_music1&orientation=landscape',
        tags: ['musica', 'motivacion', 'intenso', 'funcional'],
        is_active: true
      },
      {
        title: 'Funcional para Deportistas',
        description: 'Entrenamiento específico para mejorar rendimiento deportivo',
        url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        platform: 'youtube' as const,
        category: 'funcional',
        difficulty: 'avanzado' as const,
        duration: 45,
        image_url: 'https://readdy.ai/api/search-image?query=Sports%20specific%20functional%20training%2C%20athletic%20performance%20workout%2C%20sport%20conditioning%2C%20functional%20movement%20for%20athletes%2C%20performance%20training&width=400&height=300&seq=sports_func1&orientation=landscape',
        tags: ['deportistas', 'rendimiento', 'especifico', 'atletico'],
        is_active: true
      },
      {
        title: 'Movimientos Básicos Funcionales',
        description: 'Aprende los patrones de movimiento funcional básicos',
        url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        platform: 'youtube' as const,
        category: 'funcional',
        difficulty: 'principiante' as const,
        duration: 25,
        image_url: 'https://readdy.ai/api/search-image?query=Basic%20functional%20movements%2C%20movement%20patterns%2C%20functional%20fitness%20basics%2C%20fundamental%20exercises%2C%20mobility%20training%20basics&width=400&height=300&seq=basic_func1&orientation=landscape',
        tags: ['basico', 'patrones', 'fundamentos', 'principiante'],
        is_active: true
      },

      // TREN SUPERIOR WORKOUTS
      {
        title: 'Pecho y Tríceps Masa Muscular',
        description: 'Rutina intensa para desarrollar pecho y tríceps',
        url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        platform: 'youtube' as const,
        category: 'tren_superior',
        difficulty: 'avanzado' as const,
        duration: 50,
        image_url: 'https://readdy.ai/api/search-image?query=Chest%20and%20triceps%20workout%2C%20upper%20body%20mass%20building%2C%20bench%20press%20training%2C%20muscle%20building%20exercise%2C%20gym%20strength%20training&width=400&height=300&seq=chest_triceps1&orientation=landscape',
        tags: ['pecho', 'triceps', 'masa', 'fuerza'],
        is_active: true
      },
      {
        title: 'Espalda y Bíceps Definición',
        description: 'Entrena espalda y bíceps para una definición perfecta',
        url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        platform: 'youtube' as const,
        category: 'tren_superior',
        difficulty: 'intermedio' as const,
        duration: 45,
        image_url: 'https://readdy.ai/api/search-image?query=Back%20and%20biceps%20workout%2C%20upper%20body%20definition%2C%20pull%20up%20training%2C%20muscle%20definition%20exercise%2C%20back%20muscle%20development&width=400&height=300&seq=back_biceps1&orientation=landscape',
        tags: ['espalda', 'biceps', 'definicion', 'tonificacion'],
        is_active: true
      },
      {
        title: 'Hombros 3D - Desarrollo Completo',
        description: 'Rutina completa para desarrollar hombros tridimensionales',
        url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        platform: 'youtube' as const,
        category: 'tren_superior',
        difficulty: 'avanzado' as const,
        duration: 40,
        image_url: 'https://readdy.ai/api/search-image?query=Shoulder%20workout%203D%20development%2C%20deltoid%20training%2C%20shoulder%20press%20exercise%2C%20complete%20shoulder%20development%2C%20shoulder%20muscle%20building&width=400&height=300&seq=shoulders_3d1&orientation=landscape',
        tags: ['hombros', 'deltoides', '3d', 'completo'],
        is_active: true
      },
      {
        title: 'Tren Superior en Casa',
        description: 'Entrena todo el tren superior desde casa con poco equipo',
        url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        platform: 'youtube' as const,
        category: 'tren_superior',
        difficulty: 'intermedio' as const,
        duration: 35,
        image_url: 'https://readdy.ai/api/search-image?query=Upper%20body%20home%20workout%2C%20home%20gym%20training%2C%20bodyweight%20upper%20body%2C%20at%20home%20strength%20training%2C%20home%20fitness%20routine&width=400&height=300&seq=upper_home1&orientation=landscape',
        tags: ['casa', 'sin_gym', 'practico', 'efectivo'],
        is_active: true
      },
      {
        title: 'Playlist Rock para Entrenar',
        description: 'Música rock perfecta para entrenamientos de fuerza',
        url: 'https://open.spotify.com/playlist/37i9dQZF1DX76Wlfdnj7AP',
        platform: 'spotify' as const,
        category: 'tren_superior',
        difficulty: 'principiante' as const,
        duration: 60,
        image_url: 'https://readdy.ai/api/search-image?query=Rock%20workout%20music%2C%20heavy%20metal%20gym%20music%2C%20strength%20training%20playlist%2C%20motivational%20rock%20music%2C%20intense%20workout%20songs&width=400&height=300&seq=rock_music1&orientation=landscape',
        tags: ['rock', 'fuerza', 'motivacion', 'intenso'],
        is_active: true
      },
      {
        title: 'Upper Body para Principiantes',
        description: 'Introducción al entrenamiento de tren superior',
        url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        platform: 'youtube' as const,
        category: 'tren_superior',
        difficulty: 'principiante' as const,
        duration: 25,
        image_url: 'https://readdy.ai/api/search-image?query=Beginner%20upper%20body%20workout%2C%20starter%20strength%20training%2C%20basic%20upper%20body%20exercise%2C%20fitness%20for%20beginners%2C%20introductory%20workout&width=400&height=300&seq=upper_beginner1&orientation=landscape',
        tags: ['principiante', 'basico', 'inicio', 'suave'],
        is_active: true
      },

      // TREN INFERIOR WORKOUTS
      {
        title: 'Piernas y Glúteos Extremo',
        description: 'Rutina extrema para desarrollar piernas y glúteos poderosos',
        url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        platform: 'youtube' as const,
        category: 'tren_inferior',
        difficulty: 'avanzado' as const,
        duration: 55,
        image_url: 'https://readdy.ai/api/search-image?query=Extreme%20leg%20and%20glute%20workout%2C%20squat%20training%2C%20lower%20body%20mass%20building%2C%20intense%20leg%20exercise%2C%20glute%20development%20training&width=400&height=300&seq=legs_extreme1&orientation=landscape',
        tags: ['piernas', 'gluteos', 'extremo', 'masa'],
        is_active: true
      },
      {
        title: 'Sentadillas Perfectas - Técnica',
        description: 'Aprende la técnica perfecta de sentadillas paso a paso',
        url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        platform: 'youtube' as const,
        category: 'tren_inferior',
        difficulty: 'principiante' as const,
        duration: 20,
        image_url: 'https://readdy.ai/api/search-image?query=Perfect%20squat%20technique%2C%20proper%20squat%20form%2C%20squat%20tutorial%2C%20correct%20squatting%20technique%2C%20squat%20instruction%20guide&width=400&height=300&seq=perfect_squats1&orientation=landscape',
        tags: ['sentadillas', 'tecnica', 'forma', 'tutorial'],
        is_active: true
      },
      {
        title: 'Cuádriceps y Femorales Balance',
        description: 'Rutina balanceada para cuádriceps y músculos femorales',
        url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        platform: 'youtube' as const,
        category: 'tren_inferior',
        difficulty: 'intermedio' as const,
        duration: 40,
        image_url: 'https://readdy.ai/api/search-image?query=Quadriceps%20and%20hamstring%20workout%2C%20balanced%20leg%20training%2C%20thigh%20muscle%20development%2C%20leg%20strength%20exercise%2C%20muscle%20balance%20training&width=400&height=300&seq=quads_hams1&orientation=landscape',
        tags: ['cuadriceps', 'femorales', 'balance', 'simetria'],
        is_active: true
      },
      {
        title: 'Glúteo Perfecto en Casa',
        description: 'Rutina específica para desarrollar glúteos desde casa',
        url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        platform: 'youtube' as const,
        category: 'tren_inferior',
        difficulty: 'intermedio' as const,
        duration: 30,
        image_url: 'https://readdy.ai/api/search-image?query=Perfect%20glute%20workout%20at%20home%2C%20booty%20building%20exercise%2C%20glute%20activation%2C%20home%20glute%20training%2C%20butt%20workout%20routine&width=400&height=300&seq=glutes_home1&orientation=landscape',
        tags: ['gluteos', 'casa', 'perfecto', 'tonificacion'],
        is_active: true
      },
      {
        title: 'Playlist Latina Motivacional',
        description: 'Ritmos latinos para energizar tus entrenamientos de pierna',
        url: 'https://open.spotify.com/playlist/37i9dQZF1DX76Wlfdnj7AP',
        platform: 'spotify' as const,
        category: 'tren_inferior',
        difficulty: 'principiante' as const,
        duration: 45,
        image_url: 'https://readdy.ai/api/search-image?query=Latin%20workout%20music%2C%20motivational%20latin%20rhythms%2C%20energetic%20latin%20fitness%20music%2C%20upbeat%20training%20songs%2C%20latin%20dance%20workout%20music&width=400&height=300&seq=latina_music1&orientation=landscape',
        tags: ['latina', 'ritmos', 'energia', 'motivacion'],
        is_active: true
      },
      {
        title: 'Pantorrillas de Acero',
        description: 'Entrena pantorrillas para tener piernas completas y definidas',
        url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        platform: 'youtube' as const,
        category: 'tren_inferior',
        difficulty: 'avanzado' as const,
        duration: 25,
        image_url: 'https://readdy.ai/api/search-image?query=Calf%20muscle%20workout%2C%20steel%20calves%20training%2C%20calf%20development%20exercise%2C%20lower%20leg%20strength%2C%20calf%20muscle%20definition&width=400&height=300&seq=steel_calves1&orientation=landscape',
        tags: ['pantorrillas', 'definicion', 'completo', 'resistencia'],
        is_active: true
      }
    ];

    try {
      setConnectionStatus(' Creando entrenamientos en Supabase...');
      let createdCount = 0;

      for (const workout of initialWorkouts) {
        const { error } = await dbOperations.createWorkoutLink(workout);
        if (!error) createdCount++;
      }

      setConnectionStatus(` ${createdCount} entrenamientos creados en Supabase`);
      await loadWorkouts();
    } catch (error) {
      console.error('Error initializing workouts:', error);
      setConnectionStatus(' Error inicializando - Usando datos locales');
      loadLocalWorkouts();
    }
  };

  const loadLocalWorkouts = () => {
    // Fallback local data
    const mockWorkouts = [
      {
        id: 'local-1',
        title: 'Entrenamiento de Ejemplo',
        description: 'Descripción de ejemplo',
        url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        platform: 'youtube' as const,
        category: 'tren_superior',
        difficulty: 'principiante' as const,
        duration: 30,
        image_url: 'https://readdy.ai/api/search-image?query=workout%20example&width=400&height=300&seq=example1&orientation=landscape',
        tags: ['ejemplo'],
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ];
    setWorkouts(mockWorkouts);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const workoutData: Omit<WorkoutLink, 'id' | 'created_at' | 'updated_at'> = {
      title: formData.title,
      description: formData.description,
      url: formData.url,
      platform: formData.platform,
      category: formData.category,
      difficulty: formData.difficulty,
      duration: parseInt(formData.duration),
      image_url: formData.image_url,
      tags: formData.tags.split(',').map(tag => tag.trim()),
      is_active: formData.is_active
    };

    try {
      if (editingId) {
        const { data, error } = await dbOperations.updateWorkoutLink(editingId, workoutData);
        if (error) throw error;

        const updatedWorkouts = workouts.map(w =>
          w.id === editingId ? data : w
        );
        setWorkouts(updatedWorkouts);
      } else {
        const { data, error } = await dbOperations.createWorkoutLink(workoutData);
        if (error) throw error;

        setWorkouts([data, ...workouts]);
      }

      resetForm();
    } catch (error) {
      console.error('Error saving workout:', error);
      alert('Error guardando entrenamiento. Por favor intenta de nuevo.');
    }
  };

  const handleEdit = (workout: WorkoutLink) => {
    setFormData({
      title: workout.title,
      description: workout.description,
      url: workout.url,
      platform: workout.platform,
      category: workout.category,
      difficulty: workout.difficulty,
      duration: workout.duration.toString(),
      image_url: workout.image_url,
      tags: workout.tags.join(', '),
      is_active: workout.is_active
    });
    setEditingId(workout.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('¿Estás seguro de que quieres eliminar este entrenamiento?')) {
      try {
        const { error } = await dbOperations.deleteWorkoutLink(id);
        if (error) throw error;

        setWorkouts(workouts.filter(w => w.id !== id));
      } catch (error) {
        console.error('Error deleting workout:', error);
        alert('Error eliminando entrenamiento. Por favor intenta de nuevo.');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      url: '',
      platform: 'youtube',
      category: 'tren_superior',
      difficulty: 'principiante',
      duration: '',
      image_url: '',
      tags: '',
      is_active: true
    });
    setEditingId(null);
    setShowForm(false);
  };

  const filteredWorkouts = workouts.filter(workout => {
    const matchesSearch = workout.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === '' || workout.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const exportWorkouts = () => {
    const csvContent = [
      ['Título', 'Descripción', 'Categoría', 'Plataforma', 'Dificultad', 'Duración', 'Activo'],
      ...filteredWorkouts.map(workout => [
        workout.title,
        workout.description,
        workout.category,
        workout.platform,
        workout.difficulty,
        workout.duration,
        workout.is_active ? 'Sí' : 'No'
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'entrenamientos_vitalemente.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const validateUrl = (url: string, platform: 'youtube' | 'spotify'): boolean => {
    if (platform === 'youtube') {
      return url.includes('youtube.com') || url.includes('youtu.be');
    }
    return url.includes('spotify.com');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Gestión de Entrenamientos</h2>
        <div className="flex space-x-2">
          <button
            onClick={() => initializeWorkouts()}
            className="bg-green-600 text-white px-4 py-2 rounded-md text-sm !rounded-button hover:bg-green-700 transition-colors"
          >
            <i className="ri-refresh-line mr-2"></i>
            Inicializar Base
          </button>
          <button
            onClick={() => setShowForm(true)}
            className="bg-red-600 text-white px-4 py-2 rounded-md text-sm !rounded-button hover:bg-red-700 transition-colors"
          >
            <i className="ri-add-line mr-2"></i>
            Nuevo Enlace
          </button>
        </div>
      </div>

      {/* Connection Status */}
      <div className="bg-white rounded-lg p-4 shadow-sm">
        <div className={`flex items-center gap-2 text-sm p-3 rounded-lg border ${connectionStatus.includes('✅') ? 'bg-green-50 border-green-200' : connectionStatus.includes('❌') ? 'bg-red-50 border-red-200' : connectionStatus.includes('🌱') || connectionStatus.includes('🚀') ? 'bg-blue-50 border-blue-200' : 'bg-gray-50 border-gray-200'}`}>
          <div className={`w-2 h-2 rounded-full ${connectionStatus.includes('✅') ? 'bg-green-500' : connectionStatus.includes('❌') ? 'bg-red-500' : 'bg-blue-500 animate-pulse'}`}></div>
          <span className={`${connectionStatus.includes('✅') ? 'text-green-700' : connectionStatus.includes('❌') ? 'text-red-700' : 'text-blue-700'}`}>{connectionStatus}</span>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg p-4 shadow-sm">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Buscar Entrenamiento
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
              placeholder="Título del entrenamiento..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Filtrar por Categoría
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
            >
              <option value="">Todas las categorías</option>
              {categories.map(category => (
                <option key={category.value} value={category.value}>{category.label}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex space-x-3">
          <button
            onClick={() => { setSearchTerm(''); setSelectedCategory(''); }}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md text-sm !rounded-button"
          >
            Limpiar Filtros
          </button>
          <button
            onClick={exportWorkouts}
            className="px-4 py-2 bg-green-600 text-white rounded-md text-sm !rounded-button"
          >
            <i className="ri-download-line mr-2"></i>
            Exportar CSV
          </button>
        </div>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4 max-h-96 overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">
                {editingId ? 'Editar Entrenamiento' : 'Nuevo Entrenamiento'}
              </h3>
              <button onClick={resetForm} className="w-6 h-6 flex items-center justify-center">
                <i className="ri-close-line text-gray-400"></i>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Título del Entrenamiento
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descripción
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  rows={3}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Plataforma
                </label>
                <select
                  value={formData.platform}
                  onChange={(e) => setFormData({ ...formData, platform: e.target.value as 'youtube' | 'spotify' })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                >
                  <option value="youtube">YouTube</option>
                  <option value="spotify">Spotify</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  URL del {formData.platform === 'youtube' ? 'Video' : 'Playlist'}
                </label>
                <input
                  type="url"
                  value={formData.url}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  placeholder={formData.platform === 'youtube' ? 'https://www.youtube.com/watch?v=...' : 'https://open.spotify.com/playlist/...'}
                  required
                />
                {formData.url && !validateUrl(formData.url, formData.platform) && (
                  <p className="text-red-500 text-xs mt-1">URL no válida para {formData.platform}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Categoría
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  >
                    {categories.map(cat => (
                      <option key={cat.value} value={cat.value}>{cat.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Dificultad
                  </label>
                  <select
                    value={formData.difficulty}
                    onChange={(e) => setFormData({ ...formData, difficulty: e.target.value as 'principiante' | 'intermedio' | 'avanzado' })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  >
                    <option value="principiante">Principiante</option>
                    <option value="intermedio">Intermedio</option>
                    <option value="avanzado">Avanzado</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Duración (minutos)
                </label>
                <input
                  type="number"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  URL de Miniatura
                </label>
                <input
                  type="url"
                  value={formData.image_url}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  placeholder="https://ejemplo.com/miniatura.jpg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tags (separados por comas)
                </label>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  placeholder="fuerza, cardio, principiante"
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                  className="mr-2"
                />
                <label className="text-sm text-gray-700">Entrenamiento Activo</label>
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 py-2 bg-gray-200 text-gray-700 rounded-md !rounded-button"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-red-600 text-white rounded-md !rounded-button"
                  disabled={formData.url && !validateUrl(formData.url, formData.platform)}
                >
                  {editingId ? 'Actualizar' : 'Crear'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Workouts List */}
      <div className="space-y-4">
        {workouts.length === 0 ? (
          <div className="text-center py-8">
            <i className="ri-run-line text-gray-400 text-4xl mb-2"></i>
            <p className="text-gray-600">No hay entrenamientos registrados</p>
          </div>
        ) : (
          workouts.map((workout) => (
            <div key={workout.id} className="bg-white rounded-lg p-4 shadow-sm">
              <div className="flex items-start space-x-4">
                <div className="w-20 h-16 bg-gray-100 rounded-lg overflow-hidden">
                  <img
                    src={workout.image_url}
                    alt={workout.title}
                    className="w-full h-full object-cover object-top"
                  />
                </div>

                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-medium text-gray-900">{workout.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">{workout.description}</p>
                      <div className="flex items-center space-x-4 mt-2">
                        <span className={`text-xs px-2 py-1 rounded-full ${workout.platform === 'youtube' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                          {workout.platform === 'youtube' ? 'YouTube' : 'Spotify'}
                        </span>
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                          {workout.category.replace('_', ' ')}
                        </span>
                        <span className="text-xs text-gray-500">
                          {workout.duration} min
                        </span>
                        <span className={`text-xs px-2 py-1 rounded-full ${workout.difficulty === 'principiante' ? 'bg-green-100 text-green-800' : workout.difficulty === 'intermedio' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
                          {workout.difficulty}
                        </span>
                        <span className={`text-xs px-2 py-1 rounded-full ${workout.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {workout.is_active ? 'Activo' : 'Inactivo'}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => window.open(workout.url, '_blank')}
                        className={`w-8 h-8 flex items-center justify-center hover:bg-gray-50 rounded ${workout.platform === 'youtube' ? 'text-red-600' : 'text-green-600'}`}
                      >
                        <i className={workout.platform === 'youtube' ? 'ri-youtube-line' : 'ri-spotify-line'}></i>
                      </button>
                      <button
                        onClick={() => handleEdit(workout)}
                        className="w-8 h-8 flex items-center justify-center text-blue-600 hover:bg-blue-50 rounded"
                      >
                        <i className="ri-edit-line"></i>
                      </button>
                      <button
                        onClick={() => handleDelete(workout.id)}
                        className="w-8 h-8 flex items-center justify-center text-red-600 hover:bg-red-50 rounded"
                      >
                        <i className="ri-delete-bin-line"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

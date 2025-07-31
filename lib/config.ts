
// Configuración centralizada para producción
export const CONFIG = {
  // Supabase - Base de datos principal
  supabase: {
    url: 'https://jkxyioiajkyakftdeazt.supabase.co',
    anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpreHlpb2lhamt5YWtmdGRlYXp0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM4MDY3MTcsImV4cCI6MjA2OTM4MjcxN30.d7VtQ3RkoJhZD0j0K8o2Uv0H860sRfqUC1-mwaKrsTw',
  },

  // Analytics
  googleAnalytics: {
    measurementId: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || 'G-XXXXXXXXXX',
  },

  // Pagos Stripe
  stripe: {
    publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || 'pk_test_...',
    secretKey: process.env.STRIPE_SECRET_KEY || 'sk_test_...',
  },

  // Notificaciones
  oneSignal: {
    appId: process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID || 'tu-app-id',
  },

  // WhatsApp Business
  whatsapp: {
    phoneNumber: '573134852878',
    businessToken: process.env.WHATSAPP_BUSINESS_TOKEN || 'tu-token',
  },

  // Cloudinary para imágenes
  cloudinary: {
    cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'tu-cloud-name',
    apiKey: process.env.CLOUDINARY_API_KEY || 'tu-api-key',
    apiSecret: process.env.CLOUDINARY_API_SECRET || 'tu-api-secret',
  },

  // URLs de la aplicación
  app: {
    url: process.env.NODE_ENV === 'production' 
      ? 'https://vitalemente.vercel.app' 
      : 'http://localhost:3000',
    name: 'VitalMente',
    description: 'Tu compañero integral para el bienestar físico y mental',
  }
};

export const FEATURE_FLAGS = {
  enablePushNotifications: true,
  enablePayments: true,
  enableAnalytics: true,
  enableRealTimeSync: true,
  enableOfflineMode: false,
};

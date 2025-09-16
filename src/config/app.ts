export const APP_CONFIG = {
  // Información básica del proyecto
  info: {
    name: 'LexBot Admin',
    version: '1.0.0',
    description: 'Panel de administración para LexBot',
    author: 'Tu Nombre'
  },
  
  // Configuración de API
  api: {
    baseUrl: import.meta.env.VITE_API_BASE_URL || 'https://api.lexbot.com',
    timeout: 30000
  },
  
  // Feature flags
  features: {
    enableDarkMode: true,
    enableAnalytics: false,
    enablePWA: false
  },
  
  // Configuración de UI
  ui: {
    defaultTheme: 'glassmorphism'
  },
  
  // Configuraciones específicas por entorno
  env: {
    isProduction: import.meta.env.PROD,
    isDevelopment: import.meta.env.DEV
  }
};

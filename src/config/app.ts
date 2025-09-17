/**
 * Tipos para la configuración de la aplicación
 */
export interface AppInfo {
  name: string;
  version: string;
  description: string;
  author: string;
  copyright: string;
}

export interface ApiConfig {
  baseUrl: string;
  timeout: number;
  retryAttempts: number;
  retryDelay: number;
  headers: Record<string, string>;
}

export interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  measurementId?: string;
}

export interface FeatureFlags {
  enableDarkMode: boolean;
  enableAnalytics: boolean;
  enablePWA: boolean;
  enableNotifications: boolean;
  enableOfflineMode: boolean;
  enableDebugMode: boolean;
}

export type ThemeName = 'glassmorphism' | 'corporate' | 'dark' | 'light';

export interface UiConfig {
  defaultTheme: ThemeName;
  animationDuration: {
    fast: number;
    normal: number;
    slow: number;
  };
  toastDuration: {
    short: number;
    normal: number;
    long: number;
  };
  breakpoints: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
    '2xl': string;
  };
}

export interface EnvConfig {
  isProduction: boolean;
  isDevelopment: boolean;
  appEnv: 'development' | 'staging' | 'production';
}

export interface AuthConfig {
  sessionTimeout: number;
  rememberMeDuration: number;
  passwordMinLength: number;
  passwordMaxLength: number;
  maxLoginAttempts: number;
  lockoutDuration: number;
}

export interface AppConfig {
  info: AppInfo;
  api: ApiConfig;
  firebase: FirebaseConfig;
  features: FeatureFlags;
  ui: UiConfig;
  env: EnvConfig;
  auth: AuthConfig;
}

/**
 * Configuración centralizada de la aplicación
 */
export const APP_CONFIG: AppConfig = {
  // Información básica del proyecto
  info: {
    name: 'LexBot Admin',
    version: '1.0.0',
    description: 'Panel de administración para LexBot',
    author: 'LexBot Team',
    copyright: `© ${new Date().getFullYear()} LexBot. Todos los derechos reservados.`
  },
  
  // Configuración de API
  api: {
    baseUrl: import.meta.env.VITE_API_BASE_URL || 'https://api.lexbot.com',
    timeout: 30000,
    retryAttempts: 3,
    retryDelay: 1000,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  },
  
  // Configuración de Firebase
  firebase: {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDlFA17bhyfEIVfI25GESN4Ka5bk5UDBv8",
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "lexbot-1f68e.firebaseapp.com",
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "lexbot-1f68e",
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "lexbot-1f68e.firebasestorage.app",
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "190723675941",
    appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:190723675941:web:9caafb58b7f4e7473daccc",
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-912LDZRSFM"
  },
  
  // Feature flags
  features: {
    enableDarkMode: true,
    enableAnalytics: import.meta.env.PROD,
    enablePWA: import.meta.env.PROD,
    enableNotifications: true,
    enableOfflineMode: true,
    enableDebugMode: import.meta.env.DEV
  },
  
  // Configuración de UI
  ui: {
    defaultTheme: 'glassmorphism',
    animationDuration: {
      fast: 150,
      normal: 300,
      slow: 500
    },
    toastDuration: {
      short: 3000,
      normal: 5000,
      long: 8000
    },
    breakpoints: {
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px'
    }
  },
  
  // Configuraciones específicas por entorno
  env: {
    isProduction: import.meta.env.PROD,
    isDevelopment: import.meta.env.DEV,
    appEnv: (import.meta.env.VITE_APP_ENV as 'development' | 'staging' | 'production') || 'development'
  },
  
  // Configuración de autenticación
  auth: {
    sessionTimeout: 15 * 60 * 1000, // 15 minutos en milisegundos
    rememberMeDuration: 7 * 24 * 60 * 60 * 1000, // 7 días en milisegundos
    passwordMinLength: 8,
    passwordMaxLength: 128,
    maxLoginAttempts: 5,
    lockoutDuration: 15 * 60 * 1000 // 15 minutos en milisegundos
  }
};

/**
 * Función para obtener valores de configuración con seguridad de tipos
 * @param path Ruta a la propiedad de configuración
 * @returns Valor de la configuración
 */
export function getConfig<T>(path: string): T {
  return path.split('.').reduce((acc, part) => acc[part], APP_CONFIG as any) as T;
}

/**
 * Función para comprobar si una feature flag está activada
 * @param featureName Nombre de la feature flag
 * @returns Boolean indicando si la feature está activada
 */
export function isFeatureEnabled(featureName: keyof FeatureFlags): boolean {
  return APP_CONFIG.features[featureName] || false;
}

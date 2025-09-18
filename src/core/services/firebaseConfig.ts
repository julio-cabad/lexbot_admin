/**
 * Configuración de Firebase
 * Integrada con el sistema de configuración centralizada
 */
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getAnalytics } from 'firebase/analytics';
import { getFirestore } from 'firebase/firestore';
import { APP_CONFIG } from '../../config/app';

/**
 * Configuración de Firebase obtenida del sistema de configuración centralizada
 */
const firebaseConfig = APP_CONFIG.firebase;

/**
 * Inicializar Firebase
 */
const app = initializeApp(firebaseConfig);

/**
 * Inicializar Firebase Authentication y obtener una referencia al servicio
 */
export const auth = getAuth(app);

/**
 * Configurar idioma de autenticación
 */
auth.languageCode = 'es';

/**
 * Inicializar Firestore y obtener una referencia al servicio
 */
export const db = getFirestore(app);

/**
 * Inicializar Analytics (opcional)
 * Solo se activa si la característica está habilitada en la configuración
 */
export const analytics = APP_CONFIG.features.enableAnalytics ? getAnalytics(app) : null;

/**
 * Configurar emuladores para desarrollo si están habilitados
 */
if (APP_CONFIG.env.isDevelopment && APP_CONFIG.features.enableDebugMode) {
  // Descomentar para usar emuladores locales durante el desarrollo
  // import { connectAuthEmulator } from 'firebase/auth';
  // import { connectFirestoreEmulator } from 'firebase/firestore';
  // connectAuthEmulator(auth, 'http://localhost:9099');
  // connectFirestoreEmulator(db, 'localhost', 8080);
}

export default app;

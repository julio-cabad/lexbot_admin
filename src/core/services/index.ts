/**
 * Exportación centralizada de todos los servicios
 * 🏛️ El arsenal completo del reino
 */

// Exportar servicios individuales
export { default as authService } from './authService';
export { default as errorService } from './errorService';
export { default as sessionService } from './sessionService';

// 🔥 NUEVOS SERVICIOS DE FIRESTORE
export { default as firestoreService } from './firestoreService';
export { default as userService } from './userService';

// Exportar configuración de Firebase
export { auth, analytics } from './firebaseConfig';
export { default as firebaseApp } from './firebaseConfig';

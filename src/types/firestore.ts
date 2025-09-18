/**
 * 🔥 TIPOS GENÉRICOS PARA FIRESTORE
 * Tipos reutilizables para operaciones con Firestore en toda la aplicación
 */

import { FieldValue } from 'firebase/firestore';

/**
 * Metadatos base para todos los documentos
 * Todos los documentos en Firestore deben extender esta interfaz
 */
export interface BaseDocument {
  id?: string;
  createdAt: Date | FieldValue;
  updatedAt: Date | FieldValue;
}

/**
 * Filtros para consultas genéricas
 * Permite construir consultas dinámicas a Firestore
 */
export interface QueryFilter {
  field: string;
  operator:
    | "=="
    | "!="
    | "<"
    | "<="
    | ">"
    | ">="
    | "in"
    | "not-in"
    | "array-contains"
    | "array-contains-any";
  value: any;
}

/**
 * Opciones para consultas
 * Configuración adicional para consultas a Firestore
 */
export interface QueryOptions {
  limit?: number;
  orderBy?: {
    field: string;
    direction: "asc" | "desc";
  };
  startAfter?: any;
}

/**
 * Resultado de operaciones de Firestore
 * Estructura estandarizada para resultados de operaciones individuales
 */
export interface FirestoreResult<T> {
  success: boolean;
  data?: T;
  error?: string;
  id?: string;
}

/**
 * Resultado de consultas múltiples
 * Estructura estandarizada para resultados de consultas que devuelven múltiples documentos
 */
export interface FirestoreQueryResult<T> {
  success: boolean;
  data: T[];
  error?: string;
  hasMore?: boolean;
  lastDoc?: any;
}

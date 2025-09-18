/**
 * 🏛️ SERVICIO GENÉRICO DE FIRESTORE
 * El arma más poderosa para dominar cualquier colección
 * 
 * @author El Espartano del Código
 */

import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  collection,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  getDocs,
  onSnapshot,
  serverTimestamp,
  Timestamp,
  DocumentReference,
  Query,
  Unsubscribe
} from 'firebase/firestore';
import { db } from './firebaseConfig';

import { 
  BaseDocument, 
  QueryFilter, 
  QueryOptions, 
  FirestoreResult, 
  FirestoreQueryResult 
} from '../../types/firestore';

/**
 * 🔥 SERVICIO GENÉRICO PARA OPERACIONES CRUD
 * Un solo servicio para gobernarlos a todos
 */
class FirestoreService {
  
  /**
   * ⚔️ CREAR DOCUMENTO
   * Forja un nuevo documento en el campo de batalla
   */
  async createDocument<T extends BaseDocument>(
    collectionName: string,
    data: Omit<T, 'id' | 'createdAt' | 'updatedAt'>,
    customId?: string
  ): Promise<FirestoreResult<T>> {
    try {
      const docRef = customId 
        ? doc(db, collectionName, customId)
        : doc(collection(db, collectionName));

      // Crear el objeto con los campos requeridos
      const documentData = {
        ...data,
        id: docRef.id,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      } as unknown as T; // Usar una doble aserción para evitar el error

      await setDoc(docRef, documentData);

      // Convertir timestamps para el retorno
      const resultData = {
        ...documentData,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as unknown as T; // Usar una doble aserción para evitar el error

      return {
        success: true,
        data: resultData,
        id: docRef.id
      };
    } catch (error) {
      console.error(`❌ Error creando documento en ${collectionName}:`, error);
      return {
        success: false,
        error: (error as Error).message
      };
    }
  }

  /**
   * 🛡️ OBTENER DOCUMENTO
   * Recupera un documento del reino de Firestore
   */
  async getDocument<T extends BaseDocument>(
    collectionName: string,
    documentId: string
  ): Promise<FirestoreResult<T>> {
    try {
      const docRef = doc(db, collectionName, documentId);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        return {
          success: false,
          error: 'Documento no encontrado'
        };
      }

      const data = docSnap.data();
      
      // Convertir timestamps de Firestore a Date
      const processedData = this.processTimestamps(data) as T;

      return {
        success: true,
        data: processedData,
        id: docSnap.id
      };
    } catch (error) {
      console.error(`❌ Error obteniendo documento de ${collectionName}:`, error);
      return {
        success: false,
        error: (error as Error).message
      };
    }
  }

  /**
   * ⚡ ACTUALIZAR DOCUMENTO
   * Modifica un documento existente con la furia de Zeus
   */
  async updateDocument<T extends BaseDocument>(
    collectionName: string,
    documentId: string,
    updates: Partial<Omit<T, 'id' | 'createdAt' | 'updatedAt'>>
  ): Promise<FirestoreResult<T>> {
    try {
      const docRef = doc(db, collectionName, documentId);
      
      const updateData = {
        ...updates,
        updatedAt: serverTimestamp()
      };

      await updateDoc(docRef, updateData);

      // Obtener el documento actualizado
      const updatedDoc = await this.getDocument<T>(collectionName, documentId);
      
      return updatedDoc;
    } catch (error) {
      console.error(`❌ Error actualizando documento en ${collectionName}:`, error);
      return {
        success: false,
        error: (error as Error).message
      };
    }
  }

  /**
   * 💀 ELIMINAR DOCUMENTO
   * Borra un documento de la existencia
   */
  async deleteDocument(
    collectionName: string,
    documentId: string
  ): Promise<FirestoreResult<null>> {
    try {
      const docRef = doc(db, collectionName, documentId);
      await deleteDoc(docRef);

      return {
        success: true,
        data: null
      };
    } catch (error) {
      console.error(`❌ Error eliminando documento de ${collectionName}:`, error);
      return {
        success: false,
        error: (error as Error).message
      };
    }
  }

  /**
   * 🔍 CONSULTAR DOCUMENTOS
   * Busca documentos con filtros como un cazador experto
   */
  async queryDocuments<T extends BaseDocument>(
    collectionName: string,
    filters: QueryFilter[] = [],
    options: QueryOptions = {}
  ): Promise<FirestoreQueryResult<T>> {
    try {
      let q: Query = collection(db, collectionName);

      // Aplicar filtros
      filters.forEach(filter => {
        q = query(q, where(filter.field, filter.operator, filter.value));
      });

      // Aplicar ordenamiento
      if (options.orderBy) {
        q = query(q, orderBy(options.orderBy.field, options.orderBy.direction));
      }

      // Aplicar límite
      if (options.limit) {
        q = query(q, limit(options.limit));
      }

      // Aplicar paginación
      if (options.startAfter) {
        q = query(q, startAfter(options.startAfter));
      }

      const querySnapshot = await getDocs(q);
      
      const documents: T[] = [];
      let lastDoc = null;

      querySnapshot.forEach((doc) => {
        const data = this.processTimestamps(doc.data()) as T;
        documents.push(data);
        lastDoc = doc;
      });

      return {
        success: true,
        data: documents,
        hasMore: querySnapshot.size === (options.limit || 0),
        lastDoc
      };
    } catch (error) {
      console.error(`❌ Error consultando documentos de ${collectionName}:`, error);
      return {
        success: false,
        data: [],
        error: (error as Error).message
      };
    }
  }

  /**
   * 👁️ SUSCRIBIRSE A DOCUMENTO
   * Observa cambios en tiempo real como un centinela
   */
  subscribeToDocument<T extends BaseDocument>(
    collectionName: string,
    documentId: string,
    callback: (data: T | null, error?: string) => void
  ): Unsubscribe {
    const docRef = doc(db, collectionName, documentId);
    
    return onSnapshot(
      docRef,
      (doc) => {
        if (doc.exists()) {
          const data = this.processTimestamps(doc.data()) as T;
          callback(data);
        } else {
          callback(null, 'Documento no encontrado');
        }
      },
      (error) => {
        console.error(`❌ Error en suscripción a ${collectionName}:`, error);
        callback(null, error.message);
      }
    );
  }

  /**
   * 👁️‍🗨️ SUSCRIBIRSE A CONSULTA
   * Observa cambios en una consulta en tiempo real
   */
  subscribeToQuery<T extends BaseDocument>(
    collectionName: string,
    filters: QueryFilter[] = [],
    options: QueryOptions = {},
    callback: (data: T[], error?: string) => void
  ): Unsubscribe {
    let q: Query = collection(db, collectionName);

    // Aplicar filtros y opciones (mismo código que queryDocuments)
    filters.forEach(filter => {
      q = query(q, where(filter.field, filter.operator, filter.value));
    });

    if (options.orderBy) {
      q = query(q, orderBy(options.orderBy.field, options.orderBy.direction));
    }

    if (options.limit) {
      q = query(q, limit(options.limit));
    }

    return onSnapshot(
      q,
      (querySnapshot) => {
        const documents: T[] = [];
        querySnapshot.forEach((doc) => {
          const data = this.processTimestamps(doc.data()) as T;
          documents.push(data);
        });
        callback(documents);
      },
      (error) => {
        console.error(`❌ Error en suscripción a consulta de ${collectionName}:`, error);
        callback([], error.message);
      }
    );
  }

  /**
   * 🔄 PROCESAR TIMESTAMPS
   * Convierte timestamps de Firestore a objetos Date
   */
  private processTimestamps(data: any): any {
    const processed = { ...data };
    
    // Convertir campos de timestamp conocidos
    if (processed.createdAt && processed.createdAt instanceof Timestamp) {
      processed.createdAt = processed.createdAt.toDate();
    }
    
    if (processed.updatedAt && processed.updatedAt instanceof Timestamp) {
      processed.updatedAt = processed.updatedAt.toDate();
    }

    return processed;
  }

  /**
   * 🏺 VERIFICAR SI DOCUMENTO EXISTE
   * Comprueba la existencia sin obtener los datos
   */
  async documentExists(
    collectionName: string,
    documentId: string
  ): Promise<boolean> {
    try {
      const docRef = doc(db, collectionName, documentId);
      const docSnap = await getDoc(docRef);
      return docSnap.exists();
    } catch (error) {
      console.error(`❌ Error verificando existencia en ${collectionName}:`, error);
      return false;
    }
  }

  /**
   * 📊 CONTAR DOCUMENTOS
   * Cuenta documentos que coinciden con los filtros
   */
  async countDocuments(
    collectionName: string,
    filters: QueryFilter[] = []
  ): Promise<number> {
    try {
      const result = await this.queryDocuments(collectionName, filters);
      return result.success ? result.data.length : 0;
    } catch (error) {
      console.error(`❌ Error contando documentos en ${collectionName}:`, error);
      return 0;
    }
  }
}

// 🏛️ INSTANCIA SINGLETON DEL SERVICIO
export const firestoreService = new FirestoreService();

// 🎯 EXPORTAR TAMBIÉN LA CLASE PARA CASOS ESPECIALES
export { FirestoreService };
export default firestoreService;
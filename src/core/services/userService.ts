/**
 * 👑 SERVICIO DE USUARIOS
 * El comandante supremo de los perfiles de usuario
 * 
 * @author El Rey Espartano del Código
 */

import { firestoreService } from './firestoreService';
// Importar tipos específicos de usuario desde auth/types
import { 
  UserProfile, 
  CreateUserProfileData, 
  UpdateUserProfileData,
  CompleteProfileData,
  UserRole
} from '../../features/auth/types';

// Importar tipos genéricos de Firestore desde la ubicación centralizada
import { FirestoreResult } from '../../types/firestore';

/**
 * 🏛️ COLECCIÓN DE USUARIOS EN FIRESTORE
 */
const USERS_COLLECTION = 'users';

/**
 * 👑 SERVICIO ESPECIALIZADO PARA GESTIÓN DE USUARIOS
 * Wrapper inteligente sobre el servicio genérico
 */
class UserService {

  /**
   * ⚔️ CREAR PERFIL DE USUARIO
   * Forja un nuevo guerrero en el reino
   */
  async createUserProfile(
    uid: string,
    email: string,
    additionalData: Partial<CreateUserProfileData> = {}
  ): Promise<FirestoreResult<UserProfile>> {
    try {
      const userData: CreateUserProfileData = {
        uid,
        email,
        firstName: additionalData.firstName || '',
        lastName: additionalData.lastName || '',
        role: additionalData.role || '',
        phone: additionalData.phone || '',
        city: additionalData.city || '',
      };

      // Asegurarnos de que todos los campos requeridos tengan valores no undefined
      const profileData: Omit<UserProfile, 'id' | 'createdAt' | 'updatedAt'> = {
        uid: userData.uid,
        email: userData.email,
        firstName: userData.firstName || '',
        lastName: userData.lastName || '',
        role: '',
        phone: userData.phone || '',
        city: userData.city || '',
        isComplete: false // Por defecto, el perfil no está completo
      };
      
      // Crear el documento con el UID como ID personalizado
      const result = await firestoreService.createDocument<UserProfile>(
        USERS_COLLECTION,
        profileData,
        uid // Usar UID como ID del documento
      );

      if (result.success) {
        console.log(`✅ Perfil de usuario creado exitosamente para: ${email}`);
      }

      return result;
    } catch (error) {
      console.error('❌ Error en createUserProfile:', error);
      return {
        success: false,
        error: (error as Error).message
      };
    }
  }

  /**
   * 🛡️ OBTENER PERFIL DE USUARIO
   * Recupera los datos del guerrero
   */
  async getUserProfile(uid: string): Promise<FirestoreResult<UserProfile>> {
    try {
      const result = await firestoreService.getDocument<UserProfile>(
        USERS_COLLECTION,
        uid
      );

      if (result.success && result.data) {
        console.log(`✅ Perfil obtenido para usuario: ${uid}`);
      }

      return result;
    } catch (error) {
      console.error('❌ Error en getUserProfile:', error);
      return {
        success: false,
        error: (error as Error).message
      };
    }
  }

  /**
   * ⚡ ACTUALIZAR PERFIL DE USUARIO
   * Modifica los atributos del guerrero
   */
  async updateUserProfile(
    uid: string,
    updates: UpdateUserProfileData
  ): Promise<FirestoreResult<UserProfile>> {
    try {
      const result = await firestoreService.updateDocument<UserProfile>(
        USERS_COLLECTION,
        uid,
        updates
      );

      return result;
    } catch (error) {
      console.error('❌ Error en updateUserProfile:', error);
      return {
        success: false,
        error: (error as Error).message
      };
    }
  }

  /**
   * 🏆 COMPLETAR PERFIL DE USUARIO
   * Marca el perfil como completo después de llenar todos los datos
   */
  async completeUserProfile(
    uid: string,
    profileData: CompleteProfileData
  ): Promise<FirestoreResult<UserProfile>> {
    try {
      const updates: UpdateUserProfileData = {
        ...profileData,
        isComplete: true // Marcar como completo
      };

      const result = await this.updateUserProfile(uid, updates);

      if (result.success) {
        console.log(`🏆 Perfil completado exitosamente para usuario: ${uid}`);
      }

      return result;
    } catch (error) {
      console.error('❌ Error en completeUserProfile:', error);
      return {
        success: false,
        error: (error as Error).message
      };
    }
  }

  /**
   * 🔍 VERIFICAR SI PERFIL ESTÁ COMPLETO
   * Comprueba si el guerrero ha completado su entrenamiento
   */
  async isProfileComplete(uid: string): Promise<boolean> {
    try {
      const result = await this.getUserProfile(uid);
      
      if (result.success && result.data) {
        return result.data.isComplete;
      }
      
      return false;
    } catch (error) {
      console.error('❌ Error verificando completitud del perfil:', error);
      return false;
    }
  }

  /**
   * 👁️ SUSCRIBIRSE A PERFIL DE USUARIO
   * Observa cambios en tiempo real del guerrero
   */
  subscribeToUserProfile(
    uid: string,
    callback: (profile: UserProfile | null, error?: string) => void
  ) {
    return firestoreService.subscribeToDocument<UserProfile>(
      USERS_COLLECTION,
      uid,
      callback
    );
  }

  /**
   * 💀 ELIMINAR PERFIL DE USUARIO
   * Borra al guerrero del reino (usar con precaución)
   */
  async deleteUserProfile(uid: string): Promise<FirestoreResult<null>> {
    try {
      const result = await firestoreService.deleteDocument(
        USERS_COLLECTION,
        uid
      );

      if (result.success) {
        console.log(`💀 Perfil eliminado para usuario: ${uid}`);
      }

      return result;
    } catch (error) {
      console.error('❌ Error en deleteUserProfile:', error);
      return {
        success: false,
        error: (error as Error).message
      };
    }
  }

  /**
   * 🔍 BUSCAR USUARIOS POR ROL
   * Encuentra guerreros por su rango
   */
  async getUsersByRole(role: UserRole): Promise<UserProfile[]> {
    try {
      const result = await firestoreService.queryDocuments<UserProfile>(
        USERS_COLLECTION,
        [{ field: 'role', operator: '==', value: role }]
      );

      return result.success ? result.data : [];
    } catch (error) {
      console.error('❌ Error buscando usuarios por rol:', error);
      return [];
    }
  }

  /**
   * 🏙️ BUSCAR USUARIOS POR CIUDAD
   * Encuentra guerreros por su territorio
   */
  async getUsersByCity(city: string): Promise<UserProfile[]> {
    try {
      const result = await firestoreService.queryDocuments<UserProfile>(
        USERS_COLLECTION,
        [{ field: 'city', operator: '==', value: city }]
      );

      return result.success ? result.data : [];
    } catch (error) {
      console.error('❌ Error buscando usuarios por ciudad:', error);
      return [];
    }
  }

  /**
   * 📊 OBTENER ESTADÍSTICAS DE USUARIOS
   * Cuenta los guerreros del reino
   */
  async getUserStats() {
    try {
      const [totalUsers, completeProfiles, incompleteProfiles] = await Promise.all([
        firestoreService.countDocuments(USERS_COLLECTION),
        firestoreService.countDocuments(USERS_COLLECTION, [
          { field: 'isComplete', operator: '==', value: true }
        ]),
        firestoreService.countDocuments(USERS_COLLECTION, [
          { field: 'isComplete', operator: '==', value: false }
        ])
      ]);

      return {
        total: totalUsers,
        complete: completeProfiles,
        incomplete: incompleteProfiles,
        completionRate: totalUsers > 0 ? (completeProfiles / totalUsers) * 100 : 0
      };
    } catch (error) {
      console.error('❌ Error obteniendo estadísticas de usuarios:', error);
      return {
        total: 0,
        complete: 0,
        incomplete: 0,
        completionRate: 0
      };
    }
  }

  /**
   * 🔍 VERIFICAR SI USUARIO EXISTE
   * Comprueba si el guerrero está registrado
   */
  async userExists(uid: string): Promise<boolean> {
    return await firestoreService.documentExists(USERS_COLLECTION, uid);
  }
}

// 👑 INSTANCIA SINGLETON DEL SERVICIO
export const userService = new UserService();

// 🎯 EXPORTAR TAMBIÉN LA CLASE
export { UserService };
export default userService;
/**
 * 📧 MAIL AUTH SERVICE
 * Servicio para autorización de correo electrónico con Google
 */

import { firestoreService } from '../../../core/services/firestoreService';
import type { 
  MailAuthData, 
  AuthorizeMailRequest, 
  AuthorizeMailResponse,
  RevokeMailRequest,
  RevokeMailResponse 
} from '../types';

const COLLECTION_NAME = 'mail_authorizations';

class MailAuthService {
  /**
   * 📧 Autorizar correo electrónico
   */
  async authorizeEmail(request: AuthorizeMailRequest): Promise<AuthorizeMailResponse> {
    try {
      // Verificar si ya existe una autorización
      const existing = await this.getByEmail(request.email);
      
      if (existing && existing.isAuthorized) {
        return {
          success: false,
          error: 'Este correo ya está autorizado',
        };
      }

      // Crear nueva autorización
      const authData: Omit<MailAuthData, 'id'> = {
        email: request.email,
        isAuthorized: true,
        authorizedAt: new Date().toISOString(),
        permissions: ['gmail.send', 'gmail.read'],
        status: 'authorized',
      };

      const id = await firestoreService.create(COLLECTION_NAME, authData);
      
      // En una implementación real, aquí se generaría la URL de Google OAuth
      const authUrl = `https://accounts.google.com/oauth/authorize?email=${encodeURIComponent(request.email)}`;

      return {
        success: true,
        data: { ...authData, id },
        authUrl,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error al autorizar correo',
      };
    }
  }

  /**
   * 🚫 Revocar autorización de correo
   */
  async revokeEmail(request: RevokeMailRequest): Promise<RevokeMailResponse> {
    try {
      const existing = await this.getByEmail(request.email);
      
      if (!existing) {
        return {
          success: false,
          error: 'No se encontró autorización para este correo',
        };
      }

      if (!existing.isAuthorized) {
        return {
          success: false,
          error: 'Este correo no está autorizado',
        };
      }

      // Actualizar estado a revocado
      const updateData = {
        isAuthorized: false,
        revokedAt: new Date().toISOString(),
        status: 'revoked' as const,
      };

      await firestoreService.update(COLLECTION_NAME, existing.id, updateData);

      return {
        success: true,
        message: 'Autorización revocada exitosamente',
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error al revocar autorización',
      };
    }
  }

  /**
   * 📄 Obtener autorización por email
   */
  async getByEmail(email: string): Promise<MailAuthData | null> {
    try {
      const items = await firestoreService.getAll<MailAuthData>(COLLECTION_NAME);
      return items.find(item => item.email === email) || null;
    } catch (error) {
      throw new Error(`Error al buscar autorización: ${error}`);
    }
  }

  /**
   * 📋 Obtener todas las autorizaciones
   */
  async getAll(): Promise<MailAuthData[]> {
    try {
      return await firestoreService.getAll<MailAuthData>(COLLECTION_NAME);
    } catch (error) {
      throw new Error(`Error al obtener autorizaciones: ${error}`);
    }
  }

  /**
   * ✅ Verificar si un email está autorizado
   */
  async isEmailAuthorized(email: string): Promise<boolean> {
    try {
      const auth = await this.getByEmail(email);
      return auth?.isAuthorized || false;
    } catch (error) {
      return false;
    }
  }
}

export const mailAuthService = new MailAuthService();
export default mailAuthService;
/**
 * Servicio para gestión de errores
 * Integrado con el sistema de configuración centralizada
 */
import { AuthErrorCode } from '../../types';
import { APP_CONFIG } from '../../config/app';
import { getText } from '../../config/texts';

/**
 * Clase de servicio para gestión y registro de errores
 * - Integrada con el sistema de configuración centralizada
 * - Utiliza textos centralizados para mensajes de error
 * - Soporte para diferentes niveles de severidad
 * - Capacidades de reintentos y manejo de errores asíncronos
 */
class ErrorService {
  private isDevelopment = APP_CONFIG.env.isDevelopment;
  private isDebugEnabled = APP_CONFIG.features.enableDebugMode;

  /**
   * Registra un error en la consola en modo desarrollo
   */
  logError(error: Error, context?: string): void {
    if (this.isDevelopment || this.isDebugEnabled) {
      console.group(`🚨 Error${context ? ` in ${context}` : ''}`);
      console.error('Message:', error.message);
      console.error('Stack:', error.stack);
      console.groupEnd();
    }
    
    // Aquí se podría implementar el envío de errores a un servicio de monitoreo
    // como Sentry, LogRocket, etc.
  }

  /**
   * Registra una advertencia en la consola en modo desarrollo
   */
  logWarning(message: string, context?: string): void {
    if (this.isDevelopment || this.isDebugEnabled) {
      console.warn(`⚠️ Warning${context ? ` in ${context}` : ''}: ${message}`);
    }
  }

  /**
   * Registra información en la consola en modo desarrollo
   */
  logInfo(message: string, context?: string): void {
    if (this.isDevelopment || this.isDebugEnabled) {
      console.info(`ℹ️ Info${context ? ` in ${context}` : ''}: ${message}`);
    }
  }

  /**
   * Verifica si el error es un error de red
   */
  isNetworkError(error: Error): boolean {
    return error.message.includes('network') || 
           error.message.includes('fetch') ||
           error.message.includes('connection');
  }

  /**
   * Verifica si el error es un error de autenticación
   */
  isAuthError(error: Error): boolean {
    return error.message.includes('auth/') || 
           Object.values(AuthErrorCode).some(code => error.message.includes(code));
  }

  /**
   * Obtiene el nivel de severidad del error
   */
  getErrorSeverity(error: Error): 'low' | 'medium' | 'high' | 'critical' {
    if (this.isNetworkError(error)) return 'medium';
    if (this.isAuthError(error)) return 'high';
    if (error.message.includes('permission')) return 'high';
    if (error.message.includes('quota')) return 'critical';
    return 'low';
  }

  /**
   * Formatea el error para mostrar al usuario
   * Utiliza textos centralizados cuando es posible
   */
  formatUserError(error: Error): string {
    // Eliminar detalles técnicos y mostrar mensaje amigable
    const message = error.message.toLowerCase();
    
    if (message.includes('network') || message.includes('connection')) {
      return getText('errors.networkErrorMessage');
    }
    
    if (message.includes('permission')) {
      return getText('errors.accessDeniedMessage');
    }
    
    if (message.includes('quota') || message.includes('limit')) {
      return 'Se ha alcanzado el límite de uso. Por favor intenta más tarde.';
    }
    
    // Devolver el mensaje original si ya es amigable
    return error.message;
  }

  /**
   * Crea un objeto de informe de error
   */
  createErrorReport(error: Error, context?: string, userId?: string) {
    return {
      message: error.message,
      stack: error.stack,
      context,
      userId,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
      severity: this.getErrorSeverity(error),
      appVersion: APP_CONFIG.info.version,
      environment: APP_CONFIG.env.appEnv
    };
  }

  /**
   * Maneja errores asíncronos con registro adecuado
   */
  async handleAsyncError<T>(
    operation: () => Promise<T>,
    context?: string,
    fallbackValue?: T
  ): Promise<T | undefined> {
    try {
      return await operation();
    } catch (error) {
      this.logError(error as Error, context);
      
      if (fallbackValue !== undefined) {
        return fallbackValue;
      }
      
      throw error;
    }
  }

  /**
   * Reintenta una operación con retroceso exponencial
   */
  async retryOperation<T>(
    operation: () => Promise<T>,
    maxRetries: number = 3,
    baseDelay: number = 1000,
    context?: string
  ): Promise<T> {
    let lastError: Error;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error as Error;
        
        if (attempt === maxRetries) {
          this.logError(lastError, `${context} (final attempt)`);
          throw lastError;
        }
        
        const delay = baseDelay * Math.pow(2, attempt - 1);
        this.logWarning(
          `Attempt ${attempt} failed, retrying in ${delay}ms: ${lastError.message}`,
          context
        );
        
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
    
    throw lastError!;
  }
}

// Crear y exportar instancia singleton
export const errorService = new ErrorService();
export default errorService;

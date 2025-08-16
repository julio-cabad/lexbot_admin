import { AuthErrorCode } from '../types';

// Error logging service
class ErrorService {
  private isDevelopment = import.meta.env.DEV;

  // Log error to console in development
  logError(error: Error, context?: string): void {
    if (this.isDevelopment) {
      console.group(`🚨 Error${context ? ` in ${context}` : ''}`);
      console.error('Message:', error.message);
      console.error('Stack:', error.stack);
      console.groupEnd();
    }
  }

  // Log warning to console in development
  logWarning(message: string, context?: string): void {
    if (this.isDevelopment) {
      console.warn(`⚠️ Warning${context ? ` in ${context}` : ''}: ${message}`);
    }
  }

  // Log info to console in development
  logInfo(message: string, context?: string): void {
    if (this.isDevelopment) {
      console.info(`ℹ️ Info${context ? ` in ${context}` : ''}: ${message}`);
    }
  }

  // Check if error is a network error
  isNetworkError(error: Error): boolean {
    return error.message.includes('network') || 
           error.message.includes('fetch') ||
           error.message.includes('connection');
  }

  // Check if error is an auth error
  isAuthError(error: Error): boolean {
    return error.message.includes('auth/') || 
           Object.values(AuthErrorCode).some(code => error.message.includes(code));
  }

  // Get error severity level
  getErrorSeverity(error: Error): 'low' | 'medium' | 'high' | 'critical' {
    if (this.isNetworkError(error)) return 'medium';
    if (this.isAuthError(error)) return 'high';
    if (error.message.includes('permission')) return 'high';
    if (error.message.includes('quota')) return 'critical';
    return 'low';
  }

  // Format error for user display
  formatUserError(error: Error): string {
    // Remove technical details and show user-friendly message
    const message = error.message.toLowerCase();
    
    if (message.includes('network') || message.includes('connection')) {
      return 'Problema de conexión. Por favor verifica tu internet e intenta de nuevo.';
    }
    
    if (message.includes('permission')) {
      return 'No tienes permisos para realizar esta acción.';
    }
    
    if (message.includes('quota') || message.includes('limit')) {
      return 'Se ha alcanzado el límite de uso. Por favor intenta más tarde.';
    }
    
    // Return the original message if it's already user-friendly
    return error.message;
  }

  // Create error report object
  createErrorReport(error: Error, context?: string, userId?: string) {
    return {
      message: error.message,
      stack: error.stack,
      context,
      userId,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
      severity: this.getErrorSeverity(error)
    };
  }

  // Handle async errors with proper logging
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

  // Retry operation with exponential backoff
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

// Create and export singleton instance
export const errorService = new ErrorService();
export default errorService;
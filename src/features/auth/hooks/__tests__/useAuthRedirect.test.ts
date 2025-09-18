import { renderHook } from '@testing-library/react';
import { useNavigate } from 'react-router-dom';
import { useAuthRedirect, usePublicPageRedirect, useProtectedPageRedirect } from '../useAuthRedirect';
import { useAuth } from '../useAuth';

// Mocks
jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn()
}));

jest.mock('../useAuth', () => ({
  useAuth: jest.fn()
}));

const mockNavigate = jest.fn();
const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;
const mockUseNavigate = useNavigate as jest.MockedFunction<typeof useNavigate>;

describe('useAuthRedirect', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseNavigate.mockReturnValue(mockNavigate);
  });

  describe('useAuthRedirect', () => {
    it('should redirect when user is authenticated and initialized', () => {
      mockUseAuth.mockReturnValue({
        isAuthenticated: true,
        isInitialized: true,
      } as any);

      renderHook(() => useAuthRedirect());

      expect(mockNavigate).toHaveBeenCalledWith('/dashboard', { replace: true });
    });

    it('should not redirect when user is not authenticated', () => {
      mockUseAuth.mockReturnValue({
        isAuthenticated: false,
        isInitialized: true,
      } as any);

      renderHook(() => useAuthRedirect());

      expect(mockNavigate).not.toHaveBeenCalled();
    });

    it('should not redirect when not initialized and waitForInitialization is true', () => {
      mockUseAuth.mockReturnValue({
        isAuthenticated: true,
        isInitialized: false,
      } as any);

      renderHook(() => useAuthRedirect({ waitForInitialization: true }));

      expect(mockNavigate).not.toHaveBeenCalled();
    });

    it('should use custom shouldRedirect function', () => {
      const mockShouldRedirect = jest.fn().mockReturnValue(false);
      
      mockUseAuth.mockReturnValue({
        isAuthenticated: true,
        isInitialized: true,
      } as any);

      renderHook(() => useAuthRedirect({ shouldRedirect: mockShouldRedirect }));

      expect(mockShouldRedirect).toHaveBeenCalled();
      expect(mockNavigate).not.toHaveBeenCalled();
    });

    it('should redirect to custom path', () => {
      mockUseAuth.mockReturnValue({
        isAuthenticated: true,
        isInitialized: true,
      } as any);

      renderHook(() => useAuthRedirect({ redirectTo: '/custom-path' }));

      expect(mockNavigate).toHaveBeenCalledWith('/custom-path', { replace: true });
    });
  });

  describe('usePublicPageRedirect', () => {
    it('should redirect authenticated users to dashboard', () => {
      mockUseAuth.mockReturnValue({
        isAuthenticated: true,
        isInitialized: true,
      } as any);

      renderHook(() => usePublicPageRedirect());

      expect(mockNavigate).toHaveBeenCalledWith('/dashboard', { replace: true });
    });

    it('should not redirect unauthenticated users', () => {
      mockUseAuth.mockReturnValue({
        isAuthenticated: false,
        isInitialized: true,
      } as any);

      renderHook(() => usePublicPageRedirect());

      expect(mockNavigate).not.toHaveBeenCalled();
    });
  });

  describe('useProtectedPageRedirect', () => {
    it('should redirect unauthenticated users to login', () => {
      mockUseAuth.mockReturnValue({
        isAuthenticated: false,
        isInitialized: true,
      } as any);

      renderHook(() => useProtectedPageRedirect());

      expect(mockNavigate).toHaveBeenCalledWith('/login', { replace: true });
    });

    it('should not redirect authenticated users', () => {
      mockUseAuth.mockReturnValue({
        isAuthenticated: true,
        isInitialized: true,
      } as any);

      renderHook(() => useProtectedPageRedirect());

      expect(mockNavigate).not.toHaveBeenCalled();
    });

    it('should not redirect when not initialized', () => {
      mockUseAuth.mockReturnValue({
        isAuthenticated: false,
        isInitialized: false,
      } as any);

      renderHook(() => useProtectedPageRedirect());

      expect(mockNavigate).not.toHaveBeenCalled();
    });
  });
});

/**
 * Casos de prueba adicionales que podrías agregar:
 * 
 * 1. Test de integración con React Router
 * 2. Test de comportamiento con cambios de estado
 * 3. Test de redirección manual
 * 4. Test de múltiples instancias del hook
 * 5. Test de cleanup en unmount
 * 6. Test de performance con muchos re-renders
 */
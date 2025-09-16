import { useEffect, useState, useCallback } from 'react';
import { 
  announceToScreenReader, 
  manageFocus, 
  prefersReducedMotion, 
  prefersHighContrast,
  getPreferredColorScheme 
} from '../../utils/accessibility';

interface UseAccessibilityOptions {
  announcePageChanges?: boolean;
  manageFocusOnMount?: boolean;
  respectMotionPreferences?: boolean;
}

interface UseAccessibilityReturn {
  // Estados de preferencias del usuario
  prefersReducedMotion: boolean;
  prefersHighContrast: boolean;
  preferredColorScheme: 'light' | 'dark';
  
  // Funciones de utilidad
  announce: (message: string, priority?: 'polite' | 'assertive') => void;
  focusElement: (elementId: string) => void;
  focusFirstError: () => void;
  saveFocus: () => (() => void);
  
  // Estados de navegación
  isNavigating: boolean;
}

/**
 * Hook personalizado para manejar funcionalidades de accesibilidad
 */
export const useAccessibility = (options: UseAccessibilityOptions = {}): UseAccessibilityReturn => {
  const {
    announcePageChanges = true,
    manageFocusOnMount = true,
    respectMotionPreferences = true,
  } = options;

  // Estados para preferencias del usuario
  const [reducedMotion, setReducedMotion] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  const [colorScheme, setColorScheme] = useState<'light' | 'dark'>('dark');
  const [isNavigating, setIsNavigating] = useState(false);

  // Detectar preferencias del usuario al montar
  useEffect(() => {
    setReducedMotion(prefersReducedMotion());
    setHighContrast(prefersHighContrast());
    setColorScheme(getPreferredColorScheme());

    // Listeners para cambios en las preferencias
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const contrastQuery = window.matchMedia('(prefers-contrast: high)');
    const colorQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const handleMotionChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    const handleContrastChange = (e: MediaQueryListEvent) => setHighContrast(e.matches);
    const handleColorChange = (e: MediaQueryListEvent) => setColorScheme(e.matches ? 'dark' : 'light');

    motionQuery.addEventListener('change', handleMotionChange);
    contrastQuery.addEventListener('change', handleContrastChange);
    colorQuery.addEventListener('change', handleColorChange);

    return () => {
      motionQuery.removeEventListener('change', handleMotionChange);
      contrastQuery.removeEventListener('change', handleContrastChange);
      colorQuery.removeEventListener('change', handleColorChange);
    };
  }, []);

  // Manejar foco al montar el componente
  useEffect(() => {
    if (manageFocusOnMount) {
      // Enfocar el elemento principal o el primer elemento focuseable
      const mainElement = document.querySelector('main, [role="main"], h1');
      if (mainElement && 'focus' in mainElement) {
        (mainElement as HTMLElement).focus();
      }
    }
  }, [manageFocusOnMount]);

  // Función para anunciar mensajes
  const announce = useCallback((message: string, priority: 'polite' | 'assertive' = 'polite') => {
    announceToScreenReader(message, priority);
  }, []);

  // Función para enfocar elemento por ID
  const focusElement = useCallback((elementId: string) => {
    manageFocus.setFocus(elementId);
  }, []);

  // Función para enfocar el primer error
  const focusFirstError = useCallback(() => {
    manageFocus.focusFirstError();
  }, []);

  // Función para guardar y restaurar foco
  const saveFocus = useCallback(() => {
    return manageFocus.saveFocus();
  }, []);

  // Detectar navegación (para anuncios automáticos)
  useEffect(() => {
    if (!announcePageChanges) return;

    const handleRouteChange = () => {
      setIsNavigating(true);
      
      // Anunciar cambio de página después de un breve delay
      setTimeout(() => {
        const pageTitle = document.title;
        const mainHeading = document.querySelector('h1')?.textContent;
        const announcement = mainHeading || pageTitle || 'Página cargada';
        
        announce(`Navegando a: ${announcement}`, 'polite');
        setIsNavigating(false);
      }, 100);
    };

    // Escuchar cambios en el historial (para SPAs)
    window.addEventListener('popstate', handleRouteChange);
    
    // Observer para cambios en el título de la página
    const titleObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList' && mutation.target === document.head) {
          handleRouteChange();
        }
      });
    });

    titleObserver.observe(document.head, {
      childList: true,
      subtree: true,
    });

    return () => {
      window.removeEventListener('popstate', handleRouteChange);
      titleObserver.disconnect();
    };
  }, [announcePageChanges, announce]);

  return {
    prefersReducedMotion: reducedMotion,
    prefersHighContrast: highContrast,
    preferredColorScheme: colorScheme,
    announce,
    focusElement,
    focusFirstError,
    saveFocus,
    isNavigating,
  };
};

/**
 * Hook específico para formularios con funcionalidades de accesibilidad
 */
export const useFormAccessibility = () => {
  const { announce, focusFirstError } = useAccessibility();

  const announceFormError = useCallback((errors: Record<string, string>) => {
    const errorCount = Object.keys(errors).length;
    if (errorCount > 0) {
      const message = errorCount === 1 
        ? 'Se encontró 1 error en el formulario' 
        : `Se encontraron ${errorCount} errores en el formulario`;
      
      announce(message, 'assertive');
      
      // Enfocar el primer campo con error después de un breve delay
      setTimeout(() => {
        focusFirstError();
      }, 100);
    }
  }, [announce, focusFirstError]);

  const announceFormSuccess = useCallback((message: string) => {
    announce(message, 'polite');
  }, [announce]);

  return {
    announceFormError,
    announceFormSuccess,
  };
};
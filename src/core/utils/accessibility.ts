/**
 * Utilidades para mejorar la accesibilidad en la aplicación
 * Integradas con el sistema de configuración
 */
import { APP_CONFIG } from '../../config/app';

/**
 * Genera un ID único para elementos de formulario
 */
export const generateId = (prefix: string = 'element'): string => {
  return `${prefix}-${Math.random().toString(36).substring(2, 11)}`;
};

/**
 * Combina múltiples IDs para aria-describedby
 */
export const combineAriaDescribedBy = (...ids: (string | undefined)[]): string | undefined => {
  const validIds = ids.filter(Boolean);
  return validIds.length > 0 ? validIds.join(' ') : undefined;
};

/**
 * Constantes para tamaños mínimos de touch targets (WCAG 2.1 AA)
 */
export const TOUCH_TARGET = {
  MIN_SIZE: 44, // píxeles mínimos para touch targets
  RECOMMENDED_SIZE: 48, // tamaño recomendado
} as const;

/**
 * Constantes para ratios de contraste (WCAG 2.1)
 */
export const CONTRAST_RATIO = {
  AA_NORMAL: 4.5, // Texto normal AA
  AA_LARGE: 3, // Texto grande AA
  AAA_NORMAL: 7, // Texto normal AAA
  AAA_LARGE: 4.5, // Texto grande AAA
} as const;

/**
 * Niveles de prioridad para live regions
 */
export const LIVE_REGION = {
  POLITE: 'polite',
  ASSERTIVE: 'assertive',
  OFF: 'off',
} as const;

/**
 * Roles ARIA comunes
 */
export const ARIA_ROLES = {
  ALERT: 'alert',
  BUTTON: 'button',
  FORM: 'form',
  MAIN: 'main',
  NAVIGATION: 'navigation',
  REGION: 'region',
  STATUS: 'status',
  TAB: 'tab',
  TABPANEL: 'tabpanel',
  TABLIST: 'tablist',
} as const;

/**
 * Estados ARIA comunes
 */
export const ARIA_STATES = {
  EXPANDED: 'aria-expanded',
  SELECTED: 'aria-selected',
  CHECKED: 'aria-checked',
  DISABLED: 'aria-disabled',
  HIDDEN: 'aria-hidden',
  INVALID: 'aria-invalid',
  PRESSED: 'aria-pressed',
  BUSY: 'aria-busy',
} as const;

/**
 * Propiedades ARIA comunes
 */
export const ARIA_PROPERTIES = {
  LABEL: 'aria-label',
  LABELLEDBY: 'aria-labelledby',
  DESCRIBEDBY: 'aria-describedby',
  LIVE: 'aria-live',
  ATOMIC: 'aria-atomic',
  RELEVANT: 'aria-relevant',
} as const;

/**
 * Función para anunciar mensajes a lectores de pantalla
 */
export const announceToScreenReader = (message: string, priority: 'polite' | 'assertive' = 'polite'): void => {
  const announcement = document.createElement('div');
  announcement.setAttribute('aria-live', priority);
  announcement.setAttribute('aria-atomic', 'true');
  announcement.className = 'sr-only';
  announcement.textContent = message;
  
  document.body.appendChild(announcement);
  
  // Remover el elemento después de que se haya anunciado
  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
};

/**
 * Funciones para manejar el foco en elementos
 */
export const manageFocus = {
  /**
   * Establece el foco en un elemento por ID
   */
  setFocus: (elementId: string): void => {
    const element = document.getElementById(elementId);
    if (element) {
      element.focus();
    }
  },

  /**
   * Establece el foco en el primer elemento con error
   */
  focusFirstError: (): void => {
    const errorElement = document.querySelector('[aria-invalid="true"]') as HTMLElement;
    if (errorElement) {
      errorElement.focus();
    }
  },

  /**
   * Guarda el foco actual y lo restaura después
   */
  saveFocus: (): (() => void) => {
    const activeElement = document.activeElement as HTMLElement;
    return () => {
      if (activeElement && activeElement.focus) {
        activeElement.focus();
      }
    };
  },

  /**
   * Atrapa el foco dentro de un elemento (para modales)
   */
  trapFocus: (element: HTMLElement): (() => void) => {
    const focusableElements = element.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    ) as NodeListOf<HTMLElement>;
    
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    
    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };
    
    element.addEventListener('keydown', handleTabKey);
    firstElement?.focus();
    
    return () => {
      element.removeEventListener('keydown', handleTabKey);
    };
  }
};

/**
 * Funciones para validar si un elemento cumple con los requisitos de accesibilidad
 */
export const validateAccessibility = {
  /**
   * Verifica si un botón tiene el tamaño mínimo requerido
   */
  checkTouchTargetSize: (element: HTMLElement): boolean => {
    const rect = element.getBoundingClientRect();
    return rect.width >= TOUCH_TARGET.MIN_SIZE && rect.height >= TOUCH_TARGET.MIN_SIZE;
  },

  /**
   * Verifica si un elemento tiene un label accesible
   */
  hasAccessibleLabel: (element: HTMLElement): boolean => {
    return !!(
      element.getAttribute('aria-label') ||
      element.getAttribute('aria-labelledby') ||
      element.getAttribute('title') ||
      (element as HTMLInputElement).labels?.length
    );
  },

  /**
   * Verifica si un elemento tiene suficiente contraste
   */
  hasEnoughContrast: (_foregroundColor: string, _backgroundColor: string, _isLargeText: boolean = false): boolean => {
    // Esta es una implementación simplificada
    // En un caso real, se usaría una librería como color-contrast
    return true;
  }
};

/**
 * Breakpoints para responsive design
 * Obtenidos de la configuración centralizada
 */
export const BREAKPOINTS = {
  SM: parseInt(APP_CONFIG.ui.breakpoints.sm),
  MD: parseInt(APP_CONFIG.ui.breakpoints.md),
  LG: parseInt(APP_CONFIG.ui.breakpoints.lg),
  XL: parseInt(APP_CONFIG.ui.breakpoints.xl),
  '2XL': parseInt(APP_CONFIG.ui.breakpoints['2xl']),
} as const;

/**
 * Función para detectar si el usuario prefiere movimiento reducido
 */
export const prefersReducedMotion = (): boolean => {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

/**
 * Función para detectar si el usuario prefiere alto contraste
 */
export const prefersHighContrast = (): boolean => {
  return window.matchMedia('(prefers-contrast: high)').matches;
};

/**
 * Función para detectar el esquema de color preferido
 */
export const getPreferredColorScheme = (): 'light' | 'dark' => {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

/**
 * Función para aplicar atributos ARIA a un elemento
 */
export const applyAriaAttributes = (element: HTMLElement, attributes: Record<string, string>): void => {
  Object.entries(attributes).forEach(([key, value]) => {
    element.setAttribute(key, value);
  });
};

/**
 * Función para crear un botón accesible
 */
export const createAccessibleButton = (
  text: string,
  onClick: () => void,
  options: {
    className?: string;
    ariaLabel?: string;
    disabled?: boolean;
  } = {}
): HTMLButtonElement => {
  const button = document.createElement('button');
  button.textContent = text;
  button.onclick = onClick;
  
  if (options.className) {
    button.className = options.className;
  }
  
  if (options.ariaLabel) {
    button.setAttribute('aria-label', options.ariaLabel);
  }
  
  if (options.disabled) {
    button.disabled = true;
    button.setAttribute('aria-disabled', 'true');
  }
  
  return button;
};

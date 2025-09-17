/**
 * Tipos para el sistema de temas
 */

// Tipo para colores
export interface ThemeColors {
  // Colores primarios
  primary: string;
  secondary: string;
  accent: string;
  
  // Colores de texto
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  textInverted: string;
  
  // Colores de fondo
  background: string;
  backgroundAlt: string;
  backgroundInverted: string;
  
  // Colores de estado
  success: string;
  error: string;
  warning: string;
  info: string;
  
  // Colores de borde
  border: string;
  borderLight: string;
  borderFocus: string;
  
  // Colores de sombra
  shadow: string;
  shadowLight: string;
}

// Tipo para tipografía
export interface ThemeTypography {
  fontFamily: string;
  fontFamilyMono: string;
  baseFontSize: string;
  baseLineHeight: number;
  fontWeightLight: number;
  fontWeightRegular: number;
  fontWeightMedium: number;
  fontWeightBold: number;
  h1: string;
  h2: string;
  h3: string;
  h4: string;
  h5: string;
  h6: string;
  body: string;
  small: string;
  smaller: string;
}

// Tipo para espaciado
export interface ThemeSpacing {
  base: number;
  xs: string;
  sm: string;
  md: string;
  lg: string;
  xl: string;
  xxl: string;
}

// Tipo para bordes
export interface ThemeBorders {
  radius: {
    sm: string;
    md: string;
    lg: string;
    full: string;
  };
  width: {
    thin: string;
    regular: string;
    thick: string;
  };
  style: {
    solid: string;
    dashed: string;
    dotted: string;
  };
}

// Tipo para efectos
export interface ThemeEffects {
  boxShadow: {
    sm: string;
    md: string;
    lg: string;
    inner: string;
  };
  transition: {
    fast: string;
    normal: string;
    slow: string;
  };
  blur: {
    sm: string;
    md: string;
    lg: string;
  };
  opacity: {
    light: number;
    medium: number;
    heavy: number;
  };
}

// Tipo para breakpoints
export interface ThemeBreakpoints {
  sm: string;
  md: string;
  lg: string;
  xl: string;
  '2xl': string;
}

// Tipo para el tema completo
export interface Theme {
  name: string;
  colors: ThemeColors;
  typography: ThemeTypography;
  spacing: ThemeSpacing;
  borders: ThemeBorders;
  effects: ThemeEffects;
  breakpoints: ThemeBreakpoints;
  isDark: boolean;
}

// Definición de temas
export const THEMES: Record<string, Theme> = {
  // Tema Glassmorphism (por defecto)
  glassmorphism: {
    name: 'Glassmorphism',
    colors: {
      primary: '#3b82f6',
      secondary: '#6366f1',
      accent: '#8b5cf6',
      
      textPrimary: '#f8fafc',
      textSecondary: '#cbd5e1',
      textMuted: '#94a3b8',
      textInverted: '#0f172a',
      
      background: 'rgba(15, 23, 42, 0.6)',
      backgroundAlt: 'rgba(30, 41, 59, 0.6)',
      backgroundInverted: 'rgba(248, 250, 252, 0.8)',
      
      success: '#10b981',
      error: '#ef4444',
      warning: '#f59e0b',
      info: '#06b6d4',
      
      border: 'rgba(255, 255, 255, 0.2)',
      borderLight: 'rgba(255, 255, 255, 0.1)',
      borderFocus: 'rgba(59, 130, 246, 0.5)',
      
      shadow: 'rgba(0, 0, 0, 0.25)',
      shadowLight: 'rgba(0, 0, 0, 0.1)'
    },
    typography: {
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      fontFamilyMono: "'JetBrains Mono', 'SF Mono', Menlo, Monaco, Consolas, monospace",
      baseFontSize: '16px',
      baseLineHeight: 1.5,
      fontWeightLight: 300,
      fontWeightRegular: 400,
      fontWeightMedium: 500,
      fontWeightBold: 700,
      h1: '2.5rem',
      h2: '2rem',
      h3: '1.75rem',
      h4: '1.5rem',
      h5: '1.25rem',
      h6: '1rem',
      body: '1rem',
      small: '0.875rem',
      smaller: '0.75rem'
    },
    spacing: {
      base: 4,
      xs: '0.25rem',
      sm: '0.5rem',
      md: '1rem',
      lg: '1.5rem',
      xl: '2rem',
      xxl: '3rem'
    },
    borders: {
      radius: {
        sm: '0.25rem',
        md: '0.5rem',
        lg: '1rem',
        full: '9999px'
      },
      width: {
        thin: '1px',
        regular: '2px',
        thick: '4px'
      },
      style: {
        solid: 'solid',
        dashed: 'dashed',
        dotted: 'dotted'
      }
    },
    effects: {
      boxShadow: {
        sm: '0 1px 2px rgba(0, 0, 0, 0.05)',
        md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)'
      },
      transition: {
        fast: 'all 0.15s ease-in-out',
        normal: 'all 0.3s ease-in-out',
        slow: 'all 0.5s ease-in-out'
      },
      blur: {
        sm: 'blur(4px)',
        md: 'blur(8px)',
        lg: 'blur(16px)'
      },
      opacity: {
        light: 0.2,
        medium: 0.5,
        heavy: 0.8
      }
    },
    breakpoints: {
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px'
    },
    isDark: true
  },
  
  // Tema Corporate
  corporate: {
    name: 'Corporate',
    colors: {
      primary: '#2563eb',
      secondary: '#1e40af',
      accent: '#4f46e5',
      
      textPrimary: '#1e293b',
      textSecondary: '#334155',
      textMuted: '#64748b',
      textInverted: '#f8fafc',
      
      background: '#ffffff',
      backgroundAlt: '#f1f5f9',
      backgroundInverted: '#0f172a',
      
      success: '#10b981',
      error: '#ef4444',
      warning: '#f59e0b',
      info: '#06b6d4',
      
      border: '#e2e8f0',
      borderLight: '#f1f5f9',
      borderFocus: 'rgba(59, 130, 246, 0.5)',
      
      shadow: 'rgba(0, 0, 0, 0.1)',
      shadowLight: 'rgba(0, 0, 0, 0.05)'
    },
    typography: {
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      fontFamilyMono: "'JetBrains Mono', 'SF Mono', Menlo, Monaco, Consolas, monospace",
      baseFontSize: '16px',
      baseLineHeight: 1.5,
      fontWeightLight: 300,
      fontWeightRegular: 400,
      fontWeightMedium: 500,
      fontWeightBold: 700,
      h1: '2.25rem',
      h2: '1.875rem',
      h3: '1.5rem',
      h4: '1.25rem',
      h5: '1.125rem',
      h6: '1rem',
      body: '1rem',
      small: '0.875rem',
      smaller: '0.75rem'
    },
    spacing: {
      base: 4,
      xs: '0.25rem',
      sm: '0.5rem',
      md: '1rem',
      lg: '1.5rem',
      xl: '2rem',
      xxl: '3rem'
    },
    borders: {
      radius: {
        sm: '0.125rem',
        md: '0.25rem',
        lg: '0.5rem',
        full: '9999px'
      },
      width: {
        thin: '1px',
        regular: '2px',
        thick: '3px'
      },
      style: {
        solid: 'solid',
        dashed: 'dashed',
        dotted: 'dotted'
      }
    },
    effects: {
      boxShadow: {
        sm: '0 1px 2px rgba(0, 0, 0, 0.05)',
        md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)'
      },
      transition: {
        fast: 'all 0.15s ease-in-out',
        normal: 'all 0.3s ease-in-out',
        slow: 'all 0.5s ease-in-out'
      },
      blur: {
        sm: 'blur(4px)',
        md: 'blur(8px)',
        lg: 'blur(16px)'
      },
      opacity: {
        light: 0.2,
        medium: 0.5,
        heavy: 0.8
      }
    },
    breakpoints: {
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px'
    },
    isDark: false
  },
  
  // Tema Dark
  dark: {
    name: 'Dark',
    colors: {
      primary: '#3b82f6',
      secondary: '#6366f1',
      accent: '#8b5cf6',
      
      textPrimary: '#f8fafc',
      textSecondary: '#cbd5e1',
      textMuted: '#94a3b8',
      textInverted: '#0f172a',
      
      background: '#0f172a',
      backgroundAlt: '#1e293b',
      backgroundInverted: '#f8fafc',
      
      success: '#10b981',
      error: '#ef4444',
      warning: '#f59e0b',
      info: '#06b6d4',
      
      border: '#334155',
      borderLight: '#1e293b',
      borderFocus: 'rgba(59, 130, 246, 0.5)',
      
      shadow: 'rgba(0, 0, 0, 0.5)',
      shadowLight: 'rgba(0, 0, 0, 0.25)'
    },
    typography: {
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      fontFamilyMono: "'JetBrains Mono', 'SF Mono', Menlo, Monaco, Consolas, monospace",
      baseFontSize: '16px',
      baseLineHeight: 1.5,
      fontWeightLight: 300,
      fontWeightRegular: 400,
      fontWeightMedium: 500,
      fontWeightBold: 700,
      h1: '2.5rem',
      h2: '2rem',
      h3: '1.75rem',
      h4: '1.5rem',
      h5: '1.25rem',
      h6: '1rem',
      body: '1rem',
      small: '0.875rem',
      smaller: '0.75rem'
    },
    spacing: {
      base: 4,
      xs: '0.25rem',
      sm: '0.5rem',
      md: '1rem',
      lg: '1.5rem',
      xl: '2rem',
      xxl: '3rem'
    },
    borders: {
      radius: {
        sm: '0.25rem',
        md: '0.5rem',
        lg: '1rem',
        full: '9999px'
      },
      width: {
        thin: '1px',
        regular: '2px',
        thick: '4px'
      },
      style: {
        solid: 'solid',
        dashed: 'dashed',
        dotted: 'dotted'
      }
    },
    effects: {
      boxShadow: {
        sm: '0 1px 2px rgba(0, 0, 0, 0.3)',
        md: '0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2)',
        lg: '0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -2px rgba(0, 0, 0, 0.2)',
        inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.3)'
      },
      transition: {
        fast: 'all 0.15s ease-in-out',
        normal: 'all 0.3s ease-in-out',
        slow: 'all 0.5s ease-in-out'
      },
      blur: {
        sm: 'blur(4px)',
        md: 'blur(8px)',
        lg: 'blur(16px)'
      },
      opacity: {
        light: 0.2,
        medium: 0.5,
        heavy: 0.8
      }
    },
    breakpoints: {
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px'
    },
    isDark: true
  },
  
  // Tema Light
  light: {
    name: 'Light',
    colors: {
      primary: '#2563eb',
      secondary: '#4f46e5',
      accent: '#7c3aed',
      
      textPrimary: '#0f172a',
      textSecondary: '#1e293b',
      textMuted: '#64748b',
      textInverted: '#f8fafc',
      
      background: '#f8fafc',
      backgroundAlt: '#f1f5f9',
      backgroundInverted: '#0f172a',
      
      success: '#10b981',
      error: '#ef4444',
      warning: '#f59e0b',
      info: '#06b6d4',
      
      border: '#e2e8f0',
      borderLight: '#f1f5f9',
      borderFocus: 'rgba(59, 130, 246, 0.5)',
      
      shadow: 'rgba(0, 0, 0, 0.1)',
      shadowLight: 'rgba(0, 0, 0, 0.05)'
    },
    typography: {
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      fontFamilyMono: "'JetBrains Mono', 'SF Mono', Menlo, Monaco, Consolas, monospace",
      baseFontSize: '16px',
      baseLineHeight: 1.5,
      fontWeightLight: 300,
      fontWeightRegular: 400,
      fontWeightMedium: 500,
      fontWeightBold: 700,
      h1: '2.25rem',
      h2: '1.875rem',
      h3: '1.5rem',
      h4: '1.25rem',
      h5: '1.125rem',
      h6: '1rem',
      body: '1rem',
      small: '0.875rem',
      smaller: '0.75rem'
    },
    spacing: {
      base: 4,
      xs: '0.25rem',
      sm: '0.5rem',
      md: '1rem',
      lg: '1.5rem',
      xl: '2rem',
      xxl: '3rem'
    },
    borders: {
      radius: {
        sm: '0.125rem',
        md: '0.25rem',
        lg: '0.5rem',
        full: '9999px'
      },
      width: {
        thin: '1px',
        regular: '2px',
        thick: '3px'
      },
      style: {
        solid: 'solid',
        dashed: 'dashed',
        dotted: 'dotted'
      }
    },
    effects: {
      boxShadow: {
        sm: '0 1px 2px rgba(0, 0, 0, 0.05)',
        md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)'
      },
      transition: {
        fast: 'all 0.15s ease-in-out',
        normal: 'all 0.3s ease-in-out',
        slow: 'all 0.5s ease-in-out'
      },
      blur: {
        sm: 'blur(4px)',
        md: 'blur(8px)',
        lg: 'blur(16px)'
      },
      opacity: {
        light: 0.2,
        medium: 0.5,
        heavy: 0.8
      }
    },
    breakpoints: {
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px'
    },
    isDark: false
  }
};

// Tipo para nombres de temas
export type ThemeName = keyof typeof THEMES;

// Tema por defecto
export const DEFAULT_THEME: ThemeName = 'glassmorphism';

/**
 * Obtiene un tema por su nombre
 * @param themeName Nombre del tema
 * @returns Objeto de tema
 */
export function getTheme(themeName: ThemeName = DEFAULT_THEME): Theme {
  return THEMES[themeName];
}

/**
 * Obtiene una lista de todos los temas disponibles
 * @returns Array de nombres de temas
 */
export function getAvailableThemes(): ThemeName[] {
  return Object.keys(THEMES) as ThemeName[];
}

/**
 * Obtiene una lista de temas con sus nombres para mostrar en UI
 * @returns Array de objetos {value, label}
 */
export function getThemeOptions(): Array<{value: ThemeName, label: string}> {
  return getAvailableThemes().map(theme => ({
    value: theme,
    label: THEMES[theme].name
  }));
}

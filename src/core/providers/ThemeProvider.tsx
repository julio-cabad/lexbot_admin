import React, { createContext, useContext, ReactNode } from 'react';
import { useTheme } from '../hooks/useTheme';
import { ThemeName, Theme } from '../../config/theme';

// Tipo para el contexto del tema
interface ThemeContextType {
  theme: Theme;
  themeName: ThemeName;
  isDarkMode: boolean;
  setTheme: (themeName: ThemeName) => void;
  toggleDarkMode: () => void;
  colors: Theme['colors'];
  typography: Theme['typography'];
  spacing: Theme['spacing'];
  borders: Theme['borders'];
  effects: Theme['effects'];
  breakpoints: Theme['breakpoints'];
}

// Crear el contexto
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Props para el proveedor de tema
interface ThemeProviderProps {
  children: ReactNode;
  initialTheme?: ThemeName;
}

/**
 * Proveedor de tema para la aplicación
 * Proporciona acceso al tema actual y funciones para cambiarlo
 */
export const ThemeProvider: React.FC<ThemeProviderProps> = ({ 
  children, 
  initialTheme 
}) => {
  // Usar el hook useTheme para gestionar el tema
  const themeData = useTheme();
  
  // Si se proporciona un tema inicial, usarlo
  React.useEffect(() => {
    if (initialTheme && initialTheme !== themeData.themeName) {
      themeData.setTheme(initialTheme);
    }
  }, [initialTheme, themeData]);

  // Crear el valor del contexto
  const contextValue: ThemeContextType = {
    theme: themeData.theme,
    themeName: themeData.themeName,
    isDarkMode: themeData.isDarkMode,
    setTheme: themeData.setTheme,
    toggleDarkMode: themeData.toggleDarkMode,
    colors: themeData.colors,
    typography: themeData.typography,
    spacing: themeData.spacing,
    borders: themeData.borders,
    effects: themeData.effects,
    breakpoints: themeData.breakpoints,
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

/**
 * Hook para acceder al contexto del tema
 * @returns Contexto del tema
 */
export const useThemeContext = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  
  if (context === undefined) {
    throw new Error('useThemeContext must be used within a ThemeProvider');
  }
  
  return context;
};

/**
 * Componente para aplicar variables CSS del tema actual
 */
export const ThemeInjector: React.FC = () => {
  const { theme, themeName } = useThemeContext();
  
  // Aplicar variables CSS al elemento raíz
  React.useEffect(() => {
    const root = document.documentElement;
    const body = document.body;
    
    // Aplicar variables de colores
    Object.entries(theme.colors).forEach(([key, value]) => {
      root.style.setProperty(`--color-${key}`, value);
    });
    
    // Aplicar variables de tipografía
    Object.entries(theme.typography).forEach(([key, value]) => {
      root.style.setProperty(`--typography-${key}`, String(value));
    });
    
    // Aplicar variables de espaciado
    Object.entries(theme.spacing).forEach(([key, value]) => {
      if (key !== 'base') {
        root.style.setProperty(`--spacing-${key}`, String(value));
      }
    });
    
    // Aplicar variables de bordes
    Object.entries(theme.borders.radius).forEach(([key, value]) => {
      root.style.setProperty(`--radius-${key}`, value);
    });
    
    // Aplicar variables de efectos
    Object.entries(theme.effects.transition).forEach(([key, value]) => {
      root.style.setProperty(`--transition-${key}`, value);
    });
    
    // Aplicar clases y atributos
    root.classList.remove('light', 'dark', 'glassmorphism', 'corporate');
    root.classList.add(themeName);
    root.setAttribute('data-theme', themeName);
    root.style.colorScheme = theme.isDark ? 'dark' : 'light';
    
    // Aplicar clase theme-enabled al body para activar los estilos del tema
    // pero solo para componentes nuevos que usen las clases theme-*
    body.classList.add('theme-enabled');
    
  }, [theme, themeName]);
  
  return null;
};

/**
 * Componente combinado para proveer y aplicar el tema
 */
export const ThemeManager: React.FC<ThemeProviderProps> = (props) => {
  return (
    <ThemeProvider {...props}>
      <ThemeInjector />
      {props.children}
    </ThemeProvider>
  );
};

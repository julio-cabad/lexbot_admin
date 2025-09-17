import { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  THEMES, 
  ThemeName, 
  DEFAULT_THEME, 
  getTheme, 
  getAvailableThemes,
  getThemeOptions,
  Theme
} from '../../config/theme';

// Clave para almacenar el tema en localStorage
const THEME_STORAGE_KEY = 'app_theme';

/**
 * Hook para gestionar el tema de la aplicación
 * Proporciona funciones para cambiar el tema y acceder a sus propiedades
 */
export function useTheme() {
  // Estado para almacenar el nombre del tema actual
  const [currentThemeName, setCurrentThemeName] = useState<ThemeName>(() => {
    // Intentar recuperar el tema del localStorage al inicializar
    try {
      const storedTheme = localStorage.getItem(THEME_STORAGE_KEY) as ThemeName | null;
      return storedTheme && THEMES[storedTheme] ? storedTheme : DEFAULT_THEME;
    } catch (error) {
      console.warn('Error accessing localStorage for theme:', error);
      return DEFAULT_THEME;
    }
  });

  // Obtener el objeto de tema completo basado en el nombre
  const currentTheme = useMemo(() => getTheme(currentThemeName), [currentThemeName]);

  // Función para cambiar el tema
  const setTheme = useCallback((themeName: ThemeName) => {
    if (!THEMES[themeName]) {
      console.warn(`Theme "${themeName}" not found, using default theme instead.`);
      themeName = DEFAULT_THEME;
    }

    setCurrentThemeName(themeName);
    
    // Guardar la preferencia en localStorage
    try {
      localStorage.setItem(THEME_STORAGE_KEY, themeName);
    } catch (error) {
      console.warn('Error saving theme to localStorage:', error);
    }
    
    // Aplicar clases CSS al elemento raíz si es necesario
    document.documentElement.classList.remove(...getAvailableThemes());
    document.documentElement.classList.add(themeName);
    
    // Actualizar el atributo data-theme para uso en CSS
    document.documentElement.setAttribute('data-theme', themeName);
    
    // Actualizar el color-scheme para el modo oscuro/claro del sistema
    document.documentElement.style.colorScheme = currentTheme.isDark ? 'dark' : 'light';
  }, [currentTheme.isDark]);

  // Aplicar el tema cuando cambie
  useEffect(() => {
    setTheme(currentThemeName);
  }, [currentThemeName, setTheme]);

  // Función para alternar entre modo oscuro y claro
  const toggleDarkMode = useCallback(() => {
    const isDark = currentTheme.isDark;
    // Si está en modo oscuro, cambiar al tema claro equivalente, o viceversa
    if (isDark) {
      setTheme('light');
    } else {
      setTheme('dark');
    }
  }, [currentTheme.isDark, setTheme]);

  // Función para comprobar si un tema es el actual
  const isCurrentTheme = useCallback((themeName: ThemeName) => {
    return currentThemeName === themeName;
  }, [currentThemeName]);

  // Función para obtener un valor específico del tema actual
  const getThemeValue = useCallback(<T extends keyof Theme>(
    category: T,
    property?: string
  ): any => {
    if (!property) {
      return currentTheme[category];
    }

    const categoryObj = currentTheme[category] as any;
    if (typeof categoryObj === 'object' && categoryObj !== null) {
      return property.split('.').reduce((obj, key) => obj?.[key], categoryObj);
    }
    
    return undefined;
  }, [currentTheme]);

  // Devolver todas las funciones y valores necesarios
  return {
    // Valores
    theme: currentTheme,
    themeName: currentThemeName,
    isDarkMode: currentTheme.isDark,
    
    // Colores y estilos
    colors: currentTheme.colors,
    typography: currentTheme.typography,
    spacing: currentTheme.spacing,
    borders: currentTheme.borders,
    effects: currentTheme.effects,
    breakpoints: currentTheme.breakpoints,
    
    // Funciones
    setTheme,
    toggleDarkMode,
    isCurrentTheme,
    getThemeValue,
    
    // Opciones de temas
    availableThemes: getAvailableThemes(),
    themeOptions: getThemeOptions(),
  };
}

/**
 * Exportamos también las funciones de utilidad para uso directo
 */
export { getTheme, getAvailableThemes, getThemeOptions };

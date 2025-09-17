import React from 'react';
import { useThemeContext } from '../../core/providers/ThemeProvider';
import { ThemeSwitcher } from './ThemeSwitcher';
import { getThemeOptions } from '../../config/theme';

/**
 * Componente para demostrar el sistema de temas
 */
export const ThemeDemo: React.FC = () => {
  const { theme, colors } = useThemeContext();
  const themeOptions = getThemeOptions();

  return (
    <div className="theme-demo glass p-6 rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Sistema de Temas</h2>
      
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">Selector de Tema</h3>
        <div className="flex flex-col gap-4">
          <div>
            <h4 className="text-lg font-medium mb-2">Dropdown</h4>
            <ThemeSwitcher variant="dropdown" />
          </div>
          
          <div>
            <h4 className="text-lg font-medium mb-2">Botones</h4>
            <ThemeSwitcher variant="buttons" />
          </div>
          
          <div>
            <h4 className="text-lg font-medium mb-2">Toggle Modo Oscuro/Claro</h4>
            <ThemeSwitcher variant="toggle" />
          </div>
        </div>
      </div>
      
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">Tema Actual: {theme.name}</h3>
        <p>Modo: {theme.isDark ? 'Oscuro' : 'Claro'}</p>
      </div>
      
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">Paleta de Colores</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {Object.entries(colors).map(([name, value]) => (
            <div key={name} className="flex items-center gap-2">
              <div 
                className="w-6 h-6 rounded-full border border-white/20" 
                style={{ backgroundColor: value }}
              />
              <span className="text-sm">{name}</span>
            </div>
          ))}
        </div>
      </div>
      
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">Ejemplos de Componentes</h3>
        
        <div className="space-y-4">
          <div>
            <h4 className="text-lg font-medium mb-2">Botones</h4>
            <div className="flex flex-wrap gap-2">
              <button className="button">Botón Normal</button>
              <button className="button bg-primary text-white">Botón Primario</button>
              <button className="button bg-secondary text-white">Botón Secundario</button>
              <button className="button bg-accent text-white">Botón Acento</button>
            </div>
          </div>
          
          <div>
            <h4 className="text-lg font-medium mb-2">Inputs</h4>
            <div className="flex flex-col gap-2 max-w-md">
              <input type="text" placeholder="Input de texto" className="w-full" />
              <select className="w-full">
                <option>Opción 1</option>
                <option>Opción 2</option>
                <option>Opción 3</option>
              </select>
              <textarea placeholder="Área de texto" className="w-full" rows={3} />
            </div>
          </div>
          
          <div>
            <h4 className="text-lg font-medium mb-2">Tarjetas</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {themeOptions.map((option) => (
                <div key={option.value} className="card p-4">
                  <h5 className="text-lg font-medium mb-2">{option.label}</h5>
                  <p className="text-sm text-textMuted mb-4">
                    Este es un ejemplo de tarjeta con el estilo del tema {option.label}.
                  </p>
                  <button 
                    onClick={() => {
                      const themeContext = document.querySelector('.theme-demo') as HTMLElement;
                      if (themeContext) {
                        themeContext.setAttribute('data-theme-preview', option.value);
                      }
                    }}
                    className="button text-sm"
                  >
                    Vista previa
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

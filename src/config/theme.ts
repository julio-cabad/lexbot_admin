export const THEMES = {
  glassmorphism: {
    primary: 'rgba(255, 255, 255, 0.7)',
    secondary: 'rgba(255, 255, 255, 0.3)',
    blur: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.2)'
  },
  corporate: {
    primary: '#2563eb',
    secondary: '#1e40af',
    // ...
  }
};

export type ThemeName = keyof typeof THEMES;

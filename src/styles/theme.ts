import { ThemeColors } from '../types';

// Color palette based on the existing design
export const colors: ThemeColors = {
  primary: {
    50: '#eff6ff',
    100: '#dbeafe',
    200: '#bfdbfe',
    300: '#93c5fd',
    400: '#60a5fa',
    500: '#3b82f6',
    600: '#2563eb',
    700: '#1d4ed8',
    800: '#1e40af',
    900: '#1e3a8a',
    950: '#172554'
  },
  secondary: {
    50: '#faf5ff',
    100: '#f3e8ff',
    200: '#e9d5ff',
    300: '#d8b4fe',
    400: '#c084fc',
    500: '#a855f7',
    600: '#9333ea',
    700: '#7c3aed',
    800: '#6b21a8',
    900: '#581c87',
    950: '#3b0764'
  },
  accent: {
    pink: '#ec4899',
    cyan: '#06b6d4',
    purple: '#8b5cf6',
    indigo: '#6366f1',
    violet: '#7c3aed'
  },
  background: {
    primary: 'from-purple-900 via-blue-900 to-indigo-900',
    glass: 'bg-white/10 backdrop-blur-md',
    card: 'bg-white/5 backdrop-blur',
    overlay: 'bg-black/50',
    modal: 'bg-white/10 backdrop-blur-lg'
  },
  text: {
    primary: '#f8fafc',
    secondary: '#cbd5e1',
    muted: '#64748b',
    inverse: '#1e293b',
    accent: '#06b6d4'
  },
  status: {
    success: '#10b981',
    error: '#ef4444',
    warning: '#f59e0b',
    info: '#3b82f6'
  }
};

// Component styles using Tailwind classes
export const componentStyles = {
  // Button styles
  button: {
    base: 'inline-flex items-center justify-center rounded-full font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed',
    variants: {
      primary: 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 focus:ring-purple-500',
      secondary: 'bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 focus:ring-white/50',
      ghost: 'text-cyan-400 hover:text-cyan-300 hover:bg-white/5 focus:ring-cyan-400',
      danger: 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-lg hover:shadow-xl focus:ring-red-500'
    },
    sizes: {
      sm: 'px-4 py-2 text-sm',
      md: 'px-6 py-3 text-base',
      lg: 'px-8 py-4 text-lg'
    }
  },
  
  // Input styles
  input: {
    base: 'w-full rounded-lg border transition-all duration-300 focus:outline-none focus:ring-2 placeholder-gray-400',
    variants: {
      default: 'bg-white/10 backdrop-blur-md border-white/20 text-white focus:border-cyan-400 focus:ring-cyan-400/20',
      error: 'bg-white/10 backdrop-blur-md border-red-400 text-white focus:border-red-400 focus:ring-red-400/20',
      success: 'bg-white/10 backdrop-blur-md border-green-400 text-white focus:border-green-400 focus:ring-green-400/20'
    },
    sizes: {
      sm: 'px-3 py-2 text-sm',
      md: 'px-4 py-3 text-base',
      lg: 'px-5 py-4 text-lg'
    }
  },
  
  // Card styles
  card: {
    base: 'rounded-2xl border shadow-2xl transition-all duration-300',
    variants: {
      default: 'bg-white/10 backdrop-blur-md border-white/10',
      glass: 'bg-white/5 backdrop-blur border-white/5',
      solid: 'bg-white border-gray-200',
      hover: 'hover:bg-white/15 hover:shadow-3xl'
    },
    sizes: {
      sm: 'p-4',
      md: 'p-6',
      lg: 'p-8',
      xl: 'p-10'
    }
  },
  
  // Form styles
  form: {
    group: 'space-y-2',
    label: 'block text-sm font-medium text-gray-200',
    error: 'text-sm text-red-400 mt-1',
    success: 'text-sm text-green-400 mt-1',
    helper: 'text-sm text-gray-400 mt-1'
  },
  
  // Layout styles
  layout: {
    container: 'min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4',
    content: 'w-full max-w-md mx-auto',
    header: 'text-center mb-8',
    footer: 'text-center mt-6'
  }
};

// Animation classes
export const animations = {
  fadeIn: 'animate-fade-in',
  slideUp: 'animate-slide-up',
  slideDown: 'animate-slide-down',
  scaleIn: 'animate-scale-in',
  spin: 'animate-spin',
  pulse: 'animate-pulse',
  bounce: 'animate-bounce',
  wiggle: 'animate-wiggle'
};

// Shadow styles
export const shadows = {
  sm: 'shadow-sm',
  md: 'shadow-md',
  lg: 'shadow-lg',
  xl: 'shadow-xl',
  '2xl': 'shadow-2xl',
  inner: 'shadow-inner',
  none: 'shadow-none',
  glow: 'shadow-lg shadow-purple-500/25',
  glowBlue: 'shadow-lg shadow-blue-500/25',
  glowPink: 'shadow-lg shadow-pink-500/25'
};

// Spacing scale
export const spacing = {
  0: '0',
  1: '0.25rem',
  2: '0.5rem',
  3: '0.75rem',
  4: '1rem',
  5: '1.25rem',
  6: '1.5rem',
  8: '2rem',
  10: '2.5rem',
  12: '3rem',
  16: '4rem',
  20: '5rem',
  24: '6rem',
  32: '8rem'
};

// Border radius scale
export const borderRadius = {
  none: '0',
  sm: '0.125rem',
  md: '0.375rem',
  lg: '0.5rem',
  xl: '0.75rem',
  '2xl': '1rem',
  '3xl': '1.5rem',
  full: '9999px'
};

// Typography scale
export const typography = {
  fontSizes: {
    xs: '0.75rem',
    sm: '0.875rem',
    base: '1rem',
    lg: '1.125rem',
    xl: '1.25rem',
    '2xl': '1.5rem',
    '3xl': '1.875rem',
    '4xl': '2.25rem',
    '5xl': '3rem',
    '6xl': '3.75rem'
  },
  fontWeights: {
    thin: '100',
    light: '300',
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
    black: '900'
  },
  lineHeights: {
    tight: '1.25',
    snug: '1.375',
    normal: '1.5',
    relaxed: '1.625',
    loose: '2'
  }
};

// Breakpoints for responsive design
export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px'
};

// Z-index scale
export const zIndex = {
  hide: -1,
  auto: 'auto',
  base: 0,
  docked: 10,
  dropdown: 1000,
  sticky: 1100,
  banner: 1200,
  overlay: 1300,
  modal: 1400,
  popover: 1500,
  skipLink: 1600,
  toast: 1700,
  tooltip: 1800
};

// Export complete theme object
export const theme = {
  colors,
  componentStyles,
  animations,
  shadows,
  spacing,
  borderRadius,
  typography,
  breakpoints,
  zIndex
};

export default theme;
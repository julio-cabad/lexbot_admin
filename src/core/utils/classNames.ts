/**
 * Utilidades para manipulación de clases CSS
 */

type ClassValue =
  | string
  | number
  | boolean
  | undefined
  | null
  | ClassArray
  | ClassDictionary;
type ClassArray = ClassValue[];
type ClassDictionary = Record<string, any>;

/**
 * Combina múltiples nombres de clase en una sola cadena
 * Similar a la librería clsx/classnames
 * 
 * @example
 * cn('btn', 'btn-primary', { 'btn-large': isLarge, 'btn-disabled': disabled })
 */
export function cn(...inputs: ClassValue[]): string {
  const classes: string[] = [];

  for (const input of inputs) {
    if (!input) continue;

    if (typeof input === "string" || typeof input === "number") {
      classes.push(String(input));
    } else if (Array.isArray(input)) {
      const nested = cn(...input);
      if (nested) classes.push(nested);
    } else if (typeof input === "object") {
      for (const key in input) {
        if (input[key]) classes.push(key);
      }
    }
  }

  return classes.join(" ");
}

/**
 * Crea una función para obtener variantes de estilo para componentes
 * 
 * @example
 * const getButtonVariant = createVariants({
 *   size: {
 *     sm: 'text-sm px-2 py-1',
 *     md: 'text-base px-4 py-2',
 *     lg: 'text-lg px-6 py-3'
 *   },
 *   color: {
 *     primary: 'bg-blue-500 text-white',
 *     secondary: 'bg-gray-200 text-gray-800'
 *   }
 * });
 * 
 * // Uso: getButtonVariant('size', 'md')
 */
export function createVariants<
  T extends Record<string, Record<string, string>>
>(variants: T) {
  return function getVariant<K extends keyof T>(
    variant: K,
    value: keyof T[K]
  ): string {
    return variants[variant]?.[value] || "";
  };
}

/**
 * Genera clases CSS responsivas para diferentes breakpoints
 * 
 * @example
 * responsive('p-2', 'p-4', 'p-6', 'p-8', 'p-10')
 * // Resultado: 'p-2 sm:p-4 md:p-6 lg:p-8 xl:p-10'
 */
export function responsive(
  base: string,
  sm?: string,
  md?: string,
  lg?: string,
  xl?: string
): string {
  const classes = [base];

  if (sm) classes.push(`sm:${sm}`);
  if (md) classes.push(`md:${md}`);
  if (lg) classes.push(`lg:${lg}`);
  if (xl) classes.push(`xl:${xl}`);

  return classes.join(" ");
}

/**
 * Genera clases para anillos de foco accesibles
 * 
 * @example
 * focusRing('blue')
 * // Resultado: 'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
 */
export function focusRing(color: string = "blue"): string {
  return `focus:outline-none focus:ring-2 focus:ring-${color}-500 focus:ring-offset-2`;
}

/**
 * Genera clases para transiciones CSS
 * 
 * @example
 * transition('all', '300', 'ease-in-out')
 * // Resultado: 'transition-all duration-300 ease-in-out'
 */
export function transition(
  property: string = "all",
  duration: string = "300",
  timing: string = "ease"
): string {
  return `transition-${property} duration-${duration} ${timing}`;
}

/**
 * Genera clases para efectos de escala al pasar el cursor
 * 
 * @example
 * hoverScale('105')
 * // Resultado: 'transform transition-transform hover:scale-105'
 */
export function hoverScale(scale: string = "105"): string {
  return `transform transition-transform hover:scale-${scale}`;
}

/**
 * Genera clases para efectos de cristal (glassmorphism)
 * 
 * @example
 * glassEffect('10')
 * // Resultado: 'bg-white/10 backdrop-blur-md'
 */
export function glassEffect(opacity: string = "10"): string {
  return `bg-white/${opacity} backdrop-blur-md`;
}

/**
 * Genera clases para texto con gradiente
 * 
 * @example
 * gradientText('blue-500', 'purple-500')
 * // Resultado: 'bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent'
 */
export function gradientText(from: string, to: string): string {
  return `bg-gradient-to-r from-${from} to-${to} bg-clip-text text-transparent`;
}

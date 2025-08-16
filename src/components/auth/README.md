# Auth Components

Esta carpeta contiene todos los componentes relacionados con la autenticación.

## AuthLayout

El componente principal que proporciona un layout consistente para todas las páginas de autenticación.

### Características

- ✨ **Diseño glassmorphism** - Efectos de vidrio con backdrop-blur
- 🎨 **Gradiente de fondo** - Gradiente purple-blue-indigo consistente con el diseño
- 🎭 **Animaciones suaves** - Animaciones de entrada escalonadas
- 📱 **Completamente responsive** - Optimizado para móviles y desktop
- 🎯 **Elementos decorativos** - Blobs animados y puntos decorativos
- 🏷️ **Logo integrado** - Logo de la aplicación con opción de mostrar/ocultar

### Uso Básico

```tsx
import { AuthLayout } from '../components/auth';

const LoginPage = () => {
  return (
    <AuthLayout
      title="Iniciar Sesión"
      subtitle="Ingresa tus credenciales para acceder"
    >
      {/* Tu formulario aquí */}
      <form>
        {/* campos del formulario */}
      </form>
    </AuthLayout>
  );
};
```

### Props

| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| `children` | `React.ReactNode` | - | Contenido del layout |
| `title` | `string` | - | Título principal |
| `subtitle` | `string` | - | Subtítulo opcional |
| `showLogo` | `boolean` | `true` | Mostrar/ocultar logo |
| `className` | `string` | - | Clases CSS adicionales |

### Variantes

#### AuthLayoutVariants
Proporciona diferentes tamaños de layout:

```tsx
import { AuthLayoutVariants, CompactAuthLayout, WideAuthLayout } from '../components/auth';

// Variante compacta
<CompactAuthLayout title="Login" subtitle="Acceso rápido">
  {/* contenido */}
</CompactAuthLayout>

// Variante ancha
<WideAuthLayout title="Registro" subtitle="Crear nueva cuenta">
  {/* contenido */}
</WideAuthLayout>
```

### Hook useAuthLayout

Hook personalizado para manejar el estado y comportamiento del layout:

```tsx
import { useAuthLayout } from '../hooks/ui';

const MyAuthPage = () => {
  const {
    isLoaded,
    currentStep,
    nextStep,
    prevStep,
    getLayoutClasses,
    getAnimationDelay
  } = useAuthLayout({
    enableAnimations: true,
    animationDelay: 200
  });

  return (
    <div className={getLayoutClasses()}>
      {/* contenido con animaciones */}
    </div>
  );
};
```

### Animaciones Personalizadas

El layout incluye animaciones CSS personalizadas definidas en `src/styles/animations.css`:

- `animate-fade-in` - Aparición suave
- `animate-slide-up` - Deslizamiento hacia arriba
- `animate-blob` - Animación de blobs de fondo
- `animation-delay-*` - Delays escalonados

### Responsive Design

El layout se adapta automáticamente a diferentes tamaños de pantalla:

- **Mobile** (< 640px): Padding reducido, animaciones más rápidas
- **Tablet** (640px - 1024px): Layout optimizado para pantallas medianas
- **Desktop** (> 1024px): Layout completo con todos los efectos

### Personalización

#### Colores
Los colores se pueden personalizar modificando las clases de Tailwind:

```tsx
// Gradiente personalizado
<div className="bg-gradient-to-br from-blue-900 via-purple-900 to-pink-900">
```

#### Animaciones
Las animaciones se pueden deshabilitar o personalizar:

```tsx
<AuthLayout 
  title="Mi Página"
  className="animate-none" // Deshabilitar animaciones
>
```

### Mejores Prácticas

1. **Consistencia**: Usa siempre AuthLayout para páginas de auth
2. **Títulos claros**: Usa títulos descriptivos y subtítulos informativos
3. **Responsive**: Prueba en diferentes dispositivos
4. **Accesibilidad**: Mantén contraste adecuado y navegación por teclado
5. **Performance**: Las animaciones se optimizan automáticamente en móviles

### Ejemplos Completos

Ver `AuthLayoutExample.tsx` para ejemplos completos de uso con formularios de login, registro y recuperación de contraseña.
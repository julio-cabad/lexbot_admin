# UI Components

Esta carpeta contiene componentes UI reutilizables con estilos glassmorphism para el sistema de autenticación.

## Componentes Disponibles

### 🔘 **Button** - Botón reutilizable
- **Variantes**: `primary`, `secondary`, `ghost`, `danger`
- **Tamaños**: `sm`, `md`, `lg`
- **Características**: Loading state, iconos, ancho completo
- **Estilos**: Gradientes, efectos hover, animaciones

### 📝 **Input** - Campo de entrada
- **Tipos**: `text`, `email`, `password`, `tel`, `url`
- **Características**: Iconos izquierda/derecha, toggle de contraseña, estados de error
- **Estilos**: Glassmorphism, focus states, validación visual

### 📋 **FormField** - Campo de formulario completo
- **Características**: Combina Input con manejo de errores y labels
- **Validación**: Estados de error, texto de ayuda, campos requeridos

### 🍞 **Toast** - Sistema de notificaciones
- **Tipos**: `success`, `error`, `warning`, `info`
- **Características**: Contenido personalizado, posicionamiento, auto-close
- **Estilos**: Glassmorphism, iconos, animaciones

### 🃏 **Card** - Tarjeta contenedora
- **Variantes**: `default`, `glass`, `solid`, `hover`
- **Tamaños**: `sm`, `md`, `lg`, `xl`
- **Componentes**: `CardHeader`, `CardBody`, `CardFooter`

### ☑️ **Checkbox** - Casilla de verificación
- **Tamaños**: `sm`, `md`, `lg`
- **Características**: Labels, descripciones, estados de error
- **Estilos**: Gradientes, animaciones, glassmorphism

### ⏳ **Loading** - Indicadores de carga
- **Variantes**: `spinner`, `dots`, `pulse`
- **Tamaños**: `sm`, `md`, `lg`, `xl`
- **Componentes**: `LoadingOverlay`, `LoadingButton`

### 🔒 **PasswordStrengthMeter** - Medidor de fuerza de contraseña
- **Características**: Barra de progreso, lista de requisitos, colores dinámicos
- **Integración**: Usa el hook `usePasswordStrength`

### 🪟 **Modal** - Ventana modal
- **Tamaños**: `sm`, `md`, `lg`, `xl`, `full`
- **Características**: Click outside, tecla Escape, animaciones
- **Componentes**: `ConfirmModal` para confirmaciones

## Uso

### Importación
```typescript
import { 
  Button, 
  Input, 
  FormField,
  Toast, 
  Card,
  Checkbox,
  Loading,
  PasswordStrengthMeter,
  Modal
} from '../components/ui';
```

### Ejemplos de Uso

#### Botón con loading
```typescript
<Button 
  variant="primary" 
  size="md" 
  loading={isSubmitting}
  fullWidth
>
  Iniciar Sesión
</Button>
```

#### Campo de formulario completo
```typescript
<FormField
  label="Email"
  inputType="email"
  placeholder="tu@email.com"
  error={errors.email}
  required
  leftIcon={<EmailIcon />}
/>
```

#### Input con toggle de contraseña
```typescript
<Input
  label="Contraseña"
  inputType="password"
  showPasswordToggle
  error={errors.password}
/>
```

#### Card con header y footer
```typescript
<Card variant="glass" size="lg">
  <CardHeader 
    title="Iniciar Sesión" 
    subtitle="Accede a tu cuenta" 
  />
  <CardBody>
    {/* Contenido del formulario */}
  </CardBody>
  <CardFooter>
    <Button variant="primary" fullWidth>
      Entrar
    </Button>
  </CardFooter>
</Card>
```

#### Medidor de fuerza de contraseña
```typescript
<PasswordStrengthMeter
  password={password}
  showRequirements={true}
/>
```

#### Modal de confirmación
```typescript
<ConfirmModal
  isOpen={showConfirm}
  onClose={() => setShowConfirm(false)}
  onConfirm={handleDelete}
  title="Confirmar eliminación"
  message="¿Estás seguro de que quieres eliminar tu cuenta?"
  variant="danger"
  confirmText="Eliminar"
  cancelText="Cancelar"
/>
```

#### Toast notifications
```typescript
import { showToast } from '../components/ui';

// Usar helpers
showToast.success('¡Login exitoso!');
showToast.error('Error al iniciar sesión');

// O usar el hook
const { showSuccess, showError } = useToast();
showSuccess('¡Bienvenido!');
```

## Características del Sistema de Diseño

### 🎨 **Glassmorphism**
- Fondos con `backdrop-blur-md`
- Transparencias con `bg-white/10`
- Bordes sutiles con `border-white/20`

### 🌈 **Gradientes**
- Botones primarios: `from-purple-500 to-pink-500`
- Estados hover: `from-purple-600 to-pink-600`
- Efectos de enfoque: `focus:ring-cyan-400/20`

### ✨ **Animaciones**
- Transiciones suaves: `transition-all duration-300`
- Efectos hover: `hover:scale-105`
- Estados activos: `active:scale-95`
- Loading spinners y pulsos

### 📱 **Responsive**
- Breakpoints consistentes
- Tamaños adaptativos
- Touch-friendly en móviles

### ♿ **Accesibilidad**
- Labels apropiados
- Estados de focus visibles
- Soporte para lectores de pantalla
- Navegación por teclado

## Personalización

Todos los componentes aceptan `className` para personalización adicional:

```typescript
<Button 
  className="my-custom-styles" 
  variant="primary"
>
  Mi Botón
</Button>
```

Los estilos se combinan usando la función `cn()` que maneja conflictos de clases automáticamente.
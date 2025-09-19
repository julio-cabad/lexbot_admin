# 🏛️ LEXBOT ADMIN - GUÍA ARQUITECTÓNICA COMPLETA

## 📋 ÍNDICE

1. [Introducción y Filosofía](#introducción-y-filosofía)
2. [Estructura General del Proyecto](#estructura-general-del-proyecto)
3. [Arquitectura por Capas](#arquitectura-por-capas)
4. [Sistema de Features](#sistema-de-features)
5. [Servicios y Datos](#servicios-y-datos)
6. [Estado Global (Redux)](#estado-global-redux)
7. [Componentes UI](#componentes-ui)
8. [Hooks y Lógica de Negocio](#hooks-y-lógica-de-negocio)
9. [Tipos y Contratos](#tipos-y-contratos)
10. [Configuración y Textos](#configuración-y-textos)
11. [Routing y Navegación](#routing-y-navegación)
12. [Estilos y Temas](#estilos-y-temas)
13. [Patrones y Convenciones](#patrones-y-convenciones)
14. [Guías de Desarrollo](#guías-de-desarrollo)
15. [Ejemplos Prácticos](#ejemplos-prácticos)

---

## 🎯 INTRODUCCIÓN Y FILOSOFÍA

### ¿Qué es LexBot Admin?

LexBot Admin es una aplicación web administrativa construida con **React + TypeScript + Redux Toolkit + Firebase**, siguiendo principios de **Clean Architecture** y **Domain-Driven Design**.

### Principios Fundamentales

1. **🏛️ Feature-Driven Architecture:** Cada funcionalidad es un "feature" autónomo
2. **⚔️ Single Responsibility:** Cada archivo/función tiene UNA responsabilidad
3. **🔥 Composition over Inheritance:** Componemos funcionalidad en lugar de heredar
4. **🛡️ Type Safety First:** TypeScript estricto en todo el proyecto
5. **🎯 Accessibility First:** WCAG 2.1 AA compliance desde el inicio
6. **📱 Mobile First:** Responsive design desde mobile hacia desktop

---

## 📁 ESTRUCTURA GENERAL DEL PROYECTO

```
src/
├── 🏛️ features/           # DOMINIO - Funcionalidades del negocio
│   ├── auth/              # Feature de autenticación
│   ├── dashboard/         # Feature del panel principal
│   └── admin/             # Feature del layout administrativo
├── 🔧 core/               # INFRAESTRUCTURA - Servicios compartidos
│   ├── hooks/             # Hooks genéricos reutilizables
│   ├── services/          # Servicios de datos (Firebase, APIs)
│   ├── store/             # Estado global (Redux)
│   └── utils/             # Utilidades generales
├── 🎨 components/         # UI REUTILIZABLE - Componentes genéricos
│   └── ui/                # Componentes de interfaz (Button, Input, etc.)
├── ⚙️ config/             # CONFIGURACIÓN - Settings globales
├── 🛣️ routes/             # NAVEGACIÓN - Definición de rutas
├── 🎭 styles/             # ESTILOS - CSS globales y temas
└── 📝 types/              # TIPOS GLOBALES - Interfaces compartidas
```

### 🎯 Regla de Oro: "¿Dónde va mi código?"

**¿Es específico de una funcionalidad?** → `features/[nombre-feature]/`
**¿Es reutilizable en todo el proyecto?** → `core/` o `components/`
**¿Es configuración global?** → `config/`
**¿Son tipos compartidos?** → `types/`
---


## 🏗️ ARQUITECTURA POR CAPAS

### Diagrama de Capas

```
┌─────────────────────────────────────────┐
│  🎨 PRESENTATION LAYER (UI)             │
│  Components, Pages, Layouts             │
├─────────────────────────────────────────┤
│  🧠 BUSINESS LOGIC LAYER                │
│  Hooks, State Management, Validation    │
├─────────────────────────────────────────┤
│  🔧 DATA ACCESS LAYER                   │
│  Services, APIs, Firebase Integration   │
├─────────────────────────────────────────┤
│  🌐 EXTERNAL LAYER                      │
│  Firebase, Third-party APIs             │
└─────────────────────────────────────────┘
```

### Flujo de Datos

```
User Interaction (Click, Type)
    ↓
Component (LoginForm.tsx)
    ↓
Hook (useAuth.ts)
    ↓
Redux Action (loginUser thunk)
    ↓
Service (authService.ts)
    ↓
Firebase SDK
    ↓
Firestore Database
```

---

## 🏛️ SISTEMA DE FEATURES

### ¿Qué es un Feature?

Un **feature** es una funcionalidad completa del negocio que incluye:
- UI específica (componentes, páginas)
- Lógica de negocio (hooks)
- Tipos específicos
- Utilidades del dominio

### Estructura Estándar de un Feature

```
features/[nombre-feature]/
├── 📁 components/         # UI específica del feature
│   ├── ComponenteA.tsx
│   ├── ComponenteB.tsx
│   └── index.ts          # Exportaciones centralizadas
├── 📁 hooks/             # Lógica de negocio del feature
│   ├── useFeatureA.ts
│   ├── useFeatureB.ts
│   └── index.ts
├── 📁 pages/             # Páginas completas del feature
│   ├── PaginaA.tsx
│   ├── PaginaB.tsx
│   └── index.ts
├── 📁 types/             # Tipos específicos del feature
│   └── index.ts
├── 📁 utils/             # Utilidades específicas del feature
│   ├── validation.ts
│   └── index.ts
├── 📁 store/             # Estado específico (si es necesario)
│   ├── featureSlice.ts
│   └── index.ts
└── 📄 index.ts           # Exportación principal del feature
```

### Ejemplo Real: Feature Auth

```
features/auth/
├── components/
│   ├── LoginForm.tsx      # ✅ SOLO maneja UI del login
│   ├── RegisterForm.tsx   # ✅ SOLO maneja UI del registro
│   └── AuthLayout.tsx     # ✅ Layout específico para auth
├── hooks/
│   ├── useAuth.ts         # 🧠 Lógica principal de autenticación
│   ├── useAuthForm.ts     # 🧠 Lógica de formularios
│   └── useUserProfile.ts  # 🧠 Lógica de perfil de usuario
├── pages/
│   ├── LoginPage.tsx      # 📄 Página completa de login
│   └── RegisterPage.tsx   # 📄 Página completa de registro
├── types/
│   └── index.ts           # 📝 LoginCredentials, RegisterData, etc.
└── utils/
    └── validation.ts      # 🔧 Validaciones específicas de auth
```---

#
# 🔧 SERVICIOS Y DATOS

### Arquitectura de Servicios

```
┌─────────────────────────────────────────┐
│  🎯 SERVICIOS ESPECÍFICOS               │
│  userService, authService, etc.         │
├─────────────────────────────────────────┤
│  🏛️ SERVICIO GENÉRICO                   │
│  firestoreService (CRUD genérico)       │
├─────────────────────────────────────────┤
│  🔥 FIREBASE SDK                        │
│  Firestore, Auth, Storage               │
└─────────────────────────────────────────┘
```

### Ubicación de Servicios

```
src/core/services/
├── 🏛️ firestoreService.ts    # Servicio GENÉRICO para Firestore
├── 👤 userService.ts         # Servicio ESPECÍFICO para usuarios
├── 🔐 authService.ts         # Servicio ESPECÍFICO para autenticación
├── 📧 emailService.ts        # Servicio ESPECÍFICO para emails
└── 📄 index.ts               # Exportaciones centralizadas
```

### Patrón de Servicios

#### 1. Servicio Genérico (firestoreService.ts)

```typescript
// ✅ RESPONSABILIDAD: CRUD genérico para cualquier colección
class FirestoreService {
  async createDocument<T>(collection: string, data: T, id?: string) {
    // Lógica genérica para crear documentos
  }
  
  async getDocument<T>(collection: string, id: string) {
    // Lógica genérica para obtener documentos
  }
  
  // Más métodos CRUD genéricos...
}
```

#### 2. Servicio Específico (userService.ts)

```typescript
// ✅ RESPONSABILIDAD: Operaciones específicas de usuarios
class UserService {
  async createUserProfile(uid: string, email: string) {
    // Usa el servicio genérico pero con lógica específica
    return firestoreService.createDocument('users', {
      uid,
      email,
      isComplete: false, // ← Lógica específica del dominio
      createdAt: new Date()
    }, uid);
  }
  
  async isProfileComplete(uid: string): Promise<boolean> {
    // Lógica específica para verificar completitud
  }
}
```

### Cómo Crear un Nuevo Servicio

1. **¿Es genérico?** → Agregar método a `firestoreService.ts`
2. **¿Es específico de un dominio?** → Crear nuevo servicio específico

```typescript
// Ejemplo: Crear servicio para "productos"
// src/core/services/productService.ts

import { firestoreService } from './firestoreService';

class ProductService {
  private COLLECTION = 'products';
  
  async createProduct(productData: ProductData) {
    return firestoreService.createDocument(this.COLLECTION, {
      ...productData,
      createdAt: new Date(),
      isActive: true // ← Lógica específica
    });
  }
}

export const productService = new ProductService();
```

---

## 🗃️ ESTADO GLOBAL (REDUX)

### Estructura del Store

```
src/core/store/
├── 📁 slices/
│   ├── auth/              # Estado de autenticación
│   │   ├── slice.ts       # Reducers y actions
│   │   ├── thunks.ts      # Async actions
│   │   ├── selectors.ts   # Selectores memoizados
│   │   └── types.ts       # Tipos del estado
│   └── ui/                # Estado de UI global
├── 📄 store.ts            # Configuración del store
└── 📄 index.ts            # Exportaciones
```

### Patrón de Slice

#### 1. Tipos del Estado (types.ts)

```typescript
// ✅ RESPONSABILIDAD: Definir la forma del estado
export interface AuthState {
  user: User | null;
  userProfile: UserProfile | null;
  loading: {
    login: boolean;
    register: boolean;
    loadProfile: boolean;
  };
  errors: {
    login: string | null;
    register: string | null;
  };
}
```

#### 2. Thunks Asíncronos (thunks.ts)

```typescript
// ✅ RESPONSABILIDAD: Acciones asíncronas (API calls)
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (credentials: LoginCredentials) => {
    // 1. Llamar al servicio
    const userCredential = await authService.login(credentials);
    
    // 2. Cargar datos adicionales
    const profile = await userService.getUserProfile(userCredential.user.uid);
    
    // 3. Retornar datos para el reducer
    return { user: userCredential.user, profile };
  }
);
```

#### 3. Slice Principal (slice.ts)

```typescript
// ✅ RESPONSABILIDAD: Reducers y estado
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Acciones síncronas
    clearError: (state, action) => {
      state.errors[action.payload] = null;
    }
  },
  extraReducers: (builder) => {
    // Manejar thunks asíncronos
    builder.addCase(loginUser.fulfilled, (state, action) => {
      state.user = action.payload.user;
      state.userProfile = action.payload.profile;
    });
  }
});
```

#### 4. Selectores Memoizados (selectors.ts)

```typescript
// ✅ RESPONSABILIDAD: Acceso optimizado al estado
export const selectUser = (state: RootState) => state.auth.user;

export const selectUserFullName = createSelector(
  [selectUserProfile],
  (profile) => profile ? `${profile.firstName} ${profile.lastName}` : ''
);
```-
--

## 🎨 COMPONENTES UI

### Ubicación y Organización

```
src/components/ui/
├── 🔘 Button.tsx          # Botón reutilizable
├── 📝 Input.tsx           # Input con validación
├── 🎛️ Select.tsx          # Selector dropdown
├── 🔔 Toast.tsx           # Notificaciones
├── 📊 Card.tsx            # Tarjeta de contenido
└── 📄 index.ts            # Exportaciones
```

### Patrón de Componente UI

```typescript
// ✅ EJEMPLO: Button.tsx
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  fullWidth?: boolean;
  children: React.ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', loading, children, ...props }, ref) => {
    // ✅ Lógica de estilos basada en props
    const baseStyles = "inline-flex items-center justify-center...";
    const variantStyles = {
      primary: "bg-gradient-to-r from-purple-500 to-pink-500...",
      secondary: "bg-white/10 backdrop-blur-md...",
      // ...más variants
    };
    
    return (
      <button
        ref={ref}
        className={cn(baseStyles, variantStyles[variant])}
        disabled={loading}
        {...props}
      >
        {loading && <LoadingSpinner />}
        {children}
      </button>
    );
  }
);
```

### Principios de Componentes UI

1. **🎯 Reutilizable:** Funciona en cualquier contexto
2. **🔧 Configurable:** Props para personalizar comportamiento
3. **♿ Accesible:** ARIA labels, keyboard navigation
4. **📱 Responsive:** Funciona en mobile, tablet, desktop
5. **🎨 Themeable:** Usa variables CSS para temas

### Cómo Crear un Nuevo Componente UI

```typescript
// 1. Definir la interface
interface MiComponenteProps {
  // Props específicas
  variant?: 'default' | 'special';
  // Extender props nativas si aplica
  // extends React.HTMLAttributes<HTMLDivElement>
}

// 2. Implementar el componente
export const MiComponente: React.FC<MiComponenteProps> = ({
  variant = 'default',
  children,
  ...props
}) => {
  return (
    <div className={cn('base-styles', variantStyles[variant])} {...props}>
      {children}
    </div>
  );
};

// 3. Exportar en index.ts
export { MiComponente } from './MiComponente';
```

---

## 🪝 HOOKS Y LÓGICA DE NEGOCIO

### Tipos de Hooks

#### 1. Hooks de Feature (Específicos)

```
src/features/auth/hooks/
├── useAuth.ts           # 🧠 Hook MAESTRO de autenticación
├── useAuthForm.ts       # 🧠 Lógica de formularios de auth
└── useUserProfile.ts    # 🧠 Lógica de perfil de usuario
```

#### 2. Hooks Genéricos (Reutilizables)

```
src/core/hooks/
├── useLocalStorage.ts   # 💾 Persistencia local
├── useDebounce.ts       # ⏱️ Debounce de valores
├── useApi.ts            # 🌐 Llamadas a APIs
└── useForm.ts           # 📝 Lógica de formularios genérica
```

#### 3. Hooks de UI (Interfaz)

```
src/hooks/ui/
├── useToast.ts          # 🔔 Notificaciones
├── useModal.ts          # 🪟 Modales
└── useTheme.ts          # 🎨 Gestión de temas
```

### Patrón de Hook de Feature

```typescript
// ✅ EJEMPLO: useAuth.ts
export const useAuth = () => {
  const dispatch = useAppDispatch();
  
  // 1. Selectores del estado
  const user = useAppSelector(selectUser);
  const isLoading = useAppSelector(selectIsLoginLoading);
  
  // 2. Funciones memoizadas
  const login = useCallback(async (credentials: LoginCredentials) => {
    return await dispatch(loginUser(credentials));
  }, [dispatch]);
  
  const logout = useCallback(async () => {
    return await dispatch(logoutUser());
  }, [dispatch]);
  
  // 3. Datos computados
  const userDisplayName = user?.displayName || 'Usuario';
  
  // 4. API limpia para componentes
  return {
    // Estado
    user,
    isLoading,
    userDisplayName,
    
    // Funciones
    login,
    logout,
  };
};
```

### Patrón de Hook Genérico

```typescript
// ✅ EJEMPLO: useLocalStorage.ts
export const useLocalStorage = <T>(key: string, initialValue: T) => {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      return initialValue;
    }
  });

  const setValue = useCallback((value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  }, [key, storedValue]);

  return [storedValue, setValue] as const;
};
```

---

## 📝 TIPOS Y CONTRATOS

### Organización de Tipos

#### 1. Tipos Globales (Compartidos)

```
src/types/
├── common.ts            # Tipos básicos (ID, Status, etc.)
├── api.ts               # Tipos de APIs
├── firestore.ts         # Tipos de Firestore
└── index.ts             # Re-exportaciones
```

#### 2. Tipos de Feature (Específicos)

```
src/features/auth/types/
└── index.ts             # LoginCredentials, RegisterData, etc.
```

### Patrones de Tipos

#### 1. Interfaces de Datos

```typescript
// ✅ Datos del dominio
export interface UserProfile {
  uid: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  isComplete: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

#### 2. Tipos de Operaciones

```typescript
// ✅ Para operaciones CRUD
export interface CreateUserProfileData {
  uid: string;
  email: string;
  firstName?: string;
  lastName?: string;
}

export interface UpdateUserProfileData {
  firstName?: string;
  lastName?: string;
  role?: UserRole;
}
```

#### 3. Tipos de Resultado

```typescript
// ✅ Para respuestas de servicios
export interface FirestoreResult<T> {
  success: boolean;
  data?: T;
  error?: string;
  id?: string;
}
```

#### 4. Enums para Valores Controlados

```typescript
// ✅ Valores fijos del dominio
export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
  MODERATOR = 'moderator'
}
```---

## 
⚙️ CONFIGURACIÓN Y TEXTOS

### Sistema de Configuración

```
src/config/
├── 🌐 app.ts            # Configuración general de la app
├── 🛣️ routes.ts          # Definición de rutas
├── 📝 texts.ts          # Textos e internacionalización
├── 🎨 theme.ts          # Configuración de temas
└── 🔥 firebase.ts       # Configuración de Firebase
```

### Configuración de Textos (texts.ts)

```typescript
// ✅ PATRÓN: Textos organizados por dominio
export const TEXTS = {
  // Textos de autenticación
  auth: {
    loginTitle: 'Iniciar Sesión',
    loginButton: 'Entrar',
    registerTitle: 'Crear Cuenta',
    emailPlaceholder: 'Correo electrónico',
    passwordPlaceholder: 'Contraseña',
    // ...más textos de auth
  },
  
  // Textos del dashboard
  dashboard: {
    title: 'Panel Principal',
    welcome: 'Bienvenido',
    statistics: 'Estadísticas',
    // ...más textos del dashboard
  },
  
  // Textos comunes
  common: {
    loading: 'Cargando...',
    save: 'Guardar',
    cancel: 'Cancelar',
    delete: 'Eliminar',
    // ...más textos comunes
  },
  
  // Mensajes de error
  errors: {
    required: 'Este campo es obligatorio',
    invalidEmail: 'Correo electrónico inválido',
    passwordTooShort: 'La contraseña debe tener al menos 8 caracteres',
    // ...más errores
  }
};

// ✅ Hook para usar textos
export const useTexts = () => {
  return TEXTS; // En el futuro puede incluir lógica de i18n
};
```

### Configuración de Rutas (routes.ts)

```typescript
// ✅ PATRÓN: Rutas organizadas por acceso
export const ROUTES = {
  public: {
    home: { path: '/', component: LoginPage },
    login: { path: '/login', component: LoginPage },
    register: { path: '/register', component: RegisterPage },
  },
  
  private: {
    dashboard: { path: '/dashboard', component: DashboardPage },
    profile: { path: '/profile', component: ProfilePage },
    completeProfile: { path: '/complete-profile', component: CompleteProfilePage },
  }
};

// ✅ Objeto con solo las rutas para uso fácil
export const PATHS = {
  public: {
    login: '/login',
    register: '/register',
  },
  private: {
    dashboard: '/dashboard',
    completeProfile: '/complete-profile',
  }
};
```

### Configuración de Temas (theme.ts)

```typescript
// ✅ PATRÓN: Variables CSS para temas dinámicos
export const DEFAULT_THEME = {
  colors: {
    primary: {
      50: '#f0f9ff',
      500: '#3b82f6',
      900: '#1e3a8a',
    },
    background: {
      primary: 'rgba(15, 23, 42, 0.95)',
      secondary: 'rgba(30, 41, 59, 0.8)',
    }
  },
  
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
  },
  
  breakpoints: {
    mobile: '768px',
    tablet: '1024px',
    desktop: '1200px',
  }
};
```

---

## 🛣️ ROUTING Y NAVEGACIÓN

### Estructura de Routing

```
src/routes/
├── 🏠 AppRoutes.tsx      # Router principal
├── 🔐 AuthRoutes.tsx     # Rutas de autenticación
├── 🛡️ ProtectedRoute.tsx # Componente de protección
└── 📄 index.ts           # Exportaciones
```

### Patrón de Rutas Protegidas

```typescript
// ✅ EJEMPLO: ProtectedRoute.tsx
export const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ 
  children 
}) => {
  const { isAuthenticated, isInitialized } = useAuth();
  
  // Mostrar loading mientras se inicializa
  if (!isInitialized) {
    return <LoadingSpinner />;
  }
  
  // Redirigir a login si no está autenticado
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  // Renderizar contenido protegido
  return <>{children}</>;
};
```

### Router Principal (AppRoutes.tsx)

```typescript
export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Rutas públicas */}
      <Route path="/auth/*" element={<AuthRoutes />} />
      
      {/* Rutas protegidas */}
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        } 
      />
      
      {/* Ruta por defecto */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};
```

---

## 🎨 ESTILOS Y TEMAS

### Organización de Estilos

```
src/styles/
├── 🎨 theme.css          # Variables CSS del tema
├── 🎭 animations.css     # Animaciones reutilizables
├── ♿ accessibility.css  # Estilos de accesibilidad
├── 📝 auth-forms.css     # Estilos específicos de formularios
└── 🌐 globals.css        # Estilos globales
```

### Sistema de Variables CSS

```css
/* ✅ theme.css - Variables para temas dinámicos */
:root {
  /* Colores principales */
  --color-primary-50: #f0f9ff;
  --color-primary-500: #3b82f6;
  --color-primary-900: #1e3a8a;
  
  /* Backgrounds con glassmorphism */
  --bg-primary: rgba(15, 23, 42, 0.95);
  --bg-secondary: rgba(30, 41, 59, 0.8);
  --bg-glass: rgba(255, 255, 255, 0.1);
  
  /* Espaciado consistente */
  --spacing-xs: 0.25rem;
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 1.5rem;
  
  /* Breakpoints responsive */
  --breakpoint-mobile: 768px;
  --breakpoint-tablet: 1024px;
  --breakpoint-desktop: 1200px;
  
  /* Efectos glassmorphism */
  --glass-blur: blur(16px);
  --glass-border: 1px solid rgba(255, 255, 255, 0.2);
  --glass-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}
```

### Clases Utilitarias

```css
/* ✅ Clases reutilizables */
.glass-effect {
  background: var(--bg-glass);
  backdrop-filter: var(--glass-blur);
  border: var(--glass-border);
  box-shadow: var(--glass-shadow);
}

.responsive-padding {
  padding: var(--spacing-md);
}

@media (min-width: 768px) {
  .responsive-padding {
    padding: var(--spacing-lg);
  }
}

@media (min-width: 1024px) {
  .responsive-padding {
    padding: var(--spacing-xl);
  }
}
```---

##
 📏 PATRONES Y CONVENCIONES

### Naming Conventions (Nombres)

#### Archivos y Carpetas
```
✅ CORRECTO:
- LoginForm.tsx          (Componentes: PascalCase)
- useAuth.ts            (Hooks: camelCase con 'use')
- userService.ts        (Servicios: camelCase con 'Service')
- auth-forms.css        (CSS: kebab-case)
- admin-layout/         (Carpetas: kebab-case)

❌ INCORRECTO:
- loginform.tsx
- UseAuth.ts
- UserService.ts
- authForms.css
```

#### Variables y Funciones
```typescript
✅ CORRECTO:
const userName = 'Juan';              // camelCase
const API_BASE_URL = 'https://...';   // UPPER_CASE para constantes
const handleSubmit = () => {};        // camelCase para funciones

❌ INCORRECTO:
const user_name = 'Juan';
const apiBaseUrl = 'https://...';     // Constantes deben ser UPPER_CASE
const HandleSubmit = () => {};
```

#### Interfaces y Tipos
```typescript
✅ CORRECTO:
interface UserProfile {}             // PascalCase
type AuthFormType = 'login' | 'register';
enum UserRole { ADMIN = 'admin' }    // PascalCase, valores UPPER_CASE

❌ INCORRECTO:
interface userProfile {}
type authFormType = 'login' | 'register';
enum userRole { admin = 'admin' }
```

### Import/Export Patterns

#### Imports Organizados
```typescript
// ✅ ORDEN CORRECTO:
// 1. Librerías externas
import React from 'react';
import { useNavigate } from 'react-router-dom';

// 2. Imports internos (absolutos)
import { Button } from '../../../components/ui/Button';
import { useAuth } from '../../../core/hooks/useAuth';

// 3. Imports relativos (mismo feature)
import { useLoginForm } from '../hooks';
import { LoginCredentials } from '../types';

// 4. Imports de tipos (al final)
import type { FC } from 'react';
```

#### Exports Centralizados
```typescript
// ✅ PATRÓN: index.ts en cada carpeta
// src/features/auth/components/index.ts
export { LoginForm } from './LoginForm';
export { RegisterForm } from './RegisterForm';
export { AuthLayout } from './AuthLayout';

// src/features/auth/index.ts
export * from './components';
export * from './hooks';
export * from './pages';
export * from './types';
```

### Error Handling Patterns

#### Patrón Result<T>
```typescript
// ✅ PATRÓN: Resultado consistente
interface Result<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// Uso en servicios
async createUser(userData: UserData): Promise<Result<User>> {
  try {
    const user = await api.createUser(userData);
    return { success: true, data: user };
  } catch (error) {
    return { success: false, error: error.message };
  }
}
```

#### Try-Catch con Logging
```typescript
// ✅ PATRÓN: Logging consistente
try {
  const result = await someOperation();
  console.log(`✅ ${operationName} successful:`, result);
  return result;
} catch (error) {
  console.error(`❌ Error in ${operationName}:`, error);
  throw error;
}
```

### Component Patterns

#### Props Interface
```typescript
// ✅ PATRÓN: Interface clara y extensible
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  children: React.ReactNode;
}

export const Button: FC<ButtonProps> = ({ 
  variant = 'primary', 
  children, 
  ...props 
}) => {
  // Implementación...
};
```

#### Conditional Rendering
```typescript
// ✅ PATRÓN: Renderizado condicional claro
return (
  <div>
    {isLoading && <LoadingSpinner />}
    {error && <ErrorMessage error={error} />}
    {data && <DataDisplay data={data} />}
  </div>
);
```

### Hook Patterns

#### Custom Hook Structure
```typescript
// ✅ PATRÓN: Hook bien estructurado
export const useFeature = (initialValue?: string) => {
  // 1. Estado local
  const [value, setValue] = useState(initialValue || '');
  
  // 2. Estado global (si necesario)
  const globalState = useAppSelector(selectSomething);
  
  // 3. Funciones memoizadas
  const handleAction = useCallback(() => {
    // Lógica...
  }, [dependency]);
  
  // 4. Efectos
  useEffect(() => {
    // Efectos secundarios...
  }, [value]);
  
  // 5. API limpia
  return {
    // Estado
    value,
    isLoading: globalState.loading,
    
    // Funciones
    setValue,
    handleAction,
    
    // Datos computados
    displayValue: value.toUpperCase(),
  };
};
```

---

## 🚀 GUÍAS DE DESARROLLO

### Cómo Agregar una Nueva Feature

#### 1. Crear la Estructura
```bash
mkdir -p src/features/mi-feature/{components,hooks,pages,types,utils}
touch src/features/mi-feature/{components,hooks,pages,types,utils}/index.ts
touch src/features/mi-feature/index.ts
```

#### 2. Definir Tipos
```typescript
// src/features/mi-feature/types/index.ts
export interface MiFeatureData {
  id: string;
  name: string;
  // ...más campos
}

export interface CreateMiFeatureData {
  name: string;
  // ...campos para crear
}
```

#### 3. Crear Servicio (si necesario)
```typescript
// src/core/services/miFeatureService.ts
class MiFeatureService {
  private COLLECTION = 'mi-feature';
  
  async create(data: CreateMiFeatureData) {
    return firestoreService.createDocument(this.COLLECTION, data);
  }
  
  async getById(id: string) {
    return firestoreService.getDocument(this.COLLECTION, id);
  }
}

export const miFeatureService = new MiFeatureService();
```

#### 4. Crear Hook Principal
```typescript
// src/features/mi-feature/hooks/useMiFeature.ts
export const useMiFeature = () => {
  const [data, setData] = useState<MiFeatureData[]>([]);
  const [loading, setLoading] = useState(false);
  
  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const result = await miFeatureService.getAll();
      if (result.success) {
        setData(result.data);
      }
    } finally {
      setLoading(false);
    }
  }, []);
  
  return { data, loading, loadData };
};
```

#### 5. Crear Componentes
```typescript
// src/features/mi-feature/components/MiFeatureList.tsx
export const MiFeatureList: FC = () => {
  const { data, loading, loadData } = useMiFeature();
  
  useEffect(() => {
    loadData();
  }, [loadData]);
  
  if (loading) return <LoadingSpinner />;
  
  return (
    <div>
      {data.map(item => (
        <div key={item.id}>{item.name}</div>
      ))}
    </div>
  );
};
```

#### 6. Crear Página
```typescript
// src/features/mi-feature/pages/MiFeaturePage.tsx
export const MiFeaturePage: FC = () => {
  return (
    <div>
      <h1>Mi Feature</h1>
      <MiFeatureList />
    </div>
  );
};
```

#### 7. Agregar Ruta
```typescript
// src/routes/AppRoutes.tsx
<Route 
  path="/mi-feature" 
  element={
    <ProtectedRoute>
      <MiFeaturePage />
    </ProtectedRoute>
  } 
/>
```

### Cómo Agregar un Nuevo Componente UI

#### 1. Crear el Archivo
```typescript
// src/components/ui/MiComponente.tsx
interface MiComponenteProps {
  variant?: 'default' | 'special';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export const MiComponente: FC<MiComponenteProps> = ({
  variant = 'default',
  size = 'md',
  children,
  ...props
}) => {
  const baseStyles = 'base-class';
  const variantStyles = {
    default: 'default-styles',
    special: 'special-styles',
  };
  
  return (
    <div 
      className={cn(baseStyles, variantStyles[variant])}
      {...props}
    >
      {children}
    </div>
  );
};
```

#### 2. Exportar en Index
```typescript
// src/components/ui/index.ts
export { MiComponente } from './MiComponente';
```

#### 3. Usar en Componentes
```typescript
import { MiComponente } from '../../../components/ui';

// En el JSX
<MiComponente variant="special" size="lg">
  Contenido
</MiComponente>
```-
--

## 💡 EJEMPLOS PRÁCTICOS

### Ejemplo Completo: Feature de Productos

#### 1. Estructura de Archivos
```
src/features/products/
├── components/
│   ├── ProductCard.tsx
│   ├── ProductList.tsx
│   ├── ProductForm.tsx
│   └── index.ts
├── hooks/
│   ├── useProducts.ts
│   ├── useProductForm.ts
│   └── index.ts
├── pages/
│   ├── ProductsPage.tsx
│   ├── ProductDetailPage.tsx
│   └── index.ts
├── types/
│   └── index.ts
├── utils/
│   ├── validation.ts
│   └── index.ts
└── index.ts
```

#### 2. Tipos del Dominio
```typescript
// src/features/products/types/index.ts
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: ProductCategory;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateProductData {
  name: string;
  description: string;
  price: number;
  category: ProductCategory;
}

export interface UpdateProductData {
  name?: string;
  description?: string;
  price?: number;
  category?: ProductCategory;
  isActive?: boolean;
}

export enum ProductCategory {
  ELECTRONICS = 'electronics',
  CLOTHING = 'clothing',
  BOOKS = 'books',
  HOME = 'home'
}

export interface ProductFilters {
  category?: ProductCategory;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
}
```

#### 3. Servicio de Datos
```typescript
// src/core/services/productService.ts
import { firestoreService } from './firestoreService';
import { Product, CreateProductData, UpdateProductData, ProductFilters } from '../../features/products/types';

class ProductService {
  private COLLECTION = 'products';

  async createProduct(data: CreateProductData): Promise<FirestoreResult<Product>> {
    return firestoreService.createDocument(this.COLLECTION, {
      ...data,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    });
  }

  async getProduct(id: string): Promise<FirestoreResult<Product>> {
    return firestoreService.getDocument(this.COLLECTION, id);
  }

  async updateProduct(id: string, data: UpdateProductData): Promise<FirestoreResult<Product>> {
    return firestoreService.updateDocument(this.COLLECTION, id, {
      ...data,
      updatedAt: new Date()
    });
  }

  async deleteProduct(id: string): Promise<FirestoreResult<null>> {
    return firestoreService.deleteDocument(this.COLLECTION, id);
  }

  async getProducts(filters?: ProductFilters): Promise<FirestoreResult<Product[]>> {
    const queryFilters = [];
    
    if (filters?.category) {
      queryFilters.push({ field: 'category', operator: '==', value: filters.category });
    }
    
    if (filters?.minPrice) {
      queryFilters.push({ field: 'price', operator: '>=', value: filters.minPrice });
    }
    
    return firestoreService.queryDocuments(this.COLLECTION, queryFilters);
  }
}

export const productService = new ProductService();
```

#### 4. Hook Principal
```typescript
// src/features/products/hooks/useProducts.ts
import { useState, useCallback, useEffect } from 'react';
import { productService } from '../../../core/services';
import { Product, ProductFilters } from '../types';

export const useProducts = (initialFilters?: ProductFilters) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<ProductFilters>(initialFilters || {});

  const loadProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await productService.getProducts(filters);
      
      if (result.success) {
        setProducts(result.data || []);
      } else {
        setError(result.error || 'Error loading products');
      }
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const createProduct = useCallback(async (data: CreateProductData) => {
    setLoading(true);
    
    try {
      const result = await productService.createProduct(data);
      
      if (result.success) {
        // Recargar productos después de crear
        await loadProducts();
        return result;
      } else {
        setError(result.error || 'Error creating product');
        return result;
      }
    } catch (err) {
      const error = (err as Error).message;
      setError(error);
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  }, [loadProducts]);

  const updateProduct = useCallback(async (id: string, data: UpdateProductData) => {
    setLoading(true);
    
    try {
      const result = await productService.updateProduct(id, data);
      
      if (result.success) {
        // Actualizar producto en la lista local
        setProducts(prev => prev.map(p => p.id === id ? { ...p, ...data } : p));
        return result;
      } else {
        setError(result.error || 'Error updating product');
        return result;
      }
    } catch (err) {
      const error = (err as Error).message;
      setError(error);
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteProduct = useCallback(async (id: string) => {
    setLoading(true);
    
    try {
      const result = await productService.deleteProduct(id);
      
      if (result.success) {
        // Remover producto de la lista local
        setProducts(prev => prev.filter(p => p.id !== id));
        return result;
      } else {
        setError(result.error || 'Error deleting product');
        return result;
      }
    } catch (err) {
      const error = (err as Error).message;
      setError(error);
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  }, []);

  // Cargar productos al montar o cambiar filtros
  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  return {
    // Estado
    products,
    loading,
    error,
    filters,
    
    // Funciones
    loadProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    setFilters,
    
    // Utilidades
    clearError: () => setError(null),
    hasProducts: products.length > 0,
  };
};
```

#### 5. Componente de Lista
```typescript
// src/features/products/components/ProductList.tsx
import React from 'react';
import { useProducts } from '../hooks';
import { ProductCard } from './ProductCard';
import { LoadingSpinner } from '../../../components/ui';

interface ProductListProps {
  filters?: ProductFilters;
  onProductSelect?: (product: Product) => void;
}

export const ProductList: React.FC<ProductListProps> = ({
  filters,
  onProductSelect
}) => {
  const { products, loading, error, hasProducts } = useProducts(filters);

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 text-white">
        <p>Error: {error}</p>
      </div>
    );
  }

  if (!hasProducts) {
    return (
      <div className="text-center py-8 text-gray-400">
        <p>No se encontraron productos</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map(product => (
        <ProductCard
          key={product.id}
          product={product}
          onClick={() => onProductSelect?.(product)}
        />
      ))}
    </div>
  );
};
```

#### 6. Página Principal
```typescript
// src/features/products/pages/ProductsPage.tsx
import React, { useState } from 'react';
import { ProductList } from '../components';
import { ProductFilters, Product } from '../types';
import { Button } from '../../../components/ui';

export const ProductsPage: React.FC = () => {
  const [filters, setFilters] = useState<ProductFilters>({});
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const handleFilterChange = (newFilters: ProductFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white">Productos</h1>
        <Button variant="primary">
          Agregar Producto
        </Button>
      </div>

      {/* Filtros */}
      <div className="bg-white/10 backdrop-blur-md rounded-xl p-6">
        <h2 className="text-xl font-semibold text-white mb-4">Filtros</h2>
        {/* Componentes de filtro aquí */}
      </div>

      {/* Lista de productos */}
      <ProductList 
        filters={filters}
        onProductSelect={setSelectedProduct}
      />

      {/* Modal de producto seleccionado */}
      {selectedProduct && (
        <div>
          {/* Modal component aquí */}
        </div>
      )}
    </div>
  );
};
```

---

## 🎯 CHECKLIST DE DESARROLLO

### Antes de Crear un Nuevo Feature

- [ ] ¿El feature tiene una responsabilidad clara y única?
- [ ] ¿He definido los tipos del dominio?
- [ ] ¿Necesito un servicio específico o puedo usar servicios existentes?
- [ ] ¿He pensado en los estados de loading/error/success?
- [ ] ¿El feature es accesible (ARIA, keyboard navigation)?
- [ ] ¿Es responsive (mobile, tablet, desktop)?

### Antes de Crear un Componente

- [ ] ¿Es reutilizable o específico de un feature?
- [ ] ¿He definido una interface clara para las props?
- [ ] ¿Maneja estados de loading y error?
- [ ] ¿Es accesible (ARIA labels, semantic HTML)?
- [ ] ¿Funciona en mobile, tablet y desktop?
- [ ] ¿Sigue las convenciones de naming?

### Antes de Crear un Hook

- [ ] ¿Encapsula lógica reutilizable?
- [ ] ¿Tiene una API limpia y clara?
- [ ] ¿Maneja cleanup en useEffect?
- [ ] ¿Usa useCallback/useMemo para optimización?
- [ ] ¿Retorna un objeto con nombres descriptivos?

### Antes de Hacer Deploy

- [ ] ¿Todos los tests pasan?
- [ ] ¿No hay errores de TypeScript?
- [ ] ¿No hay warnings de accesibilidad?
- [ ] ¿Funciona en mobile, tablet y desktop?
- [ ] ¿Los textos están en el sistema de configuración?
- [ ] ¿Las rutas están protegidas correctamente?

---

## 🚨 ERRORES COMUNES Y CÓMO EVITARLOS

### 1. Mezclar Responsabilidades
```typescript
❌ INCORRECTO:
const LoginForm = () => {
  // ❌ Lógica de API en el componente
  const [user, setUser] = useState(null);
  const handleLogin = async () => {
    const response = await fetch('/api/login');
    // ...lógica compleja
  };
};

✅ CORRECTO:
const LoginForm = () => {
  // ✅ Delegar lógica al hook
  const { login, isLoading } = useAuth();
  const handleLogin = () => login(credentials);
};
```

### 2. No Usar Tipos
```typescript
❌ INCORRECTO:
const createUser = (data: any) => {
  // ❌ Tipo 'any' no es seguro
};

✅ CORRECTO:
const createUser = (data: CreateUserData): Promise<Result<User>> => {
  // ✅ Tipos específicos y claros
};
```

### 3. No Manejar Estados de Loading/Error
```typescript
❌ INCORRECTO:
const MyComponent = () => {
  const [data, setData] = useState([]);
  // ❌ No maneja loading ni errores
  
  useEffect(() => {
    fetchData().then(setData);
  }, []);
};

✅ CORRECTO:
const MyComponent = () => {
  const { data, loading, error } = useMyData();
  
  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;
  return <DataDisplay data={data} />;
};
```

---

## 📚 RECURSOS ADICIONALES

### Documentación Oficial
- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Redux Toolkit](https://redux-toolkit.js.org/)
- [Firebase Documentation](https://firebase.google.com/docs)

### Herramientas de Desarrollo
- **ESLint + Prettier:** Formateo y linting automático
- **TypeScript:** Type checking en tiempo de desarrollo
- **React DevTools:** Debugging de componentes React
- **Redux DevTools:** Debugging del estado global

### Comandos Útiles
```bash
# Instalar dependencias
npm install

# Desarrollo
npm run dev

# Build para producción
npm run build

# Linting
npm run lint

# Type checking
npm run type-check

# Tests
npm run test
```

---

## 🎉 CONCLUSIÓN

Esta guía arquitectónica te proporciona todo lo necesario para desarrollar en LexBot Admin de manera consistente y profesional. Recuerda:

1. **🏛️ Sigue la arquitectura por features** - Cada funcionalidad es autónoma
2. **⚔️ Mantén responsabilidades únicas** - Un archivo, una responsabilidad
3. **🔥 Usa TypeScript estrictamente** - Los tipos son tu mejor amigo
4. **🛡️ Prioriza la accesibilidad** - Todos deben poder usar la app
5. **📱 Diseña mobile-first** - La mayoría de usuarios están en móvil

**¡Ahora tienes todo lo necesario para ser un espartano del código en LexBot Admin!** ⚔️🏛️

---

*Documento creado con ❤️ por el equipo de desarrollo de LexBot Admin*
*Última actualización: Diciembre 2024*
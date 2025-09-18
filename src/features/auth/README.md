# Módulo de Autenticación

Este módulo contiene toda la funcionalidad relacionada con la autenticación de usuarios en la aplicación LexBot Admin.

## Estructura

```
auth/
├── components/     # Componentes de UI específicos de autenticación
├── hooks/          # Hooks personalizados para autenticación
├── pages/          # Páginas completas de autenticación
├── types/          # Tipos específicos de autenticación
├── utils/          # Utilidades y validaciones específicas
└── README.md       # Esta documentación
```

## Tipos

Los tipos específicos de autenticación se encuentran en `types/index.ts`:

- `LoginCredentials`: Credenciales para inicio de sesión
- `RegisterData`: Datos para registro de usuario
- `PasswordResetData`: Datos para recuperación de contraseña
- `NewPasswordData`: Datos para nueva contraseña
- `User`: Extensión del tipo User de Firebase
- `AuthFormType`: Tipos de formularios de autenticación

## Validaciones

Las validaciones específicas de autenticación se encuentran en `utils/validation.ts`:

- `validateLoginForm`: Validación de formulario de login
- `validateRegisterForm`: Validación de formulario de registro
- `validatePasswordResetForm`: Validación de formulario de recuperación de contraseña
- `validateNewPasswordForm`: Validación de formulario de nueva contraseña

## Hooks

Los hooks personalizados para autenticación se encuentran en `hooks/`:

- `useAuth`: Hook principal para manejo de autenticación
- `useAuthForm`: Hook especializado para formularios de autenticación
- `useLoginForm`: Hook específico para formulario de login
- `useRegisterForm`: Hook específico para formulario de registro
- `useForgotPasswordForm`: Hook específico para formulario de recuperación de contraseña
- `useResetPasswordForm`: Hook específico para formulario de nueva contraseña

## Componentes

Los componentes de UI específicos de autenticación se encuentran en `components/`:

- `LoginForm`: Formulario de inicio de sesión
- `RegisterForm`: Formulario de registro
- `ForgotPasswordForm`: Formulario de recuperación de contraseña
- `ResetPasswordForm`: Formulario de nueva contraseña

## Páginas

Las páginas completas de autenticación se encuentran en `pages/`:

- `LoginPage`: Página de inicio de sesión
- `RegisterPage`: Página de registro
- `ForgotPasswordPage`: Página de recuperación de contraseña
- `ResetPasswordPage`: Página de nueva contraseña

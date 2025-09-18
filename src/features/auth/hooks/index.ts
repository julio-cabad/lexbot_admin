// Export all auth hooks
export { useAuth } from './useAuth';
export { 
  useAuthForm, 
  useLoginForm, 
  useRegisterForm, 
  useForgotPasswordForm, 
  useResetPasswordForm 
} from './useAuthForm';
export { usePasswordStrength } from './usePasswordStrength';
export { useSession } from './useSession';
export { useLoginFormLogic } from './useLoginFormLogic';
export { 
  useAuthRedirect, 
  usePublicPageRedirect, 
  usePostLoginRedirect, 
  useProtectedPageRedirect,
  useSmartAuthRedirect 
} from './useAuthRedirect';

// 👑 NUEVOS HOOKS DE PERFIL DE USUARIO
export { 
  useUserProfile, 
  useProfileCompletion 
} from './useUserProfile';
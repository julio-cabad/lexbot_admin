/**
 * Simple post-login redirect hook
 * Handles redirection AFTER successful login based on profile completion
 */

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './useAuth';
import { useToast } from '../../../hooks';
import { PATHS } from '../../../config/routes';

/**
 * Hook that handles redirection after successful login
 * Only runs when login is successful and profile data is loaded
 */
export const usePostLoginRedirect = () => {
  const navigate = useNavigate();
  const { 
    loginSuccess, 
    isAuthenticated, 
    userProfile, 
    isProfileLoading,
    userFullName,
    clearLoginSuccess 
  } = useAuth();
  const { showSuccess } = useToast();

  useEffect(() => {
    // Only redirect after successful login
    if (!loginSuccess || !isAuthenticated) return;

    // Wait for profile to load
    if (isProfileLoading || !userProfile) return;

    // Clear the login success state to prevent multiple redirections
    clearLoginSuccess();

    // Show welcome message
    const welcomeName = userFullName || userProfile.email || 'Usuario';
    showSuccess(`¡Bienvenido, ${welcomeName}!`, { autoClose: 3000 });

    // Redirect based on profile completion
    if (userProfile.isComplete) {
      navigate(PATHS.private.dashboard, { replace: true });
    } else {
      navigate('/complete-profile', { 
        replace: true,
        state: { 
          message: 'Completa tu perfil para acceder a todas las funciones.',
          isNewUser: true 
        }
      });
    }
  }, [
    loginSuccess, 
    isAuthenticated, 
    userProfile, 
    isProfileLoading, 
    userFullName,
    navigate, 
    showSuccess, 
    clearLoginSuccess
  ]);

  return {
    isRedirecting: loginSuccess && isAuthenticated && !isProfileLoading && !!userProfile
  };
};
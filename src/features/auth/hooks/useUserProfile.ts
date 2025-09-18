/**
 * 👑 HOOK PARA GESTIÓN DE PERFIL DE USUARIO
 * El comandante supremo de los datos del guerrero
 *
 * @author El Emperador del Código
 */

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "./useAuth";
import { userService } from "../../../core/services";
import {
  UserProfile,
  UpdateUserProfileData,
  CompleteProfileData,
  FirestoreResult,
} from "../types";

/**
 * 🏛️ HOOK PARA MANEJO COMPLETO DEL PERFIL DE USUARIO
 * Proporciona todas las operaciones necesarias para el perfil
 */
export const useUserProfile = () => {
  const { user, isAuthenticated } = useAuth();

  // Estados del perfil
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isProfileComplete, setIsProfileComplete] = useState(false);

  /**
   * ⚔️ CARGAR PERFIL DEL USUARIO
   */
  const loadProfile = useCallback(async () => {
    if (!user?.uid || !isAuthenticated) {
      setProfile(null);
      setIsProfileComplete(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await userService.getUserProfile(user.uid);

      if (result.success && result.data) {
        setProfile(result.data);
        setIsProfileComplete(result.data.isComplete);
      } else {
        setError(result.error || "Error cargando perfil");
        setProfile(null);
        setIsProfileComplete(false);
      }
    } catch (err) {
      setError((err as Error).message);
      setProfile(null);
      setIsProfileComplete(false);
    } finally {
      setIsLoading(false);
    }
  }, [user?.uid, isAuthenticated]);

  /**
   * ⚡ ACTUALIZAR PERFIL
   */
  const updateProfile = useCallback(
    async (
      updates: UpdateUserProfileData
    ): Promise<FirestoreResult<UserProfile>> => {
      if (!user?.uid) {
        return {
          success: false,
          error: "Usuario no autenticado",
        };
      }

      setIsLoading(true);
      setError(null);

      try {
        const result = await userService.updateUserProfile(user.uid, updates);

        if (result.success && result.data) {
          setProfile(result.data);
          setIsProfileComplete(result.data.isComplete);
        } else {
          setError(result.error || "Error actualizando perfil");
        }

        return result;
      } catch (err) {
        const errorMessage = (err as Error).message;
        setError(errorMessage);
        return {
          success: false,
          error: errorMessage,
        };
      } finally {
        setIsLoading(false);
      }
    },
    [user?.uid]
  );

  /**
   * 🏆 COMPLETAR PERFIL
   */
  const completeProfile = useCallback(
    async (
      profileData: CompleteProfileData
    ): Promise<FirestoreResult<UserProfile>> => {
      if (!user?.uid) {
        return {
          success: false,
          error: "Usuario no autenticado",
        };
      }

      setIsLoading(true);
      setError(null);

      try {
        const result = await userService.completeUserProfile(
          user.uid,
          profileData
        );

        if (result.success && result.data) {
          setProfile(result.data);
          setIsProfileComplete(true);
        } else {
          setError(result.error || "Error completando perfil");
        }

        return result;
      } catch (err) {
        const errorMessage = (err as Error).message;
        setError(errorMessage);
        return {
          success: false,
          error: errorMessage,
        };
      } finally {
        setIsLoading(false);
      }
    },
    [user?.uid]
  );

  /**
   * 🔄 REFRESCAR PERFIL
   */
  const refreshProfile = useCallback(() => {
    loadProfile();
  }, [loadProfile]);

  /**
   * 🧹 LIMPIAR ERROR
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Cargar perfil cuando el usuario cambie
  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  // Suscripción en tiempo real al perfil (opcional)
  useEffect(() => {
    if (!user?.uid || !isAuthenticated) return;

    const unsubscribe = userService.subscribeToUserProfile(
      user.uid,
      (updatedProfile, subscriptionError) => {
        if (subscriptionError) {
          setError(subscriptionError);
        } else if (updatedProfile) {
          setProfile(updatedProfile);
          setIsProfileComplete(updatedProfile.isComplete);
        }
      }
    );

    return unsubscribe;
  }, [user?.uid, isAuthenticated]);

  // Datos computados
  const fullName = profile
    ? `${profile.firstName} ${profile.lastName}`.trim()
    : "";

  const initials = profile
    ? `${profile.firstName.charAt(0)}${profile.lastName.charAt(0)}`.toUpperCase()
    : "";

  return {
    // 📊 Estado del perfil
    profile,
    isLoading,
    error,
    isProfileComplete,

    // 📈 Datos computados
    fullName,
    initials,
    hasProfile: !!profile,

    // 🔧 Funciones de gestión
    loadProfile,
    updateProfile,
    completeProfile,
    refreshProfile,
    clearError,

    // 🎯 Utilidades
    isProfileLoaded: !isLoading && !!profile,
    needsCompletion: !isLoading && profile && !profile.isComplete,
  };
};

/**
 * 🎯 HOOK SIMPLIFICADO PARA VERIFICAR COMPLETITUD
 * Para casos donde solo necesitas saber si el perfil está completo
 */
export const useProfileCompletion = () => {
  const { user, isAuthenticated } = useAuth();
  const [isComplete, setIsComplete] = useState<boolean | null>(null);
  const [isChecking, setIsChecking] = useState(false);

  const checkCompletion = useCallback(async () => {
    if (!user?.uid || !isAuthenticated) {
      setIsComplete(null);
      return;
    }

    setIsChecking(true);

    try {
      const complete = await userService.isProfileComplete(user.uid);
      setIsComplete(complete);
    } catch (error) {
      console.error("Error verificando completitud del perfil:", error);
      setIsComplete(false);
    } finally {
      setIsChecking(false);
    }
  }, [user?.uid, isAuthenticated]);

  useEffect(() => {
    checkCompletion();
  }, [checkCompletion]);

  return {
    isComplete,
    isChecking,
    checkCompletion,
    needsCompletion: isComplete === false,
  };
};

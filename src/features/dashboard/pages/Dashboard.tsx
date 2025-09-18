import React, { useState } from "react";
import { Button } from "../../../components/ui/Button";
import { AuthFlowDemo } from "../../auth/components/AuthFlowDemo";
import { useTexts } from "../../../core/hooks/useTexts";
import { useAuth, useProtectedPageRedirect, useUserProfile } from "../../auth";

/**
 * 🏛️ DASHBOARD ÉPICO CON PERFIL DE USUARIO
 * Página principal del reino para guerreros autenticados
 */
export const Dashboard: React.FC = () => {
  const { user, logout, userDisplayName } = useAuth();
  const { profile, fullName, isLoading: profileLoading } = useUserProfile();
  
  // Hook para proteger la página - redirige a login si no está autenticado
  useProtectedPageRedirect();
  const { dashboard, withUserName } = useTexts();
  const [showDemo, setShowDemo] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 shadow-2xl border border-white/10">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-4">
              {dashboard.title}
            </h1>
            <p className="text-gray-300 text-lg">
              {withUserName('dashboard.welcome', fullName || userDisplayName)}
            </p>
            <p className="text-gray-400 text-sm mt-2">Email: {user?.email}</p>
            {profile && (
              <div className="text-gray-400 text-xs mt-1">
                <span>Role: {profile.role}</span>
                {profile.city && <span> • City: {profile.city}</span>}
                {profile.phone && <span> • Phone: {profile.phone}</span>}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white/5 backdrop-blur rounded-xl p-6 border border-white/10">
              <h3 className="text-xl font-semibold text-cyan-400 mb-2">
                {dashboard.statistics}
              </h3>
              <p className="text-gray-300 text-sm">
                {dashboard.summary}
              </p>
            </div>

            <div className="bg-white/5 backdrop-blur rounded-xl p-6 border border-white/10">
              <h3 className="text-xl font-semibold text-purple-400 mb-2">
                {dashboard.recentActivity}
              </h3>
              <p className="text-gray-300 text-sm">
                {dashboard.noActivity}
              </p>
            </div>

            <div className="bg-white/5 backdrop-blur rounded-xl p-6 border border-white/10">
              <h3 className="text-xl font-semibold text-pink-400 mb-2">
                {dashboard.quickActions}
              </h3>
              <p className="text-gray-300 text-sm">
                {dashboard.notifications}
              </p>
            </div>
          </div>

          <div className="text-center space-y-4">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                variant="primary"
                size="lg"
                onClick={() => setShowDemo(!showDemo)}
              >
                {showDemo ? "Ocultar Demo" : dashboard.viewAll}
              </Button>
              <Button variant="secondary" size="lg" onClick={logout}>
                {dashboard.logout}
              </Button>
            </div>
          </div>
        </div>

        {/* Demo de flujos de autenticación */}
        {showDemo && (
          <div className="mt-8">
            <AuthFlowDemo />
          </div>
        )}
      </div>
    </div>
  );
};

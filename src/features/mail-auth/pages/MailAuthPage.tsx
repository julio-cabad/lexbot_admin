/**
 * 📧 MAIL AUTH PAGE
 * Página simple para autorización de correo electrónico
 */

import React, { useEffect, useState } from 'react';
import { useAdminLayoutManager } from '../../admin/hooks/useAdminLayoutManager';
import { MailAuthForm } from '../components';
import type { Breadcrumb } from '../../admin/types';

/**
 * 📧 MAIL AUTH PAGE COMPONENT
 */
export const MailAuthPage: React.FC = () => {
  const { actions, responsive } = useAdminLayoutManager();
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  /**
   * 🍞 Setup breadcrumbs
   */
  useEffect(() => {
    const breadcrumbs: Breadcrumb[] = [
      {
        label: "Dashboard",
        route: "/admin/dashboard",
        isActive: false,
      },
      {
        label: "Autorizar Correo",
        route: "/admin/mail-auth",
        isActive: true,
      },
    ];

    actions.setBreadcrumbs(breadcrumbs);
    actions.setActiveRoute("/admin/mail-auth");
  }, []); // Sin dependencias para evitar loops

  /**
   * ✅ Manejar éxito
   */
  const handleSuccess = (email: string, action: 'authorize' | 'revoke') => {
    const message = action === 'authorize' 
      ? `Correo ${email} autorizado exitosamente`
      : `Autorización revocada para ${email}`;
    
    setToast({ message, type: 'success' });
    
    // Auto-hide toast
    setTimeout(() => setToast(null), 5000);
  };

  /**
   * ❌ Manejar error
   */
  const handleError = (error: string) => {
    setToast({ message: error, type: 'error' });
    
    // Auto-hide toast
    setTimeout(() => setToast(null), 5000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-transparent py-8">
      <div className="w-full max-w-md bg-white/10 dark:bg-slate-900/80 shadow-2xl rounded-2xl border border-white/20 p-8 flex flex-col items-center">
        <div className="flex flex-col items-center mb-6">
          <span className="text-4xl mb-2">📧</span>
          <h1 className="text-2xl font-bold text-white mb-1 text-center">Autorizar Correo Electrónico</h1>
          <p className="text-base text-slate-300 text-center">Autoriza tu cuenta de Gmail para enviar correos desde la aplicación</p>
        </div>
        <div className="w-full">
          <MailAuthForm onSuccess={handleSuccess} onError={handleError} />
        </div>
        <div className="mt-8 w-full">
          <div className="bg-white/5 rounded-lg p-4 text-slate-200 text-sm shadow-inner">
            <h3 className="font-semibold text-slate-100 mb-2">¿Cómo funciona?</h3>
            <ul className="space-y-1">
              <li className="flex items-center gap-2"><span>🔐</span> Ingresa tu correo de Gmail</li>
              <li className="flex items-center gap-2"><span>🔗</span> Autoriza con Google OAuth</li>
              <li className="flex items-center gap-2"><span>📧</span> Envía correos desde la aplicación</li>
              <li className="flex items-center gap-2"><span>🚫</span> Revoca cuando quieras</li>
            </ul>
          </div>
        </div>
      </div>
      {toast && (
        <div className={`fixed top-8 right-8 z-50 min-w-[260px] max-w-xs flex items-center gap-3 px-4 py-3 rounded-lg shadow-xl border font-medium text-base transition-all ${toast.type === 'success' ? 'bg-green-900/90 border-green-600 text-green-200' : 'bg-red-900/90 border-red-600 text-red-200'}`}>
          <span className="text-xl">{toast.type === 'success' ? '✅' : '❌'}</span>
          <span className="flex-1">{toast.message}</span>
          <button className="text-xl px-2 py-1 rounded hover:bg-white/10" onClick={() => setToast(null)}>✕</button>
        </div>
      )}
    </div>
  );
};

export default MailAuthPage;
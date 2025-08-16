import React from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { cn } from '../../utils/classNames';
import 'react-toastify/dist/ReactToastify.css';

interface ToastProps {
  position?: 'top-right' | 'top-left' | 'top-center' | 'bottom-right' | 'bottom-left' | 'bottom-center';
  autoClose?: number;
  hideProgressBar?: boolean;
  newestOnTop?: boolean;
  closeOnClick?: boolean;
  rtl?: boolean;
  pauseOnFocusLoss?: boolean;
  draggable?: boolean;
  pauseOnHover?: boolean;
  theme?: 'light' | 'dark' | 'colored';
}

/**
 * Componente Toast Container con estilos personalizados
 */
export const Toast: React.FC<ToastProps> = ({
  position = 'top-right',
  autoClose = 5000,
  hideProgressBar = false,
  newestOnTop = false,
  closeOnClick = true,
  rtl = false,
  pauseOnFocusLoss = true,
  draggable = true,
  pauseOnHover = true,
  theme = 'dark',
}) => {
  return (
    <ToastContainer
      position={position}
      autoClose={autoClose}
      hideProgressBar={hideProgressBar}
      newestOnTop={newestOnTop}
      closeOnClick={closeOnClick}
      rtl={rtl}
      pauseOnFocusLoss={pauseOnFocusLoss}
      draggable={draggable}
      pauseOnHover={pauseOnHover}
      theme={theme}
      toastClassName={() =>
        cn(
          'relative flex p-1 min-h-10 rounded-md justify-between overflow-hidden cursor-pointer',
          'bg-white/10 backdrop-blur-md border border-white/20',
          'shadow-lg'
        )
      }
      bodyClassName={() => 'text-sm font-white font-med block p-3'}
      progressClassName="fancy-progress-bar"
    />
  );
};

/**
 * Componente personalizado para contenido de toast con icono
 */
interface ToastContentProps {
  title: string;
  message?: string;
  type: 'success' | 'error' | 'warning' | 'info';
}

export const ToastContent: React.FC<ToastContentProps> = ({
  title,
  message,
  type
}) => {
  const getIcon = () => {
    switch (type) {
      case 'success':
        return (
          <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        );
      case 'error':
        return (
          <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        );
      case 'warning':
        return (
          <svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        );
      case 'info':
      default:
        return (
          <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
    }
  };

  return (
    <div className="flex items-start space-x-3">
      <div className="flex-shrink-0 mt-0.5">
        {getIcon()}
      </div>
      <div className="flex-1">
        <div className="font-semibold text-white">{title}</div>
        {message && (
          <div className="text-sm text-gray-300 mt-1">{message}</div>
        )}
      </div>
    </div>
  );
};

/**
 * Funciones helper para mostrar toasts con estilos consistentes
 */
export const showToast = {
  success: (title: string, message?: string) => {
    toast.success(<ToastContent title={title} message={message} type="success" />);
  },
  error: (title: string, message?: string) => {
    toast.error(<ToastContent title={title} message={message} type="error" />);
  },
  warning: (title: string, message?: string) => {
    toast.warning(<ToastContent title={title} message={message} type="warning" />);
  },
  info: (title: string, message?: string) => {
    toast.info(<ToastContent title={title} message={message} type="info" />);
  },
};

export default Toast;
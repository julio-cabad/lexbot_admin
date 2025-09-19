/**
 * 🛡️ ADMIN LAYOUT ERROR BOUNDARY
 * Error boundary component for graceful error handling in admin layout
 * Provides fallback UI and error recovery mechanisms
 */

import  { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from '../../../../components/ui/Button';
// No necesitamos useTexts en un componente de clase
import { TEXTS } from '../../../../config/texts';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

/**
 * 🏛️ ADMIN LAYOUT ERROR BOUNDARY
 * Catches and handles errors in the admin layout components
 */
export class AdminLayoutErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  /**
   * 🎯 Static method to update state when error occurs
   */
  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  /**
   * 📊 Handle component error and log details
   */
  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({
      error,
      errorInfo,
    });

    // Log error for debugging
    console.error('Admin Layout Error:', error);
    console.error('Error Info:', errorInfo);

    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // In production, you might want to send this to an error reporting service
    if (process.env.NODE_ENV === 'production') {
      // Example: Sentry.captureException(error, { extra: errorInfo });
    }
  }

  /**
   * 🔄 Handle error recovery
   */
  handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  /**
   * 🏠 Navigate to dashboard
   */
  handleGoToDashboard = () => {
    window.location.href = '/dashboard';
  };

  /**
   * 🔄 Reload the page
   */
  handleReload = () => {
    window.location.reload();
  };

  /**
   * 🎨 Render error fallback UI
   */
  renderErrorFallback() {
    const { error, errorInfo } = this.state;

    return (
      <div className="admin-error-boundary">
        <div className="admin-error-boundary__container">
          <div className="admin-error-boundary__content">
            {/* Error Icon */}
            <div className="admin-error-boundary__icon">
              <svg
                width="64"
                height="64"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            </div>

            {/* Error Message */}
            <h1 className="admin-error-boundary__title">
              {TEXTS.admin.errorBoundary.title}
            </h1>
            
            <p className="admin-error-boundary__message">
              {TEXTS.admin.errorBoundary.description}
            </p>

            {/* Error Details (Development only) */}
            {process.env.NODE_ENV === 'development' && error && (
              <details className="admin-error-boundary__details">
                <summary>Error Details (Development)</summary>
                <div className="admin-error-boundary__error-info">
                  <h3>Error:</h3>
                  <pre>{error.toString()}</pre>
                  
                  {errorInfo && (
                    <>
                      <h3>Component Stack:</h3>
                      <pre>{errorInfo.componentStack}</pre>
                    </>
                  )}
                </div>
              </details>
            )}

            {/* Action Buttons */}
            <div className="admin-error-boundary__actions">
              <Button
                onClick={this.handleRetry}
                variant="primary"
                size="lg"
              >
                {TEXTS.admin.errorBoundary.retry}
              </Button>
              
              <Button
                onClick={this.handleGoToDashboard}
                variant="secondary"
                size="lg"
              >
                {TEXTS.admin.errorBoundary.goToDashboard}
              </Button>
              
              <Button
                onClick={this.handleReload}
                variant="ghost"
                size="lg"
              >
                {TEXTS.admin.errorBoundary.reload}
              </Button>
            </div>

            {/* Help Text */}
            <p className="admin-error-boundary__help">
              {TEXTS.admin.errorBoundary.helpText}
            </p>
          </div>
        </div>

        {/* Inline Styles for Error Boundary */}
        <style>{`
          .admin-error-boundary {
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            padding: 2rem;
          }

          .admin-error-boundary__container {
            max-width: 600px;
            width: 100%;
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(16px);
            border-radius: 16px;
            padding: 3rem;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
            text-align: center;
          }

          .admin-error-boundary__icon {
            color: #ef4444;
            margin-bottom: 1.5rem;
            display: flex;
            justify-content: center;
          }

          .admin-error-boundary__title {
            font-size: 2rem;
            font-weight: 700;
            color: #1f2937;
            margin-bottom: 1rem;
          }

          .admin-error-boundary__message {
            font-size: 1.125rem;
            color: #6b7280;
            margin-bottom: 2rem;
            line-height: 1.6;
          }

          .admin-error-boundary__details {
            text-align: left;
            margin-bottom: 2rem;
            background: #f9fafb;
            border-radius: 8px;
            padding: 1rem;
          }

          .admin-error-boundary__details summary {
            cursor: pointer;
            font-weight: 600;
            color: #374151;
            margin-bottom: 1rem;
          }

          .admin-error-boundary__error-info {
            font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
            font-size: 0.875rem;
          }

          .admin-error-boundary__error-info h3 {
            color: #374151;
            margin: 1rem 0 0.5rem 0;
            font-size: 1rem;
          }

          .admin-error-boundary__error-info pre {
            background: #1f2937;
            color: #f9fafb;
            padding: 1rem;
            border-radius: 6px;
            overflow-x: auto;
            white-space: pre-wrap;
            word-break: break-word;
          }

          .admin-error-boundary__actions {
            display: flex;
            gap: 1rem;
            justify-content: center;
            flex-wrap: wrap;
            margin-bottom: 2rem;
          }

          .admin-error-boundary__help {
            font-size: 0.875rem;
            color: #9ca3af;
            margin: 0;
          }

          @media (max-width: 640px) {
            .admin-error-boundary {
              padding: 1rem;
            }

            .admin-error-boundary__container {
              padding: 2rem;
            }

            .admin-error-boundary__title {
              font-size: 1.5rem;
            }

            .admin-error-boundary__actions {
              flex-direction: column;
            }
          }
        `}</style>
      </div>
    );
  }

  /**
   * 🎨 Render component
   */
  render() {
    if (this.state.hasError) {
      // Custom fallback UI if provided
      if (this.props.fallback) {
        return this.props.fallback;
      }
      
      // Default error fallback
      return this.renderErrorFallback();
    }

    return this.props.children;
  }
}

/**
 * 🎯 Default export
 */
export default AdminLayoutErrorBoundary;
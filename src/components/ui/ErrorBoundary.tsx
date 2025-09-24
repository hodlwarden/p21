/**
 * Error Boundary Component
 * Catches and handles React errors gracefully
 */

import React from 'react';
import { Button } from './Button';
import { Card } from './Card';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import type { AppError } from '../../types';
import { reportError } from '../../utils/errors';

interface ErrorFallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
}

const ErrorFallback: React.FC<ErrorFallbackProps> = ({ error, resetErrorBoundary }) => {
  // const appError: AppError = classifyError(error);

  // React.useEffect(() => {
  //   // Report the error
  //   reportError(appError, { component: 'ErrorBoundary' });
  // }, [appError]);

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <div className="p-6 text-center">
          <div className="mx-auto flex items-center justify-center w-12 h-12 rounded-full bg-red-100 mb-4">
            <AlertTriangle className="w-6 h-6 text-red-600" />
          </div>
          
          <h1 className="text-lg font-semibold text-gray-900 mb-2">
            Something went wrong
          </h1>
          
          <p className="text-sm text-gray-600 mb-6">
            {'An unexpected error occurred. Please try again.'}
          </p>
          
          {process.env.NODE_ENV === 'development' && (
            <details className="mb-6 text-left">
              <summary className="cursor-pointer text-sm font-medium text-gray-700 mb-2">
                Error Details (Development)
              </summary>
              <pre className="text-xs bg-gray-100 p-3 rounded-md overflow-auto max-h-32 text-gray-800">
                {error.stack}
              </pre>
            </details>
          )}
          
          <div className="flex gap-3 justify-center">
            <Button
              onClick={resetErrorBoundary}
              icon={<RefreshCw className="w-4 h-4" />}
              size="sm"
            >
              Try Again
            </Button>
            
            <Button
              onClick={() => window.location.href = '/'}
              variant="outline"
              icon={<Home className="w-4 h-4" />}
              size="sm"
            >
              Go Home
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<ErrorFallbackProps>;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
  onReset?: () => void;
}

export const ErrorBoundary: React.FC<ErrorBoundaryProps> = ({
  children,
  fallback: FallbackComponent = ErrorFallback,
  onError,
  onReset,
}) => {

  return (
    <div>
      {"Unexpected error"}
    </div>
  );
};

// HOC for wrapping components with error boundary
export const withErrorBoundary = <P extends object>(
  Component: React.ComponentType<P>,
  errorBoundaryProps?: Omit<ErrorBoundaryProps, 'children'>
) => {
  const WrappedComponent = (props: P) => (
    <ErrorBoundary {...errorBoundaryProps}>
      <Component {...props} />
    </ErrorBoundary>
  );

  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`;
  
  return WrappedComponent;
};

"use client";

import { Button } from "@/components/ui/button";
import React, { Component, ReactNode } from "react";
import { AlertCircle, RefreshCw } from "lucide-react";

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

/**
 * Error Boundary Component
 *
 * Catches JavaScript errors anywhere in the child component tree,
 * logs those errors, and displays a fallback UI.
 *
 * Usage:
 * ```tsx
 * <ErrorBoundary>
 *   <YourComponent />
 * </ErrorBoundary>
 * ```
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log error to console (in production, you'd send this to an error tracking service)
    console.error("Error Boundary caught an error:", error, errorInfo);

    this.setState({
      error,
      errorInfo,
    });

    // TODO: Send error to logging service (e.g., Sentry, LogRocket)
    // logErrorToService(error, errorInfo);
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default fallback UI
      return (
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="max-w-2xl w-full">
            <div className="relative">
              {/* Glow Effect */}
              <div className="absolute -inset-1 bg-linear-to-r from-red-500 to-orange-500 rounded-3xl blur opacity-20"></div>

              {/* Error Card */}
              <div className="relative bg-white dark:bg-zinc-900 rounded-3xl p-8 md:p-12 shadow-2xl border border-white/30 dark:border-zinc-700/50">
                {/* Icon */}
                <div className="flex justify-center mb-6">
                  <div className="relative">
                    <div className="absolute -inset-4 bg-red-500/20 rounded-full blur-2xl"></div>
                    <div className="relative bg-linear-to-br from-red-500 to-orange-500 rounded-full p-6 shadow-lg">
                      <AlertCircle size={48} className="text-white" />
                    </div>
                  </div>
                </div>

                {/* Title */}
                <h1 className="text-3xl font-black text-center mb-4 bg-linear-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
                  Oops! Something went wrong
                </h1>

                {/* Description */}
                <p className="text-center text-muted-foreground mb-8">
                  We apologize for the inconvenience. An unexpected error has occurred. Please try
                  refreshing the page or contact support if the problem persists.
                </p>

                {/* Error Details (only in development) */}
                {process.env.NODE_ENV === "development" && this.state.error && (
                  <details className="mb-8 p-4 bg-red-50 dark:bg-red-950/20 rounded-xl border border-red-200 dark:border-red-800">
                    <summary className="cursor-pointer font-semibold text-red-600 dark:text-red-400 mb-2">
                      Error Details (Development Only)
                    </summary>
                    <div className="space-y-2 text-sm">
                      <div>
                        <strong className="text-red-600 dark:text-red-400">Error:</strong>
                        <pre className="mt-1 p-2 bg-red-100 dark:bg-red-900/30 rounded overflow-x-auto text-xs">
                          {this.state.error.toString()}
                        </pre>
                      </div>
                      {this.state.errorInfo && (
                        <div>
                          <strong className="text-red-600 dark:text-red-400">
                            Component Stack:
                          </strong>
                          <pre className="mt-1 p-2 bg-red-100 dark:bg-red-900/30 rounded overflow-x-auto text-xs">
                            {this.state.errorInfo.componentStack}
                          </pre>
                        </div>
                      )}
                    </div>
                  </details>
                )}

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    onClick={this.handleReset}
                    className="bg-linear-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-0 rounded-xl px-6 py-3 font-bold shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Try Again
                  </Button>
                  <Button
                    onClick={() => (window.location.href = "/")}
                    variant="outline"
                    className="rounded-xl px-6 py-3 font-bold"
                  >
                    Go to Home
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

import { AppError } from './AppError';
import { ErrorTypes, ErrorSeverity } from './errorTypes';

// Global error handler for uncaught exceptions
export const setupGlobalErrorHandler = (errorContext) => {
  // Handle uncaught exceptions
  window.addEventListener('error', (event) => {
    event.preventDefault();
    
    let error;
    if (event.error instanceof Error) {
      error = new AppError(
        event.error.message || 'An unexpected error occurred',
        ErrorTypes.CRITICAL,
        ErrorSeverity.HIGH,
        event.error
      );
    } else {
      error = new AppError(
        'An unexpected error occurred',
        ErrorTypes.CRITICAL,
        ErrorSeverity.HIGH
      );
    }
    
    // Add context
    error.addContext('source', 'global_error_handler');
    error.addContext('filename', event.filename);
    error.addContext('lineno', event.lineno);
    error.addContext('colno', event.colno);
    
    // Add to error context if available
    if (errorContext && errorContext.addError) {
      errorContext.addError(error);
    }
    
    // Log to console
    console.error('Global error handler caught:', error.toJSON());
    
    // Report to analytics
    reportErrorToAnalytics(error);
  });
  
  // Handle unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    event.preventDefault();
    
    let error;
    if (event.reason instanceof Error) {
      error = new AppError(
        event.reason.message || 'An unhandled promise rejection occurred',
        ErrorTypes.FUNCTIONAL,
        ErrorSeverity.MEDIUM,
        event.reason
      );
    } else {
      error = new AppError(
        'An unhandled promise rejection occurred',
        ErrorTypes.FUNCTIONAL,
        ErrorSeverity.MEDIUM
      );
    }
    
    // Add context
    error.addContext('source', 'unhandled_rejection');
    error.addContext('promise', event.promise);
    
    // Add to error context if available
    if (errorContext && errorContext.addError) {
      errorContext.addError(error);
    }
    
    // Log to console
    console.error('Unhandled promise rejection:', error.toJSON());
    
    // Report to analytics
    reportErrorToAnalytics(error);
  });
};

// Report error to analytics
const reportErrorToAnalytics = (error) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'app_error', {
      error_type: error.type,
      error_severity: error.severity,
      error_message: error.message,
      error_source: error.context?.source || 'unknown'
    });
  }
};

// Error logger utility
export const ErrorLogger = {
  log: (error, context = {}) => {
    let appError;
    
    if (error instanceof AppError) {
      appError = error;
    } else if (error instanceof Error) {
      appError = new AppError(
        error.message,
        ErrorTypes.FUNCTIONAL,
        ErrorSeverity.MEDIUM,
        error
      );
    } else {
      appError = new AppError(
        String(error),
        ErrorTypes.FUNCTIONAL,
        ErrorSeverity.MEDIUM
      );
    }
    
    // Add additional context
    Object.entries(context).forEach(([key, value]) => {
      appError.addContext(key, value);
    });
    
    // Log to console
    console.error('Logged error:', appError.toJSON());
    
    // Report to analytics
    reportErrorToAnalytics(appError);
    
    return appError;
  },
  
  logWithLevel: (error, level = ErrorSeverity.MEDIUM, context = {}) => {
    let appError;
    
    if (error instanceof AppError) {
      appError = error;
      appError.severity = level;
    } else if (error instanceof Error) {
      appError = new AppError(
        error.message,
        ErrorTypes.FUNCTIONAL,
        level,
        error
      );
    } else {
      appError = new AppError(
        String(error),
        ErrorTypes.FUNCTIONAL,
        level
      );
    }
    
    // Add additional context
    Object.entries(context).forEach(([key, value]) => {
      appError.addContext(key, value);
    });
    
    // Log to console
    console.error('Logged error with level:', appError.toJSON());
    
    // Report to analytics
    reportErrorToAnalytics(appError);
    
    return appError;
  },
  
  // Log network errors specifically
  logNetworkError: (error, requestInfo = {}) => {
    const appError = new AppError(
      error.message || 'Network request failed',
      ErrorTypes.NETWORK,
      ErrorSeverity.MEDIUM,
      error
    );
    
    // Add network-specific context
    appError.addContext('source', 'network');
    Object.entries(requestInfo).forEach(([key, value]) => {
      appError.addContext(key, value);
    });
    
    // Log to console
    console.error('Network error:', appError.toJSON());
    
    // Report to analytics
    reportErrorToAnalytics(appError);
    
    return appError;
  },
  
  // Log timeout errors specifically
  logTimeoutError: (operation, timeout, context = {}) => {
    const appError = new AppError(
      `Operation '${operation}' timed out after ${timeout}ms`,
      ErrorTypes.TIMEOUT,
      ErrorSeverity.MEDIUM
    );
    
    // Add timeout-specific context
    appError.addContext('source', 'timeout');
    appError.addContext('operation', operation);
    appError.addContext('timeout', timeout);
    Object.entries(context).forEach(([key, value]) => {
      appError.addContext(key, value);
    });
    
    // Log to console
    console.error('Timeout error:', appError.toJSON());
    
    // Report to analytics
    reportErrorToAnalytics(appError);
    
    return appError;
  }
};
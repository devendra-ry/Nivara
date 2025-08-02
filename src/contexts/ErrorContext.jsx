import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { AppError } from '../utils/AppError';
import { ErrorTypes, ErrorSeverity } from '../utils/errorTypes';
import { setupGlobalErrorHandler } from '../utils/globalErrorHandler';

const ErrorContext = createContext();

const initialState = {
  errors: [],
  activeError: null,
  errorHistory: []
};

const errorReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_ERROR':
      return {
        ...state,
        errors: [...state.errors, action.payload],
        activeError: action.payload,
        errorHistory: [...state.errorHistory, {
          ...action.payload,
          timestamp: new Date().toISOString()
        }]
      };
    case 'CLEAR_ERROR':
      return {
        ...state,
        errors: state.errors.filter(err => err.id !== action.payload),
        activeError: state.activeError?.id === action.payload ? null : state.activeError
      };
    case 'CLEAR_ALL_ERRORS':
      return {
        ...state,
        errors: [],
        activeError: null
      };
    case 'SET_ACTIVE_ERROR':
      return {
        ...state,
        activeError: action.payload
      };
    default:
      return state;
  }
};

export const ErrorProvider = ({ children }) => {
  const [state, dispatch] = useReducer(errorReducer, initialState);
  
  // Set up global error handler
  useEffect(() => {
    const errorContext = {
      addError: (error) => {
        const id = Date.now().toString();
        const appError = error instanceof AppError ? error : new AppError(error.message);
        const errorWithId = { ...appError, id };
        dispatch({ type: 'ADD_ERROR', payload: errorWithId });
        return id;
      }
    };
    
    setupGlobalErrorHandler(errorContext);
  }, []);

  const addError = (error) => {
    const id = Date.now().toString();
    const appError = error instanceof AppError ? error : new AppError(error.message);
    const errorWithId = { ...appError, id };
    
    dispatch({ type: 'ADD_ERROR', payload: errorWithId });
    
    // Log error
    console.error('Error captured:', errorWithId);
    
    // Report to analytics
    reportErrorToAnalytics(errorWithId);
    
    return id;
  };

  const clearError = (id) => {
    dispatch({ type: 'CLEAR_ERROR', payload: id });
  };

  const clearAllErrors = () => {
    dispatch({ type: 'CLEAR_ALL_ERRORS' });
  };

  const setActiveError = (error) => {
    dispatch({ type: 'SET_ACTIVE_ERROR', payload: error });
  };

  const reportErrorToAnalytics = (error) => {
    // Implementation for analytics reporting
    if (window.gtag) {
      window.gtag('event', 'app_error', {
        error_type: error.type,
        error_severity: error.severity,
        error_message: error.message
      });
    }
  };

  const value = {
    ...state,
    addError,
    clearError,
    clearAllErrors,
    setActiveError
  };

  return (
    <ErrorContext.Provider value={value}>
      {children}
    </ErrorContext.Provider>
  );
};

export const useError = () => {
  const context = useContext(ErrorContext);
  if (!context) {
    throw new Error('useError must be used within an ErrorProvider');
  }
  return context;
};

export default ErrorContext;
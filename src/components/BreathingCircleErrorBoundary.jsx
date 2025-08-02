import React from 'react';
import ErrorBoundary from './ErrorBoundary';
import { AppError } from '../utils/AppError';
import { ErrorTypes } from '../utils/errorTypes';

class BreathingCircleErrorBoundary extends ErrorBoundary {
  categorizeError(error) {
    const appError = new AppError(
      error.message,
      ErrorTypes.UI,
      'medium',
      error
    );
    
    // Add specific context for breathing animation errors
    appError.addContext('component', 'BreathingCircle');
    appError.addContext('feature', 'animation');
    
    return appError;
  }

  getUserFriendlyMessage() {
    return 'The breathing animation encountered an error. You can continue with the exercise or refresh the animation.';
  }

  handleRefresh = () => {
    if (this.props.onRefresh) {
      this.props.onRefresh();
    }
    this.setState({ hasError: false, error: null, errorInfo: null });
  };
}

export default BreathingCircleErrorBoundary;
import React from 'react';
import ErrorBoundary from './ErrorBoundary';
import { AppError } from '../utils/AppError';
import { ErrorTypes } from '../utils/errorTypes';

class ControlPanelErrorBoundary extends ErrorBoundary {
  categorizeError(error) {
    const appError = new AppError(
      error.message,
      ErrorTypes.FUNCTIONAL,
      'medium',
      error
    );
    
    // Add specific context for control panel errors
    appError.addContext('component', 'ControlPanel');
    appError.addContext('feature', 'controls');
    
    return appError;
  }

  getUserFriendlyMessage() {
    return 'The control panel encountered an error. You can try resetting the controls or continue with the current settings.';
  }

  handleReset = () => {
    if (this.props.onReset) {
      this.props.onReset();
    }
    this.setState({ hasError: false, error: null, errorInfo: null });
  };
}

export default ControlPanelErrorBoundary;
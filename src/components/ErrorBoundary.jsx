import React from 'react';
import { ErrorTypes, ErrorSeverity } from '../utils/errorTypes';
import { AppError } from '../utils/AppError';
import './ErrorBoundary.css';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null, 
      errorInfo: null,
      errorType: null,
      recoveryOptions: []
    };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Categorize the error
    const appError = this.categorizeError(error);
    
    // Log error
    this.logError(appError, errorInfo);
    
    // Determine recovery options
    const recoveryOptions = this.getRecoveryOptions(appError);
    
    this.setState({
      error: appError,
      errorInfo,
      errorType: appError.type,
      recoveryOptions
    });
  }

  categorizeError(error) {
    // Determine error type based on error characteristics
    let type = ErrorTypes.FUNCTIONAL;
    let severity = ErrorSeverity.MEDIUM;
    
    if (error instanceof TypeError || error instanceof ReferenceError) {
      type = ErrorTypes.CRITICAL;
      severity = ErrorSeverity.HIGH;
    } else if (error.message.includes('network') || error.message.includes('fetch')) {
      type = ErrorTypes.NETWORK;
      severity = ErrorSeverity.MEDIUM;
    } else if (error.name === 'ChunkLoadError') {
      type = ErrorTypes.NETWORK;
      severity = ErrorSeverity.HIGH;
    } else if (error.message.includes('render') || error.message.includes('component')) {
      type = ErrorTypes.UI;
      severity = ErrorSeverity.MEDIUM;
    }
    
    return new AppError(
      error.message,
      type,
      severity,
      error
    );
  }

  getRecoveryOptions(error) {
    const options = [];
    
    switch (error.type) {
      case ErrorTypes.CRITICAL:
        options.push({ type: 'refresh', label: 'Refresh Page', action: () => window.location.reload() });
        break;
      case ErrorTypes.FUNCTIONAL:
        options.push({ type: 'retry', label: 'Retry', action: this.handleRetry });
        options.push({ type: 'reset', label: 'Reset', action: this.handleReset });
        break;
      case ErrorTypes.UI:
        options.push({ type: 'continue', label: 'Continue', action: this.handleContinue });
        options.push({ type: 'refresh', label: 'Refresh Component', action: this.handleRefresh });
        break;
      case ErrorTypes.NETWORK:
        options.push({ type: 'retry', label: 'Retry', action: this.handleRetry });
        options.push({ type: 'refresh', label: 'Refresh Page', action: () => window.location.reload() });
        break;
      default:
        options.push({ type: 'continue', label: 'Continue', action: this.handleContinue });
    }
    
    return options;
  }

  logError(error, errorInfo) {
    // Log to console
    console.error('ErrorBoundary caught an error:', error.toJSON(), errorInfo);
    
    // Send to error reporting service
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
    
    // Send to analytics
    this.reportToAnalytics(error);
  }

  reportToAnalytics(error) {
    // Implementation for analytics reporting
    if (window.gtag) {
      window.gtag('event', 'error', {
        error_type: error.type,
        error_severity: error.severity,
        error_message: error.message
      });
    }
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  handleReset = () => {
    if (this.props.onReset) {
      this.props.onReset();
    }
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  handleContinue = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  handleRefresh = () => {
    if (this.props.onRefresh) {
      this.props.onRefresh();
    }
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className={`error-boundary error-${this.state.errorType}`}>
          <div className="error-content">
            <h2>Oops! Something went wrong</h2>
            <p className="error-message">
              {this.getUserFriendlyMessage()}
            </p>
            
            {this.props.showDetails && (
              <details className="error-details">
                <summary>Technical Details</summary>
                <pre>{this.state.error?.stack}</pre>
                {this.state.errorInfo && (
                  <pre>{this.state.errorInfo.componentStack}</pre>
                )}
              </details>
            )}
            
            <div className="error-actions">
              {this.state.recoveryOptions.map((option, index) => (
                <button
                  key={index}
                  className={`error-action ${option.type}`}
                  onClick={option.action}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }

  getUserFriendlyMessage() {
    if (!this.state.error) return 'An unknown error occurred.';
    
    switch (this.state.error.type) {
      case ErrorTypes.CRITICAL:
        return 'A critical error occurred. The application needs to be refreshed to continue.';
      case ErrorTypes.FUNCTIONAL:
        return 'This feature encountered an error. You can try again or reset to continue.';
      case ErrorTypes.UI:
        return 'There was a problem displaying this content. You can continue or refresh the component.';
      case ErrorTypes.NETWORK:
        return 'Unable to connect to the server. Please check your connection and try again.';
      case ErrorTypes.TIMEOUT:
        return 'The operation timed out. Please try again.';
      default:
        return 'An error occurred. Please try again.';
    }
  }
}

export default ErrorBoundary;
// Error types for categorizing different kinds of errors
export const ErrorTypes = {
  CRITICAL: 'critical',      // App-breaking errors requiring restart
  FUNCTIONAL: 'functional',  // Feature-breaking errors affecting functionality
  UI: 'ui',                 // UI/rendering errors affecting display
  NETWORK: 'network',       // Network/API communication errors
  USER_INPUT: 'user_input', // User input validation errors
  TIMEOUT: 'timeout'        // Timeout/async operation errors
};

// Error severity levels
export const ErrorSeverity = {
  HIGH: 'high',      // Immediate attention required
  MEDIUM: 'medium',  // Can be deferred
  LOW: 'low'         // Informational only
};
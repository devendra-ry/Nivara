import { ErrorTypes, ErrorSeverity } from './errorTypes';

export class AppError extends Error {
  constructor(message, type = ErrorTypes.FUNCTIONAL, severity = ErrorSeverity.MEDIUM, originalError = null) {
    super(message);
    this.name = this.constructor.name;
    this.type = type;
    this.severity = severity;
    this.timestamp = new Date().toISOString();
    this.originalError = originalError;
    this.context = {};
  }

  addContext(key, value) {
    this.context[key] = value;
    return this;
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      type: this.type,
      severity: this.severity,
      timestamp: this.timestamp,
      context: this.context,
      stack: this.stack,
      originalError: this.originalError ? {
        message: this.originalError.message,
        stack: this.originalError.stack
      } : null
    };
  }
}
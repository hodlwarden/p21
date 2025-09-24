/**
 * Error Handling Utilities
 * Comprehensive error handling and classification system
 */

import type { AppError } from '../types';
import { ERROR_MESSAGES } from './constants';

// Error codes enum
export enum ErrorCode {
  // Network errors
  NETWORK_ERROR = 'NETWORK_ERROR',
  RPC_ERROR = 'RPC_ERROR',
  TIMEOUT_ERROR = 'TIMEOUT_ERROR',
  
  // Wallet errors
  WALLET_NOT_CONNECTED = 'WALLET_NOT_CONNECTED',
  WALLET_CONNECTION_FAILED = 'WALLET_CONNECTION_FAILED',
  USER_REJECTED = 'USER_REJECTED',
  INSUFFICIENT_BALANCE = 'INSUFFICIENT_BALANCE',
  
  // Transaction errors
  TRANSACTION_FAILED = 'TRANSACTION_FAILED',
  TRANSACTION_REVERTED = 'TRANSACTION_REVERTED',
  GAS_ESTIMATION_FAILED = 'GAS_ESTIMATION_FAILED',
  NONCE_TOO_LOW = 'NONCE_TOO_LOW',
  REPLACEMENT_UNDERPRICED = 'REPLACEMENT_UNDERPRICED',
  
  // Swap errors
  INSUFFICIENT_LIQUIDITY = 'INSUFFICIENT_LIQUIDITY',
  SLIPPAGE_EXCEEDED = 'SLIPPAGE_EXCEEDED',
  PRICE_IMPACT_TOO_HIGH = 'PRICE_IMPACT_TOO_HIGH',
  TOKEN_NOT_FOUND = 'TOKEN_NOT_FOUND',
  ROUTE_NOT_FOUND = 'ROUTE_NOT_FOUND',
  
  // API errors
  API_ERROR = 'API_ERROR',
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED',
  INVALID_RESPONSE = 'INVALID_RESPONSE',
  
  // Validation errors
  INVALID_INPUT = 'INVALID_INPUT',
  INVALID_ADDRESS = 'INVALID_ADDRESS',
  INVALID_AMOUNT = 'INVALID_AMOUNT',
  INVALID_TOKEN = 'INVALID_TOKEN',
  
  // Contract errors
  CONTRACT_ERROR = 'CONTRACT_ERROR',
  APPROVAL_FAILED = 'APPROVAL_FAILED',
  ALLOWANCE_ERROR = 'ALLOWANCE_ERROR',
  
  // Unknown errors
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
}

// Error severity levels
export enum ErrorSeverity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical',
}

// Custom error class
export class FibrousError extends Error implements AppError {
  public readonly code: string;
  public readonly details?: any;
  public readonly timestamp: Date;
  public readonly userMessage?: string;
  public readonly severity: ErrorSeverity;

  constructor(
    code: ErrorCode | string,
    message: string,
    options: {
      details?: any;
      userMessage?: string;
      severity?: ErrorSeverity;
      cause?: Error;
    } = {}
  ) {
    super(message);
    
    this.name = 'FibrousError';
    this.code = code;
    this.details = options.details;
    this.timestamp = new Date();
    this.userMessage = options.userMessage;
    this.severity = options.severity || ErrorSeverity.MEDIUM;
    
    if (options.cause) {
      this.cause = options.cause;
    }
    
    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, FibrousError);
    }
  }
}

// Error classification utilities
// export const classifyError = (error: any): AppError => {
//   // Handle FibrousError instances
//   if (error instanceof FibrousError) {
//     return error;
//   }

//   // Handle standard Error instances
//   if (error instanceof Error) {
//     const message = error.message.toLowerCase();
//     let code = ErrorCode.UNKNOWN_ERROR;
//     let userMessage = ERROR_MESSAGES.UNKNOWN_ERROR;
//     let severity = ErrorSeverity.MEDIUM;

//     // Wallet errors
//     if (message.includes('user rejected') || message.includes('user denied')) {
//       code = ErrorCode.USER_REJECTED;
//       userMessage = ERROR_MESSAGES.USER_REJECTED;
//       severity = ErrorSeverity.LOW;
//     } else if (message.includes('insufficient funds') || message.includes('insufficient balance')) {
//       code = ErrorCode.INSUFFICIENT_BALANCE;
//       userMessage = ERROR_MESSAGES.INSUFFICIENT_BALANCE;
//       severity = ErrorSeverity.MEDIUM;
//     } else if (message.includes('network error') || message.includes('connection')) {
//       code = ErrorCode.NETWORK_ERROR;
//       userMessage = ERROR_MESSAGES.NETWORK_ERROR;
//       severity = ErrorSeverity.HIGH;
//     } else if (message.includes('transaction failed') || message.includes('reverted')) {
//       code = ErrorCode.TRANSACTION_FAILED;
//       userMessage = ERROR_MESSAGES.TRANSACTION_FAILED;
//       severity = ErrorSeverity.HIGH;
//     } else if (message.includes('slippage')) {
//       code = ErrorCode.SLIPPAGE_EXCEEDED;
//       userMessage = ERROR_MESSAGES.SLIPPAGE_TOO_HIGH;
//       severity = ErrorSeverity.MEDIUM;
//     } else if (message.includes('rate limit') || message.includes('too many requests')) {
//       code = ErrorCode.RATE_LIMIT_EXCEEDED;
//       userMessage = ERROR_MESSAGES.RATE_LIMIT_EXCEEDED;
//       severity = ErrorSeverity.LOW;
//     }

//     return new FibrousError(code, error.message, {
//       details: error,
//       userMessage,
//       severity,
//       cause: error,
//     });
//   }

//   // Handle string errors
//   if (typeof error === 'string') {
//     return new FibrousError(ErrorCode.UNKNOWN_ERROR, error, {
//       userMessage: error,
//     });
//   }

//   // Handle object errors (e.g., from APIs)
//   if (error && typeof error === 'object') {
//     const message = error.message || error.error || 'Unknown error occurred';
//     const code = error.code || ErrorCode.UNKNOWN_ERROR;
    
//     return new FibrousError(code, message, {
//       details: error,
//       userMessage: message,
//     });
//   }

//   // Fallback for unknown error types
//   return new FibrousError(ErrorCode.UNKNOWN_ERROR, 'An unknown error occurred', {
//     details: error,
//     userMessage: ERROR_MESSAGES.UNKNOWN_ERROR,
//   });
// };

// Error reporting utilities
export const reportError = (error: AppError, context?: any): void => {
  // Log error for debugging
  console.error('[Fibrous Error]', {
    code: error.code,
    message: error.message,
    details: error.details,
    context,
    timestamp: error.timestamp,
    stack: error instanceof Error ? error.stack : undefined,
  });

  // In production, send to error reporting service
  if (process.env.NODE_ENV === 'production') {
    // Send to analytics/error reporting service
    // Example: Sentry, LogRocket, etc.
  }
};

// Retry utilities
export const shouldRetry = (error: AppError): boolean => {
  const retryableCodes = [
    ErrorCode.NETWORK_ERROR,
    ErrorCode.TIMEOUT_ERROR,
    ErrorCode.RPC_ERROR,
    ErrorCode.RATE_LIMIT_EXCEEDED,
  ];

  return retryableCodes.includes(error.code as ErrorCode);
};

export const getRetryDelay = (attempt: number, baseDelay = 1000): number => {
  // Exponential backoff with jitter
  const delay = baseDelay * Math.pow(2, attempt - 1);
  const jitter = Math.random() * 0.1 * delay;
  return Math.min(delay + jitter, 30000); // Max 30 seconds
};

// // Error boundary helpers
// export const isCriticalError = (error: AppError): boolean => {
//   return error.severity === ErrorSeverity.CRITICAL;
// };

export const shouldShowErrorToUser = (error: AppError): boolean => {
  // Don't show user rejection errors as they're expected
  if (error.code === ErrorCode.USER_REJECTED) {
    return false;
  }
  
  // Show errors with user messages
  return !!error.userMessage;
};

// Wallet error handlers
// export const handleWalletError = (error: any): AppError => {
//   const classified = classifyError(error);
  
//   // Add specific wallet error context
//   if (error?.code === 4001) {
//     return new FibrousError(ErrorCode.USER_REJECTED, 'User rejected the request', {
//       userMessage: 'Transaction was cancelled',
//       severity: ErrorSeverity.LOW,
//       details: error,
//     });
//   }
  
//   if (error?.code === -32603) {
//     return new FibrousError(ErrorCode.RPC_ERROR, 'RPC error', {
//       userMessage: 'Network error, please try again',
//       severity: ErrorSeverity.HIGH,
//       details: error,
//     });
//   }
  
//   return classified;
// };

// Transaction error handlers
// export const handleTransactionError = (error: any): AppError => {
//   const classified = classifyError(error);
  
//   // Add specific transaction error context
//   if (error?.reason?.includes('slippage')) {
//     return new FibrousError(ErrorCode.SLIPPAGE_EXCEEDED, 'Slippage tolerance exceeded', {
//       userMessage: 'Price moved unfavorably, try increasing slippage tolerance',
//       severity: ErrorSeverity.MEDIUM,
//       details: error,
//     });
//   }
  
//   return classified;
// };

// // API error handlers
// export const handleApiError = (error: any, endpoint?: string): AppError => {
//   const classified = classifyError(error);
  
//   // Add API-specific context
//   if (error?.status === 429) {
//     return new FibrousError(ErrorCode.RATE_LIMIT_EXCEEDED, 'Rate limit exceeded', {
//       userMessage: 'Too many requests, please wait a moment',
//       severity: ErrorSeverity.LOW,
//       details: { ...error, endpoint },
//     });
//   }
  
//   if (error?.status >= 500) {
//     return new FibrousError(ErrorCode.API_ERROR, 'Server error', {
//       userMessage: 'Service temporarily unavailable, please try again',
//       severity: ErrorSeverity.HIGH,
//       details: { ...error, endpoint },
//     });
//   }
  
//   return classified;
// };

// Error recovery suggestions
export const getRecoverySuggestion = (error: AppError): string | null => {
  switch (error.code) {
    case ErrorCode.INSUFFICIENT_BALANCE:
      return 'Add more funds to your wallet or reduce the swap amount';
    
    case ErrorCode.SLIPPAGE_EXCEEDED:
      return 'Try increasing your slippage tolerance or wait for better market conditions';
    
    case ErrorCode.NETWORK_ERROR:
      return 'Check your internet connection and try again';
    
    case ErrorCode.GAS_ESTIMATION_FAILED:
      return 'This transaction may fail. Try adjusting the amount or gas settings';
    
    case ErrorCode.TOKEN_NOT_FOUND:
      return 'Verify the token address and try again';
    
    case ErrorCode.RATE_LIMIT_EXCEEDED:
      return 'Please wait a moment before making another request';
    
    default:
      return null;
  }
};

// Error formatting for UI
export const formatErrorForUser = (error: AppError): string => {
  if (error.userMessage) {
    return error.userMessage;
  }
  
  // Fallback to generic message based on code
  switch (error.code) {
    case ErrorCode.WALLET_NOT_CONNECTED:
      return ERROR_MESSAGES.WALLET_NOT_CONNECTED;
    case ErrorCode.INSUFFICIENT_BALANCE:
      return ERROR_MESSAGES.INSUFFICIENT_BALANCE;
    case ErrorCode.NETWORK_ERROR:
      return ERROR_MESSAGES.NETWORK_ERROR;
    case ErrorCode.TRANSACTION_FAILED:
      return ERROR_MESSAGES.TRANSACTION_FAILED;
    default:
      return ERROR_MESSAGES.UNKNOWN_ERROR;
  }
};

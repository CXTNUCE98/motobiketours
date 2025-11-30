/**
 * Centralized error handling composable
 * Provides consistent error handling across the application
 */

import { ElMessage, ElNotification } from 'element-plus';
import { logger } from '~/utils/logger';

export interface ApiError {
  statusCode?: number;
  message?: string | string[];
  error?: string;
  response?: {
    data?: {
      message?: string | string[];
    };
  };
}

/**
 * Extract error message from various error formats
 */
function extractErrorMessage(error: unknown): string {
  if (!error) {
    return 'An unexpected error occurred';
  }

  // Handle ApiError format
  if (typeof error === 'object' && 'message' in error) {
    const apiError = error as ApiError;
    if (apiError.message) {
      if (Array.isArray(apiError.message)) {
        return apiError.message.join(', ');
      }
      return apiError.message;
    }
    
    // Try to get message from response
    if (apiError.response?.data?.message) {
      if (Array.isArray(apiError.response.data.message)) {
        return apiError.response.data.message.join(', ');
      }
      return apiError.response.data.message;
    }
  }

  // Handle Error instance
  if (error instanceof Error) {
    return error.message;
  }

  // Handle string errors
  if (typeof error === 'string') {
    return error;
  }

  // Fallback
  return 'An unexpected error occurred';
}

/**
 * Get user-friendly error message based on status code
 */
function getUserFriendlyMessage(error: ApiError): string {
  const statusCode = error.statusCode || 0;
  const message = extractErrorMessage(error);

  // Override with user-friendly messages for common errors
  switch (statusCode) {
    case 400:
      return message || 'Invalid request. Please check your input.';
    case 401:
      return 'You are not authorized. Please login again.';
    case 403:
      return 'You do not have permission to perform this action.';
    case 404:
      return 'The requested resource was not found.';
    case 409:
      return 'A conflict occurred. The resource may already exist.';
    case 422:
      return message || 'Validation failed. Please check your input.';
    case 429:
      return 'Too many requests. Please try again later.';
    case 500:
      return 'Server error. Please try again later.';
    case 503:
      return 'Service unavailable. Please try again later.';
    case 0:
      return 'Network error. Please check your connection.';
    default:
      return message || 'An error occurred. Please try again.';
  }
}

export function useErrorHandler() {
  /**
   * Handle error and show appropriate message to user
   * @param error - The error to handle
   * @param context - Optional context for logging (e.g., 'Login', 'Create Tour')
   * @param options - Additional options
   */
  const handleError = (
    error: unknown,
    context?: string,
    options?: {
      showNotification?: boolean;
      showMessage?: boolean;
      silent?: boolean;
    }
  ) => {
    const apiError = error as ApiError;
    const userMessage = getUserFriendlyMessage(apiError);
    const logContext = context ? `[${context}]` : '[Error]';

    // Always log errors for debugging
    logger.error(`${logContext}`, error);

    // Don't show UI feedback if silent mode
    if (options?.silent) {
      return;
    }

    // Show notification (default)
    if (options?.showNotification !== false) {
      ElNotification({
        title: 'Error',
        message: userMessage,
        type: 'error',
        duration: 5000,
      });
    }

    // Show message as alternative (if notification is disabled)
    if (options?.showMessage && !options?.showNotification) {
      ElMessage.error(userMessage);
    }
  };

  /**
   * Handle API errors specifically
   */
  const handleApiError = (
    error: unknown,
    context?: string,
    options?: {
      showNotification?: boolean;
      showMessage?: boolean;
      silent?: boolean;
    }
  ) => {
    handleError(error, context, options);
  };

  /**
   * Handle network errors
   */
  const handleNetworkError = (context?: string) => {
    handleError(
      {
        statusCode: 0,
        message: 'Network error. Please check your connection.',
        error: 'NETWORK_ERROR',
      },
      context
    );
  };

  /**
   * Handle validation errors
   */
  const handleValidationError = (errors: string[] | string, context?: string) => {
    const message = Array.isArray(errors) ? errors.join(', ') : errors;
    handleError(
      {
        statusCode: 422,
        message,
        error: 'VALIDATION_ERROR',
      },
      context,
      {
        showNotification: false,
        showMessage: true,
      }
    );
  };

  return {
    handleError,
    handleApiError,
    handleNetworkError,
    handleValidationError,
    extractErrorMessage,
  };
}


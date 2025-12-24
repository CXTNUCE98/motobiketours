// Form validation utilities

export interface ValidationRule {
  validate: (value: any) => boolean;
  message: string;
}

export interface ValidationRules {
  [key: string]: ValidationRule[];
}

export interface ValidationErrors {
  [key: string]: string;
}

/**
 * Validate a single field
 */
export function validateField(value: any, rules: ValidationRule[]): string {
  for (const rule of rules) {
    if (!rule.validate(value)) {
      return rule.message;
    }
  }
  return '';
}

/**
 * Validate entire form
 */
export function validateForm(formData: Record<string, any>, rules: ValidationRules): ValidationErrors {
  const errors: ValidationErrors = {};

  for (const field in rules) {
    const error = validateField(formData[field], rules[field]);
    if (error) {
      errors[field] = error;
    }
  }

  return errors;
}

// Common validation rules
export const validationRules = {
  required: (message = 'This field is required'): ValidationRule => ({
    validate: (value: any) => {
      if (typeof value === 'string') {
        return value.trim().length > 0;
      }
      return value !== null && value !== undefined;
    },
    message,
  }),

  email: (message = 'Please enter a valid email address'): ValidationRule => ({
    validate: (value: string) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(value);
    },
    message,
  }),

  minLength: (length: number, message?: string): ValidationRule => ({
    validate: (value: string) => {
      return value.length >= length;
    },
    message: message || `Must be at least ${length} characters`,
  }),

  maxLength: (length: number, message?: string): ValidationRule => ({
    validate: (value: string) => {
      return value.length <= length;
    },
    message: message || `Must be no more than ${length} characters`,
  }),

  pattern: (regex: RegExp, message = 'Invalid format'): ValidationRule => ({
    validate: (value: string) => {
      return regex.test(value);
    },
    message,
  }),

  match: (otherValue: any, message = 'Values do not match'): ValidationRule => ({
    validate: (value: any) => {
      return (
        value ===
        (typeof otherValue === 'object' && otherValue !== null && 'value' in otherValue ? otherValue.value : otherValue)
      );
    },
    message,
  }),
};

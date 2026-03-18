/**
 * Normalize API errors into a consistent shape:
 * { message: string, fields: { [field]: string } }
 */
export const normalizeError = (error) => {
  // Network error (no response)
  if (!error.response) {
    return {
      message: 'Network error. Please check your connection.',
      fields: {},
    };
  }

  const { status, data } = error.response;

  // Validation errors (422)
  if (status === 422 && data?.errors) {
    return {
      message: data.message || 'Validation failed.',
      fields: data.errors,
    };
  }

  // Auth errors
  if (status === 401) {
    return {
      message: data?.message || 'Invalid credentials.',
      fields: {},
    };
  }

  if (status === 403) {
    const code = data?.code;
    const messages = {
      CSRF_MISSING:    'Security token missing. Please refresh.',
      CSRF_INVALID:    'Security token expired. Please refresh.',
      TENANT_MISSING:  'Tenant information missing.',
      TENANT_INACTIVE: 'Your organization account is inactive.',
    };
    return {
      message: messages[code] || data?.message || 'Access denied.',
      fields: {},
    };
  }

  if (status === 429) {
    return {
      message: 'Too many requests. Please wait a moment.',
      fields: {},
    };
  }

  if (status >= 500) {
    return {
      message: 'Server error. Please try again later.',
      fields: {},
    };
  }

  return {
    message: data?.message || 'An unexpected error occurred.',
    fields: {},
  };
};

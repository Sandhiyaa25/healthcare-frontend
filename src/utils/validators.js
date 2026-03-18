export const validateEmail = (value) => {
  if (!value) return 'Email is required.';
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!re.test(value)) return 'Please enter a valid email address.';
  return null;
};

export const validateUsername = (value) => {
  if (!value || !value.trim()) return 'Username is required.';
  return null;
};

export const validatePassword = (value) => {
  if (!value) return 'Password is required.';
  if (value.length < 6) return 'Password must be at least 6 characters.';
  return null;
};

export const validateRequired = (value, label = 'This field') => {
  if (!value || (typeof value === 'string' && !value.trim())) {
    return `${label} is required.`;
  }
  return null;
};

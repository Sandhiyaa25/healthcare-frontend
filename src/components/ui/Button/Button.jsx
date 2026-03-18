import React from 'react';
import { StyledButton } from './Button.styled';
import Spinner from '../Spinner/Spinner';

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  fullWidth = false,
  icon,
  ...rest
}) => (
  <StyledButton
    $variant={variant}
    $size={size}
    $fullWidth={fullWidth}
    disabled={disabled || loading}
    {...rest}
  >
    {loading ? <Spinner size="sm" /> : icon && <span className="btn-icon">{icon}</span>}
    {children && <span>{children}</span>}
  </StyledButton>
);

export default Button;

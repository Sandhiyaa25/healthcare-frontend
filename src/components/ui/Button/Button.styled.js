import styled from 'styled-components';

const sizes = {
  sm: { padding: '6px 14px', fontSize: '12px', height: '32px' },
  md: { padding: '9px 20px', fontSize: '14px', height: '40px' },
  lg: { padding: '12px 28px', fontSize: '15px', height: '48px' },
};

const variants = (theme) => ({
  primary: `
    background: ${theme.colors.primary};
    color: ${theme.colors.textInverse};
    border: 1.5px solid ${theme.colors.primary};
    &:hover:not(:disabled) { background: ${theme.colors.primaryDark}; border-color: ${theme.colors.primaryDark}; }
  `,
  secondary: `
    background: transparent;
    color: ${theme.colors.primary};
    border: 1.5px solid ${theme.colors.primary};
    &:hover:not(:disabled) { background: ${theme.colors.primaryLight}; }
  `,
  ghost: `
    background: transparent;
    color: ${theme.colors.textSecondary};
    border: 1.5px solid ${theme.colors.border};
    &:hover:not(:disabled) { background: ${theme.colors.bgBase}; color: ${theme.colors.textPrimary}; }
  `,
  danger: `
    background: ${theme.colors.danger};
    color: white;
    border: 1.5px solid ${theme.colors.danger};
    &:hover:not(:disabled) { opacity: 0.88; }
  `,
});

export const StyledButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border-radius: ${({ theme }) => theme.radii.sm};
  font-weight: ${({ theme }) => theme.fonts.weightMedium};
  transition: ${({ theme }) => theme.transitions.fast};
  white-space: nowrap;
  cursor: pointer;
  width: ${({ $fullWidth }) => $fullWidth ? '100%' : 'auto'};
  height: ${({ $size }) => sizes[$size]?.height};
  padding: ${({ $size }) => sizes[$size]?.padding};
  font-size: ${({ $size }) => sizes[$size]?.fontSize};
  ${({ theme, $variant }) => variants(theme)[$variant] || variants(theme).primary}

  &:disabled {
    opacity: 0.55;
    cursor: not-allowed;
  }

  .btn-icon {
    display: inline-flex;
    align-items: center;
    font-size: 15px;
  }
`;

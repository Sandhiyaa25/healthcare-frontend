import styled from 'styled-components';

const variantMap = (theme) => ({
  default:      { bg: theme.colors.bgBase,     color: theme.colors.textSecondary },
  primary:      { bg: theme.colors.primaryLight, color: theme.colors.primary },
  success:      { bg: '#DCFCE7', color: theme.colors.success },
  warning:      { bg: '#FEF3C7', color: theme.colors.warning },
  danger:       { bg: '#FEE2E2', color: theme.colors.danger },
  info:         { bg: '#E0F2FE', color: theme.colors.info },
  // Role variants
  admin:        { bg: '#F3E8FF', color: '#7C3AED' },
  doctor:       { bg: '#DBEAFE', color: '#1D4ED8' },
  nurse:        { bg: '#D1FAE5', color: '#065F46' },
  receptionist: { bg: '#FEF3C7', color: '#92400E' },
  pharmacist:   { bg: '#FCE7F3', color: '#9D174D' },
  patient:      { bg: '#E0F2FE', color: '#0369A1' },
});

export const BadgeEl = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 2px 10px;
  border-radius: ${({ theme }) => theme.radii.full};
  font-size: ${({ theme }) => theme.fonts.sizeXs};
  font-weight: ${({ theme }) => theme.fonts.weightSemi};
  letter-spacing: 0.3px;
  background: ${({ theme, $variant }) => variantMap(theme)[$variant]?.bg || variantMap(theme).default.bg};
  color: ${({ theme, $variant }) => variantMap(theme)[$variant]?.color || variantMap(theme).default.color};
  white-space: nowrap;
`;
import styled, { keyframes } from 'styled-components';

const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const variantTokens = (theme) => ({
  primary: { icon: theme.colors.primary,  iconBg: theme.colors.primaryLight, glow: 'rgba(37,99,235,0.06)'  },
  info:    { icon: theme.colors.info,     iconBg: '#E0F2FE',                 glow: 'rgba(8,145,178,0.06)'  },
  success: { icon: theme.colors.success,  iconBg: '#DCFCE7',                 glow: 'rgba(22,163,74,0.06)'  },
  warning: { icon: theme.colors.warning,  iconBg: '#FEF3C7',                 glow: 'rgba(217,119,6,0.06)'  },
  danger:  { icon: theme.colors.danger,   iconBg: '#FEE2E2',                 glow: 'rgba(220,38,38,0.06)'  },
});

export const CardWrap = styled.div`
  background: ${({ theme }) => theme.colors.bgCard};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md};
  padding: 20px;
  display: flex;
  align-items: flex-start;
  gap: 16px;
  transition: all 0.22s ease;
  position: relative;
  overflow: hidden;
  animation: ${fadeUp} 0.4s ease both;

  &:hover {
    box-shadow: 0 8px 28px ${({ theme, $variant }) => variantTokens(theme)[$variant]?.glow || 'rgba(0,0,0,0.08)'};
    transform: translateY(-2px);
    border-color: ${({ theme, $variant }) => variantTokens(theme)[$variant]?.icon || theme.colors.primary}33;
  }
`;

export const CardGlow = styled.div`
  position: absolute;
  top: 0; right: 0;
  width: 100px; height: 100px;
  border-radius: 50%;
  background: ${({ theme, $variant }) => variantTokens(theme)[$variant]?.glow || 'transparent'};
  transform: translate(30%, -30%);
  pointer-events: none;
`;

export const CardIcon = styled.div`
  width: 48px;
  height: 48px;
  border-radius: ${({ theme }) => theme.radii.md};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  flex-shrink: 0;
  background: ${({ theme, $variant }) => variantTokens(theme)[$variant]?.iconBg};
  color: ${({ theme, $variant }) => variantTokens(theme)[$variant]?.icon};
`;

export const CardBody = styled.div`
  flex: 1;
  min-width: 0;
`;

export const CardLabel = styled.p`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: 4px;
  font-weight: 500;
`;

export const CardValue = styled.p`
  font-size: 28px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.textPrimary};
  letter-spacing: -0.8px;
  margin-bottom: 6px;
  line-height: 1.1;
`;

export const TrendBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 11px;
  font-weight: 500;
  color: ${({ theme, $positive, $neutral }) =>
    $neutral   ? theme.colors.textMuted :
    $positive  ? theme.colors.success :
                 theme.colors.danger};

  span { font-size: 11px; }
`;

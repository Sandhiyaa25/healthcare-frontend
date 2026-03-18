import styled from 'styled-components';

export const FieldWrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  width: 100%;
`;

export const Label = styled.label`
  font-size: ${({ theme }) => theme.fonts.sizeSm};
  font-weight: ${({ theme }) => theme.fonts.weightMedium};
  color: ${({ theme }) => theme.colors.textPrimary};

  span { color: ${({ theme }) => theme.colors.danger}; }
`;

export const InputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  border-radius: ${({ theme }) => theme.radii.sm};
  border: 1.5px solid ${({ theme, $hasError }) =>
    $hasError ? theme.colors.danger : theme.colors.border};
  background: ${({ theme, $disabled }) =>
    $disabled ? theme.colors.bgBase : theme.colors.bgCard};
  transition: ${({ theme }) => theme.transitions.fast};

  &:focus-within {
    border-color: ${({ theme, $hasError }) =>
      $hasError ? theme.colors.danger : theme.colors.borderFocus};
    box-shadow: 0 0 0 3px ${({ theme, $hasError }) =>
      $hasError ? 'rgba(220,38,38,0.12)' : 'rgba(37,99,235,0.12)'};
  }
`;

export const InputEl = styled.input`
  flex: 1;
  border: none;
  background: transparent;
  outline: none;
  padding: 10px 14px;
  padding-left: ${({ $hasPrefix }) => $hasPrefix ? '40px' : '14px'};
  padding-right: ${({ $hasSuffix }) => $hasSuffix ? '40px' : '14px'};
  font-size: ${({ theme }) => theme.fonts.sizeBase};
  color: ${({ theme }) => theme.colors.textPrimary};

  &::placeholder { color: ${({ theme }) => theme.colors.textMuted}; }
  &:disabled { cursor: not-allowed; }
`;

export const IconSlot = styled.span`
  position: absolute;
  ${({ $side }) => $side === 'left' ? 'left: 12px;' : 'right: 12px;'}
  display: flex;
  align-items: center;
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 16px;
  pointer-events: none;
`;

export const ErrorMsg = styled.p`
  font-size: ${({ theme }) => theme.fonts.sizeXs};
  color: ${({ theme }) => theme.colors.danger};
  display: flex;
  align-items: center;
  gap: 4px;
`;

export const HelperText = styled.p`
  font-size: ${({ theme }) => theme.fonts.sizeXs};
  color: ${({ theme }) => theme.colors.textMuted};
`;

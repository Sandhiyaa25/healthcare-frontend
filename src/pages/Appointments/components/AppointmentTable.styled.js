import styled from 'styled-components';

export const TableWrap = styled.div`
  background: ${({ theme }) => theme.colors.bgCard};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md};
  overflow: hidden;
`;

export const NameCell = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1px;
`;

export const NamePrimary = styled.span`
  font-size: ${({ theme }) => theme.fonts.sizeSm};
  font-weight: ${({ theme }) => theme.fonts.weightSemi};
  color: ${({ theme }) => theme.colors.textPrimary};
`;

export const NameSub = styled.span`
  font-size: ${({ theme }) => theme.fonts.sizeXs};
  color: ${({ theme }) => theme.colors.textMuted};
`;

export const ActionGroup = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
`;

export const ActionBtn = styled.button`
  width: 28px;
  height: 28px;
  border-radius: ${({ theme }) => theme.radii.sm};
  border: none;
  background: transparent;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${({ theme }) => theme.fonts.sizeSm};
  color: ${({ $danger, theme }) =>
    $danger ? theme.colors.danger : theme.colors.textSecondary};
  transition: ${({ theme }) => theme.transitions.fast};

  &:hover {
    background: ${({ theme }) => theme.colors.bgBase};
    color: ${({ $danger, theme }) =>
      $danger ? theme.colors.danger : theme.colors.primary};
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
`;

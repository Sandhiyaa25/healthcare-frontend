import styled from 'styled-components';

export const TableWrap = styled.div`
  background: ${({ theme }) => theme.colors.bgCard};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md};
  overflow: hidden;
`;

export const PatientCell = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`;

export const PatientAvatar = styled.div`
  width: 36px;
  height: 36px;
  border-radius: ${({ theme }) => theme.radii.full};
  background: ${({ theme }) => theme.colors.primaryLight};
  color: ${({ theme }) => theme.colors.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${({ theme }) => theme.fonts.sizeSm};
  font-weight: ${({ theme }) => theme.fonts.weightSemi};
  flex-shrink: 0;
`;

export const PatientInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1px;
`;

export const PatientName = styled.span`
  font-size: ${({ theme }) => theme.fonts.sizeSm};
  font-weight: ${({ theme }) => theme.fonts.weightSemi};
  color: ${({ theme }) => theme.colors.textPrimary};
`;

export const PatientEmail = styled.span`
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
  color: ${({ $danger, theme }) => $danger ? theme.colors.danger : theme.colors.textSecondary};
  transition: ${({ theme }) => theme.transitions.fast};

  &:hover {
    background: ${({ theme }) => theme.colors.bgBase};
    color: ${({ $danger, theme }) => $danger ? theme.colors.danger : theme.colors.primary};
  }
`;

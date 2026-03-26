import styled from 'styled-components';

export const DetailWrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

export const StatusRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
`;

export const VerifiedBadge = styled.span`
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: ${({ theme }) => theme.colors.success};
  font-weight: 500;
`;

export const DetailRow = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 5px 0;
`;

export const DetailLabel = styled.span`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textMuted};
  font-weight: 500;
  min-width: 90px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  gap: 4px;
`;

export const DetailValue = styled.span`
  font-size: 13px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.textPrimary};
`;

export const SectionHead = styled.p`
  font-size: 11px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textMuted};
  text-transform: uppercase;
  letter-spacing: 0.6px;
  margin: 0 0 8px 0;
  display: flex;
  align-items: center;
`;

export const DiagnosisBlock = styled.div`
  background: ${({ theme }) => theme.colors.bgBase};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.sm};
  padding: 10px 14px;
  font-size: 13px;
  color: ${({ theme }) => theme.colors.textPrimary};
  line-height: 1.5;
`;

export const NotesBlock = styled.div`
  background: ${({ theme }) => theme.colors.primaryLight};
  border-left: 3px solid ${({ theme }) => theme.colors.primary};
  border-radius: ${({ theme }) => theme.radii.sm};
  padding: 10px 14px;
  font-size: 13px;
  color: ${({ theme }) => theme.colors.textPrimary};
  line-height: 1.5;
  font-style: italic;
`;

export const MedTable = styled.div`
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.sm};
  overflow: hidden;
`;

export const MedRow = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr 1.5fr 1fr;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ $header, theme }) =>
    $header ? theme.colors.bgBase : theme.colors.bgCard};

  &:last-child {
    border-bottom: none;
  }
`;

export const MedHeader = styled.div`
  padding: 7px 12px;
  font-size: 11px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textMuted};
  text-transform: uppercase;
  letter-spacing: 0.4px;
`;

export const MedCol = styled.div`
  padding: 9px 12px;
  font-size: 13px;
  color: ${({ $primary, theme }) =>
    $primary ? theme.colors.textPrimary : theme.colors.textSecondary};
  font-weight: ${({ $primary }) => ($primary ? 500 : 400)};
`;
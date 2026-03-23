import styled from 'styled-components';

export const DetailWrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const DetailRow = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 4px 0;
`;

export const DetailLabel = styled.span`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textMuted};
  font-weight: 500;
  min-width: 85px;
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

export const RecordTypePill = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 3px 12px;
  border-radius: ${({ theme }) => theme.radii.full};
  font-size: 12px;
  font-weight: 600;
  background: ${({ theme }) => theme.colors.primaryLight};
  color: ${({ theme }) => theme.colors.primary};
  text-transform: capitalize;
`;

export const DiagBlock = styled.div`
  background: ${({ theme }) => theme.colors.bgBase};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.sm};
  padding: 10px 14px;
  font-size: 13px;
  color: ${({ theme }) => theme.colors.textPrimary};
  line-height: 1.55;
`;

export const TreatBlock = styled.div`
  background: ${({ theme }) => theme.colors.bgBase};
  border-left: 3px solid ${({ theme }) => theme.colors.success};
  border-radius: ${({ theme }) => theme.radii.sm};
  padding: 10px 14px;
  font-size: 13px;
  color: ${({ theme }) => theme.colors.textPrimary};
  line-height: 1.55;
`;

export const NotesBlock = styled.div`
  background: ${({ theme }) => theme.colors.primaryLight};
  border-left: 3px solid ${({ theme }) => theme.colors.primary};
  border-radius: ${({ theme }) => theme.radii.sm};
  padding: 10px 14px;
  font-size: 13px;
  color: ${({ theme }) => theme.colors.textPrimary};
  line-height: 1.55;
  font-style: italic;
`;

export const VitalGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

export const VitalCard = styled.div`
  background: ${({ theme }) => theme.colors.bgBase};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.sm};
  padding: 10px 14px;
`;

export const VitalKey = styled.p`
  font-size: 10px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textMuted};
  text-transform: uppercase;
  letter-spacing: 0.4px;
  margin: 0 0 3px 0;
`;

export const VitalVal = styled.p`
  font-size: 15px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textPrimary};
  margin: 0;
`;
import styled from 'styled-components';

const accentColor = (theme, accent) =>
  ({ warning: theme.colors.warning, success: theme.colors.success, info: theme.colors.info }[accent] || theme.colors.primary);

export const CardsRow = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: ${({ theme }) => theme.spacing.md};
  @media (max-width: 640px) { grid-template-columns: 1fr; }
`;

export const SummaryCard = styled.div`
  background: ${({ theme }) => theme.colors.bgCard};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md};
  padding: 20px;
  border-left: 4px solid ${({ theme, $accent }) => accentColor(theme, $accent)};
`;

export const CardLabel = styled.p`
  font-size: ${({ theme }) => theme.fonts.sizeXs};
  font-weight: ${({ theme }) => theme.fonts.weightSemi};
  color: ${({ theme }) => theme.colors.textMuted};
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 8px;
`;

export const CardValue = styled.p`
  font-size: ${({ theme }) => theme.fonts.size2xl};
  font-weight: ${({ theme }) => theme.fonts.weightBold};
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-bottom: 4px;
  font-family: ${({ theme }) => theme.fonts.mono};
`;

export const CardCount = styled.p`
  font-size: ${({ theme }) => theme.fonts.sizeXs};
  color: ${({ theme }) => theme.colors.textMuted};
`;

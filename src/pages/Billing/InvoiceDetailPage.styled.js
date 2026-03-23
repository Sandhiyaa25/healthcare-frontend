import styled, { keyframes } from 'styled-components';

export const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: translateY(0); }
`;

export const DetailWrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  animation: ${fadeIn} 0.3s ease;
`;

export const BackRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const BackBtn = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  font-size: 13px;
  color: ${({ theme }) => theme.colors.primary};
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 0;
  &:hover { text-decoration: underline; }
`;

export const AddBtn = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 0 16px;
  height: 36px;
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  border: none;
  border-radius: ${({ theme }) => theme.radii.sm};
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  &:hover { background: ${({ theme }) => theme.colors.primaryDark}; }
`;

export const InvoiceHeaderCard = styled.div`
  background: ${({ theme }) => theme.colors.bgCard};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md};
  padding: 24px 28px;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
`;

export const InvoiceLabel = styled.p`
  font-size: 11px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textMuted};
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 4px;
`;

export const InvoiceNumber = styled.h1`
  font-size: 28px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.textPrimary};
  margin: 0;
`;

export const InvoiceDate = styled.p`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.textMuted};
  margin-top: 4px;
`;

export const StatusBlock = styled.div`
  display: flex;
  align-items: center;
`;

export const TwoColGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  @media (max-width: 640px) { grid-template-columns: 1fr; }
`;

export const InfoSection = styled.div`
  background: ${({ theme }) => theme.colors.bgCard};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md};
  overflow: hidden;
`;

export const SectionCard = styled.div`
  background: ${({ theme }) => theme.colors.bgCard};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md};
  overflow: hidden;
`;

export const SectionTitle = styled.div`
  padding: 12px 16px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: ${({ theme }) => theme.colors.textMuted};
  background: ${({ theme }) => theme.colors.bgBase};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

export const InfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 16px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  &:last-child { border-bottom: none; }
  font-weight: ${({ $bold }) => $bold ? 600 : 400};
`;

export const InfoLabel = styled.span`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

export const InfoValue = styled.span`
  font-size: 13px;
  color: ${({ $bold, theme }) => $bold ? theme.colors.textPrimary : theme.colors.textSecondary};
  font-weight: ${({ $bold }) => $bold ? 600 : 400};
`;

export const EmptyPayments = styled.div`
  padding: 24px;
  text-align: center;
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 13px;
`;

export const PaymentSummaryRow = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 8px 16px;
  font-size: 13px;
  color: ${({ $bold, theme }) => $bold ? theme.colors.textPrimary : theme.colors.textSecondary};
  font-weight: ${({ $bold }) => $bold ? 600 : 400};
  border-top: 1px solid ${({ theme }) => theme.colors.border};
`;

export const ErrMsg = styled.div`
  padding: 12px 16px;
  background: #FEF2F2;
  border: 1px solid #FECACA;
  border-radius: ${({ theme }) => theme.radii.sm};
  color: ${({ theme }) => theme.colors.danger};
  font-size: 13px;
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

export const Thead = styled.thead`
  background: ${({ theme }) => theme.colors.bgBase};
`;

export const Tbody = styled.tbody``;

export const Tr = styled.tr`
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  transition: background 0.12s;
  &:last-child { border: none; }
  tbody &:hover { background: ${({ theme }) => theme.colors.bgBase}; }
`;

export const Th = styled.th`
  padding: 10px 16px;
  text-align: left;
  font-size: 11px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textMuted};
  text-transform: uppercase;
  letter-spacing: 0.5px;
  white-space: nowrap;
`;

export const Td = styled.td`
  padding: 13px 16px;
  font-size: 13px;
  color: ${({ theme }) => theme.colors.textSecondary};
  white-space: nowrap;
`;

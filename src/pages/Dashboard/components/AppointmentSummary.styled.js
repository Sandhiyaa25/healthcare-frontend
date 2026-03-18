import styled from 'styled-components';

export const SummaryWrap = styled.div`
  background: ${({ theme }) => theme.colors.bgCard};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md};
  overflow: hidden;
`;

export const SummaryHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

export const SummaryTitle = styled.h3`
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textPrimary};
  display: flex;
  align-items: center;
  gap: 8px;

  .anticon { color: ${({ theme }) => theme.colors.primary}; }
`;

export const ViewAllBtn = styled.button`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.primary};
  font-weight: 500;
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px 0;
  transition: gap 0.15s;
  &:hover { text-decoration: underline; }
`;

export const TableWrap = styled.div`
  overflow-x: auto;
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
  cursor: ${({ $clickable }) => $clickable ? 'pointer' : 'default'};
  &:last-child { border-bottom: none; }
  &:hover { background: ${({ theme, $clickable }) => $clickable ? theme.colors.bgBase : 'transparent'}; }
`;

export const Th = styled.th`
  padding: 10px 20px;
  text-align: left;
  font-size: 11px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textMuted};
  text-transform: uppercase;
  letter-spacing: 0.6px;
  white-space: nowrap;
`;

export const Td = styled.td`
  padding: 13px 20px;
  font-size: 13px;
  color: ${({ theme, $muted, $bold }) =>
    $muted ? theme.colors.textMuted :
    $bold  ? theme.colors.textPrimary :
             theme.colors.textSecondary};
  font-weight: ${({ $bold }) => $bold ? 500 : 400};
  white-space: nowrap;
`;

export const StatusDot = styled.span`
  display: inline-block;
  width: 6px; height: 6px;
  border-radius: 50%;
  background: currentColor;
  margin-right: 6px;
`;

export const EmptyState = styled.div`
  padding: 48px;
  text-align: center;
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 13px;
`;

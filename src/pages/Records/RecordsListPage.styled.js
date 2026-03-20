import styled, { keyframes } from 'styled-components';

export const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: translateY(0); }
`;

export const Wrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  animation: ${fadeIn} 0.3s ease;
`;

export const TopBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
`;

export const Title = styled.h2`
  font-size: ${({ theme }) => theme.fonts?.sizeXl || '24px'};
  font-weight: 700;
  color: ${({ theme }) => theme.colors?.textPrimary || '#1e293b'};
  letter-spacing: -0.3px;
`;

export const Controls = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
`;

export const SearchBox = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  border: 1.5px solid ${({ theme }) => theme.colors?.border || '#e2e8f0'};
  border-radius: ${({ theme }) => theme.radii?.sm || '6px'};
  padding: 0 12px;
  background: ${({ theme }) => theme.colors?.bgCard || '#ffffff'};
  &:focus-within { border-color: ${({ theme }) => theme.colors?.primary || '#2563eb'}; }
`;

export const SearchInp = styled.input`
  border: none;
  outline: none;
  background: transparent;
  padding: 8px 0;
  font-size: 13px;
  color: ${({ theme }) => theme.colors?.textPrimary || '#1e293b'};
  width: 200px;
  &::placeholder { color: ${({ theme }) => theme.colors?.textMuted || '#94a3b8'}; }
`;

export const IconBtn = styled.button`
  width: 36px; height: 36px;
  border: 1.5px solid ${({ theme }) => theme.colors?.border || '#e2e8f0'};
  border-radius: ${({ theme }) => theme.radii?.sm || '6px'};
  display: flex; align-items: center; justify-content: center;
  font-size: 14px;
  color: ${({ theme }) => theme.colors?.textSecondary || '#475569'};
  background: ${({ theme }) => theme.colors?.bgCard || '#ffffff'};
  cursor: pointer;
  &:hover {
    border-color: ${({ theme }) => theme.colors?.primary || '#2563eb'};
    color: ${({ theme }) => theme.colors?.primary || '#2563eb'};
  }
`;

export const AddBtn = styled.button`
  display: flex; align-items: center; gap: 6px;
  padding: 0 16px; height: 36px;
  background: ${({ theme }) => theme.colors?.primary || '#2563eb'};
  color: white; border: none;
  border-radius: ${({ theme }) => theme.radii?.sm || '6px'};
  font-size: 13px; font-weight: 500; cursor: pointer;
  &:hover { background: ${({ theme }) => theme.colors?.primaryDark || '#1d4ed8'}; }
`;

export const Card = styled.div`
  background: ${({ theme }) => theme.colors?.bgCard || '#ffffff'};
  border: 1px solid ${({ theme }) => theme.colors?.border || '#e2e8f0'};
  border-radius: ${({ theme }) => theme.radii?.md || '8px'};
  overflow: hidden;
`;

export const TableWrap = styled.div`
  flex: 1;
  min-width: 0;
  transition: all 0.2s ease;
`;

export const Table = styled.table`width: 100%; border-collapse: collapse;`;
export const Thead = styled.thead`background: ${({ theme }) => theme.colors?.bgBase || '#f8fafc'};`;
export const Tbody = styled.tbody``;

export const Tr = styled.tr`
  border-bottom: 1px solid ${({ theme }) => theme.colors?.border || '#e2e8f0'};
  transition: background 0.12s;
  &:last-child { border: none; }
  tbody &:hover { background: ${({ theme }) => theme.colors?.bgBase || '#f8fafc'}; }
`;

export const Th = styled.th`
  padding: 10px 16px;
  text-align: left;
  font-size: 11px; font-weight: 600;
  color: ${({ theme }) => theme.colors?.textMuted || '#94a3b8'};
  text-transform: uppercase; letter-spacing: 0.5px;
  white-space: nowrap;
`;

export const Td = styled.td`
  padding: 13px 16px;
  font-size: 13px;
  color: ${({ theme }) => theme.colors?.textSecondary || '#475569'};
  white-space: nowrap;
`;

export const EmptyState = styled.div`
  padding: 60px; text-align: center;
  color: ${({ theme }) => theme.colors?.textMuted || '#94a3b8'}; font-size: 14px;
`;

export const ErrMsg = styled.div`
  padding: 12px 16px;
  background: #FEF2F2; border: 1px solid #FECACA;
  border-radius: ${({ theme }) => theme.radii?.sm || '6px'};
  color: ${({ theme }) => theme.colors?.danger || '#ef4444'}; font-size: 13px;
`;

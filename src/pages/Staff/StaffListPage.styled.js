import styled, { keyframes } from 'styled-components';

export const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: translateY(0); }
`;

export const Wrap = styled.div`
  display: flex; flex-direction: column; gap: 20px;
  animation: ${fadeIn} 0.3s ease;
`;
export const TopBar = styled.div`
  display: flex; align-items: center;
  justify-content: space-between; gap: 12px; flex-wrap: wrap;
`;
export const Title = styled.h2`
  font-size: ${({ theme }) => theme.fonts.sizeXl};
  font-weight: 700; color: ${({ theme }) => theme.colors.textPrimary};
  letter-spacing: -0.3px;
`;
export const Controls = styled.div`display: flex; align-items: center; gap: 8px; flex-wrap: wrap;`;
export const SearchBox = styled.div`
  display: flex; align-items: center; gap: 6px;
  border: 1.5px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.sm};
  padding: 0 12px; background: ${({ theme }) => theme.colors.bgCard};
  &:focus-within { border-color: ${({ theme }) => theme.colors.primary}; }
`;
export const SearchInp = styled.input`
  border: none; outline: none; background: transparent;
  padding: 8px 0; font-size: 13px;
  color: ${({ theme }) => theme.colors.textPrimary}; width: 200px;
  &::placeholder { color: ${({ theme }) => theme.colors.textMuted}; }
`;
export const IconBtn = styled.button`
  width: 36px; height: 36px;
  border: 1.5px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.sm};
  display: flex; align-items: center; justify-content: center;
  font-size: 14px; color: ${({ theme }) => theme.colors.textSecondary};
  background: ${({ theme }) => theme.colors.bgCard}; cursor: pointer;
  &:hover { border-color: ${({ theme }) => theme.colors.primary}; color: ${({ theme }) => theme.colors.primary}; }
`;
export const AddBtn = styled.button`
  display: flex; align-items: center; gap: 6px;
  padding: 0 16px; height: 36px;
  background: ${({ theme }) => theme.colors.primary};
  color: white; border: none;
  border-radius: ${({ theme }) => theme.radii.sm};
  font-size: 13px; font-weight: 500; cursor: pointer;
  &:hover { background: ${({ theme }) => theme.colors.primaryDark}; }
`;
export const Card      = styled.div`background: ${({ theme }) => theme.colors.bgCard}; border: 1px solid ${({ theme }) => theme.colors.border}; border-radius: ${({ theme }) => theme.radii.md}; overflow: hidden;`;
export const Table     = styled.table`width: 100%; border-collapse: collapse;`;
export const Thead     = styled.thead`background: ${({ theme }) => theme.colors.bgBase};`;
export const Tbody     = styled.tbody``;
export const Tr        = styled.tr`border-bottom: 1px solid ${({ theme }) => theme.colors.border}; transition: background 0.12s; &:last-child { border: none; } tbody &:hover { background: ${({ theme }) => theme.colors.bgBase}; }`;
export const Th        = styled.th`padding: 10px 16px; text-align: left; font-size: 11px; font-weight: 600; color: ${({ theme }) => theme.colors.textMuted}; text-transform: uppercase; letter-spacing: 0.5px; white-space: nowrap;`;
export const Td        = styled.td`padding: 13px 16px; font-size: 13px; color: ${({ theme }) => theme.colors.textSecondary}; white-space: nowrap;`;
export const StaffCell = styled.div`display: flex; align-items: center; gap: 10px;`;
export const Avatar    = styled.div`width: 32px; height: 32px; border-radius: 50%; background: ${({ theme }) => theme.colors.primaryLight}; color: ${({ theme }) => theme.colors.primary}; font-size: 12px; font-weight: 700; display: flex; align-items: center; justify-content: center; text-transform: uppercase; flex-shrink: 0;`;
export const SName     = styled.p`font-size: 13px; font-weight: 500; color: ${({ theme }) => theme.colors.textPrimary};`;
export const SDept     = styled.p`font-size: 11px; color: ${({ theme }) => theme.colors.textMuted};`;
export const ActCell   = styled.div`display: flex; align-items: center; gap: 6px;`;
export const ABtn      = styled.button`padding: 4px 8px; border: 1px solid ${({ theme }) => theme.colors.border}; border-radius: ${({ theme }) => theme.radii.sm}; font-size: 11px; cursor: pointer; background: transparent; color: ${({ theme }) => theme.colors.textSecondary}; display: flex; align-items: center; gap: 4px; transition: all 0.12s; &:hover { border-color: ${({ theme, $danger }) => $danger ? theme.colors.danger : theme.colors.primary}; color: ${({ theme, $danger }) => $danger ? theme.colors.danger : theme.colors.primary}; }`;
export const EmptyState= styled.div`padding: 60px; text-align: center; color: ${({ theme }) => theme.colors.textMuted}; font-size: 14px;`;
export const ErrMsg    = styled.div`padding: 12px 16px; background: #FEF2F2; border: 1px solid #FECACA; border-radius: ${({ theme }) => theme.radii.sm}; color: ${({ theme }) => theme.colors.danger}; font-size: 13px;`;
export const Overlay   = styled.div`position: fixed; inset: 0; background: rgba(0,0,0,0.45); z-index: 1000; display: flex; align-items: center; justify-content: center; padding: 16px;`;
export const Modal     = styled.div`background: ${({ theme }) => theme.colors.bgCard}; border-radius: ${({ theme }) => theme.radii.lg}; padding: 28px; width: 100%; max-width: 480px; max-height: 90vh; overflow-y: auto;`;
export const MHead     = styled.div`display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px;`;
export const MTitle    = styled.h3`font-size: 16px; font-weight: 600; color: ${({ theme }) => theme.colors.textPrimary};`;
export const CloseBtn  = styled.button`width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 18px; color: ${({ theme }) => theme.colors.textMuted}; background: ${({ theme }) => theme.colors.bgBase};`;
export const FGrid     = styled.div`display: grid; grid-template-columns: 1fr 1fr; gap: 14px;`;
export const Field     = styled.div`display: flex; flex-direction: column; gap: 5px;`;
export const Label     = styled.label`font-size: 12px; font-weight: 500; color: ${({ theme }) => theme.colors.textPrimary};`;
export const Input     = styled.input`padding: 9px 12px; border: 1.5px solid ${({ theme }) => theme.colors.border}; border-radius: ${({ theme }) => theme.radii.sm}; font-size: 13px; background: ${({ theme }) => theme.colors.bgCard}; color: ${({ theme }) => theme.colors.textPrimary}; outline: none; width: 100%; &:focus { border-color: ${({ theme }) => theme.colors.primary}; } &::placeholder { color: ${({ theme }) => theme.colors.textMuted}; }`;
export const Select    = styled.select`padding: 9px 12px; border: 1.5px solid ${({ theme }) => theme.colors.border}; border-radius: ${({ theme }) => theme.radii.sm}; font-size: 13px; background: ${({ theme }) => theme.colors.bgCard}; color: ${({ theme }) => theme.colors.textPrimary}; outline: none; width: 100%; &:focus { border-color: ${({ theme }) => theme.colors.primary}; }`;
export const BtnRow    = styled.div`display: flex; gap: 10px; justify-content: flex-end; margin-top: 24px;`;
export const CancelBtn = styled.button`padding: 8px 20px; border: 1.5px solid ${({ theme }) => theme.colors.border}; border-radius: ${({ theme }) => theme.radii.sm}; font-size: 13px; cursor: pointer; background: transparent; color: ${({ theme }) => theme.colors.textSecondary};`;
export const SaveBtn   = styled.button`padding: 8px 20px; background: ${({ theme }) => theme.colors.primary}; color: white; border: none; border-radius: ${({ theme }) => theme.radii.sm}; font-size: 13px; font-weight: 500; cursor: pointer; &:disabled { opacity: 0.6; cursor: not-allowed; }`;
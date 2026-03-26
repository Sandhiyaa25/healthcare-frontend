import styled, { keyframes } from 'styled-components';

const slideDown = keyframes`
  from { opacity: 0; transform: translateY(-8px); }
  to   { opacity: 1; transform: translateY(0); }
`;

export const PanelWrap = styled.div`
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  width: 360px;
  background: ${({ theme }) => theme.colors.bgCard};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md};
  box-shadow: 0 8px 32px ${({ theme }) => theme.colors.shadowMd};
  animation: ${slideDown} 0.2s ease both;
  z-index: 500;
  overflow: hidden;
  max-height: 520px;
  display: flex;
  flex-direction: column;
`;

export const PanelHead = styled.div`
  padding: 14px 16px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: ${({ theme }) => theme.colors.bgBase};
  flex-shrink: 0;
`;

export const PanelTitle = styled.h4`
  font-size: ${({ theme }) => theme.fonts.sizeSm};
  font-weight: ${({ theme }) => theme.fonts.weightSemi};
  color: ${({ theme }) => theme.colors.textPrimary};
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const MarkAllBtn = styled.button`
  font-size: ${({ theme }) => theme.fonts.sizeXs};
  color: ${({ theme }) => theme.colors.primary};
  background: none;
  border: none;
  cursor: pointer;
  font-weight: 500;
  padding: 0;

  &:hover { text-decoration: underline; }
`;

export const NotifList = styled.div`
  flex: 1;
  overflow-y: auto;

  &::-webkit-scrollbar { width: 4px; }
  &::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.colors.border};
    border-radius: 2px;
  }
`;

export const NotifItem = styled.div`
  padding: 12px 16px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  cursor: pointer;
  display: flex;
  gap: 12px;
  align-items: flex-start;
  transition: ${({ theme }) => theme.transitions.fast};
  background: ${({ $unread, theme }) =>
    $unread ? `${theme.colors.primary}08` : 'transparent'};

  &:hover { background: ${({ theme }) => theme.colors.bgBase}; }
  &:last-child { border-bottom: none; }
`;

export const NotifIconWrap = styled.div`
  width: 36px;
  height: 36px;
  border-radius: ${({ theme }) => theme.radii.full};
  background: ${({ $color }) => $color || '#DBEAFE'};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 15px;
  color: ${({ $iconColor }) => $iconColor || '#2563EB'};
  flex-shrink: 0;
`;

export const NotifBody = styled.div`
  flex: 1;
  min-width: 0;
`;

export const NotifTitle = styled.p`
  font-size: ${({ theme }) => theme.fonts.sizeSm};
  font-weight: ${({ $unread, theme }) =>
    $unread ? theme.fonts.weightSemi : theme.fonts.weightNormal};
  color: ${({ theme }) => theme.colors.textPrimary};
  margin: 0 0 2px 0;
  line-height: 1.4;
`;

export const NotifMessage = styled.p`
  font-size: ${({ theme }) => theme.fonts.sizeXs};
  color: ${({ theme }) => theme.colors.textSecondary};
  margin: 0 0 4px 0;
  line-height: 1.4;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
`;

export const NotifTime = styled.p`
  font-size: 10px;
  color: ${({ theme }) => theme.colors.textMuted};
  margin: 0;
`;

export const UnreadDot = styled.div`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.primary};
  flex-shrink: 0;
  margin-top: 4px;
`;

export const EmptyNotif = styled.div`
  padding: 40px 20px;
  text-align: center;
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: ${({ theme }) => theme.fonts.sizeSm};
`;

export const PanelFooter = styled.div`
  padding: 10px 16px;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  text-align: center;
  flex-shrink: 0;
`;

export const ViewAllBtn = styled.button`
  font-size: ${({ theme }) => theme.fonts.sizeSm};
  color: ${({ theme }) => theme.colors.primary};
  background: none;
  border: none;
  cursor: pointer;
  font-weight: 500;

  &:hover { text-decoration: underline; }
`;

export const BellWrap = styled.div`
  position: relative;
`;

export const UnreadBadge = styled.div`
  position: absolute;
  top: -4px;
  right: -4px;
  min-width: 16px;
  height: 16px;
  background: ${({ theme }) => theme.colors.danger};
  color: white;
  border-radius: 8px;
  font-size: 9px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 3px;
  line-height: 1;
  pointer-events: none;
`;
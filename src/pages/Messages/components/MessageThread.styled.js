import styled from 'styled-components';

export const ThreadWrap = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
`;

export const ThreadHeader = styled.div`
  padding: 12px 16px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  display: flex;
  align-items: center;
  gap: 12px;
  background: ${({ theme }) => theme.colors.bgCard};
  flex-shrink: 0;
`;

export const ThreadTitle = styled.h4`
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textPrimary};
  margin: 0;
  flex: 1;
`;

export const MessageList = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const MessageBubble = styled.div`
  max-width: 70%;
  padding: 10px 14px;
  border-radius: 12px;
  align-self: ${({ $isMine }) => ($isMine ? 'flex-end' : 'flex-start')};
  background: ${({ $isMine, theme }) =>
    $isMine ? theme.colors.primary : theme.colors.bgCard};
  border: ${({ $isMine, theme }) =>
    $isMine ? 'none' : `1px solid ${theme.colors.border}`};
  color: ${({ $isMine, theme }) =>
    $isMine ? '#ffffff' : theme.colors.textPrimary};
`;

export const BubbleHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
  flex-wrap: wrap;
`;

export const SenderName = styled.span`
  font-size: 11px;
  font-weight: 600;
  opacity: ${({ $isMine }) => ($isMine ? 0.9 : 1)};
  color: ${({ $isMine, theme }) =>
    $isMine ? 'inherit' : theme.colors.textSecondary};
`;

const TYPE_COLORS = {
  note:        { bg: '#F1F5F9', color: '#475569' },
  message:     { bg: '#DBEAFE', color: '#1D4ED8' },
  instruction: { bg: '#F3E8FF', color: '#7C3AED' },
};

export const MessageTypeTag = styled.span`
  font-size: 10px;
  padding: 1px 7px;
  border-radius: 4px;
  font-weight: 500;
  background: ${({ $type }) => (TYPE_COLORS[$type] || TYPE_COLORS.note).bg};
  color: ${({ $type }) => (TYPE_COLORS[$type] || TYPE_COLORS.note).color};
`;

export const Timestamp = styled.span`
  font-size: 11px;
  opacity: 0.6;
  margin-left: auto;
`;

export const BubbleText = styled.p`
  font-size: 13px;
  line-height: 1.5;
  white-space: pre-wrap;
  margin: 0;
`;

export const EmptyMessages = styled.div`
  text-align: center;
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 13px;
  padding: 40px 20px;
`;

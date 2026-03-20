import styled from 'styled-components';

export const NotesWrap = styled.div`
  background: ${({ theme }) => theme.colors.bgCard};
  border-radius: 10px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  overflow: hidden;
`;

export const NotesHeader = styled.div`
  padding: 14px 16px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  display: flex;
  align-items: center;
  gap: 12px;
  background: ${({ theme }) => theme.colors.bgBase};
`;

export const NotesTitle = styled.h4`
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textPrimary};
  margin: 0;
  flex: 1;
`;

export const NotesList = styled.div`
  padding: 12px 16px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-height: 360px;
  overflow-y: auto;
`;

export const NoteItem = styled.div`
  padding: 10px 14px;
  background: ${({ theme }) => theme.colors.bgBase};
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.colors.border};
`;

export const NoteTop = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
  flex-wrap: wrap;
`;

export const NoteSender = styled.span`
  font-size: 12px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const NOTE_TYPE_STYLES = {
  note:        { bg: '#F1F5F9', color: '#475569' },
  message:     { bg: '#DBEAFE', color: '#1D4ED8' },
  instruction: { bg: '#F3E8FF', color: '#7C3AED' },
};

export const NoteType = styled.span`
  font-size: 10px;
  padding: 1px 6px;
  border-radius: 4px;
  font-weight: 500;
  background: ${({ type }) => (NOTE_TYPE_STYLES[type] || NOTE_TYPE_STYLES.note).bg};
  color: ${({ type }) => (NOTE_TYPE_STYLES[type] || NOTE_TYPE_STYLES.note).color};
`;

export const NoteTime = styled.span`
  font-size: 11px;
  color: ${({ theme }) => theme.colors.textMuted};
  margin-left: auto;
`;

export const NoteText = styled.p`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.textPrimary};
  line-height: 1.5;
  white-space: pre-wrap;
  margin: 0;
`;

export const EmptyNotes = styled.div`
  text-align: center;
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 12px;
  padding: 20px;
`;

export const AddNoteRow = styled.div`
  padding: 12px 16px;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  display: flex;
  flex-direction: column;
  gap: 8px;
  background: ${({ theme }) => theme.colors.bgCard};
`;

export const AddNoteBtn = styled.button`
  align-self: flex-end;
  height: 34px;
  padding: 0 16px;
  font-size: 13px;
  font-weight: 500;
  background: ${({ disabled, theme }) =>
    disabled ? theme.colors.border : theme.colors.primary};
  color: ${({ disabled }) => (disabled ? '#94A3B8' : '#ffffff')};
  border: none;
  border-radius: 8px;
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  transition: ${({ theme }) => theme.transitions.fast};

  &:hover:not(:disabled) {
    background: ${({ theme }) => theme.colors.primaryDark};
  }
`;

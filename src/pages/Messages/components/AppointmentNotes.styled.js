import styled from 'styled-components';

export const NotesWrap = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  background: ${({ theme }) => theme.colors.bgCard};
  border-left: 1px solid ${({ theme }) => theme.colors.border};
`;

export const NotesHeader = styled.div`
  padding: 12px 16px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.bgBase};
`;

export const NotesTitle = styled.h4`
  font-size: 13px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textPrimary};
  margin: 0;
`;

export const NotesList = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const NoteItem = styled.div`
  padding: 10px 12px;
  border-radius: ${({ theme }) => theme.radii.sm};
  background: ${({ theme }) => theme.colors.bgBase};
  border: 1px solid ${({ theme }) => theme.colors.border};
`;

const NOTE_TYPE_STYLES = {
  note:        { bg: '#F1F5F9', color: '#475569' },
  message:     { bg: '#DBEAFE', color: '#1D4ED8' },
  instruction: { bg: '#F3E8FF', color: '#7C3AED' },
};

export const NoteTypeTag = styled.span`
  display: inline-block;
  font-size: 10px;
  padding: 1px 7px;
  border-radius: 4px;
  font-weight: 500;
  margin-bottom: 4px;
  background: ${({ type }) => (NOTE_TYPE_STYLES[type] || NOTE_TYPE_STYLES.note).bg};
  color: ${({ type }) => (NOTE_TYPE_STYLES[type] || NOTE_TYPE_STYLES.note).color};
`;

export const NoteText = styled.p`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.textPrimary};
  margin: 0 0 4px 0;
  line-height: 1.5;
`;

export const NoteMeta = styled.span`
  font-size: 11px;
  color: ${({ theme }) => theme.colors.textMuted};
`;

export const NoteFooter = styled.div`
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  padding: 10px 12px;
  background: ${({ theme }) => theme.colors.bgCard};
`;

export const NoteAddBtn = styled.button`
  width: 100%;
  padding: 8px;
  background: ${({ disabled, theme }) =>
    disabled ? theme.colors.border : theme.colors.primary};
  color: ${({ disabled, theme }) =>
    disabled ? theme.colors.textMuted : theme.colors.textInverse};
  border: none;
  border-radius: ${({ theme }) => theme.radii.sm};
  font-size: 13px;
  font-weight: 500;
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  transition: ${({ theme }) => theme.transitions.fast};

  &:hover:not(:disabled) {
    background: ${({ theme }) => theme.colors.primaryDark};
  }
`;

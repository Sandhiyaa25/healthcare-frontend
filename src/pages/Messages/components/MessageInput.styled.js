import styled from 'styled-components';

export const InputWrap = styled.div`
  display: flex;
  gap: 8px;
  padding: 12px 16px;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.bgCard};
  align-items: flex-end;
  flex-shrink: 0;
`;

export const SendButton = styled.button`
  height: 36px;
  padding: 0 16px;
  font-size: 13px;
  font-weight: 500;
  background: ${({ theme, disabled }) =>
    disabled ? theme.colors.border : theme.colors.primary};
  color: ${({ disabled }) => (disabled ? '#94A3B8' : '#ffffff')};
  border: none;
  border-radius: 8px;
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  display: flex;
  align-items: center;
  gap: 6px;
  flex-shrink: 0;
  transition: ${({ theme }) => theme.transitions.fast};
  white-space: nowrap;

  &:hover:not(:disabled) {
    background: ${({ theme }) => theme.colors.primaryDark};
  }
`;

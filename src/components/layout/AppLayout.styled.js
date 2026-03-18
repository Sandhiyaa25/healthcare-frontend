import styled from 'styled-components';

export const LayoutWrap = styled.div`
  display: flex;
  min-height: 100vh;
  background: ${({ theme }) => theme.colors.bgBase};
  color: ${({ theme }) => theme.colors.textPrimary};
  transition: background 0.2s ease, color 0.2s ease;
`;

export const MainArea = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
  overflow: hidden;
  background: ${({ theme }) => theme.colors.bgBase};
  transition: background 0.2s ease;
`;

export const ContentArea = styled.main`
  flex: 1;
  padding: ${({ theme }) => theme.spacing.lg};
  overflow-y: auto;
  background: ${({ theme }) => theme.colors.bgBase};
  transition: background 0.2s ease;
`;

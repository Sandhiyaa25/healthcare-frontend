import styled, { keyframes } from 'styled-components';

const spin = keyframes`
  to { transform: rotate(360deg); }
`;

const sizes = { sm: '18px', md: '32px', lg: '48px' };

export const SpinnerRing = styled.div`
  width: ${({ $size }) => sizes[$size] || sizes.md};
  height: ${({ $size }) => sizes[$size] || sizes.md};
  border: 3px solid ${({ theme }) => theme.colors.primaryLight};
  border-top-color: ${({ theme }) => theme.colors.primary};
  border-radius: 50%;
  animation: ${spin} 0.7s linear infinite;
`;

export const SpinnerWrap = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  ${({ $fullPage }) => $fullPage && `
    position: fixed; inset: 0; background: rgba(255,255,255,0.7); z-index: 9999;
  `}
`;

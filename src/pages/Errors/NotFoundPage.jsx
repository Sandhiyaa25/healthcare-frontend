import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';


const Wrap = styled.div`
  display: flex; flex-direction: column; align-items: center;
  justify-content: center; height: 100vh; gap: 16px; padding: 40px;
  background: ${({ theme }) => theme.colors.bgBase};
`;
const Code = styled.p`
  font-size: 80px; font-weight: 800;
  color: ${({ theme }) => theme.colors.primaryLight};
  line-height: 1;
`;
const Title = styled.h2`
  font-size: ${({ theme }) => theme.fonts.sizeXl};
  font-weight: ${({ theme }) => theme.fonts.weightBold};
  color: ${({ theme }) => theme.colors.textPrimary};
`;
const Sub = styled.p`color: ${({ theme }) => theme.colors.textSecondary};`;
const Btn = styled.button`
  margin-top: 8px; padding: 10px 24px;
  background: ${({ theme }) => theme.colors.primary}; color: white;
  border-radius: ${({ theme }) => theme.radii.sm};
  font-weight: ${({ theme }) => theme.fonts.weightMedium};
  cursor: pointer; &:hover { opacity: 0.88; }
`;

const NotFoundPage = () => {
  const nav = useNavigate();
  return (
    <Wrap>
      <Code>404</Code>
      <Title>Page Not Found</Title>
      <Sub>The page you are looking for does not exist.</Sub>
      <Btn onClick={() => nav('/dashboard')}>Go to Dashboard</Btn>
    </Wrap>
  );
};
export default NotFoundPage;

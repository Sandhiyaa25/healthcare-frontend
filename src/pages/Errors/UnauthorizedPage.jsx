import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { StopOutlined } from '@ant-design/icons';

const Wrap = styled.div`
  display: flex; flex-direction: column; align-items: center;
  justify-content: center; height: 100%; gap: 16px; padding: 40px;
`;
const Icon = styled.div`
  font-size: 56px; color: ${({ theme }) => theme.colors.danger};
`;
const Title = styled.h2`
  font-size: ${({ theme }) => theme.fonts.sizeXl};
  font-weight: ${({ theme }) => theme.fonts.weightBold};
  color: ${({ theme }) => theme.colors.textPrimary};
`;
const Sub = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: ${({ theme }) => theme.fonts.sizeSm};
`;
const Btn = styled.button`
  margin-top: 8px; padding: 10px 24px;
  background: ${({ theme }) => theme.colors.primary}; color: white;
  border-radius: ${({ theme }) => theme.radii.sm};
  font-weight: ${({ theme }) => theme.fonts.weightMedium};
  font-size: ${({ theme }) => theme.fonts.sizeBase};
  cursor: pointer;
  &:hover { opacity: 0.88; }
`;

const UnauthorizedPage = () => {
  const nav = useNavigate();
  return (
    <Wrap>
      <Icon><StopOutlined /></Icon>
      <Title>Access Denied</Title>
      <Sub>You do not have permission to view this page.</Sub>
      <Btn onClick={() => nav('/dashboard')}>Back to Dashboard</Btn>
    </Wrap>
  );
};
export default UnauthorizedPage;

import React from 'react';
import styled from 'styled-components';
import { WarningOutlined } from '@ant-design/icons';

const Wrap = styled.div`
  display: flex; flex-direction: column; align-items: center;
  justify-content: center; height: 100vh; gap: 16px; padding: 40px;
  background: ${({ theme }) => theme.colors.bgBase};
`;
const Icon = styled.div`font-size: 56px; color: ${({ theme }) => theme.colors.warning};`;
const Title = styled.h2`
  font-size: ${({ theme }) => theme.fonts.sizeXl};
  font-weight: ${({ theme }) => theme.fonts.weightBold};
  color: ${({ theme }) => theme.colors.textPrimary};
`;
const Sub = styled.p`color: ${({ theme }) => theme.colors.textSecondary};`;

const ErrorPage = ({ message = 'Something went wrong.' }) => (
  <Wrap>
    <Icon><WarningOutlined /></Icon>
    <Title>Application Error</Title>
    <Sub>{message}</Sub>
  </Wrap>
);
export default ErrorPage;

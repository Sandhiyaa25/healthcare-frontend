import React, { useState } from 'react';
import styled from 'styled-components';
import { SafetyCertificateOutlined, ClockCircleOutlined, KeyOutlined, CheckCircleOutlined } from '@ant-design/icons';


const Wrap  = styled.div`display: flex; flex-direction: column; gap: 24px;`;
const Title = styled.h3`font-size: ${({ t }) => t?.fonts?.sizeLg || '18px'}; font-weight: 600; color: ${({ theme }) => theme.colors.textPrimary}; margin-bottom: 4px;`;
const Sub   = styled.p` font-size: 13px; color: ${({ theme }) => theme.colors.textSecondary}; margin-bottom: 20px;`;

const Card = styled.div`
  background: ${({ theme }) => theme.colors.bgBase};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md};
  padding: 20px;
`;

const CardTitle = styled.div`
  display: flex; align-items: center; gap: 10px;
  font-size: 14px; font-weight: 600;
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-bottom: 8px;
`;

const CardDesc = styled.p`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: 14px;
`;

const StatusBadge = styled.span`
  display: inline-flex; align-items: center; gap: 5px;
  font-size: 11px; font-weight: 600;
  padding: 3px 10px; border-radius: 999px;
  background: ${({ $on, theme }) => $on ? '#DCFCE7' : '#FEE2E2'};
  color: ${({ $on, theme }) => $on ? theme.colors.success : theme.colors.danger};
`;

const Select = styled.select`
  padding: 8px 12px;
  border: 1.5px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.sm};
  font-size: 13px;
  background: ${({ theme }) => theme.colors.bgCard};
  color: ${({ theme }) => theme.colors.textPrimary};
  cursor: pointer;
`;

const SECURITY_FEATURES = [
  { icon: <SafetyCertificateOutlined />,       label: 'CSRF Protection',     desc: 'All mutating requests require a CSRF token validated server-side.',    on: true  },
  { icon: <KeyOutlined />,          label: 'JWT Authentication',  desc: 'Short-lived access tokens (from .env) with HttpOnly refresh cookies.', on: true  },
  { icon: <CheckCircleOutlined />,  label: 'Audit Logging',       desc: 'All user actions are logged with IP address and user agent.',          on: true  },
];

const SecuritySettings = () => {
  const [idleTimeout, setIdleTimeout] = useState(30);

  return (
    <Wrap>
      <div>
        <Title>Security</Title>
        <Sub>Your security configuration. Most settings are managed server-side.</Sub>
      </div>

      {SECURITY_FEATURES.map((f, i) => (
        <Card key={i}>
          <CardTitle>{f.icon} {f.label} <StatusBadge $on={f.on}>{f.on ? 'Active' : 'Inactive'}</StatusBadge></CardTitle>
          <CardDesc>{f.desc}</CardDesc>
        </Card>
      ))}

      <Card>
        <CardTitle><ClockCircleOutlined /> Auto Logout (Idle)</CardTitle>
        <CardDesc>Automatically log out after a period of inactivity.</CardDesc>
        <Select value={idleTimeout} onChange={(e) => setIdleTimeout(Number(e.target.value))}>
          <option value={15}>15 minutes</option>
          <option value={30}>30 minutes</option>
          <option value={60}>1 hour</option>
          <option value={120}>2 hours</option>
        </Select>
      </Card>
    </Wrap>
  );
};

export default SecuritySettings;

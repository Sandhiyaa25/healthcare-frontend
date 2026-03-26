// import React, { useState } from 'react';
// import styled from 'styled-components';
// import { SafetyCertificateOutlined, ClockCircleOutlined, KeyOutlined, CheckCircleOutlined } from '@ant-design/icons';


// const Wrap  = styled.div`display: flex; flex-direction: column; gap: 24px;`;
// const Title = styled.h3`font-size: ${({ t }) => t?.fonts?.sizeLg || '18px'}; font-weight: 600; color: ${({ theme }) => theme.colors.textPrimary}; margin-bottom: 4px;`;
// const Sub   = styled.p` font-size: 13px; color: ${({ theme }) => theme.colors.textSecondary}; margin-bottom: 20px;`;

// const Card = styled.div`
//   background: ${({ theme }) => theme.colors.bgBase};
//   border: 1px solid ${({ theme }) => theme.colors.border};
//   border-radius: ${({ theme }) => theme.radii.md};
//   padding: 20px;
// `;

// const CardTitle = styled.div`
//   display: flex; align-items: center; gap: 10px;
//   font-size: 14px; font-weight: 600;
//   color: ${({ theme }) => theme.colors.textPrimary};
//   margin-bottom: 8px;
// `;

// const CardDesc = styled.p`
//   font-size: 13px;
//   color: ${({ theme }) => theme.colors.textSecondary};
//   margin-bottom: 14px;
// `;

// const StatusBadge = styled.span`
//   display: inline-flex; align-items: center; gap: 5px;
//   font-size: 11px; font-weight: 600;
//   padding: 3px 10px; border-radius: 999px;
//   background: ${({ $on, theme }) => $on ? '#DCFCE7' : '#FEE2E2'};
//   color: ${({ $on, theme }) => $on ? theme.colors.success : theme.colors.danger};
// `;

// const Select = styled.select`
//   padding: 8px 12px;
//   border: 1.5px solid ${({ theme }) => theme.colors.border};
//   border-radius: ${({ theme }) => theme.radii.sm};
//   font-size: 13px;
//   background: ${({ theme }) => theme.colors.bgCard};
//   color: ${({ theme }) => theme.colors.textPrimary};
//   cursor: pointer;
// `;

// const SECURITY_FEATURES = [
//   { icon: <SafetyCertificateOutlined />,       label: 'CSRF Protection',     desc: 'All mutating requests require a CSRF token validated server-side.',    on: true  },
//   { icon: <KeyOutlined />,          label: 'JWT Authentication',  desc: 'Short-lived access tokens (from .env) with HttpOnly refresh cookies.', on: true  },
//   { icon: <CheckCircleOutlined />,  label: 'Audit Logging',       desc: 'All user actions are logged with IP address and user agent.',          on: true  },
// ];

// const SecuritySettings = () => {
//   const [idleTimeout, setIdleTimeout] = useState(30);

//   return (
//     <Wrap>
//       <div>
//         <Title>Security</Title>
//         <Sub>Your security configuration. Most settings are managed server-side.</Sub>
//       </div>

//       {SECURITY_FEATURES.map((f, i) => (
//         <Card key={i}>
//           <CardTitle>{f.icon} {f.label} <StatusBadge $on={f.on}>{f.on ? 'Active' : 'Inactive'}</StatusBadge></CardTitle>
//           <CardDesc>{f.desc}</CardDesc>
//         </Card>
//       ))}

//       <Card>
//         <CardTitle><ClockCircleOutlined /> Auto Logout (Idle)</CardTitle>
//         <CardDesc>Automatically log out after a period of inactivity.</CardDesc>
//         <Select value={idleTimeout} onChange={(e) => setIdleTimeout(Number(e.target.value))}>
//           <option value={15}>15 minutes</option>
//           <option value={30}>30 minutes</option>
//           <option value={60}>1 hour</option>
//           <option value={120}>2 hours</option>
//         </Select>
//       </Card>
//     </Wrap>
//   );
// };

// export default SecuritySettings;

import React, { useState } from 'react';
import styled from 'styled-components';
import {
  SafetyCertificateOutlined, ClockCircleOutlined,
  KeyOutlined, CheckCircleOutlined, SaveOutlined,
} from '@ant-design/icons';
import axiosInstance from '../../../api/axiosInstance';
import useTenant     from '../../../hooks/useTenant';
import { useDispatch } from 'react-redux';
import { setTenant } from '../../../store/auth/authSlice';
import { idbSet, IDB_KEYS } from '../../../utils/indexedDB';

// ─── Styled ───────────────────────────────────────────────────────────────────
const Wrap      = styled.div`display: flex; flex-direction: column; gap: 24px;`;
const Title     = styled.h3`font-size: 16px; font-weight: 600; color: ${({ theme }) => theme.colors.textPrimary}; margin-bottom: 4px;`;
const Sub       = styled.p`font-size: 13px; color: ${({ theme }) => theme.colors.textSecondary}; margin-bottom: 20px;`;
const Card      = styled.div`
  background:    ${({ theme }) => theme.colors.bgBase};
  border:        1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md};
  padding:       20px;
`;
const CardTitle = styled.div`
  display: flex; align-items: center; gap: 10px;
  font-size: 14px; font-weight: 600;
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-bottom: 8px;
`;
const CardDesc  = styled.p`font-size: 13px; color: ${({ theme }) => theme.colors.textSecondary}; margin-bottom: 14px;`;
const StatusBadge = styled.span`
  display: inline-flex; align-items: center; gap: 5px;
  font-size: 11px; font-weight: 600;
  padding: 3px 10px; border-radius: 999px;
  background: ${({ $on }) => $on ? '#DCFCE7' : '#FEE2E2'};
  color:      ${({ $on, theme }) => $on ? theme.colors.success : theme.colors.danger};
`;
const Row       = styled.div`display: flex; align-items: center; gap: 12px; flex-wrap: wrap;`;
const Select    = styled.select`
  padding: 8px 12px;
  border: 1.5px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.sm};
  font-size: 13px;
  background: ${({ theme }) => theme.colors.bgCard};
  color:      ${({ theme }) => theme.colors.textPrimary};
  cursor: pointer;
  min-width: 160px;
`;
const SaveBtn   = styled.button`
  display: flex; align-items: center; gap: 6px;
  padding: 8px 18px;
  background:    ${({ theme }) => theme.colors.primary};
  color: white; border: none;
  border-radius: ${({ theme }) => theme.radii.sm};
  font-size: 13px; font-weight: 500; cursor: pointer;
  &:disabled { opacity: 0.6; cursor: not-allowed; }
  &:hover:not(:disabled) { background: ${({ theme }) => theme.colors.primaryDark}; }
`;
const SuccessMsg = styled.p`font-size: 12px; color: ${({ theme }) => theme.colors.success}; font-weight: 500;`;
const ErrMsg     = styled.p`font-size: 12px; color: ${({ theme }) => theme.colors.danger}; font-weight: 500;`;
const CurrentVal = styled.span`
  font-size: 12px; color: ${({ theme }) => theme.colors.textMuted};
  padding: 4px 10px;
  background: ${({ theme }) => theme.colors.bgCard};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.sm};
`;

// ─── Security feature list ────────────────────────────────────────────────────
const SECURITY_FEATURES = [
  { icon: <SafetyCertificateOutlined />, label: 'CSRF Protection',    desc: 'All mutating requests require a CSRF token validated server-side.',    on: true },
  { icon: <KeyOutlined />,              label: 'JWT Authentication',  desc: 'Short-lived access tokens with HttpOnly refresh cookies.',             on: true },
  { icon: <CheckCircleOutlined />,      label: 'Audit Logging',       desc: 'All user actions are logged with IP address and user agent.',          on: true },
];

// ─── Component ────────────────────────────────────────────────────────────────
const SecuritySettings = () => {
  const dispatch = useDispatch();
  const tenant   = useTenant();

  // Load current timeout from tenant config, default 60 min
  const currentTimeout = tenant?.session_timeout_minutes ?? 60;
  const [selected, setSelected] = useState(currentTimeout);
  const [saving,   setSaving]   = useState(false);
  const [msg,      setMsg]      = useState(null);
  const [err,      setErr]      = useState(null);

  const handleSave = async () => {
    setSaving(true); setMsg(null); setErr(null);
    try {
      await axiosInstance.put('/api/settings/session-timeout', {
        session_timeout_minutes: selected,
      });

      // Update tenant in Redux + IDB so AppLayout picks it up immediately
      const updated = { ...tenant, session_timeout_minutes: selected };
      dispatch(setTenant(updated));
      await idbSet(IDB_KEYS.TENANT, updated);

      setMsg(`Session timeout updated to ${selected} minutes. Takes effect on next login.`);
    } catch (e) {
      setErr(e?.response?.data?.message || 'Failed to save. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Wrap>
      <div>
        <Title>Security</Title>
        <Sub>Security configuration for your hospital. Most settings are managed server-side.</Sub>
      </div>

      {/* ── Active Security Features ──────────────────────────────── */}
      {SECURITY_FEATURES.map((f, i) => (
        <Card key={i}>
          <CardTitle>
            {f.icon} {f.label}
            <StatusBadge $on={f.on}>{f.on ? '✓ Active' : 'Inactive'}</StatusBadge>
          </CardTitle>
          <CardDesc>{f.desc}</CardDesc>
        </Card>
      ))}

      {/* ── Auto Logout (Per-Tenant) ───────────────────────────────── */}
      <Card>
        <CardTitle>
          <ClockCircleOutlined /> Auto Logout (Idle)
        </CardTitle>
        <CardDesc>
          Automatically log out all users in this hospital after a period of inactivity.
          This setting applies to every role in your tenant.
        </CardDesc>

        <Row>
          <Select
            value={selected}
            onChange={(e) => setSelected(Number(e.target.value))}
          >
            <option value={15}>15 minutes</option>
            <option value={30}>30 minutes</option>
            <option value={60}>1 hour</option>
            <option value={120}>2 hours</option>
            <option value={240}>4 hours</option>
            <option value={480}>8 hours</option>
          </Select>

          <SaveBtn onClick={handleSave} disabled={saving}>
            <SaveOutlined />
            {saving ? 'Saving...' : 'Save Timeout'}
          </SaveBtn>

          <CurrentVal>Current: {currentTimeout} min</CurrentVal>
        </Row>

        {msg && <SuccessMsg style={{ marginTop: 10 }}>✓ {msg}</SuccessMsg>}
        {err && <ErrMsg     style={{ marginTop: 10 }}>✗ {err}</ErrMsg>}
      </Card>
    </Wrap>
  );
};

export default SecuritySettings; 
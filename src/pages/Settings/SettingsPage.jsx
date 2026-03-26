// import React, { useState } from 'react';
// import styled from 'styled-components';
// import SecuritySettings from './components/SecuritySettings';
// import ThemeSettings    from './components/ThemeSettings';
// import { SafetyOutlined, BgColorsOutlined, LinkOutlined } from '@ant-design/icons';
// import { useNavigate } from 'react-router-dom';
// import useAuth from '../../hooks/useAuth';

// const Wrap    = styled.div`display: flex; gap: ${({ theme }) => theme.spacing.lg}; min-height: calc(100vh - 120px);`;
// const TabList = styled.div`width: 200px; flex-shrink: 0; display: flex; flex-direction: column; gap: 4px;`;
// const Tab     = styled.button`
//   display: flex; align-items: center; gap: 10px;
//   padding: 10px 14px;
//   border-radius: ${({ theme }) => theme.radii.sm};
//   font-size: ${({ theme }) => theme.fonts.sizeSm};
//   font-weight: ${({ theme }) => theme.fonts.weightMedium};
//   color: ${({ theme, $active }) => $active ? theme.colors.primary : theme.colors.textSecondary};
//   background: ${({ theme, $active }) => $active ? theme.colors.primaryLight : 'transparent'};
//   border: none; cursor: pointer; width: 100%; text-align: left;
//   transition: ${({ theme }) => theme.transitions.fast};
//   &:hover { background: ${({ theme }) => theme.colors.bgBase}; }
// `;
// const Content = styled.div`
//   flex: 1; background: ${({ theme }) => theme.colors.bgCard};
//   border: 1px solid ${({ theme }) => theme.colors.border};
//   border-radius: ${({ theme }) => theme.radii.md};
//   padding: ${({ theme }) => theme.spacing.lg};
// `;
// const LinkCard = styled.div`
//   display: flex; align-items: center; justify-content: space-between;
//   padding: 16px 20px; margin-bottom: 12px;
//   background: ${({ theme }) => theme.colors.bgBase};
//   border: 1px solid ${({ theme }) => theme.colors.border};
//   border-radius: ${({ theme }) => theme.radii.md};
//   cursor: pointer; transition: ${({ theme }) => theme.transitions.fast};
//   &:hover { border-color: ${({ theme }) => theme.colors.primary}; }
// `;
// const LinkCardTitle = styled.p`font-size: 14px; font-weight: 600; color: ${({ theme }) => theme.colors.textPrimary}; margin-bottom: 4px;`;
// const LinkCardDesc  = styled.p`font-size: 12px; color: ${({ theme }) => theme.colors.textSecondary};`;

// const SettingsPage = () => {
//   const { role }  = useAuth();
//   const navigate  = useNavigate();
//   const isAdmin   = role === 'admin';
//   const [active, setActive] = useState('theme');

//   const TABS = [
//     { key: 'theme',    label: 'Appearance', icon: <BgColorsOutlined /> },
//     // Security tab only for admin
//     ...(isAdmin ? [{ key: 'security', label: 'Security', icon: <SafetyOutlined /> }] : []),
//   ];

//   return (
//     <Wrap>
//       <TabList>
//         {TABS.map((t) => (
//           <Tab key={t.key} $active={active === t.key} onClick={() => setActive(t.key)}>
//             {t.icon} {t.label}
//           </Tab>
//         ))}
//       </TabList>
//       <Content>
//         {active === 'theme'    && <ThemeSettings />}
//         {active === 'security' && isAdmin && (
//           <>
//             <SecuritySettings />
//             <div style={{ marginTop: 24 }}>
//               <LinkCard onClick={() => navigate('/users')}>
//                 <div>
//                   <LinkCardTitle>User Management</LinkCardTitle>
//                   <LinkCardDesc>Create, edit and manage hospital users and roles</LinkCardDesc>
//                 </div>
//                 <LinkOutlined style={{ fontSize: 18, color: '#94A3B8' }} />
//               </LinkCard>
//               <LinkCard onClick={() => navigate('/staff')}>
//                 <div>
//                   <LinkCardTitle>Staff Management</LinkCardTitle>
//                   <LinkCardDesc>Manage staff profiles, departments and specializations</LinkCardDesc>
//                 </div>
//                 <LinkOutlined style={{ fontSize: 18, color: '#94A3B8' }} />
//               </LinkCard>
//             </div>
//           </>
//         )}
//       </Content>
//     </Wrap>
//   );
// };

// export default SettingsPage;

import React, { useState } from 'react';
import styled from 'styled-components';
import SecuritySettings from './components/SecuritySettings';
import ThemeSettings    from './components/ThemeSettings';
import BrandingSettings from './components/BrandingSettings';
import {
  SafetyOutlined, BgColorsOutlined,
  LinkOutlined, ShopOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

// ─── Styled ───────────────────────────────────────────────────────────────────
const Wrap    = styled.div`
  display: flex; gap: ${({ theme }) => theme.spacing.lg};
  min-height: calc(100vh - 120px);
`;
const TabList = styled.div`
  width: 200px; flex-shrink: 0;
  display: flex; flex-direction: column; gap: 4px;
`;
const Tab     = styled.button`
  display: flex; align-items: center; gap: 10px;
  padding: 10px 14px;
  border-radius: ${({ theme }) => theme.radii.sm};
  font-size:   ${({ theme }) => theme.fonts.sizeSm};
  font-weight: ${({ theme }) => theme.fonts.weightMedium};
  color:      ${({ theme, $active }) => $active ? theme.colors.primary : theme.colors.textSecondary};
  background: ${({ theme, $active }) => $active ? theme.colors.primaryLight : 'transparent'};
  border: none; cursor: pointer; width: 100%; text-align: left;
  transition: ${({ theme }) => theme.transitions.fast};
  &:hover { background: ${({ theme }) => theme.colors.bgBase}; }
`;
const Content = styled.div`
  flex: 1;
  background:    ${({ theme }) => theme.colors.bgCard};
  border:        1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md};
  padding:       ${({ theme }) => theme.spacing.lg};
`;
const LinkCard = styled.div`
  display: flex; align-items: center; justify-content: space-between;
  padding: 16px 20px; margin-bottom: 12px;
  background:    ${({ theme }) => theme.colors.bgBase};
  border:        1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md};
  cursor: pointer; transition: ${({ theme }) => theme.transitions.fast};
  &:hover { border-color: ${({ theme }) => theme.colors.primary}; }
`;
const LinkCardTitle = styled.p`
  font-size: 14px; font-weight: 600;
  color: ${({ theme }) => theme.colors.textPrimary}; margin-bottom: 4px;
`;
const LinkCardDesc = styled.p`
  font-size: 12px; color: ${({ theme }) => theme.colors.textSecondary};
`;

// ─── Component ────────────────────────────────────────────────────────────────
const SettingsPage = () => {
  const { role }  = useAuth();
  const navigate  = useNavigate();
  const isAdmin   = role === 'admin';

  const [active, setActive] = useState('theme');

  const TABS = [
    { key: 'theme',    label: 'Appearance', icon: <BgColorsOutlined /> },
    ...(isAdmin ? [
      { key: 'branding', label: 'Branding',   icon: <ShopOutlined />    },
      { key: 'security', label: 'Security',   icon: <SafetyOutlined />  },
    ] : []),
  ];

  return (
    <Wrap>
      <TabList>
        {TABS.map((t) => (
          <Tab key={t.key} $active={active === t.key} onClick={() => setActive(t.key)}>
            {t.icon} {t.label}
          </Tab>
        ))}
      </TabList>

      <Content>
        {active === 'theme'    && <ThemeSettings />}

        {active === 'branding' && isAdmin && <BrandingSettings />}

        {active === 'security' && isAdmin && (
          <>
            <SecuritySettings />
            <div style={{ marginTop: 24 }}>
              <LinkCard onClick={() => navigate('/users')}>
                <div>
                  <LinkCardTitle>User Management</LinkCardTitle>
                  <LinkCardDesc>Create, edit and manage hospital users and roles</LinkCardDesc>
                </div>
                <LinkOutlined style={{ fontSize: 18, color: '#94A3B8' }} />
              </LinkCard>
              <LinkCard onClick={() => navigate('/staff')}>
                <div>
                  <LinkCardTitle>Staff Management</LinkCardTitle>
                  <LinkCardDesc>Manage staff profiles, departments and specializations</LinkCardDesc>
                </div>
                <LinkOutlined style={{ fontSize: 18, color: '#94A3B8' }} />
              </LinkCard>
            </div>
          </>
        )}
      </Content>
    </Wrap>
  );
};

export default SettingsPage;
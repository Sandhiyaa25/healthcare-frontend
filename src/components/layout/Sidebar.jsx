// import React from 'react';
// import { useNavigate, useLocation } from 'react-router-dom';
// import {
//   SidebarWrap, Brand, BrandLogo, BrandName, NavLabel,
//   NavItem, NavIcon, NavText, CollapseBtn, UserInfo, UserAvatar,
//   UserMeta, UserName, UserRole,
// } from './Sidebar.styled';
// import {
//   DashboardOutlined, TeamOutlined, CalendarOutlined,
//   FileTextOutlined, DollarOutlined, UserOutlined,
//   MessageOutlined, SettingOutlined, MenuFoldOutlined,
//   MenuUnfoldOutlined, MedicineBoxOutlined, ExperimentOutlined,
//   HeartOutlined,
// } from '@ant-design/icons';
// import useAuth from '../../hooks/useAuth';

// // ─── Nav config per role ─────────────────────────────────────────────────────
// const NAV_ITEMS = [
//   // MAIN
//   { section: 'Main' },
//   { key: '/dashboard', label: 'Dashboard', icon: <DashboardOutlined />, roles: [] }, // all roles

//   // CLINICAL
//   { section: 'Clinical' },
//   { key: '/patients',      label: 'Patients',       icon: <TeamOutlined />,         roles: ['admin','doctor','nurse','receptionist'] },
//   { key: '/appointments',  label: 'Appointments',   icon: <CalendarOutlined />,     roles: ['admin','doctor','nurse','receptionist','patient'] },
//   { key: '/prescriptions', label: 'Prescriptions',  icon: <ExperimentOutlined />,   roles: ['admin','doctor','nurse','pharmacist','patient'] },
//   { key: '/records',       label: 'Medical Records',icon: <MedicineBoxOutlined />,  roles: ['admin','doctor','nurse'] },

//   // OPERATIONS
//   { section: 'Operations' },
//   { key: '/billing',   label: 'Billing',   icon: <DollarOutlined />,  roles: ['admin','receptionist','patient'] },
//   { key: '/staff',     label: 'Staff',     icon: <UserOutlined />,    roles: ['admin'] },
//   { key: '/calendar',  label: 'Calendar',  icon: <CalendarOutlined />,roles: ['admin','doctor','nurse','receptionist','patient'] },
//   { key: '/messages',  label: 'Messages',  icon: <MessageOutlined />, roles: ['admin','doctor','nurse','receptionist','patient'] },



//   // ADMIN
//   { section: 'Admin' },
//   { key: '/users',    label: 'Users',    icon: <FileTextOutlined />, roles: ['admin'] },
//   { key: '/settings', label: 'Settings', icon: <SettingOutlined />,  roles: [] },

//   // { key: '/profile', label: 'My Profile', icon: <UserOutlined />, roles: [] },
// ];

// const Sidebar = ({ collapsed, onToggle }) => {
//   const { pathname } = useLocation();
//   const navigate     = useNavigate();
//   const { user, role } = useAuth();

//   // Filter nav items for current role
//   const visibleItems = NAV_ITEMS.filter((item) => {
//     if (item.section) return true; // sections handled below
//     if (!item.roles || item.roles.length === 0) return true; // all roles
//     return item.roles.includes(role);
//   });

//   // Remove orphan sections (section with no visible items after it)
//   const filteredNav = visibleItems.filter((item, idx) => {
//     if (!item.section) return true;
//     // Check if next non-section item is visible
//     for (let i = idx + 1; i < visibleItems.length; i++) {
//       if (visibleItems[i].section) break;
//       if (!visibleItems[i].section) return true;
//     }
//     return false;
//   });

//   return (
//     <SidebarWrap $collapsed={collapsed}>
//       <Brand $collapsed={collapsed}>
//         <BrandLogo>HC</BrandLogo>
//         {!collapsed && <BrandName>HealthCare</BrandName>}
//       </Brand>

//       <nav style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden' }}>
//         {filteredNav.map((item, idx) => {
//           if (item.section) {
//             return !collapsed
//               ? <NavLabel key={`sec-${idx}`}>{item.section}</NavLabel>
//               : <div key={`sec-${idx}`} style={{ height: 8 }} />;
//           }
//           const active = pathname === item.key || pathname.startsWith(item.key + '/');
//           return (
//             <NavItem
//               key={item.key}
//               $active={active}
//               $collapsed={collapsed}
//               onClick={() => navigate(item.key)}
//               title={collapsed ? item.label : undefined}
//             >
//               <NavIcon $active={active}>{item.icon}</NavIcon>
//               {!collapsed && <NavText>{item.label}</NavText>}
//             </NavItem>
//           );
//         })}
//       </nav>

//       {!collapsed && (
//         <UserInfo>
//           <UserAvatar>{user?.first_name?.[0] || user?.username?.[0] || 'U'}</UserAvatar>
//           <UserMeta>
//             <UserName>
//               {user?.first_name
//                 ? `${user.first_name} ${user.last_name || ''}`.trim()
//                 : user?.username}
//             </UserName>
//             <UserRole>{role}</UserRole>
//           </UserMeta>
//         </UserInfo>
//       )}

//       <CollapseBtn onClick={onToggle} title={collapsed ? 'Expand' : 'Collapse'}>
//         {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
//       </CollapseBtn>
//     </SidebarWrap>
//   );
// };

// export default Sidebar;

import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTheme as useStyledTheme } from 'styled-components';
import {
  SidebarWrap, Brand, BrandLogo, BrandName, NavLabel,
  NavItem, NavIcon, NavText, CollapseBtn, UserInfo, UserAvatar,
  UserMeta, UserName, UserRole,
} from './Sidebar.styled';
import {
  DashboardOutlined, TeamOutlined, CalendarOutlined,
  FileTextOutlined, DollarOutlined, UserOutlined,
  MessageOutlined, SettingOutlined, MenuFoldOutlined,
  MenuUnfoldOutlined, MedicineBoxOutlined, ExperimentOutlined,
} from '@ant-design/icons';
import useAuth from '../../hooks/useAuth';

// ─── Nav config ───────────────────────────────────────────────────────────────
const NAV_ITEMS = [
  { section: 'Main' },
  { key: '/dashboard', label: 'Dashboard', icon: <DashboardOutlined />, roles: [] },

  { section: 'Clinical' },
  { key: '/patients',      label: 'Patients',        icon: <TeamOutlined />,         roles: ['admin','doctor','nurse','receptionist'] },
  { key: '/appointments',  label: 'Appointments',    icon: <CalendarOutlined />,     roles: ['admin','doctor','nurse','receptionist','patient'] },
  { key: '/prescriptions', label: 'Prescriptions',   icon: <ExperimentOutlined />,   roles: ['admin','doctor','nurse','pharmacist'] },
  { key: '/records',       label: 'Medical Records', icon: <MedicineBoxOutlined />,  roles: ['admin','doctor','nurse'] },

  { section: 'Operations' },
  { key: '/billing',  label: 'Billing',   icon: <DollarOutlined />,  roles: ['admin','receptionist'] },
  { key: '/staff',    label: 'Staff',     icon: <UserOutlined />,    roles: ['admin'] },
  { key: '/calendar', label: 'Calendar',  icon: <CalendarOutlined />,roles: ['admin','doctor','nurse','receptionist','patient'] },
  { key: '/messages', label: 'Messages',  icon: <MessageOutlined />, roles: ['admin','doctor','nurse','receptionist','patient'] },

  { section: 'Admin' },
  { key: '/users',    label: 'Users',     icon: <FileTextOutlined />, roles: ['admin'] },
  { key: '/settings', label: 'Settings',  icon: <SettingOutlined />,  roles: [] },
  { key: '/profile',  label: 'My Profile',icon: <UserOutlined />,     roles: [] },
];

// ─── Derive 2-letter initials from tenant name ────────────────────────────────
const getInitials = (name) => {
  if (!name) return 'HC';
  const words = name.trim().split(/\s+/);
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return (words[0][0] + words[1][0]).toUpperCase();
};

// ─── Component ────────────────────────────────────────────────────────────────
const Sidebar = ({ collapsed, onToggle }) => {
  const { pathname }       = useLocation();
  const navigate           = useNavigate();
  const { user, role }     = useAuth();
  const styledTheme        = useStyledTheme();

  // Tenant branding from theme context
  const tenantName    = styledTheme?.branding?.name    || 'HealthCare';
  const initials      = getInitials(tenantName);

  // Filter nav items for current role
  const visibleItems = NAV_ITEMS.filter((item) => {
    if (item.section) return true;
    if (!item.roles || item.roles.length === 0) return true;
    return item.roles.includes(role);
  });

  // Remove orphan sections
  const filteredNav = visibleItems.filter((item, idx) => {
    if (!item.section) return true;
    for (let i = idx + 1; i < visibleItems.length; i++) {
      if (visibleItems[i].section) break;
      return true;
    }
    return false;
  });

  return (
    <SidebarWrap $collapsed={collapsed}>

      {/* ── Brand / Logo ───────────────────────────────────────────── */}
      <Brand $collapsed={collapsed}>
        <BrandLogo title={tenantName}>{initials}</BrandLogo>
        {!collapsed && <BrandName>{tenantName}</BrandName>}
      </Brand>

      {/* ── Navigation ─────────────────────────────────────────────── */}
      <nav style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden' }}>
        {filteredNav.map((item, idx) => {
          if (item.section) {
            return !collapsed
              ? <NavLabel key={`sec-${idx}`}>{item.section}</NavLabel>
              : <div key={`sec-${idx}`} style={{ height: 8 }} />;
          }
          const active = pathname === item.key || pathname.startsWith(item.key + '/');
          return (
            <NavItem
              key={item.key}
              $active={active}
              $collapsed={collapsed}
              onClick={() => navigate(item.key)}
              title={collapsed ? item.label : undefined}
            >
              <NavIcon $active={active}>{item.icon}</NavIcon>
              {!collapsed && <NavText>{item.label}</NavText>}
            </NavItem>
          );
        })}
      </nav>

      {/* ── User info ──────────────────────────────────────────────── */}
      {!collapsed && (
        <UserInfo>
          <UserAvatar>{user?.first_name?.[0] || user?.username?.[0] || 'U'}</UserAvatar>
          <UserMeta>
            <UserName>
              {user?.first_name
                ? `${user.first_name} ${user.last_name || ''}`.trim()
                : user?.username}
            </UserName>
            <UserRole>{role}</UserRole>
          </UserMeta>
        </UserInfo>
      )}

      {/* ── Collapse toggle ────────────────────────────────────────── */}
      <CollapseBtn onClick={onToggle} title={collapsed ? 'Expand' : 'Collapse'}>
        {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
      </CollapseBtn>
    </SidebarWrap>
  );
};

export default Sidebar;
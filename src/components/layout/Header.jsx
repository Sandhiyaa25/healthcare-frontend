import React, { useState } from 'react';
import {
  BellOutlined, LogoutOutlined, UserOutlined,
  BulbOutlined, BulbFilled,
} from '@ant-design/icons';
import {
  HeaderWrap, HeaderLeft, PageTitle, TenantName,
  HeaderRight, IconBtn, AvatarBtn, AvatarCircle, Divider,
} from './Header.styled';
import useAuth           from '../../hooks/useAuth';
import useTenant         from '../../hooks/useTenant';
import { useTheme }      from '../../context/ThemeContext';
import { useNavigate }   from 'react-router-dom';
import { useSelector }   from 'react-redux';
import NotificationPanel from '../../pages/Notifications/NotificationPanel';
import { BellWrap, UnreadBadge } from '../../pages/Notifications/NotificationPanel.styled';

const Header = ({ title = 'Dashboard' }) => {
  const { user, logout }       = useAuth();
  const tenant                 = useTenant();
  const { isDark, toggleDark } = useTheme();
  const navigate               = useNavigate();

  // Always read latest user from Redux so name updates reflect immediately
  const reduxUser              = useSelector((s) => s.auth.user);
  const displayUser            = reduxUser || user;

  // Letter avatar — first letter of first name or username
  const avatarLetter = (
    displayUser?.first_name?.[0] ||
    displayUser?.username?.[0]   ||
    '?'
  ).toUpperCase();

  const unreadCount            = useSelector((s) => s.notifications?.unreadCount ?? 0);
  const [showNotifs, setShowNotifs] = useState(false);

  return (
    <HeaderWrap>
      <HeaderLeft>
        <PageTitle>{title}</PageTitle>
        {tenant?.name && <TenantName>{tenant.name}</TenantName>}
      </HeaderLeft>

      <HeaderRight>
        {/* Theme toggle */}
        <IconBtn onClick={toggleDark} title={isDark ? 'Light mode' : 'Dark mode'}>
          {isDark ? <BulbFilled /> : <BulbOutlined />}
        </IconBtn>

        {/* Notification bell */}
        <BellWrap style={{ position: 'relative' }}>
          <IconBtn
            title="Notifications"
            onClick={() => setShowNotifs((s) => !s)}
            style={{ position: 'relative' }}
          >
            <BellOutlined />
            {unreadCount > 0 && (
              <UnreadBadge>{unreadCount > 99 ? '99+' : unreadCount}</UnreadBadge>
            )}
          </IconBtn>
          {showNotifs && (
            <NotificationPanel onClose={() => setShowNotifs(false)} />
          )}
        </BellWrap>

        <Divider />

        {/* Avatar — letter only */}
        <AvatarBtn onClick={() => navigate('/profile')} title="My Profile">
          <AvatarCircle>
            {avatarLetter}
          </AvatarCircle>
        </AvatarBtn>

        {/* Logout */}
        <IconBtn onClick={logout} title="Logout">
          <LogoutOutlined />
        </IconBtn>
      </HeaderRight>
    </HeaderWrap>
  );
};

export default Header;
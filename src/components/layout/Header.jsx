import React from 'react';

import {
  BellOutlined, LogoutOutlined, UserOutlined,
  BulbOutlined, BulbFilled,
} from '@ant-design/icons';
import {
  HeaderWrap, HeaderLeft, PageTitle, TenantName,
  HeaderRight, IconBtn, AvatarBtn, AvatarCircle, Divider,
} from './Header.styled';
import useAuth      from '../../hooks/useAuth';
import useTenant    from '../../hooks/useTenant';
import { useTheme } from '../../context/ThemeContext';
import { useNavigate } from 'react-router-dom';



const Header = ({ title = 'Dashboard' }) => {
  const { user, logout } = useAuth();
  const tenant           = useTenant();
  const { isDark, toggleDark } = useTheme();
const navigate = useNavigate();
  return (
    <HeaderWrap>
      <HeaderLeft>
        <PageTitle>{title}</PageTitle>
        {tenant?.name && <TenantName>{tenant.name}</TenantName>}
      </HeaderLeft>
      <HeaderRight>
        <IconBtn onClick={toggleDark} title={isDark ? 'Light mode' : 'Dark mode'}>
          {isDark ? <BulbFilled /> : <BulbOutlined />}
        </IconBtn>
        <IconBtn title="Notifications">
          <BellOutlined />
        </IconBtn>
        <Divider />
       <AvatarBtn onClick={() => navigate('/profile')} title="My Profile">
  <AvatarCircle>
    {user?.first_name?.[0] || user?.username?.[0] || <UserOutlined />}
  </AvatarCircle>
</AvatarBtn>
        <IconBtn onClick={logout} title="Logout">
          <LogoutOutlined />
        </IconBtn>
      </HeaderRight>
    </HeaderWrap>
  );
};

export default Header;

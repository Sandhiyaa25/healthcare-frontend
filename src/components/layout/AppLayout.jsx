import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar       from './Sidebar';
import Header        from './Header';
import { LayoutWrap, MainArea, ContentArea } from './AppLayout.styled';
import useIdleLogout from '../../hooks/useIdleLogout';
import useSecurity   from '../../hooks/useSecurity';
import useAuth       from '../../hooks/useAuth';

const PAGE_TITLES = {
  '/dashboard':     'Dashboard',
  '/patients':      'Patients',
  '/appointments':  'Appointments',
  '/prescriptions': 'Prescriptions',
  '/billing':       'Billing',
  '/staff':         'Staff Management',
  '/users':         'Users',
  '/messages':      'Messages',
  '/calendar':      'Calendar',
  '/settings':      'Settings',
  '/records':       'Medical Records',
  '/my-health':     'My Health',
};

const AppLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { pathname } = useLocation();
  const { isAuthenticated } = useAuth();

  // Security features
  useSecurity();
  //useIdleLogout(30 * 60 * 1000, isAuthenticated); // 30min idle logout
useIdleLogout(60 * 60 * 1000, isAuthenticated); // 1 hour
  const title = PAGE_TITLES[
    Object.keys(PAGE_TITLES).find((k) => pathname.startsWith(k))
  ] || 'Dashboard';

  return (
    <LayoutWrap>
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed((c) => !c)} />
      <MainArea>
        <Header title={title} />
        <ContentArea>
          <Outlet />
        </ContentArea>
      </MainArea>
    </LayoutWrap>
  );
};

export default AppLayout;

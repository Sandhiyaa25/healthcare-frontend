// import React, { useState } from 'react';
// import { Outlet, useLocation } from 'react-router-dom';
// import Sidebar          from './Sidebar';
// import Header           from './Header';
// import { LayoutWrap, MainArea, ContentArea } from './AppLayout.styled';
// import useIdleLogout    from '../../hooks/useIdleLogout';
// import useSecurity      from '../../hooks/useSecurity';
// import useAuth          from '../../hooks/useAuth';
// import useTenant        from '../../hooks/useTenant';
// import useNotifications from '../../hooks/useNotifications';

// const PAGE_TITLES = {
//   '/dashboard':     'Dashboard',
//   '/patients':      'Patients',
//   '/appointments':  'Appointments',
//   '/prescriptions': 'Prescriptions',
//   '/billing':       'Billing',
//   '/staff':         'Staff Management',
//   '/users':         'Users',
//   '/messages':      'Messages',
//   '/calendar':      'Calendar',
//   '/settings':      'Settings',
//   '/records':       'Medical Records',
// };

// const AppLayout = () => {
//   const [collapsed, setCollapsed] = useState(false);
//   const { pathname }        = useLocation();
//   const { isAuthenticated } = useAuth();
//   const tenant              = useTenant();

//   // ── Per-tenant idle timeout ──────────────────────────────────────────────
//   // Reads session_timeout_minutes from tenant config (returned by /api/resolve)
//   // Falls back to 60 minutes if not set
//   const timeoutMinutes = tenant?.session_timeout_minutes ?? 60;
//   const timeoutMs      = timeoutMinutes * 60 * 1000;

//   // Security
//   useSecurity();
//   useIdleLogout(timeoutMs, isAuthenticated);

//   // Start notification polling once when layout mounts
//   useNotifications();

//   const title = PAGE_TITLES[
//     Object.keys(PAGE_TITLES).find((k) => pathname.startsWith(k))
//   ] || 'Dashboard';

//   return (
//     <LayoutWrap>
//       <Sidebar collapsed={collapsed} onToggle={() => setCollapsed((c) => !c)} />
//       <MainArea>
//         <Header title={title} />
//         <ContentArea>
//           <Outlet />
//         </ContentArea>
//       </MainArea>
//     </LayoutWrap>
//   );
// };

// export default AppLayout;

import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar          from './Sidebar';
import Header           from './Header';
import OfflineBanner    from '../ui/OfflineBanner/OfflineBanner';
import { LayoutWrap, MainArea, ContentArea } from './AppLayout.styled';
import useIdleLogout    from '../../hooks/useIdleLogout';
import useSecurity      from '../../hooks/useSecurity';
import useAuth          from '../../hooks/useAuth';
import useTenant        from '../../hooks/useTenant';
import useNotifications from '../../hooks/useNotifications';

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
};

const AppLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { pathname }        = useLocation();
  const { isAuthenticated } = useAuth();
  const tenant              = useTenant();

  // Per-tenant idle timeout
  const timeoutMs = (tenant?.session_timeout_minutes ?? 60) * 60 * 1000;

  useSecurity();
  useIdleLogout(timeoutMs, isAuthenticated);

  // Start notification polling
  useNotifications();

  const title = PAGE_TITLES[
    Object.keys(PAGE_TITLES).find((k) => pathname.startsWith(k))
  ] || 'Dashboard';

  return (
    <LayoutWrap>
      {/* Offline queue banner — fixed at top, above everything */}
      <OfflineBanner />

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
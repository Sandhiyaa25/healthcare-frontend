// import React from 'react';
// import { Navigate }      from 'react-router-dom';
// import { useSelector }   from 'react-redux';
// import { useTheme as useStyledTheme } from 'styled-components';
// import {
//   PageWrap, LeftPanel, RightPanel, Card, CardInner,
//   BrandRow, BrandMark, BrandLabel,
//   TaglineWrap, Tagline, TaglineSub,
//   FeatureList, FeatureItem,
//   Illustration, IllustrationIcon,
// } from './LoginPage.styled';
// import LoginForm from './components/LoginForm';
// import {
//   HeartOutlined, SafetyOutlined,
//   TeamOutlined, FileProtectOutlined,
// } from '@ant-design/icons';

// const FEATURES = [
//   { icon: <HeartOutlined />,        text: 'Patient-first care management' },
//   { icon: <SafetyOutlined />,       text: 'HIPAA-compliant security'       },
//   { icon: <TeamOutlined />,         text: 'Multi-role staff access'        },
//   { icon: <FileProtectOutlined />,  text: 'Audit-ready records'            },
// ];

// // ─── Derive 2-letter initials ─────────────────────────────────────────────────
// const getInitials = (name) => {
//   if (!name) return 'HC';
//   const words = name.trim().split(/\s+/);
//   if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
//   return (words[0][0] + words[1][0]).toUpperCase();
// };

// const LoginPage = () => {
//   const isAuthenticated = useSelector((s) => s.auth.isAuthenticated);
//   const user            = useSelector((s) => s.auth.user);

//   // Get tenant branding from styled-components theme
//   // (available even before login because tenant is resolved from subdomain)
//   const styledTheme = useStyledTheme();
//   const tenantName  = styledTheme?.branding?.name    || 'HealthCare SaaS';
//   const tagline     = styledTheme?.branding?.tagline || 'Modern healthcare management platform';
//   const initials    = getInitials(tenantName);

//   // Redirect if already authenticated
//   if (isAuthenticated) {
//     return <Navigate to="/dashboard" replace />;
//   }

//   return (
//     <PageWrap>
//       <LeftPanel>

//         {/* ── Brand row ──────────────────────────────────────────── */}
//         <BrandRow>
//           <BrandMark>{initials}</BrandMark>
//           <BrandLabel>{tenantName}</BrandLabel>
//         </BrandRow>

//         {/* ── Tagline ────────────────────────────────────────────── */}
//         <TaglineWrap>
//           <Tagline>{tagline}</Tagline>
//           <TaglineSub>
//             Streamline patient care, appointments,<br />
//             billing and staff — all in one place.
//           </TaglineSub>
//         </TaglineWrap>

//         {/* ── Features ───────────────────────────────────────────── */}
//         <FeatureList>
//           {FEATURES.map((f, i) => (
//             <FeatureItem key={i}>
//               <span className="feat-icon">{f.icon}</span>
//               <span>{f.text}</span>
//             </FeatureItem>
//           ))}
//         </FeatureList>

//         {/* ── Floating icon ──────────────────────────────────────── */}
//         <Illustration>
//           <IllustrationIcon><HeartOutlined /></IllustrationIcon>
//         </Illustration>

//       </LeftPanel>

//       <RightPanel>
//         <Card>
//           <CardInner>
//             <LoginForm />
//           </CardInner>
//         </Card>
//       </RightPanel>
//     </PageWrap>
//   );
// };

// export default LoginPage;

import React, { useEffect } from 'react';
import { Navigate }      from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useTheme as useStyledTheme } from 'styled-components';
import {
  PageWrap, LeftPanel, RightPanel, Card, CardInner,
  BrandRow, BrandMark, BrandLabel,
  TaglineWrap, Tagline, TaglineSub,
  FeatureList, FeatureItem,
  Illustration, IllustrationIcon,
} from './LoginPage.styled';
import LoginForm          from './components/LoginForm';
import { setTenant }      from '../../store/auth/authSlice';
import { setTenantInfo }  from '../../store/tenant/tenantSlice';
import { resolveTenantApi } from '../../api/auth.api';
import { getSubdomain }   from '../../utils/subdomainUtils';
import { setTenantId }    from '../../utils/tokenStorage';
import { idbSet, IDB_KEYS } from '../../utils/indexedDB';
import {
  HeartOutlined, SafetyOutlined,
  TeamOutlined, FileProtectOutlined,
} from '@ant-design/icons';

const FEATURES = [
  { icon: <HeartOutlined />,        text: 'Patient-first care management' },
  { icon: <SafetyOutlined />,       text: 'HIPAA-compliant security'       },
  { icon: <TeamOutlined />,         text: 'Multi-role staff access'        },
  { icon: <FileProtectOutlined />,  text: 'Audit-ready records'            },
];

const getInitials = (name) => {
  if (!name) return 'HC';
  const words = name.trim().split(/\s+/);
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return (words[0][0] + words[1][0]).toUpperCase();
};

const LoginPage = () => {
  const dispatch        = useDispatch();
  const isAuthenticated = useSelector((s) => s.auth.isAuthenticated);

  // Get tenant branding from theme (populated after resolve)
  const styledTheme = useStyledTheme();
  const tenantName  = styledTheme?.branding?.name    || 'HealthCare';
  const tagline     = styledTheme?.branding?.tagline || 'Empowering Healthcare';
  const initials    = getInitials(tenantName);

  // ── Resolve tenant colors on page load (before login) ──────────────────────
  // This ensures the left panel shows correct tenant colors and branding
  // even before the user has logged in
  useEffect(() => {
    const subdomain = getSubdomain();
    if (!subdomain) return;

    resolveTenantApi(subdomain)
      .then((res) => {
        const tenant = res.data?.data;
        if (!tenant?.id) return;
        // Store in both Redux slices so ThemeContext picks it up
        dispatch(setTenant(tenant));
        dispatch(setTenantInfo(tenant));
        // Persist to IDB so refresh works
        setTenantId(tenant.id);
        idbSet(IDB_KEYS.TENANT, tenant);
      })
      .catch(() => {
        // Non-fatal — login page still works with default colors
      });
  }, [dispatch]);

  // Redirect if already authenticated
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <PageWrap>
      <LeftPanel>
        {/* ── Brand ─────────────────────────────────────────────── */}
        <BrandRow>
          <BrandMark>{initials}</BrandMark>
          <BrandLabel>{tenantName}</BrandLabel>
        </BrandRow>

        {/* ── Tagline ────────────────────────────────────────────── */}
        <TaglineWrap>
          <Tagline>{tagline}</Tagline>
          <TaglineSub>
            Streamline patient care, appointments,<br />
            billing and staff — all in one place.
          </TaglineSub>
        </TaglineWrap>

        {/* ── Features ───────────────────────────────────────────── */}
        <FeatureList>
          {FEATURES.map((f, i) => (
            <FeatureItem key={i}>
              <span className="feat-icon">{f.icon}</span>
              <span>{f.text}</span>
            </FeatureItem>
          ))}
        </FeatureList>

        <Illustration>
          <IllustrationIcon><HeartOutlined /></IllustrationIcon>
        </Illustration>
      </LeftPanel>

      <RightPanel>
        <Card>
          <CardInner>
            <LoginForm />
          </CardInner>
        </Card>
      </RightPanel>
    </PageWrap>
  );
};

export default LoginPage;
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  PageWrap, LeftPanel, RightPanel, Card, CardInner,
  BrandRow, BrandMark, BrandLabel,
  TaglineWrap, Tagline, TaglineSub,
  FeatureList, FeatureItem,
  Illustration, IllustrationIcon,
} from './LoginPage.styled';
import LoginForm from './components/LoginForm';
import {
  HeartOutlined, SafetyOutlined,
  TeamOutlined, FileProtectOutlined,
} from '@ant-design/icons';

const FEATURES = [
  { icon: <HeartOutlined />,       text: 'Patient-first care management'  },
  { icon: <SafetyOutlined />,      text: 'HIPAA-compliant security'        },
  { icon: <TeamOutlined />,        text: 'Multi-role staff access'         },
  { icon: <FileProtectOutlined />, text: 'Audit-ready records'             },
];

const LoginPage = () => {
  const isAuthenticated = useSelector((s) => s.auth.isAuthenticated);
  const user            = useSelector((s) => s.auth.user);

  // ─── Redirect authenticated users based on role ──────────────────────────
  if (isAuthenticated) {
    const role = user?.role || user?.role_slug;
    if (role === 'patient') {
      return <Navigate to="/my-health" replace />;
    }
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <PageWrap>
      <LeftPanel>
        <BrandRow>
          <BrandMark>HC</BrandMark>
          <BrandLabel>HealthCare SaaS</BrandLabel>
        </BrandRow>
        <TaglineWrap>
          <Tagline>Modern healthcare<br />management platform</Tagline>
          <TaglineSub>
            Streamline patient care, appointments,<br />
            billing and staff — all in one place.
          </TaglineSub>
        </TaglineWrap>
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
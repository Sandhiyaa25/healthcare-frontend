import React, { useEffect } from 'react';
import {
  TeamOutlined, CalendarOutlined, DollarOutlined,
  UserOutlined, ExperimentOutlined, MedicineBoxOutlined,
 ClockCircleOutlined,
} from '@ant-design/icons';
import StatCard from './components/StatCard';
import AppointmentSummary from './components/AppointmentSummary';
import RoleGreeting from './components/RoleGreeting';
import {
  PageWrap, StatsGrid, BottomGrid, SectionLabel,
} from './DashboardPage.styled';
import useDashboard from '../../hooks/useDashboard';
import useAuth from '../../hooks/useAuth';
import Spinner from '../../components/ui/Spinner/Spinner';

// Role-based card definitions
const ALL_CARDS = [
  {
    key:      'total_patients',
    label:    'Total Patients',
    icon:     <TeamOutlined />,
    variant:  'primary',
    trend:    +12,
    roles:    ['admin', 'doctor', 'nurse', 'receptionist'],
    getValue: (data) => data?.total_patients ?? '—',
  },
  {
    key:      'todays_appointments',
    label:    "Today's Appointments",
    icon:     <CalendarOutlined />,
    variant:  'info',
    trend:    +5,
    roles:    ['admin', 'doctor', 'nurse', 'receptionist', 'patient'],
    getValue: (data) => data?.todays_appointments ?? '—',
  },
  {
    key:      'monthly_revenue',
    label:    'Monthly Revenue',
    icon:     <DollarOutlined />,
    variant:  'success',
    trend:    -3,
    roles:    ['admin', 'receptionist'],
    getValue: (data) => {
      const rev = data?.billing?.total_revenue;
      return rev != null ? `₹${Number(rev).toLocaleString('en-IN')}` : '—';
    },
  },
  {
    key:      'active_staff',
    label:    'Active Staff',
    icon:     <UserOutlined />,
    variant:  'warning',
    trend:    0,
    roles:    ['admin'],
    //getValue: (data) => data?.active_staff ?? 32,
     getValue: (data) => data?.active_staff ?? '—',  
  },
  {
    key:      'pending_prescriptions',
    label:    'Pending Prescriptions',
    icon:     <ExperimentOutlined />,
    variant:  'warning',
    trend:    0,
    roles:    ['doctor', 'pharmacist'],
    getValue: (data) => data?.prescriptions?.pending ?? '—',
  },
  {
    key:      'scheduled_appointments',
    label:    'Scheduled Appointments',
    icon:     <ClockCircleOutlined />,
    variant:  'info',
    trend:    0,
    roles:    ['nurse'],
    getValue: (data) => data?.appointments?.scheduled ?? '—',
  },
  {
    key:      'my_appointments',
    label:    'My Appointments',
    icon:     <CalendarOutlined />,
    variant:  'primary',
    trend:    0,
    roles:    ['patient'],
    getValue: (data) => data?.todays_appointments ?? '—',
  },
  {
    key:      'total_invoices',
    label:    'Total Invoices',
    icon:     <MedicineBoxOutlined />,
    variant:  'success',
    trend:    0,
    roles:    ['admin', 'receptionist'],
    getValue: (data) => data?.billing?.total_invoices ?? '—',
  },
];

const DashboardPage = () => {
  const { data, loading, fetchDashboard } = useDashboard();
  const { user, role } = useAuth();

  useEffect(() => { fetchDashboard(); }, [fetchDashboard]);

  // Filter cards for this role
  const visibleCards = ALL_CARDS.filter(
    (c) => c.roles.includes(role)
  );

  return (
    <PageWrap>
      <RoleGreeting user={user} role={role} />

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '60px 0' }}>
          <Spinner size="lg" />
        </div>
      ) : (
        <>
          <SectionLabel>Overview</SectionLabel>
          <StatsGrid $count={visibleCards.length}>
            {visibleCards.map((card) => (
              <StatCard
                key={card.key}
                label={card.label}
                value={card.getValue(data)}
                icon={card.icon}
                variant={card.variant}
                trend={card.trend}
              />
            ))}
          </StatsGrid>

          <BottomGrid>
            <AppointmentSummary
              appointments={data?.recent_appointments || []}
              role={role}
            />
          </BottomGrid>
        </>
      )}
    </PageWrap>
  );
};

export default DashboardPage;

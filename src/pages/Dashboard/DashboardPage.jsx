import React, { useEffect, useState } from 'react';
import {
  TeamOutlined, CalendarOutlined, DollarOutlined,
  UserOutlined, ExperimentOutlined, MedicineBoxOutlined,
  ClockCircleOutlined, FileTextOutlined,
} from '@ant-design/icons';
import StatCard           from './components/StatCard';
import AppointmentSummary from './components/AppointmentSummary';
import RoleGreeting       from './components/RoleGreeting';
import {
  PageWrap, StatsGrid, BottomGrid, SectionLabel, RxCard,RxEmpty,RxHead,RxItem,RxMeta,RxName
} from './DashboardPage.styled';
import useDashboard    from '../../hooks/useDashboard';
import useAuth         from '../../hooks/useAuth';
import Spinner         from '../../components/ui/Spinner/Spinner';
import Badge           from '../../components/ui/Badge/Badge';
import axiosInstance   from '../../api/axiosInstance';
import dayjs           from 'dayjs';

// ─── Stat card definitions ────────────────────────────────────────────────────
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
    getValue: (data) => {
      const recent = data?.recent_appointments;
      return Array.isArray(recent) ? recent.length : (data?.todays_appointments ?? '—');
    },
  },
  {
    key:      'my_prescriptions',
    label:    'My Prescriptions',
    icon:     <ExperimentOutlined />,
    variant:  'warning',
    trend:    0,
    roles:    ['patient'],
    getValue: () => '—',   // filled by local state below
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
  const { user, role }                    = useAuth();

  // Patient-only: load prescriptions for dashboard card + list
  const [rxList,    setRxList]    = useState([]);
  const [rxLoading, setRxLoading] = useState(false);
  const [billList,    setBillList]    = useState([]);
const [billLoading, setBillLoading] = useState(false);

  useEffect(() => { fetchDashboard(); }, [fetchDashboard]);


  useEffect(() => {
    if (role !== 'patient') return;
    setRxLoading(true);
    axiosInstance.get('/api/prescriptions', { params: { per_page: 5 } })
      .then((r) => {
        const raw  = r.data?.data;
        const list = Array.isArray(raw) ? raw
          : Array.isArray(raw?.prescriptions) ? raw.prescriptions : [];
        setRxList(list);
      })
      .catch(() => setRxList([]))
      .finally(() => setRxLoading(false));
  }, [role]);

  const visibleCards = ALL_CARDS.filter((c) => c.roles.includes(role));

  // Override prescription count for patient
  const getCardValue = (card) => {
    if (card.key === 'my_prescriptions') return rxList.length;
    return card.getValue(data);
  };

  useEffect(() => {
  if (role !== 'patient') return;
  setBillLoading(true);
  axiosInstance.get('/api/billing', { params: { per_page: 5 } })
    .then((r) => {
      const raw  = r.data?.data;
      const list = Array.isArray(raw) ? raw
        : Array.isArray(raw?.invoices) ? raw.invoices : [];
      setBillList(list);
    })
    .catch(() => setBillList([]))
    .finally(() => setBillLoading(false));
}, [role]);

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
                value={getCardValue(card)}
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

            {/* Patient: show prescription list on dashboard */}
            {role === 'patient' && (
              <RxCard>
                <RxHead>
                  <FileTextOutlined />
                  My Prescriptions
                </RxHead>
                {rxLoading ? (
                  <RxEmpty>Loading...</RxEmpty>
                ) : rxList.length === 0 ? (
                  <RxEmpty>No prescriptions yet</RxEmpty>
                ) : (
                  rxList.map((rx) => (
                    <RxItem key={rx.id}>
                      <div>
                        <RxName>
                          {Array.isArray(rx.medicines) && rx.medicines.length > 0
                            ? rx.medicines.map((m) => m.name).join(', ')
                            : `Prescription #${rx.id}`}
                        </RxName>
                        <RxMeta>
                          Dr. {rx.doctor_name || `#${rx.doctor_id}`} ·{' '}
                          {rx.created_at ? dayjs(rx.created_at).format('DD MMM YYYY') : ''}
                        </RxMeta>
                      </div>
                      <Badge variant={
                        rx.status === 'dispensed' ? 'success'
                          : rx.status === 'rejected' ? 'danger'
                          : 'warning'
                      }>{rx.status}</Badge>
                    </RxItem>
                  ))
                )}
              </RxCard>
            )}
            {role === 'patient' && billList.length > 0 && (
  <RxCard>
    <RxHead>
      <DollarOutlined />
      My Bills
    </RxHead>
   {billLoading ? (
  <RxEmpty>Loading...</RxEmpty>
) : billList.length === 0 ? (
  <RxEmpty>No bills yet</RxEmpty>
) : (
  billList.map((inv) => {
    const total     = parseFloat(inv.total_amount || 0);
    const paid      = parseFloat(inv.paid_amount  || 0);
    const remaining = total - paid;
    const isOverdue =
      inv.status !== 'paid' &&
      inv.due_date &&
      new Date(inv.due_date) < new Date();

    return (
      <RxItem key={inv.id}>
        <div>
          <RxName>
            {inv.appointment_id
              ? `Invoice for Appointment #${inv.appointment_id}`
              : `Invoice #${inv.id}`}
          </RxName>

          <RxMeta>
            Total: ₹{total.toLocaleString('en-IN')}

            {inv.status === 'partial' && remaining > 0 && (
              <span style={{ color: '#D97706', marginLeft: 6, fontWeight: 600 }}>
                · Due: ₹{remaining.toLocaleString('en-IN')}
              </span>
            )}

            {inv.status === 'pending' && (
              <span style={{ color: '#DC2626', marginLeft: 6, fontWeight: 600 }}>
                · ₹{total.toLocaleString('en-IN')} pending
              </span>
            )}

            {inv.due_date && (
              <span style={{ marginLeft: 6 }}>
                · Due {dayjs(inv.due_date).format('DD MMM YYYY')}
              </span>
            )}
          </RxMeta>
        </div>

        <Badge
          variant={
            inv.status === 'paid'
              ? 'success'
              : isOverdue
              ? 'danger'
              : inv.status === 'partial'
              ? 'info'
              : 'warning'
          }
        >
          {isOverdue ? 'Overdue' : inv.status}
        </Badge>
      </RxItem>
    );
  })
)}
  </RxCard>
)}
          </BottomGrid>
        </>
      )}
    </PageWrap>
  );
};

export default DashboardPage;
import React, { useEffect, useState } from 'react';
import axiosInstance from '../../api/axiosInstance';
import { normalizeError } from '../../utils/errorNormalizer';
import dayjs from 'dayjs';
import { useParams, useNavigate } from 'react-router-dom';
import { Tabs, Descriptions, Tag, Skeleton } from 'antd';
import { ArrowLeftOutlined, EditOutlined } from '@ant-design/icons';
import usePatients from '../../hooks/usePatient';
import useAuth from '../../hooks/useAuth';
import Badge from '../../components/ui/Badge/Badge';
import Button from '../../components/ui/Button/Button';
import PatientForm from './components/PatientForm';
import { formatDate, formatDateTime } from '../../utils/dateUtils';
import {
  PageWrap,
  DetailHeader,
  BackBtn,
  ProfileCard,
  ProfileAvatar,
  ProfileMeta,
  ProfileName,
  ProfileSub,
  ProfileId,
  TabContent,
  InfoSection,
  InfoLabel,
  InfoValue,
  PlaceholderMsg,
  EmptyMsg,
} from './PatientDetailPage.styled';

const STATUS_VARIANT = {
  active: 'success',
  inactive: 'warning',
  deceased: 'danger',
};


const PatientDetailPage = () => {
  
  const { id } = useParams();
  const navigate = useNavigate();
  const { patient, loading, fetchPatient, clearPatient } = usePatients();
  const { role } = useAuth();
  const [showEdit, setShowEdit] = useState(false);
const [patientAppts,    setPatientAppts]    = useState([]);
const [patientInvoices, setPatientInvoices] = useState([]);
const [loadingAppts,    setLoadingAppts]    = useState(false);
const [loadingBilling,  setLoadingBilling]  = useState(false);


  useEffect(() => {
    fetchPatient(Number(id));
    return () => clearPatient();
  }, [id, fetchPatient, clearPatient]);

  // Load them when patient is loaded:
useEffect(() => {
  if (!patient?.id) return;
  // Appointments
  setLoadingAppts(true);
  axiosInstance.get('/api/appointments', { params: { patient_id: patient.id, per_page: 20 } })
    .then((r) => {
      const raw = r.data?.data;
      setPatientAppts(Array.isArray(raw) ? raw
        : Array.isArray(raw?.appointments) ? raw.appointments : []);
    })
    .catch(() => setPatientAppts([]))
    .finally(() => setLoadingAppts(false));
  // Billing
  setLoadingBilling(true);
  axiosInstance.get('/api/billing', { params: { patient_id: patient.id, per_page: 20 } })
    .then((r) => {
      const raw = r.data?.data;
      setPatientInvoices(Array.isArray(raw) ? raw
        : Array.isArray(raw?.invoices) ? raw.invoices : []);
    })
    .catch(() => setPatientInvoices([]))
    .finally(() => setLoadingBilling(false));
}, [patient?.id]);

  const tabItems = [
    {
      key: 'overview',
      label: 'Overview',
      children: (
        <TabContent>
          <Descriptions bordered column={2} size="small">
            <Descriptions.Item label="Email">{patient?.email || '—'}</Descriptions.Item>
            <Descriptions.Item label="Phone">{patient?.phone || '—'}</Descriptions.Item>
            <Descriptions.Item label="Date of Birth">{formatDate(patient?.date_of_birth)}</Descriptions.Item>
            <Descriptions.Item label="Gender">{patient?.gender || '—'}</Descriptions.Item>
            <Descriptions.Item label="Blood Group">{patient?.blood_group || '—'}</Descriptions.Item>
            <Descriptions.Item label="Status">{patient?.status || '—'}</Descriptions.Item>
            <Descriptions.Item label="Address" span={2}>{patient?.address || '—'}</Descriptions.Item>
            <Descriptions.Item label="Emergency Contact">{patient?.emergency_contact_name || '—'}</Descriptions.Item>
            <Descriptions.Item label="Emergency Phone">{patient?.emergency_contact_phone || '—'}</Descriptions.Item>
            <Descriptions.Item label="Registered">{formatDateTime(patient?.created_at)}</Descriptions.Item>
            <Descriptions.Item label="Last Updated">{formatDateTime(patient?.updated_at)}</Descriptions.Item>
          </Descriptions>
        </TabContent>
      ),
    },
    {
      key: 'medical',
      label: 'Medical History',
      children: (
        <TabContent>
          <InfoSection>
            <InfoLabel>Allergies</InfoLabel>
            <InfoValue>{patient?.allergies || 'No known allergies'}</InfoValue>
          </InfoSection>
          <InfoSection>
            <InfoLabel>Medical Notes</InfoLabel>
            <InfoValue>{patient?.medical_notes || 'No medical notes recorded'}</InfoValue>
          </InfoSection>
        </TabContent>
      ),
    },
    // Appointments tab:
{
  key: 'appointments',
  label: 'Appointments',
  children: (
    <TabContent>
      {loadingAppts ? (
        <PlaceholderMsg>Loading...</PlaceholderMsg>
      ) : patientAppts.length === 0 ? (
        <PlaceholderMsg>No appointments found for this patient.</PlaceholderMsg>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr style={{ borderBottom: '1px solid' }}>
              <th style={{ padding: '8px', textAlign: 'left', color: '#64748B', fontWeight: 600 }}>Date</th>
              <th style={{ padding: '8px', textAlign: 'left', color: '#64748B', fontWeight: 600 }}>Doctor</th>
              <th style={{ padding: '8px', textAlign: 'left', color: '#64748B', fontWeight: 600 }}>Type</th>
              <th style={{ padding: '8px', textAlign: 'left', color: '#64748B', fontWeight: 600 }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {patientAppts.map((a) => (
              <tr key={a.id} style={{ borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
                <td style={{ padding: '10px 8px' }}>
                  {a.appointment_date ? dayjs(a.appointment_date).format('DD MMM YYYY') : '—'}
                  {a.start_time && <span style={{ color: '#94A3B8', marginLeft: 6 }}>{a.start_time.slice(0,5)}</span>}
                </td>
                <td style={{ padding: '10px 8px' }}>{a.doctor_name || `Doctor #${a.doctor_id}`}</td>
                <td style={{ padding: '10px 8px', textTransform: 'capitalize' }}>{a.type || '—'}</td>
                <td style={{ padding: '10px 8px' }}>
                  <Badge variant={
                    a.status === 'confirmed' ? 'primary'
                    : a.status === 'completed' ? 'success'
                    : a.status === 'cancelled' ? 'danger'
                    : 'warning'
                  }>{a.status}</Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </TabContent>
  ),
},

// Billing tab:
{
  key: 'billing',
  label: 'Billing',
  children: (
    <TabContent>
      {loadingBilling ? (
        <PlaceholderMsg>Loading...</PlaceholderMsg>
      ) : patientInvoices.length === 0 ? (
        <PlaceholderMsg>No billing records found for this patient.</PlaceholderMsg>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr style={{ borderBottom: '1px solid' }}>
              <th style={{ padding: '8px', textAlign: 'left', color: '#64748B', fontWeight: 600 }}>Invoice #</th>
              <th style={{ padding: '8px', textAlign: 'left', color: '#64748B', fontWeight: 600 }}>Amount</th>
              <th style={{ padding: '8px', textAlign: 'left', color: '#64748B', fontWeight: 600 }}>Status</th>
              <th style={{ padding: '8px', textAlign: 'left', color: '#64748B', fontWeight: 600 }}>Date</th>
            </tr>
          </thead>
          <tbody>
            {patientInvoices.map((inv) => (
              <tr key={inv.id} style={{ borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
                <td style={{ padding: '10px 8px' }}>#{inv.id}</td>
                <td style={{ padding: '10px 8px' }}>
                  ₹{parseFloat(inv.total_amount || inv.amount || 0).toLocaleString('en-IN')}
                </td>
                <td style={{ padding: '10px 8px' }}>
                  <Badge variant={
                    inv.status === 'paid' ? 'success'
                    : inv.status === 'partial' ? 'info'
                    : 'warning'
                  }>{inv.status}</Badge>
                </td>
                <td style={{ padding: '10px 8px' }}>
                  {inv.created_at ? dayjs(inv.created_at).format('DD MMM YYYY') : '—'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </TabContent>
  ),
},
  ];

  return (
    <PageWrap>
      <DetailHeader>
        <BackBtn onClick={() => navigate('/patients')}>
          <ArrowLeftOutlined /> Patients
        </BackBtn>
        {role !== 'patient' && (
          <Button variant="primary" icon={<EditOutlined />} onClick={() => setShowEdit(true)}>
            Edit Patient
          </Button>
        )}
      </DetailHeader>

      {loading ? (
        <Skeleton active paragraph={{ rows: 8 }} />
      ) : patient ? (
        <>
          <ProfileCard>
            <ProfileAvatar>{patient.first_name?.[0]?.toUpperCase()}</ProfileAvatar>
            <ProfileMeta>
              <ProfileName>{patient.first_name} {patient.last_name}</ProfileName>
              <ProfileSub>
                {patient.gender && <Tag>{patient.gender}</Tag>}
                {patient.blood_group && <Tag color="blue">{patient.blood_group}</Tag>}
                <Badge variant={STATUS_VARIANT[patient.status] || 'default'}>{patient.status}</Badge>
              </ProfileSub>
              <ProfileId>Patient ID #{patient.id}</ProfileId>
            </ProfileMeta>
          </ProfileCard>

          <Tabs defaultActiveKey="overview" items={tabItems} />
        </>
      ) : (
        <EmptyMsg>Patient not found.</EmptyMsg>
      )}

      <PatientForm
        open={showEdit}
        onClose={() => setShowEdit(false)}
        onSuccess={() => {
          setShowEdit(false);
          fetchPatient(Number(id));
        }}
        initialData={patient}
      />
    </PageWrap>
  );
};

export default PatientDetailPage;

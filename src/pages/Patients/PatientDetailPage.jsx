import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Tabs, Descriptions, Tag, Skeleton, Table } from 'antd';
import { ArrowLeftOutlined, EditOutlined } from '@ant-design/icons';
import usePatients from '../../hooks/usePatient';
import useAuth from '../../hooks/useAuth';
import Badge from '../../components/ui/Badge/Badge';
import Button from '../../components/ui/Button/Button';
import PatientForm from './components/PatientForm';
import { formatDate, formatDateTime } from '../../utils/dateUtils';
import { getDummyAppointments } from '../../api/appointments.api';
import { fetchPrescriptionsApi } from '../../api/prescriptions.api';
import { fetchRecordsApi } from '../../api/records.api';
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

const APPT_STATUS = {
  scheduled: 'processing', confirmed: 'success', completed: 'default',
  cancelled: 'error', no_show: 'warning',
};
const RX_STATUS = { active: 'success', expired: 'danger', completed: 'default' };
const REC_STATUS = { verified: 'success', pending: 'warning', incomplete: 'danger' };

const PatientDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { patient, loading, fetchPatient, clearPatient } = usePatients();
  const { role } = useAuth();
  const [showEdit, setShowEdit] = useState(false);
  const [patientAppts, setPatientAppts] = useState([]);
  const [patientRx, setPatientRx] = useState([]);
  const [patientRecords, setPatientRecords] = useState([]);

  useEffect(() => {
    fetchPatient(Number(id));
    return () => clearPatient();
  }, [id, fetchPatient, clearPatient]);

  // Load cross-module data when patient ID is known
  useEffect(() => {
    if (!id) return;
    const pid = Number(id);

    // Appointments — filter from dummy data
    const allAppts = getDummyAppointments();
    setPatientAppts(allAppts.filter((a) => a.patient_id === pid));

    // Prescriptions — filter from dummy data
    fetchPrescriptionsApi().then((res) => {
      const all = res.data || [];
      setPatientRx(all.filter((p) => p.patient_id === pid));
    });

    // Records — filter from dummy data
    fetchRecordsApi().then((res) => {
      const all = res.data || [];
      setPatientRecords(all.filter((r) => r.patient_id === pid));
    });
  }, [id]);

  const apptColumns = [
    { title: 'Date', dataIndex: 'appointment_date', render: (d) => formatDate(d) },
    { title: 'Time', dataIndex: 'start_time', render: (t) => t?.slice(0, 5) || '—' },
    { title: 'Doctor', dataIndex: 'doctor_name' },
    { title: 'Type', dataIndex: 'type', render: (t) => t ? t.charAt(0).toUpperCase() + t.slice(1).replace('_', ' ') : '—' },
    { title: 'Status', dataIndex: 'status', render: (s) => <Tag color={APPT_STATUS[s]}>{s}</Tag> },
  ];

  const rxColumns = [
    { title: 'Medication', dataIndex: 'medication_name' },
    { title: 'Dosage', dataIndex: 'dosage' },
    { title: 'Frequency', dataIndex: 'frequency' },
    { title: 'Date', dataIndex: 'date_issued', render: (d) => formatDate(d) },
    { title: 'Status', dataIndex: 'status', render: (s) => <Tag color={RX_STATUS[s]}>{s}</Tag> },
  ];

  const recColumns = [
    { title: 'Diagnosis', dataIndex: 'diagnosis' },
    { title: 'Doctor', dataIndex: 'doctor_name' },
    { title: 'Date', dataIndex: 'date_recorded', render: (d) => formatDate(d) },
    { title: 'Status', dataIndex: 'status', render: (s) => <Tag color={REC_STATUS[s]}>{s}</Tag> },
  ];

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
    {
      key: 'appointments',
      label: `Appointments (${patientAppts.length})`,
      children: (
        <TabContent>
          {patientAppts.length > 0 ? (
            <Table dataSource={patientAppts} columns={apptColumns} rowKey="id"
              size="small" pagination={false} />
          ) : (
            <PlaceholderMsg>No appointments found for this patient.</PlaceholderMsg>
          )}
        </TabContent>
      ),
    },
    {
      key: 'prescriptions',
      label: `Prescriptions (${patientRx.length})`,
      children: (
        <TabContent>
          {patientRx.length > 0 ? (
            <Table dataSource={patientRx} columns={rxColumns} rowKey="id"
              size="small" pagination={false} />
          ) : (
            <PlaceholderMsg>No prescriptions found for this patient.</PlaceholderMsg>
          )}
        </TabContent>
      ),
    },
    {
      key: 'records',
      label: `Records (${patientRecords.length})`,
      children: (
        <TabContent>
          {patientRecords.length > 0 ? (
            <Table dataSource={patientRecords} columns={recColumns} rowKey="id"
              size="small" pagination={false} />
          ) : (
            <PlaceholderMsg>No medical records found for this patient.</PlaceholderMsg>
          )}
        </TabContent>
      ),
    },
    {
      key: 'billing',
      label: 'Billing',
      children: (
        <TabContent>
          <PlaceholderMsg>
            Billing history will appear here once the Billing module is built.
          </PlaceholderMsg>
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

import React, { useEffect, useState } from 'react';
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

  useEffect(() => {
    fetchPatient(Number(id));
    return () => clearPatient();
  }, [id, fetchPatient, clearPatient]);

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
      label: 'Appointments',
      children: (
        <TabContent>
          <PlaceholderMsg>
            Appointment history will appear here once the Appointments module is built.
          </PlaceholderMsg>
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

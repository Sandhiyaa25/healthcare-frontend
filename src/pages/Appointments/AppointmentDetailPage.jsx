import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Steps, Skeleton, Popconfirm, notification } from 'antd';
import { ArrowLeftOutlined, EditOutlined } from '@ant-design/icons';
import useAppointments from '../../hooks/useAppointments';
import useAuth from '../../hooks/useAuth';
import Button from '../../components/ui/Button/Button';
import StatusBadge from './components/StatusBadge';
import AppointmentForm from './components/AppointmentForm';
import { formatDate } from '../../utils/dateUtils';
import {
  PageWrap,
  DetailHeader,
  BackBtn,
  AppointmentCard,
  CardHeader,
  CardTitle,
  CardGrid,
  CardField,
  FieldLabel,
  FieldValue,
  StatusTimeline,
  TimelineTitle,
  ActionRow,
  NotesSection,
  NotesTitle,
  NotesText,
  EmptyMsg,
} from './AppointmentDetailPage.styled';

const TERMINAL = ['cancelled', 'completed'];

const calcDuration = (start, end) => {
  if (!start || !end) return '—';
  const [sh, sm] = start.split(':').map(Number);
  const [eh, em] = end.split(':').map(Number);
  const diff = (eh * 60 + em) - (sh * 60 + sm);
  return diff > 0 ? `${diff} min` : '—';
};

const STEP_MAP = { scheduled: 0, confirmed: 1, completed: 2 };

const AppointmentDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    appointment, loading, saving, cancelling, error,
    fetchAppointment, clearAppointment, updateStatus, cancelAppointment, clearError,
  } = useAppointments();
  const { role } = useAuth();
  const [showEdit, setShowEdit] = useState(false);

  useEffect(() => {
    fetchAppointment(Number(id));
    return () => clearAppointment();
  }, [id, fetchAppointment, clearAppointment]);

  useEffect(() => {
    if (error) {
      notification.error({ message: error });
      clearError();
    }
  }, [error, clearError]);

  const status = appointment?.status;
  const isCancelledOrCompleted = TERMINAL.includes(status);
  const canStaff = ['admin', 'doctor', 'nurse', 'receptionist'].includes(role);
  const canNurseOrAbove = ['admin', 'doctor', 'nurse'].includes(role);

  const stepsItems = [
    { title: 'Scheduled' },
    { title: 'Confirmed' },
    { title: 'Completed' },
  ];

  let stepStatus = 'process';
  let currentStep = STEP_MAP[status] ?? 0;
  if (status === 'cancelled' || status === 'no_show') {
    stepStatus = 'error';
    currentStep = STEP_MAP['scheduled'];
  }

  return (
    <PageWrap>
      <DetailHeader>
        <BackBtn onClick={() => navigate('/appointments')}>
          <ArrowLeftOutlined /> Appointments
        </BackBtn>
        {!isCancelledOrCompleted && role !== 'patient' && (
          <Button variant="primary" icon={<EditOutlined />} onClick={() => setShowEdit(true)}>
            Edit / Reschedule
          </Button>
        )}
      </DetailHeader>

      {loading ? (
        <Skeleton active paragraph={{ rows: 8 }} />
      ) : appointment ? (
        <>
          <AppointmentCard>
            <CardHeader>
              <CardTitle>Appointment #{appointment.id}</CardTitle>
              <StatusBadge status={appointment.status} />
            </CardHeader>
            <CardGrid>
              <CardField>
                <FieldLabel>Patient</FieldLabel>
                <FieldValue>{appointment.patient_name || `Patient #${appointment.patient_id}`}</FieldValue>
              </CardField>
              <CardField>
                <FieldLabel>Doctor</FieldLabel>
                <FieldValue>{appointment.doctor_name || `Doctor #${appointment.doctor_id}`}</FieldValue>
              </CardField>
              <CardField>
                <FieldLabel>Date</FieldLabel>
                <FieldValue>{formatDate(appointment.appointment_date)}</FieldValue>
              </CardField>
              <CardField>
                <FieldLabel>Time</FieldLabel>
                <FieldValue>
                  {appointment.start_time?.slice(0, 5)} – {appointment.end_time?.slice(0, 5)}
                </FieldValue>
              </CardField>
              <CardField>
                <FieldLabel>Duration</FieldLabel>
                <FieldValue>{calcDuration(appointment.start_time, appointment.end_time)}</FieldValue>
              </CardField>
              <CardField>
                <FieldLabel>Type</FieldLabel>
                <FieldValue>
                  {appointment.type
                    ? appointment.type.charAt(0).toUpperCase() + appointment.type.slice(1).replace('_', ' ')
                    : '—'}
                </FieldValue>
              </CardField>
            </CardGrid>
          </AppointmentCard>

          <StatusTimeline>
            <TimelineTitle>Status</TimelineTitle>
            <Steps
              current={currentStep}
              status={stepStatus}
              items={stepsItems}
              size="small"
            />

            <ActionRow>
              {status === 'scheduled' && canStaff && (
                <Button
                  variant="primary"
                  loading={saving}
                  onClick={() => updateStatus(appointment.id, 'confirmed')}
                >
                  Confirm Appointment
                </Button>
              )}

              {/* {status === 'confirmed' && canNurseOrAbove && (
                <Button
                  variant="primary"
                  loading={saving}
                  onClick={() => updateStatus(appointment.id, 'completed')}
                >
                  Mark as Completed
                </Button>
              )} */}
{status === 'confirmed' && canNurseOrAbove && (() => {
 const now = new Date();
 const apptDate = appointment.appointment_date; // 'YYYY-MM-DD'
 const apptEnd  = appointment.end_time;         // 'HH:mm:ss'
 //const todayStr = now.toISOString().slice(0, 10);
 const todayStr = now.toLocaleDateString('en-CA');
 const nowTime  = now.toTimeString().slice(0, 8); // 'HH:mm:ss'
 const canComplete =
   apptDate < todayStr ||
   (apptDate === todayStr && apptEnd <= nowTime);
 return (
   <Button
     variant="primary"
     loading={saving}
     disabled={!canComplete}
     title={!canComplete ? 'Cannot complete before appointment end time' : ''}
     onClick={() => updateStatus(appointment.id, 'completed')}
   >
     Mark as Completed
   </Button>
 );
})()}



              {!isCancelledOrCompleted && (
                <Popconfirm
                  title="Cancel this appointment?"
                  description="This action cannot be undone."
                  onConfirm={() => cancelAppointment(appointment.id)}
                  okText="Cancel Appointment"
                  cancelText="Keep"
                  okType="danger"
                >
                  <Button variant="danger" loading={cancelling}>
                    Cancel Appointment
                  </Button>
                </Popconfirm>
              )}
            </ActionRow>
          </StatusTimeline>

          {appointment.notes && (
            <NotesSection>
              <NotesTitle>Notes</NotesTitle>
              <NotesText>{appointment.notes}</NotesText>
            </NotesSection>
          )}
        </>
      ) : (
        <EmptyMsg>Appointment not found.</EmptyMsg>
      )}

      <AppointmentForm
        open={showEdit}
        onClose={() => setShowEdit(false)}
        onSuccess={() => {
          setShowEdit(false);
          fetchAppointment(Number(id));
        }}
        initialData={appointment}
      />
    </PageWrap>
  );
};

export default AppointmentDetailPage;

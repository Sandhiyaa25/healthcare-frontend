import React from 'react';
import { Skeleton } from 'antd';
import {
  ApptItem,
  PatientName,
  ApptMeta,
  StatusDot,
  EmptyState,
  SkeletonWrap,
} from './AppointmentSelector.styled';

const STATUS_LABELS = {
  scheduled: 'Scheduled',
  confirmed:  'Confirmed',
  completed:  'Completed',
  cancelled:  'Cancelled',
  no_show:    'No Show',
};

const formatApptDate = (dateStr) => {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (isNaN(d)) return dateStr;
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

const formatApptTime = (timeStr) => {
  if (!timeStr) return '';
  // timeStr may be "09:30:00" or "09:30"
  const [h, m] = timeStr.split(':');
  const d = new Date();
  d.setHours(Number(h), Number(m));
  return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
};

const AppointmentSelector = ({ appointments, selectedId, loading, onSelect }) => {
  if (loading) {
    return (
      <>
        {[1, 2, 3, 4].map((n) => (
          <SkeletonWrap key={n}>
            <Skeleton active paragraph={{ rows: 1 }} title={{ width: '60%' }} />
          </SkeletonWrap>
        ))}
      </>
    );
  }

  if (!appointments.length) {
    return <EmptyState>No appointments found</EmptyState>;
  }

  return (
    <>
      {appointments.map((appt) => {
        const id     = appt.id;
        const status = appt.status || 'scheduled';
        return (
          <ApptItem
            key={id}
            className={selectedId === id ? 'active' : ''}
            onClick={() => onSelect(id)}
          >
            <PatientName>{appt.patient_name || `Patient #${id}`}</PatientName>
            <ApptMeta>
              <StatusDot $status={status} />
              <span>{STATUS_LABELS[status] || status}</span>
              <span>{formatApptDate(appt.appointment_date || appt.date)}</span>
              {(appt.start_time || appt.time) && (
                <span>{formatApptTime(appt.start_time || appt.time)}</span>
              )}
            </ApptMeta>
          </ApptItem>
        );
      })}
    </>
  );
};

export default AppointmentSelector;

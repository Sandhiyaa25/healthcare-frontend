import React from 'react';
import {
  SummaryWrap, SummaryHeader, SummaryTitle, ViewAllBtn,
  TableWrap, Table, Thead, Tbody, Tr, Th, Td, EmptyState,
} from './AppointmentSummary.styled';
import Badge from '../../../components/ui/Badge/Badge';
import { CalendarOutlined, InboxOutlined } from '@ant-design/icons';

const STATUS_VARIANT = {
  scheduled:  'primary',
  completed:  'success',
  cancelled:  'danger',
  pending:    'warning',
  confirmed:  'info',
  no_show:    'default',
};

/**
 * Formats appointment date+time from API fields.
 * API returns: appointment_date (DATE) + start_time (TIME)
 */
const formatApptDateTime = (appt) => {
  if (appt.appointment_date && appt.start_time) {
    const dt = new Date(`${appt.appointment_date}T${appt.start_time}`);
    return dt.toLocaleString('en-IN', {
      day: '2-digit', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
  }
  if (appt.scheduled_at) {
    return new Date(appt.scheduled_at).toLocaleString('en-IN', {
      day: '2-digit', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
  }
  return '—';
};

/**
 * Gets patient name from various API response formats.
 */
const getPatientName = (appt) => {
  if (appt.patient_name) return appt.patient_name;
  if (appt.patient?.first_name) return `${appt.patient.first_name} ${appt.patient.last_name || ''}`.trim();
  if (appt.first_name) return `${appt.first_name} ${appt.last_name || ''}`.trim();
  return `Patient #${appt.patient_id || '?'}`;
};

const getDoctorName = (appt) => {
  if (appt.doctor_name) return appt.doctor_name;
  if (appt.doctor?.first_name) return `Dr. ${appt.doctor.first_name} ${appt.doctor.last_name || ''}`.trim();
  return `Dr. #${appt.doctor_id || '?'}`;
};

const AppointmentSummary = ({ appointments = [], role }) => {
  const isEmpty = !appointments || appointments.length === 0;

  return (
    <SummaryWrap>
      <SummaryHeader>
        <SummaryTitle>
          <CalendarOutlined />
          Recent Appointments
        </SummaryTitle>
        <ViewAllBtn type="button">View all →</ViewAllBtn>
      </SummaryHeader>

      {isEmpty ? (
        <EmptyState>
          <InboxOutlined style={{ fontSize: 36, marginBottom: 8, display: 'block' }} />
          No appointments to display
        </EmptyState>
      ) : (
        <TableWrap>
          <Table>
            <Thead>
              <Tr>
                <Th>#</Th>
                <Th>Patient</Th>
                {role !== 'doctor' && <Th>Doctor</Th>}
                <Th>Date & Time</Th>
                <Th>Type</Th>
                <Th>Status</Th>
              </Tr>
            </Thead>
            <Tbody>
              {appointments.map((appt, idx) => (
                <Tr key={appt.id || idx} $clickable>
                  <Td $muted>{idx + 1}</Td>
                  <Td $bold>{getPatientName(appt)}</Td>
                  {role !== 'doctor' && <Td>{getDoctorName(appt)}</Td>}
                  <Td $muted>{formatApptDateTime(appt)}</Td>
                  <Td $muted>{appt.type || 'consultation'}</Td>
                  <Td>
                    <Badge variant={STATUS_VARIANT[appt.status] || 'default'}>
                      {appt.status?.replace('_', ' ')}
                    </Badge>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableWrap>
      )}
    </SummaryWrap>
  );
};

export default AppointmentSummary;

import React from 'react';
import { Table, Popconfirm, Tooltip } from 'antd';
import { EyeOutlined, EditOutlined, StopOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import StatusBadge from './StatusBadge';
import useAppointments from '../../../hooks/useAppointments';
import {
  TableWrap,
  ActionGroup,
  ActionBtn,
  NameCell,
  NamePrimary,
  NameSub,
} from './AppointmentTable.styled';

dayjs.extend(utc);


const TERMINAL_STATUSES = ['cancelled', 'completed'];

const calcDuration = (start, end) => {
  if (!start || !end) return '—';
  const [sh, sm] = start.split(':').map(Number);
  const [eh, em] = end.split(':').map(Number);
  const diff = (eh * 60 + em) - (sh * 60 + sm);
  return diff > 0 ? `${diff} min` : '—';
};

const formatApptTime = (appt) => {
  if (!appt.appointment_date || !appt.start_time) return '—';
  return dayjs.utc(`${appt.appointment_date} ${appt.start_time}`).local().format('DD MMM YYYY HH:mm');
};

const capitalize = (s) => s ? s.charAt(0).toUpperCase() + s.slice(1).replace('_', ' ') : '—';

const AppointmentTable = ({
  appointments,
  loading,
  role,
  onView,
  onEdit,
  pagination,
  onPageChange,
  currentPage,
}) => {
  const { cancelAppointment } = useAppointments();

  // const canEdit = (appt) =>
  //   role !== 'patient' && !TERMINAL_STATUSES.includes(appt.status);
const canEdit = (appt) => {
  // Admin: view only — no edit
  if (role === 'admin') return false;
  // Patient: no edit
  if (role === 'patient') return false;
  // Terminal statuses: no edit for anyone
  if (TERMINAL_STATUSES.includes(appt.status)) return false;
  // Doctor: only their own
  if (role === 'doctor') return true;
  // Nurse, Receptionist: can edit
  return ['nurse', 'receptionist'].includes(role);
};

  // const canCancel = (appt) =>
  //   !TERMINAL_STATUSES.includes(appt.status);

const canCancel = (appt) => {
  if (TERMINAL_STATUSES.includes(appt.status)) return false;
  // Admin: no cancel
  if (role === 'admin') return false;
  // Patient: can cancel their own
  if (role === 'patient') return true;
  // Doctor, nurse, receptionist: can cancel
  return ['doctor', 'nurse', 'receptionist'].includes(role);
};

  const columns = [
    {
      title: 'Patient',
      key: 'patient',
      render: (_, row) => (
        <NameCell>
          <NamePrimary>{row.patient_name || `Patient #${row.patient_id}`}</NamePrimary>
          <NameSub>{capitalize(row.type)}</NameSub>
        </NameCell>
      ),
    },
    // Hide doctor column when logged in as doctor — they know it's them
    ...(role !== 'doctor' ? [{
      title: 'Doctor',
      key: 'doctor',
      render: (_, row) => (
        <NameCell>
          <NamePrimary>{row.doctor_name || `Doctor #${row.doctor_id}`}</NamePrimary>
        </NameCell>
      ),
    }] : []),
    {
      title: 'Date & Time',
      key: 'datetime',
      render: (_, row) => formatApptTime(row),
    },
    {
      title: 'Duration',
      key: 'duration',
      render: (_, row) => calcDuration(row.start_time, row.end_time),
    },
    {
      title: 'Status',
      key: 'status',
      render: (_, row) => <StatusBadge status={row.status} />,
    },
    {
      title: '',
      key: 'actions',
      width: 110,
      fixed: 'right',
      render: (_, row) => (
        <ActionGroup>
          <Tooltip title="View">
            <ActionBtn onClick={() => onView(row)}>
              <EyeOutlined />
            </ActionBtn>
          </Tooltip>

          {canEdit(row) && (
            <Tooltip title="Edit / Reschedule">
              <ActionBtn onClick={() => onEdit(row)}>
                <EditOutlined />
              </ActionBtn>
            </Tooltip>
          )}

          {canCancel(row) && (
            <Popconfirm
              title="Cancel this appointment?"
              description="This action cannot be undone."
              onConfirm={() => cancelAppointment(row.id)}
              okText="Cancel Appointment"
              cancelText="Keep"
              okType="danger"
            >
              <Tooltip title="Cancel">
                <ActionBtn $danger>
                  <StopOutlined />
                </ActionBtn>
              </Tooltip>
            </Popconfirm>
          )}
        </ActionGroup>
      ),
    },
  ];

  return (
    <TableWrap>
      <Table
        dataSource={Array.isArray(appointments) ? appointments : []}
        columns={columns}
        rowKey="id"
        loading={loading}
        scroll={{ x: 800 }}
        size="middle"
        pagination={{
          current: currentPage,
          pageSize: 20,
          total: pagination?.total || 0,
          onChange: onPageChange,
          showTotal: (total) => `${total} appointments total`,
          showSizeChanger: false,
        }}
        locale={{ emptyText: 'No appointments found.' }}
      />
    </TableWrap>
  );
};

export default AppointmentTable;

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { notification } from 'antd';
import { PlusOutlined, ReloadOutlined } from '@ant-design/icons';
import useAppointments from '../../hooks/useAppointments';
import useAuth from '../../hooks/useAuth';
import AppointmentTable from './components/AppointmentTable';
import AppointmentForm from './components/AppointmentForm';
import Spinner from '../../components/ui/Spinner/Spinner';
import {
  PageWrap,
  TopBar,
  PageTitle,
  Controls,
  DateInput,
  StatusSelect,
  ReloadButton,
  AddButton,
  CenteredSpinner,
} from './AppointmentsListPage.styled';

const todayStr = () => new Date().toISOString().slice(0, 10);

const AppointmentsListPage = () => {
  const [statusFilter, setStatusFilter] = useState('');
  const [dateFilter, setDateFilter]     = useState(todayStr());
  const [showForm, setShowForm]         = useState(false);
  const [editAppt, setEditAppt]         = useState(null);
  const [currentPage, setCurrentPage]   = useState(1);

  const { appointments, loading, error, pagination, fetchAppointments, clearError } =
    useAppointments();
  const { role } = useAuth();
  const navigate = useNavigate();

  const doFetch = (overrides = {}) => {
    fetchAppointments({
      page:     currentPage,
      per_page: 20,
      status:   statusFilter || undefined,
      date:     dateFilter   || undefined,
      ...overrides,
    });
  };

  useEffect(() => {
    doFetch();
  }, [currentPage, statusFilter, dateFilter]);

  useEffect(() => {
    if (error) {
      notification.error({ message: error });
      clearError();
    }
  }, [error, clearError]);

  const handleCreate = () => { setEditAppt(null); setShowForm(true); };
  const handleEdit   = (appt) => { setEditAppt(appt); setShowForm(true); };
  const handleView   = (appt) => navigate(`/appointments/${appt.id}`);

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditAppt(null);
    doFetch({ page: 1 });
    setCurrentPage(1);
  };

  const handlePageChange = (p) => setCurrentPage(p);

  const handleReload = () => doFetch();

  return (
    <PageWrap>
      <TopBar>
        <PageTitle>Appointments</PageTitle>
        <Controls>
          <DateInput
            type="date"
            value={dateFilter}
            onChange={(e) => { setDateFilter(e.target.value); setCurrentPage(1); }}
          />
          <StatusSelect
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
          >
            <option value="">All Status</option>
            <option value="scheduled">Scheduled</option>
            <option value="confirmed">Confirmed</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
            <option value="no_show">No Show</option>
          </StatusSelect>
          <ReloadButton onClick={handleReload}>
            <ReloadOutlined />
          </ReloadButton>
          {/* {role !== 'patient' && (
            <AddButton onClick={handleCreate}> */}
            
           {!['admin', 'pharmacist'].includes(role) && (
  <AddButton onClick={() => setShowForm(true)}>

              <PlusOutlined /> New Appointment
            </AddButton>
          )}
        </Controls>
      </TopBar>

      {loading && appointments.length === 0 ? (
        <CenteredSpinner>
          <Spinner size="lg" />
        </CenteredSpinner>
      ) : (
        <AppointmentTable
          appointments={appointments}
          loading={loading}
          role={role}
          onView={handleView}
          onEdit={handleEdit}
          pagination={pagination}
          onPageChange={handlePageChange}
          currentPage={currentPage}
        />
      )}

      <AppointmentForm
        open={showForm}
        onClose={() => setShowForm(false)}
        onSuccess={handleFormSuccess}
        initialData={editAppt}
      />
    </PageWrap>
  );
};

export default AppointmentsListPage;

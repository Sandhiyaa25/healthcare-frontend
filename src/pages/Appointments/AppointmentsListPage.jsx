import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setCurrentPage } from '../../store/appointments/appointmentsSlice';

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

const AppointmentsListPage = () => {
  const [statusFilter, setStatusFilter] = useState('');
  const [dateFilter, setDateFilter]     = useState('');
  const [showForm, setShowForm]         = useState(false);
  const [editAppt, setEditAppt]         = useState(null);

  // currentPage lives in Redux — single source of truth
  const currentPage = useSelector((s) => s.appointments.currentPage);
  const dispatch    = useDispatch();

  const { appointments, loading, error, pagination, fetchAppointments, clearError } =
    useAppointments();
  const { role }   = useAuth();
  const navigate   = useNavigate();

  // ─── Single fetch helper ──────────────────────────────────────────────────
  // Always pass the page explicitly so the call is never stale-closure bound.
  const doFetch = (page, overrides = {}) => {
    fetchAppointments({
      page,
      per_page: 5,
      status:   statusFilter || undefined,
      date:     dateFilter   || undefined,
      ...overrides,
    });
  };

  // ─── Effects ──────────────────────────────────────────────────────────────
  // Re-fetch whenever currentPage, statusFilter, or dateFilter changes.
  // This is the ONLY place doFetch is called from state changes — we do NOT
  // also call doFetch inside handlePageChange to avoid a double-trigger.
  useEffect(() => {
    doFetch(currentPage);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, statusFilter, dateFilter]);

  useEffect(() => {
    if (error) {
      notification.error({ message: error });
      clearError();
    }
  }, [error, clearError]);

  // ─── Handlers ─────────────────────────────────────────────────────────────
  const handleCreate = () => { setEditAppt(null); setShowForm(true); };
  const handleEdit   = (appt) => { setEditAppt(appt); setShowForm(true); };
  const handleView   = (appt) => navigate(`/appointments/${appt.id}`);

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditAppt(null);
    // Dispatch properly — this updates Redux state AND triggers the useEffect above
    dispatch(setCurrentPage(1));
  };

  // BUG FIX: Only dispatch setCurrentPage here — do NOT also call doFetch().
  // The useEffect([currentPage]) above will fire automatically when currentPage
  // changes and will call doFetch with the correct (non-stale) value.
  const handlePageChange = (p) => {
    dispatch(setCurrentPage(p));
  };

  // BUG FIX: Filter changes must use dispatch(setCurrentPage(1)), not the bare
  // imported action creator (which is just a function, not a dispatch call).
  const handleStatusChange = (e) => {
    setStatusFilter(e.target.value);
    dispatch(setCurrentPage(1));
  };

  const handleDateChange = (e) => {
    setDateFilter(e.target.value);
    dispatch(setCurrentPage(1));
  };

  const handleReload = () => doFetch(currentPage);

  return (
    <PageWrap>
      <TopBar>
        <PageTitle>Appointments</PageTitle>
        <Controls>
          <DateInput
            type="date"
            value={dateFilter}
            onChange={handleDateChange}
          />
          <StatusSelect
            value={statusFilter}
            onChange={handleStatusChange}
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
          {!['admin', 'pharmacist'].includes(role) && (
            <AddButton onClick={handleCreate}>
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
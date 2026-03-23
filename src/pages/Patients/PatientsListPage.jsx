import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { notification } from 'antd';
import { PlusOutlined, SearchOutlined, ReloadOutlined } from '@ant-design/icons';
import usePatients from '../../hooks/usePatient';
import useAuth from '../../hooks/useAuth';
import PatientTable from './components/PatientTable';
import PatientForm from './components/PatientForm';
import Spinner from '../../components/ui/Spinner/Spinner';
import {
  PageWrap,
  TopBar,
  PageTitle,
  Controls,
  SearchBox,
  SearchInput,
  StatusSelect,
  ReloadButton,
  AddButton,
  CenteredSpinner,
} from './PatientsListPage.styled';

const PatientsListPage = () => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editPatient, setEditPatient] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const searchTimerRef = useRef(null);

  const { patients: rawPatients, loading, error, pagination: rawPagination, fetchPatients, deletePatient, clearError } = usePatients();
  const { role } = useAuth();
  const navigate = useNavigate();

  // The saga dispatches fetchPatientsSuccess(res.data?.data) which is { patients, pagination }.
  // The slice reducer sets list = payload.data || payload, so list ends up as the object.
  // Normalize here so PatientTable always receives an array.
  const patients = Array.isArray(rawPatients) ? rawPatients : (rawPatients?.patients || []);
  const pagination = Array.isArray(rawPatients) ? rawPagination : (rawPatients?.pagination || rawPagination || {});

  const doFetch = useCallback(
    (overrides = {}) => {
      fetchPatients({
        page: currentPage,
        per_page: 5,
        search,
        status: statusFilter || undefined,
        ...overrides,
      });
    },
    [fetchPatients, currentPage, search, statusFilter],
  );

  useEffect(() => {
    doFetch();
  }, [currentPage, statusFilter, fetchPatients]);

  useEffect(() => {
    if (error) {
      notification.error({ message: error });
      clearError();
    }
  }, [error, clearError]);

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearch(val);
    clearTimeout(searchTimerRef.current);
    searchTimerRef.current = setTimeout(() => {
      setCurrentPage(1);
      fetchPatients({ page: 1, per_page: 5, search: val, status: statusFilter || undefined });
    }, 350);
  };

  const handleEdit = (patient) => {
    setEditPatient(patient);
    setShowForm(true);
  };

  const handleCreate = () => {
    setEditPatient(null);
    setShowForm(true);
  };

  const handleView = (patient) => {
    navigate(`/patients/${patient.id}`);
  };

  const handleDelete = (id) => {
    deletePatient(id);
    notification.success({ message: 'Patient deleted successfully' });
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditPatient(null);
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditPatient(null);
    doFetch();
  };

  const handlePageChange = (p) => {
    setCurrentPage(p);
  };

  const handleReload = () => {
    doFetch();
  };

  return (
    <PageWrap>
      <TopBar>
        <PageTitle>Patients</PageTitle>
        <Controls>
          <SearchBox>
            <SearchOutlined />
            <SearchInput
              value={search}
              onChange={handleSearchChange}
              placeholder="Search by name or email..."
            />
          </SearchBox>
          <StatusSelect value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="deceased">Deceased</option>
          </StatusSelect>
          <ReloadButton onClick={handleReload}>
            <ReloadOutlined />
          </ReloadButton>
          <AddButton onClick={handleCreate}>
            <PlusOutlined /> Add Patient
          </AddButton>
        </Controls>
      </TopBar>

      {loading && patients.length === 0 ? (
        <CenteredSpinner>
          <Spinner size="lg" />
        </CenteredSpinner>
      ) : (
        <PatientTable
          patients={patients}
          loading={loading}
          role={role}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete}
          pagination={pagination}
          onPageChange={handlePageChange}
          currentPage={currentPage}
        />
      )}

      <PatientForm
        open={showForm}
        onClose={handleFormClose}
        onSuccess={handleFormSuccess}
        initialData={editPatient}
      />
    </PageWrap>
  );
};

export default PatientsListPage;

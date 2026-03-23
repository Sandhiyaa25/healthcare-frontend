import React, { useEffect, useState, useCallback } from 'react';
import { Table, Tooltip, Modal, Alert } from 'antd';
import {
  PlusOutlined, ReloadOutlined, EyeOutlined,
  CheckCircleOutlined, CloseCircleOutlined, ExperimentOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import usePrescriptions from '../../hooks/usePrescriptions';
import useAuth          from '../../hooks/useAuth';
import Badge            from '../../components/ui/Badge/Badge';
import Spinner          from '../../components/ui/Spinner/Spinner';
import PrescriptionForm        from './components/PrescriptionForm';
import PrescriptionDetailModal from './components/PrescriptionDetailModal';
import VerifyModal             from './components/VerifyModal';
import {
  PageWrap, TopBar, PageTitle, Controls,
  FilterSelect, IconBtn, AddBtn, TableWrap,
  CellPrimary, CellSub, ActionGroup, ActionBtn,
  ErrorMsg, CenteredSpin,
} from './PrescriptionsListPage.styled';

const STATUS_VARIANT = {
  pending:   'warning',
  dispensed: 'success',
  rejected:  'danger',
};

const PrescriptionsListPage = () => {
  const { role } = useAuth();
  const {
    list, loading, error, saving, saveError, pagination,
    fetchList, createPrescription, verifyPrescription,
    clearSaveErr, clearFetchErr,
  } = usePrescriptions();

  const [statusFilter, setStatusFilter] = useState('');
  const [showForm,     setShowForm]     = useState(false);
  const [viewItem,     setViewItem]     = useState(null);
  const [verifyItem,   setVerifyItem]   = useState(null);
  const [page,         setPage]         = useState(1);

  const load = useCallback((p = page, status = statusFilter) => {
    fetchList({ page: p, perPage: 10, status: status || undefined });
  }, [fetchList, page, statusFilter]);

  useEffect(() => { load(1); }, []);

  const handleStatusFilter = (e) => {
    const val = e.target.value;
    setStatusFilter(val);
    setPage(1);
    fetchList({ page: 1, perPage: 10, status: val || undefined });
  };

  const handlePageChange = (p) => {
    setPage(p);
    fetchList({ page: p, perPage: 10, status: statusFilter || undefined });
  };

  const handleCreate = (data) => {
    createPrescription(data, () => {
      setShowForm(false);
      load(1);
    });
  };

  const handleVerify = (status) => {
    if (!verifyItem) return;
    verifyPrescription(verifyItem.id, status, () => {
      setVerifyItem(null);
      load(page);
    });
  };

  const canCreate = role === 'doctor';
  const canVerify = role === 'pharmacist';

  const columns = [
    {
      title: 'Patient',
      key: 'patient',
      render: (_, row) => (
        <>
          <CellPrimary>{row.patient_name || `Patient #${row.patient_id}`}</CellPrimary>
        </>
      ),
    },
    {
      title: 'Doctor',
      key: 'doctor',
      render: (_, row) => (
        <CellPrimary>{row.doctor_name || `Doctor #${row.doctor_id}`}</CellPrimary>
      ),
    },
    {
      title: 'Appointment',
      key: 'appointment',
      render: (_, row) => (
        <CellSub>#{row.appointment_id || '—'}</CellSub>
      ),
    },
    {
      title: 'Date',
      key: 'date',
      render: (_, row) => (
        <CellSub>
          {row.created_at ? dayjs(row.created_at).format('DD MMM YYYY') : '—'}
        </CellSub>
      ),
    },
    {
      title: 'Status',
      key: 'status',
      render: (_, row) => (
        <Badge variant={STATUS_VARIANT[row.status] || 'default'}>
          {row.status}
        </Badge>
      ),
    },
    {
      title: 'Verified By',
      key: 'verified_by',
      render: (_, row) => (
        <CellSub>
          {row.verified_by
            ? `Pharmacist #${row.verified_by}`
            : row.status === 'pending' ? '—' : '—'}
        </CellSub>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      align: 'right',
      render: (_, row) => (
        <ActionGroup>
          <Tooltip title="View Details">
            <ActionBtn onClick={() => setViewItem(row)}>
              <EyeOutlined />
            </ActionBtn>
          </Tooltip>
          {canVerify && row.status === 'pending' && (
            <>
              <Tooltip title="Mark as Dispensed">
                <ActionBtn
                  $variant="success"
                  onClick={() => setVerifyItem(row)}
                >
                  <CheckCircleOutlined />
                </ActionBtn>
              </Tooltip>
            </>
          )}
        </ActionGroup>
      ),
    },
  ];

  // Role-based column filtering
  const visibleColumns = columns.filter((col) => {
    // Patient sees their own — hide doctor column optional
    // Nurse/Admin: all columns
    return true;
  });

  return (
    <PageWrap>
      <TopBar>
        <PageTitle>
          <ExperimentOutlined style={{ marginRight: 10, color: 'inherit' }} />
          Prescriptions
        </PageTitle>
        <Controls>
          <FilterSelect value={statusFilter} onChange={handleStatusFilter}>
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="dispensed">Dispensed</option>
            <option value="rejected">Rejected</option>
          </FilterSelect>
          <IconBtn onClick={() => load(page)} title="Refresh">
            <ReloadOutlined />
          </IconBtn>
          {canCreate && (
            <AddBtn onClick={() => setShowForm(true)}>
              <PlusOutlined /> New Prescription
            </AddBtn>
          )}
        </Controls>
      </TopBar>

      {error && (
        <ErrorMsg>
          <CloseCircleOutlined />
          {error}
        </ErrorMsg>
      )}

      <TableWrap>
        {loading && list.length === 0 ? (
          <CenteredSpin><Spinner size="md" /></CenteredSpin>
        ) : (
          <Table
            dataSource={list}
            columns={visibleColumns}
            rowKey="id"
            loading={loading}
            pagination={{
              current:   page,
              pageSize:  pagination.perPage || 10,
              total:     pagination.total   || 0,
              onChange:  handlePageChange,
              showSizeChanger: false,
              showTotal: (total, range) =>
                `${range[0]}–${range[1]} of ${total} prescriptions`,
            }}
          />
        )}
      </TableWrap>

      {/* Create form — doctors only */}
      {showForm && (
        <PrescriptionForm
          open={showForm}
          onClose={() => { setShowForm(false); clearSaveErr(); }}
          onSubmit={handleCreate}
          saving={saving}
          saveError={saveError}
          onClearError={clearSaveErr}
        />
      )}

      {/* Detail view modal */}
      {viewItem && (
        <PrescriptionDetailModal
          item={viewItem}
          onClose={() => setViewItem(null)}
          canVerify={canVerify && viewItem.status === 'pending'}
          onVerify={() => { setVerifyItem(viewItem); setViewItem(null); }}
        />
      )}

      {/* Verify modal — pharmacist */}
      {verifyItem && (
        <VerifyModal
          item={verifyItem}
          open={!!verifyItem}
          saving={saving}
          saveError={saveError}
          onClose={() => { setVerifyItem(null); clearSaveErr(); }}
          onVerify={handleVerify}
        />
      )}
    </PageWrap>
  );
};

export default PrescriptionsListPage;
import React, { useEffect, useState, useCallback } from 'react';
import { Table, Tooltip, Alert, Select } from 'antd';
import {
  PlusOutlined, ReloadOutlined, EyeOutlined,
  MedicineBoxOutlined, CloseCircleOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import useRecords   from '../../hooks/useRecords';
import useAuth      from '../../hooks/useAuth';
import RecordDetailModal from './components/RecordDetailModal';
import RecordForm        from './components/RecordForm';
import { fetchPatientsApi } from '../../api/patients.api';
import {
  PageWrap, TopBar, PageTitle, Controls,
  IconBtn, AddBtn, TableWrap,
  CellPrimary, CellSub, ComplaintText, RecordTypeBadge,
  ActionGroup, ActionBtn, ErrorMsg,
} from './RecordsListPage.styled';

const RECORD_TYPES = [
  'consultation','follow_up','emergency','routine',
  'lab_report','surgery','discharge_summary',
];

const RecordsListPage = () => {
  const { role, user } = useAuth();
  const {
    list, loading, error, saving, saveError, pagination,
    fetchList, createRecord, updateRecord,
    clearSaveErr,
  } = useRecords();

  const [page,     setPage]     = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [viewItem, setViewItem] = useState(null);
  const [editItem, setEditItem] = useState(null);
  const [patients, setPatients] = useState([]);

  const canCreate = ['doctor', 'nurse'].includes(role);
  const isPatient = role === 'patient';

  // Load patients for form dropdown
  useEffect(() => {
    if (isPatient) return;
    fetchPatientsApi({ per_page: 50 })
      .then((r) => {
        const raw = r.data?.data;
        const list = Array.isArray(raw) ? raw
          : Array.isArray(raw?.patients) ? raw.patients
          : Array.isArray(raw?.data) ? raw.data : [];
        setPatients(list);
      })
      .catch(() => {});
  }, [isPatient]);

  const load = useCallback((p = 1) => {
    fetchList({ page: p, perPage: 5 });
    setPage(p);
  }, [fetchList]);

  // useEffect(() => { load(1); }, []);
  useEffect(() => { load(1); }, [load]);


  const handleCreate = (data) => {
    createRecord(data, () => { setShowForm(false); load(page); });
  };

  const handleUpdate = (data) => {
    if (!editItem) return;
    updateRecord(editItem.id, data, () => { setEditItem(null); load(page); });
  };

  const columns = [
    {
      title: 'Patient',
      key: 'patient',
      render: (_, r) => (
        <CellPrimary>{r.patient_name || `Patient #${r.patient_id}`}</CellPrimary>
      ),
    },
    {
      title: 'Doctor',
      key: 'doctor',
      render: (_, r) => (
        <CellPrimary>{r.doctor_name || `Doctor #${r.doctor_id}`}</CellPrimary>
      ),
    },
    {
      title: 'Type',
      key: 'type',
      render: (_, r) => (
        <RecordTypeBadge>{r.record_type || 'consultation'}</RecordTypeBadge>
      ),
    },
    {
      title: 'Chief Complaint',
      key: 'complaint',
      render: (_, r) => <ComplaintText>{r.chief_complaint || '—'}</ComplaintText>,
    },
    {
      title: 'Date',
      key: 'date',
      render: (_, r) => (
        <CellSub>{r.created_at ? dayjs(r.created_at).format('DD MMM YYYY') : '—'}</CellSub>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      align: 'right',
      render: (_, r) => (
        <ActionGroup>
          <Tooltip title="View Full Record">
            <ActionBtn onClick={() => setViewItem(r)}><EyeOutlined /></ActionBtn>
          </Tooltip>
          {canCreate && (
            <Tooltip title="Edit Record">
              <ActionBtn onClick={() => setEditItem(r)}><MedicineBoxOutlined /></ActionBtn>
            </Tooltip>
          )}
        </ActionGroup>
      ),
    },
  ];

  const visibleColumns = isPatient
    ? columns.filter((c) => c.key !== 'patient')
    : columns;

  return (
    <PageWrap>
      <TopBar>
        <PageTitle><MedicineBoxOutlined /> Medical Records</PageTitle>
        <Controls>
          <IconBtn onClick={() => load(page)} title="Refresh"><ReloadOutlined /></IconBtn>
          {canCreate && (
            <AddBtn onClick={() => setShowForm(true)}>
              <PlusOutlined /> New Record
            </AddBtn>
          )}
        </Controls>
      </TopBar>

      {error && <ErrorMsg><CloseCircleOutlined /> {error}</ErrorMsg>}

      <TableWrap>
        <Table
          dataSource={list}
          columns={visibleColumns}
          rowKey="id"
          loading={loading}
          scroll={{ x: 700 }}
          pagination={{
            current:  page,
            pageSize: 5,
            total:    pagination.total || 0,
            onChange: (p) => { setPage(p); fetchList({ page: p, perPage: 5 }); },
            showSizeChanger: false,
            showTotal: (total, range) => `${range[0]}–${range[1]} of ${total} records`,
          }}
        />
      </TableWrap>

      {showForm && (
        <RecordForm
          open={showForm}
          onClose={() => { setShowForm(false); clearSaveErr(); }}
          onSubmit={handleCreate}
          saving={saving}
          saveError={saveError}
          onClearError={clearSaveErr}
          patients={patients}
          recordTypes={RECORD_TYPES}
          isEdit={false}
        />
      )}

      {editItem && (
        <RecordForm
          open={!!editItem}
          onClose={() => { setEditItem(null); clearSaveErr(); }}
          onSubmit={handleUpdate}
          saving={saving}
          saveError={saveError}
          onClearError={clearSaveErr}
          initialData={editItem}
          patients={patients}
          recordTypes={RECORD_TYPES}
          isEdit
        />
      )}

      {viewItem && (
        <RecordDetailModal item={viewItem} onClose={() => setViewItem(null)} />
      )}
    </PageWrap>
  );
};

export default RecordsListPage;
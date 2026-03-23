import React from 'react';
import { Table, Popconfirm } from 'antd';
import { EyeOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import Badge from '../../../components/ui/Badge/Badge';
import { formatDate } from '../../../utils/dateUtils';
import {
  TableWrap,
  ActionGroup,
  ActionBtn,
  PatientCell,
  PatientAvatar,
  PatientInfo,
  PatientName,
  PatientEmail,
} from './PatientTable.styled';

const STATUS_VARIANT = {
  active: 'success',
  inactive: 'warning',
  deceased: 'danger',
};

const PatientTable = ({
  patients,
  loading,
  role,
  onView,
  onEdit,
  onDelete,
  pagination,
  onPageChange,
  currentPage,
}) => {
  const columns = [
    {
      title: 'Patient',
      dataIndex: 'first_name',
      key: 'name',
      render: (_, row) => (
        <PatientCell>
          <PatientAvatar>
            {(row.first_name?.[0] || '?').toUpperCase()}
          </PatientAvatar>
          <PatientInfo>
            <PatientName>{row.first_name} {row.last_name}</PatientName>
            <PatientEmail>{row.email || '—'}</PatientEmail>
          </PatientInfo>
        </PatientCell>
      ),
    },
    {
      title: 'Date of Birth',
      dataIndex: 'date_of_birth',
      key: 'dob',
      render: (v) => formatDate(v),
    },
    {
      title: 'Phone',
      dataIndex: 'phone',
      key: 'phone',
      render: (v) => v || '—',
    },
    {
      title: 'Gender',
      dataIndex: 'gender',
      key: 'gender',
      render: (v) => v ? v.charAt(0).toUpperCase() + v.slice(1) : '—',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (v) => (
        <Badge variant={STATUS_VARIANT[v] || 'default'}>{v || '—'}</Badge>
      ),
    },
    {
      title: '',
      key: 'actions',
      width: 120,
      fixed: 'right',
      render: (_, row) => (
        <ActionGroup>
          <ActionBtn title="View" onClick={() => onView(row)}>
            <EyeOutlined />
          </ActionBtn>
          <ActionBtn title="Edit" onClick={() => onEdit(row)}>
            <EditOutlined />
          </ActionBtn>
          {role === 'admin' && (
            <Popconfirm
              title="Delete this patient?"
              description="This action cannot be undone."
              onConfirm={() => onDelete(row.id)}
              okText="Delete"
              cancelText="Cancel"
              okType="danger"
            >
              <ActionBtn $danger title="Delete">
                <DeleteOutlined />
              </ActionBtn>
            </Popconfirm>
          )}
        </ActionGroup>
      ),
    },
  ];

  return (
    <TableWrap>
      <Table
        dataSource={patients}
        columns={columns}
        rowKey="id"
        loading={loading}
        scroll={{ x: 900 }}
        size="middle"
        pagination={{
          current: currentPage,
          pageSize: 5,
          total: pagination?.total || 0,
          onChange: onPageChange,
          showTotal: (total) => `${total} patients total`,
          showSizeChanger: false,
        }}
        locale={{ emptyText: 'No patients found. Add your first patient.' }}
      />
    </TableWrap>
  );
};

export default PatientTable;

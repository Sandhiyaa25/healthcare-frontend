import React, { useState } from 'react';
import { Modal, Select, Alert, Button } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import Badge from '../../../components/ui/Badge/Badge';
import {
  VerifyWrap, RxSummary, RxRow, RxLabel, RxValue,
  StatusSelectWrap, StatusLabel,
} from './VerifyModal.styled';

const VerifyModal = ({ item, open, saving, saveError, onClose, onVerify, onClearError }) => {
  const [status, setStatus] = useState('dispensed');

  if (!item) return null;

  const handleVerify = () => onVerify(status);

  return (
    <Modal
      open={open}
      onCancel={onClose}
      title="Verify Prescription"
      width={440}
      footer={[
        <Button key="cancel" onClick={onClose} disabled={saving}>Cancel</Button>,
        <Button
          key="submit"
          type={status === 'dispensed' ? 'primary' : 'default'}
          danger={status === 'rejected'}
          icon={status === 'dispensed' ? <CheckCircleOutlined /> : <CloseCircleOutlined />}
          loading={saving}
          onClick={handleVerify}
        >
          {status === 'dispensed' ? 'Confirm Dispensed' : 'Reject Prescription'}
        </Button>,
      ]}
      destroyOnHidden
    >
      <VerifyWrap>
        {saveError && (
          <Alert
            type="error"
            message={saveError}
            closable
            onClose={onClearError}
            style={{ marginBottom: 12 }}
          />
        )}

        <RxSummary>
          <RxRow>
            <RxLabel>Patient</RxLabel>
            <RxValue>{item.patient_name || `Patient #${item.patient_id}`}</RxValue>
          </RxRow>
          <RxRow>
            <RxLabel>Doctor</RxLabel>
            <RxValue>{item.doctor_name || `Doctor #${item.doctor_id}`}</RxValue>
          </RxRow>
          <RxRow>
            <RxLabel>Date</RxLabel>
            <RxValue>
              {item.created_at ? dayjs(item.created_at).format('DD MMM YYYY') : '—'}
            </RxValue>
          </RxRow>
          <RxRow>
            <RxLabel>Medicines</RxLabel>
            <RxValue>
              {Array.isArray(item.medicines) ? item.medicines.length : '—'} item(s)
            </RxValue>
          </RxRow>
          <RxRow>
            <RxLabel>Current Status</RxLabel>
            <RxValue>
              <Badge variant="warning">{item.status}</Badge>
            </RxValue>
          </RxRow>
        </RxSummary>

        <StatusSelectWrap>
          <StatusLabel>Update Status To:</StatusLabel>
          <Select
            value={status}
            onChange={setStatus}
            style={{ width: '100%' }}
            size="large"
          >
            <Select.Option value="dispensed">
              <CheckCircleOutlined style={{ color: '#16A34A', marginRight: 6 }} />
              Dispensed — Medicines handed to patient
            </Select.Option>
            <Select.Option value="rejected">
              <CloseCircleOutlined style={{ color: '#DC2626', marginRight: 6 }} />
              Rejected — Cannot dispense
            </Select.Option>
          </Select>
        </StatusSelectWrap>
      </VerifyWrap>
    </Modal>
  );
};

export default VerifyModal;
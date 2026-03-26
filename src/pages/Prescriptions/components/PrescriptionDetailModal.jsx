import React from 'react';
import { Modal, Tag, Divider, Button } from 'antd';
import {
  UserOutlined, CalendarOutlined, ExperimentOutlined,
  CheckCircleOutlined, MedicineBoxOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import Badge from '../../../components/ui/Badge/Badge';
import {
  DetailWrap, DetailRow, DetailLabel, DetailValue,
  SectionHead, MedTable, MedRow, MedCol, MedHeader,
  StatusRow, VerifiedBadge, DiagnosisBlock, NotesBlock,
} from './PrescriptionDetailModal.styled';

const STATUS_VARIANT = {
  pending: 'warning', dispensed: 'success', rejected: 'danger',
};

const PrescriptionDetailModal = ({ item, onClose, canVerify, onVerify }) => {
  if (!item) return null;

  const medicines = Array.isArray(item.medicines) ? item.medicines : [];

  return (
    <Modal
      open={!!item}
      onCancel={onClose}
      title={
        <span>
          <ExperimentOutlined style={{ marginRight: 8 }} />
          Prescription #{item.id}
        </span>
      }
      width={620}
      footer={[
        canVerify && (
          <Button
            key="verify"
            type="primary"
            icon={<CheckCircleOutlined />}
            onClick={onVerify}
          >
            Verify / Dispense
          </Button>
        ),
        <Button key="close" onClick={onClose}>Close</Button>,
      ].filter(Boolean)}
      destroyOnHidden
    >
      <DetailWrap>
        {/* Status */}
        <StatusRow>
          <Badge variant={STATUS_VARIANT[item.status] || 'default'}>
            {item.status?.toUpperCase()}
          </Badge>
          {item.verified_by && (
            <VerifiedBadge>
              <CheckCircleOutlined /> Verified by Pharmacist #{item.verified_by}
            </VerifiedBadge>
          )}
        </StatusRow>

        <Divider style={{ margin: '12px 0' }} />

        {/* Patient & Doctor */}
        <DetailRow>
          <DetailLabel><UserOutlined /> Patient</DetailLabel>
          <DetailValue>{item.patient_name || `Patient #${item.patient_id}`}</DetailValue>
        </DetailRow>
        <DetailRow>
          <DetailLabel><UserOutlined /> Doctor</DetailLabel>
          <DetailValue>{item.doctor_name || `Doctor #${item.doctor_id}`}</DetailValue>
        </DetailRow>
        {item.appointment_id && (
          <DetailRow>
            <DetailLabel><CalendarOutlined /> Appointment</DetailLabel>
            <DetailValue>#{item.appointment_id}</DetailValue>
          </DetailRow>
        )}
        <DetailRow>
          <DetailLabel><CalendarOutlined /> Date</DetailLabel>
          <DetailValue>
            {item.created_at ? dayjs(item.created_at).format('DD MMM YYYY, HH:mm') : '—'}
          </DetailValue>
        </DetailRow>

        {/* Diagnosis */}
        {item.diagnosis && (
          <>
            <Divider style={{ margin: '12px 0' }} />
            <SectionHead>Diagnosis</SectionHead>
            <DiagnosisBlock>{item.diagnosis}</DiagnosisBlock>
          </>
        )}

        {/* Medicines */}
        <Divider style={{ margin: '12px 0' }} />
        <SectionHead>
          <MedicineBoxOutlined style={{ marginRight: 6 }} />
          Medicines ({medicines.length})
        </SectionHead>

        {medicines.length > 0 ? (
          <MedTable>
            <MedRow $header>
              <MedHeader>Drug</MedHeader>
              <MedHeader>Dosage</MedHeader>
              <MedHeader>Frequency</MedHeader>
              <MedHeader>Duration</MedHeader>
            </MedRow>
            {medicines.map((med, idx) => (
              <MedRow key={idx}>
                <MedCol $primary>{med.name}</MedCol>
                <MedCol>{med.dosage}</MedCol>
                <MedCol>{med.frequency || '—'}</MedCol>
                <MedCol>{med.duration || '—'}</MedCol>
              </MedRow>
            ))}
          </MedTable>
        ) : (
          <p style={{ color: '#94A3B8', fontSize: 13 }}>No medicines recorded.</p>
        )}

        {/* Instructions */}
        {medicines.some((m) => m.instructions) && (
          <>
            <SectionHead style={{ marginTop: 12 }}>Instructions</SectionHead>
            {medicines.filter((m) => m.instructions).map((m, i) => (
              <DetailRow key={i}>
                <DetailLabel style={{ minWidth: 120 }}>{m.name}</DetailLabel>
                <DetailValue>{m.instructions}</DetailValue>
              </DetailRow>
            ))}
          </>
        )}

        {/* Notes */}
        {item.notes && (
          <>
            <Divider style={{ margin: '12px 0' }} />
            <SectionHead>Clinical Notes</SectionHead>
            <NotesBlock>{item.notes}</NotesBlock>
          </>
        )}
      </DetailWrap>
    </Modal>
  );
};

export default PrescriptionDetailModal;
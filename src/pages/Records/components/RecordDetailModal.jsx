import React from 'react';
import { Modal, Divider, Button, Tag } from 'antd';
import {
  UserOutlined, CalendarOutlined, MedicineBoxOutlined,
  HeartOutlined, ExperimentOutlined, FileTextOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import {
  DetailWrap, DetailRow, DetailLabel, DetailValue,
  SectionHead, DiagBlock, TreatBlock, NotesBlock,
  VitalGrid, VitalCard, VitalKey, VitalVal,
  RecordTypePill,
} from './RecordDetailModal.styled';

const RecordDetailModal = ({ item, onClose }) => {
  if (!item) return null;

  const vitals  = item.vital_signs  || {};
  const labs    = item.lab_results  || {};
  const hasVitals = Object.values(vitals).some(Boolean);
  const hasLabs   = Object.values(labs).some(Boolean);

  return (
    <Modal
      open={!!item}
      onCancel={onClose}
      title={
        <span>
          <MedicineBoxOutlined style={{ marginRight: 8 }} />
          Medical Record #{item.id}
        </span>
      }
      width={640}
      footer={[<Button key="close" onClick={onClose}>Close</Button>]}
      destroyOnHidden
    >
      <DetailWrap>
        {/* Type + Date */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 4 }}>
          <RecordTypePill>{item.record_type || 'consultation'}</RecordTypePill>
          <span style={{ fontSize: 12, color: '#94A3B8' }}>
            {item.created_at ? dayjs(item.created_at).format('DD MMM YYYY, HH:mm') : ''}
          </span>
        </div>

        <Divider style={{ margin: '10px 0' }} />

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

        {/* Chief Complaint */}
        {item.chief_complaint && (
          <>
            <Divider style={{ margin: '10px 0' }} />
            <SectionHead><FileTextOutlined style={{ marginRight: 6 }} />Chief Complaint</SectionHead>
            <DiagBlock>{item.chief_complaint}</DiagBlock>
          </>
        )}

        {/* Diagnosis */}
        {item.diagnosis && (
          <>
            <SectionHead style={{ marginTop: 12 }}>
              <MedicineBoxOutlined style={{ marginRight: 6 }} />Diagnosis
            </SectionHead>
            <DiagBlock>{item.diagnosis}</DiagBlock>
          </>
        )}

        {/* Treatment */}
        {item.treatment && (
          <>
            <SectionHead style={{ marginTop: 12 }}>
              <HeartOutlined style={{ marginRight: 6 }} />Treatment Plan
            </SectionHead>
            <TreatBlock>{item.treatment}</TreatBlock>
          </>
        )}

        {/* Vital Signs */}
        {hasVitals && (
          <>
            <Divider style={{ margin: '12px 0' }} />
            <SectionHead>
              <HeartOutlined style={{ marginRight: 6 }} />Vital Signs
            </SectionHead>
            <VitalGrid>
              {vitals.bp          && <VitalCard><VitalKey>Blood Pressure</VitalKey><VitalVal>{vitals.bp}</VitalVal></VitalCard>}
              {vitals.pulse       && <VitalCard><VitalKey>Pulse</VitalKey><VitalVal>{vitals.pulse} bpm</VitalVal></VitalCard>}
              {vitals.temperature && <VitalCard><VitalKey>Temperature</VitalKey><VitalVal>{vitals.temperature}</VitalVal></VitalCard>}
              {vitals.weight      && <VitalCard><VitalKey>Weight</VitalKey><VitalVal>{vitals.weight}</VitalVal></VitalCard>}
            </VitalGrid>
          </>
        )}

        {/* Lab Results */}
        {hasLabs && (
          <>
            <Divider style={{ margin: '12px 0' }} />
            <SectionHead>
              <ExperimentOutlined style={{ marginRight: 6 }} />Lab Results
            </SectionHead>
            <VitalGrid>
              {labs.blood_sugar && <VitalCard><VitalKey>Blood Sugar</VitalKey><VitalVal>{labs.blood_sugar}</VitalVal></VitalCard>}
              {labs.cholesterol && <VitalCard><VitalKey>Cholesterol</VitalKey><VitalVal>{labs.cholesterol}</VitalVal></VitalCard>}
            </VitalGrid>
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

export default RecordDetailModal;
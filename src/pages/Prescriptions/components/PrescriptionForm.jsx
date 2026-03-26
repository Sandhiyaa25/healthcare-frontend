import React, { useEffect, useState } from 'react';
import {
  Modal, Form, Input, Select, Alert, Button,
  Space, Divider,
} from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { fetchPatientsApi } from '../../../api/patients.api';
import axiosInstance from '../../../api/axiosInstance';
import { normalizeError } from '../../../utils/errorNormalizer';
import {
  FormSection, SectionTitle,
  MedicineCard, MedicineHeader, MedicineIndex,
  AddMedBtn, RemoveMedBtn, MedicineGrid,
} from './PrescriptionForm.styled';

const { TextArea } = Input;

const EMPTY_MEDICINE = {
  name: '', dosage: '', frequency: '', duration: '', instructions: '',
};

const FREQUENCY_OPTIONS = [
  'Once daily', 'Twice daily', 'Three times daily',
  'Four times daily', 'Every 8 hours', 'Every 6 hours',
  'Before meals', 'After meals', 'At bedtime', 'As needed',
];

const PrescriptionForm = ({
  open, onClose, onSubmit, saving, saveError, onClearError,
}) => {
  const [form]       = Form.useForm();
  const [patients,   setPatients]   = useState([]);
  const [appts,      setAppts]      = useState([]);
  const [medicines,  setMedicines]  = useState([{ ...EMPTY_MEDICINE }]);
  const [loadPat,    setLoadPat]    = useState(false);
  const [loadAppt,   setLoadAppt]   = useState(false);
  const [selPatient, setSelPatient] = useState(null);

  // Load patients
  useEffect(() => {
    if (!open) return;
    setLoadPat(true);
    // fetchPatientsApi({ per_page: 50 })
    //   .then((r) => setPatients(r.data?.data || []))
    fetchPatientsApi({ per_page: 50 })
  .then((r) => {
    const raw = r.data?.data;
    const list = Array.isArray(raw)
      ? raw
      : Array.isArray(raw?.patients)
      ? raw.patients
      : Array.isArray(raw?.data)
      ? raw.data
      : [];
    setPatients(list);
  })
      .catch(() => {})
      .finally(() => setLoadPat(false));
  }, [open]);

  // Load appointments when patient selected
  const onPatientChange = (patientId) => {
    setSelPatient(patientId);
    setAppts([]);
    form.setFieldValue('appointment_id', undefined);
    if (!patientId) return;
    setLoadAppt(true);
    // axiosInstance.get('/api/appointments', { params: { patient_id: patientId, per_page: 50 } })
    //   .then((r) => {
    //     const data = r.data?.data;
    //     const list = Array.isArray(data) ? data : (data?.appointments || data?.data || []);
    //     setAppts(list.filter((a) => a.status !== 'cancelled'));
    //   })

    axiosInstance.get('/api/appointments', { params: { patient_id: patientId, per_page: 50 } })
  .then((r) => {
    const raw = r.data?.data;
    let list = [];
    if (Array.isArray(raw)) list = raw;
    else if (Array.isArray(raw?.appointments)) list = raw.appointments;
    else if (Array.isArray(raw?.data)) list = raw.data;
    setAppts(list.filter((a) => a.status !== 'cancelled'));
  })
      .catch(() => {})
      .finally(() => setLoadAppt(false));
  };

  const addMedicine = () => {
    setMedicines((prev) => [...prev, { ...EMPTY_MEDICINE }]);
  };

  const removeMedicine = (idx) => {
    setMedicines((prev) => prev.filter((_, i) => i !== idx));
  };

  const updateMedicine = (idx, field, value) => {
    setMedicines((prev) =>
      prev.map((m, i) => i === idx ? { ...m, [field]: value } : m)
    );
  };

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      // Validate medicines
      const validMeds = medicines.filter((m) => m.name.trim() && m.dosage.trim());
      if (validMeds.length === 0) {
        return;
      }
      onSubmit({
        patient_id:     values.patient_id,
        appointment_id: values.appointment_id,
        diagnosis:      values.diagnosis,
        notes:          values.notes,
        medicines:      validMeds,
      });
    });
  };

  const handleClose = () => {
    form.resetFields();
    setMedicines([{ ...EMPTY_MEDICINE }]);
    setAppts([]);
    setSelPatient(null);
    onClose();
  };

  return (
    <Modal
      open={open}
      onCancel={handleClose}
      title="New Prescription"
      width={680}
      footer={[
        <Button key="cancel" onClick={handleClose} disabled={saving}>
          Cancel
        </Button>,
        <Button
          key="submit"
          type="primary"
          onClick={handleSubmit}
          loading={saving}
        >
          Create Prescription
        </Button>,
      ]}
      destroyOnHidden
    >
      {saveError && (
        <Alert
          type="error"
          message={saveError}
          closable
          onClose={onClearError}
          style={{ marginBottom: 16 }}
        />
      )}

      <Form form={form} layout="vertical" size="middle">
        <FormSection>
          <SectionTitle>Patient & Appointment</SectionTitle>
          <Form.Item
            name="patient_id"
            label="Patient"
            rules={[{ required: true, message: 'Select a patient' }]}
          >
            <Select
              showSearch
              placeholder="Search patient..."
              loading={loadPat}
              onChange={onPatientChange}
              filterOption={(input, opt) =>
                opt.children?.toLowerCase().includes(input.toLowerCase())
              }
            >
              {patients.map((p) => (
                <Select.Option key={p.id} value={p.id}>
                  {p.first_name
                    ? `${p.first_name} ${p.last_name || ''}`.trim()
                    : `Patient #${p.id}`}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="appointment_id"
            label="Appointment (required)"
            rules={[{ required: true, message: 'Select the appointment' }]}
          >
            <Select
              placeholder={selPatient ? 'Select appointment...' : 'Select patient first'}
              loading={loadAppt}
              disabled={!selPatient}
            >
              {appts.map((a) => (
                <Select.Option key={a.id} value={a.id}>
                  #{a.id} — {a.appointment_date} {a.start_time} ({a.status})
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </FormSection>

        <FormSection>
          <SectionTitle>Clinical Details</SectionTitle>
          <Form.Item
            name="diagnosis"
            label="Diagnosis"
          >
            <Input placeholder="e.g. Hypertension Stage 1" />
          </Form.Item>
          <Form.Item name="notes" label="Clinical Notes">
            <TextArea rows={2} placeholder="Additional notes for pharmacist..." />
          </Form.Item>
        </FormSection>

        <Divider />

        <FormSection>
          <SectionTitle>
            Medicines
            <AddMedBtn onClick={addMedicine} type="button">
              <PlusOutlined /> Add Medicine
            </AddMedBtn>
          </SectionTitle>

          {medicines.map((med, idx) => (
            <MedicineCard key={idx}>
              <MedicineHeader>
                <MedicineIndex>Medicine {idx + 1}</MedicineIndex>
                {medicines.length > 1 && (
                  <RemoveMedBtn
                    onClick={() => removeMedicine(idx)}
                    type="button"
                  >
                    <DeleteOutlined />
                  </RemoveMedBtn>
                )}
              </MedicineHeader>
              <MedicineGrid>
                <Form.Item label="Drug Name" required style={{ marginBottom: 8 }}>
                  <Input
                    value={med.name}
                    onChange={(e) => updateMedicine(idx, 'name', e.target.value)}
                    placeholder="e.g. Amlodipine"
                  />
                </Form.Item>
                <Form.Item label="Dosage" required style={{ marginBottom: 8 }}>
                  <Input
                    value={med.dosage}
                    onChange={(e) => updateMedicine(idx, 'dosage', e.target.value)}
                    placeholder="e.g. 5mg"
                  />
                </Form.Item>
                <Form.Item label="Frequency" style={{ marginBottom: 8 }}>
                  <Select
                    value={med.frequency || undefined}
                    onChange={(v) => updateMedicine(idx, 'frequency', v)}
                    placeholder="Select frequency"
                  >
                    {FREQUENCY_OPTIONS.map((f) => (
                      <Select.Option key={f} value={f}>{f}</Select.Option>
                    ))}
                  </Select>
                </Form.Item>
                <Form.Item label="Duration" style={{ marginBottom: 8 }}>
                  <Input
                    value={med.duration}
                    onChange={(e) => updateMedicine(idx, 'duration', e.target.value)}
                    placeholder="e.g. 30 days"
                  />
                </Form.Item>
              </MedicineGrid>
              <Form.Item label="Instructions" style={{ marginBottom: 0 }}>
                <Input
                  value={med.instructions}
                  onChange={(e) => updateMedicine(idx, 'instructions', e.target.value)}
                  placeholder="e.g. Take after food"
                />
              </Form.Item>
            </MedicineCard>
          ))}
        </FormSection>
      </Form>
    </Modal>
  );
};

export default PrescriptionForm;
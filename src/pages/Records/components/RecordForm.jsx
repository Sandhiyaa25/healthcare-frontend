import React, { useEffect } from 'react';
import { Modal, Form, Input, Select, Alert, Button } from 'antd';
import { FormSection, SectionTitle, VitalGrid, VitalItem } from './RecordForm.styled';

const { TextArea } = Input;

const RecordForm = ({
  open, onClose, onSubmit, saving, saveError, onClearError,
  patients = [], initialData, recordTypes, isEdit,
}) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (!open) return;
    if (initialData) {
      form.setFieldsValue({
        patient_id:      initialData.patient_id,
        record_type:     initialData.record_type     || 'consultation',
        chief_complaint: initialData.chief_complaint || '',
        diagnosis:       initialData.diagnosis       || '',
        treatment:       initialData.treatment       || '',
        notes:           initialData.notes           || '',
        bp:          initialData.vital_signs?.bp,
        pulse:       initialData.vital_signs?.pulse,
        temperature: initialData.vital_signs?.temperature,
        weight:      initialData.vital_signs?.weight,
        blood_sugar: initialData.lab_results?.blood_sugar,
        cholesterol: initialData.lab_results?.cholesterol,
      });
    } else {
      form.resetFields();
    }
  }, [open, initialData, form]);

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      onSubmit({
        patient_id:      values.patient_id,
        record_type:     values.record_type || 'consultation',
        chief_complaint: values.chief_complaint,
        diagnosis:       values.diagnosis,
        treatment:       values.treatment,
        notes:           values.notes,
        vital_signs: {
          bp:          values.bp          || null,
          pulse:       values.pulse       || null,
          temperature: values.temperature || null,
          weight:      values.weight      || null,
        },
        lab_results: {
          blood_sugar: values.blood_sugar || null,
          cholesterol: values.cholesterol || null,
        },
      });
    });
  };

  return (
    <Modal
      open={open}
      onCancel={() => { form.resetFields(); onClose(); }}
      title={isEdit ? 'Update Medical Record' : 'New Medical Record'}
      width={660}
      footer={[
        <Button key="cancel" onClick={() => { form.resetFields(); onClose(); }} disabled={saving}>
          Cancel
        </Button>,
        <Button key="submit" type="primary" onClick={handleSubmit} loading={saving}>
          {isEdit ? 'Update Record' : 'Create Record'}
        </Button>,
      ]}
      destroyOnHidden
    >
      {saveError && (
        <Alert type="error" message={saveError} closable onClose={onClearError}
          style={{ marginBottom: 16 }} />
      )}

      <Form form={form} layout="vertical" size="middle">
        {/* Patient selector — only shown on create */}
        {!isEdit && (
          <FormSection>
            <Form.Item
              name="patient_id"
              label="Patient"
              rules={[{ required: true, message: 'Please select a patient' }]}
            >
              <Select
                showSearch
                placeholder="Search and select patient..."
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
          </FormSection>
        )}

        <FormSection>
          <SectionTitle>Record Details</SectionTitle>
          <Form.Item name="record_type" label="Record Type" initialValue="consultation">
            <Select placeholder="Select type">
              {recordTypes.map((t) => (
                <Select.Option key={t} value={t}>
                  {t.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="chief_complaint" label="Chief Complaint"
            rules={[{ required: !isEdit, message: 'Required' }]}>
            <TextArea rows={2} placeholder="Patient's main complaint..." />
          </Form.Item>
          <Form.Item name="diagnosis" label="Diagnosis">
            <TextArea rows={2} placeholder="Clinical diagnosis..." />
          </Form.Item>
          <Form.Item name="treatment" label="Treatment Plan">
            <TextArea rows={2} placeholder="Prescribed treatment..." />
          </Form.Item>
        </FormSection>

        <FormSection>
          <SectionTitle>Vital Signs</SectionTitle>
          <VitalGrid>
            <VitalItem>
              <Form.Item name="bp" label="Blood Pressure" style={{ marginBottom: 0 }}>
                <Input placeholder="e.g. 120/80" />
              </Form.Item>
            </VitalItem>
            <VitalItem>
              <Form.Item name="pulse" label="Pulse (bpm)" style={{ marginBottom: 0 }}>
                <Input placeholder="e.g. 72" />
              </Form.Item>
            </VitalItem>
            <VitalItem>
              <Form.Item name="temperature" label="Temperature" style={{ marginBottom: 0 }}>
                <Input placeholder="e.g. 98.6°F" />
              </Form.Item>
            </VitalItem>
            <VitalItem>
              <Form.Item name="weight" label="Weight" style={{ marginBottom: 0 }}>
                <Input placeholder="e.g. 72kg" />
              </Form.Item>
            </VitalItem>
          </VitalGrid>
        </FormSection>

        <FormSection>
          <SectionTitle>Lab Results</SectionTitle>
          <VitalGrid>
            <VitalItem>
              <Form.Item name="blood_sugar" label="Blood Sugar" style={{ marginBottom: 0 }}>
                <Input placeholder="e.g. 126 mg/dL" />
              </Form.Item>
            </VitalItem>
            <VitalItem>
              <Form.Item name="cholesterol" label="Cholesterol" style={{ marginBottom: 0 }}>
                <Input placeholder="e.g. 210 mg/dL" />
              </Form.Item>
            </VitalItem>
          </VitalGrid>
        </FormSection>

        <FormSection>
          <SectionTitle>Notes</SectionTitle>
          <Form.Item name="notes" label="Clinical Notes" style={{ marginBottom: 0 }}>
            <TextArea rows={3} placeholder="Additional clinical notes..." />
          </Form.Item>
        </FormSection>
      </Form>
    </Modal>
  );
};

export default RecordForm;
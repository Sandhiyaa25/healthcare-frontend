import React, { useEffect, useRef } from 'react';
import { Modal, Form, Input, Select, DatePicker, Row, Col, Alert } from 'antd';
import dayjs from 'dayjs';
import usePatients from '../../../hooks/usePatient';
import { FormSection, SectionTitle } from './PatientForm.styled';

const { Option } = Select;
const { TextArea } = Input;

const PatientForm = ({ open, onClose, onSuccess, initialData }) => {
  const [form] = Form.useForm();
  const { saving, error, createPatient, updatePatient, clearError } = usePatients();
  const isEdit = !!initialData;
  const wasSavingRef = useRef(false);

  // ─── Pre-fill form on edit, reset on create ──────────────────────────────
  useEffect(() => {
    if (!open) return;
    if (initialData) {
      form.setFieldsValue({
        ...initialData,
        date_of_birth: initialData.date_of_birth
          ? dayjs(initialData.date_of_birth)
          : null,
      });
    } else {
      form.resetFields();
    }
  }, [open, initialData, form]);

  // ─── Detect save completion and close modal ───────────────────────────────
  // FIX: The old code had 3 separate if blocks that all ran in the same render.
  // When saving goes true → false, the last block `if (!saving)` always reset
  // wasSavingRef BEFORE the success check could fire. Fixed with early returns.
  useEffect(() => {
    if (saving) {
      wasSavingRef.current = true;
      return; // ← early return: don't check success while still saving
    }

    // saving is now false — check if we WERE saving (i.e. just finished)
    if (wasSavingRef.current) {
      wasSavingRef.current = false; // reset AFTER the check below
      if (!error) {
        onSuccess(); // ← only fires once, only when no error
      }
    }
  }, [saving, error, onSuccess]);

  // ─── Reset wasSavingRef when modal closes ────────────────────────────────
  useEffect(() => {
    if (!open) {
      wasSavingRef.current = false;
    }
  }, [open]);

  // ─── Submit ──────────────────────────────────────────────────────────────
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const data = {
        ...values,
        date_of_birth: values.date_of_birth
          ? values.date_of_birth.format('YYYY-MM-DD')
          : undefined,
      };
      if (isEdit) {
        updatePatient(initialData.id, data);
      } else {
        createPatient(data);
      }
    } catch (_) {
      // Ant Design validation failed — errors shown inline, no action needed
    }
  };

  return (
    <Modal
      title={isEdit ? 'Edit Patient' : 'Add New Patient'}
      open={open}
      onCancel={onClose}
      onOk={handleSubmit}
      okText={isEdit ? 'Save Changes' : 'Create Patient'}
      okButtonProps={{ loading: saving }}
      cancelButtonProps={{ disabled: saving }}
      width={720}
      destroyOnClose
      maskClosable={false}
    >
      {error && (
        <Alert
          message={error}
          type="error"
          showIcon
          style={{ marginBottom: 16 }}
          closable
          onClose={clearError}
        />
      )}

      <Form form={form} layout="vertical" initialValues={{ status: 'active' }}>
        <FormSection>
          <SectionTitle>Personal Information</SectionTitle>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="first_name"
                label="First Name"
                rules={[{ required: true, message: 'First name is required' }]}
              >
                <Input maxLength={100} placeholder="First name" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="last_name"
                label="Last Name"
                rules={[{ required: true, message: 'Last name is required' }]}
              >
                <Input maxLength={100} placeholder="Last name" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="date_of_birth"
                label="Date of Birth"
                rules={[{ required: true, message: 'Date of birth is required' }]}
              >
                <DatePicker
                  format="DD/MM/YYYY"
                  disabledDate={(d) => d && d > dayjs()}
                  style={{ width: '100%' }}
                  placeholder="DD/MM/YYYY"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="gender"
                label="Gender"
                rules={[{ required: true, message: 'Gender is required' }]}
              >
                <Select placeholder="Select gender">
                  <Option value="male">Male</Option>
                  <Option value="female">Female</Option>
                  <Option value="other">Other</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
        </FormSection>

        <FormSection>
          <SectionTitle>Contact Information</SectionTitle>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="email" label="Email">
                <Input type="email" placeholder="email@example.com" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="phone" label="Phone">
                <Input placeholder="+91 9876543210" />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name="address" label="Address">
            <TextArea rows={2} placeholder="Full address" />
          </Form.Item>
        </FormSection>

        <FormSection>
          <SectionTitle>Medical Information</SectionTitle>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="blood_group" label="Blood Group">
                <Select placeholder="Select blood group" allowClear>
                  {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map((bg) => (
                    <Option key={bg} value={bg}>{bg}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="status" label="Status">
                <Select>
                  <Option value="active">Active</Option>
                  <Option value="inactive">Inactive</Option>
                  <Option value="deceased">Deceased</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name="allergies" label="Allergies">
            <TextArea rows={2} placeholder="Known allergies" />
          </Form.Item>
          <Form.Item name="medical_notes" label="Medical Notes">
            <TextArea rows={2} placeholder="Medical notes" />
          </Form.Item>
        </FormSection>

        <FormSection>
          <SectionTitle>Emergency Contact</SectionTitle>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="emergency_contact_name" label="Contact Name">
                <Input placeholder="Emergency contact name" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="emergency_contact_phone" label="Contact Phone">
                <Input placeholder="+91 9876543210" />
              </Form.Item>
            </Col>
          </Row>
        </FormSection>
      </Form>
    </Modal>
  );
};

export default PatientForm;
import React, { useEffect, useRef, useState } from 'react';
import { Modal, Form, Input, Select, DatePicker, TimePicker, Row, Col, Alert, Spin } from 'antd';
import dayjs from 'dayjs';
import useAppointments from '../../../hooks/useAppointments';
import useAuth from '../../../hooks/useAuth';
import { fetchPatientsApi } from '../../../api/patients.api';
import { fetchStaffApi } from '../../../api/staff.api'; // ← FIX 1: use fetchStaffApi not fetchUsersApi
import ConflictAlert from './ConflictAlert';
import { FormSection, SectionTitle, ReadOnlyField } from './AppointmentForm.styled';

const { Option } = Select;
const { TextArea } = Input;

const TYPE_OPTIONS = ['consultation', 'follow_up', 'emergency', 'routine'];
const capitalize = (s) => s ? s.charAt(0).toUpperCase() + s.slice(1).replace('_', ' ') : s;

const AppointmentForm = ({ open, onClose, onSuccess, initialData }) => {
  const [form] = Form.useForm();
  const { saving, error, conflict, createAppointment, updateAppointment, clearConflict, clearError } =
    useAppointments();
  const { role, user } = useAuth();
  const wasSavingRef = useRef(false);
  const isEdit = !!initialData;

  const [doctors,        setDoctors]        = useState([]);
  const [patients,       setPatients]       = useState([]);
  const [loadingDoctors, setLoadingDoctors] = useState(false);
  const [loadingPatients,setLoadingPatients]= useState(false);

  // ── Load doctors on open ─────────────────────────────────────────────────
  // FIX 1: Use fetchStaffApi (/api/staff) — accessible by all roles
  // FIX 2: Staff response is res.data?.data = [] array directly
  //        Filter by role_slug === 'doctor' from staff records
  useEffect(() => {
    if (!open) return;
    setLoadingDoctors(true);

    const load = () =>
      fetchStaffApi({ per_page: 100 })
        .then((res) => {
          const raw = res.data?.data;
          const all = Array.isArray(raw)
            ? raw
            : Array.isArray(raw?.staff) ? raw.staff : [];

          const doctors = all.filter((s) => {
            const isDoctor =
              s.role_slug === 'doctor' ||
              s.role_name?.toLowerCase() === 'doctor' ||
              s.role_name?.toLowerCase()?.includes('doctor');
            const isActive = !s.status || s.status === 'active';
            return isDoctor && isActive;
          });
          setDoctors(doctors);
        });

    load()
      .catch(() => {
        // Staff API failed (401 token expired) — retry once after short delay
        // to allow axiosInstance refresh interceptor to complete
        setTimeout(() => {
          load().catch(() => setDoctors([]));
        }, 1500);
      })
      .finally(() => setLoadingDoctors(false));
  }, [open]);

  // ── Load patients on open ────────────────────────────────────────────────
  // FIX 3: Handle both response shapes from backend
  // Shape A (after pagination fix): { patients: [...], pagination: {...} }
  // Shape B (before fix):           [...] direct array
  useEffect(() => {
    if (!open) return;
    if (role === 'patient') return; // patient role: backend auto-injects patient_id
    setLoadingPatients(true);
    fetchPatientsApi({ per_page: 100 })
      .then((res) => {
        // res.data = { status: true, data: { patients: [...], pagination: {...} } }
        //         OR { status: true, data: [...] }
        const data = res.data?.data;
        const list =
          data?.patients              // shape A: { patients: [...] }
          ?? (Array.isArray(data) ? data : []) // shape B: direct array
          ?? [];
        setPatients(list);
      })
      .catch(() => setPatients([]))
      .finally(() => setLoadingPatients(false));
  }, [open, role]);

  // ── Pre-fill form on edit, reset on create ───────────────────────────────
  useEffect(() => {
    if (!open) return;
    if (initialData) {
      form.setFieldsValue({
        patient_id:       initialData.patient_id,
        doctor_id:        initialData.doctor_id,
        appointment_date: initialData.appointment_date ? dayjs(initialData.appointment_date) : null,
        start_time:       initialData.start_time ? dayjs(initialData.start_time, 'HH:mm:ss') : null,
        end_time:         initialData.end_time   ? dayjs(initialData.end_time,   'HH:mm:ss') : null,
        type:             initialData.type || 'consultation',
        notes:            initialData.notes || '',
      });
    } else {
      form.resetFields();
      clearConflict();
    }
  }, [open, initialData, form]);

  // ── Detect save completion ───────────────────────────────────────────────
  useEffect(() => {
    if (saving) {
      wasSavingRef.current = true;
      return;
    }
    if (wasSavingRef.current) {
      wasSavingRef.current = false;
      if (!error) {
        setTimeout(() => onSuccess(), 100);
      }
    }
  }, [saving, error, onSuccess]);

  // ── Reset on close ───────────────────────────────────────────────────────
  useEffect(() => {
    if (!open) {
      wasSavingRef.current = false;
      clearConflict();
    }
  }, [open]);

  // ── Submit ───────────────────────────────────────────────────────────────
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const data = {
        patient_id:       values.patient_id,
        doctor_id:        role === 'doctor' ? user.id : values.doctor_id,
        appointment_date: values.appointment_date.format('YYYY-MM-DD'),
        start_time:       values.start_time.format('HH:mm'),
        end_time:         values.end_time.format('HH:mm'),
        type:             values.type || 'consultation',
        notes:            values.notes || undefined,
      };
      if (isEdit) {
        updateAppointment(initialData.id, data);
      } else {
        createAppointment(data);
      }
    } catch (_) {
      // Ant Design validation failed — errors shown inline
    }
  };

  // ── Auto-set end_time +30 min when start_time changes ────────────────────
  const handleStartTimeChange = (time) => {
    clearConflict();
    if (time) {
      form.setFieldValue('end_time', time.add(30, 'minute'));
    }
  };

  // ── Build doctor label — staff API returns different shape than users API ─
  const getDoctorLabel = (d) => {
    const isEncrypted = (val) =>
      typeof val === 'string' &&
      val.length > 40 &&
      /^[A-Za-z0-9+/=\s]+$/.test(val) &&
      val.includes('=');

    const rawFirst = d.first_name ?? d.user?.first_name ?? '';
    const rawLast  = d.last_name  ?? d.user?.last_name  ?? '';
    const first    = isEncrypted(rawFirst) ? '' : rawFirst;
    const last     = isEncrypted(rawLast)  ? '' : rawLast;
    const name     = `${first} ${last}`.trim();
    return name || d.username || `Doctor #${d.user_id || d.id}`;
  };

  // ── Doctor ID from staff record ───────────────────────────────────────────
  // Staff records have user_id (the actual user id used in appointments)
  const getDoctorValue = (d) => d.user_id ?? d.id;

  return (
    <Modal
      title={isEdit ? 'Reschedule Appointment' : 'Book New Appointment'}
      open={open}
      onCancel={onClose}
      onOk={handleSubmit}
      okText={isEdit ? 'Save Changes' : 'Book Appointment'}
      okButtonProps={{ loading: saving }}
      cancelButtonProps={{ disabled: saving }}
      width={640}
      destroyOnHidden
      mask={{ closable: false }}
    >
      <ConflictAlert conflict={conflict} />

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

      <Form form={form} layout="vertical" initialValues={{ type: 'consultation' }}>
        <FormSection>
          <SectionTitle>Appointment Details</SectionTitle>

          {/* Patient selector */}
          {role === 'patient' ? (
            <Form.Item label="Patient">
              <ReadOnlyField>Your appointment</ReadOnlyField>
            </Form.Item>
          ) : (
            <Form.Item
              name="patient_id"
              label="Patient"
              rules={[{ required: true, message: 'Please select a patient' }]}
            >
              <Select
                showSearch
                placeholder="Search and select patient"
                loading={loadingPatients}
                notFoundContent={loadingPatients ? <Spin size="small" /> : 'No patients found'}
                filterOption={(input, option) =>
                  option?.label?.toLowerCase().includes(input.toLowerCase())
                }
                options={patients.map((p) => {
                  const isEncrypted = (val) =>
                    typeof val === 'string' &&
                    val.length > 40 &&
                    /^[A-Za-z0-9+/=\s]+$/.test(val) &&
                    val.includes('=');

                  const first = isEncrypted(p.first_name) ? '' : (p.first_name || '');
                  const last  = isEncrypted(p.last_name)  ? '' : (p.last_name  || '');
                  const name  = `${first} ${last}`.trim();
                  return {
                    value: p.id,
                    label: name || `Patient #${p.id}`,
                  };
                })}
              />
            </Form.Item>
          )}

          {/* Doctor selector */}
          {role === 'doctor' ? (
            <Form.Item label="Doctor">
              <ReadOnlyField>Your appointment</ReadOnlyField>
            </Form.Item>
          ) : (
            <Form.Item
              name="doctor_id"
              label="Doctor"
              rules={[{ required: true, message: 'Please select a doctor' }]}
            >
              <Select
                showSearch
                placeholder="Search and select doctor"
                loading={loadingDoctors}
                notFoundContent={loadingDoctors ? <Spin size="small" /> : 'No doctors found — add a staff member with Doctor role'}
                filterOption={(input, option) =>
                  option?.label?.toLowerCase().includes(input.toLowerCase())
                }
                options={doctors.map((d) => ({
                  value: getDoctorValue(d),
                  label: getDoctorLabel(d),
                }))}
              />
            </Form.Item>
          )}

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="appointment_date"
                label="Date"
                rules={[{ required: true, message: 'Please select a date' }]}
              >
                <DatePicker
                  format="DD/MM/YYYY"
                  disabledDate={(d) => d && d < dayjs().startOf('day')}
                  style={{ width: '100%' }}
                  placeholder="Select date"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="type"
                label="Type"
                rules={[{ required: true, message: 'Please select type' }]}
              >
                <Select placeholder="Select type">
                  {TYPE_OPTIONS.map((t) => (
                    <Option key={t} value={t}>{capitalize(t)}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="start_time"
                label="Start Time"
                rules={[{ required: true, message: 'Please select start time' }]}
              >
                <TimePicker
                  format="HH:mm"
                  minuteStep={15}
                  use12Hours={false}
                  style={{ width: '100%' }}
                  placeholder="Start time"
                  onChange={handleStartTimeChange}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="end_time"
                label="End Time"
                dependencies={['start_time']}
                rules={[
                  { required: true, message: 'Please select end time' },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      const start = getFieldValue('start_time');
                      if (!value || !start) return Promise.resolve();
                      if (value.isAfter(start)) return Promise.resolve();
                      return Promise.reject(new Error('End time must be after start time'));
                    },
                  }),
                ]}
              >
                <TimePicker
                  format="HH:mm"
                  minuteStep={15}
                  use12Hours={false}
                  style={{ width: '100%' }}
                  placeholder="End time"
                  onChange={() => clearConflict()}
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item name="notes" label="Notes">
            <TextArea rows={3} placeholder="Reason for visit or additional notes" />
          </Form.Item>
        </FormSection>
      </Form>
    </Modal>
  );
};

export default AppointmentForm;
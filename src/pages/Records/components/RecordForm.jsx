import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, Select, DatePicker } from 'antd';
import dayjs from 'dayjs';
import { getDummyPatients } from '../../../api/patients.api';

const { Option } = Select;
const { TextArea } = Input;

const RecordForm = ({ open, onClose, onSuccess, saving }) => {
    const [form] = Form.useForm();
    const [patients, setPatients] = useState([]);

    useEffect(() => {
        if (open) {
            form.resetFields();
            setPatients(getDummyPatients());
        }
    }, [open, form]);

    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();
            const patient = patients.find((p) => p.id === values.patient_id);
            const newRecord = {
                id: Date.now(),
                patient_id: values.patient_id,
                patient_name: patient ? `${patient.first_name} ${patient.last_name}` : 'Unknown',
                diagnosis: values.diagnosis,
                doctor_name: values.doctor_name,
                date_recorded: values.date_recorded.format('YYYY-MM-DD'),
                status: values.status || 'pending',
            };
            onSuccess(newRecord);
        } catch (_) {
            // Ant Design validation — errors shown inline
        }
    };

    return (
        <Modal
            title="Upload Medical Record"
            open={open}
            onCancel={onClose}
            onOk={handleSubmit}
            okText="Upload Record"
            okButtonProps={{ loading: saving }}
            cancelButtonProps={{ disabled: saving }}
            width={560}
            destroyOnClose
            maskClosable={false}
        >
            <Form form={form} layout="vertical" initialValues={{ status: 'pending', date_recorded: dayjs() }}>
                <Form.Item
                    name="patient_id"
                    label="Patient"
                    rules={[{ required: true, message: 'Please select a patient' }]}
                >
                    <Select showSearch placeholder="Search and select patient"
                        filterOption={(input, option) =>
                            option?.children?.toLowerCase().includes(input.toLowerCase())
                        }
                    >
                        {patients.map((p) => (
                            <Option key={p.id} value={p.id}>
                                {`${p.first_name} ${p.last_name}`}
                            </Option>
                        ))}
                    </Select>
                </Form.Item>

                <Form.Item
                    name="diagnosis"
                    label="Diagnosis"
                    rules={[{ required: true, message: 'Please enter diagnosis' }]}
                >
                    <Input placeholder="e.g. Type 2 Diabetes" />
                </Form.Item>

                <Form.Item
                    name="doctor_name"
                    label="Provider (Doctor)"
                    rules={[{ required: true, message: 'Please enter doctor name' }]}
                >
                    <Input placeholder="e.g. Dr. Anita Desai" />
                </Form.Item>

                <Form.Item
                    name="date_recorded"
                    label="Date Recorded"
                    rules={[{ required: true, message: 'Select date' }]}
                >
                    <DatePicker format="DD/MM/YYYY" style={{ width: '100%' }} />
                </Form.Item>

                <Form.Item name="status" label="Verification Status">
                    <Select>
                        <Option value="pending">Pending</Option>
                        <Option value="verified">Verified</Option>
                        <Option value="incomplete">Incomplete</Option>
                        <Option value="archived">Archived</Option>
                    </Select>
                </Form.Item>

                <Form.Item name="notes" label="Additional Notes">
                    <TextArea rows={2} placeholder="Clinical notes, observations, etc." />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default RecordForm;

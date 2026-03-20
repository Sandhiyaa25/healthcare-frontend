import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, Select, DatePicker } from 'antd';
import dayjs from 'dayjs';
import { getDummyPatients } from '../../../api/patients.api';

const { Option } = Select;
const { TextArea } = Input;

const PrescriptionForm = ({ open, onClose, onSuccess, saving }) => {
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
            const newPrescription = {
                id: Date.now(),
                patient_id: values.patient_id,
                patient_name: patient ? `${patient.first_name} ${patient.last_name}` : 'Unknown',
                medication_name: values.medication_name,
                dosage: values.dosage,
                frequency: values.frequency,
                date_issued: values.date_issued.format('YYYY-MM-DD'),
                status: values.status || 'active',
            };
            onSuccess(newPrescription);
        } catch (_) {
            // Ant Design validation — errors shown inline
        }
    };

    return (
        <Modal
            title="Add New Prescription"
            open={open}
            onCancel={onClose}
            onOk={handleSubmit}
            okText="Add Prescription"
            okButtonProps={{ loading: saving }}
            cancelButtonProps={{ disabled: saving }}
            width={560}
            destroyOnClose
            maskClosable={false}
        >
            <Form form={form} layout="vertical" initialValues={{ status: 'active', date_issued: dayjs() }}>
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
                    name="medication_name"
                    label="Medication"
                    rules={[{ required: true, message: 'Please enter medication name' }]}
                >
                    <Input placeholder="e.g. Amoxicillin 500mg" />
                </Form.Item>

                <Form.Item name="dosage" label="Dosage" rules={[{ required: true, message: 'Please enter dosage' }]}>
                    <Input placeholder="e.g. 500mg" />
                </Form.Item>

                <Form.Item name="frequency" label="Frequency" rules={[{ required: true, message: 'Please select frequency' }]}>
                    <Select placeholder="Select frequency">
                        <Option value="Once daily">Once daily</Option>
                        <Option value="Twice daily">Twice daily</Option>
                        <Option value="Three times">Three times daily</Option>
                        <Option value="Before meals">Before meals</Option>
                        <Option value="After meals">After meals</Option>
                        <Option value="As needed">As needed</Option>
                    </Select>
                </Form.Item>

                <Form.Item name="date_issued" label="Date Issued" rules={[{ required: true, message: 'Select date' }]}>
                    <DatePicker format="DD/MM/YYYY" style={{ width: '100%' }} />
                </Form.Item>

                <Form.Item name="status" label="Status">
                    <Select>
                        <Option value="active">Active</Option>
                        <Option value="completed">Completed</Option>
                        <Option value="expired">Expired</Option>
                    </Select>
                </Form.Item>

                <Form.Item name="notes" label="Notes">
                    <TextArea rows={2} placeholder="Additional notes..." />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default PrescriptionForm;

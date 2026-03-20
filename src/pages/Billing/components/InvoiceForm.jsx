import React, { useState, useEffect, useRef } from 'react';
import axiosInstance from '../../../api/axiosInstance';
import useBilling from '../../../hooks/useBilling';
import { formatDate } from '../../../utils/dateUtils';
import {
  Overlay, Modal, MHead, MTitle, CloseBtn,
  FGrid, Field, Label, Input, Select,
  BtnRow, CancelBtn, SaveBtn, ErrMsg, Textarea, TotalPreview,
} from './InvoiceForm.styled';

const InvoiceForm = ({ onClose, onSuccess }) => {
  const { saving, error, createInvoice } = useBilling();

  const [form, setForm] = useState({
    appointment_id: '',
    amount:         '',
    tax:            '0',
    discount:       '0',
    due_date:       '',
    notes:          '',
  });
  const [appointments, setAppointments] = useState([]);
  const [apptLoading, setApptLoading]   = useState(true);
  const [formErr, setFormErr]           = useState('');

  const submittedRef = useRef(false);

  useEffect(() => {
    axiosInstance
      .get('/api/appointments', { params: { per_page: 100 } })
      .then((res) => {
        const d = res.data?.data?.appointments || res.data?.data || [];
        setAppointments(Array.isArray(d) ? d : []);
      })
      .catch(() => {})
      .finally(() => setApptLoading(false));
  }, []);

  useEffect(() => {
    if (submittedRef.current && !saving) {
      if (!error) {
        onSuccess();
      } else {
        submittedRef.current = false;
      }
    }
  }, [saving]); // eslint-disable-line react-hooks/exhaustive-deps

  const calculateTotal = () =>
    parseFloat(form.amount || 0) + parseFloat(form.tax || 0) - parseFloat(form.discount || 0);

  const f = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));

  const handleSubmit = () => {
    if (!form.appointment_id) {
      setFormErr('Please select an appointment.');
      return;
    }
    if (!form.amount || parseFloat(form.amount) <= 0) {
      setFormErr('Amount must be greater than zero.');
      return;
    }
    setFormErr('');
    submittedRef.current = true;
    createInvoice({
      appointment_id: parseInt(form.appointment_id, 10),
      amount:         parseFloat(form.amount),
      tax:            parseFloat(form.tax || 0),
      discount:       parseFloat(form.discount || 0),
      due_date:       form.due_date  || undefined,
      notes:          form.notes     || undefined,
    });
  };

  return (
    <Overlay onClick={(e) => e.target === e.currentTarget && onClose()}>
      <Modal style={{ maxWidth: '520px' }}>
        <MHead>
          <MTitle>New Invoice</MTitle>
          <CloseBtn onClick={onClose}>×</CloseBtn>
        </MHead>

        {(formErr || error) && (
          <ErrMsg style={{ marginBottom: 14 }}>{formErr || error}</ErrMsg>
        )}

        <Field style={{ marginBottom: 14 }}>
          <Label>Appointment *</Label>
          <Select value={form.appointment_id} onChange={f('appointment_id')}>
            <option value="">{apptLoading ? 'Loading...' : '-- Select appointment --'}</option>
            {appointments.map((a) => (
              <option key={a.id} value={a.id}>
                #{a.id} — {a.patient_name || 'Patient'} — {formatDate(a.appointment_date)}
              </option>
            ))}
          </Select>
        </Field>

        <FGrid>
          <Field>
            <Label>Amount (₹) *</Label>
            <Input
              type="number" min="0" step="0.01" placeholder="0.00"
              value={form.amount} onChange={f('amount')}
            />
          </Field>
          <Field>
            <Label>Tax (₹)</Label>
            <Input
              type="number" min="0" step="0.01"
              value={form.tax} onChange={f('tax')}
            />
          </Field>
          <Field>
            <Label>Discount (₹)</Label>
            <Input
              type="number" min="0" step="0.01"
              value={form.discount} onChange={f('discount')}
            />
          </Field>
          <Field>
            <Label>Due Date</Label>
            <Input type="date" value={form.due_date} onChange={f('due_date')} />
          </Field>
        </FGrid>

        <Field style={{ marginTop: 14 }}>
          <Label>Notes</Label>
          <Textarea
            rows={3} placeholder="Optional notes..."
            value={form.notes} onChange={f('notes')}
          />
        </Field>

        <TotalPreview>
          Total: ₹{calculateTotal().toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </TotalPreview>

        <BtnRow>
          <CancelBtn onClick={onClose}>Cancel</CancelBtn>
          <SaveBtn onClick={handleSubmit} disabled={saving}>
            {saving ? 'Creating...' : 'Create Invoice'}
          </SaveBtn>
        </BtnRow>
      </Modal>
    </Overlay>
  );
};

export default InvoiceForm;

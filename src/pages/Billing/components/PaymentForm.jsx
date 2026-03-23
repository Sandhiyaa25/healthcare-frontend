import React, { useState, useEffect, useRef } from 'react';
import useBilling from '../../../hooks/useBilling';
import {
  Overlay, Modal, MHead, MTitle, CloseBtn,
  FGrid, Field, Label, Input, Select,
  BtnRow, CancelBtn, SaveBtn, ErrMsg, Textarea,
  InvoiceSummaryBox, SummaryRow,
} from './PaymentForm.styled';

const PaymentForm = ({ invoice, onClose, onSuccess }) => {
  const { paying, error, recordPayment } = useBilling();

  const [form, setForm] = useState({
    amount:           '',
    payment_method:   'cash',
    reference_number: '',
    notes:            '',
  });
  const [formErr, setFormErr] = useState('');

  const submittedRef = useRef(false);

  const totalPaid = invoice.payments?.reduce((s, p) => s + parseFloat(p.amount || 0), 0) || 0;
  const remaining = parseFloat(invoice.total_amount || 0) - totalPaid;

  useEffect(() => {
    if (submittedRef.current && !paying) {
      if (!error) {
        onSuccess();
      } else {
        submittedRef.current = false;
      }
    }
  }, [paying]); // eslint-disable-line react-hooks/exhaustive-deps

  const f = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));

  const handleSubmit = () => {
    const amt = parseFloat(form.amount);
    if (!form.amount || amt <= 0) {
      setFormErr('Please enter a valid amount.');
      return;
    }
    if (amt > remaining + 0.001) {
      setFormErr(
        `Amount exceeds remaining balance of ₹${remaining.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`
      );
      return;
    }
    setFormErr('');
    submittedRef.current = true;
    recordPayment(invoice.id, {
      amount:           amt,
      payment_method:   form.payment_method,
      reference_number: form.reference_number || undefined,
      notes:            form.notes            || undefined,
    });
  };

  return (
    <Overlay onClick={(e) => e.target === e.currentTarget && onClose()}>
      <Modal>
        <MHead>
          <MTitle>Record Payment</MTitle>
          <CloseBtn onClick={onClose}>×</CloseBtn>
        </MHead>

        <InvoiceSummaryBox>
          <SummaryRow>
            <span>Invoice #{invoice.id}</span>
            <span style={{ fontWeight: 600 }}>{invoice.patient_name}</span>
          </SummaryRow>
          <SummaryRow>
            <span>Invoice Total</span>
            <span>₹{parseFloat(invoice.total_amount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
          </SummaryRow>
          <SummaryRow>
            <span>Already Paid</span>
            <span>₹{totalPaid.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
          </SummaryRow>
          <SummaryRow $bold>
            <span>Remaining Balance</span>
            <span>₹{remaining.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
          </SummaryRow>
        </InvoiceSummaryBox>

        {(formErr || error) && (
          <ErrMsg style={{ marginBottom: 14 }}>{formErr || error}</ErrMsg>
        )}

        <FGrid>
          <Field>
            <Label>Payment Amount (₹) *</Label>
            <Input
              type="number" min="0.01" step="0.01" placeholder="0.00"
              value={form.amount} onChange={f('amount')}
            />
          </Field>
          <Field>
            <Label>Payment Method *</Label>
            <Select value={form.payment_method} onChange={f('payment_method')}>
              <option value="cash">Cash</option>
              <option value="card">Card</option>
              <option value="upi">UPI</option>
              <option value="insurance">Insurance</option>
              <option value="bank_transfer">Bank Transfer</option>
            </Select>
          </Field>
          <Field style={{ gridColumn: 'span 2' }}>
            <Label>Reference Number</Label>
            <Input
              placeholder="Transaction ID / receipt no."
              value={form.reference_number} onChange={f('reference_number')}
            />
          </Field>
        </FGrid>

        <Field style={{ marginTop: 14 }}>
          <Label>Notes</Label>
          <Textarea
            rows={2} placeholder="Optional..."
            value={form.notes} onChange={f('notes')}
          />
        </Field>

        <BtnRow>
          <CancelBtn onClick={onClose}>Cancel</CancelBtn>
          <SaveBtn onClick={handleSubmit} disabled={paying}>
            {paying ? 'Recording...' : 'Record Payment'}
          </SaveBtn>
        </BtnRow>
      </Modal>
    </Overlay>
  );
};

export default PaymentForm;

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DollarOutlined } from '@ant-design/icons';
import useBilling from '../../hooks/useBilling';
import useAuth from '../../hooks/useAuth';
import Badge from '../../components/ui/Badge/Badge';
import Spinner from '../../components/ui/Spinner/Spinner';
import { formatDate } from '../../utils/dateUtils';
import PaymentForm from './components/PaymentForm';
import {
  DetailWrap, BackRow, BackBtn, AddBtn,
  InvoiceHeaderCard, InvoiceLabel, InvoiceNumber, InvoiceDate, StatusBlock,
  TwoColGrid, InfoSection, SectionCard, SectionTitle,
  InfoRow, InfoLabel, InfoValue, EmptyPayments,
  PaymentSummaryRow, ErrMsg,
  Table, Thead, Tbody, Tr, Th, Td,
} from './InvoiceDetailPage.styled';

const formatCurrency = (val) =>
  '₹' + parseFloat(val || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const STATUS_BADGE = {
  pending: { variant: 'warning', label: 'Pending' },
  partial: { variant: 'info',    label: 'Partial'  },
  paid:    { variant: 'success', label: 'Paid'     },
};

const getStatusInfo = (inv) => {
  if (inv.status === 'pending' && inv.due_date && new Date(inv.due_date) < new Date()) {
    return { variant: 'danger', label: 'Overdue' };
  }
  return STATUS_BADGE[inv.status] || { variant: 'default', label: inv.status };
};

const InvoiceDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { role } = useAuth();
  const {
    invoice, itemLoading, itemError,
    fetchInvoice, clearInvoice,
  } = useBilling();

  const [showPaymentForm, setShowPaymentForm] = useState(false);

  useEffect(() => {
    fetchInvoice(parseInt(id, 10));
    return () => clearInvoice();
  }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  const totalPaid = invoice?.payments?.reduce((s, p) => s + parseFloat(p.amount || 0), 0) || 0;
  const remaining = parseFloat(invoice?.total_amount || 0) - totalPaid;

  const canWrite = ['admin', 'receptionist', 'nurse'].includes(role);

  return (
    <DetailWrap>
      <BackRow>
        <BackBtn onClick={() => navigate('/billing')}>← Back to Billing</BackBtn>
        {canWrite && invoice?.status !== 'paid' && (
          <AddBtn onClick={() => setShowPaymentForm(true)}>
            <DollarOutlined /> Record Payment
          </AddBtn>
        )}
      </BackRow>

      {itemLoading && (
        <EmptyPayments style={{ padding: '60px', display: 'flex', justifyContent: 'center' }}>
          <Spinner size="lg" />
        </EmptyPayments>
      )}
      {itemError && <ErrMsg>{itemError}</ErrMsg>}

      {invoice && !itemLoading && (
        <>
          <InvoiceHeaderCard>
            <div>
              <InvoiceLabel>Invoice</InvoiceLabel>
              <InvoiceNumber>#{invoice.id}</InvoiceNumber>
              <InvoiceDate>{formatDate(invoice.created_at)}</InvoiceDate>
            </div>
            <StatusBlock>
              <Badge variant={getStatusInfo(invoice).variant}>
                {getStatusInfo(invoice).label}
              </Badge>
            </StatusBlock>
          </InvoiceHeaderCard>

          <TwoColGrid>
            <InfoSection>
              <SectionTitle>Patient</SectionTitle>
              <InfoRow>
                <InfoLabel>Name</InfoLabel>
                <InfoValue>{invoice.patient_name || '—'}</InfoValue>
              </InfoRow>
              <InfoRow>
                <InfoLabel>Invoice ID</InfoLabel>
                <InfoValue>#{invoice.id}</InfoValue>
              </InfoRow>
            </InfoSection>

            <InfoSection>
              <SectionTitle>Invoice Details</SectionTitle>
              <InfoRow>
                <InfoLabel>Amount</InfoLabel>
                <InfoValue>{formatCurrency(invoice.amount)}</InfoValue>
              </InfoRow>
              <InfoRow>
                <InfoLabel>Tax</InfoLabel>
                <InfoValue>{formatCurrency(invoice.tax)}</InfoValue>
              </InfoRow>
              <InfoRow>
                <InfoLabel>Discount</InfoLabel>
                <InfoValue>- {formatCurrency(invoice.discount)}</InfoValue>
              </InfoRow>
              <InfoRow $bold>
                <InfoLabel>Total</InfoLabel>
                <InfoValue $bold>{formatCurrency(invoice.total_amount)}</InfoValue>
              </InfoRow>
              <InfoRow>
                <InfoLabel>Due Date</InfoLabel>
                <InfoValue>{formatDate(invoice.due_date)}</InfoValue>
              </InfoRow>
              {invoice.notes && (
                <InfoRow>
                  <InfoLabel>Notes</InfoLabel>
                  <InfoValue>{invoice.notes}</InfoValue>
                </InfoRow>
              )}
            </InfoSection>
          </TwoColGrid>

          {invoice.line_items?.length > 0 && (
            <SectionCard>
              <SectionTitle>Line Items</SectionTitle>
              <Table>
                <Thead>
                  <Tr>
                    <Th>Description</Th>
                    <Th style={{ textAlign: 'right' }}>Amount</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {invoice.line_items.map((li, i) => (
                    <Tr key={i}>
                      <Td>{li.description || '—'}</Td>
                      <Td style={{ textAlign: 'right' }}>{formatCurrency(li.amount)}</Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </SectionCard>
          )}

          <SectionCard>
            <SectionTitle>Payment History</SectionTitle>
            {!invoice.payments?.length ? (
              <EmptyPayments>No payments recorded yet.</EmptyPayments>
            ) : (
              <Table>
                <Thead>
                  <Tr>
                    <Th>Date</Th>
                    <Th>Method</Th>
                    <Th>Reference</Th>
                    <Th style={{ textAlign: 'right' }}>Amount</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {invoice.payments.map((p) => (
                    <Tr key={p.id}>
                      <Td>{formatDate(p.created_at)}</Td>
                      <Td style={{ textTransform: 'capitalize' }}>
                        {(p.payment_method || '').replace('_', ' ')}
                      </Td>
                      <Td style={{ fontFamily: 'monospace', fontSize: 12 }}>
                        {p.reference_number || '—'}
                      </Td>
                      <Td style={{ textAlign: 'right', fontWeight: 500 }}>
                        {formatCurrency(p.amount)}
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            )}
            <PaymentSummaryRow>
              <span>Total paid</span>
              <span>{formatCurrency(totalPaid)}</span>
            </PaymentSummaryRow>
            <PaymentSummaryRow $bold>
              <span>Remaining balance</span>
              <span>{formatCurrency(remaining)}</span>
            </PaymentSummaryRow>
          </SectionCard>
        </>
      )}

      {showPaymentForm && invoice && (
        <PaymentForm
          invoice={invoice}
          onClose={() => setShowPaymentForm(false)}
          onSuccess={() => {
            setShowPaymentForm(false);
            fetchInvoice(parseInt(id, 10));
          }}
        />
      )}
    </DetailWrap>
  );
};

export default InvoiceDetailPage;

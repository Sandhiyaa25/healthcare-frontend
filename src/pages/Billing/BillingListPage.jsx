import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusOutlined, ReloadOutlined, EyeOutlined, DollarOutlined } from '@ant-design/icons';
import useBilling from '../../hooks/useBilling';
import useAuth from '../../hooks/useAuth';
import Badge from '../../components/ui/Badge/Badge';
import Spinner from '../../components/ui/Spinner/Spinner';
import { formatDate } from '../../utils/dateUtils';
import SummaryCards from './components/SummaryCards';
import InvoiceForm from './components/InvoiceForm';
import PaymentForm from './components/PaymentForm';
import {
  Wrap, TopBar, Title, Controls, FilterSelect, IconBtn, AddBtn,
  Card, Table, Thead, Tbody, Tr, Th, Td, ActCell, ABtn,
  EmptyState, ErrMsg, PaginationWrap, PageBtn,
} from './BillingListPage.styled';

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

const BillingListPage = () => {
  const navigate = useNavigate();
  const { role } = useAuth();
  const {
    invoices, kpis, loading, error, pagination,
    fetchInvoices, fetchSummary,
  } = useBilling();

  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage]                 = useState(1);
  const [showInvoiceForm, setShowInvoiceForm] = useState(false);
  const [paymentTarget, setPaymentTarget]     = useState(null);

  useEffect(() => {
    fetchInvoices({ page: 1, per_page: 20 });
    fetchSummary();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    setPage(1);
    fetchInvoices({ status: statusFilter || undefined, page: 1, per_page: 20 });
  }, [statusFilter]); // eslint-disable-line react-hooks/exhaustive-deps

  const handlePageChange = (p) => {
    setPage(p);
    fetchInvoices({ status: statusFilter || undefined, page: p, per_page: 20 });
  };

  const handleRefresh = () => {
    fetchInvoices({ status: statusFilter || undefined, page, per_page: 20 });
    fetchSummary();
  };

  const canWrite = ['admin', 'receptionist', 'nurse'].includes(role);

  return (
    <Wrap>
      <TopBar>
        <Title>Billing</Title>
        <Controls>
          <FilterSelect value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="">All Invoices</option>
            <option value="pending">Pending</option>
            <option value="partial">Partial</option>
            <option value="paid">Paid</option>
          </FilterSelect>
          <IconBtn onClick={handleRefresh} title="Refresh"><ReloadOutlined /></IconBtn>
          {canWrite && (
            <AddBtn onClick={() => setShowInvoiceForm(true)}>
              <PlusOutlined /> New Invoice
            </AddBtn>
          )}
        </Controls>
      </TopBar>

      {error && <ErrMsg>{error}</ErrMsg>}

      <SummaryCards kpis={kpis} />

      <Card>
        {loading ? (
          <EmptyState><Spinner size="md" /></EmptyState>
        ) : (
          <Table>
            <Thead>
              <Tr>
                <Th>#</Th>
                <Th>Patient</Th>
                <Th>Amount</Th>
                <Th>Total</Th>
                <Th>Status</Th>
                <Th>Due Date</Th>
                <Th>Date</Th>
                <Th>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {invoices.length === 0 ? (
                <Tr>
                  <Td colSpan={8}><EmptyState>No invoices found.</EmptyState></Td>
                </Tr>
              ) : invoices.map((inv) => {
                const st = getStatusInfo(inv);
                return (
                  <Tr key={inv.id} $overdue={st.label === 'Overdue'}>
                    <Td>{inv.id}</Td>
                    <Td>{inv.patient_name || '—'}</Td>
                    <Td>{formatCurrency(inv.amount)}</Td>
                    <Td>{formatCurrency(inv.total_amount)}</Td>
                    <Td><Badge variant={st.variant}>{st.label}</Badge></Td>
                    <Td>{formatDate(inv.due_date)}</Td>
                    <Td>{formatDate(inv.created_at)}</Td>
                    <Td>
                      <ActCell>
                        <ABtn onClick={() => navigate(`/billing/${inv.id}`)}>
                          <EyeOutlined /> View
                        </ABtn>
                        {canWrite && inv.status !== 'paid' && (
                          <ABtn onClick={() => setPaymentTarget(inv)}>
                            <DollarOutlined /> Pay
                          </ABtn>
                        )}
                      </ActCell>
                    </Td>
                  </Tr>
                );
              })}
            </Tbody>
          </Table>
        )}
      </Card>

      {pagination.total > 0 && (
        <PaginationWrap>
          <span>
            {pagination.total} invoice{pagination.total !== 1 ? 's' : ''}
          </span>
          <div style={{ display: 'flex', gap: '6px' }}>
            {Array.from({ length: pagination.last_page || 1 }, (_, i) => i + 1).map((p) => (
              <PageBtn key={p} $active={p === page} onClick={() => handlePageChange(p)}>
                {p}
              </PageBtn>
            ))}
          </div>
        </PaginationWrap>
      )}

      {showInvoiceForm && (
        <InvoiceForm
          onClose={() => setShowInvoiceForm(false)}
          onSuccess={() => {
            setShowInvoiceForm(false);
            fetchInvoices({ page: 1, per_page: 20 });
            fetchSummary();
          }}
        />
      )}

      {paymentTarget && (
        <PaymentForm
          invoice={paymentTarget}
          onClose={() => setPaymentTarget(null)}
          onSuccess={() => {
            setPaymentTarget(null);
            fetchInvoices({ status: statusFilter || undefined, page, per_page: 20 });
            fetchSummary();
          }}
        />
      )}
    </Wrap>
  );
};

export default BillingListPage;

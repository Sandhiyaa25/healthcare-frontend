import React, { useEffect, useMemo } from 'react';
import { ReloadOutlined, LockOutlined } from '@ant-design/icons';
import useBilling from '../../hooks/useBilling';
import Spinner from '../../components/ui/Spinner/Spinner';
import { Wrap, TopBar, Title, Controls, IconBtn, Card, EmptyState } from './BillingListPage.styled';

const fmt = (val) =>
  '₹' + parseFloat(val || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const pct = (num, den) => (den > 0 ? ((num / den) * 100).toFixed(1) : '0.0');

const AdminRevenueDashboard = () => {
  const { invoices, kpis, loading, fetchInvoices, fetchSummary } = useBilling();

  useEffect(() => {
    fetchInvoices({ page: 1, per_page: 100 });
    fetchSummary();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleRefresh = () => {
    fetchInvoices({ page: 1, per_page: 100 });
    fetchSummary();
  };

  const stats = useMemo(() => {
    const now = new Date();
    let overdueAmount = 0;
    const monthMap = {};

    invoices.forEach((inv) => {
      const amount = parseFloat(inv.total_amount || inv.amount || 0);
      const paid = parseFloat(inv.paid_amount || 0);
      const isOverdue =
        inv.status === 'pending' && inv.due_date && new Date(inv.due_date) < now;

      if (isOverdue) overdueAmount += amount - paid;

      // Monthly trend
      if (inv.created_at) {
        const d = new Date(inv.created_at);
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
        if (!monthMap[key]) monthMap[key] = { collected: 0, pending: 0 };
        if (inv.status === 'paid') monthMap[key].collected += amount;
        else monthMap[key].pending += amount - paid;
      }
    });

    const grandTotal = kpis.totalPaid + kpis.totalPending + kpis.totalPartial;
    const collectionRate = pct(kpis.totalPaid, grandTotal);
    const outstanding = kpis.totalPending + kpis.totalPartial;

    // Last 6 months
    const months = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      const label = d.toLocaleString('default', { month: 'short', year: '2-digit' });
      months.push({ key, label, ...(monthMap[key] || { collected: 0, pending: 0 }) });
    }

    const overdueInvoices = invoices.filter(
      (inv) => inv.status === 'pending' && inv.due_date && new Date(inv.due_date) < now,
    );

    return { overdueAmount, outstanding, collectionRate, months, overdueInvoices, grandTotal };
  }, [invoices, kpis]);

  if (loading && invoices.length === 0) {
    return (
      <Wrap>
        <EmptyState>
          <Spinner size="md" />
        </EmptyState>
      </Wrap>
    );
  }

  const maxMonthVal = Math.max(...stats.months.map((m) => m.collected + m.pending), 1);

  return (
    <Wrap>
      <TopBar>
        <Title>Revenue Analytics</Title>
        <Controls>
          <IconBtn onClick={handleRefresh} title="Refresh">
            <ReloadOutlined />
          </IconBtn>
        </Controls>
      </TopBar>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
        {[
          { label: 'Total Collected',  value: fmt(kpis.totalPaid),      color: '#16a34a' },
          { label: 'Outstanding',      value: fmt(stats.outstanding),   color: '#d97706' },
          { label: 'Overdue Amount',   value: fmt(stats.overdueAmount), color: '#dc2626' },
          { label: 'Collection Rate',  value: `${stats.collectionRate}%`, color: '#2563eb' },
        ].map(({ label, value, color }) => (
          <Card key={label} style={{ padding: '20px 24px' }}>
            <div style={{ fontSize: 12, color: '#6b7280', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 8 }}>
              {label}
            </div>
            <div style={{ fontSize: 26, fontWeight: 700, color }}>{value}</div>
          </Card>
        ))}
      </div>

      {/* Status Breakdown */}
      <Card style={{ padding: '20px 24px' }}>
        <div style={{ fontWeight: 600, marginBottom: 16, fontSize: 14 }}>Status Breakdown</div>
        {[
          { label: 'Paid',    amount: kpis.totalPaid,     color: '#16a34a' },
          { label: 'Partial', amount: kpis.totalPartial,  color: '#2563eb' },
          { label: 'Pending', amount: kpis.totalPending,  color: '#d97706' },
          { label: 'Overdue', amount: stats.overdueAmount, color: '#dc2626' },
        ].map(({ label, amount, color }) => {
          const width = stats.grandTotal > 0 ? (amount / stats.grandTotal) * 100 : 0;
          return (
            <div key={label} style={{ marginBottom: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 4 }}>
                <span style={{ color: '#374151' }}>{label}</span>
                <span style={{ color: '#6b7280' }}>{fmt(amount)}</span>
              </div>
              <div style={{ height: 8, background: '#f3f4f6', borderRadius: 4, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${width}%`, background: color, borderRadius: 4, transition: 'width 0.4s ease' }} />
              </div>
            </div>
          );
        })}
      </Card>

      {/* Monthly Revenue Trend */}
      <Card style={{ padding: '20px 24px' }}>
        <div style={{ fontWeight: 600, marginBottom: 16, fontSize: 14 }}>Monthly Revenue Trend</div>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 12, height: 120 }}>
          {stats.months.map(({ key, label, collected, pending }) => {
            const collH = (collected / maxMonthVal) * 100;
            const pendH = (pending / maxMonthVal) * 100;
            return (
              <div key={key} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, flex: 1, justifyContent: 'flex-end' }}>
                  <div
                    title={`Collected: ${fmt(collected)}`}
                    style={{ width: '60%', height: `${collH}%`, background: '#16a34a', borderRadius: '3px 3px 0 0', minHeight: collected > 0 ? 4 : 0 }}
                  />
                  <div
                    title={`Pending: ${fmt(pending)}`}
                    style={{ width: '60%', height: `${pendH}%`, background: '#d97706', borderRadius: '3px 3px 0 0', minHeight: pending > 0 ? 4 : 0 }}
                  />
                </div>
                <div style={{ fontSize: 11, color: '#6b7280', whiteSpace: 'nowrap' }}>{label}</div>
              </div>
            );
          })}
        </div>
        <div style={{ display: 'flex', gap: 16, marginTop: 8, fontSize: 11, color: '#6b7280' }}>
          <span>
            <span style={{ display: 'inline-block', width: 10, height: 10, background: '#16a34a', borderRadius: 2, marginRight: 4 }} />
            Collected
          </span>
          <span>
            <span style={{ display: 'inline-block', width: 10, height: 10, background: '#d97706', borderRadius: 2, marginRight: 4 }} />
            Pending
          </span>
        </div>
      </Card>

      {/* Overdue Alert List */}
      {stats.overdueInvoices.length > 0 && (
        <Card>
          <div style={{ padding: '16px 24px', fontWeight: 600, fontSize: 14, color: '#dc2626', borderBottom: '1px solid #fee2e2', background: '#fef2f2' }}>
            Overdue Invoices ({stats.overdueInvoices.length})
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f9fafb' }}>
                {['#', 'Patient', 'Amount', 'Due Date'].map((h) => (
                  <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {stats.overdueInvoices.map((inv) => (
                <tr key={inv.id} style={{ borderTop: '1px solid #fee2e2', background: '#fff5f5' }}>
                  <td style={{ padding: '10px 16px', fontSize: 13, color: '#6b7280' }}>{inv.id}</td>
                  <td style={{ padding: '10px 16px', fontSize: 13, color: '#111827' }}>{inv.patient_name || '—'}</td>
                  <td style={{ padding: '10px 16px', fontSize: 13, color: '#dc2626', fontWeight: 500 }}>{fmt(inv.total_amount || inv.amount)}</td>
                  <td style={{ padding: '10px 16px', fontSize: 13, color: '#dc2626' }}>{inv.due_date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}

      {/* Admin note */}
      <div style={{ padding: '12px 16px', background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 8, fontSize: 13, color: '#1d4ed8' }}>
        <LockOutlined style={{ marginRight: 8 }} />
        To create or manage invoices, use the <strong>Receptionist</strong> account.
      </div>
    </Wrap>
  );
};

export default AdminRevenueDashboard;

import React from 'react';
import { CardsRow, SummaryCard, CardLabel, CardValue, CardCount } from './SummaryCards.styled';

const formatCurrency = (val) =>
  '₹' + parseFloat(val || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const CARDS = [
  { key: 'pending', label: 'Pending Invoices', valueKey: 'totalPending', countKey: 'countPending', accent: 'warning' },
  { key: 'paid',    label: 'Total Collected',  valueKey: 'totalPaid',    countKey: 'countPaid',    accent: 'success' },
  { key: 'partial', label: 'Partial Payments', valueKey: 'totalPartial', countKey: 'countPartial', accent: 'info'    },
];

const SummaryCards = ({ kpis }) => (
  <CardsRow>
    {CARDS.map(({ key, label, valueKey, countKey, accent }) => (
      <SummaryCard key={key} $accent={accent}>
        <CardLabel>{label}</CardLabel>
        <CardValue>{formatCurrency(kpis[valueKey])}</CardValue>
        <CardCount>
          {kpis[countKey]} invoice{kpis[countKey] !== 1 ? 's' : ''}
        </CardCount>
      </SummaryCard>
    ))}
  </CardsRow>
);

export default SummaryCards;

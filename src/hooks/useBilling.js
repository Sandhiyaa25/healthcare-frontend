import { useDispatch, useSelector } from 'react-redux';
import { useCallback, useMemo } from 'react';
import {
  fetchInvoicesRequest, fetchInvoiceRequest, fetchSummaryRequest,
  createInvoiceRequest, paymentRequest,
  clearItem, clearError,
} from '../store/billing/billingSlice';

const useBilling = () => {
  const dispatch = useDispatch();
  const {
    list, item, summary,
    loading, itemLoading, saving, paying,
    error, itemError, pagination,
  } = useSelector((s) => s.billing);

  const kpis = useMemo(() => {
    const get = (status) => summary.find((s) => s.status === status) || {};
    return {
      totalPending: parseFloat(get('pending').total  || 0),
      totalPaid:    parseFloat(get('paid').total     || 0),
      totalPartial: parseFloat(get('partial').total  || 0),
      countPending: parseInt(get('pending').count    || 0, 10),
      countPaid:    parseInt(get('paid').count       || 0, 10),
      countPartial: parseInt(get('partial').count    || 0, 10),
    };
  }, [summary]);

  return {
    invoices: list, invoice: item, summary, kpis,
    loading, itemLoading, saving, paying, error, itemError, pagination,
    fetchInvoices: useCallback((p)      => dispatch(fetchInvoicesRequest(p)),           [dispatch]),
    fetchInvoice:  useCallback((id)     => dispatch(fetchInvoiceRequest(id)),           [dispatch]),
    fetchSummary:  useCallback(()       => dispatch(fetchSummaryRequest()),             [dispatch]),
    createInvoice: useCallback((d)      => dispatch(createInvoiceRequest(d)),           [dispatch]),
    recordPayment: useCallback((id, d)  => dispatch(paymentRequest({ id, data: d })),  [dispatch]),
    clearInvoice:  useCallback(()       => dispatch(clearItem()),                       [dispatch]),
    clearError:    useCallback(()       => dispatch(clearError()),                      [dispatch]),
  };
};

export default useBilling;

import { call, put, takeLatest, select } from 'redux-saga/effects';
import {
  fetchInvoicesApi, fetchInvoiceApi, fetchSummaryApi,
  createInvoiceApi, recordPaymentApi,
} from '../../api/billing.api';
import {
  fetchInvoicesRequest, fetchInvoicesSuccess, fetchInvoicesFailure,
  fetchInvoiceRequest,  fetchInvoiceSuccess,  fetchInvoiceFailure,
  fetchSummaryRequest,  fetchSummarySuccess,  fetchSummaryFailure,
  createInvoiceRequest, createInvoiceSuccess, createInvoiceFailure,
  paymentRequest,       paymentSuccess,       paymentFailure,
} from './billingSlice';
import { normalizeError } from '../../utils/errorNormalizer';
import { queueAdd, queueGetAll } from '../offlineQueue/offlineQueueDB';
import { setQueueItems, showOfflineBanner } from '../offlineQueue/offlineQueueSlice';

const uuid = () => 'oq_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2,8);

function* checkAndQueue(label, action, endpoint, method, payload) {
  const isOnline = yield select((s) => s.offlineQueue?.isOnline ?? navigator.onLine);
  if (!isOnline) {
    yield call(queueAdd, { id: uuid(), created_at: Date.now(), action, label, endpoint, method, payload });
    const items = yield call(queueGetAll);
    yield put(setQueueItems(items));
    yield put(showOfflineBanner());
    return true;
  }
  return false;
}

function* fetchInvoicesSaga({ payload }) {
  try {
    const res = yield call(fetchInvoicesApi, payload);
    yield put(fetchInvoicesSuccess({
      invoices:   res.data?.data?.invoices || (Array.isArray(res.data?.data) ? res.data.data : []),
      pagination: res.data?.data?.pagination || {},
    }));
  } catch (e) {
    yield put(fetchInvoicesFailure(normalizeError(e).message));
  }
}

function* fetchInvoiceSaga({ payload }) {
  try {
    const res = yield call(fetchInvoiceApi, payload);
    yield put(fetchInvoiceSuccess(res.data?.data));
  } catch (e) {
    yield put(fetchInvoiceFailure(normalizeError(e).message));
  }
}

function* fetchSummarySaga() {
  try {
    const res = yield call(fetchSummaryApi);
    yield put(fetchSummarySuccess(res.data?.data || []));
  } catch (e) {
    yield put(fetchSummaryFailure(normalizeError(e).message));
  }
}

function* createInvoiceSaga({ payload }) {
  try {
    const queued = yield call(checkAndQueue,
      'Create Invoice', 'CREATE_INVOICE', '/api/billing', 'post', payload
    );
    if (queued) { yield put(createInvoiceSuccess(null)); return; }
    const res = yield call(createInvoiceApi, payload);
    yield put(createInvoiceSuccess(res.data?.data));
    yield put(fetchInvoicesRequest({ page: 1, per_page: 5 }));
  } catch (e) {
    yield put(createInvoiceFailure(normalizeError(e).message));
  }
}

function* recordPaymentSaga({ payload: { id, data } }) {
  try {
    const queued = yield call(checkAndQueue,
      'Record Payment', 'RECORD_PAYMENT', `/api/billing/${id}/payment`, 'post', data
    );
    if (queued) { yield put(paymentSuccess(null)); return; }
    const res = yield call(recordPaymentApi, id, data);
    yield put(paymentSuccess(res.data?.data));
  } catch (e) {
    yield put(paymentFailure(normalizeError(e).message));
  }
}

export default function* billingSaga() {
  yield takeLatest(fetchInvoicesRequest.type, fetchInvoicesSaga);
  yield takeLatest(fetchInvoiceRequest.type,  fetchInvoiceSaga);
  yield takeLatest(fetchSummaryRequest.type,  fetchSummarySaga);
  yield takeLatest(createInvoiceRequest.type, createInvoiceSaga);
  yield takeLatest(paymentRequest.type,       recordPaymentSaga);
}
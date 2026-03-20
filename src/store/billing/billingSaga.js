import { call, put, takeLatest } from 'redux-saga/effects';
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
    const res = yield call(createInvoiceApi, payload);
    yield put(createInvoiceSuccess(res.data?.data));
  } catch (e) {
    yield put(createInvoiceFailure(normalizeError(e).message));
  }
}

function* recordPaymentSaga({ payload: { id, data } }) {
  try {
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

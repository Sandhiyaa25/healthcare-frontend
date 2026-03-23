import { call, put, takeLatest } from 'redux-saga/effects';
import {
  fetchPrescriptionsApi,
  fetchPrescriptionApi,
  createPrescriptionApi,
  verifyPrescriptionApi,
} from '../../api/prescriptions.api';
import {
  fetchPrescriptionsRequest, fetchPrescriptionsSuccess, fetchPrescriptionsFailure,
  fetchPrescriptionRequest,  fetchPrescriptionSuccess,  fetchPrescriptionFailure,
  createPrescriptionRequest, createPrescriptionSuccess, createPrescriptionFailure,
  verifyPrescriptionRequest, verifyPrescriptionSuccess, verifyPrescriptionFailure,
} from './prescriptionsSlice';
import { normalizeError } from '../../utils/errorNormalizer';

function* fetchPrescriptionsSaga({ payload = {} }) {
  try {
    const { page = 1, perPage = 10, ...filters } = payload;
    const res = yield call(fetchPrescriptionsApi, { page, per_page: perPage, ...filters });
    const raw = res.data?.data;
    const list = Array.isArray(raw) ? raw : (raw?.prescriptions || raw?.data || []);
    yield put(fetchPrescriptionsSuccess({
      data:       list,
      pagination: { page, perPage, total: res.data?.total || list.length },
    }));
  } catch (e) {
    yield put(fetchPrescriptionsFailure(normalizeError(e).message));
  }
}

function* fetchPrescriptionSaga({ payload }) {
  try {
    const res = yield call(fetchPrescriptionApi, payload);
    yield put(fetchPrescriptionSuccess(res.data?.data));
  } catch (e) {
    yield put(fetchPrescriptionFailure(normalizeError(e).message));
  }
}

function* createPrescriptionSaga({ payload }) {
  try {
    const res = yield call(createPrescriptionApi, payload.data);
    yield put(createPrescriptionSuccess(res.data?.data));
    if (payload.onSuccess) payload.onSuccess();
  } catch (e) {
    yield put(createPrescriptionFailure(normalizeError(e).message));
  }
}

function* verifyPrescriptionSaga({ payload }) {
  try {
    const res = yield call(verifyPrescriptionApi, payload.id, payload.status);
    yield put(verifyPrescriptionSuccess(res.data?.data));
    if (payload.onSuccess) payload.onSuccess();
  } catch (e) {
    yield put(verifyPrescriptionFailure(normalizeError(e).message));
  }
}

export default function* prescriptionsSaga() {
  yield takeLatest(fetchPrescriptionsRequest.type, fetchPrescriptionsSaga);
  yield takeLatest(fetchPrescriptionRequest.type,  fetchPrescriptionSaga);
  yield takeLatest(createPrescriptionRequest.type, createPrescriptionSaga);
  yield takeLatest(verifyPrescriptionRequest.type, verifyPrescriptionSaga);
}
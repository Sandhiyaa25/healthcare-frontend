import { call, put, takeLatest, select, fork } from 'redux-saga/effects';
import {
  fetchPatientsApi, fetchPatientApi,
  createPatientApi, updatePatientApi, deletePatientApi,
} from '../../api/patients.api';
import {
  fetchPatientsRequest, fetchPatientsSuccess, fetchPatientsFailure,
  prefetchPatientsRequest, prefetchPatientsSuccess,
  fetchPatientRequest,  fetchPatientSuccess,  fetchPatientFailure,
  createPatientRequest, createPatientSuccess, createPatientFailure,
  updatePatientRequest, updatePatientSuccess, updatePatientFailure,
  deletePatientRequest, deletePatientSuccess, deletePatientFailure,
} from './patientsSlice';

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

function* fetchPatientsSaga({ payload }) {
  try {
    // Check cache first — avoid duplicate API call
    const cache    = yield select((s) => s.patients.cache);
    const page     = payload?.page ?? 1;
    if (cache[page]) {
      // Already cached — serve from store, still prefetch next
      yield put(fetchPatientsSuccess({ ...(cache[page] && { patients: cache[page] }), pagination: { current_page: page } }));
    } else {
      const res = yield call(fetchPatientsApi, payload);
      yield put(fetchPatientsSuccess(res.data?.data ?? []));
    }
    // Non-blocking: prefetch next page in background
    yield fork(prefetchPatientsSaga, { payload: { ...payload, page: page + 1 } });
  } catch (e) {
    yield put(fetchPatientsFailure(normalizeError(e).message));
  }
}

function* prefetchPatientsSaga({ payload }) {
  try {
    const cache   = yield select((s) => s.patients.cache);
    const page    = payload?.page ?? 2;
    if (cache[page]) return;  // Already cached — skip duplicate call
    yield put(prefetchPatientsRequest());
    const res = yield call(fetchPatientsApi, payload);
    const data = res.data?.data ?? {};
    // Attach the page number so the reducer can key the cache correctly
    yield put(prefetchPatientsSuccess({ ...data, page }));
  } catch (_) {
    // Prefetch failure is silent — don't disrupt main flow
  }
}

function* fetchPatientSaga({ payload }) {
  try {
    const res = yield call(fetchPatientApi, payload);
    yield put(fetchPatientSuccess(res.data?.data ?? null));
  } catch (e) {
    yield put(fetchPatientFailure(normalizeError(e).message));
  }
}

function* createPatientSaga({ payload }) {
  try {
    const queued = yield call(checkAndQueue,
      'Create Patient', 'CREATE_PATIENT', '/api/patients', 'post', payload
    );
    if (queued) { yield put(createPatientSuccess(null)); return; }
    const res = yield call(createPatientApi, payload);
    const patient = res.data?.data ?? res.data?.patient ?? res.data ?? null;
    yield put(createPatientSuccess(patient));
    yield put(fetchPatientsRequest({ page: 1, per_page: 5 }));
  } catch (e) {
    yield put(createPatientFailure(normalizeError(e).message));
  }
}

function* updatePatientSaga({ payload: { id, data } }) {
  try {
    const queued = yield call(checkAndQueue,
      'Update Patient', 'UPDATE_PATIENT', `/api/patients/${id}`, 'put', data
    );
    if (queued) { yield put(updatePatientSuccess(null)); return; }
    const res = yield call(updatePatientApi, id, data);
    yield put(updatePatientSuccess(res.data?.data ?? null));
    yield put(fetchPatientsRequest({ page: 1, per_page: 5 }));
  } catch (e) {
    yield put(updatePatientFailure(normalizeError(e).message));
  }
}

function* deletePatientSaga({ payload }) {
  try {
    yield call(deletePatientApi, payload);
    yield put(deletePatientSuccess(payload));
  } catch (e) {
    yield put(deletePatientFailure(normalizeError(e).message));
  }
}

export default function* patientsSaga() {
  yield takeLatest(fetchPatientsRequest.type, fetchPatientsSaga);
  yield takeLatest(fetchPatientRequest.type,  fetchPatientSaga);
  yield takeLatest(createPatientRequest.type, createPatientSaga);
  yield takeLatest(updatePatientRequest.type, updatePatientSaga);
  yield takeLatest(deletePatientRequest.type, deletePatientSaga);
}
// import { call, put, takeLatest } from 'redux-saga/effects';
// import {
//   fetchPatientsApi, fetchPatientApi,
//   createPatientApi, updatePatientApi, deletePatientApi,
// } from '../../api/patients.api';
// import {
//   fetchPatientsRequest, fetchPatientsSuccess, fetchPatientsFailure,
//   fetchPatientRequest,  fetchPatientSuccess,  fetchPatientFailure,
//   createPatientRequest, createPatientSuccess, createPatientFailure,
//   updatePatientRequest, updatePatientSuccess, updatePatientFailure,
//   deletePatientRequest, deletePatientSuccess, deletePatientFailure,
// } from './patientsSlice';
// import { normalizeError } from '../../utils/errorNormalizer';

// function* fetchPatientsSaga({ payload }) {
//   try {
//     const res = yield call(fetchPatientsApi, payload);
//     // res.data = { status, message, data: { patients: [...], pagination: {...} } }
//     yield put(fetchPatientsSuccess(res.data?.data ?? []));
//   } catch (e) {
//     yield put(fetchPatientsFailure(normalizeError(e).message));
//   }
// }

// function* fetchPatientSaga({ payload }) {
//   try {
//     const res = yield call(fetchPatientApi, payload);
//     yield put(fetchPatientSuccess(res.data?.data ?? null));
//   } catch (e) {
//     yield put(fetchPatientFailure(normalizeError(e).message));
//   }
// }

// function* createPatientSaga({ payload }) {
//   try {
//     const res = yield call(createPatientApi, payload);
//     // res.data = { status: true, data: { ...patient } }
//     const patient = res.data?.data ?? null;
//     yield put(createPatientSuccess(patient));
//     // Re-fetch list so new patient appears without manual page refresh
//     yield put(fetchPatientsRequest({ page: 1, per_page: 5 }));
//   } catch (e) {
//     yield put(createPatientFailure(normalizeError(e).message));
//   }
// }

// function* updatePatientSaga({ payload: { id, data } }) {
//   try {
//     const res = yield call(updatePatientApi, id, data);
//     const patient = res.data?.data ?? null;
//     yield put(updatePatientSuccess(patient));
//     // Re-fetch list so updated data reflects immediately
//     yield put(fetchPatientsRequest({ page: 1, per_page: 5 }));
//   } catch (e) {
//     yield put(updatePatientFailure(normalizeError(e).message));
//   }
// }

// function* deletePatientSaga({ payload }) {
//   try {
//     yield call(deletePatientApi, payload);
//     yield put(deletePatientSuccess(payload));
//   } catch (e) {
//     yield put(deletePatientFailure(normalizeError(e).message));
//   }
// }

// export default function* patientsSaga() {
//   yield takeLatest(fetchPatientsRequest.type, fetchPatientsSaga);
//   yield takeLatest(fetchPatientRequest.type,  fetchPatientSaga);
//   yield takeLatest(createPatientRequest.type, createPatientSaga);
//   yield takeLatest(updatePatientRequest.type, updatePatientSaga);
//   yield takeLatest(deletePatientRequest.type, deletePatientSaga);
// }

import { call, put, takeLatest, select } from 'redux-saga/effects';
import {
  fetchPatientsApi, fetchPatientApi,
  createPatientApi, updatePatientApi, deletePatientApi,
} from '../../api/patients.api';
import {
  fetchPatientsRequest, fetchPatientsSuccess, fetchPatientsFailure,
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
    const res = yield call(fetchPatientsApi, payload);
    yield put(fetchPatientsSuccess(res.data?.data ?? []));
  } catch (e) {
    yield put(fetchPatientsFailure(normalizeError(e).message));
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
    yield put(createPatientSuccess(res.data?.data ?? null));
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
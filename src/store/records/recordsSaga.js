import { call, put, takeLatest } from 'redux-saga/effects';
import {
  fetchRecordsByPatientApi,
  fetchRecordsApi,
  fetchRecordApi,
  createRecordApi,
  updateRecordApi,
} from '../../api/records.api';

import {
  fetchRecordsRequest,  fetchRecordsSuccess,  fetchRecordsFailure,
  fetchRecordRequest,   fetchRecordSuccess,   fetchRecordFailure,
  createRecordRequest,  createRecordSuccess,  createRecordFailure,
  updateRecordRequest,  updateRecordSuccess,  updateRecordFailure,
} from './recordsSlice';
import { normalizeError } from '../../utils/errorNormalizer';

function* fetchRecordsSaga({ payload = {} }) {
  try {
    const { page = 1, perPage = 10, patientId, ...filters } = payload;

    let res;
    if (patientId && patientId !== 'me') {
      res = yield call(fetchRecordsByPatientApi, patientId, { page, per_page: perPage });
    } else {
      res = yield call(fetchRecordsApi, { page, per_page: perPage, ...filters });
    }

    const raw  = res.data?.data;
    const list = Array.isArray(raw) ? raw : [];
    yield put(fetchRecordsSuccess({
      data:       list,
      pagination: { page, perPage, total: res.data?.total || list.length },
    }));
  } catch (e) {
    yield put(fetchRecordsFailure(normalizeError(e).message));
  }
}

function* fetchRecordSaga({ payload }) {
  try {
    const res = yield call(fetchRecordApi, payload);
    yield put(fetchRecordSuccess(res.data?.data));
  } catch (e) {
    yield put(fetchRecordFailure(normalizeError(e).message));
  }
}

function* createRecordSaga({ payload }) {
  try {
    const res = yield call(createRecordApi, payload.data);
    yield put(createRecordSuccess(res.data?.data));
    if (payload.onSuccess) payload.onSuccess();
  } catch (e) {
    yield put(createRecordFailure(normalizeError(e).message));
  }
}

function* updateRecordSaga({ payload }) {
  try {
    const res = yield call(updateRecordApi, payload.id, payload.data);
    yield put(updateRecordSuccess(res.data?.data));
    if (payload.onSuccess) payload.onSuccess();
  } catch (e) {
    yield put(updateRecordFailure(normalizeError(e).message));
  }
}

export default function* recordsSaga() {
  yield takeLatest(fetchRecordsRequest.type,  fetchRecordsSaga);
  yield takeLatest(fetchRecordRequest.type,   fetchRecordSaga);
  yield takeLatest(createRecordRequest.type,  createRecordSaga);
  yield takeLatest(updateRecordRequest.type,  updateRecordSaga);
}
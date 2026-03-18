import { call, put, takeLatest } from 'redux-saga/effects';
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

function* fetchPatientsSaga({ payload }) {
  try {
    const res = yield call(fetchPatientsApi, payload);
    yield put(fetchPatientsSuccess(res.data?.data || []));
  } catch (e) { yield put(fetchPatientsFailure(normalizeError(e).message)); }
}

function* fetchPatientSaga({ payload }) {
  try {
    const res = yield call(fetchPatientApi, payload);
    yield put(fetchPatientSuccess(res.data?.data));
  } catch (e) { yield put(fetchPatientFailure(normalizeError(e).message)); }
}

function* createPatientSaga({ payload }) {
  try {
    const res = yield call(createPatientApi, payload);
    yield put(createPatientSuccess(res.data?.data));
  } catch (e) { yield put(createPatientFailure(normalizeError(e).message)); }
}

function* updatePatientSaga({ payload: { id, data } }) {
  try {
    const res = yield call(updatePatientApi, id, data);
    yield put(updatePatientSuccess(res.data?.data));
  } catch (e) { yield put(updatePatientFailure(normalizeError(e).message)); }
}

function* deletePatientSaga({ payload }) {
  try {
    yield call(deletePatientApi, payload);
    yield put(deletePatientSuccess(payload));
  } catch (e) { yield put(deletePatientFailure(normalizeError(e).message)); }
}

export default function* patientsSaga() {
  yield takeLatest(fetchPatientsRequest.type, fetchPatientsSaga);
  yield takeLatest(fetchPatientRequest.type,  fetchPatientSaga);
  yield takeLatest(createPatientRequest.type, createPatientSaga);
  yield takeLatest(updatePatientRequest.type, updatePatientSaga);
  yield takeLatest(deletePatientRequest.type, deletePatientSaga);
}

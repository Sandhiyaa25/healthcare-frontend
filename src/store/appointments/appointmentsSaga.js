import { call, put, takeLatest } from 'redux-saga/effects';
import axiosInstance from '../../api/axiosInstance';
import {
  fetchAppointmentsApi, fetchAppointmentApi,
  createAppointmentApi, updateAppointmentApi, cancelAppointmentApi,
} from '../../api/appointments.api';
import {
  fetchRequest, fetchSuccess, fetchFailure,
  fetchOneRequest, fetchOneSuccess, fetchOneFailure,
  createRequest, createSuccess, createFailure,
  updateRequest, updateSuccess, updateFailure,
  cancelRequest, cancelSuccess, cancelFailure,
  statusRequest, statusSuccess, statusFailure,
  setConflict,
} from './appointmentsSlice';
import { normalizeError } from '../../utils/errorNormalizer';

function* fetchAppointmentsSaga({ payload }) {
  try {
    const res = yield call(fetchAppointmentsApi, payload);
    yield put(fetchSuccess(res.data?.data));
  } catch (e) {
    yield put(fetchFailure(normalizeError(e).message));
  }
}

function* fetchAppointmentSaga({ payload }) {
  try {
    const res = yield call(fetchAppointmentApi, payload);
    yield put(fetchOneSuccess(res.data?.data));
  } catch (e) {
    yield put(fetchOneFailure(normalizeError(e).message));
  }
}

function* createAppointmentSaga({ payload }) {
  try {
    const res = yield call(createAppointmentApi, payload);
    yield put(createSuccess(res.data?.data));
    yield put(fetchRequest({ page: 1, per_page: 20 }));
  } catch (e) {
    const conflict = e.response?.data?.errors?.conflict;
    if (conflict) {
      yield put(setConflict(conflict));
    }
    yield put(createFailure(normalizeError(e).message));
  }
}

function* updateAppointmentSaga({ payload: { id, data } }) {
  try {
    const res = yield call(updateAppointmentApi, id, data);
    yield put(updateSuccess(res.data?.data));
    yield put(fetchRequest({ page: 1, per_page: 20 }));
  } catch (e) {
    const conflict = e.response?.data?.errors?.conflict;
    if (conflict) {
      yield put(setConflict(conflict));
    }
    yield put(updateFailure(normalizeError(e).message));
  }
}

// FIND cancelAppointmentSaga and REPLACE with this:
function* cancelAppointmentSaga({ payload }) {
  try {
    yield call(cancelAppointmentApi, payload);
    // Backend returns data:null for cancel — re-fetch the appointment instead
    // to get the updated status
    const res = yield call(fetchAppointmentApi, payload);
    yield put(cancelSuccess(res.data?.data ?? null));
    // Also re-fetch the list so list page updates too
    yield put(fetchRequest({ page: 1, per_page: 20 }));
  } catch (e) {
    yield put(cancelFailure(normalizeError(e).message));
  }
}

function* updateStatusSaga({ payload: { id, status } }) {
  try {
    const res = yield call(
      [axiosInstance, axiosInstance.patch],
      `/api/appointments/${id}/status`,
      { status },
    );
    yield put(statusSuccess(res.data?.data));
  } catch (e) {
    yield put(statusFailure(normalizeError(e).message));
  }
}

export default function* appointmentsSaga() {
  yield takeLatest(fetchRequest.type,   fetchAppointmentsSaga);
  yield takeLatest(fetchOneRequest.type, fetchAppointmentSaga);
  yield takeLatest(createRequest.type,  createAppointmentSaga);
  yield takeLatest(updateRequest.type,  updateAppointmentSaga);
  yield takeLatest(cancelRequest.type,  cancelAppointmentSaga);
  yield takeLatest(statusRequest.type,  updateStatusSaga);
}

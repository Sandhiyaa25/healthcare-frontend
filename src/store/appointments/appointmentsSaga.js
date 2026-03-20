import { call, put, takeLatest } from 'redux-saga/effects';
import {
  fetchAppointmentsApi, fetchAppointmentApi,
  createAppointmentApi, updateAppointmentApi, cancelAppointmentApi,
  updateStatusApi,
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

function* fetchAppointmentsSaga({ payload }) {
  try {
    const res = yield call(fetchAppointmentsApi, payload);
    yield put(fetchSuccess(res.data?.data));
  } catch (e) {
    yield put(fetchFailure(e.message || 'Failed to fetch appointments'));
  }
}

function* fetchAppointmentSaga({ payload }) {
  try {
    const res = yield call(fetchAppointmentApi, payload);
    yield put(fetchOneSuccess(res.data?.data));
  } catch (e) {
    yield put(fetchOneFailure(e.message || 'Failed to fetch appointment'));
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
    yield put(createFailure(e.message || 'Failed to create appointment'));
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
    yield put(updateFailure(e.message || 'Failed to update appointment'));
  }
}

function* cancelAppointmentSaga({ payload }) {
  try {
    const res = yield call(cancelAppointmentApi, payload);
    yield put(cancelSuccess(res.data?.data ?? null));
    yield put(fetchRequest({ page: 1, per_page: 20 }));
  } catch (e) {
    yield put(cancelFailure(e.message || 'Failed to cancel appointment'));
  }
}

function* updateStatusSaga({ payload: { id, status } }) {
  try {
    const res = yield call(updateStatusApi, id, status);
    yield put(statusSuccess(res.data?.data));
  } catch (e) {
    yield put(statusFailure(e.message || 'Failed to update status'));
  }
}

export default function* appointmentsSaga() {
  yield takeLatest(fetchRequest.type, fetchAppointmentsSaga);
  yield takeLatest(fetchOneRequest.type, fetchAppointmentSaga);
  yield takeLatest(createRequest.type, createAppointmentSaga);
  yield takeLatest(updateRequest.type, updateAppointmentSaga);
  yield takeLatest(cancelRequest.type, cancelAppointmentSaga);
  yield takeLatest(statusRequest.type, updateStatusSaga);
}

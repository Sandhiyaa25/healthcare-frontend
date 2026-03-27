import { call, put, takeLatest, select, fork } from 'redux-saga/effects';

import axiosInstance from '../../api/axiosInstance';
import {
  fetchAppointmentsApi, fetchAppointmentApi,
  createAppointmentApi, updateAppointmentApi, cancelAppointmentApi,
} from '../../api/appointments.api';
import {
  fetchRequest, fetchSuccess, fetchFailure,
  prefetchRequest, prefetchSuccess,
  fetchOneRequest, fetchOneSuccess, fetchOneFailure,
  createRequest, createSuccess, createFailure,
  updateRequest, updateSuccess, updateFailure,
  cancelRequest, cancelSuccess, cancelFailure,
  statusRequest, statusSuccess, statusFailure,
  setConflict,
} from './appointmentsSlice';
import { normalizeError } from '../../utils/errorNormalizer';
import { queueAdd, queueGetAll } from '../offlineQueue/offlineQueueDB';
import { setQueueItems, showOfflineBanner } from '../offlineQueue/offlineQueueSlice';

// ─── Offline helper ───────────────────────────────────────────────────────────
const uuid = () => 'oq_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 8);

function* checkAndQueue(label, action, endpoint, method, payload) {
  const isOnline = yield select((s) => s.offlineQueue?.isOnline ?? navigator.onLine);
  if (!isOnline) {
    yield call(queueAdd, {
      id: uuid(), created_at: Date.now(),
      action, label, endpoint, method, payload,
    });
    const items = yield call(queueGetAll);
    yield put(setQueueItems(items));
    yield put(showOfflineBanner());
    return true;
  }
  return false;
}

// ─── Fetch list (UI-facing) ───────────────────────────────────────────────────
// Serves from cache instantly when available; otherwise calls the API.
// After every successful API response it forks a background prefetch for page+1.
function* fetchAppointmentsSaga({ payload }) {
  try {
    const cache = yield select((s) => s.appointments.cache);
    const page  = payload?.page ?? 1;

    if (cache[page]) {
      // Cache hit — serve immediately, no API call needed.
      // IMPORTANT: cache stores { list, pagination } but fetchSuccess reducer
      // reads payload?.appointments — so we must normalize to API shape here.
      yield put(fetchSuccess({
        appointments: cache[page].list,
        pagination:   cache[page].pagination,
      }));

      // Still prefetch the next page in case it isn't cached yet.
      const lastPage = cache[page]?.pagination?.last_page;
      if (!lastPage || page < lastPage) {
        yield fork(prefetchAppointmentsSaga, {
          payload: { ...payload, page: page + 1 },
        });
      }
    } else {
      // Cache miss — fetch from API.
      const res      = yield call(fetchAppointmentsApi, payload);
      const data     = res.data?.data ?? {};
      yield put(fetchSuccess(data));

      // Prefetch the next page only if it exists.
      const lastPage = data?.pagination?.last_page;
      if (!lastPage || page < lastPage) {
        yield fork(prefetchAppointmentsSaga, {
          payload: { ...payload, page: page + 1 },
        });
      }
    }
  } catch (e) {
    yield put(fetchFailure(normalizeError(e).message));
  }
}

// ─── Prefetch (background, cache-only, never touches state.list) ─────────────
function* prefetchAppointmentsSaga({ payload }) {
  try {
    const cache = yield select((s) => s.appointments.cache);
    const page  = payload?.page ?? 2;

    // BUG FIX: Guard was missing in the original — always re-fetched even if
    // already cached. This caused unnecessary API calls on every navigation.
    if (cache[page]) return;

    yield put(prefetchRequest());
    const res      = yield call(fetchAppointmentsApi, payload);
    const data     = res.data?.data ?? {};
    const lastPage = data?.pagination?.last_page;

    if (lastPage && page > lastPage) return; // Page out of range — skip

    yield put(prefetchSuccess({ ...data, page }));
  } catch (_) {
    // Prefetch failure is intentionally silent — never disrupts the UI.
  }
}

// ─── Fetch single ─────────────────────────────────────────────────────────────
function* fetchAppointmentSaga({ payload }) {
  try {
    const res = yield call(fetchAppointmentApi, payload);
    yield put(fetchOneSuccess(res.data?.data));
  } catch (e) {
    yield put(fetchOneFailure(normalizeError(e).message));
  }
}

// ─── Create ───────────────────────────────────────────────────────────────────
function* createAppointmentSaga({ payload }) {
  try {
    const queued = yield call(checkAndQueue,
      'Book Appointment', 'CREATE_APPOINTMENT',
      '/api/appointments', 'post', payload,
    );
    if (queued) { yield put(createSuccess(null)); return; }

    const res = yield call(createAppointmentApi, payload);
    yield put(createSuccess(res.data?.data));
    yield put(fetchRequest({ page: 1, per_page: 5 }));
  } catch (e) {
    const conflict = e.response?.data?.errors?.conflict;
    if (conflict) yield put(setConflict(conflict));
    yield put(createFailure(normalizeError(e).message));
  }
}

// ─── Update ───────────────────────────────────────────────────────────────────
function* updateAppointmentSaga({ payload: { id, data } }) {
  try {
    const queued = yield call(checkAndQueue,
      'Update Appointment', 'UPDATE_APPOINTMENT',
      `/api/appointments/${id}`, 'put', data,
    );
    if (queued) { yield put(updateSuccess(null)); return; }

    const res = yield call(updateAppointmentApi, id, data);
    yield put(updateSuccess(res.data?.data));
    yield put(fetchRequest({ page: 1, per_page: 5 }));
  } catch (e) {
    const conflict = e.response?.data?.errors?.conflict;
    if (conflict) yield put(setConflict(conflict));
    yield put(updateFailure(normalizeError(e).message));
  }
}

// ─── Cancel ───────────────────────────────────────────────────────────────────
function* cancelAppointmentSaga({ payload }) {
  try {
    const res = yield call(cancelAppointmentApi, payload);
    yield put(cancelSuccess(res.data?.data ?? null));
    yield put(fetchRequest({ page: 1, per_page: 5 }));
  } catch (e) {
    yield put(cancelFailure(normalizeError(e).message));
  }
}

// ─── Status update ────────────────────────────────────────────────────────────
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

// ─── Root watcher ─────────────────────────────────────────────────────────────
export default function* appointmentsSaga() {
  yield takeLatest(fetchRequest.type,     fetchAppointmentsSaga);
  yield takeLatest(fetchOneRequest.type,  fetchAppointmentSaga);
  yield takeLatest(createRequest.type,    createAppointmentSaga);
  yield takeLatest(updateRequest.type,    updateAppointmentSaga);
  yield takeLatest(cancelRequest.type,    cancelAppointmentSaga);
  yield takeLatest(statusRequest.type,    updateStatusSaga);
}
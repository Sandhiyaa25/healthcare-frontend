import { call, put, takeLatest, select, fork } from 'redux-saga/effects';

import {
  fetchPrescriptionsApi,
  fetchPrescriptionApi,
  createPrescriptionApi,
  verifyPrescriptionApi,
} from '../../api/prescriptions.api';
import {
  fetchPrescriptionsRequest, fetchPrescriptionsSuccess, fetchPrescriptionsFailure,
  prefetchPrescriptionsRequest, prefetchPrescriptionsSuccess,
  fetchPrescriptionRequest,  fetchPrescriptionSuccess,  fetchPrescriptionFailure,
  createPrescriptionRequest, createPrescriptionSuccess, createPrescriptionFailure,
  verifyPrescriptionRequest, verifyPrescriptionSuccess, verifyPrescriptionFailure,
} from './prescriptionsSlice';
import { normalizeError } from '../../utils/errorNormalizer';
import { queueAdd, queueGetAll } from '../offlineQueue/offlineQueueDB';
import { setQueueItems, showOfflineBanner } from '../offlineQueue/offlineQueueSlice';

const uuid = () => 'oq_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 8);

// ─── Fetch list (UI-facing) ───────────────────────────────────────────────────
// BUG FIX: Original saga checked cache but never dispatched fetchPrescriptionsSuccess
// when cache was hit — so state.list was never populated from cache. The loading
// spinner would never clear and the table would show empty on cache-hit pages.
function* fetchPrescriptionsSaga({ payload = {} }) {
  try {
    const { page = 1, perPage = 5, ...filters } = payload;
    const cache = yield select((s) => s.prescriptions.cache);

    if (cache[page]) {
      // Cache hit — serve immediately, exactly mirroring the API success shape
      yield put(fetchPrescriptionsSuccess({
        data:       cache[page].list,
        pagination: cache[page].pagination,
      }));
    } else {
      // Cache miss — fetch from API
      const res  = yield call(fetchPrescriptionsApi, { page, per_page: perPage, ...filters });
      const raw  = res.data?.data;
      const list = Array.isArray(raw) ? raw : (raw?.prescriptions || raw?.data || []);
      yield put(fetchPrescriptionsSuccess({
        data:       list,
        pagination: { page, perPage, total: raw?.pagination?.total ?? res.data?.total ?? list.length },
      }));
    }

    // Non-blocking prefetch of the next page
    const totalFromCache = yield select((s) => s.prescriptions.pagination?.total);
    const totalPages     = totalFromCache ? Math.ceil(totalFromCache / (perPage || 5)) : null;
    if (!totalPages || page < totalPages) {
      yield fork(prefetchPrescriptionsSaga, { payload: { ...payload, page: page + 1, perPage } });
    }

  } catch (e) {
    yield put(fetchPrescriptionsFailure(normalizeError(e).message));
  }
}

// ─── Prefetch (background, cache-only) ───────────────────────────────────────
function* prefetchPrescriptionsSaga({ payload = {} }) {
  try {
    const { page = 2, perPage = 5, ...filters } = payload;
    const cache = yield select((s) => s.prescriptions.cache);

    // BUG FIX: Guard must come BEFORE dispatching prefetchPrescriptionsRequest,
    // otherwise prefetching=true is set but never cleared on a cache-hit return.
    if (cache[page]) return;

    yield put(prefetchPrescriptionsRequest());
    const res  = yield call(fetchPrescriptionsApi, { page, per_page: perPage, ...filters });
    const raw  = res.data?.data;
    const list = Array.isArray(raw) ? raw : (raw?.prescriptions || raw?.data || []);

    yield put(prefetchPrescriptionsSuccess({
      data:       list,
      pagination: { page, perPage, total: raw?.pagination?.total ?? res.data?.total ?? list.length },
      page,       // explicit page key so the reducer can always find it
    }));
  } catch (_) {
    // Prefetch failure is intentionally silent — never disrupts the UI.
  }
}

// ─── Fetch single ─────────────────────────────────────────────────────────────
function* fetchPrescriptionSaga({ payload }) {
  try {
    const res = yield call(fetchPrescriptionApi, payload);
    yield put(fetchPrescriptionSuccess(res.data?.data));
  } catch (e) {
    yield put(fetchPrescriptionFailure(normalizeError(e).message));
  }
}

// ─── Create ───────────────────────────────────────────────────────────────────
function* createPrescriptionSaga({ payload }) {
  try {
    const isOnline = yield select((s) => s.offlineQueue?.isOnline ?? navigator.onLine);
    if (!isOnline) {
      yield call(queueAdd, {
        id: uuid(), created_at: Date.now(),
        action: 'CREATE_PRESCRIPTION', label: 'Create Prescription',
        endpoint: '/api/prescriptions', method: 'post',
        payload: payload.data,
      });
      const items = yield call(queueGetAll);
      yield put(setQueueItems(items));
      yield put(showOfflineBanner());
      yield put(createPrescriptionSuccess(null));
      if (payload.onSuccess) payload.onSuccess();
      return;
    }
    const res = yield call(createPrescriptionApi, payload.data);
    yield put(createPrescriptionSuccess(res.data?.data));
    yield put(fetchPrescriptionsRequest({ page: 1, perPage: 5 }));
    if (payload.onSuccess) payload.onSuccess();
  } catch (e) {
    yield put(createPrescriptionFailure(normalizeError(e).message));
  }
}

// ─── Verify ───────────────────────────────────────────────────────────────────
function* verifyPrescriptionSaga({ payload }) {
  try {
    const res = yield call(verifyPrescriptionApi, payload.id, payload.status);
    yield put(verifyPrescriptionSuccess(res.data?.data));
    if (payload.onSuccess) payload.onSuccess();
  } catch (e) {
    yield put(verifyPrescriptionFailure(normalizeError(e).message));
  }
}

// ─── Root watcher ─────────────────────────────────────────────────────────────
export default function* prescriptionsSaga() {
  yield takeLatest(fetchPrescriptionsRequest.type, fetchPrescriptionsSaga);
  yield takeLatest(fetchPrescriptionRequest.type,  fetchPrescriptionSaga);
  yield takeLatest(createPrescriptionRequest.type, createPrescriptionSaga);
  yield takeLatest(verifyPrescriptionRequest.type, verifyPrescriptionSaga);
}
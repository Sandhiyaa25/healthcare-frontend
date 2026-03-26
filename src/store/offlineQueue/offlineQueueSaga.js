/**
 * offlineQueueSaga.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Central saga for offline queue management.
 *
 * Responsibilities:
 *  1. Watch for QUEUE_ACTION — if online: execute immediately,
 *                               if offline: encrypt and store in IDB
 *  2. Watch window online/offline events
 *  3. When online event fires → drain queue (submit all pending in order)
 *  4. Load queue from IDB on app start
 */

import {
  call, put, take, takeEvery, takeLatest,
  select, fork, all, delay,
} from 'redux-saga/effects';
import { eventChannel } from 'redux-saga';
import axiosInstance from '../../api/axiosInstance';
import {
  queueAdd, queueGetAll, queueRemove,
  queueIncrementRetry, queueClear,
  queueMarkFailed, queueResetItem,
} from './offlineQueueDB';

import {
  queueAction,
  setOnline, setOffline,
  syncStart, syncItemSuccess, syncItemFailed,  syncItemError, syncComplete,
  showOfflineBanner, hideBanner,
  drainQueue,
  loadQueueRequest, loadQueueSuccess,
  setQueueItems,retryItem,
cancelItem,
} from './offlineQueueSlice';

const MAX_RETRIES = 3;

// ─── Generate UUID ────────────────────────────────────────────────────────────
const uuid = () =>
  'oq_' + Date.now().toString(36) + '_' +
  Math.random().toString(36).slice(2, 8);

// ─── Execute a single API call ────────────────────────────────────────────────
function* executeAction(item) {
  const { endpoint, method, payload } = item;
  const methodLower = (method || 'post').toLowerCase();
  return yield call([axiosInstance, axiosInstance[methodLower]], endpoint, payload);
}

// ─── Handle QUEUE_ACTION ──────────────────────────────────────────────────────
function* handleQueueAction({ payload }) {
  const isOnline = yield select((s) => s.offlineQueue.isOnline);

  if (isOnline) {
  try {
    yield call(executeAction, payload);
  } catch (e) {
    // Don't rethrow — let the caller's own saga handle failures
    // This saga's job is only queue management
    console.warn('[OfflineQueue] direct execute failed:', e?.message);
  }
}

else {
    // Offline — store encrypted in IDB
    const item = {
      id:         uuid(),
      created_at: Date.now(),
      action:     payload.action   || 'API_CALL',
      label:      payload.label    || 'Action',
      endpoint:   payload.endpoint,
      method:     payload.method   || 'post',
      payload:    payload.payload  || {},
    };

    yield call(queueAdd, item);

    // Refresh items in Redux from IDB
    const items = yield call(queueGetAll);
    yield put(setQueueItems(items));
    yield put(showOfflineBanner());
  }
}
// ─── Extract user-facing error message from API response ──────────────────────
const extractErrorMessage = (e) => {
  // Laravel/PHP backend shapes:
  // { message: "...", errors: { field: [...] } }
  // { error: "...", error_code: "..." }
  const data    = e?.response?.data;
  const message = data?.message || data?.error || e?.message || 'Request failed';

  // Detect scheduling conflict specifically
  const isConflict =
    e?.response?.status === 409 ||
    e?.response?.status === 422 ||
    message.toLowerCase().includes('conflict') ||
    message.toLowerCase().includes('slot') ||
    message.toLowerCase().includes('already booked') ||
    message.toLowerCase().includes('scheduling');

  if (isConflict) {
    return { message: 'Time slot already booked — please choose a different time', isPermanent: true };
  }

  // Other permanent failures — don't retry
  const status = e?.response?.status;
  if (status === 400 || status === 404 || status === 422) {
    return { message, isPermanent: true };
  }

  // Transient failures (network, 5xx) — ok to retry
  return { message, isPermanent: false };
};

// ─── Drain the queue (called when coming back online) ────────────────────────
function* drainQueueSaga() {
  const items = yield call(queueGetAll);
  if (items.length === 0) return;

  yield put(syncStart());

  let hasError = false;

  for (const item of items) {
  // Skip items already permanently failed — user must act on them first
  if (item.status === 'failed') {
    yield put(syncItemError({ id: item.id, error: item.error }));
    hasError = true;
    continue;
  }


    try {
      yield call(executeAction, item);
      yield call(queueRemove, item.id);
      yield put(syncItemSuccess(item.id));
      yield delay(150); // slight delay between requests — don't hammer server

    } catch (e) {
  const { message, isPermanent } = extractErrorMessage(e);
  const status = e?.response?.status;

  // Auth failure — stop entire drain immediately
  if (status === 401 || status === 403) {
    yield call(queueMarkFailed, item.id, message);
    yield put(syncItemError({ id: item.id, error: message }));
    hasError = true;
    break;
  }

  if (isPermanent || item.retries + 1 >= MAX_RETRIES) {
    // Permanent error (conflict, bad request) OR max retries hit
    // → Mark as failed, keep in queue so user can edit/cancel
    yield call(queueMarkFailed, item.id, message);
    yield put(syncItemError({ id: item.id, error: message }));
  } else {
    // Transient error — increment retry, will be attempted next drain
    yield call(queueIncrementRetry, item.id);
    yield put(syncItemFailed(item.id));
  }
  hasError = true;
}

    
  }

  yield put(syncComplete());

  // Auto-hide success banner after 4 seconds
  if (!hasError) {
    yield delay(4000);
    yield put(hideBanner());
  }
}

// ─── Load queue from IDB on app start ─────────────────────────────────────────
function* loadQueueSaga() {
  const items = yield call(queueGetAll);
  yield put(loadQueueSuccess(items));
}
// ─── Retry a single failed item ───────────────────────────────────────────────
function* retryItemSaga({ payload: id }) {
  yield call(queueResetItem, id);   // reset status/error in IDB
  yield put(drainQueue());          // re-drain (will pick it up now)
}

// ─── Cancel / remove a single queue item ─────────────────────────────────────
function* cancelItemSaga({ payload: id }) {
  yield call(queueRemove, id);
  const items = yield call(queueGetAll);
  yield put(setQueueItems(items));
  if (items.length === 0) yield put(hideBanner());
}



// ─── Watch window online/offline events ──────────────────────────────────────
function createNetworkChannel() {
  return eventChannel((emit) => {
    const onOnline  = () => emit({ type: 'ONLINE'  });
    const onOffline = () => emit({ type: 'OFFLINE' });

    window.addEventListener('online',  onOnline);
    window.addEventListener('offline', onOffline);

    // Cleanup
    return () => {
      window.removeEventListener('online',  onOnline);
      window.removeEventListener('offline', onOffline);
    };
  });
}

function* watchNetwork() {
  const channel = yield call(createNetworkChannel);

  while (true) {
    const event = yield take(channel);

    if (event.type === 'ONLINE') {
      yield put(setOnline());
      // Small delay — wait for connection to stabilise
      yield delay(1000);
      // Drain any queued actions
      yield put(drainQueue());
    } else if (event.type === 'OFFLINE') {
      yield put(setOffline());
      yield put(showOfflineBanner());
    }
  }
}

// ─── Root offline queue saga ──────────────────────────────────────────────────
export default function* offlineQueueSaga() {
  yield all([
    fork(watchNetwork),
    takeLatest(loadQueueRequest.type, loadQueueSaga),
    takeEvery(queueAction.type,       handleQueueAction),
    takeLatest(drainQueue.type,       drainQueueSaga),
    takeEvery(retryItem.type,         retryItemSaga),   // ← ADD
    takeEvery(cancelItem.type,        cancelItemSaga), 
  ]);
}
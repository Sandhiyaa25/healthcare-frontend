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
} from './offlineQueueDB';
import {
  queueAction,
  setOnline, setOffline,
  syncStart, syncItemSuccess, syncItemFailed, syncComplete,
  showOfflineBanner, hideBanner,
  drainQueue,
  loadQueueRequest, loadQueueSuccess,
  setQueueItems,
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
    // Online — execute immediately, no queuing needed
    try {
      yield call(executeAction, payload);
      // Caller handles success via their own saga
    } catch (e) {
      // Let error propagate to caller
      throw e;
    }
  } else {
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

// ─── Drain the queue (called when coming back online) ────────────────────────
function* drainQueueSaga() {
  const items = yield call(queueGetAll);
  if (items.length === 0) return;

  yield put(syncStart());

  let hasError = false;

  for (const item of items) {
    if (item.retries >= MAX_RETRIES) {
      // Too many retries — skip and mark failed
      yield put(syncItemFailed(item.id));
      hasError = true;
      continue;
    }

    try {
      yield call(executeAction, item);
      yield call(queueRemove, item.id);
      yield put(syncItemSuccess(item.id));
      yield delay(150); // slight delay between requests — don't hammer server
    } catch (e) {
      yield call(queueIncrementRetry, item.id);
      yield put(syncItemFailed(item.id));
      hasError = true;

      // If 401/403 — stop draining (auth issue)
      const status = e?.response?.status;
      if (status === 401 || status === 403) break;
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
  ]);
}
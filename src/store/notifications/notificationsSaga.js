import {
  call, put, takeLatest, takeEvery,
  delay, race, take, select,
} from 'redux-saga/effects';
import {
  fetchNotificationsApi,
  markReadApi,
  markAllReadApi,
  getUnreadCountApi,
} from '../../api/notifications.api';
import {
  fetchNotificationsRequest,
  fetchNotificationsSuccess,
  fetchNotificationsFailure,
  fetchUnreadCountSuccess,
  markReadRequest,
  markReadSuccess,
  markAllReadRequest,
  markAllReadSuccess,
  startPolling,
  stopPolling,
} from './notificationsSlice';

// ─── Fetch notifications list + unread count ──────────────────────────────────
function* fetchNotificationsSaga({ payload = {} }) {
  try {
    const [listRes, countRes] = yield Promise.all([
      fetchNotificationsApi({ per_page: 20, ...payload }),
      getUnreadCountApi(),
    ]);
    const raw  = listRes.data?.data;
    const list = Array.isArray(raw) ? raw
      : Array.isArray(raw?.notifications) ? raw.notifications : [];
    const count = countRes.data?.data?.count ?? 0;

    yield put(fetchNotificationsSuccess({ list, unreadCount: count }));
  } catch {
    yield put(fetchNotificationsFailure());
  }
}

// ─── Mark single notification read ────────────────────────────────────────────
function* markReadSaga({ payload: id }) {
  try {
    yield call(markReadApi, id);
    yield put(markReadSuccess(id));
  } catch {
    // ignore
  }
}

// ─── Mark all notifications read ──────────────────────────────────────────────
function* markAllReadSaga() {
  try {
    yield call(markAllReadApi);
    yield put(markAllReadSuccess());
  } catch {
    // ignore
  }
}

// ─── Poll unread count every 30 seconds ───────────────────────────────────────
function* pollUnreadCount() {
  while (true) {
    try {
      const res      = yield call(getUnreadCountApi);
      const newCount = res.data?.data?.count ?? 0;
      yield put(fetchUnreadCountSuccess(newCount));
    } catch {
      // ignore polling errors silently
    }
    yield delay(30000);
  }
}

// ─── Watch for startPolling / stopPolling ─────────────────────────────────────
function* watchPolling() {
  while (true) {
    yield take(startPolling.type);
    yield race({
      task:   call(pollUnreadCount),
      cancel: take(stopPolling.type),
    });
  }
}

// ─── Root saga ────────────────────────────────────────────────────────────────
export default function* notificationsSaga() {
  yield takeLatest(fetchNotificationsRequest.type, fetchNotificationsSaga);
  yield takeEvery(markReadRequest.type,            markReadSaga);
  yield takeEvery(markAllReadRequest.type,         markAllReadSaga);
  yield watchPolling();
}
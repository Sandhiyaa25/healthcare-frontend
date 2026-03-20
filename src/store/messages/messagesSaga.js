import { call, put, takeLatest } from 'redux-saga/effects';
import { fetchMessagesApi, sendMessageApi } from '../../api/messages.api';
import {
  fetchThreadRequest, fetchThreadSuccess, fetchThreadFailure,
  sendMessageRequest, sendMessageSuccess, sendMessageFailure,
} from './messagesSlice';
import { normalizeError } from '../../utils/errorNormalizer';

function* fetchThreadSaga({ payload: appointmentId }) {
  try {
    const res = yield call(fetchMessagesApi, appointmentId);
    yield put(fetchThreadSuccess({
      appointmentId,
      messages: res.data?.data || [],
    }));
  } catch (e) {
    yield put(fetchThreadFailure(normalizeError(e).message));
  }
}

function* sendMessageSaga({ payload: data }) {
  try {
    const res = yield call(sendMessageApi, data);
    yield put(sendMessageSuccess({
      appointmentId: data.appointment_id,
      messages:      res.data?.data || [],
    }));
  } catch (e) {
    yield put(sendMessageFailure(normalizeError(e).message));
  }
}

export default function* messagesSaga() {
  yield takeLatest(fetchThreadRequest.type, fetchThreadSaga);
  yield takeLatest(sendMessageRequest.type, sendMessageSaga);
}

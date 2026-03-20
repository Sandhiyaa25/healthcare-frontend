import { put, takeLatest, call } from 'redux-saga/effects';
import { fetchRequest, fetchSuccess, fetchFailure } from './calendarSlice';
import { fetchCalendarEventsApi } from '../../api/calendar.api';

function* fetchSaga(action) {
  try {
    const response = yield call(fetchCalendarEventsApi, action.payload);
    yield put(fetchSuccess(response.data));
  } catch (e) {
    yield put(fetchFailure(e.message));
  }
}

export default function* calendarSaga() {
  yield takeLatest(fetchRequest.type, fetchSaga);
}

import { call, put, takeLatest } from 'redux-saga/effects';
import { fetchCalendarEventsApi, fetchCalendarByDateApi } from '../../api/calendar.api';
import {
  fetchEventsRequest,    fetchEventsSuccess,    fetchEventsFailure,
  fetchDayEventsRequest, fetchDayEventsSuccess, fetchDayEventsFailure,
} from './calendarSlice';
import { normalizeError } from '../../utils/errorNormalizer';

function* fetchEventsSaga({ payload = {} }) {
  try {
    const { startDate, endDate, doctorId, status, month, year } = payload;
    const params = {
      start_date: startDate,
      end_date:   endDate,
    };
    if (doctorId) params.doctor_id = doctorId;
    if (status)   params.status    = status;

    const res    = yield call(fetchCalendarEventsApi, params);
    const raw    = res.data?.data;
    const events = Array.isArray(raw) ? raw : [];

    yield put(fetchEventsSuccess({ events, month, year }));
  } catch (e) {
    yield put(fetchEventsFailure(normalizeError(e).message));
  }
}

function* fetchDayEventsSaga({ payload }) {
  try {
    const { date, doctorId } = payload;
    const res    = yield call(fetchCalendarByDateApi, date, doctorId);
    const raw    = res.data?.data;
    const events = Array.isArray(raw) ? raw : [];
    yield put(fetchDayEventsSuccess(events));
  } catch (e) {
    yield put(fetchDayEventsFailure());
  }
}

export default function* calendarSaga() {
  yield takeLatest(fetchEventsRequest.type,    fetchEventsSaga);
  yield takeLatest(fetchDayEventsRequest.type, fetchDayEventsSaga);
}
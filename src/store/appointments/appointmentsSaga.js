import { put, takeLatest } from 'redux-saga/effects';
import { fetchRequest, fetchSuccess, fetchFailure } from './appointmentsSlice';
function* fetchSaga() {
  try { yield put(fetchSuccess([])); }
  catch(e) { yield put(fetchFailure(e.message)); }
}
export default function* appointmentsSaga() {
  yield takeLatest(fetchRequest.type, fetchSaga);
}

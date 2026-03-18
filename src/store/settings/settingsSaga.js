import { put, takeLatest } from 'redux-saga/effects';
import { fetchRequest, fetchSuccess, fetchFailure } from './settingsSlice';
function* fetchSaga() {
  try { yield put(fetchSuccess([])); }
  catch(e) { yield put(fetchFailure(e.message)); }
}
export default function* settingsSaga() {
  yield takeLatest(fetchRequest.type, fetchSaga);
}

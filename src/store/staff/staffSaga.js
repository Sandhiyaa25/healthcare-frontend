import { put, takeLatest } from 'redux-saga/effects';
import { fetchRequest, fetchSuccess, fetchFailure } from './staffSlice';
function* fetchSaga() {
  try { yield put(fetchSuccess([])); }
  catch(e) { yield put(fetchFailure(e.message)); }
}
export default function* staffSaga() {
  yield takeLatest(fetchRequest.type, fetchSaga);
}

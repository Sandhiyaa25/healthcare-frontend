import { put, takeLatest } from 'redux-saga/effects';
import { fetchRequest, fetchSuccess, fetchFailure } from './billingSlice';
function* fetchSaga() {
  try { yield put(fetchSuccess([])); }
  catch(e) { yield put(fetchFailure(e.message)); }
}
export default function* billingSaga() {
  yield takeLatest(fetchRequest.type, fetchSaga);
}

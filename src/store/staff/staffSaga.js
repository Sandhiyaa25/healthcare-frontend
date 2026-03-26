import { call, put, takeLatest } from 'redux-saga/effects';
import { fetchRequest, fetchSuccess, fetchFailure } from './staffSlice';
import axiosInstance from '../../api/axiosInstance';

function* fetchStaffSaga({ payload }) {
  try {
    const res = yield call([axiosInstance, axiosInstance.get], '/api/staff', { params: payload });
    yield put(fetchSuccess(res.data?.data ?? []));
  } catch (e) {
    yield put(fetchFailure(e?.response?.data?.message ?? e.message));
  }
}

export default function* staffSaga() {
  yield takeLatest(fetchRequest.type, fetchStaffSaga);
}

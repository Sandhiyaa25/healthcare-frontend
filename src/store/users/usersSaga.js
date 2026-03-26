import { call, put, takeLatest } from 'redux-saga/effects';
import { fetchRequest, fetchSuccess, fetchFailure } from './usersSlice';
import axiosInstance from '../../api/axiosInstance';

function* fetchUsersSaga({ payload }) {
  try {
    const res = yield call([axiosInstance, axiosInstance.get], '/api/users', { params: payload });
    yield put(fetchSuccess(res.data?.data ?? []));
  } catch (e) {
    yield put(fetchFailure(e?.response?.data?.message ?? e.message));
  }
}

export default function* usersSaga() {
  yield takeLatest(fetchRequest.type, fetchUsersSaga);
}

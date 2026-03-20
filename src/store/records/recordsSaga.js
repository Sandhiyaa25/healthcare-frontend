import { put, takeLatest, call } from 'redux-saga/effects';
import { fetchRequest, fetchSuccess, fetchFailure, createRequest, createSuccess, createFailure } from './recordsSlice';
import { fetchRecordsApi } from '../../api/records.api';

function* fetchSaga(action) {
    try {
        const response = yield call(fetchRecordsApi, action.payload);
        yield put(fetchSuccess(response.data));
    } catch (e) {
        yield put(fetchFailure(e.message));
    }
}

function* createSaga(action) {
    try {
        // With dummy data, we just put the payload direct into state
        yield put(createSuccess(action.payload));
    } catch (e) {
        yield put(createFailure(e.message));
    }
}

export default function* recordsSaga() {
    yield takeLatest(fetchRequest.type, fetchSaga);
    yield takeLatest(createRequest.type, createSaga);
}

import { call, put, takeLatest, all, select } from 'redux-saga/effects';
import { fetchDashboardApi } from '../../api/dashboard.api';
import { fetchAppointmentsApi } from '../../api/appointments.api';
import {
  fetchDashboardRequest,
  fetchDashboardSuccess,
  fetchDashboardFailure,
} from './dashboardSlice';
import { normalizeError } from '../../utils/errorNormalizer';

function* fetchDashboardSaga() {
  try {
    const role = yield select(
      (s) => s.auth.user?.role || s.auth.user?.role_slug
    );

    // Step 1 — Always fetch dashboard stats
    let dashData = {};
    try {
      const dashRes = yield call(fetchDashboardApi);
      dashData = dashRes.data?.data || {};
    } catch (dashErr) {
      // 403 means role not allowed — show empty, don't crash
      if (dashErr.response?.status === 403) {
        yield put(fetchDashboardSuccess({}));
        return;
      }
      yield put(fetchDashboardFailure(normalizeError(dashErr).message));
      return;
    }

    // Step 2 — Fetch recent appointments (only for roles that have access)
    const canSeeAppointments = [
      'admin', 'doctor', 'nurse', 'receptionist', 'patient',
    ].includes(role);

    let recentAppointments = [];

    if (canSeeAppointments) {
      try {
        const apptRes      = yield call(fetchAppointmentsApi, { page: 1, per_page: 5 });
        const apptData     = apptRes.data?.data;
        recentAppointments = Array.isArray(apptData)
          ? apptData
          : (apptData?.appointments || apptData?.data || []);
      } catch (apptErr) {
        // 422 = patient has no linked profile yet — just show empty list
        // 403 = no permission — show empty list
        // Never crash dashboard because of appointments failure
        recentAppointments = [];
      }
    }

    yield put(fetchDashboardSuccess({
      ...dashData,
      recent_appointments: recentAppointments,
    }));

  } catch (err) {
    // Safety net — never let dashboard saga crash the whole app
    yield put(fetchDashboardSuccess({}));
  }
}

export default function* dashboardSaga() {
  yield takeLatest(fetchDashboardRequest.type, fetchDashboardSaga);
}
import { put, takeLatest } from 'redux-saga/effects';
import { setTenantInfo } from './tenantSlice';
// Tenant is resolved in authSaga during login — this saga handles
// standalone tenant refresh if ever needed.
export default function* tenantSaga() {
  // yield takeLatest(...)
}
